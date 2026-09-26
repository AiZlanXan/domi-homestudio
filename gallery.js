(() => {
  const carousel=document.querySelector('.work-carousel');
  const slides=[...carousel.querySelectorAll('.work-slide')];
  const count=carousel.querySelector('.work-count');
  let current=0;
  function show(next) {
    current=(next+slides.length)%slides.length;
    slides.forEach((slide,index)=>{
      slide.hidden=index!==current;
      slide.classList.remove('is-entering');
    });
    const active=slides[current];
    void active.offsetWidth;
    active.classList.add('is-entering');
    count.textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  }
  carousel.querySelector('.work-prev').addEventListener('click',()=>show(current-1));
  carousel.querySelector('.work-next').addEventListener('click',()=>show(current+1));
  carousel.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){e.preventDefault();show(current-1)}
    if(e.key==='ArrowRight'){e.preventDefault();show(current+1)}
  });
  let touchX=null;
  carousel.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});
  carousel.addEventListener('touchend',e=>{
    if(touchX===null)return;
    const delta=e.changedTouches[0].clientX-touchX;
    if(Math.abs(delta)>70)show(current+(delta<0?1:-1));
    touchX=null;
  },{passive:true});
})();
