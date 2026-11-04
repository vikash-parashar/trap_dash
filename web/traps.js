// ---------- traps v2: real weight, real motion ----------
// Rusty metal and old wood, with sparks, dust and screen shake. Every trap gives a small warning
// (glow, rumble, glint) before it strikes. The look matches the Trap Lab page.
function rustMetal(c,x,y,w,h){const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#3d3a36');g.addColorStop(.4,'#5b544c');g.addColorStop(1,'#1d1b19');c.fillStyle=g;c.fillRect(x,y,w,h);
 c.fillStyle='rgba(120,60,25,.45)';c.fillRect(x+w*.1,y+h*.15,w*.2,h*.2);c.fillRect(x+w*.62,y+h*.5,w*.14,h*.15);
 c.fillStyle='#8a8580';for(const[px,py]of[[.1,.1],[.9,.1],[.1,.7],[.9,.7]]){c.beginPath();c.arc(x+w*px,y+h*py,1.1,0,7);c.fill();}}
// hydraulic press on chains
function drawCrusher(c,t,tt){const k=t.st==='tell'?t.t/.3:1;c.fillStyle=`rgba(0,0,0,${.15+.3*k})`;c.beginPath();c.ellipse(t.x,G+2,14+12*k,3,0,0,7);c.fill();
 const by=t.st==='tell'?-48+k*10+Math.sin(tt*90)*.7:t.y,w=50,h=44,x=t.x-w/2,y=by+4;
 c.strokeStyle='#202426';c.lineWidth=1;for(const s of[-1,1])for(let i=-90;i<y;i+=5){c.beginPath();c.ellipse(t.x+s*16,i,1.3,2.5,0,0,7);c.stroke();}
 c.fillStyle='#15181a';c.fillRect(t.x-3,-100,6,y+100);
 rustMetal(c,x,y,w,h);c.save();c.beginPath();c.rect(x,y+h-7,w,7);c.clip();for(let i=-6;i<12;i++){c.fillStyle=i%2?'rgba(214,170,40,.6)':'rgba(10,10,10,.85)';c.beginPath();c.moveTo(x+i*8,y+h);c.lineTo(x+i*8+8,y+h-7);c.lineTo(x+i*8+16,y+h-7);c.lineTo(x+i*8+8,y+h);c.fill();}c.restore();
 if(t.st==='tell'){c.fillStyle='rgba(210,200,180,.6)';for(let i=0;i<5;i++)c.fillRect(t.x-20+i*10,y+h+((tt*120+i*13)%40),1,1.5);}
 if(t.st==='fire'&&t.t>.12&&t.t<.5){const q=(t.t-.12)/.38;c.fillStyle=`rgba(150,135,115,${.5*(1-q)})`;for(let i=0;i<8;i++){c.beginPath();c.arc(t.x+(i-3.5)*8*(1+q*2),G-2-q*8*Math.abs(Math.sin(i)),3+q*6,0,7);c.fill();}}}
// rusty iron stakes bursting from the ground
spikesUp=function(c,x0,x1,y,hk){if(hk<=.01)return;c.fillStyle='#050606';c.fillRect(x0-2,y-1,x1-x0+4,4);
 for(let i=0,n=6;i<n;i++){const x=x0+2+i*(x1-x0-4)/(n-1),h=(22+Math.sin(i*2.3)*5)*hk,lean=Math.sin(i*1.7)*.12;c.save();c.translate(x,y+2);c.rotate(lean);const g=c.createLinearGradient(-2,0,2,0);g.addColorStop(0,'#6a4a2e');g.addColorStop(1,'#1a0f08');c.fillStyle=g;c.beginPath();c.moveTo(-2,0);c.lineTo(-1.4,-h+5);c.lineTo(0,-h);c.lineTo(1.4,-h+5);c.lineTo(2,0);c.fill();if(h>6){c.strokeStyle='rgba(255,220,180,.35)';c.lineWidth=.5;c.beginPath();c.moveTo(-1.3,-h+5);c.lineTo(0,-h);c.stroke();}c.restore();}};
// spinning saw blade
function sawBlade(c,r,ang){c.save();c.rotate(ang);c.beginPath();for(let i=0;i<40;i++){const a=i/40*Math.PI*2,rr=i%2?r:r*.84;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();const g=c.createRadialGradient(-r*.3,-r*.3,1,0,0,r);g.addColorStop(0,'#A6ABAD');g.addColorStop(.6,'#4A4F52');g.addColorStop(1,'#232628');c.fillStyle=g;c.fill();
 c.fillStyle='rgba(110,55,25,.55)';for(let i=0;i<4;i++){c.beginPath();c.arc(Math.cos(i*1.6)*r*.55,Math.sin(i*1.6)*r*.55,r*.13,0,7);c.fill();}c.fillStyle='#16191b';c.beginPath();c.arc(0,0,r*.25,0,7);c.fill();c.restore();}
// pendulum axe
function axeHead(c,L){c.fillStyle='#2a1c12';c.fillRect(-1.4,L-18,2.8,14);c.beginPath();c.moveTo(0,L-12);c.quadraticCurveTo(-22,L-10,-25,L+5);c.quadraticCurveTo(-12,L+2,0,L+12);c.quadraticCurveTo(12,L+2,25,L+5);c.quadraticCurveTo(22,L-10,0,L-12);c.closePath();
 const g=c.createLinearGradient(-25,0,25,0);g.addColorStop(0,'#3a3f42');g.addColorStop(.5,'#8c9295');g.addColorStop(1,'#2a2e30');c.fillStyle=g;c.fill();c.strokeStyle='rgba(230,240,255,.8)';c.lineWidth=.8;c.beginPath();c.moveTo(-25,L+5);c.quadraticCurveTo(-12,L+2,0,L+12);c.quadraticCurveTo(12,L+2,25,L+5);c.stroke();}
function boulderRock(c,r){c.beginPath();const R=[.95,1.02,.9,1.04,.97,.88,1.0,.93,1.05,.9,.98,1.01];R.forEach((q,i)=>{const a=i/R.length*Math.PI*2;c.lineTo(Math.cos(a)*r*q,Math.sin(a)*r*q);});c.closePath();const g=c.createRadialGradient(-r*.4,-r*.4,1,0,0,r*1.1);g.addColorStop(0,'#55534c');g.addColorStop(1,'#0f0f0e');c.fillStyle=g;c.fill();
 c.strokeStyle='rgba(0,0,0,.6)';c.lineWidth=.7;c.beginPath();c.moveTo(-r*.5,-r*.2);c.lineTo(-r*.1,r*.1);c.lineTo(r*.3,0);c.moveTo(-r*.1,r*.1);c.lineTo(0,r*.6);c.stroke();c.fillStyle='rgba(70,90,50,.5)';c.beginPath();c.arc(r*.3,-r*.4,r*.2,0,7);c.fill();}
// extra trap types: saw, axe, boulder. Called every frame from step() and render().
function trapsStep(t,dt){
 if(t.type==='saw'&&t.st==='fire'){const k=t.t;t.h=k<.15?k/.15:(k>1.6?cl(1-(k-1.6)/.2):1);t.sx=t.x+Math.sin(k*4.2)*TILE*1.1;
  if(Math.random()<.7)L.parts.push({x:t.sx+rnd(-6,6),y:G,vx:rnd(-90,90),vy:rnd(-160,-40),life:.3,col:'#FFB547'});
  if(t.h>.5&&Math.abs(Pl.x-t.sx)<13&&Pl.y>G-16&&!Pl.dead){sfx('spike');kill('saw');}if(k>1.85)t.st='rearm';}
 if(t.type==='axe'&&t.st==='fire'){const k=t.t;t.a=-1.25*Math.cos(Math.min(k,1.8)*Math.PI/.9);const L2=92,px=t.x,py=G-112;
  t.bx=px-Math.sin(t.a)*L2;t.by=py+Math.cos(t.a)*L2;if(!Pl.dead&&Math.hypot(Pl.x-t.bx,(Pl.y-18)-t.by)<15){sfx('spike');kill('saw');}if(k>1.8)t.st='rearm';}
 if(t.type==='boulder'&&t.st==='fire'){if(t.bx==null){t.bx=CAMX+VW+30;}t.bx-=200*dt;t.rot=(t.rot||0)-200*dt/12;L.shake=Math.max(L.shake||0,1.3);
  if(Math.random()<.5)L.parts.push({x:t.bx+8,y:G-1,vx:rnd(20,70),vy:rnd(-50,-10),life:.5,col:'rgba(150,135,115,.7)'});
  if(!Pl.dead&&Math.abs(Pl.x-t.bx)<15&&Pl.y>G-20){sfx('boom');kill('afro');}if(t.bx<CAMX-40){t.bx=null;t.st='rearm';}}}
function trapsDraw(c,tt){for(const t of L.traps){
 if(t.type==='crack'&&t.st==='tell'){const k=cl(t.t/.3);c.save();c.lineCap='round';c.shadowColor='#FF7A2E';c.shadowBlur=4;for(let i=0;i<6;i++){const a=-Math.PI+i*Math.PI/5,l=6+k*10;c.strokeStyle=`rgba(255,140,60,${.85*k})`;c.lineWidth=1.1;c.beginPath();c.moveTo(t.x,G+1);c.lineTo(t.x+Math.cos(a)*l,G+1+Math.abs(Math.sin(a))*3);c.lineTo(t.x+Math.cos(a+.3)*l*1.6,G+2+Math.abs(Math.sin(a))*5);c.stroke();}c.restore();}
 if(t.type==='saw'&&(t.st==='fire'||t.st==='tell')){const h=t.st==='tell'?.15:t.h,x=t.st==='tell'?t.x:t.sx;c.fillStyle='#000';c.fillRect(t.x-TILE*1.4,G-1,TILE*2.8,3);c.save();c.beginPath();c.rect(CAMX-50,0,VW+100,G);c.clip();c.translate(x,G+18-h*20);sawBlade(c,16,tt*30);c.restore();}
 if(t.type==='axe'&&(t.st==='fire'||t.st==='tell')){const a=t.st==='tell'?-1.25:t.a,px=t.x,py=G-112,L2=92;c.fillStyle='#07090A';c.fillRect(px-40,py-8,80,6);
  for(let gk=t.st==='fire'?3:0;gk>=0;gk--){const aa=t.st==='fire'?-1.25*Math.cos(Math.max(0,t.t-gk*.025)*Math.PI/.9):a;c.save();c.translate(px,py);c.rotate(aa);c.globalAlpha=gk?.1:1;if(!gk){c.strokeStyle='#15191b';c.lineWidth=1.2;for(let i=0;i<L2-12;i+=5){c.beginPath();c.ellipse(0,i+3,1.4,2.5,0,0,7);c.stroke();}}axeHead(c,L2);c.restore();}}
 if(t.type==='boulder'&&t.st==='tell'){c.fillStyle='rgba(20,18,16,.9)';for(let i=0;i<4;i++)c.fillRect(CAMX+VW-30+i*7,((tt*140+i*17)%70)+40,1.6,1.6);}
 if(t.type==='boulder'&&t.st==='fire'&&t.bx!=null){c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.ellipse(t.bx,G+1,13,2.5,0,0,7);c.fill();c.save();c.translate(t.bx,G-12);c.rotate(t.rot||0);boulderRock(c,12);c.restore();}}}
// gold coin: metal face, thick rim, stamped T, edge shows while it spins
drawCoin=function(x,y,red,tt){const r=7.5,s=Math.cos(tt*2.4+x*.05),ax=Math.max(.12,Math.abs(s)),edge=r*.25*Math.sqrt(1-ax*ax);
 const pal=red?['#FFC2B8','#E5533F','#A5241A','#5C0B06']:['#FFE9A3','#F2C14E','#C98A1B','#7A4E0A'];
 c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(x,G+1,5*ax+2,1.5,0,0,7);c.fill();
 if(edge>.3){c.fillStyle=pal[3];c.beginPath();c.ellipse(x-(s>0?edge*.5:-edge*.5),y,r*ax,r,0,0,7);c.fill();c.fillStyle=pal[2];c.fillRect(x-edge*.5,y-r,edge,r*2);}
 const fx=x+(s>0?edge*.5:-edge*.5);let g=c.createLinearGradient(fx-r,y-r,fx+r,y+r);g.addColorStop(0,pal[1]);g.addColorStop(1,pal[3]);c.fillStyle=g;c.beginPath();c.ellipse(fx,y,r*ax,r,0,0,7);c.fill();
 g=c.createLinearGradient(fx-r,y-r,fx+r,y+r);g.addColorStop(0,pal[0]);g.addColorStop(.5,pal[1]);g.addColorStop(1,pal[2]);c.fillStyle=g;c.beginPath();c.ellipse(fx,y,r*ax*.78,r*.78,0,0,7);c.fill();
 if(ax>.3){c.save();c.translate(fx,y);c.scale(s,1);c.fillStyle=pal[3];c.globalAlpha=.6;c.fillRect(-2.6,-3.4,5.2,1.6);c.fillRect(-.9,-3.4,1.8,6.8);c.globalAlpha=1;c.fillStyle=pal[0];c.fillRect(-2.9,-3.8,5.2,1.5);c.fillRect(-1.2,-3.8,1.7,6.6);c.restore();}
 if(((tt*.5+x*.013)%1)<.06){c.fillStyle='#FFFBEA';c.beginPath();const sx=fx-3,sy=y-4,q=3;c.moveTo(sx,sy-q);c.lineTo(sx+.6,sy-.6);c.lineTo(sx+q,sy);c.lineTo(sx+.6,sy+.6);c.lineTo(sx,sy+q);c.lineTo(sx-.6,sy+.6);c.lineTo(sx-q,sy);c.lineTo(sx-.6,sy-.6);c.fill();}};
window.tdT=()=>({L,Pl,G_,kill});
