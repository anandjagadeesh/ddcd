(function(){
  "use strict";
  var root=document.documentElement;
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  var viewport=document.getElementById('viewport');
  var N=slides.length, idx=0;

  /* ---------- Theme ---------- */
  function applyTheme(t){
    root.setAttribute('data-theme',t);
    var themeButton=document.getElementById('themeSwitch');
    themeButton.textContent=t==='dark'?'☾':'☼';
    themeButton.setAttribute('aria-label',t==='dark'?'Switch to light theme':'Switch to dark theme');
  }
  var saved=null; try{saved=localStorage.getItem('dd-theme');}catch(e){}
  var initial=saved||((window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');
  applyTheme(initial);
  function toggleTheme(){
    var t=root.getAttribute('data-theme')==='dark'?'light':'dark';
    applyTheme(t); try{localStorage.setItem('dd-theme',t);}catch(e){}
  }
  document.getElementById('themeSwitch').addEventListener('click',toggleTheme);

  /* ---------- Plan times ---------- */
  var cum=[0]; slides.forEach(function(s,i){cum.push(cum[i]+parseFloat(s.getAttribute('data-min')||'0'));});

  /* ---------- Build nav ---------- */
  var jump=document.getElementById('jump'), dots=document.getElementById('dots');
  slides.forEach(function(s,i){
    var o=document.createElement('option'); o.value=i; o.textContent=(i+1)+'. '+s.getAttribute('data-title'); jump.appendChild(o);
    var b=document.createElement('button'); b.setAttribute('aria-label','Go to slide '+(i+1)); b.addEventListener('click',function(){go(i);}); dots.appendChild(b);
    var pg=s.querySelector('.pg'); if(pg) pg.textContent=(i+1)+' / '+N;
  });
  jump.addEventListener('change',function(){go(parseInt(jump.value,10));});

  /* ---------- Show ---------- */
  function go(i){
    i=Math.max(0,Math.min(N-1,i)); idx=i;
    slides.forEach(function(s,k){s.classList.toggle('active',k===i);});
    [].forEach.call(dots.children,function(d,k){d.className=k===i?'on':(k<i?'done':'');});
    jump.value=i;
    jump.hidden=slides[i].classList.contains('title-slide');
    var n=slides[i].querySelector('aside.n'); document.getElementById('notes').innerHTML=n?n.innerHTML:'';
    document.getElementById('plan').textContent=fmt(cum[i]*60);
    try{history.replaceState(null,'','#'+(i+1));}catch(e){}
    updateClock();
  }
  document.getElementById('next').addEventListener('click',function(){go(idx+1);});
  document.getElementById('prev').addEventListener('click',function(){go(idx-1);});

  /* ---------- Touch navigation ---------- */
  var swipeStart=null;
  viewport.addEventListener('pointerdown',function(e){
    if(e.pointerType!=='touch'||!e.isPrimary)return;
    if(e.target.closest('button,a,input,select,textarea,[contenteditable="true"]'))return;
    swipeStart={x:e.clientX,y:e.clientY,id:e.pointerId};
  });
  document.addEventListener('pointerup',function(e){
    if(!swipeStart||e.pointerId!==swipeStart.id)return;
    var dx=e.clientX-swipeStart.x, dy=e.clientY-swipeStart.y;
    swipeStart=null;
    if(Math.abs(dx)<50||Math.abs(dx)<Math.abs(dy)*1.25)return;
    go(idx+(dx<0?1:-1));
  });
  document.addEventListener('pointercancel',function(){swipeStart=null;});

  /* ---------- Controls visibility ---------- */
  function toggleControls(){
    var hidden=root.classList.toggle('controls-hidden');
    var b=document.getElementById('controlsToggle');
    b.textContent=hidden?'○':'◉';
    b.title=(hidden?'Show':'Hide')+' controls (c)';
    b.setAttribute('aria-label',(hidden?'Show':'Hide')+' controls');
    b.setAttribute('aria-pressed',hidden?'true':'false');
    fit();
  }
  document.getElementById('controlsToggle').addEventListener('click',toggleControls);

  /* ---------- Scale ---------- */
  function fit(){
    var w=viewport.clientWidth, h=viewport.clientHeight;
    var s=Math.min(w/1280,h/720)*0.985;
    stage.style.transform='translate(-50%,-50%) scale('+s+')';
  }
  window.addEventListener('resize',fit); fit();

  /* ---------- Timer ---------- */
  var running=false,elapsed=0,last=0,tick=null;
  var timerPanel=document.getElementById('timerPanel');
  var timerToggle=document.getElementById('timerToggle');
  function revealTimer(){
    timerPanel.hidden=!timerPanel.hidden;
    timerToggle.setAttribute('aria-expanded',timerPanel.hidden?'false':'true');
    timerToggle.title=(timerPanel.hidden?'Show':'Hide')+' timer (v)';
    timerToggle.setAttribute('aria-label',timerToggle.title);
  }
  timerToggle.addEventListener('click',revealTimer);
  function fmt(sec){sec=Math.max(0,Math.round(sec));var m=Math.floor(sec/60),s=sec%60;return (m<10?'0':'')+m+':'+(s<10?'0':'')+s;}
  function updateClock(){
    var e=elapsed+(running?(Date.now()-last)/1000:0);
    document.getElementById('clock').textContent=fmt(e);
    var d=e-cum[idx]*60, pace=document.getElementById('pace');
    var status=Math.abs(d)<30?'on-pace':(d<0?'early':'delayed');
    pace.classList.remove('on-pace','early','delayed');
    pace.classList.add(status);
    var description=status==='on-pace'?'On pace':status==='early'?'Early by '+fmt(-d):'Delayed by '+fmt(d);
    pace.title=description;
    pace.setAttribute('aria-label','Timer: '+description);
  }
  function toggleTimer(){
    var b=document.getElementById('timerBtn');
    if(timerPanel.hidden)revealTimer();
    if(running){elapsed+=(Date.now()-last)/1000;running=false;clearInterval(tick);b.textContent='▷';b.title='Start timer (p)';b.setAttribute('aria-label','Start timer');}
    else{running=true;last=Date.now();tick=setInterval(updateClock,500);b.textContent='Ⅱ';b.title='Pause timer (p)';b.setAttribute('aria-label','Pause timer');}
    updateClock();
  }
  document.getElementById('timerBtn').addEventListener('click',toggleTimer);

  /* ---------- Notes / fullscreen ---------- */
  function toggleNotes(){
    var n=document.getElementById('notes'),b=document.getElementById('notesBtn');
    var on=!n.classList.contains('show'); n.classList.toggle('show',on); b.setAttribute('aria-pressed',on?'true':'false');
  }
  document.getElementById('notesBtn').addEventListener('click',toggleNotes);
  document.getElementById('pdfBtn').addEventListener('click',printDeck);
  function toggleFs(){
    if(!document.fullscreenElement){(root.requestFullscreen||function(){}).call(root);}
    else{(document.exitFullscreen||function(){}).call(document);}
  }
  document.getElementById('fsBtn').addEventListener('click',toggleFs);

  /* ---------- Keyboard ---------- */
  document.addEventListener('keydown',function(e){
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    var tg=e.target&&e.target.tagName;
    if(tg==='SELECT'||tg==='INPUT'||tg==='TEXTAREA')return;
    var k=e.key;
    if(k==='ArrowRight'||k==='ArrowDown'||k==='PageDown'){e.preventDefault();go(idx+1);}
    else if(k==='ArrowLeft'||k==='ArrowUp'||k==='PageUp'){e.preventDefault();go(idx-1);}
    else if(k===' '&&tg!=='BUTTON'){e.preventDefault();go(idx+1);}
    else if(k==='Home'){go(0);} else if(k==='End'){go(N-1);}
    else if(k==='n'||k==='N'){toggleNotes();}
    else if(k==='c'||k==='C'){toggleControls();}
    else if(k==='t'||k==='T'){toggleTheme();}
    else if(k==='p'||k==='P'){toggleTimer();}
    else if(k==='d'||k==='D'){printDeck();}
    else if(k==='f'||k==='F'){toggleFs();}
  });

  /* ---------- Ladder (slide 6) ---------- */
  var RUNGS=[
    {n:'Step 1',nm:'Reactive',q:'What happened?',c:'--maroon',t:'--m-t',
     data:'Logs kept only for investigation. Tools do not share data. Little context.',cap:'Antivirus, fixing problems after they happen, reviews after incidents.',met:'Time to recover (MTTR); number of incidents closed.',trap:'You learn only after you are hacked.'},
    {n:'Step 2',nm:'Proactive',q:'What is happening now, and what is open to attack?',c:'--orange',t:'--o-t',
     data:'Logs in one place, a list of assets and weaknesses, threat intelligence.',cap:'Threat hunting, finding exposed systems, detection rules linked to MITRE ATT&CK.',met:'Coverage; time to detect (MTTD).',trap:'Too many alerts. Coverage is assumed, not measured.'},
    {n:'Step 3',nm:'Predictive',q:'What will happen next? Who is likely to be attacked?',c:'--green',t:'--g-t',
     data:'Labelled past events, context about each user and device, normal-behaviour baselines.',cap:'User behaviour analytics (UEBA), risk scores, anomaly detection, ranking weaknesses by how likely they are to be used.',met:'Precision and recall; warning time.',trap:'Models drift, people trust them too much, attackers can trick them.'},
    {n:'Step 4',nm:'Transformative',q:'How do we improve after every event and shape the result?',c:'--purple',t:'--p-t',
     data:'A feedback loop of labels, data quality targets, checks that data is genuine.',cap:'Levels of autonomy, detection as code, purple-team tests, AI built to resist attacks.',met:'Time to learn; strength under attack.',trap:'Automation without rules and oversight.'}
  ];
  var hands=[0,0,0,0], sel=0;
  function renderLadder(container,selection,handCounts,interactive){
    var L=container.querySelector('#ladder'); L.innerHTML='';
    RUNGS.forEach(function(r,i){
      var w=document.createElement('div'); w.className='rungwrap';
      w.style.setProperty('--rc','var('+r.c+')'); w.style.setProperty('--rct','var('+r.t+')');
      w.innerHTML='<button class="rung" aria-pressed="'+(i===selection?'true':'false')+'" style="--rc:var('+r.c+');--rct:var('+r.t+')"><div class="n">'+r.n+'</div><div class="nm">'+r.nm+'</div><div class="q">'+r.q+'</div></button>'+
        '<button class="hand" aria-label="Add a hand for '+r.nm+'">+1 · '+handCounts[i]+'</button>';
      if(interactive){
        w.querySelector('.rung').addEventListener('click',function(){ sel=i; renderLadder(document,sel,hands,true); });
        w.querySelector('.hand').addEventListener('click',function(){ hands[i]++; renderLadder(document,sel,hands,true); });
      }
      L.appendChild(w);
    });
    var r=RUNGS[selection], D=container.querySelector('#ladderDetail');
    D.style.setProperty('--dc','var('+r.c+')'); D.style.setProperty('--dct','var('+r.t+')');
    var cards=[['Data required',r.data],['Typical capability',r.cap],['Key metric',r.met],['Common trap',r.trap]];
    D.innerHTML=cards.map(function(c){return '<div class="card" style="--dc:var('+r.c+');--dct:var('+r.t+')"><h3>'+c[0]+'</h3><p>'+c[1]+'</p></div>';}).join('');
  }
  renderLadder(document,sel,hands,true);

  /* ---------- Pipeline (slide 7) ---------- */
  var PIPE=[
    ['Collect','Records from computers, logins, network, cloud and SaaS','Are all log sources working? Do they cover all assets?','Blind spots','--navy','--n-t'],
    ['Normalise','Put data in one common format (OCSF or ECS)','Parsing failures; format checks','Detections break without warning','--green','--g-t'],
    ['Enrich','Add identity, asset importance, weaknesses, intelligence','How often enrichment works; how fresh it is','Scores with no context','--purple','--p-t'],
    ['Store','Hot, warm and cold storage; keep data for the right time','Integrity, access control, cost','No history for baselines','--orange','--o-t'],
    ['Detect','Rules, machine learning, graph analysis','Precision, recall, drift','Too many alerts, or missed attacks','--maroon','--m-t'],
    ['Respond','Automatic playbooks (SOAR) with levels of autonomy','Action records; how often actions are reversed','Automation causes harm','--navy','--n-t'],
    ['Learn','Decisions become labels and new detections','Number of labels; time to learn','Defences never improve','--green','--g-t']
  ];
  document.getElementById('pipe').innerHTML=PIPE.map(function(p,i){
    return '<div class="pstep" style="--pc:var('+p[4]+');--pct:var('+p[5]+')"><div class="num">0'+(i+1)+'</div><h3>'+p[0]+'</h3><p>'+p[1]+'</p><div class="gate"><b>Check:</b> '+p[2]+'<br><b>If skipped:</b> '+p[3]+'</div></div>';
  }).join('');

  /* ---------- Self-check (slide 8) ---------- */
  var DIMS=[
    ['Coverage',['Some systems send logs. Gaps unknown','Most systems send logs. Coverage is tracked','Coverage measured against ATT&CK. Gaps become tasks']],
    ['Quality',['Raw data in different formats','Common format. Errors are tracked','Quality targets with automatic alerts']],
    ['Timeliness',['Batch or next day','Near real time for key sources','Streaming with a set delay limit']],
    ['Context',['Only IP addresses and hostnames','Adds identity and asset data','Full graph: identity, asset, weakness, data sensitivity']],
    ['Feedback',['Verdicts stay in tickets','Verdicts tracked; sometimes tuned','Closed loop: labels retrain models and new detections ship as code']]
  ];
  var scEl=document.getElementById('sc');
  DIMS.forEach(function(d,di){
    var row=document.createElement('tr');
    var l=document.createElement('th'); l.className='dim'; l.scope='row';
    var label=document.createElement('span'); label.textContent=d[0]; l.appendChild(label);
    var clear=document.createElement('button'); clear.type='button'; clear.className='clear-dim'; clear.textContent='Clear';
    clear.setAttribute('aria-label','Clear '+d[0]+' selection');
    clear.addEventListener('click',function(){
      var selected=scEl.querySelector('input[name="dim'+di+'"]:checked');
      if(selected){selected.checked=false;scoreCheck();}
    });
    l.appendChild(clear); row.appendChild(l);
    d[1].forEach(function(txt,oi){
      var cell=document.createElement('td');
      var lab=document.createElement('label'); lab.className='opt';
      lab.innerHTML='<input type="radio" name="dim'+di+'" value="'+(oi+1)+'"><span>'+txt+'</span>';
      lab.querySelector('input').addEventListener('change',scoreCheck); cell.appendChild(lab); row.appendChild(cell);
    });
    scEl.appendChild(row);
  });
  function scoreCheck(){
    var sum=0,ans=0;
    DIMS.forEach(function(d,di){var c=document.querySelector('input[name="dim'+di+'"]:checked'); if(c){sum+=parseInt(c.value,10);ans++;}});
    document.getElementById('scAns').textContent=ans+' of 5 answered';
    document.getElementById('scBar').style.width=Math.round(sum/15*100)+'%';
    var lv=document.getElementById('scLevel'),ms=document.getElementById('scMsg'),sc=document.getElementById('scScore');
    if(ans<5){sc.textContent=sum||'–';lv.textContent='Keep going';ms.textContent='Score appears when all five rows are answered.';return;}
    sc.textContent=sum+'/15';
    var out=sum<=7?['Reactive foundation','Next step: collect and clean your data reliably before you use analytics.']:
            sum<=10?['Proactive','Next step: add context and a feedback loop. Do not jump to machine learning on weak data.']:
            sum<=13?['Predictive-ready','Next step: protect against drift and poisoning. Set clear levels of autonomy.']:
                    ['Transformative-ready','Next step: test against attacks, add governance, and measure time to learn.'];
    lv.textContent=out[0]; ms.textContent=out[1];
  }

  /* ---------- HITL loop + autonomy dial (slide 11) ---------- */
  var LOOP=[['Telemetry','Streams of events','--navy','--n-t'],['AI triage','Scores, groups and explains at machine speed','--green','--g-t'],['Human judgement','Context, ethics, business impact','--orange','--o-t'],['Action','SOAR playbooks with levels of autonomy','--maroon','--m-t'],['Outcome','Contained, learned, recorded','--purple','--p-t']];
  document.getElementById('loop').innerHTML=LOOP.map(function(l){return '<div class="nd" style="--lc:var('+l[2]+');--lct:var('+l[3]+')"><b>'+l[0]+'</b>'+l[1]+'</div>';}).join('');
  var DIAL=[
    {nm:'L1 Suggest',sub:'Person acts',use:'New, high-impact or unclear events. AI summarises the evidence and suggests ideas.',sp:25,rk:15,ef:90},
    {nm:'L2 Approve',sub:'One-click approval',use:'Medium confidence or privileged accounts. AI prepares the action and a person approves it using the evidence.',sp:55,rk:30,ef:55},
    {nm:'L3 Act, then review',sub:'Limits + records',use:'High confidence and easy to undo, for example ending a session or isolating a student laptop. People review afterwards.',sp:80,rk:55,ef:30},
    {nm:'L4 Full auto',sub:'No person involved',use:'Small impact and well measured, for example blocking known bad indicators. Needs a kill switch and drift monitoring.',sp:98,rk:85,ef:8}
  ];
  var dsel=1;
  function renderDial(container,selection,interactive){
    var d=container.querySelector('#dial'); d.innerHTML='';
    DIAL.forEach(function(x,i){
      var b=document.createElement('button'); b.className='pill'; b.setAttribute('aria-pressed',i===selection?'true':'false');
      b.innerHTML=x.nm+'<small>'+x.sub+'</small>';
      if(interactive)b.addEventListener('click',function(){dsel=i;renderDial(document,dsel,true);});
      d.appendChild(b);
    });
    var x=DIAL[selection];
    container.querySelector('#dialInfo').innerHTML='<p style="margin:0;font-size:16px"><b>Use when:</b> '+x.use+'</p>';
    container.querySelector('#dialMeters').innerHTML=
      '<div class="mrow sp"><span>Speed</span><div class="meter"><i style="width:'+x.sp+'%"></i></div></div>'+
      '<div class="mrow rk"><span>Error spread</span><div class="meter"><i style="width:'+x.rk+'%"></i></div></div>'+
      '<div class="mrow ef"><span>Human effort</span><div class="meter"><i style="width:'+x.ef+'%"></i></div></div>'+
      '<p class="sub" style="font-size:14px;margin-top:8px">Examples to help discussion, not measurements.</p>';
  }
  renderDial(document,dsel,true);

  /* ---------- Toolkit 1: alert threshold demo ---------- */
  var EV=(function(){
    var out=[97,93,91,88,84,79,72,66,55,41].map(function(s){return {s:s,atk:true};});
    for(var i=0;i<90;i++){var u=((i+1)*0.6180339887)%1; out.push({s:Math.round((0.05+0.80*u*u*u)*100),atk:false});}
    out.sort(function(x,y){return (y.s-x.s)||((y.atk?1:0)-(x.atk?1:0));});
    return out;
  })();
  var thRange=document.getElementById('thRange');
  function renderTh(){
    var th=parseInt(thRange.value,10), caught=0, missed=0, fa=0, html='';
    EV.forEach(function(e){
      var al=e.s>=th;
      if(e.atk){ if(al)caught++; else missed++; } else if(al){ fa++; }
      html+='<span class="dt'+(e.atk?' atk':'')+(al?' alert':' dim')+'"></span>';
    });
    document.getElementById('dots100').innerHTML=html;
    document.getElementById('thVal').textContent=(th/100).toFixed(2);
    document.getElementById('tCaught').textContent=caught;
    document.getElementById('tMissed').textContent=missed;
    document.getElementById('tFalse').textContent=fa;
    document.getElementById('tTotal').textContent=caught+fa;
    var msg;
    if(missed>=4){ msg='The line is too high: '+missed+' of 10 attacks get through without an alert.'; }
    else if(fa>=15){ msg='Analysts must check '+(caught+fa)+' alerts and only '+caught+' are real. People get tired and start to ignore alerts.'; }
    else { msg='A balance, but not perfect: '+fa+' false alarms and '+missed+' missed attacks. Context helps you decide which alerts matter most.'; }
    document.getElementById('thMsg').textContent=msg;
  }
  thRange.addEventListener('input',renderTh);
  renderTh();

  /* ---------- Toolkit 3: containment scope ---------- */
  var SCOPE=[
    {nm:'Host',sub:'Isolate one computer',use:'Quick and simple for one infected computer. But you may stop live work and lose the chance to watch the attacker. Stolen logins still work elsewhere.',st:35,di:55,ev:25},
    {nm:'Identity',sub:'End sessions, reset secrets, extra checks',use:'Stops stolen logins, which most modern attacks use. Usually little disruption, and the logs stay available for investigation.',st:80,di:30,ev:75},
    {nm:'Network segment',sub:'Block a group or a website',use:'Protects many systems at once. But it can stop a lot of normal work. Use it when the spread is wide or unknown.',st:70,di:85,ev:50}
  ];
  var ssel=1;
  function renderScope(container,selection,interactive){
    var d=container.querySelector('#scopeDial'); d.innerHTML='';
    SCOPE.forEach(function(x,i){
      var b=document.createElement('button'); b.className='pill'; b.setAttribute('aria-pressed',i===selection?'true':'false');
      b.innerHTML=x.nm+'<small>'+x.sub+'</small>';
      if(interactive)b.addEventListener('click',function(){ssel=i;renderScope(document,ssel,true);});
      d.appendChild(b);
    });
    var x=SCOPE[selection];
    container.querySelector('#scopeInfo').innerHTML='<p style="margin:0;font-size:16px"><b>Use when:</b> '+x.use+'</p>';
    container.querySelector('#scopeMeters').innerHTML=
      '<div class="mrow gr"><span>Stops the attacker</span><div class="meter"><i style="width:'+x.st+'%"></i></div></div>'+
      '<div class="mrow rk"><span>Disruption to work</span><div class="meter"><i style="width:'+x.di+'%"></i></div></div>'+
      '<div class="mrow sp"><span>Evidence kept</span><div class="meter"><i style="width:'+x.ev+'%"></i></div></div>'+
      '<p class="sub" style="font-size:14px;margin-top:6px">Examples to help discussion, not measurements.</p>';
  }
  renderScope(document,ssel,true);

  /* ---------- Toolkit 5: practice checkpoint ---------- */
  var PC={
    a:{label:'Lock the account now',fx:[0,10,-12,0],
       what:'The account is locked within seconds. The student loses exam access for about 20 minutes until the help desk fixes it. If an attacker was there, they are stopped.',
       ck:'Question 2 (what if I am wrong?) and question 4 (who is affected?) matter most. A wrong lock costs one student an exam.'},
    b:{label:'Check first',fx:[12,-4,4,4],
       what:'The student says: "I did not log in." The success came from another country. You lock the account now, and you are sure. If the student had said yes, you would have avoided a wrong lock.',
       ck:'Question 1 (how sure am I?) matters most. Five minutes of delay bought evidence at a low cost.'}
  };
  var PCN=[['Visibility','v'],['Speed','s'],['Trust','t'],['Integrity','i']];
  function renderPc(key,container){
    container=container||document;
    var fx=key?PC[key].fx:[0,0,0,0], html='';
    PCN.forEach(function(n,i){
      var v=50+fx[i], d=fx[i]?'<span class="dv '+(fx[i]>0?'up':'dn')+'">'+(fx[i]>0?'▲ +':'▼ ')+fx[i]+'</span>':'<span class="dv muted">50</span>';
      html+='<div class="pm '+n[1]+'"><span>'+n[0]+'</span><div class="bar"><i style="width:'+v+'%"></i></div>'+d+'</div>';
    });
    container.querySelector('#pcA').setAttribute('aria-pressed',key==='a'?'true':'false');
    container.querySelector('#pcB').setAttribute('aria-pressed',key==='b'?'true':'false');
    container.querySelector('#pcMeters').innerHTML=html;
    var r=container.querySelector('#pcResult');
    if(!key){ r.innerHTML='<p style="margin:0;font-size:17px" class="sub">Choose A or B to see what happens. You can try both.</p>'; return; }
    var o=PC[key];
    r.className='card pres';
    r.innerHTML='<p><b>You chose '+key.toUpperCase()+': '+o.label+'.</b></p><p>'+o.what+'</p><p><b>Checklist:</b> '+o.ck+'</p><p class="sub"><b>Change the facts:</b> it is now the finance director\'s account, and the success came from another country. Which option would you choose?</p>';
  }
  ['a','b'].forEach(function(k){
    document.getElementById(k==='a'?'pcA':'pcB').addEventListener('click',function(){
      document.getElementById('pcA').setAttribute('aria-pressed',k==='a'?'true':'false');
      document.getElementById('pcB').setAttribute('aria-pressed',k==='b'?'true':'false');
      renderPc(k,document);
    });
  });
  renderPc(null,document);

  var printCopies=[];
  function printDeck(){
    if(printCopies.length)return;
    var variants=[
      {id:'ladder',states:[0,1,2,3],render:function(slide,state){renderLadder(slide,state,hands,false);}},
      {id:'dial',states:[0,1,2,3],render:function(slide,state){renderDial(slide,state,false);}},
      {id:'scopeDial',states:[0,1,2],render:function(slide,state){renderScope(slide,state,false);}},
      {id:'pcA',states:['a','b'],render:function(slide,state){renderPc(state,slide);}}
    ];
    var variantBySlide=[];
    variants.forEach(function(variant){
      var element=document.getElementById(variant.id);
      if(!element)throw new Error('Cannot prepare print pages: missing #'+variant.id);
      var slide=element.closest('.slide');
      if(!slide)throw new Error('Cannot prepare print pages: #'+variant.id+' is not inside a slide');
      variantBySlide.push({slide:slide,states:variant.states,render:variant.render});
    });

    var printSlides=[];
    slides.forEach(function(slide){
      if(slide.classList.contains('no-print')||slide.dataset.print==='false')return;
      var variant=null;
      for(var i=0;i<variantBySlide.length;i++){
        if(variantBySlide[i].slide===slide){variant=variantBySlide[i];break;}
      }
      if(!variant){
        printSlides.push(slide);
        return;
      }
      slide.classList.add('print-replaced');
      var anchor=slide;
      variant.states.forEach(function(state){
        var copy=slide.cloneNode(true);
        copy.classList.add('print-variant');
        copy.classList.remove('active');
        copy.classList.remove('print-replaced');
        variant.render(copy,state);
        var suffix='-print-'+printCopies.length;
        [].forEach.call(copy.querySelectorAll('[id]'),function(element){
          element.id+=suffix;
        });
        anchor.parentNode.insertBefore(copy,anchor.nextSibling);
        anchor=copy;
        printCopies.push(copy);
        printSlides.push(copy);
      });
    });

    var pageLabels=[];
    slides.forEach(function(slide){
      var page=slide.querySelector('.pg');
      if(page)pageLabels.push({element:page,text:page.textContent});
    });
    printSlides.forEach(function(slide,index){
      var page=slide.querySelector('.pg');
      if(page)page.textContent=(index+1)+' / '+printSlides.length;
    });

    function cleanup(){
      printCopies.forEach(function(copy){copy.remove();});
      printCopies=[];
      slides.forEach(function(slide){slide.classList.remove('print-replaced');});
      pageLabels.forEach(function(label){label.element.textContent=label.text;});
    }
    window.addEventListener('afterprint',cleanup,{once:true});
    window.print();
  }

  /* ---------- Init ---------- */
  var h=parseInt((location.hash||'').replace('#',''),10);
  go(isNaN(h)?0:h-1);
})();
