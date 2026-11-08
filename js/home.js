(function(){
  var root=document.documentElement,button=document.getElementById('themeSwitch'),theme;
  try { theme=localStorage.getItem('dd-theme'); } catch (e) {}
  if(!theme) theme=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  function applyTheme(value){
    root.setAttribute('data-theme',value);
    button.textContent=value==='dark'?'☾':'☼';
    button.setAttribute('aria-label',value==='dark'?'Switch to light theme':'Switch to dark theme');
  }
  applyTheme(theme);
  button.addEventListener('click',function(){
    theme=root.getAttribute('data-theme')==='dark'?'light':'dark';
    applyTheme(theme);
    try { localStorage.setItem('dd-theme',theme); } catch (e) {}
  });
  document.addEventListener('keydown',function(event){
    if(event.ctrlKey||event.metaKey||event.altKey||event.repeat)return;
    var tag=event.target&&event.target.tagName;
    if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
    var key=event.key.toLowerCase();
    var shortcut=event.shiftKey?'Shift+'+event.key.toUpperCase():key;
    var target=document.querySelector('[data-shortcut="'+shortcut+'"]');
    if(target){event.preventDefault();target.click();}
  });
})();
