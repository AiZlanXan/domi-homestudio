const WEEKDAY_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const form = document.querySelector('#admin-form');
const dateInput = document.querySelector('#admin-date');
const peopleSelect = document.querySelector('#admin-people');
const startSelect = document.querySelector('#admin-start');
const statusEl = document.querySelector('#admin-form-status');
const listEl = document.querySelector('#admin-list');
const countEl = document.querySelector('#admin-list-count');

function todayISO() {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Toronto',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(new Date());
    const map = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
    return `${map.year}-${map.month}-${map.day}`;
}

function formatDay(iso) {
    const [year, month, day] = iso.split('-').map(Number);
    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    return `${WEEKDAY_CN[weekday]} ${month}月${day}日`;
}

function escapeText(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[ch]));
}

async function readJson(response) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || `请求失败（${response.status}）`);
    }
    return data;
}

function setStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.classList.toggle('is-error', Boolean(isError));
}

async function loadSlots() {
    const iso = dateInput.value;
    startSelect.innerHTML = '<option value="">加载时段…</option>';
    startSelect.disabled = true;
    if (!iso) {
        startSelect.innerHTML = '<option value="">先选日期</option>';
        return;
    }
    try {
        const data = await readJson(await fetch(`/api/slots?date=${encodeURIComponent(iso)}`, { cache: 'no-store' }));
        const need = Number(peopleSelect.value) || 1;
        const open = data.slots.filter((slot) => (slot.remaining || 0) >= need);
        if (!open.length) {
            startSelect.innerHTML = '<option value="">这一天已满，或剩的名额不够这档人数</option>';
            return;
        }
        startSelect.innerHTML = '<option value="">选择时段</option>' + open.map((slot) => {
            const left = slot.remaining;
            const label = left === slot.capacity ? `${slot.start} · 空着` : `${slot.start} · 余 ${left} 人`;
            return `<option value="${slot.start}">${label}</option>`;
        }).join('');
        startSelect.disabled = false;
    } catch (error) {
        startSelect.innerHTML = '<option value="">无法读取时段</option>';
        setStatus(error.message, true);
    }
}

function renderList(data) {
    const oneOff = (data.bookings || []).filter((item) => item.date && item.start);
    oneOff.sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
    countEl.textContent = oneOff.length ? `${oneOff.length} 条` : '暂无';

    if (!oneOff.length) {
        listEl.innerHTML = '<p class="week-slot-empty">还没有具体日期的预约。登记一档后，前台对应时段会变成已约。</p>';
        return;
    }
    listEl.innerHTML = oneOff.map((item) => `
            <article class="admin-row">
                <div>
                    <strong>${escapeText(formatDay(item.date))} ${escapeText(item.start)}</strong>
                    <p>${escapeText(item.name || '未署名')} · ${escapeText(item.project || '未选项目')} · ${Number(item.people) || 1} 人</p>
                    ${item.note ? `<p class="admin-note">${escapeText(item.note)}</p>` : ''}
                </div>
                <button type="button" class="text-link" data-cancel="${escapeText(item.id)}">取消这档</button>
            </article>
        `).join('');
}

async function loadBookings() {
    const data = await readJson(await fetch('/api/bookings', { cache: 'no-store' }));
    renderList(data);
    return data;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const payload = {
        date: dateInput.value,
        start: startSelect.value,
        people: Number(peopleSelect.value) || 1,
        name: document.querySelector('#admin-name').value.trim(),
        project: document.querySelector('#admin-project').value,
        note: document.querySelector('#admin-note').value.trim()
    };
    setStatus('正在写入…');
    try {
        await readJson(await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }));
        form.reset();
        dateInput.min = todayISO();
        dateInput.value = payload.date;
        await loadBookings();
        await loadSlots();
        peopleSelect.value = '1';
        setStatus(`已写入 ${payload.date} ${payload.start}，${payload.people} 人。前台刷新周历即可看到占用。`);
    } catch (error) {
        setStatus(error.message, true);
    }
});

listEl.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-cancel]');
    if (!button) return;
    const id = button.getAttribute('data-cancel');
    if (!id) return;
    if (!window.confirm('取消这档预约？前台对应时段会重新变为可约。')) return;
    setStatus('正在取消…');
    try {
        await readJson(await fetch(`/api/bookings?id=${encodeURIComponent(id)}`, { method: 'DELETE' }));
        await loadBookings();
        await loadSlots();
        setStatus('已取消这档预约。');
    } catch (error) {
        setStatus(error.message, true);
    }
});

dateInput.min = todayISO();
dateInput.value = todayISO();
dateInput.addEventListener('change', loadSlots);
peopleSelect.addEventListener('change', loadSlots);

(async () => {
    try {
        await loadBookings();
        await loadSlots();
        setStatus('');
    } catch (error) {
        setStatus(error.message || '后台接口不可用。请用 python server.py 启动，而不是普通静态服务。', true);
        listEl.innerHTML = '<p class="week-slot-empty">无法读取预约。请确认本地服务已启动。</p>';
    }
})();
