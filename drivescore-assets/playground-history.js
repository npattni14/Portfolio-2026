(()=>{
 const root=document.getElementById('design-history');if(!root)return;
 const groups=[
  {name:'Benefits',icon:'stars',copy:'Set expectations before asking for a decision. Each version makes the benefit, the process and the driver’s control clearer.',files:['drivescore-assets/benefits-v1.png','drivescore-assets/benefits-v2.png','drivescore-assets/benefits-v3.png']},
  {name:'Suggestions',icon:'sliders',copy:'One suggestion. One clear choice. Keep the reason, the current details and the proposed change together.',files:['drivescore-assets/suggestions-v1.png','drivescore-assets/suggestions-v2.png','drivescore-assets/suggestions-v3.png']},
  {name:'Loading',icon:'arrow-repeat',copy:'Make the work visible. Progress develops from a generic wait into specific checks and a recognisable animated personality.',files:['drivescore-assets/loading-v1.png','drivescore-assets/loading-v2.png','drivescore-assets/loading-v3-updated.mp4']},
  {name:'Success',icon:'check-circle',copy:'Lead with the difference. Bring the saving, the updated price and the comparison into one meaningful moment.',files:['drivescore-assets/success-v1.png','drivescore-assets/success-v2.png','drivescore-assets/success-v3.png']}
 ];
 const features=root.querySelector('#history-features'),phone=root.querySelector('#history-phone'),progress=root.querySelector('#history-progress'),toggle=root.querySelector('#history-playback'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let selected=0,index=0,time=0,last=0,raf=0,visible=false,paused=reduced.matches;
 const duration=6000;
 groups.forEach((g,n)=>{
  const item=document.createElement('div');item.className='history-disclosure';
  const button=document.createElement('button');button.type='button';button.className='history-feature';button.id='history-feature-'+n;button.setAttribute('aria-controls','history-description-'+n);
  const icon=document.createElement('img');icon.src='drivescore-assets/ui-icons/'+g.icon+'.svg';icon.alt='';icon.width=22;icon.height=22;
  const name=document.createElement('span');name.className='history-feature-title';name.textContent=g.name;button.setAttribute('aria-label',g.name);
  const description=document.createElement('span');description.id='history-description-'+n;description.className='history-feature-description';description.textContent=' '+g.copy;button.append(icon,name,description);item.append(button);features.append(item);
  button.addEventListener('click',()=>{selected=n;index=0;time=0;render(true);});
 });
 const measurePills=()=>{features.style.setProperty('--expanded-width',features.getBoundingClientRect().width+'px');[...features.children].forEach(item=>{const title=item.querySelector('.history-feature-title');item.style.setProperty('--pill-width',Math.ceil(title.getBoundingClientRect().width)+76+'px');if(item.classList.contains('is-selected'))item.style.setProperty('--panel-height',item.querySelector('button').scrollHeight+2+'px');});};
 document.fonts.ready.then(measurePills);window.addEventListener('resize',measurePills);measurePills();
 const tracks=Array.from({length:3},(_,n)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show version '+(n+1));b.innerHTML='<span>V'+(n+1)+'</span><span class="history-track" aria-hidden="true"><i></i></span>';b.addEventListener('click',()=>{index=n;time=0;render(true);});progress.append(b);return b;});
 function render(announce=false){
  const g=groups[selected];root.dataset.feature=g.name.toLowerCase();root.dataset.version=String(index+1);
  [...features.children].forEach((item,n)=>{item.classList.toggle('is-selected',n===selected);item.querySelector('button').setAttribute('aria-expanded',String(n===selected));item.querySelector('.history-feature-description').setAttribute('aria-hidden',String(n!==selected));item.querySelector('.history-feature-description').inert=n!==selected;if(n===selected){item.querySelector('button').setAttribute('aria-describedby','history-description-'+n);item.style.setProperty('--panel-height',item.querySelector('button').scrollHeight+2+'px');}else item.querySelector('button').removeAttribute('aria-describedby');});
  phone.querySelectorAll('video').forEach(v=>v.pause());
  const old=[...phone.children];const src=g.files[index],video=src.endsWith('.mp4'),media=document.createElement(video?'video':'img');media.className='history-current-screen';media.src=src;
  if(video){media.muted=true;media.loop=true;media.playsInline=true;media.preload='auto';media.setAttribute('aria-label',g.name+' version '+(index+1)+' animation');if(!paused&&visible)media.play().catch(()=>{});}else{media.alt=g.name+' version '+(index+1);media.decoding='async';}
  phone.append(media);const reveal=()=>{media.classList.add('is-visible');old.forEach(el=>el.classList.remove('is-visible'));setTimeout(()=>old.forEach(el=>el.remove()),650);};if(video)media.addEventListener('loadeddata',reveal,{once:true});else{media.addEventListener('load',reveal,{once:true});if(media.complete)reveal();}media.addEventListener('error',()=>old.forEach(el=>el.remove()),{once:true});
  if(announce)root.querySelector('#history-announcement').textContent=g.name+', version '+(index+1)+' of 3';draw();
 }
 function draw(){tracks.forEach((b,n)=>{b.setAttribute('aria-pressed',String(n===index));b.querySelector('i').style.transform='scaleX('+(n<index?1:n===index?time/duration:0)+')';});}
 function tick(now){time+=last?Math.min(now-last,80):0;last=now;if(time>=duration){time=0;if(index===groups[selected].files.length-1){selected=(selected+1)%groups.length;index=0;}else{index++;}render();}draw();raf=requestAnimationFrame(tick);}
 function sync(){cancelAnimationFrame(raf);last=0;toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Play design history':'Pause design history');root.dataset.paused=String(paused);const running=visible&&!paused&&!document.hidden;root.dataset.running=String(running);phone.querySelectorAll('video').forEach(v=>{if(running&&v===phone.lastElementChild)v.play().catch(()=>{});else v.pause();});if(running)raf=requestAnimationFrame(tick);}
 toggle.addEventListener('click',()=>{paused=!paused;sync();});new IntersectionObserver(e=>{visible=e[0].isIntersecting;sync();},{threshold:.12}).observe(root);reduced.addEventListener('change',e=>{paused=e.matches;sync();});document.addEventListener('visibilitychange',sync);render();sync();
})();
