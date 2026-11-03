let W=320,H=180,CAMX=0;const G=140;
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ph=(p,a,b)=>cl((p-a)/(b-a));
const lerp=(a,b,k)=>a+(b-a)*k;
const eo=k=>1-Math.pow(1-k,3);
const ei=k=>k*k;
const eb=k=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2)};
const HERO='#1F2233';

const PAL={
 meadow:{grass:1,sky:['#8CCBF0','#E4F4EA'],far:'#A9D69C',far2:'#8CC383',top:'#5DB35A',top2:'#86D272',dirt:'#8A5A3B',dirt2:'#6E4630',sun:'#FFF1B8'},
 quarry:{sky:['#EFBE8C','#F8E5CF'],far:'#DDB48A',far2:'#C99B70',top:'#C9A57E',top2:'#E3C49E',dirt:'#9C7A5B',dirt2:'#7C5E44',sun:'#FFE4B0',ceil:'#8A6B50'},
 factory:{mat:'metal',sky:['#262E42','#46526E'],far:'#323B52',far2:'#3B4560',top:'#8E98AC',top2:'#C3CBDA',dirt:'#4B5366',dirt2:'#3A4152',ceil:'#2B3245',night:1},
 fun:{sky:['#F7C0D8','#FDEAF3'],far:'#F2CBE0',far2:'#EAB2D0',top:'#F07AA8',top2:'#FFB6D2',dirt:'#7B4FA0',dirt2:'#63408A',sun:'#FFF6D0',ceil:'#6A4290'},
 ice:{mat:'ice',sky:['#B7DCF8','#F1F8FF'],far:'#D3E9FA',far2:'#BCDDF4',top:'#E9F7FF',top2:'#FFFFFF',dirt:'#7FB6D9',dirt2:'#5F9AC2',sun:'#FFFFFF'},
 castle:{mat:'brick',sky:['#272140','#4B3F6B'],far:'#352D52',far2:'#40375F',top:'#8C7FA8',top2:'#B2A7CB',dirt:'#4A4060',dirt2:'#3A3250',night:1},
 dusk:{grass:1,sky:['#FF9F7A','#FFE0BE'],far:'#E9A08A',far2:'#D98A78',top:'#6FA24E',top2:'#94C46C',dirt:'#7A4B35',dirt2:'#5E3726',sun:'#FFF0C0'},
 neon:{mat:'metal',sky:['#120F2A','#2B2058'],far:'#211A47',far2:'#2A2157',top:'#22D3EE',top2:'#A5F3FC',dirt:'#1E1B3A',dirt2:'#17142F',ceil:'#1A1638',night:1},
 space:{sky:['#0E0B24','#2E2363'],far:'#241C4F',far2:'#2E2563',top:'#9C8CF0',top2:'#CFC6FF',dirt:'#3B3070',dirt2:'#2E2559',ceil:'#2A2156',night:1,stars:1},
 city:{mat:'road',sky:['#9EC9E8','#E8F1F7'],far:'#B7C6D6',far2:'#9FB1C4',top:'#6B707D',top2:'#8D93A2',dirt:'#3E424C',dirt2:'#30333B',sun:'#FFF1C8'},
 downtown:{mat:'road',sky:['#2F3560','#9A7FB0'],far:'#3A3F68',far2:'#474C78',top:'#6B707D',top2:'#8D93A2',dirt:'#3E424C',dirt2:'#30333B',night:1},
 storm:{grass:1,sky:['#2B323E','#5D6777'],far:'#3E4756',far2:'#4A5464',top:'#4F7A45',top2:'#6E9A5E',dirt:'#4A3A2C',dirt2:'#3A2D22',cloud:'rgba(80,88,104,.9)'},
 monsoon:{mat:'road',sky:['#4A5A66','#9AAAB2'],far:'#62737D',far2:'#6F818A',top:'#5E6470',top2:'#7F8694',dirt:'#3C4049',dirt2:'#2F333A',cloud:'rgba(120,130,140,.85)'},
 lava:{sky:['#2E1012','#6E2418'],far:'#3E1716',far2:'#4C1C18',top:'#5A4740',top2:'#7A655C',dirt:'#30231F',dirt2:'#231915',night:1,lava:1}
};

function hash(n){const s=Math.sin(n*127.1)*43758.5453;return s-Math.floor(s)}
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=amt<0?0:255,a=Math.abs(amt);r=Math.round(r+(f-r)*a);g=Math.round(g+(f-g)*a);b=Math.round(b+(f-b)*a);return'#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)}
function glow(c,x,y,r,col,a=1){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.save();c.globalAlpha=a;c.globalCompositeOperation='lighter';c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore();}
function metal(c,x,y,w,h,base='#6B7383',rivets=true){const g=c.createLinearGradient(x,y,x+w,y);g.addColorStop(0,shade(base,.18));g.addColorStop(.45,base);g.addColorStop(1,shade(base,-.35));c.fillStyle=g;c.beginPath();c.roundRect(x,y,w,h,3);c.fill();
 c.fillStyle='rgba(255,255,255,.28)';c.fillRect(x+1,y+1,w-2,1.2);c.fillStyle='rgba(0,0,0,.3)';c.fillRect(x+1,y+h-2,w-2,1.5);
 if(rivets&&w>16&&h>16){for(const[rx,ry]of[[x+5,y+5],[x+w-5,y+5],[x+5,y+h-5],[x+w-5,y+h-5]]){c.fillStyle=shade(base,-.4);c.beginPath();c.arc(rx,ry+.6,1.9,0,7);c.fill();c.fillStyle=shade(base,.35);c.beginPath();c.arc(rx-.3,ry-.3,1.4,0,7);c.fill();}}}
function bg(c,P,t){
 const g=c.createLinearGradient(0,0,0,G);g.addColorStop(0,P.sky[0]);g.addColorStop(.7,P.sky[1]);g.addColorStop(1,shade(P.sky[1],.15));c.fillStyle=g;c.fillRect(0,0,W,H);
 if(P.stars){for(let i=0;i<40;i++){const x=hash(i)*W,y=hash(i+9)*115,a=.35+.65*Math.abs(Math.sin(t*1.6+i));c.fillStyle=`rgba(255,255,255,${a})`;c.fillRect(x,y,i%7?1:1.6,i%7?1:1.6);}glow(c,250,46,60,'rgba(150,120,255,.35)');}
 if(P.sun){glow(c,262,40,70,P.night?'rgba(255,255,255,.2)':'rgba(255,240,200,.55)');c.fillStyle=P.sun;c.beginPath();c.arc(262,40,14,0,7);c.fill();}
 if(!P.night){c.fillStyle=P.cloud||'rgba(255,255,255,.75)';for(let i=0;i<3;i++){const cx=((i*130+t*6)%(W+120))-60,cy=26+i*14;for(let j=0;j<4;j++){c.beginPath();c.ellipse(cx+j*11,cy-(j%2)*4,13-(j%3)*2,7,0,0,7);c.fill();}}}
 if(P.night&&!P.stars){for(let i=0;i<7;i++){const bx=6+i*46,bh=34+hash(i)*36,by=G-14-bh;c.fillStyle=P.far;c.fillRect(bx,by,30,bh+14);for(let wy=by+5;wy<G-18;wy+=8)for(let wx=bx+4;wx<bx+26;wx+=7){if(hash(wx*3+wy)>.55){c.fillStyle=P.lava?'rgba(255,140,60,.55)':'rgba(255,220,150,.5)';c.fillRect(wx,wy,3,4);}}}}
 const lay=(col,base,amp,f,off,par)=>{c.fillStyle=col;c.beginPath();c.moveTo(0,G);for(let x=0;x<=W;x+=6){const X=x+(t*.3+CAMX*.05)*par;c.lineTo(x,G-base-Math.sin(X*f+off)*amp-Math.sin(X*f*2.7+off)*amp*.35);}c.lineTo(W,G);c.fill();};
 lay(shade(P.far,P.night?.04:.18),40,12,.018,1,1.5);lay(P.far,26,9,.03,2,3);lay(P.far2,12,5,.05,4,6);
 const hz=c.createLinearGradient(0,G-40,0,G);hz.addColorStop(0,'rgba(255,255,255,0)');hz.addColorStop(1,P.night?'rgba(120,110,200,.12)':'rgba(255,255,255,.28)');c.fillStyle=hz;c.fillRect(0,G-40,W,40);
 if(P.lava){const lg=c.createLinearGradient(0,G-40,0,G);lg.addColorStop(0,'rgba(255,90,30,0)');lg.addColorStop(1,'rgba(255,90,30,.32)');c.fillStyle=lg;c.fillRect(0,G-40,W,40);c.fillStyle='rgba(255,170,80,.8)';for(let i=0;i<10;i++){const x=hash(i)*W,y=G-((t*24+hash(i+3)*140)%140);c.fillRect(x+Math.sin(t*2+i)*4,y,1.5,1.5);}}
}
function floor(c,P,x0,x1,y=G,h){h=h??(H-y);if(x1<=x0)return;c.save();c.beginPath();c.roundRect(x0,y,x1-x0,h,[2,2,0,0]);c.clip();
 const dg=c.createLinearGradient(0,y,0,y+h);dg.addColorStop(0,shade(P.dirt,.06));dg.addColorStop(1,shade(P.dirt,-.35));c.fillStyle=dg;c.fillRect(x0,y,x1-x0,h);
 if(P.mat==='metal'){for(let x=Math.floor(x0/40)*40;x<x1;x+=40)metal(c,x+1,y+9,38,h,P.dirt,true);}
 else if(P.mat==='brick'){c.fillStyle='rgba(0,0,0,.25)';for(let r=0;r*10<h;r++){c.fillRect(x0,y+10+r*10,x1-x0,1.2);for(let x=Math.floor(x0/20)*20+(r%2)*10;x<x1;x+=20)c.fillRect(x,y+10+r*10,1.2,10);}c.fillStyle='rgba(255,255,255,.06)';for(let r=0;r*10<h;r++)c.fillRect(x0,y+11.2+r*10,x1-x0,1);}
 else{c.fillStyle='rgba(0,0,0,.14)';c.beginPath();c.moveTo(x0,y+24);for(let x=x0;x<=x1;x+=8)c.lineTo(x,y+24+Math.sin(x*.09)*2.5);c.lineTo(x1,y+29);for(let x=x1;x>=x0;x-=8)c.lineTo(x,y+29+Math.sin(x*.09+1)*2);c.fill();
  for(let x=Math.floor(x0/11)*11;x<x1;x+=11){const hx=hash(x);if(hx<.5)continue;const px=x+hash(x+1)*8,py=y+12+hash(x+2)*(h-14),r=1.5+hash(x+3)*2.2;c.fillStyle=shade(P.dirt2,-.1);c.beginPath();c.ellipse(px,py,r*1.3,r,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.16)';c.beginPath();c.ellipse(px-.5,py-.6,r*.6,r*.4,0,0,7);c.fill();}}
 const tg=c.createLinearGradient(0,y,0,y+9);tg.addColorStop(0,P.top2);tg.addColorStop(.4,P.top);tg.addColorStop(1,shade(P.top,-.18));c.fillStyle=tg;c.fillRect(x0,y,x1-x0,9);
 c.fillStyle=shade(P.top,-.18);for(let x=Math.floor(x0/7)*7;x<x1;x+=7){const d=2+hash(x+5)*3;c.beginPath();c.arc(x+3.5,y+9,d,0,Math.PI);c.fill();}
 c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x0,y,x1-x0,1);
 const ao=c.createLinearGradient(0,y+9,0,y+18);ao.addColorStop(0,'rgba(0,0,0,.28)');ao.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=ao;c.fillRect(x0,y+9,x1-x0,9);
 if(x0>0){const e=c.createLinearGradient(x0,0,x0+6,0);e.addColorStop(0,'rgba(0,0,0,.35)');e.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=e;c.fillRect(x0,y,6,h);}
 if(x1<1e8){const e=c.createLinearGradient(x1-6,0,x1,0);e.addColorStop(0,'rgba(0,0,0,0)');e.addColorStop(1,'rgba(0,0,0,.35)');c.fillStyle=e;c.fillRect(x1-6,y,6,h);}
 if(P.mat==='road'){c.fillStyle='rgba(255,255,255,.55)';for(let x=Math.floor(x0/30)*30;x<x1;x+=30)c.fillRect(x+4,y+20,14,2.5);c.fillStyle='rgba(255,200,60,.7)';c.fillRect(x0,y+9,x1-x0,1.5);}
 if(P.mat==='ice'){c.fillStyle='rgba(255,255,255,.55)';for(let x=Math.floor(x0/50)*50;x<x1;x+=50){c.beginPath();c.moveTo(x+8,y+12);c.lineTo(x+20,y+12);c.lineTo(x+12,y+26);c.lineTo(x+4,y+26);c.fill();}}
 c.restore();
 if(P.grass){c.strokeStyle=P.top2;c.lineWidth=1.1;c.beginPath();for(let x=Math.ceil(x0/5)*5;x<x1-1;x+=5){const hh=2+hash(x)*4;c.moveTo(x,y+1);c.lineTo(x+hash(x+7)*2-1,y-hh);}c.stroke();
  for(let x=Math.ceil(x0/37)*37;x<x1-6;x+=37){if(hash(x)>.6){c.fillStyle=hash(x+1)>.5?'#FFE27A':'#FFFFFF';c.beginPath();c.arc(x+3,y-4,1.6,0,7);c.fill();}}}
}
function pit(c,x0,x1,P){const g=c.createLinearGradient(0,G,0,H);if(P&&P.lava){g.addColorStop(0,'#4A120A');g.addColorStop(.6,'#C2410C');g.addColorStop(1,'#FFB020');c.fillStyle=g;c.fillRect(x0,G,x1-x0,H-G);glow(c,(x0+x1)/2,H,(x1-x0)*.9,'rgba(255,120,30,.5)');}else{g.addColorStop(0,'#1E1511');g.addColorStop(1,'#030305');c.fillStyle=g;c.fillRect(x0,G,x1-x0,H-G);
 c.strokeStyle='rgba(60,40,25,.9)';c.lineWidth=1;c.beginPath();for(let x=x0+4;x<x1-2;x+=7){c.moveTo(x,G+2);c.quadraticCurveTo(x+3,G+8,x+1,G+10+hash(x)*8);}c.stroke();}}
function ceil(c,P,x0,x1,h=16){const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,shade(P.ceil||P.dirt,-.3));g.addColorStop(1,P.ceil||P.dirt);c.fillStyle=g;c.fillRect(x0,0,x1-x0,h);c.fillStyle='rgba(0,0,0,.35)';c.fillRect(x0,h-2,x1-x0,2);c.fillStyle='rgba(255,255,255,.12)';c.fillRect(x0,h-3,x1-x0,1);
 const ao=c.createLinearGradient(0,h,0,h+8);ao.addColorStop(0,'rgba(0,0,0,.25)');ao.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=ao;c.fillRect(x0,h,x1-x0,8);}
function spike(c,x,y,w,hgt,down){c.save();c.translate(x,y);if(down)c.scale(1,-1);
 c.fillStyle='#ECEFF5';c.beginPath();c.moveTo(-w/2,0);c.lineTo(0,-hgt);c.lineTo(0,0);c.fill();
 c.fillStyle='#8790A3';c.beginPath();c.moveTo(0,0);c.lineTo(0,-hgt);c.lineTo(w/2,0);c.fill();
 c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=.8;c.beginPath();c.moveTo(-w/4,-hgt*.45);c.lineTo(0,-hgt);c.stroke();c.restore();}
function ceilSpikes(c,x0,x1,y){glow(c,(x0+x1)/2,y+8,(x1-x0)*.45,'rgba(255,255,255,.08)');c.fillStyle='#3E4556';c.fillRect(x0-2,y-1,x1-x0+4,3);for(let x=x0;x<x1;x+=10)spike(c,x+5,y+1,9,12,true);}
function spikesUp(c,x0,x1,y,hk){if(hk<=.01)return;c.fillStyle='#2D3240';c.fillRect(x0-2,y-1,x1-x0+4,3);c.save();c.beginPath();c.rect(x0-4,0,x1-x0+8,y);c.clip();for(let x=x0;x<x1;x+=7)spike(c,x+3.5,y,7,24*hk,false);c.restore();
 c.fillStyle='rgba(0,0,0,.25)';c.fillRect(x0-2,y+1,x1-x0+4,2);}
function limb(c,x,y,a1,a2,L1,L2){const kx=x+Math.sin(a1)*L1,ky=y+Math.cos(a1)*L1;const fx=kx+Math.sin(a1+a2)*L2,fy=ky+Math.cos(a1+a2)*L2;c.moveTo(x,y);c.lineTo(kx,ky);c.lineTo(fx,fy);}
function stick(c,x,y,o={}){
 const s=Math.sin(o.ph||0),st=o.st||'run',col=o.col||HERO;
 if(!o.noShadow&&y<=G+.5&&y>G-90&&!o.rot){const hgt=G-y,k=1-hgt/90;c.fillStyle=`rgba(0,0,0,${.28*k})`;c.beginPath();c.ellipse(x,G+1.5,11*k+3,2.6*k+.6,0,0,7);c.fill();}
 c.save();c.translate(x,y);if(o.flip)c.scale(-1,1);if(o.rot)c.rotate(o.rot);
 if(st==='run')c.rotate(.08);
 const hy=-17,sy=hy-12;
 const path=()=>{c.beginPath();
  if(st==='run'){limb(c,0,hy,s*.75,-(.2+Math.max(0,-s)*1.1),9,9);limb(c,0,hy,-s*.75,-(.2+Math.max(0,s)*1.1),9,9);}
  else if(st==='air'){limb(c,0,hy,.7,-1.3,9,9);limb(c,0,hy,-.2,-.7,9,9);}
  else if(st==='zap'){limb(c,0,hy,.45,0,9,9);limb(c,0,hy,-.45,0,9,9);}
  else if(st==='slide'){limb(c,0,hy,.6,-.2,9,9);limb(c,0,hy,-.35,-.3,9,9);}
  else{limb(c,0,hy,.14,0,9,9);limb(c,0,hy,-.14,0,9,9);}
  c.moveTo(0,hy);c.lineTo(0,hy-15);
  if(st==='run'){limb(c,0,sy,-s*.9,.7,7,7);limb(c,0,sy,s*.9,.7,7,7);}
  else if(st==='air'){limb(c,0,sy,2.6,.4,7,7);limb(c,0,sy,-2.3,-.3,7,7);}
  else if(st==='zap'){limb(c,0,sy,2.4,.2,7,7);limb(c,0,sy,-2.4,-.2,7,7);}
  else if(st==='slide'){limb(c,0,sy,2.0,.5,7,7);limb(c,0,sy,-2.6,-.6,7,7);}
  else{limb(c,0,sy,.25,.3,7,7);limb(c,0,sy,-.25,-.3,7,7);}};
 c.lineCap='round';c.lineJoin='round';
 path();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=5.4;c.stroke();
 c.beginPath();c.arc(0,hy-22,8.6,0,7);c.fillStyle='rgba(255,255,255,.55)';c.fill();
 path();c.strokeStyle=col;c.lineWidth=3.4;c.stroke();
 if(col===HERO){c.fillStyle='#FF4D6D';c.beginPath();c.moveTo(-3.5,hy-15);c.lineTo(3.5,hy-15);c.lineTo(3,hy-12);c.lineTo(-11,hy-11+Math.sin((o.ph||0)*1.3)*2.5);c.lineTo(-12,hy-14+Math.sin((o.ph||0)*1.3)*2);c.closePath();c.fill();c.fillStyle='#C9184A';c.fillRect(-3.5,hy-13.5,7,1.5);}
 const hg=c.createRadialGradient(-2.5,hy-25,1,0,hy-22,8);hg.addColorStop(0,shade(col==='#FFFFFF'?'#FFFFFF':col,col==='#FFFFFF'?0:.35));hg.addColorStop(1,col);c.fillStyle=hg;c.beginPath();c.arc(0,hy-22,7,0,7);c.fill();
 c.fillStyle='#fff';c.beginPath();c.ellipse(3.2,hy-23,1.9,2.3,0,0,7);c.fill();c.fillStyle='#111';c.beginPath();c.arc(3.8,hy-22.6,.9,0,7);c.fill();
 c.restore();
}
function lying(c,x,y,col){c.save();c.translate(x,y-4);c.rotate(-Math.PI/2);stick(c,0,0,{st:'idle',col});c.restore();}
function say(c,x,y,t,col='#fff',fg='#1F2233'){c.font='800 11px Nunito, system-ui';const w=c.measureText(t).width+12;const bx=cl(x-w/2,4,W-w-4);c.fillStyle=col;c.beginPath();c.roundRect(bx,y-14,w,18,8);c.fill();c.beginPath();c.moveTo(x-4,y+4);c.lineTo(x+3,y+4);c.lineTo(x-2,y+10);c.fill();c.fillStyle=fg;c.textAlign='left';c.textBaseline='middle';c.fillText(t,bx+6,y-5);}
function ghost(c,x,y,k,t,wings){
 c.save();c.translate(x+Math.sin(t*3)*3,y);c.globalAlpha=k>.85?(1-k)/.15:1;
 if(wings){const f=Math.sin(t*14)*.5;c.fillStyle='rgba(255,255,255,.95)';for(const d of[-1,1]){c.save();c.scale(d,1);c.rotate(-.3+f);c.beginPath();c.ellipse(15,0,12,6,-.4,0,7);c.fill();c.restore();}
  c.strokeStyle='#FFD166';c.lineWidth=2.5;c.beginPath();c.ellipse(0,-17,8,2.5,0,0,7);c.stroke();}
 c.fillStyle='rgba(250,252,255,.96)';c.beginPath();c.arc(0,-6,10,Math.PI,0);c.lineTo(10,10);for(let i=0;i<4;i++){c.quadraticCurveTo(7.5-i*5,14+Math.sin(t*8+i)*2,5-i*5,10)}c.lineTo(-10,-6);c.fill();
 c.fillStyle='#1F2233';c.beginPath();c.arc(-3.5,-6,1.8,0,7);c.arc(3.5,-6,1.8,0,7);c.fill();
 if(!wings){c.strokeStyle='rgba(250,252,255,.96)';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(9,-1);c.lineTo(17,-9+Math.sin(t*12)*4);c.stroke();}
 c.restore();
}
const CONF=['#FF5C8A','#FFD166','#5EEAD4','#7C83FD','#FF9F43'];
function death(c,type,x,y,k,t){
 if(k<=0)return;
 if(type==='balloon'){
  if(k<.38){const q=eo(k/.38),s=.7+q*1.1;c.save();c.translate(x,y-26-q*16);c.fillStyle='#FF5C8A';c.beginPath();c.ellipse(0,0,11*s,13*s,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-4*s,-5*s,2.5*s,3.5*s,-.5,0,7);c.fill();c.fillStyle=HERO;c.beginPath();c.arc(-4*s,-1*s,1.8,0,7);c.arc(4*s,-1*s,1.8,0,7);c.fill();c.beginPath();c.arc(0,4*s,2.2*s,0,7);c.fill();c.strokeStyle=HERO;c.lineWidth=1.5;c.beginPath();c.moveTo(0,13*s);c.quadraticCurveTo(5,18*s,0,24*s);c.stroke();c.restore();}
  else{const q=(k-.38)/.62;for(let i=0;i<22;i++){const a=i*2.39,d=eo(q)*(26+(i*17)%34);c.save();c.translate(x+Math.cos(a)*d,y-44+Math.sin(a)*d*.7+q*q*60);c.rotate(a+q*9);c.globalAlpha=1-q*.5;c.fillStyle=CONF[i%5];c.fillRect(-3,-1.5,6,3);c.restore();}
   c.globalAlpha=1;if(q<.55){c.save();c.translate(x,y-58);c.scale(1+q,1+q);c.font='22px "Lilita One", system-ui';c.textAlign='center';c.fillStyle='#FFD166';c.strokeStyle=HERO;c.lineWidth=4;c.strokeText('POP!',0,0);c.fillText('POP!',0,0);c.restore();}
   c.fillStyle='#FF5C8A';c.beginPath();c.ellipse(x,y-2,7,2.6,0,0,7);c.fill();}
 }else if(type==='disco'){
  if(k<.62){const f=Math.floor(k*34)%2;c.save();for(let i=0;i<8;i++){c.fillStyle=`hsla(${(i*45+k*900)%360},95%,62%,.28)`;c.beginPath();c.moveTo(x,y-78);const a=-1.2+i*.34+Math.sin(k*20)*.1;c.lineTo(x+Math.sin(a)*120-10,y-78+Math.cos(a)*120);c.lineTo(x+Math.sin(a)*120+10,y-78+Math.cos(a)*120);c.fill();}c.restore();
   c.fillStyle='#C9D1E0';c.beginPath();c.arc(x,y-78,7,0,7);c.fill();c.fillStyle='#fff';for(let i=0;i<6;i++)c.fillRect(x-5+(i%3)*4,y-82+Math.floor(i/3)*5,2,2);c.strokeStyle='#C9D1E0';c.lineWidth=1;c.beginPath();c.moveTo(x,y-85);c.lineTo(x,y-100);c.stroke();
   stick(c,x+(f?1.5:-1.5),y,{st:'zap',col:f?'#FFFFFF':HERO});
   if(f){c.strokeStyle='#5EEAD4';c.lineWidth=1.5;c.beginPath();for(let i=0;i<4;i++){c.moveTo(x-12+i*8,y-60);c.lineTo(x-8+i*8,y-52);c.lineTo(x-12+i*8,y-46)}c.stroke();}
  }else{lying(c,x,y,'#2C2C34');const q=(k-.62)/.38;c.fillStyle=`rgba(200,200,210,${.6-q*.5})`;for(let i=0;i<3;i++){c.beginPath();c.arc(x-12+i*10,y-12-q*30-i*6,4+q*6,0,7);c.fill();}say(c,x,y-34,'zzt…','#FFD166');}
 }else if(type==='afro'){
  stick(c,x,y,{st:'idle',col:'#2A2A30'});
  c.fillStyle='#17171C';for(let i=0;i<9;i++){const a=Math.PI+i*Math.PI/8;c.beginPath();c.arc(x+Math.cos(a)*10,y-61+Math.sin(a)*9,7,0,7);c.fill();}c.beginPath();c.arc(x,y-63,11,0,7);c.fill();
  const bl=Math.floor(k*12)%5===0;c.fillStyle='#fff';if(!bl){c.beginPath();c.arc(x-3,y-62,1.8,0,7);c.arc(x+3,y-62,1.8,0,7);c.fill();}
  const q=(k*3)%1;c.fillStyle=`rgba(90,90,100,${.7-q*.6})`;for(let i=0;i<3;i++){c.beginPath();c.arc(x+10+q*16+i*5,y-52-q*10-i*4,3+q*5,0,7);c.fill();}
  if(k>.25)say(c,x+6,y-82,'*cough* *cough*');
 }else if(type==='byebye'){
  if(y<H-4)lying(c,x,y,'#6B7088');
  ghost(c,x,y-20-eo(k)*55,k,t,false);
  if(k>.15&&k<.85)say(c,x+18,y-96+(1-eo(k))*40,'bye bye!');
 }else if(type==='wings'){
  if(y<H-4)lying(c,x,y,'#6B7088');
  ghost(c,x,y-24-ei(k)*110,k,t,true);
 }
}

