(()=>{
 const section=document.querySelector('.agent-system');if(!section)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),toggle=document.getElementById('system-motion-toggle');
 const identityHost=document.getElementById('system-identity-star');
 const identityIcon=window.lottie?lottie.loadAnimation({container:identityHost,renderer:'svg',loop:true,autoplay:false,path:'drivescore-assets/playground-assets/quote-agent-spin.json',rendererSettings:{preserveAspectRatio:'xMidYMid meet'}}):null;
 let paused=reduced.matches,visible=false,raf=0,last=0,accumulator=0;
 const canvas=document.getElementById('qa-confetti-canvas'),stage=document.getElementById('qa-confetti-stage'),ctx=canvas.getContext('2d');let W=0,H=0,particles=[],burstAge=-1,celebrated=false,stageVisible=false,settledTime=0,countdownTime=0,celebrationState='waiting';
 const colours=['#FFB5EF','#A188B7','#BAFFEE','#7EB1B9','#E1C9FF','#9194C1'];
 function resize(){const b=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);W=b.width;H=b.height;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);paint();}
 function spawn(side){particles.push({x:side?W:0,y:H*.94,angle:(-(side?120:60)+(27.5-Math.random()*55))*Math.PI/180,velocity:34*(.5+Math.random()),gravity:.8*3,wobble:Math.random()*10,wobbleSpeed:.05+Math.random()*.06,tilt:Math.random()*Math.PI*2,tiltSpeed:(Math.random()<.5?-1:1)*(.06+Math.random()*.08),colour:colours[Math.floor(Math.random()*colours.length)],size:11*(.55+Math.random()*.85),age:0});}
 function step(){if(burstAge>=0&&burstAge<42){spawn(0);spawn(1);burstAge++;}else burstAge=-1;particles=particles.filter(p=>{p.x+=Math.cos(p.angle)*p.velocity;p.y+=Math.sin(p.angle)*p.velocity+p.gravity;p.velocity*=.9;p.wobble+=p.wobbleSpeed;p.tilt+=p.tiltSpeed;p.age++;return p.age<330&&(p.age<60||p.y<H+40);});}
 function paint(){ctx.clearRect(0,0,W,H);for(const p of particles){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.tilt);ctx.scale(Math.cos(p.wobble),1);ctx.fillStyle=p.colour;ctx.beginPath();ctx.moveTo(0,-p.size*.62);ctx.lineTo(p.size*.56,p.size*.5);ctx.lineTo(-p.size*.56,p.size*.5);ctx.closePath();ctx.fill();ctx.restore();}}
 function celebrate(){particles=[];burstAge=0;accumulator=0;settledTime=0;countdownTime=0;celebrationState='playing';stage.classList.add('is-animated');}
 const replay=document.getElementById('qa-confetti-replay');
 function setReplayLabel(value){if(replay.textContent!==value)replay.textContent=value;}
 function draw(){
 stage.dataset.state=celebrationState;
 if(reduced.matches&&paused)setReplayLabel('Replay celebration');
 else if(celebrationState==='countdown')setReplayLabel('Replaying in '+Math.max(1,Math.ceil((3000-countdownTime)/1000))+'…');
 else if(celebrationState==='settled')setReplayLabel('Settling…');else setReplayLabel('Celebrating…');
 }
 function tick(now){const dt=last?Math.min(60,now-last):0;last=now;
 if(stageVisible){
  accumulator+=dt;while(accumulator>=1000/60){step();accumulator-=1000/60;}
  if(celebrationState==='playing'&&burstAge===-1&&particles.length===0){celebrationState='settled';settledTime=0;}
  if(celebrationState==='settled'){settledTime+=dt;if(settledTime>=1000){celebrationState='countdown';countdownTime=0;}}
  else if(celebrationState==='countdown'){countdownTime+=dt;if(countdownTime>=3000)celebrate();}
 }
 draw();paint();raf=requestAnimationFrame(tick);}
 function sync(){section.classList.toggle('system-is-paused',paused||!visible);if(toggle){toggle.textContent=paused?'Play motion':'Pause motion';toggle.setAttribute('aria-pressed',String(paused));}if(raf)cancelAnimationFrame(raf);raf=0;last=0;if(visible&&!paused&&!document.hidden){identityIcon?.play();raf=requestAnimationFrame(tick);}else{identityIcon?.pause();}draw();}
 identityIcon?.addEventListener('DOMLoaded',()=>{identityHost.classList.add('is-ready');if(paused)identityIcon.goToAndStop(180,true);sync();});
 section.querySelectorAll('.qa-state-button').forEach(button=>button.addEventListener('click',()=>{button.classList.remove('is-previewing');void button.offsetWidth;button.classList.add('is-previewing');button.addEventListener('animationend',()=>button.classList.remove('is-previewing'),{once:true});}));
 toggle?.addEventListener('click',()=>{paused=!paused;sync();});
 
 document.getElementById('qa-confetti-replay').addEventListener('click',()=>{celebrate();paused=false;sync();});
 new IntersectionObserver(e=>{visible=e[0].isIntersecting;sync();},{threshold:.04}).observe(section);
 new IntersectionObserver(e=>{stageVisible=e[0].isIntersecting;if(stageVisible&&!celebrated&&!reduced.matches){celebrated=true;celebrate();}},{threshold:.25}).observe(stage);
 const trustStage=document.querySelector('.qa-trust-stage'),indicatorStage=document.querySelector('.qa-indicator-stage');
 const fit=()=>{for(const [el,w,h] of [[trustStage,310,265],[indicatorStage,333,210]]){const box=el.getBoundingClientRect();el.style.setProperty('--art-scale',Math.min(box.width/w,box.height/h));}};
 const artObserver=new ResizeObserver(fit);artObserver.observe(trustStage);artObserver.observe(indicatorStage);fit();
 new ResizeObserver(resize).observe(stage);
 reduced.addEventListener('change',e=>{paused=e.matches;if(paused){particles=[];burstAge=-1;stage.classList.remove('is-animated');paint();identityIcon?.goToAndStop(180,true);}sync();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;last=0;identityIcon?.pause();}else sync();});resize();sync();
})();
