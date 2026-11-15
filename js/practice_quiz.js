
var Q=[
{t:"data",q:"In the alert threshold demo, you move the line from 0.50 up to 0.90. What usually happens?",
 c:["Fewer false alarms, but more real attacks are missed","More false alarms and fewer missed attacks","Both false alarms and missed attacks go down","Nothing changes, because the model is the same"],a:0,
 h:"A higher line means an event needs a higher score before it raises an alert.",
 e:"A higher line removes many normal events from the alert list, so there are fewer false alarms. But attacks with middle scores now fall below the line and are missed. You trade one error for the other. Context can help you choose where to put the line."},
{t:"resp",q:"A malware outbreak is spreading across several departments and you do not yet know how far it has gone. Which containment scope fits best?",
 c:["Isolate one host","Block the affected network segment","Reset one user's password","Wait and collect more evidence first"],a:1,
 h:"Think about which option covers many systems at once, even if it disrupts normal work.",
 e:"Network segment containment protects many systems at once. It costs more disruption, so use it when the spread is wide or unknown. Isolating one host is too narrow, and waiting gives the attacker more time."},
{t:"human",q:"You lock a student's account, but the login was actually real. Which simulation meter is hurt most by this wrong lock?",
 c:["Visibility","Speed","Trust","Integrity"],a:2,
 h:"Think about how the student and the staff feel about the security team after this.",
 e:"A wrong lock costs one person their access and weakens confidence in the security team. That is a Trust cost. The choice was still fast, so Speed is not the problem. Always ask: what if I am wrong?"},
{t:"human",q:"On the autonomy dial, which action should always keep a human approval step?",
 c:["Blocking a known bad web address","Adding a tag to an alert","Shutting down a hospital's main database server","Sorting alerts into a priority order"],a:2,
 h:"Look for the action that is high impact and hard to undo.",
 e:"Actions that are high impact or hard to reverse need a human decision. Tagging, sorting and blocking a known bad address are low risk and easy to undo, so a machine can do them alone."},
{t:"human",q:"Analysts start to ignore a certain alert type because most of them are false. What is this problem called?",
 c:["Model drift","Alert fatigue","Baseline poisoning","Lateral movement"],a:1,
 h:"The word describes people becoming tired.",
 e:"Alert fatigue happens when too many false alarms teach people to stop paying attention. The real attack can then hide in the noise. Better context, tuning, and a sensible threshold reduce it."},
{t:"data",q:"Two servers have clocks that are 9 minutes apart. What is the most direct problem for the security team?",
 c:["The logs take more storage space","Events cannot be put in the correct order across systems","The firewall stops working","Passwords expire early"],a:1,
 h:"Think about building a timeline of an attack across several machines.",
 e:"Detection and investigation depend on a correct timeline. If clocks disagree, an event that happened later can look earlier, and correlation rules can fail. Time synchronisation is a basic data engineering task."},
{t:"data",q:"What does 'dwell time' measure?",
 c:["How long an alert waits in the queue","How long an attacker is inside the network before being found","How long a patch takes to install","How long a user stays logged in"],a:1,
 h:"The word 'dwell' means to stay in a place.",
 e:"Dwell time is the time between the attacker getting in and the defender finding them. Shorter dwell time usually means less damage, which is why good data and fast detection matter."},
{t:"mat",q:"Which example is Predictive, the third rung on the maturity ladder?",
 c:["Restoring systems from backup after an attack","Closing a port after a scan alert fires","A model ranks which assets are most likely to be attacked next, using threat data and exposure","A weekly meeting to read last month's incident report"],a:2,
 h:"Predictive means looking forward with data, before any attack signs appear.",
 e:"Predictive security uses data and models to estimate what is likely to happen next, then acts early. The other options respond after something has already happened, so they are Reactive."},
{t:"human",q:"A team wants to measure how well staff handle phishing. Which measure shows the most useful change in culture?",
 c:["The click rate only","The number of staff who were punished","How many staff report suspicious messages, and how fast","The number of phishing emails sent in tests"],a:2,
 h:"Think of people as sensors. What do you want them to do?",
 e:"A reporting rate turns people into early warning sensors, and it rises when the culture is safe. The click rate alone can push people to hide mistakes. Fast reports give the security team data that machines may miss."},
{t:"mat",q:"Attackers use AI to write well-written, personal phishing emails at large scale. Which defence is strongest?",
 c:["Train staff to spot spelling mistakes","Phishing-resistant sign-in, so a stolen password alone is not enough","Block all email from outside the company","Hope the spam filter improves"],a:1,
 h:"Spelling mistakes are no longer a reliable sign. What control does not depend on spotting the message?",
 e:"When messages look perfect, you cannot rely on people to spot every one. Use controls that still work after a person is fooled, such as phishing-resistant multi-factor sign-in, plus behaviour-based detection. Data and AI on the defence side should back this up."},
{t:"data",q:"A detection model worked well in January, but by June it misses more attacks. The business has moved to new cloud tools. What is the most likely cause?",
 c:["Model drift: the data no longer looks like the training data","The attackers stopped attacking","The model has become too fast","Too many analysts are working on it"],a:0,
 h:"The world changed, but the model did not.",
 e:"When normal behaviour changes, a model trained on old data becomes less accurate. This is model drift. Monitor model quality over time and retrain with fresh, checked data."},
{t:"resp",q:"An alert says a server contacted an unknown address. Which extra piece of context should change your priority the most?",
 c:["The server is the main customer payment database","The alert was created on a Tuesday","The alert text is short","The analyst on shift is new"],a:0,
 h:"Which piece of information tells you what is at stake?",
 e:"Asset importance shows what the attacker could reach or damage. Adding context such as asset value, user role and recent changes helps you decide which alerts matter first. Day of week, text length and analyst experience do not change the risk."}
];
var TOPIC={data:["Detection data","t-data"],resp:["Response choices","t-resp"],human:["People and AI","t-human"],mat:["Maturity and threats","t-mat"]};
var root=document.documentElement,app=document.getElementById('app');
var S={order:[],i:0,ans:{},shuffleOn:true,hintOn:true,hintShown:false,done:false,pool:[],timeTaken:0};
var timer={running:false,elapsed:0,last:0,tick:null};

/* theme */
var themeButton=document.getElementById('themeSwitch');
function setTheme(t,save){root.setAttribute('data-theme',t);
  themeButton.textContent=t==='dark'?'☼':'☾';
  themeButton.setAttribute('aria-pressed',t==='dark'?'true':'false');
  themeButton.setAttribute('aria-label',t==='dark'?'Switch to light theme':'Switch to dark theme');
  themeButton.setAttribute('title',t==='dark'?'Switch to light theme (t)':'Switch to dark theme (t)');
  if(save){try{localStorage.setItem('dd-theme',t)}catch(e){}}}
(function(){var t=null;try{t=localStorage.getItem('dd-theme')}catch(e){}
  if(t!=='light'&&t!=='dark'){t=(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';}
  setTheme(t,false);})();
themeButton.onclick=function(){setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark',true)};

var hintToggle=document.getElementById('hintToggle');
var shuffleToggle=document.getElementById('shuffleToggle');
function syncHintToggle(){
  hintToggle.textContent='?';
  hintToggle.setAttribute('aria-pressed',S.hintOn?'true':'false');
  hintToggle.setAttribute('aria-label',(S.hintOn?'Disable':'Enable')+' hints');
  hintToggle.title=(S.hintOn?'Disable':'Enable')+' hints (h)';
}
function toggleHints(){
  S.hintOn=!S.hintOn;S.hintShown=false;syncHintToggle();
  if(document.getElementById('qt'))showQ();
}
hintToggle.onclick=toggleHints;

function syncShuffleToggle(){
  shuffleToggle.setAttribute('aria-pressed',S.shuffleOn?'true':'false');
}
function toggleShuffle(){
  S.shuffleOn=!S.shuffleOn;
  syncShuffleToggle();
}
shuffleToggle.onclick=toggleShuffle;

function formatTime(seconds){
  seconds=Math.max(0,Math.floor(seconds));
  var minutes=Math.floor(seconds/60),remaining=seconds%60;
  return (minutes<10?'0':'')+minutes+':'+(remaining<10?'0':'')+remaining;
}
function updateTimer(){
  var seconds=timer.elapsed+(timer.running?(Date.now()-timer.last)/1000:0);
  document.getElementById('quizClock').textContent=formatTime(seconds);
  var pace=document.getElementById('quizPace'),delta=seconds-600;
  pace.classList.toggle('on-pace',Math.abs(delta)<30);
  pace.classList.toggle('early',delta<=-30);
  pace.classList.toggle('delayed',delta>=30);
  pace.title=delta< -30?'Under 10-minute target by '+formatTime(-delta):delta>30?'Over 10-minute target by '+formatTime(delta):'On pace';
}
function setTimerRunning(running){
  if(running===timer.running)return;
  if(running){timer.running=true;timer.last=Date.now();timer.tick=setInterval(updateTimer,500);}
  else{timer.elapsed+=timer.last?(Date.now()-timer.last)/1000:0;timer.last=0;timer.running=false;clearInterval(timer.tick);}
  updateTimer();
}
function setTimerPanelOpen(open){
  var panel=document.getElementById('timerPanel'),toggle=document.getElementById('timerToggle');
  panel.hidden=!open;
  toggle.setAttribute('aria-expanded',open?'true':'false');
  toggle.title=(open?'Hide':'Show')+' timer (v)';
  toggle.setAttribute('aria-label',(open?'Hide':'Show')+' timer');
}
document.getElementById('timerToggle').onclick=function(){setTimerPanelOpen(document.getElementById('timerPanel').hidden);};
document.getElementById('resetQuiz').onclick=function(){
  setTimerRunning(false);timer.elapsed=0;timer.last=0;updateTimer();
  S.timeTaken=0;
  intro();
};

function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}

function intro(){
  app.innerHTML='<section class="intro"><h1>Check Your Knowledge (CYK)</h1>'+
  '<p>Twelve questions on the same ideas as the talk and the simulation. You get an answer and a short reason after every question. This is a practice question set.</p>'+
  '<div class="facts"><div class="fact"><b>12</b><span>questions</span></div><div class="fact"><b>~10 min</b><span>to finish</span></div><div class="fact"><b>4</b><span>topics scored</span></div></div>'+
  '<div class="row"><button class="btn" id="go">Start the quiz</button></div>'+
  '<p class="muted" style="margin-top:16px;font-size:14px">Keys: <span class="kbd">1</span>–<span class="kbd">4</span> or <span class="kbd">a</span>–<span class="kbd">d</span> choose an answer, <span class="kbd">h</span> toggle hints, <span class="kbd">s</span> toggle shuffle, <span class="kbd">v</span> show timer, <span class="kbd">r</span> restart, <span class="kbd">o</span> show/hide Defendasaurus, <span class="kbd">Enter</span> next.</p></section>';
  document.getElementById('go').onclick=function(){
    start(Q.map(function(_,i){return i}));};
}
function start(idx){
  if(timer.running)setTimerRunning(false);
  timer.elapsed=0;timer.last=0;S.timeTaken=0;
  setTimerRunning(true);
  setTimerPanelOpen(true);
  S.pool=idx.slice();S.order=S.shuffleOn?shuf(idx):idx.slice();S.i=0;S.ans={};S.hintShown=false;S.done=false;
  S.opt={};S.order.forEach(function(qi){var n=Q[qi].c.length,o=[];for(var k=0;k<n;k++)o.push(k);S.opt[qi]=S.shuffleOn?shuf(o):o;});
  showQ();
}
function showQ(){
  var qi=S.order[S.i],d=Q[qi],tp=TOPIC[d.t],ans=S.ans[qi],n=S.order.length;
  var h='<div class="progress"><span>Question '+(S.i+1)+' of '+n+'</span><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="'+n+'" aria-valuenow="'+Object.keys(S.ans).length+'"><i style="width:'+(Object.keys(S.ans).length/n*100)+'%"></i></div></div>';
  h+='<div class="card quiz-question"><div class="question-layout"><section class="question-main"><span class="tag '+tp[1]+'">'+tp[0]+'</span><p class="q" id="qt">'+esc(d.q)+'</p><ul class="choices" role="group" aria-labelledby="qt">';
  S.opt[qi].forEach(function(oi,pos){
    var cls='choice',dis='';
    if(ans!==undefined){dis=' disabled';if(oi===d.a)cls+=' right';else if(oi===ans)cls+=' wrong';else cls+=' dim';}
    h+='<li><button type="button" class="'+cls+'" data-oi="'+oi+'"'+dis+'><span class="k">'+'ABCD'[pos]+'</span><span>'+esc(d.c[oi])+'</span></button></li>';
  });
  h+='</ul>';
  if(ans!==undefined){var ok=ans===d.a;
    h+='<div class="fb '+(ok?'ok':'no')+'" role="status"><b>'+(ok?'Correct.':'Not quite. The answer is: '+esc(d.c[d.a]))+'</b><p>'+esc(d.e)+'</p></div>';
    h+='<div class="row"><button type="button" class="btn" id="next">'+(S.i+1<n?'Next question':'See my results')+'</button></div>';}
  h+='</section>';
  if(S.hintOn){
    h+='<aside class="question-aside" aria-label="Question hint"><h2>Hint</h2>'+
      (S.hintShown||ans!==undefined?'<div class="hintbox">'+esc(d.h)+'</div>':'<div class="row"><button type="button" class="btn ghost" id="hint">Show hint</button></div>')+
      '</aside>';
  }
  h+='</div></div>';
  app.innerHTML=h;
  var cs=app.querySelectorAll('.choice');
  Array.prototype.forEach.call(cs,function(b){b.onclick=function(){pick(parseInt(b.getAttribute('data-oi'),10))}});
  var hb=document.getElementById('hint');if(hb)hb.onclick=function(){S.hintShown=true;showQ();var x=app.querySelector('.choice');if(x)x.focus();};
  var nb=document.getElementById('next');if(nb){nb.onclick=next;nb.focus();}
}
function pick(oi){var qi=S.order[S.i];if(S.ans[qi]!==undefined)return;S.ans[qi]=oi;
  document.dispatchEvent(new CustomEvent('practice-quiz:answer',{detail:{correct:oi===Q[qi].a}}));
  showQ();}
function next(){if(S.i+1<S.order.length){S.i++;S.hintShown=false;showQ();window.scrollTo(0,0);}else results();}
function results(){
  if(timer.running)setTimerRunning(false);
  S.timeTaken=timer.elapsed;
  S.done=true;var n=S.order.length,right=0,by={},miss=[];
  S.order.forEach(function(qi){var d=Q[qi];by[d.t]=by[d.t]||{r:0,n:0};by[d.t].n++;
    if(S.ans[qi]===d.a){right++;by[d.t].r++;}else miss.push(qi);});
  var pct=Math.round(right/n*100),msg;
  if(pct>=90)msg='Excellent. You are ready for the real quiz.';
  else if(pct>=70)msg='Good. Review the topics below that are marked in orange.';
  else msg='A useful start. Go through the explanations again, then retry the missed questions.';
  var h='<section class="card"><span class="tag t-mat">Results</span><div class="score">'+right+' / '+n+'</div><p><b>'+pct+'%.</b> '+msg+'</p><p><b>Time taken:</b> '+formatTime(S.timeTaken)+'</p><div class="topics">';
  Object.keys(TOPIC).forEach(function(k){if(!by[k])return;var b=by[k],p=Math.round(b.r/b.n*100);
    h+='<div class="topic'+(p<70?' low':'')+'"><b>'+TOPIC[k][0]+'</b><span>'+b.r+' / '+b.n+'</span><div class="meter"><i style="width:'+p+'%"></i></div></div>';});
  h+='</div><div class="row">';
  if(miss.length)h+='<button class="btn" id="retry">Retry '+miss.length+' missed</button>';
  h+='<button class="btn ghost" id="again">Start over</button></div>';
  h+='<h2 style="margin-top:26px;font-size:20px">Your answers</h2><ul class="review">';
  S.order.forEach(function(qi){var d=Q[qi],ok=S.ans[qi]===d.a;
    h+='<li><span class="m '+(ok?'y':'n')+'" aria-label="'+(ok?'Correct':'Wrong')+'">'+(ok?'✓':'✗')+'</span><span>'+esc(d.q)+(ok?'':'<br><span class="muted">Answer: '+esc(d.c[d.a])+'</span>')+'</span></li>';});
  h+='</ul></section>';
  app.innerHTML=h;window.scrollTo(0,0);
  var r=document.getElementById('retry');if(r)r.onclick=function(){start(miss)};
  document.getElementById('again').onclick=intro;
}
document.addEventListener('keydown',function(ev){
  if(ev.ctrlKey||ev.metaKey||ev.altKey||ev.repeat)return;
  var tag=ev.target&&ev.target.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
  if(ev.key.toLowerCase()==='t'){ev.preventDefault();themeButton.click();return;}
  if(ev.key.toLowerCase()==='h'){ev.preventDefault();toggleHints();return;}
  if(ev.key.toLowerCase()==='s'&&document.getElementById('shuffleToggle')){ev.preventDefault();toggleShuffle();return;}
  if(ev.key.toLowerCase()==='v'){ev.preventDefault();document.getElementById('timerToggle').click();return;}
  if(ev.key.toLowerCase()==='r'){ev.preventDefault();document.getElementById('resetQuiz').click();return;}
  if(S.done||!S.order.length||!document.getElementById('qt'))return;
  var qi=S.order[S.i],k=ev.key.toLowerCase(),answered=S.ans[qi]!==undefined;
  var map={'1':0,'2':1,'3':2,'4':3,'a':0,'b':1,'c':2,'d':3};
  if(!answered&&map.hasOwnProperty(k)&&map[k]<S.opt[qi].length){pick(S.opt[qi][map[k]]);ev.preventDefault();}
  else if(!answered&&k==='h'&&S.hintOn&&!S.hintShown){S.hintShown=true;showQ();}
  else if(answered&&k==='enter'&&document.activeElement.id!=='next'){next();ev.preventDefault();}
});
syncHintToggle();
updateTimer();
intro();
