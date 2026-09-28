
(()=>{
 document.documentElement.style.setProperty('--leaf-sheet','url("leaves.png")');
 const season=document.querySelector('.season');
 season.addEventListener('click',()=>{
   const autumn=document.body.classList.toggle('autumn');
   season.setAttribute('aria-pressed',String(autumn));
   season.setAttribute('aria-label',autumn?'Switch to green leaves':'Switch to autumn leaves');
 });
 const dialog=document.querySelector('.image-dialog'),image=dialog.querySelector('img');
 let opener;
 document.querySelectorAll('.image-expand').forEach(button=>button.addEventListener('click',()=>{
   opener=button;const source=button.querySelector('img');image.src=source.src;image.alt=source.alt;dialog.showModal();
 }));
 dialog.querySelector('button').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
 const links=[...document.querySelectorAll('.contents nav a')];
 const observer=new IntersectionObserver(entries=>{
   const active=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
   if(!active)return;
   links.forEach(a=>{if(a.hash==='#'+active.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
 },{rootMargin:'-90px 0px -55% 0px'});
 document.querySelectorAll('.case-body h2,.impact-section h2').forEach(h=>observer.observe(h));
 document.querySelectorAll('.mobile-contents a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.mobile-contents').open=false));
})();
