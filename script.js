const intro = document.getElementById('intro');
const invitation = document.getElementById('invitation');
document.getElementById('openInvite').addEventListener('click', () => {
  intro.classList.add('fade-out');
  intro.style.transition = 'opacity .8s ease, transform .8s ease';
  intro.style.opacity = '0'; intro.style.transform = 'scale(1.03)';
  setTimeout(() => {
    intro.style.display = 'none';
    invitation.classList.remove('hidden');
    window.scrollTo({top:0, behavior:'instant'});
    document.querySelectorAll('.reveal').forEach((el,i)=>setTimeout(()=>el.classList.add('visible'), i*130));
  }, 750);
});

const eventDate = new Date('2027-01-17T20:00:00+05:00').getTime();
function updateCountdown(){
  const distance = eventDate - Date.now();
  const safe = Math.max(0, distance);
  const values = {
    days: Math.floor(safe / 86400000),
    hours: Math.floor((safe % 86400000) / 3600000),
    minutes: Math.floor((safe % 3600000) / 60000),
    seconds: Math.floor((safe % 60000) / 1000)
  };
  Object.entries(values).forEach(([id,value])=>document.getElementById(id).textContent=String(value).padStart(2,'0'));
}
updateCountdown(); setInterval(updateCountdown,1000);

const audio = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
musicToggle.addEventListener('click', async()=>{
  if(audio.paused){
    try{await audio.play();musicToggle.classList.add('playing');musicLabel.textContent='MUSIC ON';musicToggle.setAttribute('aria-label','Pause background music');}
    catch(e){musicLabel.textContent='ADD MUSIC FILE';}
  }else{audio.pause();musicToggle.classList.remove('playing');musicLabel.textContent='MUSIC OFF';musicToggle.setAttribute('aria-label','Play background music');}
});
document.getElementById('shareButton').addEventListener('click',async()=>{
  const data={title:'Anas & Rabiya | Walima Invitation',text:'You are invited to the Walima of Anas & Rabiya on 17 January 2027 at 8:00 PM, The Liberty Ballroom, Karachi.',url:location.href};
  if(navigator.share){try{await navigator.share(data);}catch(e){}}
  else if(navigator.clipboard){await navigator.clipboard.writeText(data.text+' '+data.url);const b=document.getElementById('shareButton');b.innerHTML='INVITATION COPIED ✓';setTimeout(()=>b.innerHTML='SHARE INVITATION <span>↗</span>',2200);}
  else{prompt('Copy this invitation link:',location.href);}
});
