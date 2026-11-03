// ---------- characters: Kai (hero), Mira (kidnapped), the goons ----------
// Slim silhouettes with real proportions and a proper run cycle, a thin rim of colour, glowing eyes.
// Kai wears Mira's red scarf (she drops it during the kidnap), so the scarf is his colour accent.
for(const k of Object.keys(SKINS))delete SKINS[k];
Object.assign(SKINS,{
 kai:{name:'Kai',tag:'Mira ko bachane nikla hai',rim:'#FF6A3D',eye:'#FFE3C4',kind:'boy',scarf:'#E8432E'},
 mira:{name:'Mira',tag:'Level 1000 pe qaid hai',rim:'#4FE3D2',eye:'#E6FFFB',kind:'girl',scarf:'#E8432E'},
 goon:{name:'Gunde',tag:'Har 100 level pe ek boss',rim:'#FF3B4E',eye:'#FF2E43',kind:'goon'}});
SKIN='kai';
const SIL='#0A0B0C';
function limb(c,x,y,a1,a2,l1,l2,w1,w2){const kx=x+Math.sin(a1)*l1,ky=y+Math.cos(a1)*l1,fx=kx+Math.sin(a1+a2)*l2,fy=ky+Math.cos(a1+a2)*l2;
 c.lineCap='round';c.lineJoin='round';c.lineWidth=w1;c.beginPath();c.moveTo(x,y);c.lineTo(kx,ky);c.stroke();c.lineWidth=w2;c.beginPath();c.moveTo(kx,ky);c.lineTo(fx,fy);c.stroke();return[fx,fy,a1+a2];}
// pose angles per state; ph = run phase
function pose(st,ph,vy,t){const s=Math.sin(ph),s2=Math.sin(ph+Math.PI);
 if(st==='run')return{l:[s*.85,-Math.max(0,Math.sin(ph-1.2))*1.5-.1],r:[s2*.85,-Math.max(0,Math.sin(ph+Math.PI-1.2))*1.5-.1],al:[-s*.9,-.9],ar:[-s2*.9,-.9],bob:-Math.abs(Math.cos(ph))*1.6,lean:.18};
 if(st==='air')return vy<0?{l:[.9,-1.5],r:[-.3,-.4],al:[2.4,-.4],ar:[-.6,-1.0],bob:0,lean:.1}:{l:[.4,-.6],r:[-.15,-.3],al:[2.0+Math.sin(t*20)*.15,-.3],ar:[-1.6,-.4],bob:0,lean:.05};
 if(st==='zap')return{l:[.45,0],r:[-.45,0],al:[2.4,-.2],ar:[-2.4,.2],bob:0,lean:0};
 if(st==='slide')return{l:[1.2,-.2],r:[.6,-.4],al:[-2.2,.3],ar:[-1.6,.4],bob:4,lean:-.35};
 if(st==='struggle')return{l:[.6+Math.sin(t*14)*.5,-.8],r:[-.4+Math.sin(t*14+2)*.5,-.6],al:[2.6+Math.sin(t*11)*.4,-.5],ar:[-2.2+Math.sin(t*12)*.4,-.4],bob:0,lean:0};
 if(st==='down')return{l:[1.4,-.3],r:[1.2,-.6],al:[1.6,.3],ar:[1.2,.5],bob:0,lean:-1.35};
 if(st==='carry')return{l:[s*.4,-.2-Math.max(0,s)*.4],r:[s2*.4,-.2-Math.max(0,s2)*.4],al:[1.9,-1.3],ar:[1.7,-1.4],bob:-Math.abs(Math.cos(ph))*.8,lean:.06};
 if(st==='walk')return{l:[s*.45,-Math.max(0,Math.sin(ph-1.2))*.7],r:[s2*.45,-Math.max(0,Math.sin(ph+Math.PI-1.2))*.7],al:[-s*.4,-.3],ar:[-s2*.4,-.3],bob:-Math.abs(Math.cos(ph))*.7,lean:.04};
 const b=Math.sin(t*2.2)*.03;return{l:[.08,-.04],r:[-.1,-.04],al:[.18+b,-.25],ar:[-.12-b,-.3],bob:Math.sin(t*2.2)*.3,lean:0};}
function figure(c,S,o,col,eyes){const st=o.st||'idle',t=o.t??performance.now()/1000,ph=o.ph||0,vy=o.vy||0;const P=pose(st,ph,vy,t);
 const big=S.kind==='goon',sc=big?1.32:(S.kind==='girl'?.94:1);
 c.save();c.scale(sc,sc);let sx=1,sy=1;if(o.sq>0){const q=o.sq/.14;sx=1+.14*q;sy=1-.14*q;}c.scale(sx,sy);
 c.translate(0,P.bob);const hipY=-17,shY=-30;c.fillStyle=col;c.strokeStyle=col;
 const lw=big?4.8:3.6,lw2=big?4:3;
 // back limbs
 limb(c,-1,hipY,P.r[0],P.r[1],8.6,8.6,lw,lw2*.9);limb(c,-1,shY+1,P.ar[0],P.ar[1],6.4,6.2,lw2*.9,lw2*.8);
 // torso, leaned
 c.save();c.translate(0,hipY);c.rotate(P.lean);c.translate(0,-hipY);
 c.beginPath();
 if(big){c.moveTo(-6,hipY+1);c.quadraticCurveTo(-8.5,shY+6,-6.5,shY-1);c.quadraticCurveTo(0,shY-4,6.5,shY-1);c.quadraticCurveTo(9,shY+6,6,hipY+1);c.closePath();}
 else{c.moveTo(-3.3,hipY+1);c.quadraticCurveTo(-4.4,shY+6,-3.6,shY);c.quadraticCurveTo(0,shY-2.2,3.8,shY);c.quadraticCurveTo(4.6,shY+6,3.4,hipY+1);c.closePath();}
 c.fill();
 if(S.kind==='girl'){// dress flare
  const fl=Math.sin(t*5+ph)*1.2;c.beginPath();c.moveTo(-3.6,hipY-3);c.lineTo(3.8,hipY-3);c.lineTo(6.5+fl,hipY+7);c.quadraticCurveTo(0,hipY+9,-6+fl*.5,hipY+7);c.closePath();c.fill();}
 // head
 const hy=shY-6.2,hr=big?5.6:4.9;c.beginPath();c.arc(1,hy,hr,0,7);c.fill();c.fillRect(-.6,shY-3,2.6,3.4);
 if(S.kind==='boy'){// messy hair
  c.beginPath();c.moveTo(-4,hy-1);for(let i=0;i<5;i++){const a=Math.PI*(1.05+i*.22);c.lineTo(1+Math.cos(a)*(hr+2.2+(i%2)*1.2),hy+Math.sin(a)*(hr+2.2+(i%2)*1.2));c.lineTo(1+Math.cos(a+.12)*hr,hy+Math.sin(a+.12)*hr);}c.closePath();c.fill();}
 if(S.kind==='girl'){// long hair + ponytail streaming back
  const sw=(st==='run'?1:.35);c.beginPath();c.arc(.4,hy-.4,hr+.9,Math.PI*.9,Math.PI*2.05);c.fill();c.lineCap='round';c.lineWidth=2.6;c.beginPath();c.moveTo(-3.5,hy-2.5);
  c.bezierCurveTo(-8,hy-1+Math.sin(t*7)*sw,-10,hy+5+Math.sin(t*7+1)*sw*2,-12-sw*3,hy+8+Math.sin(t*7+2)*sw*2.5);c.stroke();}
 if(big){// cap + jaw
  c.beginPath();c.moveTo(-5.5,hy-2.5);c.quadraticCurveTo(1,hy-10,7,hy-3);c.lineTo(11,hy-2);c.lineTo(7,hy-1);c.closePath();c.fill();c.fillRect(-3,hy+1,9,4.5);}
 // scarf: wraps the neck, two tails flutter behind with speed
 if(S.scarf&&S.kind==='boy'){const sp=st==='run'?1:(st==='air'?.8:.25);c.save();c.fillStyle=c.strokeStyle=eyes?S.scarf:col;c.beginPath();c.ellipse(.6,shY-1.4,4.2,1.9,0,0,7);c.fill();c.lineCap='round';
  for(let k=0;k<2;k++){c.lineWidth=2.2-k*.5;c.beginPath();c.moveTo(-2.5,shY-1);const L=9+sp*9-k*2;let px=-2.5,py=shY-1;for(let i=1;i<=5;i++){const q=i/5;px=-2.5-L*q;py=shY-1+q*(4-sp*3)+Math.sin(t*11+i*1.3+k*2)*(1+sp*1.6)*q;c.lineTo(px,py);}c.stroke();}c.restore();}
 // eyes facing forward
 if(eyes){c.save();c.fillStyle=S.eye;c.shadowColor=S.eye;c.shadowBlur=big?7:5;const scared=o.scared||(st==='air'&&vy>150);const bl=!scared&&(t%3.6)<.12;
  for(const ex of big?[3.5,6.8]:[3.1,5.9]){c.beginPath();if(bl)c.ellipse(ex,hy-.2,1.2,.3,0,0,7);else c.ellipse(ex,hy-.4,scared?1.3:(big?1.2:1),scared?1.6:(big?.8:1.25),big?-.3:0,0,7);c.fill();}
  c.restore();}
 c.restore();
 // front limbs
 c.fillStyle=col;c.strokeStyle=col;
 c.save();c.translate(0,hipY);c.rotate(P.lean*.4);c.translate(0,-hipY);
 const[fx,fy,fa]=limb(c,1,hipY,P.l[0],P.l[1],8.6,8.6,lw,lw2);c.beginPath();c.ellipse(fx+Math.cos(fa)*1.6,fy-Math.sin(fa)*.4,3.1,1.6,-fa*.25,0,7);c.fill();
 c.restore();
 c.save();c.translate(0,hipY);c.rotate(P.lean);c.translate(0,-hipY);limb(c,1.5,shY+1,P.al[0],P.al[1],6.4,6.2,lw2,lw2*.85);c.restore();
 c.restore();}
function person(c,x,y,o={}){const S=SKINS[o.skin||SKIN]||SKINS.kai;const t=o.t??performance.now()/1000;
 if(!o.noShadow&&y<=G+.5&&y>G-90&&!o.rot){const k=1-(G-y)/90;c.fillStyle=`rgba(0,0,0,${.35*k})`;c.beginPath();c.ellipse(x,G+1.2,10*k+3,2.2*k+.5,0,0,7);c.fill();}
 c.save();c.translate(x,y);if(o.flip)c.scale(-1,1);if(o.rot)c.rotate(o.rot);
 const rim=o.rim||S.rim;
 if(rim&&!o.noRim){c.save();c.globalAlpha=.85;c.translate(.75,-.6);figure(c,S,o,rim,false);c.restore();}
 figure(c,S,o,o.col||SIL,true);
 // the scarf keeps its red, the one warm colour on Kai
 c.restore();}
hero=function(c,x,y,o={}){return person(c,x,y,{...o,col:null});};
stick=function(c,x,y,o={}){return person(c,x,y,{...o,col:null});};
