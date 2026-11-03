// ---------- hero ----------
const OUT='#1B1B2A';
const SKINS={
 dash:{name:'Dash',tag:'Hoodie wala bhaagne ka shaukeen',skin:'#F1C19A',hood:'#FF7A3D',pants:'#3557A8',shoe:'#F4F4F8',sole:'#E2364A',hair:'#3A2418',kind:'boy'},
 nova:{name:'Nova',tag:'Ponytail, tez aur bindaas',skin:'#C68A5E',hood:'#19B5A5',pants:'#2E3350',shoe:'#FF6FA5',sole:'#FFFFFF',hair:'#22140E',kind:'girl'},
 bolt:{name:'Bolt',tag:'Chhota robot, bada dil',skin:'#9AA3B5',hood:'#FFC53D',pants:'#5B6475',shoe:'#3E4556',sole:'#22D3EE',hair:'#3E4556',kind:'robot'}};
let SKIN='dash';
function seg2(c,x,y,a1,a2,L1,L2){const kx=x+Math.sin(a1)*L1,ky=y+Math.cos(a1)*L1;const fx=kx+Math.sin(a1+a2)*L2,fy=ky+Math.cos(a1+a2)*L2;return[kx,ky,fx,fy];}
function limbDraw(c,x,y,kx,ky,fx,fy,col,w){c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(x,y);c.lineTo(kx,ky);c.lineTo(fx,fy);c.strokeStyle=OUT;c.lineWidth=w+2.6;c.stroke();c.strokeStyle=col;c.lineWidth=w;c.stroke();}
function hero(c,x,y,o={}){const S=SKINS[o.skin||SKIN],tint=o.tint;const T=k=>tint||S[k];
 const ph=o.ph||0,st=o.st||'idle',s=Math.sin(ph),vy=o.vy||0,tt=o.t??performance.now()/1000;
 // shadow
 if(!o.noShadow&&y<=G+.5&&y>G-90&&!o.rot){const k=1-(G-y)/90;c.fillStyle=`rgba(0,0,0,${.3*k})`;c.beginPath();c.ellipse(x,G+1.5,12*k+3,2.8*k+.6,0,0,7);c.fill();}
 c.save();c.translate(x,y);if(o.flip)c.scale(-1,1);if(o.rot)c.rotate(o.rot);
 // squash & stretch
 let sx=1,sy=1;if(o.sq>0){const q=o.sq/.14;sx=1+.16*q;sy=1-.16*q;}else if(st==='air'){const k=cl(-vy/365,-1,1);sx=1-.06*k;sy=1+.08*k;}
 if(st==='idle'){const b=Math.sin(tt*2.4)*.018;sy+=b;sx-=b*.5;}
 c.scale(sx,sy);
 const bob=st==='run'?-Math.abs(s)*2.4:0;const lean=st==='run'?.13:(st==='air'?.05:0);
 c.translate(0,bob);c.rotate(lean);
 const hipY=-14,shY=-27;
 // leg poses
 let L1,L2,A1,A2;
 if(st==='run'){L1=[s*.85,-(.15+Math.max(0,-s)*1.3)];L2=[-s*.85,-(.15+Math.max(0,s)*1.3)];A1=[-s*1.0,1.1];A2=[s*1.0,1.1];}
 else if(st==='air'){if(vy<0){L1=[.9,-1.6];L2=[-.35,-.5];A1=[1.75,-.5];A2=[-2.3,-.4];}else{L1=[.3,-.4];L2=[-.25,-.2];A1=[1.9+Math.sin(tt*30)*.25,-.4];A2=[-2.4+Math.cos(tt*30)*.3,-.3];}}
 else if(st==='zap'){L1=[.5,0];L2=[-.5,0];A1=[2.1,-.3];A2=[-2.3,.3];}
 else if(st==='slide'){L1=[.7,-.2];L2=[-.4,-.3];A1=[2.1,.5];A2=[-2.6,-.6];}
 else{L1=[.12,-.05];L2=[-.12,-.05];A1=[.25,.35];A2=[-.2,.4];}
 const leg=(p,back)=>{const[kx,ky,fx,fy]=seg2(c,back?-2:2,hipY,p[0],p[1],7.5,7.5);limbDraw(c,back?-2:2,hipY,kx,ky,fx,fy,back?shade(T('pants'),-.18):T('pants'),5.2);
  c.save();c.translate(fx+1.5,fy);c.rotate(p[0]+p[1]*.5);c.fillStyle=OUT;c.beginPath();c.ellipse(1.2,0,5.6,3.6,0,0,7);c.fill();c.fillStyle=back?shade(T('shoe'),-.15):T('shoe');c.beginPath();c.ellipse(1.2,-.3,4.4,2.6,0,0,7);c.fill();c.fillStyle=T('sole');c.fillRect(-3,1.1,8.6,1.3);c.restore();};
 const arm=(p,back)=>{const ax=back?-3:3;const[kx,ky,fx,fy]=seg2(c,ax,shY,p[0],p[1],6,6);limbDraw(c,ax,shY,kx,ky,fx,fy,back?shade(T('hood'),-.2):T('hood'),4.8);c.fillStyle=OUT;c.beginPath();c.arc(fx,fy,3.4,0,7);c.fill();c.fillStyle=S.kind==='robot'&&!tint?'#C9D1DF':T('skin');c.beginPath();c.arc(fx,fy,2.3,0,7);c.fill();};
 // hair back / ponytail / antenna
 const hx=1,hy=-42,R=11.5;
 if(S.kind==='girl'){const sw=Math.sin(tt*6+ph*.5)*.25+(st==='run'?.5:0)+(st==='air'&&vy>0?-.6:0);c.save();c.translate(hx-9,hy-5);c.rotate(sw);c.fillStyle=OUT;c.beginPath();c.ellipse(-6,4,7.5,4.6,.5,0,7);c.fill();c.fillStyle=T('hair');c.beginPath();c.ellipse(-6,4,6,3.4,.5,0,7);c.fill();c.fillStyle=tint||'#FF6FA5';c.beginPath();c.arc(0,0,2.4,0,7);c.fill();c.restore();}
 leg(L2,true);arm(A2,true);
 // torso hoodie
 c.save();const tg=c.createLinearGradient(-9,-31,9,-12);tg.addColorStop(0,tint||shade(S.hood,.18));tg.addColorStop(1,tint||shade(S.hood,-.15));c.fillStyle=OUT;c.beginPath();c.roundRect(-10.3,-32.3,20.6,20.6,7.5);c.fill();c.fillStyle=tg;c.beginPath();c.roundRect(-9,-31,18,18,6.5);c.fill();
 if(!tint){if(S.kind==='robot'){c.fillStyle='#1F2233';c.beginPath();c.roundRect(-4,-25,8,6,2);c.fill();c.fillStyle=Math.floor(tt*3)%2?'#22D3EE':'#5EE6B5';c.fillRect(-2.6,-23.5,2,3);c.fillRect(.6,-23.5,2,3);}
  else{c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1.2;c.beginPath();c.moveTo(-5,-18);c.quadraticCurveTo(0,-16,5,-18);c.stroke();c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=1.1;c.beginPath();c.moveTo(-2,-30);c.lineTo(-2.6,-24);c.moveTo(2,-30);c.lineTo(2.6,-24);c.stroke();}}
 c.restore();
 leg(L1,false);
 // head
 c.save();c.translate(hx,hy+(st==='run'?Math.abs(s)*.8:0));
 if(S.kind==='robot'){c.strokeStyle=OUT;c.lineWidth=2.2;c.beginPath();c.moveTo(-1,-R);c.quadraticCurveTo(-3+Math.sin(tt*8)*2,-R-6,-2+Math.sin(tt*8)*3,-R-9);c.stroke();c.fillStyle=tint||(Math.floor(tt*2)%2?'#FF5C7A':'#FFD166');c.beginPath();c.arc(-2+Math.sin(tt*8)*3,-R-9,2.6,0,7);c.fill();
  c.fillStyle=OUT;c.beginPath();c.roundRect(-R-1.3,-R-1.3,2*R+2.6,2*R+1.6,9);c.fill();const hg=c.createLinearGradient(0,-R,0,R);hg.addColorStop(0,tint||'#FFE08A');hg.addColorStop(1,tint||'#E9A800');c.fillStyle=hg;c.beginPath();c.roundRect(-R,-R,2*R,2*R-1,8);c.fill();
  if(!tint){c.fillStyle='#1B2030';c.beginPath();c.roundRect(-6,-6,R+5,10,5);c.fill();const bl=(tt%3.2)<.12;c.fillStyle='#5EEAD4';c.shadowColor='#5EEAD4';c.shadowBlur=6;c.beginPath();c.roundRect(-1,-3.5+(bl?2:0),3.4,bl?1:5,1.5);c.fill();c.beginPath();c.roundRect(5,-3.5+(bl?2:0),3.4,bl?1:5,1.5);c.fill();c.shadowBlur=0;c.fillStyle='rgba(255,255,255,.35)';c.fillRect(-5,-5,6,1.5);}}
 else{
  if(S.kind==='boy'&&!tint){c.fillStyle=OUT;c.beginPath();c.arc(-3,2,R+1.2,Math.PI*.55,Math.PI*1.45);c.fill();c.fillStyle=shade(S.hood,-.12);c.beginPath();c.arc(-3,2,R,Math.PI*.55,Math.PI*1.45);c.fill();}
  c.fillStyle=OUT;c.beginPath();c.arc(0,0,R+1.3,0,7);c.fill();const hg=c.createRadialGradient(-3,-4,2,0,0,R);hg.addColorStop(0,tint||shade(S.skin,.15));hg.addColorStop(1,tint||shade(S.skin,-.08));c.fillStyle=hg;c.beginPath();c.arc(0,0,R,0,7);c.fill();
  // hair cap
  if(!tint||tint){c.fillStyle=tint?shade(tint,-.2):S.hair;c.beginPath();c.arc(0,0,R,Math.PI*1.02,Math.PI*1.98);c.quadraticCurveTo(4,-5,-2,-4);c.quadraticCurveTo(-8,-3,-R,-1);c.fill();
   if(S.kind==='boy'){c.beginPath();c.moveTo(-4,-R+1);c.lineTo(-1,-R-4);c.lineTo(2,-R+.5);c.lineTo(5,-R-3);c.lineTo(7,-R+2);c.fill();}}
  if(!tint){c.fillStyle='rgba(255,120,120,.35)';c.beginPath();c.ellipse(8,3.5,2.4,1.5,0,0,7);c.fill();}
  // ear
  c.fillStyle=tint||shade(S.skin,-.1);c.beginPath();c.arc(-4.5,1,2.3,0,7);c.fill();
 }
 // eyes (human)
 if(S.kind!=='robot'){const scared=o.scared||(st==='air'&&vy>120);const bl=!scared&&(tt%3.4)<.11;const ex1=2.2,ex2=7.8,ey=-1;const look=st==='run'?1:.4;
  for(const ex of[ex1,ex2]){if(bl){c.strokeStyle=OUT;c.lineWidth=1.4;c.beginPath();c.moveTo(ex-2.6,ey);c.lineTo(ex+2.6,ey);c.stroke();continue;}
   c.fillStyle='#fff';c.beginPath();c.ellipse(ex,ey,scared?3.6:3,scared?4.4:3.7,0,0,7);c.fill();c.strokeStyle=OUT;c.lineWidth=1;c.stroke();c.fillStyle=OUT;c.beginPath();c.arc(ex+look,ey+.3,scared?1.2:1.8,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(ex+look+.6,ey-.6,.6,0,7);c.fill();}
  c.strokeStyle=OUT;c.lineWidth=1.3;c.beginPath();if(scared){c.moveTo(.2,-6.5);c.lineTo(3.6,-7.6);c.moveTo(6.4,-7.6);c.lineTo(9.8,-6.5);}else{c.moveTo(.4,-6.2);c.lineTo(3.8,-6.8);c.moveTo(6.2,-6.8);c.lineTo(9.6,-6.2);}c.stroke();
  c.fillStyle=OUT;c.beginPath();if(scared){c.ellipse(6,5.2,1.6,2,0,0,7);}else{c.arc(6,4.2,2.2,.15*Math.PI,.85*Math.PI);}c.fill();}
 c.restore();
 arm(A1,false);
 c.restore();}
// deaths & other code call stick(): route to hero, tinted when a colour is given
stick=function(c,x,y,o={}){return hero(c,x,y,{...o,tint:o.col&&o.col!==HERO?o.col:null});};
