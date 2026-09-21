#!/usr/bin/env python3
"""Fail if DESIGN.md is newer than the Impeccable sidecar."""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
DESIGN = ROOT / "DESIGN.md"
SIDECAR = ROOT / ".impeccable" / "design.json"


def main() -> int:
    if not DESIGN.exists():
        print("DESIGN.md is missing.", file=sys.stderr)
        return 1
    if not SIDECAR.exists():
        print(".impeccable/design.json is missing. Refresh the sidecar from DESIGN.md.", file=sys.stderr)
        return 1
    if DESIGN.stat().st_mtime > SIDECAR.stat().st_mtime + 1:
        print(
            "DESIGN.md is newer than .impeccable/design.json. "
            "Refresh the sidecar before continuing.",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
