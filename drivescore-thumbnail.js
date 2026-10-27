(()=>{
 const host=document.getElementById('qa-thumbnail-star'),area=document.querySelector('.qa-thumbnail'),text=area?.querySelector('.qa-thumbnail-text');if(!host||!area||!text)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let visible=false;
 const icon=window.lottie?.loadAnimation({container:host,renderer:'svg',loop:true,autoplay:false,path:'drivescore-assets/playground-assets/quote-agent-spin.json',rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});
 function fit(){const textWidth=text.getBoundingClientRect().width/(parseFloat(area.style.getPropertyValue('--qa-thumb-scale'))||.75);const total=textWidth+86;const left=(320-total)/2;text.style.left=(left+86)+'px';host.style.left=(left-6+108)+'px';area.style.setProperty('--qa-thumb-scale',String(Math.min(1.45,area.clientWidth*.78/total)));}
 function sync(){const stop=!visible||document.hidden||reduced.matches;area.classList.toggle('is-paused',stop);if(stop)icon?.pause();else icon?.play();}
 icon?.addEventListener('DOMLoaded',()=>{host.classList.add('is-ready');if(reduced.matches)icon.goToAndStop(180,true);sync();});
 new ResizeObserver(fit).observe(area);document.fonts.ready.then(fit);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(area);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',()=>{if(reduced.matches)icon?.goToAndStop(180,true);sync();});fit();sync();
})();