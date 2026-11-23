(function(){
  "use strict";

  var root=document.documentElement;
  var themeButton=document.getElementById('themeSwitch');

  function applyTheme(theme){
    root.setAttribute('data-theme',theme);
    themeButton.textContent=theme==='dark'?'☼':'☾';
    themeButton.setAttribute('aria-pressed',theme==='dark'?'true':'false');
    themeButton.setAttribute('aria-label',theme==='dark'?'Switch to light theme':'Switch to dark theme');
    themeButton.title=theme==='dark'?'Switch to light theme (t)':'Switch theme (t)';
  }

  var savedTheme=null;
  try{savedTheme=localStorage.getItem('dd-theme');}catch(e){}
  var initialTheme=savedTheme==='dark'||savedTheme==='light'
    ?savedTheme
    :(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  applyTheme(initialTheme);

  themeButton.addEventListener('click',function(){
    var theme=root.getAttribute('data-theme')==='dark'?'light':'dark';
    applyTheme(theme);
    try{localStorage.setItem('dd-theme',theme);}catch(e){}
  });

  document.getElementById('pdfBtn').addEventListener('click',function(){window.print();});

  var timerPanel=document.getElementById('timerPanel');
  document.getElementById('timerToggle').addEventListener('click',function(){
    var show=timerPanel.hidden;
    timerPanel.hidden=!show;
    this.setAttribute('aria-expanded',show?'true':'false');
    this.setAttribute('aria-label',show?'Hide timer':'Show timer');
  });

  var running=false;
  var elapsed=0;
  var startedAt=0;
  var interval=null;
  var timerButton=document.getElementById('timerBtn');
  function renderTimer(){
    var seconds=elapsed+(running?Math.floor((Date.now()-startedAt)/1000):0);
    var minutes=Math.floor(seconds/60);
    var remainder=seconds%60;
    document.getElementById('clock').textContent=
      (minutes<10?'0':'')+minutes+':'+(remainder<10?'0':'')+remainder;
  }
  timerButton.addEventListener('click',function(){
    if(running){
      elapsed+=Math.floor((Date.now()-startedAt)/1000);
      running=false;
      clearInterval(interval);
      interval=null;
      this.textContent='▷';
      this.title='Start timer (p)';
      this.setAttribute('aria-label','Start timer');
    }else{
      running=true;
      startedAt=Date.now();
      this.textContent='Ⅱ';
      this.title='Pause timer (p)';
      this.setAttribute('aria-label','Pause timer');
      interval=setInterval(renderTimer,500);
    }
    this.setAttribute('aria-pressed',running?'true':'false');
    renderTimer();
  });

  document.addEventListener('keydown',function(event){
    if(event.ctrlKey||event.metaKey||event.altKey||event.repeat)return;
    var tag=event.target&&event.target.tagName;
    if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
    var key=event.key.toLowerCase();
    if(key==='d'){
      event.preventDefault();
      window.print();
    }else if(key==='t'){
      themeButton.click();
    }else if(key==='p'){
      if(timerPanel.hidden)document.getElementById('timerToggle').click();
      timerButton.click();
    }
  });
})();
