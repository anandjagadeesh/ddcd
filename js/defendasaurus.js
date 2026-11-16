(function(){
  var script=document.currentScript;
  function init(){
  // Install Defendasaurus only after the page has fully loaded.
  if(document.getElementById('pgWrap'))return;
  var defaultVisible=script&&script.dataset.defaultVisible==='true';
  var answerFeedback=script&&script.dataset.answerFeedback==='true';

  var wrap=document.createElement('div');
  wrap.className='pg-wrap';wrap.id='pgWrap';
  wrap.innerHTML=`
<svg id="defendasaurus" class="defendasaurus" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
  <g class="pg-bob">
    <polygon points="66,78 94,66 86,90 62,90" class="pg-blue-d"/>
    <polygon points="26,56 74,56 80,88 20,88" class="pg-pink"/>
    <polygon points="26,56 40,56 34,88 20,88" class="pg-pink-d"/>
    <polygon points="74,56 60,56 66,88 80,88" class="pg-blue"/>
    <rect x="30" y="88" width="14" height="6" class="pg-pink-d"/>
    <rect x="56" y="88" width="14" height="6" class="pg-pink-d"/>
    <g class="pg-head">
      <polygon points="24,14 76,14 82,34 18,34" class="pg-blue"/>
      <polygon points="18,34 82,34 78,64 22,64" class="pg-pink"/>
      <polygon points="18,34 30,34 26,64 22,64" class="pg-pink-d"/>
      <g class="pg-face">
        <circle cx="35" cy="38" r="8" fill="#fff"/>
        <circle cx="65" cy="38" r="8" fill="#fff"/>
        <g class="pg-pupils">
          <circle cx="35" cy="38" r="4.2" fill="#1e2936"/>
          <circle cx="65" cy="38" r="4.2" fill="#1e2936"/>
          <circle cx="36.5" cy="36.2" r="1.3" fill="#fff"/>
          <circle cx="66.5" cy="36.2" r="1.3" fill="#fff"/>
        </g>
        <polygon points="36,48 64,48 68,58 32,58" class="pg-beak"/>
        <rect x="43" y="51" width="4" height="3" class="pg-nostril"/>
        <rect x="53" y="51" width="4" height="3" class="pg-nostril"/>
      </g>
    </g>
  </g>
</svg>

  <div class="pg-ctrl" role="group" aria-label="Defendasaurus size"><button type="button" class="pg-btn" data-pg="shrink" aria-label="Make Defendasaurus smaller" title="Smaller">&minus;</button><button type="button" class="pg-btn" data-pg="grow" aria-label="Make Defendasaurus bigger" title="Bigger">+</button></div>`;
  document.body.appendChild(wrap);

  // header button (a static black icon) that shows / hides Defendasaurus
  var toggle=document.createElement('button');
  toggle.type='button';toggle.className='btn pg-toggle toggle-status';
  toggle.setAttribute('aria-keyshortcuts','o');
  toggle.innerHTML='<svg viewBox="0 0 100 100" width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor"><path d="M66 78 94 66 86 90 62 90Z"/><path d="M26 66 74 66 80 90 20 90Z"/><path fill-rule="evenodd" d="M24 12 76 12 83 34 78 66 22 66 17 34Z M27 38a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z M57 38a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z M35 49 65 49 69 59 31 59Z"/><circle cx="35" cy="38" r="4"/><circle cx="65" cy="38" r="4"/></svg>';
  var quizTools=document.querySelector('.quiz-tools');
  var anchor=document.getElementById('controlsToggle')||(quizTools?null:document.getElementById('themeSwitch'));
  if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(toggle,anchor);
  else (quizTools||document.querySelector('.top .tools,.top')||document.body).appendChild(toggle);

  var root=wrap.querySelector('#defendasaurus'),bob=root.querySelector('.pg-bob'),ctrl=wrap.querySelector('.pg-ctrl');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var head=root.querySelector('.pg-head'),face=root.querySelector('.pg-face');
  var tx=0,ty=0,cx=0,cy=0,raf=0;

  // --- look toward the mouse ---
  function aim(x,y){
    var r=root.getBoundingClientRect();
    var dx=x-(r.left+r.width/2),dy=y-(r.top+r.height*0.4);
    var d=Math.sqrt(dx*dx+dy*dy)||1;
    var k=Math.min(1,d/220); // looks fully sideways once the mouse is ~220px away
    tx=dx/d*k;ty=dy/d*k;
    if(!raf)raf=requestAnimationFrame(step);
  }
  function step(){
    cx+=(tx-cx)*0.18;cy+=(ty-cy)*0.18;
    head.setAttribute('transform','translate('+(cx*4).toFixed(2)+' '+(cy*2.5).toFixed(2)+') rotate('+(cx*5).toFixed(2)+' 50 60)');
    face.setAttribute('transform','translate('+(cx*9).toFixed(2)+' '+(cy*5).toFixed(2)+')');
    raf=(Math.abs(tx-cx)>0.002||Math.abs(ty-cy)>0.002)?requestAnimationFrame(step):0;
  }
  window.addEventListener('pointermove',function(e){aim(e.clientX,e.clientY);},{passive:true});
  document.addEventListener('mouseleave',function(){tx=0;ty=0;if(!raf)raf=requestAnimationFrame(step);});
  if(reduce)root.classList.add('still');

  // --- show / hide ---
  function setVisible(on){
    wrap.classList.toggle('off',!on);
    toggle.classList.toggle('is-off',!on);
    toggle.setAttribute('aria-pressed',on?'true':'false');
    toggle.setAttribute('aria-label',on?'Hide Defendasaurus':'Show Defendasaurus');
    toggle.title=(on?'Hide Defendasaurus':'Show Defendasaurus')+' (o)';
    if(!on){bubble.classList.remove('show');wrap.classList.remove('ctrls');}
  }
  toggle.addEventListener('click',function(){setVisible(wrap.classList.contains('off'));});
  document.addEventListener('keydown',function(e){
    if(e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.repeat||e.key.toLowerCase()!=='o')return;
    var tg=e.target&&e.target.tagName;
    if(tg==='INPUT'||tg==='TEXTAREA'||tg==='SELECT')return;
    e.preventDefault();toggle.click();
  });

  // --- size buttons (double-click Defendasaurus to show / hide them) ---
  var MIN=40,MAX=220,STEP=16;
  var size=wrap.getBoundingClientRect().width;
  ctrl.addEventListener('click',function(e){
    var b=e.target.closest('[data-pg]');if(!b)return;
    size=Math.max(MIN,Math.min(MAX,size+(b.getAttribute('data-pg')==='grow'?STEP:-STEP)));
    wrap.style.setProperty('--pg-size',size+'px');
  });

  // --- play: every line of speech is paired with the animation that acts it out ---
  var bubble=document.createElement('div');
  bubble.className='pg-bubble';
  bubble.setAttribute('aria-hidden','true');
  wrap.appendChild(bubble);
  var LINES=[
    ['Beep-boop!','vibrate'],
    ['Incoming message... bzzzt!','vibrate'],
    ['Have you checked the logs?','scan'],
    ['Scanning for vulnerabilities...','scan'],
    ['Enable MFA!','nod'],
    ['Yes, patching is always worth it.','nod'],
    ['Patch early, patch often.','hop'],
    ['Think before you click.','think'],
    ['Hmm... that looks suspicious.','think'],
    ['Data over guesswork.','no'],
    ['No, you cannot reuse that password!','no'],
    ['Segment your network!','sidestep'],
    ['Backups: tested?','wiggle'],
    ['Defendasaurus.exe is running...','jog'],
    ['Rebooting... done!','reboot'],
    ['Threat neutralised!','cheer'],
    ['Great job, analyst!','cheer'],
    ['Ouch! Hello!','squash'],
    ['Boing!','squash'],
    ['Glitch in the matrix!','glitch'],
    ['Packet loss detected!','glitch'],
    ['Phishing alert! Phishing alert!','alert'],
    ['Encrypting everything...','rainbow'],
    ['Loading... please wait.','loading'],
    ['Zzz... idle until the next alert.','sleep'],
    ['Whee! Cloud security!','float'],
    ['Strong passwords only!','pulse'],
    ['Flipping the script on attackers!','flip']
  ];
  var anim='',hideT,idleT,clickT,last=-1;
  function play(name){
    if(reduce)return;
    if(anim)root.classList.remove(anim);
    void root.getBoundingClientRect(); // restart the animation
    anim='pg-'+name;root.classList.add(anim);
  }
  root.addEventListener('animationend',function(e){
    if(e.target===root&&anim){root.classList.remove(anim);anim='';}
  });
  function say(text){
    bubble.textContent=text;
    bubble.classList.toggle('left',wrap.getBoundingClientRect().left<215);
    bubble.classList.add('show');
    clearTimeout(hideT);hideT=setTimeout(function(){bubble.classList.remove('show');},2800);
  }
  // speak a line and start its animation at the same moment
  function perform(){
    var i;do{i=Math.floor(Math.random()*LINES.length);}while(i===last);
    last=i;
    say(LINES[i][0]);play(LINES[i][1]);
  }
  function schedule(){clearTimeout(idleT);idleT=setTimeout(idle,9000+Math.random()*13000);}
  if(answerFeedback)document.addEventListener('cyk:answer',function(e){
    var correct=e.detail&&e.detail.correct;
    say(correct?'Great Job Analyst':'Ouch! Hello!');
    play(correct?'cheer':'squash');
    schedule();
  });
  function idle(){
    if(!document.hidden&&!wrap.classList.contains('off')&&!wrap.classList.contains('ctrls'))perform();
    schedule();
  }
  // single click = animation + callout; double click = show / hide the size buttons
  bob.addEventListener('click',function(){
    clearTimeout(clickT);
    clickT=setTimeout(function(){perform();schedule();},230); // wait to see if it becomes a double click
  });
  bob.addEventListener('dblclick',function(e){
    e.preventDefault();
    clearTimeout(clickT);
    wrap.classList.toggle('ctrls');
    schedule();
  });
  setVisible(!!defaultVisible);
  schedule();
  }
  if(document.readyState==='complete')init();
  else window.addEventListener('load',init,{once:true});
})();
