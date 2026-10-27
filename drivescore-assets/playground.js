(()=>{
  const host=document.getElementById('playground-agent');
  const toggle=document.getElementById('playground-motion-toggle');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(host&&window.lottie){
    const animation=lottie.loadAnimation({container:host,renderer:'svg',loop:true,autoplay:false,path:'drivescore-assets/playground-assets/quote-agent-spin.json',rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});
    let paused=reduced.matches;
    const sync=()=>{toggle.setAttribute('aria-label',paused?'Play animation':'Pause animation');toggle.title=paused?'Play animation':'Pause animation';toggle.setAttribute('aria-pressed',String(paused));};
    animation.addEventListener('DOMLoaded',()=>{host.classList.add('is-ready');if(paused)animation.goToAndStop(180,true);sync();});
    const visibility=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!paused)animation.play();else animation.pause();},{threshold:.1});
    visibility.observe(host);
    toggle.addEventListener('click',()=>{paused=!paused;if(paused)animation.pause();else animation.play();sync();});
    reduced.addEventListener('change',event=>{paused=event.matches;if(paused)animation.pause();else animation.play();sync();});
    animation.addEventListener('data_failed',()=>{toggle.hidden=true;});
  }else if(toggle){toggle.hidden=true;}
  const frame=document.querySelector('.confetti-demo iframe');
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==frame?.contentWindow||event.data?.type!=='playground-confetti-height')return;
    const height=Number(event.data.height);
    if(Number.isFinite(height)&&height>100&&height<2400)frame.style.height=Math.ceil(height)+'px';
  });
})();
