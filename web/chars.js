// ---------- characters: Kai (hero), Mira (kidnapped), Shera's gang ----------
const SIL='#0A0B0C';
// Coloured side-view people with real proportions. Heights follow the casting page
// (Kai 178 cm, Mira 165 cm, goons 186 cm, Shera 190 cm), so everyone is the right size next to each other.
for(const k of Object.keys(SKINS))delete SKINS[k];
Object.assign(SKINS,{
 kai:{name:'Kai',tag:'Mira ko bachane nikla hai',kind:'boy',h:178,skin:'#C98D5E',hair:'messy',hc:'#1C130E',top:'hoodie',tc:'#5B6470',pants:'#2F4A6E',shoes:'#E9E4DA',sole:'#C9433A',scarf:'#D63A28',rim:'#FFB27A'},
 mira:{name:'Mira',tag:'Level 1000 pe qaid hai',kind:'girl',h:165,skin:'#E3AE80',hair:'long',hc:'#1E140E',top:'kurti',tc:'#E3B23C',emb:'#B0412E',pants:'#F1ECE2',shoes:'#9A3B2C',rim:'#9FF3E6'},
 goon:{name:'Gunde',tag:'Shera ke aadmi',kind:'goon',h:186,skin:'#80502F',hair:'buzz',hc:'#0E0A07',top:'vest',tc:'#1B1B1D',pants:'#4A4A3E',shoes:'#1A1A1A',beard:'stubble',build:1.18,rim:'#FF8A7A'},
 shera:{name:'Shera',tag:'Gang ka boss',kind:'goon',h:190,skin:'#C98D5E',hair:'bald',hc:'#111',top:'suit',tc:'#ECE6D8',inner:'#1C1C1C',pants:'#E3DCCD',shoes:'#5A3A22',beard:'full',shades:true,build:1.12,rim:'#FFD27A'}});
SKIN='kai';
function _sh(c,t){if(c[0]!=='#')return c;let h=c.slice(1);if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16),m=t>0?255:0,a=Math.abs(t);return'#'+[n>>16,n>>8&255,n&255].map(v=>Math.round(v+(m-v)*a).toString(16).padStart(2,'0')).join('');}
function seg(c,x,y,a1,a2,l1,l2,w1,w2,col,col2){const kx=x+Math.sin(a1)*l1,ky=y+Math.cos(a1)*l1,fx=kx+Math.sin(a1+a2)*l2,fy=ky+Math.cos(a1+a2)*l2;
 c.lineCap='round';c.lineJoin='round';c.strokeStyle='rgba(10,6,4,.55)';c.lineWidth=w1+.8;c.beginPath();c.moveTo(x,y);c.lineTo(kx,ky);c.stroke();c.lineWidth=w2+.8;c.beginPath();c.moveTo(kx,ky);c.lineTo(fx,fy);c.stroke();
 c.strokeStyle=col;c.lineWidth=w1;c.beginPath();c.moveTo(x,y);c.lineTo(kx,ky);c.stroke();c.strokeStyle=col2||col;c.lineWidth=w2;c.beginPath();c.moveTo(kx,ky);c.lineTo(fx,fy);c.stroke();return[fx,fy,a1+a2,kx,ky];}
// pose angles per state; ph = run phase. Joint angles in radians, 0 = straight down.
function pose(st,ph,vy,t){const s=Math.sin(ph),s2=Math.sin(ph+Math.PI);
 if(st==='run')return{l:[s*.85,-Math.max(0,Math.sin(ph-1.2))*1.5-.1],r:[s2*.85,-Math.max(0,Math.sin(ph+Math.PI-1.2))*1.5-.1],al:[-s*.9,-.9],ar:[-s2*.9,-.9],bob:-Math.abs(Math.cos(ph))*1.6,lean:.18};
 if(st==='air')return vy<0?{l:[.9,-1.5],r:[-.3,-.4],al:[2.4,-.4],ar:[-.6,-1.0],bob:0,lean:.1}:{l:[.4,-.6],r:[-.15,-.3],al:[2.0+Math.sin(t*20)*.15,-.3],ar:[-1.6,-.4],bob:0,lean:.05};
 if(st==='fall')return{l:[.9+Math.sin(t*9)*.6,-1.1],r:[-.5+Math.sin(t*9+2)*.6,-.9],al:[2.8+Math.sin(t*13)*.5,-.3],ar:[-2.5+Math.sin(t*11)*.5,-.2],bob:0,lean:-.2};
 if(st==='zap')return{l:[.45,0],r:[-.45,0],al:[2.4,-.2],ar:[-2.4,.2],bob:0,lean:0};
 if(st==='slide')return{l:[1.2,-.2],r:[.6,-.4],al:[-2.2,.3],ar:[-1.6,.4],bob:4,lean:-.35};
 if(st==='struggle')return{l:[.6+Math.sin(t*14)*.5,-.8],r:[-.4+Math.sin(t*14+2)*.5,-.6],al:[2.6+Math.sin(t*11)*.4,-.5],ar:[-2.2+Math.sin(t*12)*.4,-.4],bob:0,lean:0};
 if(st==='down')return{l:[1.4,-.3],r:[1.2,-.6],al:[1.6,.3],ar:[1.2,.5],bob:0,lean:-1.35};
 if(st==='slump')return{l:[.35,-.9],r:[.15,-1.1],al:[.5,.1],ar:[.2,.2],bob:0,lean:.55};
 if(st==='carry')return{l:[s*.4,-.2-Math.max(0,s)*.4],r:[s2*.4,-.2-Math.max(0,s2)*.4],al:[2.6,-1.5],ar:[2.2,-1.9],bob:-Math.abs(Math.cos(ph))*.8,lean:.12};
 if(st==='walk')return{l:[s*.45,-Math.max(0,Math.sin(ph-1.2))*.7],r:[s2*.45,-Math.max(0,Math.sin(ph+Math.PI-1.2))*.7],al:[-s*.4,-.3],ar:[-s2*.4,-.3],bob:-Math.abs(Math.cos(ph))*.7,lean:.04};
 const b=Math.sin(t*2.2)*.03;return{l:[.08,-.04],r:[-.1,-.04],al:[.18+b,-.25],ar:[-.12-b,-.3],bob:Math.sin(t*2.2)*.3,lean:0};}
function figure(c,S,o){const st=o.st||'idle',t=o.t??performance.now()/1000,ph=o.ph||0,vy=o.vy||0;const P=o.pose||pose(st,ph,vy,t);
 const sc=S.h/178,b=S.build||1,girl=S.kind==='girl',big=S.kind==='goon';
 c.save();c.scale(sc,sc);let sx=1,sy=1;if(o.sq>0){const q=o.sq/.14;sx=1+.14*q;sy=1-.14*q;}c.scale(sx,sy);c.translate(0,P.bob);
 const hipY=-17,shY=-30,lw=(girl?3.3:3.7)*Math.sqrt(b),aw=(girl?2.4:2.9)*b,bw=b*(girl?.9:1);
 const pantsD=_sh(S.pants,-.28),topD=_sh(S.tc,-.3),skinD=_sh(S.skin,-.22);
 const sleeve=S.top==='vest'?S.skin:S.tc,sleeveD=S.top==='vest'?skinD:topD;
 const shoe=(x,y,a,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x+Math.cos(a)*1.7,y-Math.sin(a)*.4,3.2,1.6,-a*.25,0,7);c.fill();if(S.sole){c.fillStyle=S.sole;c.fillRect(x+Math.cos(a)*1.7-3,y+.6,6,.7);}};
 // back limbs (in shade)
 {const[fx,fy,fa]=seg(c,-1,hipY,P.r[0],P.r[1],8.6,8.6,lw,lw*.85,pantsD);shoe(fx,fy,fa,_sh(S.shoes,-.3));}
 c.save();c.translate(0,hipY);c.rotate(P.lean);c.translate(0,-hipY);
 {const[hx,hy]=seg(c,-1,shY+1.5,P.ar[0],P.ar[1],6.4,6.2,aw,aw*.85,sleeveD,S.top==='kurti'?_sh(S.skin,-.25):sleeveD);c.fillStyle=skinD;c.beginPath();c.arc(hx,hy,1.4,0,7);c.fill();}
 // torso
 const tw=(big?5.6:girl?3.4:3.8)*bw;
 const torso=new Path2D();torso.moveTo(-tw*.9,hipY+1);torso.quadraticCurveTo(-tw*1.15,shY+6,-tw*.95,shY);torso.quadraticCurveTo(0,shY-2.4,tw,shY);torso.quadraticCurveTo(tw*1.2+(big?1:0),shY+7,tw*.9,hipY+1);torso.closePath();
 const g=c.createLinearGradient(-tw,0,tw,0);g.addColorStop(0,_sh(S.tc,-.35));g.addColorStop(.55,S.tc);g.addColorStop(1,_sh(S.tc,.15));
 if(S.top==='vest'){c.fillStyle=S.skin;c.fill(torso);const v=new Path2D();v.moveTo(-tw*.85,hipY+1);v.quadraticCurveTo(-tw*1.1,shY+6,-tw*.6,shY+.5);v.lineTo(tw*.2,shY+2.5);v.quadraticCurveTo(tw*.9,shY+1,tw*.75,shY+4);v.quadraticCurveTo(tw*1.1,shY+8,tw*.9,hipY+1);v.closePath();c.fillStyle=g;c.fill(v);}
 else{c.fillStyle=g;c.fill(torso);}
 c.strokeStyle='rgba(10,6,4,.5)';c.lineWidth=.6;c.stroke(torso);
 if(S.top==='kurti'){const fl=Math.sin(t*5+ph)*1;c.beginPath();c.moveTo(-tw*.95,hipY-2);c.lineTo(tw*.95,hipY-2);c.lineTo(tw*1.6+fl,hipY+6);c.quadraticCurveTo(0,hipY+7.5,-tw*1.6+fl*.5,hipY+6);c.closePath();c.fillStyle=g;c.fill();c.stroke();c.strokeStyle=S.emb;c.lineWidth=.9;c.beginPath();c.moveTo(-tw*1.55+fl*.5,hipY+5.4);c.quadraticCurveTo(0,hipY+6.8,tw*1.55+fl,hipY+5.4);c.stroke();}
 if(S.top==='hoodie'){c.fillStyle=topD;c.beginPath();c.ellipse(-2.6,shY-.5,2.6,2.2,0,0,7);c.fill();c.strokeStyle=_sh(S.tc,-.2);c.lineWidth=.6;c.beginPath();c.moveTo(-tw*.6,hipY-3);c.lineTo(tw*.7,hipY-3);c.stroke();c.fillStyle=_sh(S.tc,-.25);c.fillRect(-tw*.9,hipY-.5,tw*1.8,1.5);}
 if(S.top==='suit'){c.fillStyle=S.inner;c.beginPath();c.moveTo(tw*.25,shY);c.lineTo(tw*.95,shY+.4);c.lineTo(tw*.75,shY+8);c.closePath();c.fill();c.fillStyle='#8E1E2A';c.fillRect(tw*.6,shY+1,.9,6);c.fillStyle=_sh(S.tc,-.35);c.fillRect(-tw*.9,hipY,tw*1.8,1.2);}
 if(big&&S.top!=='suit'){c.strokeStyle='#E6BE4A';c.lineWidth=.6;c.setLineDash([.7,.5]);c.beginPath();c.moveTo(-1,shY);c.quadraticCurveTo(tw*.6,shY+4.5,tw*.95,shY+.5);c.stroke();c.setLineDash([]);}
 // neck + head
 const hy=shY-6.4,hr=(big?5.2:girl?4.5:4.7);c.fillStyle=S.skin;c.fillRect(-.4,shY-3.4,2.6,3.6);
 if(S.hair==='long'){const sw=st==='run'?1:.4;c.fillStyle=S.hc;c.beginPath();c.moveTo(-2.5,hy-3.5);c.bezierCurveTo(-7,hy-1+Math.sin(t*7)*sw,-6.5,hy+7+Math.sin(t*7+1)*sw,-4.5-sw*2.5,shY+5+Math.sin(t*7+2)*sw*1.5);c.lineTo(-1.2,shY+1);c.lineTo(.5,hy);c.closePath();c.fill();}
 const hg=c.createRadialGradient(2.5,hy-1.5,.5,1,hy,hr*1.2);hg.addColorStop(0,_sh(S.skin,.12));hg.addColorStop(1,skinD);c.fillStyle=hg;c.beginPath();c.ellipse(1,hy,hr*.95,hr,0,0,7);c.fill();
 // profile: brow, nose, jaw facing right
 c.beginPath();c.moveTo(hr*.8,hy-1.5);c.quadraticCurveTo(hr+1.9,hy+.4,hr+.6,hy+1.3);c.lineTo(hr*.9,hy+1.6);c.fill();
 c.beginPath();c.moveTo(-hr*.2,hy+hr*.6);c.quadraticCurveTo(hr*.5,hy+hr*1.15,hr+.4,hy+hr*.55);c.lineTo(hr*.7,hy);c.fill();
 c.fillStyle=skinD;c.beginPath();c.ellipse(-.6,hy+.4,1.1,1.5,0,0,7);c.fill();
 // face details
 const scared=o.scared||((st==='air'||st==='fall')&&vy>150);const bl=!scared&&(t%3.6)<.12;
 if(S.shades){c.fillStyle='#0c0d10';c.fillRect(hr*.25,hy-1.6,hr*.85,1.7);c.fillStyle='rgba(255,255,255,.4)';c.fillRect(hr*.35,hy-1.4,.8,.4);}
 else{c.fillStyle='#fff';c.beginPath();c.ellipse(hr*.62,hy-.7,scared?1.05:.85,bl?.15:(scared?1.05:.7),0,0,7);c.fill();if(!bl){c.fillStyle='#24140b';c.beginPath();c.arc(hr*.72,hy-.65,scared?.55:.48,0,7);c.fill();}
  c.strokeStyle=girl?'#1b0f08':S.hc;c.lineWidth=girl?.4:.55;c.beginPath();c.moveTo(hr*.2,hy-(big||o.angry?1.6:2.1));c.lineTo(hr*1.0,hy-(big?2.4:2.2));c.stroke();}
 c.strokeStyle=girl?'#A8434A':_sh(S.skin,-.45);c.lineWidth=girl?.6:.4;c.beginPath();if(scared){c.ellipse(hr*.82,hy+2.6,.55,.75,0,0,7);c.stroke();}else{c.moveTo(hr*.55,hy+2.6);c.lineTo(hr*.95,hy+2.5);c.stroke();}
 if(S.beard){c.fillStyle=S.beard==='stubble'?'rgba(25,15,10,.35)':S.hc;c.beginPath();c.moveTo(-hr*.3,hy+.8);c.quadraticCurveTo(hr*.2,hy+hr*1.25,hr+.3,hy+hr*.6);c.lineTo(hr*.95,hy+1.9);c.quadraticCurveTo(hr*.3,hy+2.4,-hr*.1,hy+.5);c.closePath();c.fill();}
 // hair
 c.fillStyle=S.hc;
 if(S.hair==='messy'){c.beginPath();c.moveTo(-hr*.95,hy+1.5);c.quadraticCurveTo(-hr*1.15,hy-hr*.9,0,hy-hr*1.05);for(let i=0;i<6;i++){const a=Math.PI*(1.0+i*.11);c.lineTo(1+Math.cos(a)*(hr+1.6+(i%2)*1),hy+Math.sin(a)*(hr+1.6+(i%2)*1)-.4);c.lineTo(1+Math.cos(a+.06)*hr,hy+Math.sin(a+.06)*hr-.2);}c.lineTo(hr*1.05,hy-hr*.5);c.quadraticCurveTo(hr*.6,hy-hr*.35,hr*.2,hy-hr*.55);c.quadraticCurveTo(-hr*.2,hy-.2,-hr*.5,hy+1.8);c.closePath();c.fill();}
 else if(S.hair==='long'){c.beginPath();c.moveTo(-hr*.95,hy+2);c.quadraticCurveTo(-hr*1.15,hy-hr*1.1,hr*.4,hy-hr*1.05);c.quadraticCurveTo(hr*1.15,hy-hr*.8,hr*1.0,hy-hr*.3);c.quadraticCurveTo(hr*.4,hy-hr*.55,0,hy-hr*.45);c.quadraticCurveTo(-hr*.3,hy,-hr*.4,hy+2.5);c.closePath();c.fill();}
 else if(S.hair==='buzz'){c.globalAlpha=.75;c.beginPath();c.arc(1,hy,hr*1.0,Math.PI*1.02,Math.PI*1.82);c.quadraticCurveTo(0,hy-hr*.4,-hr*.7,hy+.5);c.fill();c.globalAlpha=1;}
 else if(S.hair==='bald'){c.fillStyle='rgba(255,255,255,.22)';c.beginPath();c.ellipse(0,hy-hr*.6,1.6,.7,-.3,0,7);c.fill();}
 // scarf: wraps the neck, two tails flutter behind with speed
 if(S.scarf&&o.scarf!==false){const sp=st==='run'?1:(st==='air'||st==='fall'?.8:.25);c.save();c.fillStyle=c.strokeStyle=S.scarf;c.beginPath();c.ellipse(.6,shY-1.4,3.6,1.7,0,0,7);c.fill();c.lineCap='round';
  for(let k=0;k<2;k++){c.strokeStyle=k?_sh(S.scarf,-.2):S.scarf;c.lineWidth=2-k*.4;c.beginPath();c.moveTo(-2.5,shY-1);let px=-2.5,py=shY-1;for(let i=1;i<=5;i++){const q=i/5,L=8+sp*9-k*2;px=-2.5-L*q;py=shY-1+q*(4-sp*3)+Math.sin(t*11+i*1.3+k*2)*(1+sp*1.6)*q;c.lineTo(px,py);}c.stroke();}c.restore();}
 c.restore();
 // front limbs
 c.save();c.translate(0,hipY);c.rotate(P.lean*.4);c.translate(0,-hipY);
 {const[fx,fy,fa]=seg(c,1,hipY,P.l[0],P.l[1],8.6,8.6,lw,lw*.85,S.pants);shoe(fx,fy,fa,S.shoes);}
 c.restore();
 c.save();c.translate(0,hipY);c.rotate(P.lean);c.translate(0,-hipY);
 {const[hx,hy2]=seg(c,1.5,shY+1.5,P.al[0],P.al[1],6.4,6.2,aw,aw*.85,sleeve,S.top==='kurti'?S.skin:sleeve);c.fillStyle=S.skin;c.beginPath();c.arc(hx,hy2,1.5,0,7);c.fill();}
 c.restore();
 c.restore();}
function person(c,x,y,o={}){const S=SKINS[o.skin||SKIN]||SKINS.kai;const t=o.t??performance.now()/1000;
 if(!o.noShadow&&y<=G+.5&&y>G-90&&!o.rot){const k=1-(G-y)/90;c.fillStyle=`rgba(0,0,0,${.38*k})`;c.beginPath();c.ellipse(x,G+1.2,10*k+3,2.2*k+.5,0,0,7);c.fill();}
 c.save();c.translate(x,y);if(o.flip)c.scale(-1,1);if(o.rot)c.rotate(o.rot);if(o.alpha!=null)c.globalAlpha=o.alpha;
 // soft rim light from the moon/sun behind
 if(!o.noRim&&S.rim){c.save();c.globalAlpha*=.55;c.filter='blur(.6px)';c.translate(-.7,-.5);const R={...S,tc:S.rim,pants:S.rim,shoes:S.rim,skin:S.rim,hc:S.rim,scarf:S.scarf?S.rim:null,emb:S.rim,inner:S.rim,sole:null};figure(c,R,o);c.restore();}
 figure(c,S,o);c.restore();}
hero=function(c,x,y,o={}){return person(c,x,y,o);};
stick=function(c,x,y,o={}){return person(c,x,y,o);};
// ---------- deaths: a person reacting like a person, not a cartoon ----------
// k goes 0..1 over 1.5 s. Falls tumble into the dark; hits knock the body back to the ground; the screen fades.
death=function(c,type,x,y,k,t){
 if(type==='byebye'){const fy=G+ei(cl(k*1.3))*120-Math.max(0,.18-k)*40;person(c,x,fy,{st:'fall',t,vy:300,rot:k*1.6,noShadow:true,alpha:1-cl((k-.5)*2),scared:true});
  if(k<.6){c.fillStyle=`rgba(0,0,0,${k})`;}return;}
 // hit: stagger, knees give, fall backwards and lie still
 const r=k<.12?-.25*Math.sin(k/.12*Math.PI):-eb(cl((k-.12)/.33))*1.5,st=k<.12?'zap':(k<.45?'slump':'down');
 c.save();c.translate(x,y);
 if(type==='disco'||type==='zap'){if(k<.4&&Math.floor(t*30)%2){c.strokeStyle='#CFE6FF';c.lineWidth=.8;c.beginPath();let px=-6,py=-40;c.moveTo(px,py);for(let i=0;i<6;i++){px+=rnd(-3,5);py+=7;c.lineTo(px,py);}c.stroke();}}
 if(k<.25){c.fillStyle=`rgba(180,20,20,${.35*(1-k/.25)})`;c.beginPath();c.ellipse(0,-20,18,24,0,0,7);c.fill();}
 c.restore();
 const lie=k>.45;person(c,x+(lie?-4:0),y+(lie?-3:0),{st,t,rot:lie?-1.45:r,noShadow:lie,scared:true,pose:lie?{l:[.3,-.2],r:[.1,-.5],al:[1.9,-.6],ar:[2.5,-.2],bob:0,lean:0}:null});
 if(type==='crush'||type==='afro'){c.fillStyle='rgba(120,110,95,.5)';for(let i=0;i<6;i++){c.beginPath();c.arc(x+Math.cos(i)*k*30,G-2-Math.abs(Math.sin(i*2))*k*10,2+k*3,0,7);c.fill();}}};
