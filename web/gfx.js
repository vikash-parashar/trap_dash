// ---------- realistic graphics layer ----------
const RG={ps:0,layers:null};
function mul(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function vnoise(x,seed){const i=Math.floor(x),f=x-i,u=f*f*(3-2*f);return lerp(hash(i+seed*131),hash(i+1+seed*131),u)}
function fbm(x,seed){let v=0,a=.5,f=1;for(let k=0;k<5;k++){v+=a*vnoise(x*f,seed+k);f*=2.03;a*=.5;}return v}
function mk(wu,hu,ps){const cv2=document.createElement('canvas');cv2.width=Math.ceil(wu*ps);cv2.height=Math.ceil(hu*ps);const x=cv2.getContext('2d');x.scale(ps,ps);return[cv2,x];}
function pf(X,per,sc,seed){X=((X%per)+per)%per;const w=X/per;return fbm(X/sc,seed)*(1-w)+fbm((X-per)/sc,seed)*w;}
function tileB(wu,hu,ps,blur,draw){const M=24;const big=document.createElement('canvas');big.width=Math.ceil((wu+2*M)*ps);big.height=Math.ceil(hu*ps);const x=big.getContext('2d');x.scale(ps,ps);x.translate(M,0);if(blur)x.filter=`blur(${blur*ps}px)`;draw(x,M);
 const out=document.createElement('canvas');out.width=Math.ceil(wu*ps);out.height=big.height;out.getContext('2d').drawImage(big,M*ps,0,wu*ps,big.height,0,0,wu*ps,big.height);big.width=big.height=0;return out;}
function treeRound(x,bx,by,h,r,light,dark,trunk){x.fillStyle=trunk;x.beginPath();x.moveTo(bx-r*.12,by);x.quadraticCurveTo(bx-r*.08,by-h*.5,bx-r*.05,by-h*.7);x.lineTo(bx+r*.05,by-h*.7);x.quadraticCurveTo(bx+r*.08,by-h*.5,bx+r*.12,by);x.fill();
 const R=mul(bx*7+by);for(let i=0;i<9;i++){const a=R()*Math.PI*2,d=R()*r*.55,cx=bx+Math.cos(a)*d,cy=by-h*.72+Math.sin(a)*d*.8-r*.2,rr=r*(.45+R()*.3);const g=x.createRadialGradient(cx+rr*.35,cy-rr*.45,rr*.1,cx,cy,rr);g.addColorStop(0,light);g.addColorStop(1,dark);x.fillStyle=g;x.beginPath();x.arc(cx,cy,rr,0,7);x.fill();}}
function treePine(x,bx,by,h,w,light,dark){x.fillStyle='#3B2A1E';x.fillRect(bx-1,by-h*.25,2,h*.25);for(let i=0;i<4;i++){const y0=by-h*.2-i*h*.2,ww=w*(1-i*.2);const g=x.createLinearGradient(bx-ww,0,bx+ww,0);g.addColorStop(0,dark);g.addColorStop(.65,light);g.addColorStop(1,dark);x.fillStyle=g;x.beginPath();x.moveTo(bx-ww,y0);x.lineTo(bx,y0-h*.32);x.lineTo(bx+ww,y0);x.closePath();x.fill();}}
function buildRG(ps){ps=Math.min(ps,3);if(RG.layers&&Math.abs(ps-(RG.req||RG.ps))<.01)return;const req=ps;if(RG.layers)for(const k in RG.layers){RG.layers[k].width=RG.layers[k].height=0;}const L={};
 // clouds tile
 {const[cvx,x]=mk(700,110,ps);x.filter=`blur(${2.2*ps}px)`;const R=mul(11);for(let i=0;i<9;i++){const cx=R()*700,cy=20+R()*60,s=.6+R()*.9;for(let j=0;j<14;j++){const ox=(R()-.5)*60*s,oy=(R()-.3)*14*s,rr=(8+R()*14)*s;const g=x.createRadialGradient(cx+ox,cy+oy-rr*.4,rr*.2,cx+ox,cy+oy,rr);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.7,'rgba(240,244,250,.75)');g.addColorStop(1,'rgba(215,225,240,0)');x.fillStyle=g;x.beginPath();x.arc(cx+ox,cy+oy,rr,0,7);x.fill();for(const sh of[-700,700]){x.beginPath();x.arc(cx+ox+sh,cy+oy,rr,0,7);x.fill();}}}L.clouds=cvx;}
 // far mountains
 L.mtn=tileB(900,180,ps,1.1,(x,M)=>{const ridge=X=>G-58-pf(X,900,90,3)*62;
  const g=x.createLinearGradient(0,40,0,G);g.addColorStop(0,'#8FA7C8');g.addColorStop(1,'#B9CBDD');x.fillStyle=g;x.beginPath();x.moveTo(-M,G);for(let X=-M;X<=900+M;X+=3)x.lineTo(X,ridge(X));x.lineTo(900+M,G);x.fill();
  x.fillStyle='rgba(255,255,255,.55)';x.beginPath();for(let X=-M;X<=900+M;X+=3){const y=ridge(X);if(y<G-100){x.moveTo(X,y);x.lineTo(X+3,ridge(X+3));x.lineTo(X+3,ridge(X+3)+6);x.lineTo(X,y+7);}}x.fill();
  const r2=X=>G-40-pf(X+300,900,60,13)*40;const g2=x.createLinearGradient(0,60,0,G);g2.addColorStop(0,'#7E97BA');g2.addColorStop(1,'#AFC3D6');x.fillStyle=g2;x.beginPath();x.moveTo(-M,G);for(let X=-M;X<=900+M;X+=3)x.lineTo(X,r2(X));x.lineTo(900+M,G);x.fill();});
 // mid hills with pines
 L.hills=tileB(760,180,ps,.7,(x,M)=>{const hill=X=>G-24-pf(X,760,70,7)*30;const g=x.createLinearGradient(0,G-60,0,G);g.addColorStop(0,'#7FA56A');g.addColorStop(1,'#9DB98A');x.fillStyle=g;x.beginPath();x.moveTo(-M,G);for(let X=-M;X<=760+M;X+=3)x.lineTo(X,hill(X));x.lineTo(760+M,G);x.fill();
  const R=mul(5);for(let i=0;i<70;i++){const X=R()*760,h=10+R()*10,w=3+R()*2;for(const o of[-760,0,760])treePine(x,X+o,hill(X)+4,h,w,'#6F9563','#4E7449');}
  x.filter='none';const hz=x.createLinearGradient(0,G-60,0,G);hz.addColorStop(0,'rgba(200,220,235,0)');hz.addColorStop(1,'rgba(200,220,235,.45)');x.fillStyle=hz;x.fillRect(-M,G-60,760+2*M,60);});
 // near treeline
 L.trees=tileB(640,180,ps,0,(x,M)=>{const base=X=>G-6-pf(X,640,50,9)*8;x.fillStyle='#4E7A3E';x.beginPath();x.moveTo(-M,G+2);for(let X=-M;X<=640+M;X+=4)x.lineTo(X,base(X));x.lineTo(640+M,G+2);x.fill();
  const R=mul(21);const T=[];for(let i=0;i<20;i++)T.push([R()*640,34+R()*34,R(),9+R()*4,13+R()*9]);
  for(const[X,h,k,pw,rr]of T)for(const o of[-640,0,640]){if(X+o<-60||X+o>700)continue;if(k<.4)treePine(x,X+o,base(X)+2,h*1.1,pw,'#4F8A45','#284F27');else treeRound(x,X+o,base(X)+2,h,rr,'#79B35A','#2E5A2A','#4A3424');}
  for(let i=0;i<40;i++){const X=R()*640,r=5+R()*7;for(const o of[-640,0,640]){const b=base(X)+2;const g=x.createRadialGradient(X+o+r*.3,b-r*.6,1,X+o,b-r*.3,r);g.addColorStop(0,'#86BD5E');g.addColorStop(1,'#356530');x.fillStyle=g;x.beginPath();x.arc(X+o,b-r*.3,r,Math.PI,0);x.fill();}}});
 // ground strip 256 x 40
 {const[cvx,x]=mk(256,40,ps);const R=mul(77);const g=x.createLinearGradient(0,0,0,40);g.addColorStop(0,'#7A5034');g.addColorStop(.5,'#5C3A25');g.addColorStop(1,'#33200F');x.fillStyle=g;x.fillRect(0,0,256,40);
  for(let i=0;i<900;i++){x.fillStyle=R()<.5?`rgba(0,0,0,${R()*.18})`:`rgba(255,220,180,${R()*.08})`;x.fillRect(R()*256,6+R()*34,.6+R()*1.2,.6+R()*1.2);}
  x.fillStyle='rgba(40,22,10,.35)';x.beginPath();x.moveTo(0,22);for(let X=0;X<=256;X+=4)x.lineTo(X,22+Math.sin(X*.07)*2+fbm(X/20,4)*3);x.lineTo(256,27);for(let X=256;X>=0;X-=4)x.lineTo(X,27+Math.sin(X*.05+1)*2);x.fill();
  for(let i=0;i<14;i++){const sx=R()*256,sy=12+R()*26,r=1.6+R()*3.4;x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(sx+.8,sy+1,r*1.2,r*.8,0,0,7);x.fill();const sg=x.createRadialGradient(sx-r*.4,sy-r*.4,.3,sx,sy,r*1.2);sg.addColorStop(0,'#C9B8A4');sg.addColorStop(1,'#6E5D4E');x.fillStyle=sg;x.beginPath();x.ellipse(sx,sy,r*1.2,r*.8,R(),0,7);x.fill();}
  x.strokeStyle='rgba(45,28,15,.8)';x.lineWidth=.6;for(let i=0;i<6;i++){const sx=R()*256;x.beginPath();x.moveTo(sx,8);x.bezierCurveTo(sx+R()*8-4,14,sx+R()*10-5,18,sx+R()*12-6,22+R()*8);x.stroke();}
  const tg=x.createLinearGradient(0,0,0,9);tg.addColorStop(0,'#8BC34A');tg.addColorStop(.5,'#5E9E36');tg.addColorStop(1,'#3E7424');x.fillStyle=tg;x.fillRect(0,0,256,8);
  x.fillStyle='#3E7424';for(let X=0;X<256;X+=3){x.beginPath();x.moveTo(X,7);x.lineTo(X+1.5,9+R()*3.5);x.lineTo(X+3,7);x.fill();}
  const ao=x.createLinearGradient(0,8,0,16);ao.addColorStop(0,'rgba(0,0,0,.35)');ao.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=ao;x.fillRect(0,8,256,8);
  x.fillStyle='rgba(255,255,220,.35)';x.fillRect(0,0,256,.7);
  L.ground=cvx;
  // grass blades layer (drawn above ground line) 256 x 14
  const[gb,y]=mk(256,14,ps);const cols=['#6FAE3E','#8BC34A','#A5D65E','#5A9631','#79B845'];for(let i=0;i<520;i++){const X=R()*256,h=3+R()*8,lean=(R()-.4)*3;y.strokeStyle=cols[Math.floor(R()*5)];y.lineWidth=.55+R()*.5;y.beginPath();y.moveTo(X,14);y.quadraticCurveTo(X+lean*.3,14-h*.6,X+lean,14-h);y.stroke();}
  for(let i=0;i<9;i++){const X=R()*256,c2=R()<.5?'#FFFFFF':'#FFD84D';y.strokeStyle='#5A9631';y.lineWidth=.5;y.beginPath();y.moveTo(X,14);y.lineTo(X,6);y.stroke();y.fillStyle=c2;for(let k=0;k<5;k++){y.beginPath();y.arc(X+Math.cos(k*1.26)*1.3,6+Math.sin(k*1.26)*1.3,.9,0,7);y.fill();}y.fillStyle='#F2A900';y.beginPath();y.arc(X,6,.6,0,7);y.fill();}
  L.blades=gb;}
 // foreground blur strip
 L.fg=tileB(600,50,ps,1.8,(x,M)=>{const R=mul(99);for(let i=0;i<10;i++){const X=R()*600,r=10+R()*16;for(const o of[-600,0,600]){const g=x.createRadialGradient(X+o,50-r*.6,2,X+o,50,r*1.3);g.addColorStop(0,'rgba(70,110,40,.95)');g.addColorStop(1,'rgba(30,55,20,.0)');x.fillStyle=g;x.beginPath();x.arc(X+o,50,r*1.3,Math.PI,0);x.fill();}}
  x.strokeStyle='rgba(60,100,35,.9)';for(let i=0;i<120;i++){const X=R()*600,h=10+R()*26,lw=1+R()*1.5,a1=R()*6-3,a2=R()*12-6;for(const o of[-600,0,600]){x.lineWidth=lw;x.beginPath();x.moveTo(X+o,52);x.quadraticCurveTo(X+o+a1,52-h*.6,X+o+a2,52-h);x.stroke();}}});
 RG.layers=L;RG.ps=ps;
 // Safari silently gives blank canvases when it runs out of canvas memory: check one opaque pixel and rebuild smaller.
 try{const gx=L.ground.getContext('2d').getImageData(L.ground.width>>1,L.ground.height-2,1,1).data;if(gx[3]===0&&ps>1){RG.layers=null;RG.ps=0;RG.req=0;buildRG(ps/2);}}catch(e){}
 RG.req=req;}
function tileDraw(c,img,wu,hu,off,y){let x0=-((off%wu)+wu)%wu;for(let x=x0;x<W+1;x+=wu)c.drawImage(img,x,y,wu,hu);}
bg=function(c,P,t){if(!RG.layers)return;const L=RG.layers;
 const g=c.createLinearGradient(0,0,0,G);g.addColorStop(0,'#3F7FCB');g.addColorStop(.55,'#8DBDE6');g.addColorStop(1,'#E3EEF2');c.fillStyle=g;c.fillRect(0,0,W,G+2);
 const sx=W*.78,sy=34;glow(c,sx,sy,140,'rgba(255,236,190,.55)');glow(c,sx,sy,50,'rgba(255,250,235,.9)');c.fillStyle='#FFFBEA';c.beginPath();c.arc(sx,sy,10,0,7);c.fill();
 c.save();c.beginPath();c.rect(0,0,W,G);c.clip();c.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const a=2.1+i*.17+Math.sin(t*.3+i)*.02;c.fillStyle=`rgba(255,240,200,${.035+.02*Math.sin(t*.7+i*2)})`;c.beginPath();c.moveTo(sx,sy);c.lineTo(sx+Math.cos(a)*400,sy+Math.sin(a)*400);c.lineTo(sx+Math.cos(a+.07)*400,sy+Math.sin(a+.07)*400);c.fill();}c.restore();
 c.globalAlpha=.9;tileDraw(c,L.clouds,700,110,t*4+CAMX*.03,0);c.globalAlpha=1;
 tileDraw(c,L.mtn,900,180,CAMX*.08,0);
 // birds
 c.strokeStyle='rgba(40,50,70,.6)';c.lineWidth=.8;for(let i=0;i<4;i++){const bx=((t*14+i*23)%(W+80))-40,by=40+i*5+Math.sin(t+i)*3,f=Math.sin(t*9+i)*2;c.beginPath();c.moveTo(bx-3,by-f);c.quadraticCurveTo(bx-1.5,by-1,bx,by);c.quadraticCurveTo(bx+1.5,by-1,bx+3,by-f);c.stroke();}
 tileDraw(c,L.hills,760,180,CAMX*.22,0);
 tileDraw(c,L.trees,640,180,CAMX*.48,0);
 const hz=c.createLinearGradient(0,G-30,0,G);hz.addColorStop(0,'rgba(230,240,240,0)');hz.addColorStop(1,'rgba(230,240,240,.25)');c.fillStyle=hz;c.fillRect(0,G-30,W,30);};
floor=function(c,P,x0,x1,y=G,h){h=h??(H-y);if(x1<=x0||!RG.layers)return;const L=RG.layers;c.save();c.beginPath();c.rect(x0,y-14,x1-x0,h+14);c.clip();
 c.fillStyle='#5A3A1E';c.fillRect(x0,y,x1-x0,h);c.fillStyle='#5E9A34';c.fillRect(x0,y-2,x1-x0,6);for(let x=Math.floor(x0/256)*256;x<x1;x+=256){c.drawImage(L.ground,x,y,256,40);if(h>40){c.fillStyle='#2A190C';c.fillRect(x,y+40,256,h-40);}c.drawImage(L.blades,x,y-13,256,14);}
 c.restore();
 for(const[ex,dir]of[[x0,1],[x1,-1]]){if((dir===1&&x0<=0)||(dir===-1&&x1>=END))continue;const e=c.createLinearGradient(ex,0,ex+dir*8,0);e.addColorStop(0,'rgba(20,10,5,.6)');e.addColorStop(1,'rgba(20,10,5,0)');c.fillStyle=e;c.fillRect(dir===1?ex:ex-8,y+3,8,h);
  c.fillStyle='#4E8A2E';for(let k=0;k<4;k++){c.beginPath();c.moveTo(ex,y+2+k);c.lineTo(ex+dir*(1.5+hash(ex+k)*1.5),y+7+k*2.5+hash(ex*3+k)*3);c.lineTo(ex,y+4+k);c.fill();}}};
pit=function(c,x0,x1){const g=c.createLinearGradient(0,G,0,H);g.addColorStop(0,'#24160D');g.addColorStop(.5,'#0E0906');g.addColorStop(1,'#000');c.fillStyle=g;c.fillRect(x0,G,x1-x0,H-G);
 c.fillStyle='rgba(120,130,140,.12)';for(let i=0;i<3;i++){c.beginPath();c.ellipse(x0+(x1-x0)*(.3+i*.2)+Math.sin(time*.8+i)*3,H-6-i*3,14,4,0,0,7);c.fill();}
 c.strokeStyle='rgba(70,45,25,.9)';c.lineWidth=.8;c.beginPath();for(let x=x0+3;x<x1-2;x+=6){c.moveTo(x,G+3);c.bezierCurveTo(x+2,G+8,x-1,G+12,x+1,G+14+hash(x)*10);}c.stroke();};
post=function(c){c.save();c.globalCompositeOperation='soft-light';c.fillStyle='rgba(255,190,110,.18)';c.fillRect(0,0,W,H);c.restore();
 for(let i=0;i<26;i++){const px=(hash(i)*W+time*(6+hash(i+2)*8))%W,py=40+hash(i+5)*100+Math.sin(time*.8+i)*6,a=.25+.35*Math.abs(Math.sin(time*1.3+i));c.fillStyle=`rgba(255,245,210,${a})`;c.beginPath();c.arc(px,py,.6+hash(i+8)*.7,0,7);c.fill();}
 const v=c.createRadialGradient(W/2,H*.55,H*.4,W/2,H*.55,W*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(10,8,20,.42)');c.fillStyle=v;c.fillRect(0,0,W,H);};
function fgLayer(c){if(!RG.layers)return;c.globalAlpha=.85;tileDraw(c,RG.layers.fg,600,50,CAMX*1.35,H-38);c.globalAlpha=1;}
