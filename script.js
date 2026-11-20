
document.addEventListener("DOMContentLoaded",()=>{
const intro=document.getElementById("intro");
const invitation=document.getElementById("invitation");
const openButton=document.getElementById("openInvite");
let opened=false;
openButton?.addEventListener("click",()=>{
if(opened)return;
opened=true;
intro.classList.add("is-opening");
window.setTimeout(()=>{
intro.hidden=true;
intro.style.display="none";
invitation.classList.remove("hidden");
window.scrollTo({top:0,behavior:"instant"});
invitation.querySelectorAll(".reveal").forEach((el,i)=>window.setTimeout(()=>el.classList.add("visible"),i*140));
},1050);
});
const revealItems=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window){
const observer=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("visible");
observer.unobserve(entry.target);
}
});
},{threshold:0.12});
revealItems.forEach(el=>observer.observe(el));
}else{
revealItems.forEach(el=>el.classList.add("visible"));
}
const letterCard=document.getElementById("letterCard");
letterCard?.addEventListener("click",()=>{
const isOpen=letterCard.classList.toggle("is-open");
letterCard.setAttribute("aria-expanded",String(isOpen));
});
const canvas=document.getElementById("scratchCanvas");
const scratchCard=document.getElementById("scratchCard");
const instruction=document.getElementById("scratchInstruction");
const resetButton=document.getElementById("resetScratch");
const ctx=canvas?.getContext("2d",{willReadFrequently:true});
let scratching=false;
let revealed=false;
let scratchCount=0;
let lastPoint=null;
function drawFeather(x,y,angle){
if(!ctx)return;
ctx.save();
ctx.translate(x,y);
ctx.rotate(angle);
ctx.globalCompositeOperation="destination-out";
ctx.lineCap="round";
ctx.lineJoin="round";
ctx.beginPath();
ctx.moveTo(-34,0);
ctx.quadraticCurveTo(-8,-9,25,-2);
ctx.quadraticCurveTo(8,4,-34,0);
ctx.fill();
for(let i=0;i<9;i++){
const t=i/9;
const px=-27+t*48;
const py=-5+Math.sin(t*Math.PI)*2;
ctx.beginPath();
ctx.moveTo(px,py);
ctx.quadraticCurveTo(px-5,py-10,px-10,py-11);
ctx.quadraticCurveTo(px-4,py-4,px,py);
ctx.fill();
ctx.beginPath();
ctx.moveTo(px,py);
ctx.quadraticCurveTo(px-4,py+7,px-9,py+9);
ctx.quadraticCurveTo(px-3,py+3,px,py);
ctx.fill();
}
ctx.beginPath();
ctx.moveTo(-35,0);
ctx.lineTo(30,-1);
ctx.lineWidth=2;
ctx.stroke();
ctx.restore();
}
function paintScratchLayer(){
if(!canvas||!ctx||!scratchCard)return;
const rect=scratchCard.getBoundingClientRect();
if(!rect.width||!rect.height)return;
const dpr=Math.min(2,window.devicePixelRatio||1);
canvas.width=Math.round(rect.width*dpr);
canvas.height=Math.round(rect.height*dpr);
canvas.style.width=rect.width+"px";
canvas.style.height=rect.height+"px";
ctx.setTransform(dpr,0,0,dpr,0,0);
const w=rect.width,h=rect.height;
const gradient=ctx.createLinearGradient(0,0,w,h);
gradient.addColorStop(0,"#e8d6b8");
gradient.addColorStop(.45,"#c5a474");
gradient.addColorStop(1,"#ead9bd");
ctx.globalCompositeOperation="source-over";
ctx.clearRect(0,0,w,h);
ctx.fillStyle=gradient;
ctx.fillRect(0,0,w,h);
ctx.strokeStyle="rgba(255,248,232,.65)";
ctx.lineWidth=1;
ctx.strokeRect(9,9,w-18,h-18);
ctx.fillStyle="rgba(116,85,54,.18)";
for(let i=0;i<22;i++){
const x=18+(i*37%(Math.max(1,w-36)));
const y=18+(i*53%(Math.max(1,h-36)));
ctx.beginPath();
ctx.arc(x,y,1,0,Math.PI*2);
ctx.fill();
}
ctx.fillStyle="#745536";
ctx.textAlign="center";
ctx.font="600 9px Montserrat,sans-serif";
ctx.fillText("A LITTLE SURPRISE FOR YOU",w/2,h*.34);
ctx.font="30px Georgia,serif";
ctx.fillText("❧",w/2,h*.53);
ctx.font="8px Montserrat,sans-serif";
ctx.fillText("RUB THE FEATHER TO REVEAL",w/2,h*.68);
scratchCount=0;
revealed=false;
lastPoint=null;
canvas.style.opacity="1";
canvas.style.transition="none";
if(instruction){
instruction.textContent="RUB HERE TO REVEAL";
instruction.style.opacity="1";
}
}
function getPoint(event){
const rect=canvas.getBoundingClientRect();
return{x:event.clientX-rect.left,y:event.clientY-rect.top};
}
function scratchAt(event){
if(!ctx||!canvas||!scratching||revealed)return;
const point=getPoint(event);
let angle=0;
if(lastPoint){
const dx=point.x-lastPoint.x;
const dy=point.y-lastPoint.y;
angle=Math.atan2(dy,dx);
}
drawFeather(point.x,point.y,angle);
if(lastPoint){
const dx=point.x-lastPoint.x;
const dy=point.y-lastPoint.y;
const distance=Math.hypot(dx,dy);
const steps=Math.max(1,Math.ceil(distance/12));
for(let i=1;i<steps;i++){
const t=i/steps;
drawFeather(lastPoint.x+dx*t,lastPoint.y+dy*t,angle);
}
}
lastPoint=point;
scratchCount++;
if(instruction&&scratchCount>2)instruction.style.opacity=".2";
if(scratchCount>12&&scratchCount%4===0)checkReveal();
}
function checkReveal(){
if(!ctx||!canvas||revealed)return;
const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
let transparent=0;
let total=0;
for(let i=3;i<data.length;i+=64){
total++;
if(data[i]<80)transparent++;
}
if(total&&transparent/total>.42){
revealed=true;
canvas.style.transition="opacity .7s ease";
canvas.style.opacity="0";
if(instruction){
instruction.textContent="17 JANUARY 2027 · SUNDAY · 8:00 PM";
instruction.style.opacity="1";
}
}
}
if(canvas&&ctx){
paintScratchLayer();
canvas.addEventListener("pointerdown",event=>{
if(revealed)return;
scratching=true;
lastPoint=null;
canvas.setPointerCapture?.(event.pointerId);
scratchAt(event);
});
canvas.addEventListener("pointermove",scratchAt);
["pointerup","pointercancel","lostpointercapture"].forEach(type=>{
canvas.addEventListener(type,()=>{
scratching=false;
lastPoint=null;
});
});
resetButton?.addEventListener("click",paintScratchLayer);
window.addEventListener("resize",()=>{
if(!revealed)paintScratchLayer();
});
}
const eventTime=new Date("2027-01-17T20:00:00+05:00").getTime();
function updateCountdown(){
const remaining=Math.max(0,eventTime-Date.now());
const parts={
days:Math.floor(remaining/86400000),
hours:Math.floor((remaining%86400000)/3600000),
minutes:Math.floor((remaining%3600000)/60000),
seconds:Math.floor((remaining%60000)/1000)
};
Object.entries(parts).forEach(([id,value])=>{
const node=document.getElementById(id);
if(node)node.textContent=String(value).padStart(2,"0");
});
}
updateCountdown();
window.setInterval(updateCountdown,1000);
const audio=document.getElementById("backgroundMusic");
const musicToggle=document.getElementById("musicToggle");
const musicLabel=document.getElementById("musicLabel");
musicToggle?.addEventListener("click",async()=>{
if(!audio)return;
if(audio.paused){
try{
await audio.play();
musicToggle.classList.add("playing");
musicToggle.setAttribute("aria-label","Pause background music");
if(musicLabel)musicLabel.textContent="MUSIC ON";
}catch(error){
if(musicLabel)musicLabel.textContent="ADD MUSIC FILE";
}
}else{
audio.pause();
musicToggle.classList.remove("playing");
musicToggle.setAttribute("aria-label","Play background music");
if(musicLabel)musicLabel.textContent="MUSIC OFF";
}
});
const shareButton=document.getElementById("shareButton");
shareButton?.addEventListener("click",async()=>{
const shareData={
title:"Anas & Rabiya | Valima Invitation",
text:"You are invited to the Valima of Anas & Rabiya on 17 January 2027 at 8:00 PM, The Liberty Ballroom, Karachi.",
url:window.location.href
};
if(navigator.share){
try{await navigator.share(shareData);}catch(error){}
}else if(navigator.clipboard?.writeText){
try{
await navigator.clipboard.writeText(window.location.href);
shareButton.innerHTML="LINK COPIED <span>✓</span>";
window.setTimeout(()=>shareButton.innerHTML='SHARE INVITATION <span>↗</span>',1800);
}catch(error){
window.prompt("Copy this invitation link:",window.location.href);
}
}else{
window.prompt("Copy this invitation link:",window.location.href);
}
});
});
