// ---------- story cutscenes: the kidnap intro and the level 1000 rescue ----------
// Drawn live on a canvas over the game with the same fog, silhouettes and grain, with subtitles and sound.
const ST={on:false,which:'intro',t:0,last:0,raf:0,cv:null,cx:null,sub:null,done:null,amb:null};
const INTRO_LEN=25,END_LEN=16;
function stEase(a,b,t0,t1,t){const k=cl((t-t0)/(t1-t0),0,1);return a+(b-a)*(k*k*(3-2*k));}
function stSub(t){const S=ST.which==='intro'?[
  [0,4.6,'Ek shaam. Kai aur Mira jungle ke raaste ghar laut rahe the.'],
  [4.8,8.6,'Tabhi door se ek gaadi ki roshni dikhi…'],
  [8.8,12.8,'Gundon ne Mira ko utha liya!'],
  [12.9,15.8,'"KAI!"'],
  [16,20.4,'Shera ka gair-kaanooni live show: TRAP TOWER. Inaam: Mira, 1000vi manzil pe.'],
  [20.6,25,'Har manzil pe jaal, har 100 pe ek boss, aur duniya bet laga rahi hai. Kai ruka nahi.']]:[
  [0,4,'Level 1000. Trap Tower ki chhat.'],
  [4.2,8,'Aakhri boss gir gaya.'],
  [8.2,12,'"Mujhe pata tha tum aaoge."'],
  [12.2,16,'Mira azaad hai. Reward unlock!']];
 for(const s of S)if(t>=s[0]&&t<s[1])return s[2];return '';}
// ---- sound (made on the fly; the real game uses recorded effects) ----
function stEngine(on){const a=ac();if(!a)return;if(on&&!ST.amb){const o=a.createOscillator(),o2=a.createOscillator(),f=a.createBiquadFilter(),g=a.createGain();o.type='sawtooth';o.frequency.value=48;o2.type='square';o2.frequency.value=24;f.type='lowpass';f.frequency.value=260;g.gain.value=0;o.connect(f);o2.connect(f);f.connect(g);g.connect(a.destination);o.start();o2.start();ST.amb={o,o2,g,f};}
 if(!on&&ST.amb){try{ST.amb.o.stop();ST.amb.o2.stop();}catch(e){}ST.amb=null;}}
function stEngineLevel(v,pitch){if(!ST.amb)return;const a=ac();ST.amb.g.gain.setTargetAtTime(v*(sfxOn?1:0),a.currentTime,.1);ST.amb.o.frequency.setTargetAtTime(48*pitch,a.currentTime,.1);ST.amb.o2.frequency.setTargetAtTime(24*pitch,a.currentTime,.1);}
const stCues=[];function stCue(t,fn){stCues.push([t,fn]);}
function stPlayCues(t0,t1){if(!sfxOn)return;for(const[t,fn]of stCues)if(t>=t0&&t<t1)fn();}
function heartbeat(when=0){tone(62,.12,'sine',.22,-20,when);tone(55,.14,'sine',.16,-20,when+.18);}
function buildCues(){stCues.length=0;
 if(ST.which==='intro'){stCue(5,()=>stEngine(true));stCue(9.2,()=>noise(.18,.12));stCue(9.6,()=>noise(.15,.1));stCue(10.8,()=>{tone(620,.25,'sawtooth',.05,300);});
  stCue(11.6,()=>{noise(.25,.16);tone(90,.3,'sine',.2,-40);});stCue(13.1,()=>{tone(880,.55,'triangle',.07,-420);});stCue(13.6,()=>noise(.12,.1));
  for(let i=0;i<7;i++)stCue(16.2+i*.75,()=>heartbeat());stCue(20.6,()=>{tone(110,1.2,'sawtooth',.05,55);tone(165,1.2,'sawtooth',.04,82);});}
 else{stCue(.2,()=>noise(1.2,.05));stCue(4.3,()=>{noise(.5,.2);tone(70,.6,'sine',.25,-40);});stCue(8.4,()=>{tone(523,.4,'triangle',.05);tone(659,.4,'triangle',.05,0,.25);tone(784,.7,'triangle',.05,0,.5);});
  stCue(12.3,()=>{[523,659,784,1047].forEach((f,i)=>tone(f,.35,'square',.05,0,i*.12));});}}
// ---- scene props ----
function jeep(c,x,y,t,speed){c.save();c.translate(x,y);c.fillStyle=SIL;
 c.beginPath();c.roundRect(-30,-22,60,15,3);c.fill();c.beginPath();c.moveTo(-18,-22);c.lineTo(-12,-36);c.lineTo(10,-36);c.lineTo(16,-22);c.fill();
 c.fillRect(-34,-15,6,4);c.fillRect(28,-15,6,4);
 for(const wx of[-19,19]){c.beginPath();c.arc(wx,-6,6.5,0,7);c.fill();c.strokeStyle='#1d1f20';c.lineWidth=.8;const a=t*speed*.9;c.beginPath();c.moveTo(wx+Math.cos(a)*4,-6+Math.sin(a)*4);c.lineTo(wx-Math.cos(a)*4,-6-Math.sin(a)*4);c.stroke();}
 c.fillStyle='rgba(255,40,40,.9)';c.fillRect(28,-19,2.5,3);glow(c,30,-17,10,'rgba(255,40,40,.5)');
 c.restore();}
function headlight(c,x,y,dir,a){c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,y,2,x,y,140);g.addColorStop(0,`rgba(255,236,190,${.55*a})`);g.addColorStop(1,'rgba(255,236,190,0)');c.fillStyle=g;c.beginPath();c.moveTo(x,y);c.lineTo(x+dir*150,y-26);c.lineTo(x+dir*150,y+24);c.closePath();c.fill();glow(c,x,y,14,`rgba(255,245,215,${.8*a})`);c.restore();}
function tower(c,x,y,h,t,lit){c.save();c.fillStyle='rgba(12,13,14,.92)';c.beginPath();c.moveTo(x-16,y);c.lineTo(x-13,y-h);c.lineTo(x-6,y-h-10);c.lineTo(x+6,y-h-10);c.lineTo(x+13,y-h);c.lineTo(x+16,y);c.fill();
 for(let i=0;i<14;i++){const wy=y-12-i*(h-20)/14;for(const wx of[-7,0,7]){if(hash(i*3+wx)>.7){c.fillStyle=`rgba(255,120,60,${.25+.2*Math.sin(t*2+i)})`;c.fillRect(x+wx-1,wy,2,3);}}}
 if(lit){c.fillStyle='#4FE3D2';c.fillRect(x-2.5,y-h-6,5,5);glow(c,x,y-h-4,26,`rgba(79,227,210,${.6+.3*Math.sin(t*4)})`);
  c.fillStyle='rgba(255,255,255,.9)';c.font='900 8px "Lilita One", system-ui';c.textAlign='center';c.fillText('1000',x,y-h-16);}
 c.restore();}
function fireflies(c,t,n){for(let i=0;i<n;i++){const x=(hash(i)*W+Math.sin(t*.4+i)*16)%W,y=70+hash(i+4)*60+Math.sin(t*.9+i*2)*6,a=.4+.6*Math.abs(Math.sin(t*1.8+i));glow(c,x,y,4,`rgba(255,230,140,${a*.8})`);}}
function chest(c,x,y,open,t){c.save();c.translate(x,y);c.fillStyle='#3A2512';c.fillRect(-9,-10,18,10);c.fillStyle='#E9B84A';c.fillRect(-9,-6,18,1.5);c.fillRect(-1.5,-8,3,4);
 c.save();c.translate(-9,-10);c.rotate(-open*1.2);c.fillStyle='#4A3018';c.beginPath();c.roundRect(0,-5,18,5,[3,3,0,0]);c.fill();c.restore();
 if(open>0){glow(c,0,-12,34*open,`rgba(255,210,90,${.7*open})`);for(let i=0;i<8;i++){const a=t*2+i*.8;c.fillStyle='rgba(255,230,150,.9)';c.fillRect(Math.cos(a)*14*open,-14-Math.abs(Math.sin(a))*14*open,1.4,1.4);}}
 c.restore();}
// ---- the two scenes ----
function drawIntro(c,t){
 // camera: follows the couple, holds on the kidnap, then pans to the tower
 const cam=t<5?stEase(0,60,0,5,t):t<16?60:stEase(60,140,16,20,t)+(t>20?(t-20)*40:0);CAMX=cam;const tt=time;
 bg(c,P0,tt);
 if(t>15.6){const a=stEase(0,1,15.6,17.5,t);c.save();c.globalAlpha=a;tower(c,W*.74,G-6,78,tt,true);c.restore();}
 c.save();c.translate(-CAMX,0);floor(c,P0,CAMX-40,CAMX+W+40);
 // Kai + Mira walk in
 const walkX=stEase(70,150,0,6,t);
 let kx=walkX,mx=walkX+12,kst='walk',mst='walk',kph=t*7,mph=t*7+.6,my=G,ky=G,mflip=false;
 if(t>5){kst='idle';mst='idle';}
 // jeep arrives 5-9, waits, leaves 13.2+
 const jx=t<5?999:t<9?stEase(CAMX+W+60,248,5,9,t):t<13.2?248:stEase(248,CAMX+W+400,13.2,16,t);
 if(t>5&&t<16){const a=t<9?stEase(0,1,5,7,t):stEase(1,0,13.2,15.5,t);headlight(c,jx-32,G-15,-1,a);}
 // goons: out at 9.4, grab at 11, back to jeep 12.6
 const gs=[];if(t>9.2&&t<13.4){for(let i=0;i<3;i++){let gx=t<11?stEase(240+i*6,mx+10+i*14,9.4+i*.2,11,t):t<12.6?mx+10+i*14:stEase(mx+10+i*14,240,12.6,13.3,t);gs.push(gx);}}
 
 if(t>=13.3)mx=-999;
 if(t>10.2&&t<11.8){kst='run';kx=stEase(walkX,mx-12,10.2,11.3,t);kph=t*14;}
 if(t>=11.6&&t<16.4){kst='down';kx=Math.max(walkX-14,stEase(mx-12,walkX-18,11.6,12.2,t));ky=G;}
 if(t>=16.4&&t<18){kst='idle';}
 if(t>=18){kst='run';kx=walkX-18+(t-18)*55;kph=t*14;}
 // Mira's scarf flies off and lands by Kai; he picks it up at 17
 if(t>12.8&&t<17.2){const sx=stEase(gs[0]??240,walkX-6,12.8,15,t),sy=stEase(G-40,G-2,12.8,15,t)+Math.sin(t*6)*(t<15?3:0);c.save();c.strokeStyle='#E8432E';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(sx-6,sy);c.quadraticCurveTo(sx,sy-3+Math.sin(t*9)*2,sx+6,sy);c.stroke();c.restore();}
 const carried=t>10.9&&t<13.3;if(mx>-900&&!carried)person(c,mx,my,{skin:'mira',st:mst,ph:mph,t:tt,flip:mflip,scared:t>8.8});
 for(let i=gs.length-1;i>=0;i--){const back=t>=12.6;person(c,gs[i],G,{skin:'goon',st:i===0&&carried?'carry':'walk',ph:t*6+i,t:tt,flip:!back});}
 if(carried)person(c,gs[0]+(t>=12.6?4:-4),G-30,{skin:'mira',st:'struggle',t:tt,flip:t<12.6,rot:t<12.6?-1.2:1.2,noShadow:true});
 const ks=SKINS.kai.scarf;if(t<17.2)SKINS.kai.scarf=null;person(c,kx,ky,{skin:'kai',st:kst,ph:kph,t:tt,scared:t>8.8&&t<16});SKINS.kai.scarf=ks;
 if(jx<CAMX+W+300)jeep(c,jx,G,tt,t>13.2?14:(t<9?10:0));
 c.restore();fgLayer(c);
 if(t<5)fireflies(c,tt,8);
 post(c);
 // title card at the end
 if(t>20.6){const a=stEase(0,1,20.6,22,t);c.save();c.globalAlpha=a;c.fillStyle='rgba(0,0,0,.35)';c.fillRect(0,0,W,H);c.textAlign='center';c.fillStyle='#F4F1EA';c.font='28px "Lilita One", system-ui';c.fillText('TRAP DASH',W/2,66);
  c.font='800 8.5px Nunito, system-ui';c.fillStyle='rgba(244,241,234,.85)';c.fillText('LEVEL 1  →  1000',W/2,81);c.restore();}}
function drawEnding(c,t){CAMX=40;const om=MOOD;MOOD='moon';const tt=time;bg(c,P0,tt);
 c.save();c.translate(-CAMX,0);floor(c,P0,CAMX-40,CAMX+W+40);
 // boss falls back at 4.2, cage opens at 7.5, they meet at 9
 const bx=t<4.2?230:stEase(230,330,4.2,5.4,t),by=t<4.2?G:stEase(G,G+120,4.2,5.6,t);
 person(c,bx,by,{skin:'shera',st:t<4.2?'idle':'down',t:tt,flip:true,rot:t>4.2?stEase(0,1.4,4.2,5.4,t):0,noShadow:t>4.2});
 const kx=t<3.2?stEase(100,180,0,3.2,t):t<4.3?stEase(180,212,3.2,4.3,t):t<5?stEase(212,190,4.3,5,t):t<8?190:stEase(190,206,8,9,t);
 const ky=t>3.2&&t<4.5?G-Math.sin((t-3.2)/1.3*Math.PI)*26:G;
 person(c,kx,ky,{skin:'kai',st:t<3.2?'run':(t<4.5?'air':(t>8&&t<9?'walk':'idle')),vy:t<3.85?-200:200,ph:t*13,t:tt});
 // cage
 const cx=232,open=stEase(0,1,7.3,8.2,t);c.save();c.strokeStyle='#121314';c.lineWidth=1.4;for(let i=0;i<6;i++){const x=cx-10+i*4;c.beginPath();c.moveTo(x,G-46+open*-30);c.lineTo(x,G+open*-30);c.stroke();}c.fillStyle='#121314';c.fillRect(cx-12,G-48+open*-30,24,3);c.restore();
 const mx=t<8.4?cx:stEase(cx,218,8.4,9.2,t);person(c,mx,G,{skin:'mira',st:t>8.4&&t<9.2?'walk':'idle',ph:t*7,t:tt,flip:true});
 if(t>9.4){glow(c,(kx+mx)/2,G-30,40,'rgba(255,150,170,.35)');c.fillStyle='rgba(255,110,140,.95)';const hy=G-58-Math.sin((t-9.4)*2)*3;c.beginPath();c.moveTo(212,hy);c.bezierCurveTo(206,hy-6,200,hy+2,212,hy+9);c.bezierCurveTo(224,hy+2,218,hy-6,212,hy);c.fill();}
 if(t>11.6)chest(c,250,G,stEase(0,1,12,13,t),tt);
 c.restore();fgLayer(c);post(c);
 if(t>12.2){const a=stEase(0,1,12.2,13.4,t);c.save();c.globalAlpha=a;c.textAlign='center';c.fillStyle='#FFE08A';c.font='18px "Lilita One", system-ui';c.fillText('REWARD UNLOCKED',W/2,54);
  c.font='800 7.5px Nunito, system-ui';c.fillStyle='rgba(244,241,234,.9)';c.fillText('Golden scarf · Hall of Fame · Ampli All Access',W/2,66);c.restore();}
 MOOD=om;}
const P0={};
function stFrame(now){if(!ST.on)return;const dt=Math.min(.05,(now-ST.last)/1000);ST.last=now;const t0=ST.t;ST.t+=dt;stPlayCues(t0,ST.t);
 if(ST.which==='intro'){const a=ST.t<5?0:ST.t<9?stEase(0,.07,5,9,ST.t):ST.t<13.2?.05:stEase(.08,0,13.2,16,ST.t);stEngineLevel(a,ST.t>13.2?1.8:(ST.t<9?1.2:.8));}
 const r=ST.cv.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);if(ST.cv.width!==Math.round(r.width*dpr)){ST.cv.width=Math.round(r.width*dpr);ST.cv.height=Math.round(r.height*dpr);}
 const Z=1.35,sc=r.height/180;const vw=r.width/sc/Z;const c=ST.cx;c.setTransform(dpr*sc,0,0,dpr*sc,0,0);c.fillStyle='#000';c.fillRect(0,0,r.width/sc,180);c.scale(Z,Z);c.translate(0,154.8/Z-G);const oW=W,oH=H,oC=CAMX;W=vw;H=G+40;
 (ST.which==='intro'?drawIntro:drawEnding)(c,ST.t);
 // letterbox bars + fade in/out
 c.setTransform(dpr*sc,0,0,dpr*sc,0,0);const SW=r.width/sc;const len=ST.which==='intro'?INTRO_LEN:END_LEN;c.fillStyle='#000';c.fillRect(0,0,SW,12);c.fillRect(0,168,SW,12);
 const fade=Math.max(stEase(1,0,0,1.2,ST.t),stEase(0,1,len-.8,len,ST.t));if(fade>0){c.fillStyle=`rgba(0,0,0,${fade})`;c.fillRect(0,0,SW,180);}
 W=oW;H=oH;CAMX=oC;
 ST.sub.textContent=stSub(ST.t);
 if(ST.t>=len){stEnd();return;}
 ST.raf=requestAnimationFrame(stFrame);}
function stPlay(which,done){ac();ST.which=which;ST.t=0;ST.on=true;ST.done=done;buildCues();ST.last=performance.now();$('story').hidden=false;stEngine(false);ST.raf=requestAnimationFrame(stFrame);}
function stEnd(){ST.on=false;cancelAnimationFrame(ST.raf);stEngine(false);$('story').hidden=true;const d=ST.done;ST.done=null;if(d)d();}
(function(){ST.cv=$('stcv');ST.cx=ST.cv.getContext('2d');ST.sub=$('stsub');$('stskip').onclick=stEnd;
 $('bStory').onclick=()=>stPlay('intro',()=>show('sStart'));$('bEnding').onclick=()=>stPlay('ending',()=>show('sStart'));
 // first launch: the intro plays once before level 1
 let seen=false;try{seen=localStorage.getItem('td-intro')==='1'}catch(e){}
 if(!seen){const ob=$('bStart').onclick;$('bStart').onclick=()=>{try{localStorage.setItem('td-intro','1')}catch(e){}$('bStart').onclick=ob;stPlay('intro',()=>ob());};}
})();
window.tdStory={play:stPlay,seek:t=>{ST.t=t;}};
