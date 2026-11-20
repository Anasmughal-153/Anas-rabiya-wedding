document.addEventListener('DOMContentLoaded',()=>{
  const intro=document.getElementById('intro');
  const invitation=document.getElementById('invitation');
  const openButton=document.getElementById('openInvite');
  let opened=false;
  if(openButton&&intro&&invitation){
    openButton.addEventListener('click',()=>{
      if(opened)return;
      opened=true;
      intro.classList.add('intro-leaving');
      window.setTimeout(()=>{
        intro.classList.add('hidden');
        invitation.classList.remove('hidden');
        window.scrollTo({top:0,behavior:'instant'});
        invitation.querySelectorAll('.reveal').forEach((el,i)=>window.setTimeout(()=>el.classList.add('visible'),i*140));
      },1450);
    });
  }

  const letter=document.getElementById('letterCard');
  if(letter)letter.addEventListener('click',()=>{
    const state=letter.classList.toggle('is-open');
    letter.setAttribute('aria-expanded',String(state));
  });

  if('IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
    }),{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  }else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));

  const eventDate=new Date('2027-01-17T20:00:00+05:00').getTime();
  function updateCountdown(){
    const distance=Math.max(0,eventDate-Date.now());
    const values={days:Math.floor(distance/86400000),hours:Math.floor(distance%86400000/3600000),minutes:Math.floor(distance%3600000/60000),seconds:Math.floor(distance%60000/1000)};
    Object.entries(values).forEach(([id,value])=>{const node=document.getElementById(id);if(node)node.textContent=String(value).padStart(2,'0');});
  }
  updateCountdown();window.setInterval(updateCountdown,1000);

  const canvas=document.getElementById('scratchCanvas');
  const wrap=document.getElementById('scratchWrap');
  const feather=document.querySelector('.scratch-feather');
  const prompt=document.getElementById('rubPrompt');
  if(canvas&&wrap){
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    let drawing=false,lastPoint=null,erased=false;
    function setupCanvas(){
      const rect=wrap.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
      canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const w=rect.width,h=rect.height;
      const grad=ctx.createLinearGradient(0,0,w,h);
      grad.addColorStop(0,'#4b2d1d');grad.addColorStop(.45,'#2a170f');grad.addColorStop(1,'#160c08');
      ctx.globalCompositeOperation='source-over';ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
      ctx.strokeStyle='rgba(225,190,130,.13)';ctx.lineWidth=1;
      for(let x=-h;x<w;x+=24){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+h,h);ctx.stroke();}
      ctx.globalCompositeOperation='destination-out';
    }
    function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
    function erase(e){
      const p=point(e);ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=48;
      ctx.beginPath();if(lastPoint){ctx.moveTo(lastPoint.x,lastPoint.y);ctx.lineTo(p.x,p.y);}else{ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.1,p.y+.1);}ctx.stroke();
      ctx.beginPath();ctx.arc(p.x,p.y,24,0,Math.PI*2);ctx.fill();lastPoint=p;
      if(feather)feather.style.opacity=String(Math.max(.08,1-(wrap.dataset.progress||0)*.012));
      checkProgress();
    }
    function checkProgress(){
      const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
      let transparent=0,total=0;
      for(let i=3;i<data.length;i+=32){total++;if(data[i]<40)transparent++;}
      const progress=transparent/total*100;wrap.dataset.progress=String(progress);
      if(progress>48&&!erased){erased=true;wrap.classList.add('complete');ctx.clearRect(0,0,canvas.width,canvas.height);if(feather)feather.style.opacity='0';}
    }
    canvas.addEventListener('pointerdown',e=>{if(erased)return;drawing=true;lastPoint=null;canvas.setPointerCapture(e.pointerId);erase(e);});
    canvas.addEventListener('pointermove',e=>{if(drawing&&!erased)erase(e);});
    const stop=()=>{drawing=false;lastPoint=null;};canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);canvas.addEventListener('lostpointercapture',stop);
    setupCanvas();window.addEventListener('resize',()=>{if(!erased)setupCanvas();});
  }

  const audio=document.getElementById('backgroundMusic'),musicToggle=document.getElementById('musicToggle'),musicLabel=document.getElementById('musicLabel');
  if(audio&&musicToggle){
    musicToggle.addEventListener('click',async()=>{
      if(audio.paused){try{await audio.play();musicToggle.classList.add('playing');musicToggle.setAttribute('aria-label','Pause background music');if(musicLabel)musicLabel.textContent='MUSIC ON';}
      catch(e){if(musicLabel)musicLabel.textContent='AUDIO UNAVAILABLE';}}
      else{audio.pause();musicToggle.classList.remove('playing');musicToggle.setAttribute('aria-label','Play background music');if(musicLabel)musicLabel.textContent='MUSIC OFF';}
    });
    audio.addEventListener('ended',()=>{musicToggle.classList.remove('playing');if(musicLabel)musicLabel.textContent='MUSIC OFF';});
  }

  const share=document.getElementById('shareButton');
  if(share)share.addEventListener('click',async()=>{
    const data={title:'Anas & Rabiya | Valima Invitation',text:'You are invited to the Valima of Anas & Rabiya on 17 January 2027 at 8:00 PM, The Liberty Ballroom, Karachi.',url:location.href};
    if(navigator.share){try{await navigator.share(data);}catch(e){}}
    else if(navigator.clipboard&&navigator.clipboard.writeText){try{await navigator.clipboard.writeText(location.href);share.querySelector('span').textContent='COPIED';setTimeout(()=>share.querySelector('span').textContent='↗',1800);}catch(e){window.prompt('Copy this invitation link:',location.href);}}
    else window.prompt('Copy this invitation link:',location.href);
  });
});
