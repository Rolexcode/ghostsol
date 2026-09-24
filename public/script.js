(()=>{
  const intro=document.getElementById('intro');
  const gate=document.getElementById('entry-gate');
  const video=document.getElementById('arrival-video');
  const audio=document.getElementById('intro-audio');
  const sound=document.getElementById('sound-toggle');
  const line=document.getElementById('intro-line');
  const index=document.querySelector('.intro-index');
  const ghost=document.getElementById('apparition');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let done=false,started=false,timers=[];
  function finish(){
    if(done)return;done=true;timers.forEach(clearTimeout);
    intro.classList.add('hidden');document.body.classList.remove('intro-active');
    video.pause();audio.pause();
    setTimeout(()=>{intro.setAttribute('aria-hidden','true');intro.removeAttribute('role');intro.removeAttribute('aria-modal')},900);
    document.body.classList.add('site-entered');
  }
  function say(message,number){
    line.classList.remove('visible');
    timers.push(setTimeout(()=>{line.textContent=message;index.textContent=number;line.classList.add('visible')},250));
  }
  function start(withSound){
    if(started)return;started=true;
    video.currentTime=0;video.playbackRate=.72;
    if(withSound){
      audio.currentTime=0;audio.volume=.8;
      // Both media calls happen inside the visitor's tap.
      audio.play().then(()=>{sound.hidden=false;sound.setAttribute('aria-pressed','true')}).catch(()=>{sound.hidden=false;sound.textContent='SOUND UNAVAILABLE'});
    }else{sound.hidden=false;sound.textContent='♪ SOUND ON'}
    video.play().catch(()=>{intro.classList.add('video-failed')});
    gate.classList.add('departed');intro.classList.add('playing');
    timers.push(setTimeout(()=>line.classList.add('visible'),550),setTimeout(()=>say('He walked right past you.','02 / 03'),3200),setTimeout(()=>say('Now you see him everywhere.','03 / 03'),6100),setTimeout(finish,9000));
  }
  document.getElementById('enter-sound').addEventListener('click',()=>start(true));
  document.getElementById('enter-muted').addEventListener('click',()=>start(false));
  document.getElementById('skip-intro').addEventListener('click',finish);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')finish()});
  sound.addEventListener('click',()=>{
    if(!started||done)return;
    if(!audio.paused){audio.pause();sound.textContent='♪ SOUND ON';sound.setAttribute('aria-pressed','false');return}
    audio.currentTime=Math.min(8.8,video.currentTime/.72);audio.play().then(()=>{sound.textContent='♪ SOUND OFF';sound.setAttribute('aria-pressed','true')}).catch(()=>{sound.textContent='SOUND UNAVAILABLE'});
  });
  if(reduced)finish();

  if(!reduced){
    document.body.classList.add('motion-ready');
    const revealTargets=document.querySelectorAll('.story-copy,.story-image,.interlude-inner,.evidence-intro,.evidence-grid figure,.manifesto-content,.game-scene,.game-copy,.ca-strip,.community-content');
    const revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target)}})
    },{threshold:.12,rootMargin:'0px 0px -5% 0px'});
    revealTargets.forEach(el=>revealObserver.observe(el));
    let lastPeek=0,peekTimer;
    function peek(){
      if(document.hidden||done===false)return;
      const now=Date.now();if(now-lastPeek<3500)return;lastPeek=now;
      const left=Math.random()>.5;
      ghost.style.left=left?'-22px':'auto';ghost.style.right=left?'auto':'-22px';
      ghost.style.bottom=(8+Math.random()*38)+'vh';
      ghost.classList.remove('seen');void ghost.offsetWidth;ghost.classList.add('seen');
      document.body.classList.add('haunt-jolt');
      setTimeout(()=>document.body.classList.remove('haunt-jolt'),280);
      clearTimeout(peekTimer);peekTimer=setTimeout(()=>ghost.classList.remove('seen'),1050);
    }
    const hauntObserver=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting))peek();
    },{threshold:.2});
    document.querySelectorAll('.story,.evidence,.manifesto,.game-teaser,.community').forEach(el=>hauntObserver.observe(el));
    let lastScrollY=window.scrollY;
    window.addEventListener('scroll',()=>{
      if(Math.abs(window.scrollY-lastScrollY)>1200){peek();lastScrollY=window.scrollY}
    },{passive:true});
    function scramble(el){
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
      const nodes=[];while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
      const original=nodes.map(node=>node.textContent);const positions=[];
      original.forEach((part,j)=>[...part].forEach((c,k)=>{if(!/\s/.test(c))positions.push([j,k])}));
      let step=0;const glyphs='#%&@/|<>?01';
      const timer=setInterval(()=>{
        const revealed=Math.min(positions.length,step++*2);
        nodes.forEach((node,j)=>{node.textContent=[...original[j]].map((c,k)=>{
          if(/\s/.test(c))return c;
          const rank=positions.findIndex(([nj,nk])=>nj===j&&nk===k);
          return rank<revealed?c:glyphs[Math.floor(Math.random()*glyphs.length)];
        }).join('')});
        if(revealed>=positions.length){clearInterval(timer);nodes.forEach((node,j)=>node.textContent=original[j])}
      },42);
    }
    const scrambleObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){scramble(entry.target);scrambleObserver.unobserve(entry.target)}})
    },{threshold:.35});
    document.querySelectorAll('.scramble').forEach(el=>scrambleObserver.observe(el));
    const footage=document.querySelector('.sighting-video');
    if(footage){const footageObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting)footage.play().catch(()=>{});else footage.pause()
    }),{threshold:.15});footageObserver.observe(footage)}
    let ticking=false;
    function track(){
      if(ticking)return;ticking=true;
      requestAnimationFrame(()=>{
        const y=window.scrollY;const vh=window.innerHeight;
        document.documentElement.style.setProperty('--hero-drift',Math.min(y,Math.max(vh,600))*.16+'px');
        document.querySelectorAll('.story-image,.manifesto-image,.game-scene img').forEach((el,i)=>{
          const rect=el.getBoundingClientRect();
          if(rect.bottom>0&&rect.top<vh){const p=(vh-rect.top)/(vh+rect.height)-.5;el.style.setProperty('--image-drift',(p*(i%2?20:-20)).toFixed(1)+'px')}
        });
        ticking=false;
      })
    }
    window.addEventListener('scroll',track,{passive:true});track();
  }
})();
