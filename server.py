#!/usr/bin/env python3
"""Local studio desk: static files plus a tiny bookings API."""

from __future__ import annotations

import argparse
import json
import os
import posixpath
import re
import tempfile
import uuid
from datetime import date, datetime
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, unquote, urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
BOOKINGS_PATH = os.path.join(ROOT, "bookings.json")
PROJECTS = ("拼豆", "美甲", "热缩片手绘", "想先聊聊")
SLOT_CAPACITY = 3
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TIME_RE = re.compile(r"^\d{2}:\d{2}$")
ID_RE = re.compile(r"^[A-Za-z0-9_-]{1,40}$")


def load_bookings() -> dict:
    with open(BOOKINGS_PATH, encoding="utf-8") as handle:
        data = json.load(handle)
    changed = False
    if not data.get("slotCapacity"):
        data["slotCapacity"] = SLOT_CAPACITY
        changed = True
    bookings = data.setdefault("bookings", [])
    for item in bookings:
        if not item.get("id"):
            item["id"] = new_id()
            changed = True
    if changed:
        save_bookings(data)
    return data


def save_bookings(data: dict) -> None:
    payload = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    fd, tmp = tempfile.mkstemp(prefix="bookings-", suffix=".json", dir=ROOT)
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(payload)
        os.replace(tmp, BOOKINGS_PATH)
    except Exception:
        if os.path.exists(tmp):
            os.remove(tmp)
        raise


def new_id() -> str:
    return "bk_" + uuid.uuid4().hex[:10]


def parse_hm(value: str) -> int:
    hour, minute = value.split(":")
    return int(hour) * 60 + int(minute)


def format_hm(mins: int) -> str:
    return f"{mins // 60:02d}:{mins % 60:02d}"


def js_weekday(iso: str) -> int:
    return (date.fromisoformat(iso).weekday() + 1) % 7


def hours_for_weekday(data: dict, weekday: int) -> dict:
    hours = data.get("hours") or {}
    key = "weekend" if weekday in (0, 6) else "weekday"
    return hours.get(key) or {"start": "19:00", "end": "22:00"}


def slot_starts(data: dict, iso: str) -> list[str]:
    rng = hours_for_weekday(data, js_weekday(iso))
    step = int(data.get("slotMinutes") or 60)
    start = parse_hm(rng["start"])
    end = parse_hm(rng["end"])
    slots = []
    cursor = start
    while cursor + step <= end:
        slots.append(format_hm(cursor))
        cursor += step
    return slots


def capacity(data: dict) -> int:
    try:
        value = int(data.get("slotCapacity") or SLOT_CAPACITY)
    except (TypeError, ValueError):
        value = SLOT_CAPACITY
    return max(1, value)


def people_of(item: dict, cap: int) -> int:
    if item.get("repeat") == "weekly":
        return cap
    try:
        value = int(item.get("people") or 1)
    except (TypeError, ValueError):
        value = 1
    return max(1, min(cap, value))


def occupied(data: dict, iso: str, start: str, ignore_id: str | None = None) -> int:
    cap = capacity(data)
    weekday = js_weekday(iso)
    used = 0
    for item in data.get("bookings") or []:
        if ignore_id and item.get("id") == ignore_id:
            continue
        if item.get("repeat") == "weekly" and item.get("weekday") == weekday and item.get("start") == start:
            return cap
        if item.get("date") == iso and item.get("start") == start:
            used += people_of(item, cap)
    return min(used, cap)


def remaining(data: dict, iso: str, start: str) -> int:
    return max(0, capacity(data) - occupied(data, iso, start))


def json_bytes(payload: dict, status: int = 200):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    return status, "application/json; charset=utf-8", body


def parse_booking(raw: dict, data: dict) -> tuple[dict | None, str | None]:
    iso = str(raw.get("date") or "").strip()
    start = str(raw.get("start") or "").strip()
    name = str(raw.get("name") or "").strip()
    project = str(raw.get("project") or "").strip()
    note = str(raw.get("note") or "").strip()
    try:
        people = int(raw.get("people"))
    except (TypeError, ValueError):
        return None, "请填写人数（1–3 人）。"
    cap = capacity(data)
    if not DATE_RE.match(iso):
        return None, "请选择有效日期。"
    try:
        date.fromisoformat(iso)
    except ValueError:
        return None, "请选择有效日期。"
    if start not in slot_starts(data, iso):
        return None, "这一天没有这个营业时段。"
    if not name or len(name) > 30:
        return None, "请填写称呼（30 字以内）。"
    if project not in PROJECTS:
        return None, "请选择项目。"
    if len(note) > 500:
        return None, "备注请控制在 500 字以内。"
    if people < 1 or people > cap:
        return None, f"每档最多 {cap} 人。"
    left = remaining(data, iso, start)
    if left <= 0:
        return None, "该时段已经满了。"
    if people > left:
        return None, f"该时段只剩 {left} 个名额。"
    return {
        "id": new_id(),
        "date": iso,
        "start": start,
        "people": people,
        "name": name,
        "project": project,
        "note": note,
        "createdAt": datetime.now().astimezone().isoformat(timespec="seconds"),
    }, None


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        sys_stderr = __import__("sys").stderr
        sys_stderr.write("%s - %s\n" % (self.log_date_time_string(), fmt % args))

    def _send(self, status: int, content_type: str, body: bytes) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self) -> tuple[dict | None, str | None]:
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > 32_000:
            return None, "请求内容无效。"
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            return None, "请求格式无效。"
        if not isinstance(payload, dict):
            return None, "请求格式无效。"
        return payload, None

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        if path in ("/admin", "/admin/"):
            self.path = "/admin.html"
            return super().do_GET()
        if path == "/api/bookings":
            try:
                status, ctype, body = json_bytes(load_bookings())
            except OSError:
                status, ctype, body = json_bytes({"error": "无法读取预约文件。"}, 500)
            return self._send(status, ctype, body)
        if path == "/api/slots":
            iso = (parse_qs(parsed.query).get("date") or [""])[0]
            if not DATE_RE.match(iso):
                return self._send(*json_bytes({"error": "请选择有效日期。"}, 400))
            try:
                date.fromisoformat(iso)
                data = load_bookings()
            except (ValueError, OSError):
                return self._send(*json_bytes({"error": "无法读取预约文件。"}, 400))
            cap = capacity(data)
            slots = []
            for start in slot_starts(data, iso):
                used = occupied(data, iso, start)
                left = max(0, cap - used)
                slots.append({
                    "start": start,
                    "taken": left == 0,
                    "occupied": used,
                    "remaining": left,
                    "capacity": cap,
                })
            return self._send(*json_bytes({"date": iso, "capacity": cap, "slots": slots}))
        safe = posixpath.normpath(path).lstrip("/")
        if safe.startswith("..") or os.path.isabs(safe):
            return self._send(*json_bytes({"error": "Not found."}, 404))
        return super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if unquote(parsed.path) != "/api/bookings":
            return self._send(*json_bytes({"error": "Not found."}, 404))
        raw, error = self._read_json()
        if error:
            return self._send(*json_bytes({"error": error}, 400))
        try:
            data = load_bookings()
            booking, error = parse_booking(raw, data)
            if error:
                status = HTTPStatus.CONFLICT if ("满" in error or "名额" in error) else HTTPStatus.BAD_REQUEST
                return self._send(*json_bytes({"error": error}, int(status)))
            data["bookings"].append(booking)
            save_bookings(data)
        except OSError:
            return self._send(*json_bytes({"error": "无法保存预约。"}, 500))
        return self._send(*json_bytes({"ok": True, "booking": booking}))

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        if unquote(parsed.path) != "/api/bookings":
            return self._send(*json_bytes({"error": "Not found."}, 404))
        booking_id = (parse_qs(parsed.query).get("id") or [""])[0]
        if not ID_RE.match(booking_id):
            return self._send(*json_bytes({"error": "找不到这条预约。"}, 400))
        try:
            data = load_bookings()
            before = len(data["bookings"])
            kept = []
            removed = None
            for item in data["bookings"]:
                if item.get("id") == booking_id and item.get("date"):
                    removed = item
                    continue
                kept.append(item)
            if removed is None or len(kept) == before:
                return self._send(*json_bytes({"error": "只能取消具体日期的预约。"}, 400))
            data["bookings"] = kept
            save_bookings(data)
        except OSError:
            return self._send(*json_bytes({"error": "无法保存预约。"}, 500))
        return self._send(*json_bytes({"ok": True, "id": booking_id}))


def main() -> None:
    parser = argparse.ArgumentParser(description="domi homestudio local studio desk")
    parser.add_argument("--port", type=int, default=5172)
    parser.add_argument("--bind", default="127.0.0.1")
    args = parser.parse_args()
    os.chdir(ROOT)
    server = ThreadingHTTPServer((args.bind, args.port), Handler)
    print(f"Serving HTTP on {args.bind} port {args.port} (http://{args.bind}:{args.port}/) ...")
    print(f"Studio desk: http://{args.bind}:{args.port}/admin")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
