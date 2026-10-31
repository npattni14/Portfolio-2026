(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const journeyHost=document.getElementById('journey-animation');
  const journeyToggle=document.getElementById('journey-animation-toggle');
  if(journeyHost&&window.lottie){
    const animation=lottie.loadAnimation({container:journeyHost,renderer:'svg',loop:true,autoplay:false,path:'drivescore-assets/playground-assets/quote-agent-journey.json?v=right-phone-1',rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});
    const checklist=document.createElement('div');checklist.className='journey-loading-checklist';checklist.setAttribute('aria-hidden','true');
    const labels=['Reviewing your updates','Switching to pay Annually','Increasing voluntary excess','Sharing your Driving licence number','Finding your best prices'];
    const starts=[30,120,230,340,450],ends=[120,230,340,450,560];
    labels.forEach((label,i)=>{const row=document.createElement('div');row.className='journey-loading-row';row.dataset.index=String(i);row.dataset.state='waiting';const icon=document.createElement('span');icon.className='journey-row-icon';const text=document.createElement('span');text.textContent=label;row.append(icon,text);checklist.append(row);});
    journeyHost.append(checklist);
    function renderChecklist(frame){checklist.querySelectorAll('.journey-loading-row').forEach((row,i)=>{const state=frame>=ends[i]?'done':frame>=starts[i]?'working':'waiting';if(row.dataset.state!==state){row.dataset.state=state;row.querySelector('.journey-row-icon').textContent=state==='done'?'✓':'';}});}
    let paused=reduced.matches,visible=false,ready=false;
    const sync=()=>{
      journeyHost.dataset.paused=String(paused||!visible);
      journeyToggle.textContent=paused?'Play animation':'Pause animation';
      journeyToggle.setAttribute('aria-pressed',String(paused));
      if(ready){if(visible&&!paused)animation.play();else animation.pause();}
    };
    animation.addEventListener('DOMLoaded',()=>{ready=true;journeyHost.classList.add('is-ready');if(paused)animation.goToAndStop(1020,true);sync();});
    animation.addEventListener('enterFrame',event=>{
      renderChecklist(event.currentTime);
      const phase=event.currentTime<672?'loading':'saving';
      if(journeyHost.dataset.phase!==phase){
        journeyHost.dataset.phase=phase;
        journeyHost.setAttribute('aria-label',phase==='loading'?'Quote Agent is reviewing the driver’s changes':'Quote Agent found a £98 annual saving and celebrates with confetti');
      }
    });
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.2}).observe(journeyHost);
    journeyToggle.addEventListener('click',()=>{paused=!paused;sync();});
    reduced.addEventListener('change',e=>{paused=e.matches;if(paused&&ready)animation.goToAndStop(1020,true);sync();});
    animation.addEventListener('data_failed',()=>{journeyToggle.hidden=true;});
  }

  const host=document.getElementById('quote-agent-ai-test');
  if(!host)return;
  const toggle=document.getElementById('chat-animation-toggle');
  const replay=document.getElementById('chat-replay');
  const composer=document.getElementById('chat-composer-text');
  const message=document.getElementById('chat-user-message');
  const promptMessage=document.getElementById('chat-prompt-message');
  const thinking=document.getElementById('chat-thinking');
  const answer=document.getElementById('chat-answer');
  const assumption=document.getElementById('chat-assumption');
  const estimate=document.getElementById('chat-estimate');
  const planning=document.getElementById('chat-planning');
  const prompt='Using my age 35, car Audi A3 from 2005, 70,000 miles, and comprehensive insurance, tell me how much my car insurance price would be.';
  const parts=[
    {element:assumption,text:'Assuming you mean a 2005 Audi A3, you’re 35, based in London, have a reasonably clean driving history, and want fully comprehensive cover:'},
    {element:estimate,text:'My estimate: ~£750–£1,050/year'},
    {element:planning,text:'I’d use ~£850/year (£71/month) as a reasonable planning number.'}
  ];
  promptMessage.textContent=prompt;
  const answerEnd=5550+(parts.reduce((sum,p)=>sum+p.text.length,0)+12*(parts.length-1))*21;
  let stopped=false;
  let visible=false,paused=reduced.matches,time=reduced.matches?15000:0,last=0,raf=0,dirty=true;
  function draw(){
    const t=time%23000;
    const composing=t<3900;
    host.dataset.chatState=stopped?'stopped':composing?'typing':t<5550?'thinking':t<answerEnd?'answering':'complete';
    const generating=!stopped&&t>=3900&&t<answerEnd;
    replay.dataset.action=generating?'stop':'replay';
    replay.setAttribute('aria-label',generating?'Stop generating':'Replay ChatGPT test');
    replay.title=generating?'Stop generating':'Replay test';
    message.hidden=composing;
    thinking.hidden=stopped||composing||t>=5550;
    answer.hidden=t<5550;
    composer.textContent=composing?prompt.slice(0,Math.floor(Math.max(0,t-450)/25)):'Ask anything';
    composer.classList.toggle('is-typing',composing&&t>450);
    composer.classList.toggle('is-placeholder',!composing);
    // Append small streamed chunks and fade them into place; preserve existing nodes.
    let budget=Math.floor(Math.max(0,t-5550)/21);
    for(const part of parts){
      const count=Math.min(part.text.length,budget);
      const old=Number(part.element.dataset.characters||0);
      if(count<old){part.element.replaceChildren();part.element.dataset.characters='0';}
      const previous=Number(part.element.dataset.characters||0);
      if(count>previous){
        const span=document.createElement('span');span.className='stream-word';
        span.textContent=part.text.slice(previous,count);part.element.append(span);
        part.element.dataset.characters=String(count);
      }
      budget=Math.max(0,budget-part.text.length-12);
    }
    answer.classList.toggle('is-streaming',!stopped&&t>=5550&&t<answerEnd);
    dirty=false;
  }
  function tick(now){
    if(last)time+=now-last;
    last=now;draw();
    raf=requestAnimationFrame(tick);
  }
  function sync(){
    toggle.textContent=paused?'▶ Play':'Ⅱ Pause';
    toggle.setAttribute('aria-pressed',String(paused));
    host.classList.toggle('chat-is-paused',paused);
    if(raf)cancelAnimationFrame(raf);raf=0;last=0;
    if(dirty)draw();
    if(visible&&!paused)raf=requestAnimationFrame(tick);
  }
  toggle.addEventListener('click',()=>{stopped=false;paused=!paused;dirty=true;sync();});
  replay.addEventListener('click',()=>{if(replay.dataset.action==='stop'){stopped=true;paused=true;}else{stopped=false;time=0;paused=false;}dirty=true;sync();});
  reduced.addEventListener('change',e=>{stopped=false;paused=e.matches;if(paused){time=15000;dirty=true;}sync();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.15}).observe(host);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;last=0;}else sync();});
  draw();sync();
})();
