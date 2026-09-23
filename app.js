/*
DOMI CRAFT - BOOKING FORM JS
================================================================
01 DOM REFERENCES       页面元素
02 DATE LIMIT           日期限制
03 PROJECT SELECTION    项目选择
04 FORM PREVIEW         表单预览
05 DIALOG CONTROLS      弹窗控制
06 COPY SUMMARY         复制预约信息
================================================================
*/


/* ============================================================
   01. DOM REFERENCES / 页面元素
   ============================================================ */

const form = document.querySelector('#booking');
const dialog = document.querySelector('#summary');
const date = document.querySelector('#date');



/* ============================================================
   02. DATE LIMIT / 日期限制
   ============================================================ */

// 获取今天日期
const today = new Date();

// 格式：YYYY-MM-DD
const todayString =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, '0')}-` +
    `${String(today.getDate()).padStart(2, '0')}`;

// 不允许选择今天以前的日期
date.min = todayString;



/* ============================================================
   03. PROJECT SELECTION / 项目选择
   ============================================================ */

// 点击首页项目卡片时：
// 1. 自动选择对应项目
// 2. 滚动到预约表单
document.querySelectorAll('[data-project]').forEach(button => {

    button.addEventListener('click', () => {

        const projectInput =
            document.querySelector('#project');

        const contactSection =
            document.querySelector('#contact');


        // 自动填入项目
        projectInput.value =
            button.dataset.project;


        // 如果用户开启了“减少动画”，则取消平滑滚动
        const scrollBehavior =
            matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches
                ? 'auto'
                : 'smooth';


        // 滚动到预约区域
        contactSection.scrollIntoView({
            behavior: scrollBehavior
        });
    });

});



/* ============================================================
   04. FORM PREVIEW / 表单预览
   ============================================================ */

// 提交预约表单
form.addEventListener('submit', event => {

    // 阻止网页真正提交 / 刷新
    event.preventDefault();


    // 检查 required 等表单验证
    if (!form.reportValidity()) {
        return;
    }


    // 读取表单内容
    const values =
        new FormData(form);


    const project =
        values.get('project');

    const name =
        values.get('name').trim();

    const bookingDate =
        values.get('date');

    const contact =
        values.get('contact').trim();

    const message =
        values.get('message').trim() ||
        '暂无补充';


    // 生成预约预览文字
    const summaryText =
`domi 手作预约意向（预览）

项目：${project}
称呼：${name}
意向日期：${bookingDate}
联系方式：${contact}
想法：${message}

此信息未发送，具体预约需与店铺确认。`;


    // 显示预约内容
    document.querySelector(
        '#summary-text'
    ).textContent = summaryText;


    // 清除上次的复制提示
    document.querySelector(
        '#copy-status'
    ).textContent = '';


    // 打开预约预览弹窗
    dialog.showModal();

});



/* ============================================================
   05. DIALOG CONTROLS / 弹窗控制
   ============================================================ */

// 点击 × 关闭弹窗
document.querySelector(
    '#close-dialog'
).addEventListener('click', () => {

    dialog.close();

});



// 点击“返回修改”
document.querySelector(
    '#edit-summary'
).addEventListener('click', () => {

    dialog.close();

});



// 点击弹窗外部区域关闭
dialog.addEventListener('click', event => {

    // 只有点击 dialog 本身才继续判断
    if (event.target !== dialog) {
        return;
    }


    // 获取弹窗实际位置
    const rect =
        dialog.getBoundingClientRect();


    // 判断点击位置是否在弹窗外
    const clickedOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;


    if (clickedOutside) {
        dialog.close();
    }

});



/* ============================================================
   06. COPY SUMMARY / 复制预约信息
   ============================================================ */

document.querySelector(
    '#copy-summary'
).addEventListener('click', async () => {

    const copyStatus =
        document.querySelector(
            '#copy-status'
        );

    const summaryText =
        document.querySelector(
            '#summary-text'
        ).textContent;


    try {

        // 写入剪贴板
        await navigator.clipboard.writeText(
            summaryText
        );


        // 成功提示
        copyStatus.textContent =
            '已复制预约意向；尚未发送给店铺。';

    } catch {

        // 浏览器不支持时提示手动复制
        copyStatus.textContent =
            '当前浏览器不支持自动复制，请选中上方文字手动复制。';

    }

});

/* ============================================================
   06. SHOWS AVALIABLE TIME / 展示可用时间
   ============================================================ */


document.querySelectorAll('.date-label').forEach(label => {

    const targetDay = Number(label.dataset.day);
    const currentDay = today.getDay();

    let diff = targetDay - currentDay;

    if (diff < 0) {
        diff += 7;
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();

    label.textContent = `${month}/${day}`;

    // 根据距离今天的天数改变颜色
    if (diff <= 2) {
        label.classList.add('date-near');
    } else {
        label.classList.add('date-far');
    }
});