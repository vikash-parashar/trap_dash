// ---------- NOIR look: dark monochrome forest ----------
// Silhouette layers in fog, soft light from the top left, film grain and a heavy vignette.
// Everything is drawn in greys; the canvas also gets a grayscale filter so traps and coins match.
const NR={ps:0,req:0,L:null};
// Colour moods: the scene is painted in greys, then a 'color' blend gives it one mood per world.
const MOODS={
 jungle:{name:'Misty jungle',top:'#16525A',mid:'#4E9C86',low:'#E9C27A',hero:1},
 dusk:{name:'Dusk',top:'#3E1F5C',mid:'#C4553F',low:'#F6B05C'},
 moon:{name:'Moonlight',top:'#0F1D45',mid:'#2F5F9C',low:'#9FD3E8'}};
let MOOD='jungle';try{const m=localStorage.getItem('td-mood');if(m&&MOODS[m])MOOD=m;}catch(e){}
function tint(c,y0,y1,a){const M=MOODS[MOOD];const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,M.top);g.addColorStop(.55,M.mid);g.addColorStop(1,M.low);c.save();c.globalCompositeOperation='color';c.globalAlpha=a;c.fillStyle=g;c.fillRect(0,y0,W,y1-y0);c.restore();}
function silTree(x,bx,by,h,w,col,R,vines){
 // trunk: tall, slightly crooked, with a few bare branches
 x.fillStyle=col;x.strokeStyle=col;const lean=(R()-.5)*w*.6;
 x.beginPath();x.moveTo(bx-w/2,by);x.bezierCurveTo(bx-w*.45,by-h*.4,bx-w*.3+lean,by-h*.75,bx-w*.18+lean,by-h);x.lineTo(bx+w*.18+lean,by-h);x.bezierCurveTo(bx+w*.3+lean,by-h*.75,bx+w*.45,by-h*.4,bx+w/2,by);x.closePath();x.fill();
 // roots
 for(let k=0;k<3;k++){const d=(k-1)*w*.9;x.beginPath();x.moveTo(bx+d*.3,by-w*.8);x.quadraticCurveTo(bx+d*.8,by-w*.2,bx+d*1.4,by+1);x.lineTo(bx+d*.2,by+1);x.fill();}
 // branches
 x.lineCap='round';for(let k=0;k<4+R()*3;k++){const yy=by-h*(.35+R()*.6),dir=R()<.5?-1:1,len=h*(.12+R()*.22);x.lineWidth=Math.max(.6,w*(.18+R()*.15));x.beginPath();x.moveTo(bx+lean*.6,yy);x.quadraticCurveTo(bx+dir*len*.5,yy-len*.15,bx+dir*len,yy-len*(.25+R()*.4));x.stroke();
  x.lineWidth*=.5;x.beginPath();x.moveTo(bx+dir*len*.6,yy-len*.2);x.lineTo(bx+dir*len*(.8+R()*.3),yy-len*(.6+R()*.3));x.stroke();}
 // hanging vines / moss
 if(vines){x.lineWidth=.6;for(let k=0;k<vines;k++){const vx=bx+(R()-.5)*h*.5,vy=by-h*(.6+R()*.4),vl=10+R()*40;x.beginPath();x.moveTo(vx,vy);x.quadraticCurveTo(vx+(R()-.5)*4,vy+vl*.5,vx+(R()-.5)*3,vy+vl);x.stroke();}}
}
function grassSil(x,X0,X1,y,col,R,dens,hmax){x.fillStyle=col;for(let i=0;i<dens;i++){const X=X0+R()*(X1-X0),h=2+R()*hmax,lean=(R()-.5)*4,w=.5+R()*.9;x.beginPath();x.moveTo(X-w,y);x.quadraticCurveTo(X+lean*.4,y-h*.6,X+lean,y-h);x.quadraticCurveTo(X+lean*.3+w*.3,y-h*.5,X+w,y);x.fill();}}
function buildNoir(ps){ps=Math.min(ps,3);if(NR.L&&Math.abs(ps-NR.req)<.01)return;const req=ps;if(NR.L)for(const k in NR.L){NR.L[k].width=NR.L[k].height=0;}const L={};
 // far: pale forest wall deep in the fog
 L.far=tileB(820,180,ps,1.6,(x,M)=>{const R=mul(21);for(const o of[-820,0,820]){const R2=mul(21);for(let i=0;i<26;i++){const bx=R2()*820+o,h=90+R2()*80,w=2+R2()*4;silTree(x,bx,G,h,w,'#A3A7A3',R2,0);}}
  x.fillStyle='#A3A7A3';x.beginPath();x.moveTo(-M,G);for(let X=-M;X<=820+M;X+=4)x.lineTo(X,G-10-pf(X,820,40,3)*14);x.lineTo(820+M,G+2);x.lineTo(-M,G+2);x.fill();});
 // mid: closer trees with vines
 L.mid=tileB(700,180,ps,.7,(x,M)=>{for(const o of[-700,0,700]){const R2=mul(57);for(let i=0;i<11;i++){const bx=R2()*700+o,h=120+R2()*70,w=4+R2()*6;silTree(x,bx,G,h,w,'#636763',R2,3);}}
  x.fillStyle='#636763';x.beginPath();x.moveTo(-M,G);for(let X=-M;X<=700+M;X+=3)x.lineTo(X,G-6-pf(X,700,30,8)*10);x.lineTo(700+M,G+2);x.lineTo(-M,G+2);x.fill();
  for(const o of[-700,0,700])grassSil(x,o,o+700,G-4,'#636763',mul(58),260,7);});
 // near: a few huge dark trunks, no blur
 {const[cv,x]=mk(900,180,ps);const R=mul(91);for(let i=0;i<4;i++){const bx=60+i*225+R()*90,w=12+R()*10;silTree(x,bx,G+4,230,w,'#1E201F',R,5);}L.near=cv;}
 // ground: solid black with a ragged grass edge
 {const[cv,x]=mk(256,40,ps);x.fillStyle='#0A0B0B';x.fillRect(0,0,256,40);const R=mul(5);x.fillStyle='#111312';for(let i=0;i<30;i++){x.beginPath();x.ellipse(R()*256,6+R()*34,3+R()*9,1+R()*2.5,0,0,7);x.fill();}L.ground=cv;}
 {const[cv,x]=mk(256,16,ps);const R=mul(6);grassSil(x,0,256,16,'#0A0B0B',R,420,10);for(let i=0;i<6;i++){const X=R()*256;x.strokeStyle='#0A0B0B';x.lineWidth=.6;x.beginPath();x.moveTo(X,16);x.quadraticCurveTo(X+2,8,X+5,3);x.stroke();x.beginPath();x.arc(X+5,3,1.3,0,7);x.fillStyle='#0A0B0B';x.fill();}L.blades=cv;}
 // foreground: blurred black grass and branches right in front of the camera
 L.fg=tileB(640,60,ps,2.4,(x,M)=>{for(const o of[-640,0,640]){const R=mul(77);grassSil(x,o,o+640,62,'#050505',R,160,30);for(let i=0;i<5;i++){const X=o+R()*640;x.fillStyle='#050505';x.beginPath();x.ellipse(X,60,20+R()*30,8+R()*10,0,Math.PI,0);x.fill();}}});
 // film grain tile
 {const g=document.createElement('canvas');g.width=g.height=160;const x=g.getContext('2d');const im=x.createImageData(160,160);for(let i=0;i<im.data.length;i+=4){const v=Math.random()*255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}x.putImageData(im,0,0);L.grain=g;}
 NR.L=L;NR.ps=ps;
 try{const gx=L.ground.getContext('2d').getImageData(L.ground.width>>1,L.ground.height-2,1,1).data;if(gx[3]===0&&ps>1){NR.L=null;NR.req=0;buildNoir(ps/2);}}catch(e){}
 NR.req=req;}

if(NOIR){
 buildRG=function(ps){buildNoir(ps);};
 skyTop=function(c,tt){const g=c.createLinearGradient(0,0,0,EXTRA+2);g.addColorStop(0,'#3E413F');g.addColorStop(1,'#7D817D');c.fillStyle=g;c.fillRect(0,0,VW,EXTRA+2);
  // branches hanging from the canopy above
  c.strokeStyle='rgba(12,13,13,.85)';c.lineCap='round';for(let i=0;i<7;i++){const bx=((hash(i)*VW*1.4-CAMX*.6)%(VW+60)+VW+60)%(VW+60)-30,len=EXTRA*(.25+hash(i+3)*.5);c.lineWidth=1+hash(i+4)*2;c.beginPath();c.moveTo(bx,0);c.quadraticCurveTo(bx+Math.sin(tt*.5+i)*3,len*.5,bx+Math.sin(tt*.6+i)*5,len);c.stroke();}
  c.save();c.globalCompositeOperation='color';c.globalAlpha=.85;c.fillStyle=MOODS[MOOD].top;c.fillRect(0,0,VW,EXTRA+2);c.restore();};
 bg=function(c,P,t){if(!NR.L)return;const L=NR.L;
  // sky: bright haze behind the trees, darker canopy at the top
  const g=c.createLinearGradient(0,0,0,G);g.addColorStop(0,'#7D817D');g.addColorStop(.45,'#C9CBC6');g.addColorStop(.8,'#DCDDD8');g.addColorStop(1,'#B5B8B3');c.fillStyle=g;c.fillRect(0,0,W,G+2);
  const sx=W*.22,sy=-10;glow(c,sx,sy,170,'rgba(255,255,250,.35)');
  // light shafts through the canopy
  c.save();c.beginPath();c.rect(0,0,W,G);c.clip();c.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const a=.55+i*.16+Math.sin(t*.25+i)*.015,w=.05+hash(i)*.05;c.fillStyle=`rgba(255,255,250,${.04+.025*Math.sin(t*.5+i*1.7)})`;c.beginPath();c.moveTo(sx,sy);c.lineTo(sx+Math.cos(a)*420,sy+Math.sin(a)*420);c.lineTo(sx+Math.cos(a+w)*420,sy+Math.sin(a+w)*420);c.fill();}c.restore();
  tileDraw(c,L.far,820,180,CAMX*.1,0);
  let f=c.createLinearGradient(0,G-80,0,G);f.addColorStop(0,'rgba(220,222,217,0)');f.addColorStop(1,'rgba(220,222,217,.7)');c.fillStyle=f;c.fillRect(0,G-80,W,80);
  // drifting fog bank
  c.save();c.globalAlpha=.35;for(let i=0;i<4;i++){const fx=((i*160-t*6-CAMX*.15)%(W+200)+W+200)%(W+200)-100;glow(c,fx,G-18,70,'rgba(235,236,232,.55)');}c.restore();
  tileDraw(c,L.mid,700,180,CAMX*.28,0);
  f=c.createLinearGradient(0,G-40,0,G);f.addColorStop(0,'rgba(200,202,197,0)');f.addColorStop(1,'rgba(200,202,197,.45)');c.fillStyle=f;c.fillRect(0,G-40,W,40);
  tileDraw(c,L.near,900,180,CAMX*.6,0);
  tint(c,0,G+2,.85);};
 floor=function(c,P,x0,x1,y=G,h){h=h??(H-y);if(x1<=x0||!NR.L)return;const L=NR.L;c.fillStyle='#0A0B0B';c.fillRect(x0,y,x1-x0,h);
  c.save();c.beginPath();c.rect(x0,y-16,x1-x0,h+16);c.clip();for(let x=Math.floor(x0/256)*256;x<x1;x+=256){c.drawImage(L.ground,x,y,256,40);c.drawImage(L.blades,x,y-15,256,16);}c.restore();
  // ragged cliff lips at the edges of pits
  for(const[ex,dir]of[[x0,1],[x1,-1]]){if((dir===1&&x0<=0)||(dir===-1&&x1>=END))continue;c.fillStyle='#0A0B0B';c.beginPath();c.moveTo(ex,y-1);c.lineTo(ex-dir*3,y+2);c.lineTo(ex-dir*1.5,y+6);c.lineTo(ex-dir*2.5,y+11);c.lineTo(ex,y+16);c.fill();
   c.strokeStyle='#0A0B0B';c.lineWidth=.7;for(let k=0;k<3;k++){const rx=ex-dir*(1+k*1.5);c.beginPath();c.moveTo(rx,y+8+k*3);c.quadraticCurveTo(rx-dir*3,y+16+k*4,rx-dir*2,y+24+k*5+hash(ex+k)*6);c.stroke();}}};
 pit=function(c,x0,x1){const g=c.createLinearGradient(0,G,0,H);g.addColorStop(0,'rgba(10,11,11,.92)');g.addColorStop(.35,'#050505');g.addColorStop(1,'#000');c.fillStyle=g;c.fillRect(x0,G,x1-x0,H-G);
  c.save();c.globalAlpha=.5;for(let i=0;i<3;i++)glow(c,x0+(x1-x0)*(.25+i*.25)+Math.sin(time*.7+i)*4,H-4,16,MOODS[MOOD].mid,.35);c.restore();};
 post=function(c){
  // dust in the light
  for(let i=0;i<22;i++){const px=(hash(i)*W+time*(3+hash(i+2)*5))%W,py=25+hash(i+5)*110+Math.sin(time*.6+i)*5,a=.18+.3*Math.abs(Math.sin(time*1.1+i));c.fillStyle=`rgba(250,250,245,${a})`;c.beginPath();c.arc(px,py,.5+hash(i+8)*.6,0,7);c.fill();}
  // heavy vignette
  const RR=Math.hypot(W,H)*.62;const v=c.createRadialGradient(W*.47,H*.52,RR*.3,W*.5,H*.55,RR);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(.7,'rgba(0,0,0,.35)');v.addColorStop(1,'rgba(0,0,0,.82)');c.fillStyle=v;c.fillRect(0,0,W,H);
  // film grain, jumps every frame
  if(NR.L){c.save();c.globalAlpha=.07;c.globalCompositeOperation='overlay';const ox=-Math.random()*80,oy=-Math.random()*80;for(let x=ox;x<W;x+=80)for(let y=oy;y<H;y+=80)c.drawImage(NR.L.grain,x,y,80,80);c.restore();}
  // tiny projector flicker
  c.fillStyle=`rgba(0,0,0,${.03+.03*Math.random()})`;c.fillRect(0,0,W,H);};
 fgLayer=function(c){if(!NR.L)return;tileDraw(c,NR.L.fg,640,60,CAMX*1.35,H-42);};
 document.documentElement.classList.add('noir');
 // Heroes: dark silhouettes with a thin rim of their own colour and glowing eyes.
 const RIM={dash:'#FF8A4C',nova:'#3FE0CF',bolt:'#FFD23F'};
 const _hero=hero;hero=function(c,x,y,o={}){if(o.rim)return _hero(c,x,y,o);const k=o.skin||SKIN;const col=RIM[k]||'#fff';
  c.save();c.globalAlpha=.9;_hero(c,x+.8,y-.7,{...o,rim:col,noShadow:true});c.restore();
  return _hero(c,x,y,{...o,eye:o.eye||col});};
}
