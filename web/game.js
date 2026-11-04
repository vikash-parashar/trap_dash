function post(c){const v=c.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,W*.7);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(8,6,20,.34)");c.fillStyle=v;c.fillRect(0,0,W,H);}
const $=id=>document.getElementById(id);
const cv=$('cv'),c=cv.getContext('2d');const P=PAL.meadow;
const TILE=32,LEN=56,END=LEN*TILE;
let DPR=1,SC=1,VW=320,EXTRA=0;
// ---------- audio ----------
let AC=null,musOn=true,sfxOn=true,musTimer=null;// musTimer: true while music should play
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}return AC}
function tone(f,d,type='square',v=.06,slide=0,when=0){const a=ac();if(!a)return;const t=a.currentTime+when;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.02);}
function noise(d,v=.08,when=0){const a=ac();if(!a)return;const n=a.sampleRate*d,b=a.createBuffer(1,n,a.sampleRate),ch=b.getChannelData(0);for(let i=0;i<n;i++)ch[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource();s.buffer=b;const g=a.createGain();g.gain.value=v;s.connect(g);g.connect(a.destination);s.start(a.currentTime+when);}
const SFX={jump:()=>tone(330,.14,'square',.05,330),coin:()=>{tone(988,.07,'square',.05);tone(1319,.12,'square',.05,0,.07)},tell:()=>tone(1500,.05,'triangle',.05),
 crack:()=>noise(.25,.12),spike:()=>{tone(1800,.08,'sawtooth',.04,-900)},boom:()=>{noise(.4,.18);tone(90,.35,'sine',.2,-50)},die:()=>tone(520,.5,'triangle',.08,-380),
 pop:()=>{noise(.08,.15);tone(700,.1,'square',.05,-400)},reward:()=>{[660,880,1100].forEach((f,i)=>tone(f,.12,'triangle',.06,0,i*.08))},land:()=>noise(.05,.03),win:()=>{[523,659,784,1047].forEach((f,i)=>tone(f,.18,'square',.05,0,i*.1))}};
function sfx(n){if(sfxOn&&SFX[n])SFX[n]();}
// Background music: "Clockwork Tower" (original track, seamless loop) played gapless through Web Audio.
const MUSIC_URL='audio/clockwork-tower.mp3',MUSIC_VOL=.32;let musBuf=null,musSrc=null,musGain=null,musLoading=false;
function loadMusic(){const a=ac();if(!a||musBuf||musLoading)return;musLoading=true;
 fetch(MUSIC_URL).then(r=>r.arrayBuffer()).then(b=>new Promise((ok,no)=>a.decodeAudioData(b,ok,no))).then(buf=>{musBuf=buf;musLoading=false;if(musOn&&musTimer)startMusic();}).catch(()=>{musLoading=false;});}
function startMusic(){const a=ac();if(!a||!musBuf||musSrc)return;musGain=a.createGain();musGain.gain.setValueAtTime(0,a.currentTime);musGain.gain.linearRampToValueAtTime(MUSIC_VOL,a.currentTime+1.5);musGain.connect(a.destination);
 musSrc=a.createBufferSource();musSrc.buffer=musBuf;musSrc.loop=true;musSrc.connect(musGain);musSrc.start();}
function stopMusic(){if(!musSrc)return;const a=ac(),s=musSrc,g=musGain;musSrc=null;musGain=null;try{g.gain.setTargetAtTime(0,a.currentTime,.15);s.stop(a.currentTime+.6);}catch(e){}}
function music(on){musTimer=on||null;if(!on){stopMusic();return}if(AC&&AC.state==='suspended')AC.resume();if(musBuf)startMusic();else loadMusic();}
document.addEventListener('visibilitychange',()=>{if(!AC)return;if(document.hidden)AC.suspend();else AC.resume();});
// ---------- state ----------
let G_={level:12,hearts:3,coins:0,deaths:0,lvlCoins:0,state:'start'};
let L=null,Pl=null,time=0,toastT=0;
function rnd(a,b){return a+Math.random()*(b-a)}
function buildLevel(){const pits=[];for(const k of[14,33,46]){pits.push(k,k+1);}
 L={pits,tiles:[],traps:[],coins:[],cp:24,cpOn:false,flag:{x:END-60,ran:false,vx:0,hop:0,runs:Math.random()<.5},parts:[]};
 for(let i=0;i<LEN;i++)L.tiles.push({solid:!pits.includes(i),fall:0,falling:false});
 const cs=[5,9,12,18,21,28,31,37,40,44,50];for(const k of cs)L.coins.push({x:k*TILE+16,y:G-36,got:false,fake:false,boom:0});
 shuffleTraps(true);}
function shuffleTraps(first){for(const t of L.tiles){if(t.falling&&!L.pits.includes(L.tiles.indexOf(t))){}}
 L.tiles.forEach((t,i)=>{t.solid=!L.pits.includes(i);t.fall=0;t.falling=false;});
 L.coins.forEach(cn=>{cn.fake=false;cn.boom=0;});
 const n=4+Math.floor((G_.level-12)/2);const bad=new Set();L.pits.forEach(k=>{bad.add(k);bad.add(k-1);bad.add(k+2);});[0,1,2,3,4,L.cp,L.cp+1,LEN-1,LEN-2,LEN-3].forEach(k=>bad.add(k));
 const slots=[];for(let i=5;i<LEN-3;i++)if(!bad.has(i))slots.push(i);
 L.traps=[];const used=new Set();
 for(let k=0;k<n;k++){let s,tries=0;do{s=slots[Math.floor(Math.random()*slots.length)];tries++}while(tries<40&&[...used].some(u=>Math.abs(u-s)<4));used.add(s);
  const types=['crack','spikes','crusher','saw','axe','boulder','crack','spikes'];const coinHere=L.coins.find(cn=>Math.abs(cn.x-(s*TILE+16))<2&&!cn.got);if(coinHere)types.push('coin','coin');
  const type=types[Math.floor(Math.random()*types.length)];if(type==='coin')coinHere.fake=true;
  const z0=Math.max(0,s-Math.floor(Math.random()*2));
  L.traps.push({type,tile:s,x:s*TILE+16,d:rnd(36,62),st:'idle',t:0,z0,y:-80,h:0});}
 // decoy shakes
 L.decoys=[];for(let k=0;k<3;k++){const s=slots[Math.floor(Math.random()*slots.length)];if(!used.has(s))L.decoys.push({x:s*TILE+16,st:'idle',t:0});}
 if(!first)toast('Traps shuffle ho gaye. Good luck!');}
function spawn(){const x=L.cpOn?L.cp*TILE+16:40;Pl={x,y:G,vx:0,vy:0,on:true,face:1,dead:false,dk:0,dtype:'',coy:0,buf:0,ph:0,dx:0,dy:0};}
function startLevel(){G_.deaths=0;G_.lvlCoins=0;buildLevel();spawn();updHUD();}
// ---------- input ----------
const K={l:false,r:false,j:false};
function bindBtn(id,key){const b=$(id);const on=e=>{e.preventDefault();K[key]=true;b.classList.add('on');if(key==='j')Pl&&(Pl.buf=.12);ac();};const off=()=>{K[key]=false;b.classList.remove('on')};b.addEventListener('pointerdown',on);['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,off));}
bindBtn('cL','l');bindBtn('cR','r');bindBtn('cJ','j');
addEventListener('keydown',e=>{const k=e.code;if(['ArrowLeft','ArrowRight','ArrowUp','Space','KeyA','KeyD','KeyW'].includes(k)){const r=$('scr').getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){e.preventDefault();}}
 if(k==='ArrowLeft'||k==='KeyA')K.l=true;if(k==='ArrowRight'||k==='KeyD')K.r=true;if((k==='Space'||k==='ArrowUp'||k==='KeyW')&&!e.repeat){K.j=true;if(Pl)Pl.buf=.12;if(G_.state==='start')begin();}
 if(k==='KeyP'||k==='Escape'){G_.state==='play'?pause():G_.state==='pause'&&resume();}});
addEventListener('keyup',e=>{const k=e.code;if(k==='ArrowLeft'||k==='KeyA')K.l=false;if(k==='ArrowRight'||k==='KeyD')K.r=false;if(k==='Space'||k==='ArrowUp'||k==='KeyW')K.j=false;});
// ---------- ui ----------
const HEART='<svg class="heart" viewBox="0 0 20 18"><path d="M10 17s-8-5.2-8-10.3C2 3.6 4.3 1.5 7 1.5c1.4 0 2.4.7 3 1.6.6-.9 1.6-1.6 3-1.6 2.7 0 5 2.1 5 5.2C18 11.8 10 17 10 17z" fill="FILL" stroke="rgba(0,0,0,.35)" stroke-width="1"/><path d="M6 5c-1 .3-1.6 1.2-1.6 2" stroke="rgba(255,255,255,.6)" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';
function updHUD(){$('hearts').innerHTML=[0,1,2].map(i=>HEART.replace('FILL',i<G_.hearts?'#FF4D6D':'rgba(255,255,255,.18)')).join('');$('coin').textContent=G_.coins;$('lvl').innerHTML=`Level ${G_.level}<small>EASY*</small>`;}
function toast(t){const el=$('toast');el.textContent=t;el.style.opacity=1;toastT=1.8;}
function show(id){['sStart','sPause','sLives','sClear','sShop'].forEach(s=>$(s).hidden=s!==id);}
function begin(){ac();music(musOn);show(null);G_.state='play';}
$('bStart').onclick=begin;
function pause(){G_.state='pause';show('sPause');}function resume(){show(null);G_.state='play';}
$('bPause').onclick=()=>{if(G_.state==='play')pause();else if(G_.state==='pause')resume();};$('bResume').onclick=resume;
$('bRestart').onclick=()=>{G_.hearts=Math.max(G_.hearts,1);startLevel();resume();};
function sw(id,fn){const b=$(id);b.onclick=()=>{const v=b.getAttribute('aria-checked')!=='true';b.setAttribute('aria-checked',v);fn(v);};}
sw('tMus',v=>{musOn=v;music(v)});sw('tSfx',v=>sfxOn=v);
let freeSec=1199;setInterval(()=>{if(G_.state==='lives'){freeSec=Math.max(0,freeSec-1);$('freeT').textContent=String(Math.floor(freeSec/60)).padStart(2,'0')+':'+String(freeSec%60).padStart(2,'0');}},1000);
function playAd(count,label,done,i=1){G_.state='ad';show(null);const ad=$('ad');ad.hidden=false;$('adX').hidden=true;$('adH').textContent=count>1?`Rewarded ad ${i} of ${count}`:label;$('adP').textContent=label==='Interstitial ad'?'Level ke beech ka ad (skip in 3s)':'Poora dekhne pe hi reward milega';
 const dur=label==='Interstitial ad'?3:4;let t=0;const iv=setInterval(()=>{t+=.1;$('adBar').style.width=Math.min(100,t/dur*100)+'%';$('adCnt').textContent=Math.max(0,Math.ceil(dur-t));if(t>=dur){clearInterval(iv);$('adX').hidden=false;$('adX').onclick=()=>{ad.hidden=true;if(i<count)playAd(count,label,done,i+1);else done();};}},100);}
$('bAd1').onclick=()=>playAd(1,'Rewarded ad',()=>{G_.hearts=1;sfx('reward');updHUD();respawn();});
$('bAd3').onclick=()=>playAd(3,'Rewarded ad',()=>{G_.hearts=3;G_.coins+=50;sfx('reward');updHUD();toast('+3 lives, +50 coins');respawn();});
$('bNoAds').onclick=()=>show('sShop');$('bShopOk').onclick=()=>show('sLives');
$('bNext').onclick=()=>playAd(1,'Interstitial ad',()=>{G_.level++;startLevel();show(null);G_.state='play';toast(`Level ${G_.level}: ek trap zyada`);});
$('b2x').onclick=()=>{$('b2x').disabled=true;playAd(1,'Rewarded ad',()=>{G_.coins+=G_.lvlCoins;updHUD();sfx('reward');show('sClear');G_.state='clear';$('clrP').textContent=`${G_.deaths} deaths · ${G_.lvlCoins*2} coins (2x)`;});};
function respawn(){show(null);shuffleTraps(false);spawn();G_.state='play';}
// ---------- physics ----------
function solidAt(x){const i=Math.floor(x/TILE);if(i<0)return true;if(i>=LEN)return true;return L.tiles[i].solid;}
function kill(type){if(Pl.dead)return;Pl.dead=true;Pl.dk=0;Pl.dtype=type;Pl.dx=Pl.x;Pl.dy=Math.min(Pl.y,G+2);G_.deaths++;sfx('die');}
function step(dt){time+=dt;if(toastT>0){toastT-=dt;if(toastT<=0)$('toast').style.opacity=0;}
 for(const p of L.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.life-=dt;}L.parts=L.parts.filter(p=>p.life>0);
 for(const t of L.tiles){if(t.falling)t.fall+=dt;}
 for(const cn of L.coins)if(cn.boom>0)cn.boom+=dt;
 // flag
 const F=L.flag;if(F.runs&&!F.ran&&Pl.x>F.x-70&&!Pl.dead){F.ran=true;F.vx=1;}
 if(F.vx){F.hop+=dt*9;const nx=F.x+90*dt;if(nx>=END-20){F.vx=0;}else F.x=nx;}
 if(G_.state!=='play')return;
 if(Pl.dead){Pl.dk+=dt/1.5;if(Pl.dk>=1){G_.hearts--;updHUD();if(G_.hearts<=0){G_.state='lives';freeSec=1199;show('sLives');}else respawn();}return;}
 // move
 const acc=900,max=125;const dir=(K.r?1:0)-(K.l?1:0);if(dir){Pl.vx+=dir*acc*dt;Pl.face=dir;}else{Pl.vx*=Math.pow(.0005,dt);}Pl.vx=cl(Pl.vx,-max,max);
 Pl.buf-=dt;Pl.coy-=dt;Pl.sq=Math.max(0,(Pl.sq||0)-dt);if(Pl.on)Pl.coy=.09;
 if(Pl.buf>0&&Pl.coy>0){Pl.vy=-365;Pl.on=false;Pl.coy=0;Pl.buf=0;sfx('jump');}
 if(!K.j&&Pl.vy<-120)Pl.vy+=1400*dt;
 Pl.vy+=1100*dt;Pl.x=cl(Pl.x+Pl.vx*dt,8,END-8);const ny=Pl.y+Pl.vy*dt;
 const wasOn=Pl.on;Pl.on=false;
 if(Pl.vy>=0&&Pl.y<=G+1&&ny>=G&&(solidAt(Pl.x-5)||solidAt(Pl.x+5))){Pl.y=G;Pl.vy=0;Pl.on=true;if(!wasOn){sfx('land');Pl.sq=.14;for(let i=0;i<5;i++)L.parts.push({x:Pl.x+rnd(-8,8),y:G,vx:rnd(-40,40),vy:rnd(-60,-20),life:.35,col:'rgba(200,180,140,.8)'});}}
 else Pl.y=ny;
 if(Pl.on&&!(solidAt(Pl.x-5)||solidAt(Pl.x+5)))Pl.on=false;
 if(Math.abs(Pl.vx)>10&&Pl.on)Pl.ph+=dt*Math.abs(Pl.vx)*.11;
 if(Pl.y>H+30){kill('byebye');Pl.dy=G+2;}
 // checkpoint
 if(!L.cpOn&&Pl.x>L.cp*TILE+8){L.cpOn=true;toast('Checkpoint ✓');sfx('coin');}
 // coins
 for(const cn of L.coins){if(cn.got||cn.boom)continue;const d=Math.hypot(Pl.x-cn.x,(Pl.y-25)-cn.y);if(!cn.fake&&d<16){cn.got=true;G_.coins++;G_.lvlCoins++;updHUD();sfx('coin');for(let i=0;i<6;i++)L.parts.push({x:cn.x,y:cn.y,vx:rnd(-60,60),vy:rnd(-120,-40),life:.4,col:'#FFE27A'});}}
 // decoys
 for(const d of L.decoys){if(d.st==='idle'&&Pl.x>d.x-50){d.st='tell';d.t=0;sfx('tell');}if(d.st==='tell'){d.t+=dt;if(d.t>.3)d.st='done';}}
 // traps
 for(const t of L.traps){
  if(t.st==='idle'&&Pl.x>t.x-t.d&&Pl.x<t.x+20){t.st='tell';t.t=0;sfx('tell');}
  if(t.st==='tell'){t.t+=dt;if(t.t>=.3){t.st='fire';t.t=0;
    if(t.type==='crack'){L.tiles[t.tile].solid=false;L.tiles[t.tile].falling=true;sfx('crack');}
    if(t.type==='spikes')sfx('spike');if(t.type==='crusher'){t.y=-80;}if(t.type==='coin'){const cn=L.coins.find(q=>q.fake&&Math.abs(q.x-t.x)<2);if(cn)cn.boom=.001;sfx('boom');}}}
  if(t.st==='fire'){t.t+=dt;trapsStep(t,dt);
   if(t.type==='spikes'){t.h=eb(cl(t.t/.08));if(Pl.on&&Math.abs(Pl.x-t.x)<15){sfx('pop');kill('balloon');}}
   if(t.type==='crusher'){const k=cl(t.t/.12);t.y=lerp(-80,G-48,ei(k));if(k>=1&&t.t<.14){sfx('boom');L.shake=4;}if(k>=1&&t.t<.2&&Math.abs(Pl.x-t.x)<24)kill('afro');if(t.t>.7)t.y=lerp(G-48,-80,eo(cl((t.t-.7)/.5)));if(t.t>1.3){t.st='rearm';}}
   if(t.type==='coin'){if(t.t<.15&&Math.hypot(Pl.x-t.x,(Pl.y-25)-(G-36))<34)kill('disco');}
  }
  if(t.st==='rearm'&&Math.abs(Pl.x-t.x)>60)t.st='idle';
 }
 // flag reach
 if(Math.abs(Pl.x-L.flag.x)<12&&Pl.on&&!L.flag.vx){G_.state='clear';sfx('win');G_.coins+=0;const s=G_.deaths===0?3:G_.deaths<=2?2:1;$('clrT').textContent=`Level ${G_.level} clear!`;$('clrP').textContent=`${G_.deaths} deaths · ${G_.lvlCoins} coins`;[...$('stars').children].forEach((e,i)=>e.className=i<s?'on':'');$('b2x').disabled=false;show('sClear');}
}
// ---------- render ----------
function resize(){const r=$("game").getBoundingClientRect();if(r.width<4||r.height<4)return;DPR=Math.min(2,devicePixelRatio||1);cv.width=Math.max(1,Math.round(r.width*DPR));cv.height=Math.max(1,Math.round(r.height*DPR));
 const cw=r.width,ch=r.height;SC=ch/180;VW=cw/SC;EXTRA=0;if(VW<220){SC=cw/220;VW=220;EXTRA=ch/SC-180;}const ps=Math.round(SC*DPR*100)/100;if(Math.abs(ps-RG.ps)>.01)buildRG(ps);}
new ResizeObserver(resize).observe($('game'));
function drawCoin(x,y,red,tt){const g=c.createRadialGradient(x-3,y-3,1,x,y,10);g.addColorStop(0,red?'#FFB3B3':'#FFF3B0');g.addColorStop(.6,red?'#FF4040':'#FFC53D');g.addColorStop(1,red?'#A11':'#C98A0B');c.fillStyle=g;c.beginPath();c.ellipse(x,y,9*(Math.abs(Math.cos(tt*3+x))*.7+.3),9,0,0,7);c.fill();glow(c,x,y,18,red?'rgba(255,60,60,.5)':'rgba(255,210,90,.35)');}
function skyTop(c,tt){const sg=c.createLinearGradient(0,0,0,EXTRA+2);sg.addColorStop(0,'#2E69B5');sg.addColorStop(1,'#3F7FCB');c.fillStyle=sg;c.fillRect(0,0,VW,EXTRA+2);c.fillStyle='rgba(255,255,255,.55)';for(let i=0;i<4;i++){const cx=((i*97+tt*5)%(VW+120))-60,cy=EXTRA*(.2+i*.18);for(let j=0;j<4;j++){c.beginPath();c.ellipse(cx+j*12,cy-(j%2)*5,15-(j%3)*2,8,0,0,7);c.fill();}}}
function render(){const tt=time;c.setTransform(DPR*SC,0,0,DPR*SC,0,0);W=VW;
 if(EXTRA>0)skyTop(c,tt);c.save();c.translate(0,EXTRA);
 CAMX=cl((Pl?Pl.x:0)-VW*.36,0,END-VW);bg(c,P,tt);
 c.save();c.translate(-CAMX,0);if(L.shake>0){c.translate(rnd(-L.shake,L.shake),rnd(-L.shake,L.shake));L.shake*=.9;if(L.shake<.1)L.shake=0;}
 const v0=CAMX-40,v1=CAMX+VW+40;
 // floor segments
 let i=0;while(i<LEN){if(L.tiles[i].solid){let j=i;while(j<LEN&&L.tiles[j].solid)j++;const x0=i*TILE,x1=j*TILE;if(x1>v0&&x0<v1)floor(c,P,x0,x1);i=j;}else{const x0=i*TILE;if(x0+TILE>v0&&x0<v1)pit(c,x0,x0+TILE,P);i++;}}
 for(let k=0;k<LEN;k++){const t=L.tiles[k];if(t.falling&&t.fall<1.2){c.save();c.translate(0,ei(Math.min(1,t.fall/.5))*80);floor(c,P,k*TILE,k*TILE+TILE,G,26);c.restore();}}
 c.strokeStyle='rgba(0,0,0,.14)';c.lineWidth=1;for(let k=Math.floor(v0/TILE);k<v1/TILE;k++){if(L.tiles[k]&&L.tiles[k].solid){c.beginPath();c.moveTo(k*TILE,G+2);c.lineTo(k*TILE,G+9);c.stroke();}}
 // danger zones (Easy*: 2 tiles, 130px before)
 for(const t of L.traps){if(t.st!=='idle'&&t.st!=='tell')continue;const zx=t.z0*TILE,zw=2*TILE;if(Pl.x<zx-130||Pl.x>zx+zw+10)continue;const a=.42+.25*Math.sin(tt*10);
  const g=c.createLinearGradient(0,G-26,0,G);g.addColorStop(0,'rgba(200,48,32,0)');g.addColorStop(1,`rgba(200,48,32,${a*.5})`);c.fillStyle=g;c.fillRect(zx,G-26,zw,26);
  c.save();c.beginPath();c.rect(zx,G,zw,9);c.clip();c.fillStyle=`rgba(200,48,32,${a})`;c.fillRect(zx,G,zw,9);c.fillStyle='rgba(30,10,20,.35)';for(let x=zx-10;x<zx+zw;x+=8){const o=tt*20%8;c.beginPath();c.moveTo(x+o,G+9);c.lineTo(x+4+o,G);c.lineTo(x+7+o,G);c.lineTo(x+3+o,G+9);c.fill();}c.restore();
  c.fillStyle='#B8321F';c.beginPath();c.roundRect(zx+zw/2-8,G-42,16,13,4);c.fill();c.fillStyle='#fff';c.font='900 10px Nunito, system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('!',zx+zw/2,G-35);}
 // decoy + tell fx
 const tellFx=x=>{c.fillStyle='rgba(140,110,80,.8)';for(let q=0;q<4;q++)c.fillRect(x-10+q*6,G+3+((tt*60+q*9)%10),2,2);c.fillStyle='#fff';c.globalAlpha=.5+.5*Math.sin(tt*40);c.fillRect(x-1,G-3,2,2);c.globalAlpha=1;};
 for(const d of L.decoys)if(d.st==='tell')tellFx(d.x);
 for(const t of L.traps)if(t.st==='tell'&&t.type!=='coin'&&t.type!=='crusher')tellFx(t.x);
 // checkpoint
 const cpx=L.cp*TILE+16;c.fillStyle='#5A6070';c.fillRect(cpx-1.5,G-44,3,44);c.fillStyle=L.cpOn?'#2BB673':'#9AA0AD';c.beginPath();c.moveTo(cpx+1.5,G-44);c.lineTo(cpx+18,G-38+Math.sin(tt*6)*1.5);c.lineTo(cpx+1.5,G-32);c.fill();
 // coins
 for(const cn of L.coins){if(cn.got)continue;if(cn.boom){const k=cl(cn.boom/.35);if(k<1){c.fillStyle=`rgba(255,210,90,${1-k})`;c.beginPath();c.arc(cn.x,cn.y,10+k*40,0,7);c.fill();c.fillStyle=`rgba(255,120,40,${1-k})`;c.beginPath();c.arc(cn.x,cn.y,6+k*24,0,7);c.fill();}continue;}
  const tr=L.traps.find(t=>t.type==='coin'&&Math.abs(t.x-cn.x)<2);drawCoin(cn.x,cn.y+Math.sin(tt*4+cn.x)*2,tr&&tr.st==='tell'&&Math.floor(tt*14)%2,tt);}
 // spikes + crushers
 for(const t of L.traps){if(t.type==='spikes'&&t.st!=='idle'&&t.st!=='tell')spikesUp(c,t.x-14,t.x+14,G+2,t.h);
  if(t.type==='crusher'&&(t.st==='tell'||t.st==='fire'))drawCrusher(c,t,tt);}
 trapsDraw(c,tt);
 // flag
 const F=L.flag,hop=F.vx?-Math.abs(Math.sin(F.hop))*14:0;c.save();c.translate(F.x,G+hop);c.fillStyle='#7A7F8E';c.beginPath();c.roundRect(-9,-6,18,8,2);c.fill();c.strokeStyle='#D9DCE5';c.lineWidth=3;c.beginPath();c.moveTo(0,-6);c.lineTo(0,-62);c.stroke();c.fillStyle='#FFD166';c.beginPath();c.arc(0,-64,3.5,0,7);c.fill();
 c.fillStyle='#FF4D6D';c.beginPath();c.moveTo(2,-60);for(let q=0;q<=6;q++)c.lineTo(2+q*4,-60+Math.sin(tt*9+q)*2);c.lineTo(26,-44);for(let q=6;q>=0;q--)c.lineTo(2+q*4,-44+Math.sin(tt*9+q)*2);c.fill();c.restore();if(F.vx)say(c,F.x,G-82,'nope!');
 // player
 if(!Pl.dead){const st=!Pl.on?'air':(Math.abs(Pl.vx)>12?'run':'idle');const scared=L.traps.some(t=>t.st==='tell'&&Math.abs(t.x-Pl.x)<80);hero(c,Pl.x,Pl.y,{ph:Pl.ph,st,flip:Pl.face<0,vy:Pl.vy,sq:Pl.sq,scared,t:tt});}
 else{if(Pl.dk<.15&&Pl.dtype==='byebye')stick(c,Pl.x,Math.min(Pl.y,H),{st:'air'});death(c,Pl.dtype,Pl.dx,Pl.dtype==='balloon'?G-8:(Pl.dtype==='byebye'?G+2:G),Pl.dk,tt);}
 for(const p of L.parts){c.fillStyle=p.col;c.fillRect(p.x,p.y,2,2);}
 c.restore();fgLayer(c);c.restore();H=180+EXTRA;post(c);H=180;
 $('progI').style.width=(Pl.x/END*100)+'%';}
let last=performance.now();function loop(now){const dt=Math.min(.033,(now-last)/1000);last=now;if(G_.state==='play'||G_.state==='clear'||G_.state==='lives')step(G_.state==='play'?dt:0);if(G_.state!=='ad')time+=G_.state==='play'?0:dt;render();requestAnimationFrame(loop);}
startLevel();resize();requestAnimationFrame(loop);
// ---------- devices ----------
const DEV={pl:[20,9,'phone'],pp:[9,20,'phone'],tl:[4,3,'tablet'],tp:[3,4,'tablet']};
function setDev(k){const d=$('dev');document.querySelectorAll('.bar .chip[id^="d-"]').forEach(b=>b.setAttribute('aria-pressed',b.id==='d-'+k));
 if(k==='fs'){const el=$('dev');(el.requestFullscreen?el.requestFullscreen():Promise.reject()).catch(()=>{});d.className='device full';d.style.width='100%';d.style.height=Math.min(innerHeight*.9,900)+'px';layoutO();return;}
 const [aw,ah,kind]=DEV[k];d.className='device '+kind;const box=$('stage').getBoundingClientRect().width;const maxH=Math.max(420,Math.min(innerHeight*.82,760));let w=Math.min(box,kind==='tablet'?900:1000),h=w*ah/aw;if(h>maxH){h=maxH;w=h*aw/ah;}d.style.width=w+'px';d.style.height=h+'px';layoutO();try{localStorage.setItem('tnf-dev',k)}catch(e){}}
function layoutO(){const r=$('dev').getBoundingClientRect();$('scr').classList.toggle('portrait',r.height>r.width);}
['pl','pp','tl','tp','fs'].forEach(k=>$('d-'+k).onclick=()=>setDev(k));
$('lookT').textContent=NOIR?'Purana look':'Naya dark look';
for(const k of Object.keys(MOODS)){const b=$('m-'+k);b.setAttribute('aria-pressed',NOIR&&k===MOOD);b.onclick=()=>{MOOD=k;try{localStorage.setItem('td-mood',k);localStorage.setItem('td-look','noir')}catch(e){}if(!NOIR)location.reload();for(const q of Object.keys(MOODS))$('m-'+q).setAttribute('aria-pressed',q===k);};}$('lookT').onclick=()=>{try{localStorage.setItem('td-look',NOIR?'color':'noir')}catch(e){}location.reload();};
document.addEventListener('fullscreenchange',()=>{const d=$('dev');if(document.fullscreenElement){d.style.width='100vw';d.style.height='100vh';}else if(d.classList.contains('full')){setDev(innerWidth<700?'pp':'pl');}layoutO();});
addEventListener('resize',()=>{const d=$('dev');if(d.classList.contains('full')&&document.fullscreenElement)layoutO();});
let saved=null;try{saved=localStorage.getItem('tnf-dev')}catch(e){}
setDev(saved&&saved!=='fs'?saved:(innerWidth<700?'pp':'pl'));
new ResizeObserver(layoutO).observe($('dev'));

// ---------- hero picker ----------
(function(){const box=$('heroes');const cards=[];
 for(const k of Object.keys(SKINS)){const S=SKINS[k];const el=document.createElement('button');el.type='button';el.className='hcard';el.id='h-'+k;el.setAttribute('aria-pressed',k===SKIN);
  el.innerHTML=`<canvas width="480" height="300" aria-hidden="true"></canvas><span class="hn">${S.name}</span><span class="ht">${S.tag}</span>`;box.appendChild(el);
  const cx=el.querySelector('canvas').getContext('2d');cx.setTransform(2,0,0,2,0,0);cards.push({k,cx,el});
  el.onclick=()=>{if(k!=='kai'){toast(S.name+': '+S.tag);return;}SKIN=k;cards.forEach(q=>q.el.setAttribute('aria-pressed',q.k===k));try{localStorage.setItem('tnf-hero',k)}catch(e){}toast(S.name+' selected');};}
 try{const s=localStorage.getItem('tnf-hero');if(s==='kai'&&SKINS[s]){SKIN=s;cards.forEach(q=>q.el.setAttribute('aria-pressed',q.k===s));}}catch(e){}
 function anim(now){const t=now/1000;for(const q of cards){const c2=q.cx;const oW=W;W=240;c2.save();
   const g2=c2.createLinearGradient(0,0,0,150);g2.addColorStop(0,'#2A2F4A');g2.addColorStop(1,'#1B1E2D');c2.fillStyle=g2;c2.fillRect(0,0,240,150);
   glow(c2,120,70,90,'rgba(255,197,61,.12)');c2.fillStyle='#232739';c2.fillRect(0,118,240,32);c2.fillStyle='#2F3450';c2.fillRect(0,118,240,2);
   const cyc=(t+cards.indexOf(q)*1.3)%4;let st='run',vy=0,y=118,sq=0,ph=t*13;
   if(cyc<1.6)st='run';else if(cyc<2.3){st='air';const k=(cyc-1.6)/.7;y=118-Math.sin(k*Math.PI)*16;vy=k<.5?-300:300;}else if(cyc<2.45){st='idle';sq=.14-(cyc-2.3);}else st='idle';
   c2.translate(0,-22);c2.scale(1.6,1.6);const ox=75/1;
   c2.save();c2.translate(0,(118-G));c2.restore();
   c2.setTransform(2,0,0,2,0,0);c2.translate(120,118);c2.scale(1.6,1.6);c2.translate(-120,-G);
   hero(c2,120,G-(118-y)/1.6,{skin:q.k,st,ph,vy,sq,t,noShadow:false});
   c2.restore();c2.setTransform(2,0,0,2,0,0);W=oW;}
  requestAnimationFrame(anim);}
 requestAnimationFrame(anim);})();
