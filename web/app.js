// ---------- app mode (Android APK) ----------
if(document.documentElement.classList.contains('app')){
 // The hero picker moves into the start card, so the player picks Dash, Nova or Bolt before playing.
 const hs=$('heroes'),card=$('bStart').parentNode;hs.classList.add('appheroes');card.insertBefore(hs,$('bStart'));
 const fit=()=>{const d=$('dev');d.className='device full';d.style.width='';d.style.height='';layoutO();resize();};
 addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,150));fit();
 // Android back button (sent by the app) pauses the game.
 window.tdBack=()=>{if(G_.state==='play'){$('bPause').click();return true;}return false;};
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&G_.state==='play')$('bPause').click();});
}
