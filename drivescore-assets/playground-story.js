(()=>{
 const toggle=document.getElementById('smart-toggle'),section=document.getElementById('smart-adjustments');if(!toggle||!section)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let entered=false,interacted=false,timer=0;
 function set(on){toggle.setAttribute('aria-checked',String(on));document.getElementById('smart-state').textContent=on?'A small change. A new possibility.':'Your details. Your decision.';}
 set(false);
 toggle.addEventListener('click',()=>{interacted=true;clearTimeout(timer);set(toggle.getAttribute('aria-checked')!=='true');});
 const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting||entered)return;entered=true;observer.unobserve(section);if(!interacted){if(reduced.matches)set(true);else timer=setTimeout(()=>set(true),400);}},{threshold:.2});observer.observe(section);
})();
