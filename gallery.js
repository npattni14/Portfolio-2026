(()=>{
 const field=document.querySelector('#guest-leaves'),art=document.querySelector('#gallery-leaf-art').content.querySelector('img').src;
 let entries=[],filter='all',started=false;
 function date(value){return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'}).format(new Date(value));}
 function node(tag,className,text){const e=document.createElement(tag);e.className=className;if(text!==undefined)e.textContent=text;return e;}
 function render(){
  field.replaceChildren();
  const visible=entries.filter(e=>filter==='all'||e.colour===filter);
  visible.forEach((entry,i)=>{
   const card=node('figure','guest-leaf');card.setAttribute('role','listitem');card.tabIndex=0;card.dataset.colour=entry.colour;
   card.setAttribute('aria-label',entry.name+', '+date(entry.date)+(entry.own?', your signed leaf':', signed leaf'));
   card.style.setProperty('--tilt',[-7,4,-3,7,5,-5,6,-4][i%8]+'deg');
   card.style.setProperty('--offset',[16,-10,25,0,8,-8,20,3][i%8]+'px');
   const img=node('img','guest-art');img.src=art;img.alt='';img.draggable=false;
   const writing=node('div','guest-inscription');
   writing.append(node('p','guest-date',date(entry.date)),node('p','guest-name',entry.name));
   if(!entry.example&&typeof entry.signature==='string'&&entry.signature.startsWith('data:image/png;base64,')){
    const sign=node('img','guest-signature');sign.src=entry.signature;sign.alt='Visitor signature';card.append(sign);
   }else card.append(node('p','guest-sample-signature',entry.name.split(' ')[0]));
   card.prepend(img);
   card.append(writing,node('figcaption','guest-tooltip',entry.name+' · '+date(entry.date)),node('span','guest-badge',entry.own?'Your leaf':'Visitor leaf'));
   field.append(card);
  });
  document.querySelector('#gallery-empty').hidden=visible.length>0;
 }
 function refresh(){
  if(started)return;started=true;
  const stats=document.querySelector('#gallery-stats');stats.textContent='Loading visitor leaves…';
  window.guestbook.subscribe(all=>{
   entries=all;const year=new Date().getFullYear();const count=all.filter(e=>new Date(e.date).getFullYear()===year).length;
   stats.textContent=count+' '+(count===1?'person has':'people have')+' visited and signed the gallery in '+year;
   render();
  },()=>{started=false;stats.textContent='The gallery is temporarily unavailable. Please try again shortly.';});
 }
 document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
  filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));render();
 }));
 addEventListener('gallery-open',refresh);if(location.hash==='#gallery')refresh();
})();
