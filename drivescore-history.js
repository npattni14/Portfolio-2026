(()=>{
const root=document.querySelector('#design-history');if(!root)return;
const groups=[{"name": "Benefits", "stages": [["benefits-v1.png", "V1"], ["benefits-v2.png", "V2"], ["benefits-v3.png", "V3"]]}, {"name": "Suggestions", "stages": [["suggestions-v1.png", "V1"], ["suggestions-v2.png", "V2"], ["suggestions-v3.png", "V3"]]}, {"name": "Loading", "stages": [["loading-v1.png", "V1"], ["loading-v2.png", "V2"], ["loading-v3-updated.mp4", "V3"]]}, {"name": "Success", "stages": [["success-v1.png", "V1"], ["success-v2.png", "V2"], ["success-v3.png", "V3"]]}];
const features=root.querySelector('#history-features'),rail=root.querySelector('#history-stages'),stack=root.querySelector('#history-stack'),timeline=root.querySelector('.history-timeline');
let selected=0,index=0,last=0;const positions=groups.map(()=>0);
function choose(n){index=n;positions[selected]=n;render();}
function move(delta){const next=Math.max(0,Math.min(groups[selected].stages.length-1,index+delta));if(next===index)return false;choose(next);return true;}
groups.forEach((g,n)=>{const b=document.createElement('button');b.type='button';b.textContent=g.name;b.addEventListener('click',()=>{selected=n;index=positions[n];render();});features.append(b);});
function render(){
 const restoreFocus=[...rail.children].includes(document.activeElement);
 const g=groups[selected];[...features.children].forEach((b,n)=>b.setAttribute('aria-pressed',String(n===selected)));
 rail.replaceChildren();g.stages.forEach((s,n)=>{const b=document.createElement('button');b.type='button';b.textContent=s[1];b.setAttribute('aria-pressed',String(n===index));b.addEventListener('click',()=>choose(n));rail.append(b);});
 [...stack.querySelectorAll('video')].forEach(video=>video.pause());
 stack.replaceChildren();
 // Keep inactive versions behind the selected screen; only its video plays.
 g.stages.forEach((s,n)=>{const offset=n-index;const phone=document.createElement('div');phone.className='history-phone';phone.dataset.offset=String(offset);phone.style.setProperty('--depth',Math.abs(offset));phone.style.setProperty('--direction',offset<0?-1:1);phone.setAttribute('aria-hidden',String(offset!==0));
 const viewport=document.createElement('div');viewport.className='history-phone-screen';
 const isVideo=s[0].endsWith('.mp4'),media=document.createElement(isVideo?'video':'img');
 media.className='history-screen-media';media.src=''+s[0];
 if(isVideo){
  media.muted=true;media.loop=true;media.playsInline=true;media.controls=offset===0;media.preload=offset===0?'auto':'metadata';
  media.setAttribute('aria-label',g.name+' '+s[1]+' animation');
  media.tabIndex=offset===0?0:-1;
  if(offset===0&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)media.autoplay=true;
 }else{media.alt=g.name+' '+s[1];media.decoding='async';}
 viewport.append(media);phone.append(viewport);stack.append(phone);
 });
 const label=g.name+' · '+g.stages[index][1]+' · '+(index+1)+' / '+g.stages.length;
 root.querySelector('#history-count').textContent=label;root.querySelector('#history-announcement').textContent=label;
 root.querySelector('#history-previous').disabled=index===0;root.querySelector('#history-next').disabled=index===g.stages.length-1;
 if(restoreFocus)rail.children[index].focus({preventScroll:true});
}
root.querySelector('#history-previous').addEventListener('click',()=>move(-1));root.querySelector('#history-next').addEventListener('click',()=>move(1));
timeline.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)<4)return;const direction=Math.sign(e.deltaY);if((direction<0&&index===0)||(direction>0&&index===groups[selected].stages.length-1))return;e.preventDefault();if(Date.now()-last<280)return;last=Date.now();move(direction);},{passive:false});
timeline.addEventListener('keydown',e=>{if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();if(e.key==='Home')choose(0);else if(e.key==='End')choose(groups[selected].stages.length-1);else move(['ArrowDown','ArrowRight'].includes(e.key)?1:-1);}});
render();
})();