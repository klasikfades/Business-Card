(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* entrances: 30ms stagger within each group */
  document.querySelectorAll('section h2').forEach(e=>e.classList.add('reveal'));
  document.querySelectorAll('.grid,.skills,.tl,.facts').forEach(g=>[...g.children].forEach((c,i)=>{c.classList.add('reveal');c.style.setProperty('--i',i)}));
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(e=>io.observe(e));

  /* card spotlight follows pointer directly (no tween) */
  if(matchMedia('(hover:hover)').matches)document.querySelectorAll('.card').forEach(c=>{let f=0,x=0,y=0;
    c.addEventListener('pointermove',ev=>{x=ev.clientX;y=ev.clientY;if(f)return;f=requestAnimationFrame(()=>{f=0;
      const r=c.getBoundingClientRect();c.style.setProperty('--mx',(x-r.left)+'px');c.style.setProperty('--my',(y-r.top)+'px')})},{passive:true})});
  /* pause the background when the tab is hidden */
  document.addEventListener('visibilitychange',()=>document.querySelector('.liquid').style.animationPlayState=document.hidden?'paused':'');

  /* nav knob: ease-in-out move, stretches 12% mid-travel */
  const list=document.querySelector('.links'),knob=list.querySelector('.knob'),links=[...list.querySelectorAll('a')];
  let cur=null;
  function moveKnob(a){
    if(!a||a===cur)return;
    const lr=list.getBoundingClientRect(),r=a.getBoundingClientRect();
    if(cur&&!reduce){knob.classList.remove('moving');void knob.offsetWidth;knob.classList.add('moving')}
    knob.style.translate=(r.left-lr.left)+'px 0';knob.style.width=r.width+'px';knob.style.opacity=1;
    links.forEach(l=>l.classList.toggle('active',l===a));cur=a;
  }
  knob.addEventListener('animationend',()=>knob.classList.remove('moving'));
  const so=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting)moveKnob(links.find(l=>l.hash==='#'+x.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('section[id],footer[id]').forEach(s=>so.observe(s));
  addEventListener('resize',()=>{const a=cur;cur=null;if(a){knob.style.transition='none';moveKnob(a);requestAnimationFrame(()=>knob.style.transition='')}});

  /* mobile menu popover: grows from trigger, shrinks back into it */
  const btn=document.querySelector('.menu-btn'),pop=document.getElementById('menu');
  const setOpen=o=>{pop.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Close menu':'Open menu')};
  btn.addEventListener('click',e=>{e.stopPropagation();setOpen(!pop.classList.contains('open'))});
  pop.addEventListener('click',e=>{if(e.target.closest('a'))setOpen(false)});
  document.addEventListener('click',e=>{if(!pop.contains(e.target))setOpen(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setOpen(false);btn.focus()}});


  /* image loaded → stop shimmer */
  const av=document.querySelector('.avatar img');if(av){const done=()=>av.classList.add('loaded');av.complete?done():av.addEventListener('load',done)}
  /* sticky mobile CTA hides over hero buttons and footer */
  const mcta=document.querySelector('.mcta');
  if(mcta){const seen=new Set();const mo=new IntersectionObserver(es=>{es.forEach(x=>x.isIntersecting?seen.add(x.target):seen.delete(x.target));mcta.classList.toggle('away',seen.size>0)});
    mo.observe(document.querySelector('.hero .btns'));mo.observe(document.querySelector('footer'))}

  /* project filters: knob slides + stretches, cards re-enter with 30ms stagger */
  const fbar=document.querySelector('.filters');
  if(fbar){
    const fk=fbar.querySelector('.fknob'),fb=[...fbar.querySelectorAll('button')],cards=[...document.querySelectorAll('#project-grid .card')];
    let fcur=null;
    const place=(b,anim)=>{const br=fbar.getBoundingClientRect(),r=b.getBoundingClientRect();
      if(anim&&!reduce){fk.classList.remove('moving');void fk.offsetWidth;fk.classList.add('moving')}
      fk.style.translate=(r.left-br.left)+'px 0';fk.style.width=r.width+'px'};
    fk.addEventListener('animationend',()=>fk.classList.remove('moving'));
    const pick=b=>{if(b===fcur)return;place(b,!!fcur);fcur=b;
      fb.forEach(x=>x.setAttribute('aria-selected',x===b));
      const f=b.dataset.f;let n=0;
      cards.forEach(c=>{const show=f==='all'||c.dataset.cat===f;c.classList.toggle('hide',!show);c.classList.remove('enter');
        if(show){c.classList.add('in');void c.offsetWidth;c.style.setProperty('--i',n++);c.classList.add('enter')}})};
    fb.forEach(b=>b.addEventListener('click',()=>pick(b)));
    fk.style.transition='none';pick(fb[0]);requestAnimationFrame(()=>fk.style.transition='');
    addEventListener('resize',()=>{fk.style.transition='none';place(fcur,false);requestAnimationFrame(()=>fk.style.transition='')});
  }

  /* copy email: confirm success only after clipboard resolves */
  document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(b.dataset.email)}catch(_){location.href='mailto:'+b.dataset.email;return}
    b.classList.add('copied');clearTimeout(b._t);b._t=setTimeout(()=>b.classList.remove('copied'),1600);
  }));
})();
