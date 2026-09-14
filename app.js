 const form=document.querySelector('#booking');
const dialog=document.querySelector('#summary');
const date=document.querySelector('#date');
const today=new Date();
date.min=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#project').value=button.dataset.project;document.querySelector('#contact').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const values=new FormData(form);document.querySelector('#summary-text').textContent=`domi 手作预约意向（预览）\n项目：${values.get('project')}\n称呼：${values.get('name').trim()}\n意向日期：${values.get('date')}\n联系方式：${values.get('contact').trim()}\n想法：${values.get('message').trim()||'暂无补充'}\n\n此信息未发送，具体预约需与店铺确认。`;document.querySelector('#copy-status').textContent='';dialog.showModal();});


document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
document.querySelector('#edit-summary').addEventListener('click',()=>dialog.close());

dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});

document.querySelector('#copy-summary').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.querySelector('#summary-text').textContent);document.querySelector('#copy-status').textContent='已复制预约意向；尚未发送给店铺。';}catch{document.querySelector('#copy-status').textContent='当前浏览器不支持自动复制，请选中上方文字手动复制。';}});
