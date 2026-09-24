(()=>{
  const intro=document.getElementById('intro');
  const video=document.getElementById('arrival-video');
  const audio=document.getElementById('intro-audio');
  const sound=document.getElementById('sound-toggle');
  const line=document.getElementById('intro-line');
  const index=document.querySelector('.intro-index');
  const ghost=document.getElementById('apparition');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let done=false,timers=[];
  function finish(){
    if(done)return; done=true; timers.forEach(clearTimeout);
    intro.classList.add('hidden'); document.body.classList.remove('intro-active');
    video.pause(); audio.pause();
    setTimeout(()=>{intro.setAttribute('aria-hidden','true');intro.removeAttribute('role');intro.removeAttribute('aria-modal')},900);
  }
  function say(message,number){
    line.classList.remove('visible');
    timers.push(setTimeout(()=>{line.textContent=message;index.textContent=number;line.classList.add('visible')},250));
  }
  document.getElementById('skip-intro').addEventListener('click',finish);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')finish()});
  sound.addEventListener('click',async()=>{
    if(!audio.paused){audio.pause();sound.textContent='♪ SOUND ON';sound.setAttribute('aria-pressed','false');return}
    try{audio.currentTime=Math.min(8.8,video.currentTime/.72);audio.volume=.7;await audio.play();sound.textContent='♪ SOUND OFF';sound.setAttribute('aria-pressed','true')}
    catch{sound.textContent='SOUND UNAVAILABLE'}
  });
  if(reduced){finish()}else{
    video.playbackRate=.72;
    timers.push(setTimeout(()=>line.classList.add('visible'),350),setTimeout(()=>say('He walked right past you.','02 / 03'),3200),setTimeout(()=>say('Now you see him everywhere.','03 / 03'),6100),setTimeout(finish,9000));
    video.addEventListener('error',finish);
    video.play().catch(()=>{});
  }
  if(ghost&&!reduced){
    let visible=false,last=0;
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting){ghost.style.setProperty('--haunt-side',Math.floor(last%2)===0?'1':'-1');ghost.classList.add('seen');visible=true;last++}
        else if(visible){ghost.classList.remove('seen');visible=false}
      }
    },{threshold:.35});
    document.querySelectorAll('.story,.evidence,.community').forEach(el=>observer.observe(el));
  }
})();
