document.addEventListener("DOMContentLoaded",()=>{
const intro=document.getElementById("intro"),invitation=document.getElementById("invitation"),openButton=document.getElementById("openInvite");
let opened=false;
openButton?.addEventListener("click",()=>{
 if(opened||!intro||!invitation)return;opened=true;intro.classList.add("is-opening");
 window.setTimeout(()=>{intro.hidden=true;intro.style.display="none";invitation.classList.remove("hidden");window.scrollTo({top:0,behavior:"instant"});},950);
});
const revealItems=document.querySelectorAll(".reveal");
if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.12});revealItems.forEach(el=>observer.observe(el));}
else revealItems.forEach(el=>el.classList.add("visible"));
const letter=document.getElementById("letterCard");
letter?.addEventListener("click",()=>{const state=letter.classList.toggle("is-open");letter.setAttribute("aria-expanded",String(state));});
const canvas=document.getElementById("scratchCanvas"),card=document.getElementById("scratchCard"),instruction=document.getElementById("scratchInstruction"),reset=document.getElementById("resetScratch"),ctx=canvas?.getContext("2d",{willReadFrequently:true});
let drawing=false,last=null,revealed=false,strokes=0;
function paint(){
 if(!canvas||!ctx||!card)return;
 const r=card.getBoundingClientRect();if(!r.width||!r.height)return;
 const dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
 const g=ctx.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,"#e5e9dc");g.addColorStop(.48,"#b8c3ad");g.addColorStop(1,"#e8e2cf");ctx.globalCompositeOperation="source-over";ctx.clearRect(0,0,r.width,r.height);ctx.fillStyle=g;ctx.fillRect(0,0,r.width,r.height);
 ctx.strokeStyle="rgba(255,253,244,.8)";ctx.lineWidth=1;ctx.strokeRect(10,10,r.width-20,r.height-20);ctx.fillStyle="#60735f";ctx.textAlign="center";ctx.font="600 9px Montserrat,sans-serif";ctx.fillText("A LITTLE SURPRISE FOR YOU",r.width/2,r.height*.35);ctx.font="34px Georgia,serif";ctx.fillText("❧",r.width/2,r.height*.53);ctx.font="8px Montserrat,sans-serif";ctx.fillText("RUB TO REVEAL",r.width/2,r.height*.68);
 revealed=false;strokes=0;last=null;canvas.style.opacity="1";if(instruction){instruction.textContent="RUB HERE TO REVEAL";instruction.style.opacity="1";}
}
function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function erase(p){ctx.save();ctx.globalCompositeOperation="destination-out";ctx.beginPath();ctx.arc(p.x,p.y,24,0,Math.PI*2);ctx.fill();ctx.restore();}
function check(){if(!ctx||revealed)return;const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0,total=0;for(let i=3;i<data.length;i+=96){total++;if(data[i]<70)clear++;}if(total&&clear/total>.4){revealed=true;canvas.style.transition="opacity .65s ease";canvas.style.opacity="0";if(instruction){instruction.textContent="17 JANUARY 2027 · SUNDAY · 8:00 PM";instruction.style.opacity="1";}}}
if(canvas&&ctx){paint();canvas.addEventListener("pointerdown",e=>{if(revealed)return;drawing=true;last=point(e);canvas.setPointerCapture?.(e.pointerId);erase(last);});canvas.addEventListener("pointermove",e=>{if(!drawing||revealed)return;const p=point(e);if(last){const dx=p.x-last.x,dy=p.y-last.y,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/10));for(let i=1;i<=n;i++)erase({x:last.x+dx*i/n,y:last.y+dy*i/n});}last=p;strokes++;if(strokes%5===0)check();});["pointerup","pointercancel","lostpointercapture"].forEach(type=>canvas.addEventListener(type,()=>{drawing=false;last=null;check();}));reset?.addEventListener("click",paint);window.addEventListener("resize",()=>{if(!revealed)paint();});}
const eventTime=new Date("2027-01-17T20:00:00+05:00").getTime();
function countdown(){const left=Math.max(0,eventTime-Date.now()),v={days:Math.floor(left/86400000),hours:Math.floor(left%86400000/3600000),minutes:Math.floor(left%3600000/60000),seconds:Math.floor(left%60000/1000)};Object.entries(v).forEach(([id,n])=>{const el=document.getElementById(id);if(el)el.textContent=String(n).padStart(2,"0");});}
countdown();window.setInterval(countdown,1000);
const audio=document.getElementById("backgroundMusic"),music=document.getElementById("musicToggle"),musicLabel=document.getElementById("musicLabel");
music?.addEventListener("click",async()=>{if(!audio)return;if(audio.paused){try{await audio.play();music.classList.add("playing");music.setAttribute("aria-label","Pause background music");if(musicLabel)musicLabel.textContent="MUSIC ON";}catch(e){if(musicLabel)musicLabel.textContent="AUDIO UNAVAILABLE";}}else{audio.pause();music.classList.remove("playing");music.setAttribute("aria-label","Play background music");if(musicLabel)musicLabel.textContent="MUSIC OFF";}});
const share=document.getElementById("shareButton");share?.addEventListener("click",async()=>{const data={title:"Anas & Rabiya | Valima Invitation",text:"You are invited to the Valima of Anas & Rabiya on 17 January 2027 at 8:00 PM, The Liberty Ballroom, Karachi.",url:location.href};if(navigator.share){try{await navigator.share(data);}catch(e){}}else if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(location.href);const s=share.querySelector("span");if(s){s.textContent="COPIED";setTimeout(()=>s.textContent="↗",1800);}}catch(e){prompt("Copy this invitation link:",location.href);}}else prompt("Copy this invitation link:",location.href);});
});