const form=document.querySelector('#booking');
const dialog=document.querySelector('#summary');
const date=document.querySelector('#date');
const today=new Date();
date.min=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#project').value=button.dataset.project;document.querySelector('#contact').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;
    const values=new FormData(form);document.querySelector('#summary-text').textContent=`domi 手作预约意向（预览）\n项目：${values.get('project')}\n称呼：${values.get('name').trim()}\n意向日期：${values.get('date')}\n联系方式：${values.get('contact').trim()}\n想法：${values.get('message').trim()||'暂无补充'}\n\n此信息未发送，具体预约需与店铺确认。`;
    document.querySelector('#copy-status').textContent='';dialog.showModal();});


document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
document.querySelector('#edit-summary').addEventListener('click',()=>dialog.close());

dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});

document.querySelector('#copy-summary').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.querySelector('#summary-text').textContent);document.querySelector('#copy-status').textContent='已复制预约意向；尚未发送给店铺。';}catch{document.querySelector('#copy-status').textContent='当前浏览器不支持自动复制，请选中上方文字手动复制。';}});

const WEEKDAY_CN=['周日','周一','周二','周三','周四','周五','周六'];
const WEEKDAY_EN={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
const SLOT_CAPACITY=3;
const DEFAULT_SCHEDULE={
    timezone:'America/Toronto',
    hours:{weekday:{start:'19:00',end:'22:00'},weekend:{start:'10:00',end:'20:00'}},
    slotMinutes:60,
    slotCapacity:SLOT_CAPACITY,
    bookings:[
        {repeat:'weekly',weekday:1,start:'19:00'},
        {repeat:'weekly',weekday:2,start:'20:00'},
        {repeat:'weekly',weekday:4,start:'21:00'},
        {repeat:'weekly',weekday:5,start:'19:00'},
        {repeat:'weekly',weekday:6,start:'11:00'},
        {repeat:'weekly',weekday:6,start:'14:00'},
        {repeat:'weekly',weekday:6,start:'16:00'},
        {repeat:'weekly',weekday:0,start:'10:00'},
        {repeat:'weekly',weekday:0,start:'13:00'}
    ]
};

function parseHM(value){
    const [h,m]=String(value||'0:0').split(':').map(Number);
    return (h||0)*60+(m||0);
}
function formatHM(mins){
    const h=Math.floor(mins/60);
    const m=mins%60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}
function zonedParts(date,timeZone){
    const formatter=new Intl.DateTimeFormat('en-CA',{
        timeZone,
        year:'numeric',
        month:'2-digit',
        day:'2-digit',
        weekday:'short',
        hour:'2-digit',
        minute:'2-digit',
        hourCycle:'h23'
    });
    const parts={};
    for(const part of formatter.formatToParts(date)){
        if(part.type!=='literal') parts[part.type]=part.value;
    }
    return parts;
}
function todayISO(timeZone){
    const p=zonedParts(new Date(),timeZone);
    return `${p.year}-${p.month}-${p.day}`;
}
function addDaysISO(iso,days){
    const [y,m,d]=iso.split('-').map(Number);
    return new Date(Date.UTC(y,m-1,d+days)).toISOString().slice(0,10);
}
function weekdayFromISO(iso,timeZone){
    const p=zonedParts(new Date(`${iso}T12:00:00Z`),timeZone);
    return WEEKDAY_EN[p.weekday]??0;
}
function hoursForWeekday(hours,weekday){
    return (weekday===0||weekday===6)?hours.weekend:hours.weekday;
}
function slotsForRange(range,slotMinutes){
    const start=parseHM(range.start);
    const end=parseHM(range.end);
    const step=slotMinutes||60;
    const slots=[];
    for(let t=start;t+step<=end;t+=step) slots.push(formatHM(t));
    return slots;
}
function escapeText(value){
    return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function slotCapacityOf(config){
    const n=Number(config.slotCapacity);
    return Number.isInteger(n)&&n>0?n:SLOT_CAPACITY;
}
function peopleOf(item,cap){
    if(item.repeat==='weekly') return cap;
    const n=Number(item.people);
    return Number.isInteger(n)&&n>0?Math.min(cap,n):1;
}
function occupancyMap(bookings,days,weekdayMap,cap){
    const used=new Map();
    const add=(key,count)=>used.set(key,Math.min(cap,(used.get(key)||0)+count));
    for(const item of bookings||[]){
        if(item.date&&item.start) add(`${item.date}|${item.start}`,peopleOf(item,cap));
        if(item.repeat==='weekly'&&Number.isInteger(item.weekday)&&item.start){
            for(const date of days){
                if(weekdayMap[date]===item.weekday) add(`${date}|${item.start}`,cap);
            }
        }
    }
    return used;
}

function renderWeekBoard(config){
    const board=document.querySelector('#week-board');
    const summary=document.querySelector('#week-summary');
    if(!board) return;
    const tz=config.timezone||'America/Toronto';
    const hours=config.hours||DEFAULT_SCHEDULE.hours;
    const slotMinutes=config.slotMinutes||60;
    const today=todayISO(tz);
    const now=zonedParts(new Date(),tz);
    const nowMins=Number(now.hour)*60+Number(now.minute);
    const days=Array.from({length:7},(_,i)=>addDaysISO(today,i));
    const weekdayMap=Object.fromEntries(days.map(date=>[date,weekdayFromISO(date,tz)]));
    const cap=slotCapacityOf(config);
    const used=occupancyMap(config.bookings,days,weekdayMap,cap);
    let openCount=0;
    let bookedCount=0;
    const models=[];
    const panel=document.querySelector('#week-slot-panel');
    board.replaceChildren();
    days.forEach((date,index)=>{
        const weekday=weekdayMap[date];
        const range=hoursForWeekday(hours,weekday);
        const isToday=date===today;
        const isWeekend=weekday===0||weekday===6;
        const [,month,day]=date.split('-');
        const slots=slotsForRange(range,slotMinutes).map(start=>{
            const occupied=used.get(`${date}|${start}`)||0;
            const left=Math.max(0,cap-occupied);
            let state='open';
            let label=left===cap?'可约':`余${left}`;
            if(isToday&&parseHM(start)<=nowMins){state='past';label='已过';}
            else if(left===0){state='booked';label='已满';bookedCount+=1;}
            else {openCount+=1;}
            return {start,state,label};
        });
        const remaining=slots.filter(slot=>slot.state==='open').length;
        const countText=remaining?`还可约 ${remaining} 档`:'今日已满或已结束';
        const tabId=`week-tab-${date}`;
        const button=document.createElement('button');
        button.type='button';
        button.className=`week-day${isToday?' is-today':''}${isWeekend?' is-weekend':''}`;
        button.id=tabId;
        button.setAttribute('role','tab');
        button.setAttribute('aria-selected','false');
        button.setAttribute('aria-controls','week-slot-panel');
        button.tabIndex=-1;
        button.innerHTML=`<span class="week-day-head">
            <span class="week-day-name">${WEEKDAY_CN[weekday]}</span>
            <time datetime="${date}">${Number(month)}月${Number(day)}日</time>
            ${isToday?'<span class="week-day-flag">今天</span>':''}
        </span>
        <span class="week-day-hours">${isWeekend?'周末全天':'工作日晚间'} ${escapeText(range.start)}–${escapeText(range.end)}</span>
        <span class="week-day-count">${countText}</span>`;
        models.push({
            index,
            tabId,
            button,
            weekday,
            date,
            month,
            day,
            isToday,
            isWeekend,
            range,
            slots,
            countText
        });
        board.append(button);
    });
    if(models[0]) models[0].button.tabIndex=0;

    const showDay=day=>{
        models.forEach(model=>{
            const on=model===day;
            model.button.classList.toggle('is-selected',on);
            model.button.setAttribute('aria-selected',on?'true':'false');
            model.button.tabIndex=on||(!day&&model.index===0)?0:-1;
        });
        if(!panel) return;
        if(!day){
            panel.innerHTML='<p class="week-slot-empty">点选上面的某一天，查看当天时段。</p>';
            panel.removeAttribute('aria-labelledby');
            return;
        }
        panel.setAttribute('aria-labelledby',day.tabId);
        const heading=`${WEEKDAY_CN[day.weekday]} · ${Number(day.month)}月${Number(day.day)}日`;
        panel.innerHTML=`<div class="week-slot-head">
            <h3>${heading}${day.isToday?' <span>今天</span>':''}</h3>
            <p>${day.isWeekend?'周末全天':'工作日晚间'} ${escapeText(day.range.start)}–${escapeText(day.range.end)} · ${day.countText}</p>
        </div>
        <ul class="week-slots">${day.slots.map(slot=>`<li><span class="slot ${slot.state}"><span class="slot-time">${slot.start}</span><span class="slot-state">${slot.label}</span></span></li>`).join('')}</ul>`;
    };

    board.addEventListener('click',event=>{
        const button=event.target.closest('.week-day');
        if(!button||!board.contains(button)) return;
        const day=models.find(model=>model.button===button);
        if(!day) return;
        showDay(button.getAttribute('aria-selected')==='true'?null:day);
    });
    board.addEventListener('keydown',event=>{
        const keys={ArrowRight:1,ArrowLeft:-1,Home:'home',End:'end'};
        if(!(event.key in keys)) return;
        const current=models.findIndex(model=>model.button===document.activeElement);
        if(current<0) return;
        event.preventDefault();
        let next=current;
        if(event.key==='Home') next=0;
        else if(event.key==='End') next=models.length-1;
        else next=(current+keys[event.key]+models.length)%models.length;
        models[next].button.focus();
        showDay(models[next]);
    });
    showDay(null);
    if(summary){
        summary.textContent=`Ottawa 时间 ${now.hour}:${now.minute} · 未来七天还可约 ${openCount} 档，演示占用 ${bookedCount} 档`;
    }
}

async function loadWeekBoard(){
    const board=document.querySelector('#week-board');
    if(!board) return;
    try{
        const response=await fetch('bookings.json',{cache:'no-store'});
        if(!response.ok) throw new Error(String(response.status));
        const data=await response.json();
        renderWeekBoard({...DEFAULT_SCHEDULE,...data,hours:data.hours||DEFAULT_SCHEDULE.hours,bookings:data.bookings||[]});
    }catch{
        renderWeekBoard(DEFAULT_SCHEDULE);
        const summary=document.querySelector('#week-summary');
        if(summary) summary.textContent=`${summary.textContent}（未能读取 bookings.json，已用内置演示占用）`;
    }
}

loadWeekBoard();
