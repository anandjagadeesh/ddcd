var METERS=[
  {k:'V',n:'Visibility',c:'navy',d:'What you can see: logs, context and data quality'},
  {k:'S',n:'Speed',c:'orange',d:'How fast you find and stop the attack'},
  {k:'T',n:'Trust',c:'purple',d:'People\'s confidence, and the business running normally'},
  {k:'I',n:'Integrity',c:'green',d:'Good evidence, clean data and fixes that last'}
];
function clamp(x){return Math.max(0,Math.min(100,x));}
function O(id,label,detail,fx,result,lesson,next,best){return {id:id,label:label,detail:detail,fx:fx,result:result,lesson:lesson,next:next,best:!!best};}
function took(st,node,opt){return st.path.some(function(p){return p.node===node&&p.opt===opt;});}

var SCENARIOS={
/* ======================= A ======================= */
A:{id:'A',title:'The Quiet Beacon',tag:'AI-driven defence wins',color:'green',minutes:9,
 blurb:'A tool that studies user and network behaviour finds a quiet, regular signal from a research cluster late on Friday night. Do you trust it, check it, or automate the response?',
 goal:'AI defence with a person in the loop: add context, follow the trail, use levels of autonomy, close the feedback loop.',
 setting:'<b>AJ International University</b> has a research cloud with powerful computers (GPU clusters), student services, and a behaviour-analytics tool that has learned from 18 months of data. You are the security lead on call. It is Friday night.',
 start:[50,50,50,50],th:{win:63,partial:52},first:'n1',
 nodes:{
  n1:{role:'Security lead on call',when:'Friday 23:42',
   scene:'The tool flags a computer in a GPU cluster. Every 60 seconds it sends a small message to a website first seen three hours ago. This is a <b>beacon</b>: a regular signal to an attacker. The computer\'s service account also just logged in from a new network. <b>Anomaly score: 0.91</b> (very unusual). The tool explains why: the signal is too regular, the website is rare, and the login place is new.',
   think:'When is a model\'s score enough for automatic action? Who decides the limit?',
   options:[
    O('a','Add context first','Get information about the user, how important the computer is, and what is normal for similar computers, before you act (about 8 minutes).',[14,-4,6,4],
      'The account belongs to a PhD student\'s pipeline. It has never logged in from outside the region, and no similar computer shows this pattern. You are more confident, and you can still watch the live session.',
      'Context turns a score into a decision. Adding data makes AI output useful.','n2a',true),
    O('b','Cut it off now','Run the automatic playbook to disconnect the computer from the network right away.',[-2,14,-12,-4],
      'The computer is disconnected in 40 seconds. A three-day training job is lost and the professor is angry. The signal stops, but you can no longer watch the attacker.',
      'Automation gives speed, but automatic action without limits costs trust and evidence. Match autonomy to confidence and size of impact.','n2b',false)]},
  n2a:{role:'Security lead on call',when:'Friday 23:55',
   scene:'The extra data confirms that something is wrong. Then the professor writes: <i>"I\'m travelling. Maybe it is my VPN."</i> But the tool says the signal is too regular to come from a human.',
   think:'How should an analyst compare a believable human explanation with evidence from a model?',
   options:[
    O('a','Investigate further','Treat the explanation as an idea to test. Search all computers for the same website.',[12,4,2,4],
      'You find a second, quieter computer talking to the same website. If you had cleaned only one computer, you would have missed it.',
      'Models point to one spot. Analysts find the whole campaign. Following the trail is a human strength.','n3',true),
    O('b','Accept the explanation','Close the alert as a false alarm and add the website to a safe list.',[-14,2,2,-6],
      'The ticket closes in three minutes and the professor is happy. But the safe list now hides the signal from the tool too.',
      'People trust other people\'s stories over data. Safe-list entries made under pressure become blind spots.','n3',false)]},
  n2b:{role:'Security lead on call',when:'Saturday 00:10',
   scene:'The computer is disconnected. The research director demands that you restore it now. Then the tool raises a second alert: another computer is talking to the same new website.',
   think:'How do you keep a security decision when the business pushes back? What evidence do you use?',
   options:[
    O('a','Hold firm','Keep the computer isolated, isolate the whole cluster segment, and show management the evidence.',[8,6,4,4],
      'A five-minute call with clear evidence convinces the director. The isolation holds and the second computer is contained.',
      'Clear evidence keeps both control and trust.','n3',true),
    O('b','Restore and relax alerts','Reconnect the computer and raise the alert limit so research is not disturbed again.',[-12,-6,8,-8],
      'The business is happy for an hour. The higher limit hides the second computer\'s alert, and the signal comes back.',
      'Changing alert limits to please people trades security for comfort. Fix the process, not the sensitivity.','n3',false)]},
  n3:{role:'Security lead on call',when:'Saturday, early hours',
   scene:function(st){
     if(took(st,'n2a','a'))return 'The search is finished: <b>two computers and one stolen service credential</b>. You still have time to stop the attack.';
     if(took(st,'n2a','b'))return '04:10. An alert shows a large data transfer from cluster storage. <b>The signal has become data theft in stages</b>, and time is running out.';
     if(took(st,'n2b','a'))return '02:30. The isolation holds. The investigation confirms that the service account\'s token was <b>stolen and reused</b> through a home-network proxy service.';
     return '02:30. <b>The signal is back on two computers.</b> The higher alert limit hid it for hours, and the stolen token still works.';},
   think:'Do you contain computers or identities? Which one fails more often in real life?',
   options:[
    O('a','Reset everything','Cancel tokens and sessions for the account and similar accounts, change secrets, and require phishing-resistant MFA for the research group.',[6,8,-2,6],
      'A short interruption. The attacker loses access, and the logs show no hidden way back.',
      'Contain identities, not only computers. Modern attacks use valid logins.','n4',true),
    O('b','Reset one account','Reset only the one account you know about.',[-6,4,4,-6],
      'Almost no interruption. Two days later, a token from a similar account is reused.',
      'A narrow fix is fast and feels safe, but it leaves other usable logins open.','n4',false)]},
  n4:{role:'Security lead',when:'Monday morning',
   scene:function(st){
     var rough=took(st,'n1','b')||took(st,'n2a','b')||took(st,'n2b','b')||took(st,'n3','b');
     return 'Review after the incident. Analysts confirm the alert was a <b>true positive</b> (a real threat). '+(rough?'Some decisions cost time, trust or evidence along the way. ':'The response mostly went to plan. ')+'Leaders want to move on.';},
   think:'What is the smallest change that makes the next incident cheaper?',
   options:[
    O('a','Close the loop','Label the incident, send the verdict to the model team, write a new detection rule as code, and record detection and response times (MTTD and MTTR).',[8,4,4,6],
      'Next quarter the same technique is caught in 90 seconds. Low-risk cases need no analyst.',
      'Transformative security is a learning loop: every incident improves the data and the model.',null,true),
    O('b','Close the ticket','Go back to normal work.',[-2,0,2,-4],
      'The ticket is closed. Nothing changes. The model and the analysts must learn the same lesson again.',
      'Without labels, human knowledge is lost.',null,false)]}
 },
 endings:{
  win:{title:'AI-driven defence wins',text:'The model saw it first, an analyst understood it, and the organisation learned from it. The AI gave speed, people gave judgement, and the feedback loop made the next attack harder.',take:'Pattern: add context, follow the trail, contain identities, close the loop.'},
  partial:{title:'Contained, but not improving',text:'The attacker was removed, but the process had gaps: unnecessary disruption, a search that stopped too early, or lessons that were not saved. The same technique may cost more next time.',take:'Which decision traded long-term learning for short-term comfort?'},
  loss:{title:'AI saw it. Nobody acted.',text:'The model gave the signal, but decisions hid it. Safe lists, higher alert limits and narrow fixes left a path open for the attacker. Detection without judgement and follow-up is just a log with a score.',take:'The weak link was the chain of decisions, not the algorithm.'}},
 debrief:['At which checkpoint did you trade speed for evidence? Was it worth it?','Who in your institution owns the limit for automatic action?','What label would you save from this incident, and where would you keep it?']
},
/* ======================= B ======================= */
B:{id:'B',title:'The CFO Call',tag:'AI-powered attacker wins',color:'maroon',minutes:9,
 blurb:'A deepfake CFO, a fake lookalike website and an AI-scaled attack on many channels. Most paths lose. Can you find the narrow save?',
 goal:'Why AI-powered attackers win with personal messages and fake identities, and which process controls still work.',
 setting:'<b>AJ International AB</b> approves supplier payments by email, and uses video calls for senior approval. Its monitoring covers computers and email, but <b>not the payment approval process</b>. The attacker uses AI to write personal messages, copy voices and change tactics live. You play the people in the middle: first a finance officer, then the security lead, then the CISO.',
 start:[40,40,40,40],th:{win:54,partial:46},first:'n1',
 nodes:{
  n1:{role:'Finance officer',when:'Tuesday 10:15',
   scene:'A well-written email from the "CFO" mentions a real internal project. It asks for a <b>secret, urgent payment</b> to a supplier before a "legal deadline" and suggests a short video call. The email filter marks it low risk: no links, clean text, and a lookalike website domain that is already 90 days old.',
   think:'Why is this message hard for a filter, and for a person?',
   options:[
    O('a','Join the call','A quick video call will show that it is really the CFO.',[-8,2,4,-8],
      'On the call, the CFO\'s face and voice look real. The attacker answers your questions smoothly and changes the story live.',
      'Seeing and hearing is no longer proof of identity. Check through a different channel, agreed in advance.','n2a',false),
    O('b','Check another way','Stop the email thread, call the CFO using the number in the HR directory, and tell security.',[10,-4,2,4],
      'The CFO\'s phone goes to voicemail. The attacker chose a time when the CFO was on a flight, shown in public posts. The check is delayed, but security now has the email.',
      'Checking through another channel can fail because of timing, so combine it with process controls and reporting.','n2b',true)]},
  n2a:{role:'Finance officer',when:'Tuesday 10:40',
   scene:'You feel reassured by the call and prepare the payment. It goes to a <b>new payee</b>, outside the normal supplier schedule, with a request for secrecy. The system lets one person approve payments below a high limit, and the approval process creates no security logs.',
   think:'Which controls still work when a person is convinced?',
   options:[
    O('a','Two-person approval and callback','Send the payment to a second approver. Call back the payee and the CFO on their registered numbers.',[8,-2,0,10],
      'The second approver sees: new payee, off schedule, urgent, secret. The callback fails, and the payment is stopped. The attacker moves to other targets.',
      'Process controls beat what people see. A second approval does not depend on anyone believing a face.','n3',true),
    O('b','Pay quickly','The CFO is waiting. Release the payment now.',[-6,6,2,-16],
      'The money leaves in 11 minutes. When someone finally calls the CFO, the money is already split across many accounts.',
      'Urgency is the attacker\'s tool. Speed without checking is the danger.','n3',false)]},
  n2b:{role:'Finance officer',when:'Tuesday 10:30',
   scene:'Voicemail. While you wait, a chat message arrives from "IT Service Desk". It says you must log in again to keep payroll running, and gives a link. <b>The attacker is now using a second channel.</b>',
   think:'How do attacks on many channels beat awareness on only one channel?',
   options:[
    O('a','Report and freeze','Tell the security team, hold all waiting payments, and ask for extra identity checks on finance accounts.',[8,4,-2,8],
      'The security team links the email, the chat and the lookalike domain within minutes. Finance accounts get extra checks.',
      'Reporting turns a person\'s doubt into data. Linking events across channels is what AI-scaled attacks cannot hide from.','n3',true),
    O('b','Click to keep access','Payroll needs your account, so log in again with the link.',[-6,-4,2,-14],
      'The link opens a fake page that copies your login in real time. Your session token is stolen, and the attacker is now inside the finance mailbox.',
      'Passwords and push approvals can be stolen in real time. Phishing-resistant MFA would not have been fooled.','n3',false)]},
  n3:{role:'Security lead',when:'Tuesday afternoon',
   scene:function(st){
     var tail=' The security team has email and login logs, <b>no baseline for finance users</b>, and nothing from the approval process.';
     if(took(st,'n2a','a'))return 'One payment was stopped by the second approver.'+tail;
     if(took(st,'n2a','b'))return 'The money has left. Requests to recall it from the receiving banks are in progress.'+tail;
     if(took(st,'n2b','a'))return 'A report and a chat message reached the security team.'+tail;
     return 'The attacker is inside a finance mailbox. The team sees an unusual login.'+tail;},
   think:'What can you do with incomplete data against an attacker who makes every message personal?',
   options:[
    O('a','Search with what you have','Use AI-assisted log summaries to find the lookalike domain and similar emails sent to all staff.',[8,4,0,4],
      'The search finds 14 other recipients in other departments. One has already clicked. The campaign is wide and personal at scale.',
      'Personal messages at scale are the attacker\'s AI advantage. Linking messages across recipients is the defender\'s answer.','n4',true),
    O('b','Wait for new signatures','Wait for the email vendor to send new detection updates.',[-6,-8,0,-4],
      'Every message in this campaign is different. No signature matches, and the second wave arrives before any update.',
      'Signature thinking fails when each target gets new text.','n4',false)]},
  n4:{role:'CISO',when:'Day 2',
   scene:'Leaders ask what will change. The attacker will return with new messages and will test your detections. The honest gaps: <b>no data about payment processes</b>, no finance baselines, and checks that depend on trust.',
   think:'Where should limited budget go first: awareness, process or data?',
   options:[
    O('a','Fix data and process','Log payment process events, build baselines for finance users, use checks that deepfakes cannot beat (agreed passphrases, callback rules), and run phishing tests made with AI.',[10,2,4,4],
      'Within three months, unusual payments and new payees trigger automatic holds. Tests now use the same AI methods as attackers.',
      'To defend against AI-scaled fraud you need process data, independent checks and realistic tests.',null,true),
    O('b','Ban video calls and send a warning','Send an "AI scams are rising" email and ban video approvals.',[-2,0,-4,-4],
      'People are more careful for two weeks. Attackers move to voice and chat, and the payment process is still invisible.',
      'General awareness without changes to data and process does not scale.',null,false)]}
 },
 endings:{
  win:{title:'A narrow save',text:'Checking outside the attacker\'s channel, fast reporting and linking messages across recipients stopped what detection alone could not. This is an unusual result, and it needed action before there was proof.',take:'Process controls and reporting beat appearances.'},
  partial:{title:'Damaged, not destroyed',text:'Some money or access was lost, and part of it was recovered. The attacker\'s AI moved faster than your data in some places, but a few controls limited the damage.',take:'Where did you depend on someone believing what they saw or heard?'},
  loss:{title:'The AI-powered attacker wins',text:'The attack was personal at scale, convincing in voice and video, and changed live. It used trust in what looked and sounded real. Your monitoring could not see the payment process, and the money is gone.',take:'Defence needs independent checks, process data, and linking events across channels.'}},
 debrief:['Which control in this story did not depend on anyone believing what they saw or heard?','What data about business processes are you missing today?','How would you design a check that a deepfake cannot beat?']
},
/* ======================= C ======================= */
C:{id:'C',title:'The Data Advantage',tag:'Strong data + AI wins',color:'navy',minutes:9,
 blurb:'A mature security data platform and a gap in the data on Monday morning. Will you use the advantage you built?',
 goal:'How data quality, context and feedback grow with AI, and how weak decisions waste them.',
 setting:'<b>AJ International University</b> has spent three years building a security data platform: data in one common format, a graph linking identities, assets and weaknesses, data quality targets, detections written as code, and ML models with human-approved playbooks. This scenario tests whether you use that advantage.',
 start:[62,62,62,62],th:{win:76,partial:60},first:'n1',
 nodes:{
  n1:{role:'Security data lead',when:'Monday 09:05',
   scene:'The data quality monitor raises a <b>gap alert</b>: login logs from the student information system stopped two hours ago, right after the vendor\'s update. At the same time, the ML model shows a small rise in failed logins on single sign-on. It looks like a <b>password spray</b> (trying common passwords on many accounts).',
   think:'What does it mean to treat a data pipeline as a security control?',
   options:[
    O('a','Fix the data first','Treat the gap as top priority: repair the parser, restore the feed, fill in the missing data, then judge the model\'s result.',[16,-4,2,8],
      'The feed is back in 25 minutes. The filled-in data shows that the spray started two hours earlier than the model thought. The model becomes more confident as the data returns.',
      'You cannot detect what you cannot see. Data health is a security metric.','n2a',true),
    O('b','Trust the model and continue','The model works with the data it has. Keep watching it.',[-12,4,0,-8],
      'The score is too low because part of the login data is missing. You are blind for part of the spray.',
      'Models get worse silently when their data gets worse. Monitor data health the way you monitor computers.','n2b',false)]},
  n2a:{role:'Security analyst',when:'Monday 09:40',
   scene:'With complete data, the graph links the spray to <b>three accounts</b> that logged in successfully from a home-network proxy service. One belongs to a faculty member who can access the exam grading system.',
   think:'What does a proportionate response look like when you know exactly who is affected?',
   options:[
    O('a','Risk-based response','Ask for an extra identity check and end the sessions of the three accounts only.',[8,8,4,2],
      'The attacker loses access in minutes and nobody else notices. The faculty member gets a phone call, not a surprise lockout.',
      'Precision beats force when data with context tells you who is at risk.','n3',true),
    O('b','Reset all passwords','Force everyone on campus to reset their password today.',[2,4,-14,2],
      'The help desk is overloaded, users are annoyed, and many choose weak or reused passwords.',
      'Blunt controls without context use up trust and can lower security.','n3',false)]},
  n2b:{role:'Security analyst',when:'Monday 09:40',
   scene:'With partial data, the model\'s score is only medium. Then a faculty member calls the help desk: <i>"I got strange MFA requests at 8 a.m. and I did not log in."</i> <b>A person has just become a sensor.</b>',
   think:'How should reports from people enter your data model?',
   options:[
    O('a','Combine the report with logs','Treat the report as a signal: fix the data gap now, re-score with the report as a feature, and make the help desk a structured data source.',[12,2,6,2],
      'The restored logs and the report confirm an MFA fatigue attempt. Help desk reports now feed the model.',
      'People are sensors. Structured reporting turns stories into data.','n3',true),
    O('b','Wait for the model','Treat it as user error until the score goes up.',[-8,-6,-4,-2],
      'Two more requests are approved by a tired user. The attacker is in the mailbox before the model catches up.',
      'Waiting for machine certainty gives the attacker time.','n3',false)]},
  n3:{role:'Incident commander',when:'Monday 10:30',
   scene:function(st){
     var base='An automatic playbook (SOAR) suggests disabling the affected accounts and ending their sessions. Model confidence is <b>0.78</b>. The policy allows automatic action only above <b>0.90</b> for privileged users.';
     return base+(took(st,'n1','a')?' The evidence graph is ready to review.':' The evidence graph is incomplete because of the earlier data gap.');},
   think:'Who is responsible when automation acts, and how is the limit governed?',
   options:[
    O('a','A person approves','Review the evidence graph for two minutes, then approve. Keep the levels of autonomy.',[4,8,4,6],
      'Approved in two minutes, with a full record. The privileged account is protected and the decision can be explained.',
      'Levels of autonomy keep people in the unclear zone, where context and responsibility matter.','n4',true),
    O('b','Lower the limit for everyone','Set automatic action at 0.70 for all accounts, permanently, to remove delays.',[0,8,-8,-6],
      'Speed improves. A week later an automatic action locks a department head\'s account during a grant deadline, and trust in the platform falls.',
      'Automation creep: raise autonomy when there is evidence it is safe, not because of impatience.','n4',false)]},
  n4:{role:'CISO',when:'End of quarter',
   scene:'Leaders ask you to justify the security data programme: <i>"Nothing bad happened, so why do we pay for it?"</i>',
   think:'How do you make the value of prevention visible?',
   options:[
    O('a','Measure and share','Report detection and response times, coverage against ATT&CK, data quality targets, model drift and false positive rates. Ask for funding for the roadmap.',[6,2,8,6],
      'Leaders fund the next phase. The data team gets a mandate to add cloud and SaaS data.',
      'What you measure grows. Data maturity needs clear numbers you can defend.',null,true),
    O('b','Report only incident counts','Report the counts, and cut the data engineering budget.',[-10,-4,-2,-10],
      'The data team gets smaller. Within two quarters, parser failures go unseen and the "mature" platform slowly falls apart.',
      'The prevention paradox: success looks like nothing happening.',null,false)]}
 },
 endings:{
  win:{title:'Data maturity grows',text:'You fixed the data before judging the model, used context for a proportionate response, kept people in the unclear zone, and made the value visible. Each incident makes the platform stronger.',take:'AI makes a strong foundation stronger. It does not replace one.'},
  partial:{title:'Strong base, uneven use',text:'The platform gave you an advantage, but some decisions wasted it: blunt controls, automation creep or weak measurement. The base is still there, but the gains are smaller than they should be.',take:'Maturity is a skill you must use, not a trophy.'},
  loss:{title:'Rich in data, poor in insight',text:'The data was there, but decisions ignored it. Blind spots grew, trust fell, and the platform decayed. A mature system with weak decisions behaves like an immature one.',take:'Data maturity without good decisions is wasted.'}},
 debrief:['Which signal would you have missed without data quality monitoring?','Who approves changes to autonomy limits, and based on what evidence?','Which three metrics would you show to your leaders?']
},
/* ======================= D ======================= */
D:{id:'D',title:'Operation Mirage',tag:'Final story: all three forces',color:'purple',minutes:12,
 blurb:'AI phishing at scale, then an attack on your own detection models. All three lessons in one incident.',
 goal:'Combine people as sensors, safe feedback loops, baseline poisoning and layered resilience.',
 setting:'<b>AJ International University</b>\'s login portal serves 30,000 students and staff. An attacker using AI sends personal phishing at scale, then turns to attack the university\'s own detection models. You lead the response for one week.',
 start:[50,50,50,50],th:{win:63,partial:47},first:'n1',
 nodes:{
  n1:{role:'Incident lead',when:'Monday 08:30',
   scene:'About <b>3,000 personal phishing emails</b> arrive. The AI-based email filter blocked 80%. Of the 600 that got through, <b>41 people clicked</b> and <b>nine entered their password</b>. You have the click data. Your culture will decide whether the other people tell you what they saw.',
   think:'When a user clicks, is it the user\'s failure or the system\'s failure?',
   options:[
    O('a','Treat people as sensors','Add an extra identity check for the nine, turn on one-click reporting, thank people who report in public, and send reports to the model.',[10,6,4,2],
      'Within an hour, 212 people report the email. The model gets labelled examples and the nine accounts are protected.',
      'A culture of reporting is a data pipeline.','n2a',true),
    O('b','Name and retrain','Email the campus about careless clicking and force the 41 people to retrain.',[-2,0,-12,-2],
      'Reports stop. People now hide mistakes, and the model sees fewer new examples.',
      'Blame hides the signal you need most.','n2b',false)]},
  n2a:{role:'Detection lead',when:'Tuesday 11:00',
   scene:'Labelled examples arrive. At the same time, your data shows the attacker testing: small word changes to find what passes the filter. <b>Detection of new variants fell from 80% to 55%.</b>',
   think:'How do you retrain fast without opening a new hole?',
   options:[
    O('a','Retrain, test, combine','Retrain with the new labels, test on held-out and adversarial sets, and combine rules, ML and sender-behaviour models.',[10,4,2,6],
      'Detection recovers to 78% on the adversarial test set, and no single model decides alone.',
      'Different detectors and hidden test sets make evasion expensive.','n3',true),
    O('b','Push to production now','Release the retrained model now. Speed matters.',[4,4,0,-10],
      'Detection improves for a short time, but unchecked labels include samples the attacker planted. Misses appear in a new place.',
      'Fast feedback loops are also an attack surface. Check labels and models before release.','n3',false)]},
  n2b:{role:'Detection lead',when:'Tuesday 11:00',
   scene:'Reports have dropped sharply. The attacker is running a quieter, slower campaign and testing for blind spots. You have little new data about what works.',
   think:'How do you rebuild trust so that data flows again?',
   options:[
    O('a','Change the culture','Offer amnesty, thank reporters, and share "you reported, we blocked" results.',[10,2,10,0],
      'Reports recover in days. Staff and students also start reporting strange calls and chats.',
      'Trust is a data quality control.','n3',true),
    O('b','Watch users more','Publish click dashboards by department and increase monitoring.',[0,0,-12,-4],
      'Departments hide incidents to protect their ranking. Visibility falls further.',
      'Monitoring without trust damages the signal.','n3',false)]},
  n3:{role:'Detection lead',when:'Thursday',
   scene:function(st){
     var extra=took(st,'n2a','b')?' Your unchecked retraining has already absorbed part of the noise.':'';
     return 'The attacker has taken over a low-privilege account and creates harmless-looking activity to move your behaviour baseline for that group. This is <b>slow poisoning</b>. Your drift monitor shows the group\'s "normal" has moved by three standard deviations in 48 hours. An AI agent quietly tests access paths.'+extra;},
   think:'How would you know that your model\'s idea of "normal" was manipulated?',
   options:[
    O('a','Freeze and compare','Stop baseline updates for the group, restore a trusted reference snapshot, compare, and ask analysts to review the drift.',[8,4,2,8],
      'The comparison shows the manipulated period. The agent\'s access tests stand out against the trusted baseline, and the account is contained.',
      'Data origin checks, fixed reference baselines and drift monitors let you see poisoning.','n4',true),
    O('b','Let it keep learning','The model adapts by itself. It will work it out.',[-10,-4,0,-8],
      'The model treats the attacker\'s behaviour as normal. Alerts quietly fall, and the agent moves further.',
      'Self-learning without integrity checks teaches the model what the attacker wants.','n4',false)]},
  n4:{role:'CISO',when:'Day 7',
   scene:'The immediate threat is handled, or at least limited. The board asks whether the university is now safe.',
   think:'What does a resilient position look like, compared with a bought one?',
   options:[
    O('a','Build resilience into the system','Red-team the models, add human override and a kill switch, keep levels of autonomy, run purple-team exercises and publish resilience metrics.',[8,4,4,6],
      'The next attempt meets different detectors, fixed baselines and informed people. It is noisy and short.',
      'Resilience is layered design, not a product.',null,true),
    O('b','Buy another AI tool','Buy a new platform and declare victory.',[2,-2,0,-4],
      'A new dashboard arrives. The same gaps in data, process and culture remain, and the attacker returns in a month.',
      'Tools without data, process and people do not create resilience.',null,false)]}
 },
 endings:{
  win:{title:'Resilient by design',text:'You treated people as sensors, checked every feedback loop, caught the baseline manipulation, and built layers of resilience. The attacker\'s AI became a chance to learn for your defence.',take:'Data, people and models each had protection.'},
  partial:{title:'Held the line, learned the hard way',text:'The core held, but one or two decisions gave the attacker room: a lost reporting culture, an unchecked loop, or a bought solution instead of a built one. You will pay for these lessons.',take:'Which feedback loop did the attacker use against you?'},
  loss:{title:'The model was the target',text:'The attacker went after your detection itself: starving the data, poisoning the baseline and using unchecked loops. Your AI taught itself to ignore the attacker.',take:'Treat models as assets that can be attacked.'}},
 debrief:['Where did culture work as a data quality control in this incident?','How would you detect that your model\'s "normal" was manipulated?','Which layer of resilience is weakest in your institution: data, model, system, people or governance?']
}
};
var ORDER=['A','B','C','D'];
var CLOSING=['Which scenario\'s result surprised you? Why?','Where did speed help, and where did it cost evidence or trust?','Which one data capability would most improve your institution\'s resilience?','What will you change in your teaching after today?'];
var GLOSSARY=[['Telemetry','records that systems send about what they do'],['Log','a written record of events on a system'],['Baseline','what is normal for a user or device'],['Anomaly','something unusual'],['Beacon','a small signal sent again and again to an attacker'],['Dwell time','how long an attacker stays hidden'],['Phishing','a fake message that tricks you'],['Deepfake','fake video or voice made by AI'],['MFA','a second proof of identity, besides the password'],['SOC','the team that watches for attacks'],['SOAR','tools that run response steps automatically'],['Drift','a model slowly becomes less accurate as data changes'],['Poisoning','an attacker adds bad data to teach the model wrong things'],['Human in the loop','a person checks or approves the AI\'s work']];

function newState(sid){var sc=SCENARIOS[sid];return {sid:sid,node:sc.first,m:sc.start.slice(),path:[]};}
function getNode(st){return SCENARIOS[st.sid].nodes[st.node];}
function sceneOf(st){var n=getNode(st);return typeof n.scene==='function'?n.scene(st):n.scene;}
function choose(st,optId,choiceLabel){
  var n=getNode(st),o=n.options.filter(function(x){return x.id===optId;})[0];
  if(!o)throw new Error('Unknown option '+optId);
  var m=st.m.map(function(v,i){return clamp(v+o.fx[i]);});
  return {sid:st.sid,node:o.next,m:m,path:st.path.concat([{node:st.node,opt:optId,label:choiceLabel||optId}])};
}
function avg(m){return m.reduce(function(a,b){return a+b;},0)/m.length;}
function endingKey(st){var t=SCENARIOS[st.sid].th,a=avg(st.m);return a>=t.win?'win':(a>=t.partial?'partial':'loss');}
function optOf(sid,nodeId,optId){return SCENARIOS[sid].nodes[nodeId].options.filter(function(o){return o.id===optId;})[0];}

(function(){
  "use strict";
  var root=document.documentElement, $=function(s){return document.querySelector(s);};
  var app={mode:document.body.getAttribute('data-mode')==='ind'?'ind':'fac',view:'home',sid:null,st:null,states:{},phase:'decide',votes:{a:0,b:0},optionOrder:[],last:null,results:{},
           cpt:{sec:120,run:false,t:null},sess:{sec:3000,run:false,t:null}};

  /* ---- persistence helpers ---- */
  function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
  function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}

  /* ---- theme ---- */
  function applyTheme(t){
    root.setAttribute('data-theme',t);
    $('#themeSwitch').textContent=t==='dark'?'☼':'☾';
    $('#themeSwitch').setAttribute('aria-pressed',t==='dark'?'true':'false');
    $('#themeSwitch').setAttribute('aria-label',t==='dark'?'Switch to light theme':'Switch to dark theme');
  }
  var th=lsGet('dd-theme')||((window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');
  applyTheme(th);
  $('#themeSwitch').addEventListener('click',function(){var t=root.getAttribute('data-theme')==='dark'?'light':'dark';applyTheme(t);lsSet('dd-theme',t);});

  document.body.classList.toggle('fac',app.mode==='fac');

  /* ---- toast ---- */
  var toastT=null;
  function toast(msg){var t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show');},2600);}

  /* ---- timers ---- */
  function fmt(s){s=Math.max(0,Math.round(s));var m=Math.floor(s/60),x=s%60;return (m<10?'0':'')+m+':'+(x<10?'0':'')+x;}
  function updSess(){
      var clock=$('#sess'),pace=$('#sessPace'),button=$('#sessToggle');if(!clock||!pace||!button)return;
      clock.textContent=fmt(app.sess.sec);
      pace.classList.toggle('warn',app.sess.sec<=600&&app.sess.sec>120);
      pace.classList.toggle('crit',app.sess.sec<=120);
      button.textContent=app.sess.run?'Ⅱ':'▷';
      button.setAttribute('aria-pressed',app.sess.run?'true':'false');
      button.title=(app.sess.run?'Pause':'Start')+' timer (p)';
      button.setAttribute('aria-label',(app.sess.run?'Pause':'Start')+' timer');
      var toggle=$('#timerToggle');
      if(toggle){
        toggle.title=(toggle.getAttribute('aria-expanded')==='true'?'Hide':'Show')+' timer (v)';
        toggle.setAttribute('aria-label',toggle.title.replace(' (v)',''));
      }
  }
  function toggleSess(){
      var panel=$('#timerPanel'),toggle=$('#timerToggle');
      if(panel.hidden){
        panel.hidden=false;
        toggle.setAttribute('aria-expanded','true');
      }
      if(app.sess.run){clearInterval(app.sess.t);app.sess.run=false;}
      else if(app.sess.sec>0){app.sess.run=true;app.sess.t=setInterval(function(){app.sess.sec=Math.max(0,app.sess.sec-1);if(app.sess.sec===0){clearInterval(app.sess.t);app.sess.run=false;toast('Session time is up');}updSess();},1000);}
      updSess();
  }
  if($('#timerToggle')){
      $('#timerToggle').addEventListener('click',function(){
        var panel=$('#timerPanel'),hidden=panel.hidden;
        panel.hidden=!hidden;
        this.setAttribute('aria-expanded',hidden?'true':'false');
        this.title=(hidden?'Hide':'Show')+' timer (v)';
        this.setAttribute('aria-label',(hidden?'Hide':'Show')+' timer');
      });
      $('#sessToggle').addEventListener('click',toggleSess);
  }
  updSess();
  function updCpt(){
    var e=$('#cptVal'),w=$('#cptBox'),b=$('#cptBtn'); if(!e)return;
    e.textContent=fmt(app.cpt.sec); w.classList.toggle('low',app.cpt.sec<=20);
    b.textContent=app.cpt.run?'Pause':'Start discussion timer';
    b.setAttribute('aria-pressed',app.cpt.run?'true':'false');
    b.title=(app.cpt.run?'Pause':'Start')+' discussion timer (c)';
  }
  function stopCpt(){clearInterval(app.cpt.t);app.cpt.run=false;}
  function toggleCpt(){
    if(app.cpt.run){stopCpt();}
    else{app.cpt.run=true;app.cpt.t=setInterval(function(){app.cpt.sec=Math.max(0,app.cpt.sec-1);updCpt();if(app.cpt.sec===0){stopCpt();updCpt();toast('Discussion time is up: vote!');}},1000);}
    updCpt();
  }

  /* ---- navigation ---- */
  function tabs(){
    var h='<option value="">Overview</option>';
    ORDER.forEach(function(id){
      var r=app.results[id];
      h+='<option value="'+id+'">'+id+' · '+SCENARIOS[id].title+(r?' · Complete':'')+'</option>';
    });
    var picker=$('#scenarioPicker');
    picker.innerHTML=h;
    picker.value=app.view==='play'?app.sid:'';
    picker.hidden=app.view!=='play';
  }
  $('#scenarioPicker').addEventListener('change',function(){
    if(this.value)start(this.value,false);
    else home();
  });
  function start(sid,fresh){
    if(!fresh&&app.view==='play'&&app.sid===sid)return;
    stopCpt();app.cpt.sec=120;app.votes={a:0,b:0};
    var saved=app.states[sid];
    if(!fresh&&saved&&saved.node!==null){app.sid=sid;app.st=saved;app.view='play';app.phase='decide';app.last=null;shuffleOptions();render(true);return;}
    app.sid=sid;app.st=newState(sid);app.states[sid]=app.st;app.view='play';app.phase='decide';app.last=null;shuffleOptions();render(true);
  }
  function home(){stopCpt();app.view='home';render(true);}

  /* ---- views ---- */
  function shuffleOptions(){
    app.optionOrder=getNode(app.st).options.slice();
    for(var i=app.optionOrder.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1)),option=app.optionOrder[i];
      app.optionOrder[i]=app.optionOrder[j];
      app.optionOrder[j]=option;
    }
  }

  function meterHTML(m,prev,animate){
    return '<div class="meters" aria-label="Meters">'+METERS.map(function(mt,i){
      var d=prev?(m[i]-prev[i]):0, dv=d?'<span class="dv '+(d>0?'up':'down')+'">'+(d>0?'▲ +':'▼ ')+d+'</span>':'<span class="dv muted">'+Math.round(m[i])+'</span>';
      var w=animate&&prev?prev[i]:m[i];
      return '<div class="meter m-'+mt.c+'" title="'+mt.d+'"><div class="mh"><span>'+mt.n+'</span><span><span class="muted" style="font-family:var(--mono)">'+Math.round(m[i])+'</span> '+(d?dv:'')+'</span></div><div class="bar"><i data-to="'+m[i]+'" style="width:'+w+'%"></i></div></div>';
    }).join('')+'</div>';
  }
  function animateBars(){
    var bars=[].slice.call(document.querySelectorAll('.bar i[data-to]'));
    requestAnimationFrame(function(){requestAnimationFrame(function(){bars.forEach(function(b){b.style.width=b.getAttribute('data-to')+'%';});});});
  }
  function endChip(r){return r?'<span class="end-badge end-'+r.key+'">'+r.title+'</span>':'';}

  function homeHTML(){
    var cards=ORDER.map(function(id){
      var sc=SCENARIOS[id],r=app.results[id];
      return '<div class="card top-c sc-card c-'+sc.color+'"><div class="row1"><div class="badge">'+id+'</div><div><div class="kicker">'+(id==='D'?'Final story':'Scenario '+id)+'</div><h2 style="margin:0">'+sc.title+'</h2></div></div>'+
        '<div><span class="chip">'+sc.tag+'</span> <span class="chip ghost">~'+sc.minutes+' min · 4 checkpoints</span></div>'+
        '<p style="margin:6px 0 0">'+sc.blurb+'</p><p class="muted small" style="margin:0"><b>Focus:</b> '+sc.goal+'</p>'+
        '<div class="actions"><button class="btn accent" data-act="open" data-sid="'+id+'" data-shortcut="'+(ORDER.indexOf(id)+1)+'" aria-keyshortcuts="'+(ORDER.indexOf(id)+1)+'" title="'+(r?'Replay':'Start')+' scenario '+id+' ('+(ORDER.indexOf(id)+1)+')">'+(r?'Replay':'Start')+' scenario '+id+'</button>'+endChip(r)+'</div></div>';
    }).join('');
    var done=ORDER.filter(function(id){return app.results[id];});
    var score='';
    if(done.length){
      score='<div class="card" style="margin-top:18px"><h2>Scoreboard</h2><table class="tb"><tr><th>Scenario</th><th>Latest outcome</th><th>Meter average</th><th>Recommended choices</th></tr>'+
        done.map(function(id){var r=app.results[id];return '<tr><td>'+id+' · '+SCENARIOS[id].title+'</td><td>'+endChip(r)+'</td><td>'+Math.round(r.avg)+'</td><td>'+r.best+' of '+r.total+'</td></tr>';}).join('')+'</table></div>';
    }
    var closing=(done.length===ORDER.length)?'<div class="card" style="margin-top:18px"><h2>All scenarios complete: closing discussion</h2><ul>'+CLOSING.map(function(q){return '<li>'+q+'</li>';}).join('')+'</ul></div>':'';
    var modeIntro=app.mode==='fac'
      ?'Show this page to the group. Discuss each decision, count votes, then lock in the majority.'
      :'Play on your own. Choose each decision directly and review the outcome and path.';
    var sessionPlan=app.mode==='fac'
      ?'<div class="card" style="margin-top:18px"><h2>Plan for 50 minutes</h2><div class="runshow">'+
        '<div style="flex:3;background:var(--navy)">Brief<small>3 min</small></div><div style="flex:9;background:var(--green)">A<small>9 min</small></div><div style="flex:9;background:var(--maroon)">B<small>9 min</small></div><div style="flex:9;background:var(--orange);color:#1a1205">C<small>9 min</small></div><div style="flex:12;background:var(--purple)">Final story<small>12 min</small></div><div style="flex:8;background:var(--navy)">Debrief<small>8 min</small></div></div>'+
        '<p class="muted small" style="margin:6px 0 0">Use the 50-minute session timer at the top. Each checkpoint also has a discussion timer.</p></div>'
      :'';
    var shortcutHelp=app.mode==='fac'
      ?'Shortcuts: 1–4 open a scenario · r restart · t theme · o Defendasaurus · v timer · p start/pause session timer.'
      :'Shortcuts: 1–4 open a scenario · r restart · t theme · o Defendasaurus · p download practice slides.';
    return '<section class="hero"><div class="kicker">Data Driven Threat Detection and Resilience</div>'+
      '<h1>Simulations for Data-Driven Cyber Defence</h1>'+
      '<p class="lead">Four branching stories about cyber defence. Your choices change the next scene, the four meters and the ending. '+modeIntro+'</p></section>'+
      '<h2 style="margin:20px 0 10px">Scenarios</h2><div class="grid g2">'+cards+'</div>'+
      '<p class="muted small">'+shortcutHelp+'</p>'+
      sessionPlan+
      '<div class="card" style="margin-top:18px"><h2>The four meters</h2><div class="grid g4">'+METERS.map(function(mt){return '<div><b>'+mt.n+'</b><br><span class="muted small">'+mt.d+'</span></div>';}).join('')+'</div></div>'+'<div class="card" style="margin-top:18px"><h2>Key words</h2><div class="grid g2" style="gap:4px 28px">'+GLOSSARY.map(function(g){return '<div class="small"><b>'+g[0]+':</b> '+g[1]+'</div>';}).join('')+'</div></div>'+score+closing;
  }

  function playHTML(){
    var sc=SCENARIOS[app.sid],st=app.st,top='';
    top+='<div class="simulation-page c-'+sc.color+'"><div class="crumb"><span class="chip">'+(sc.id==='D'?'Final story':'Scenario '+sc.id)+'</span><span class="chip o">'+sc.tag+'</span></div>'+
        '<h1 style="margin:4px 0">'+sc.title+'</h1>';
    if(app.phase==='ending')return top+endingHTML(sc)+'</div>';
    var steps='<div class="steps" aria-label="Progress">';
    for(var i=0;i<4;i++){var cls=i<st.path.length?'done':(i===st.path.length&&app.phase==='decide'?'now':(i<=st.path.length-1?'done':''));steps+='<i class="'+cls+'"></i>';}
    steps+='</div>';
    if(app.phase==='decide'){
      var n=getNode(st),meta='<div class="meta"><span class="chip">Checkpoint '+(st.path.length+1)+' of 4</span><span class="chip ghost">'+n.when+'</span><span class="chip ghost">Role: '+n.role+'</span></div>';
      var setting=(st.path.length===0)?'<div class="setting">'+sc.setting+'</div>':'';
      var scene='<div class="card scene top-c">'+meta+'<p class="txt">'+sceneOf(st)+'</p></div>';
      var think='<div class="think"><b>'+(app.mode==='fac'?'Discuss':'Consider')+':</b> '+n.think+'</div>';
      var opts='<div class="opts" role="group" aria-label="Decision">'+app.optionOrder.map(function(o,index){
        var L=index===0?'A':'B';
        var key=L.toLowerCase();
        var vote=app.mode==='fac'?'<div class="vote"><button data-act="vm" data-o="'+key+'" data-shortcut="Shift+'+L+'" aria-keyshortcuts="Shift+'+key+'" title="Remove a vote for '+L+' (Shift+'+key+')" aria-label="Remove a vote for '+L+'">−</button><span class="vc" id="vc-'+key+'" aria-live="polite">'+app.votes[key]+'</span><button class="plus" data-act="vp" data-o="'+key+'" data-shortcut="'+key+'" aria-keyshortcuts="'+key+'" title="Add a vote for '+L+' ('+key+')" aria-label="Add a vote for '+L+'">+ vote</button></div>':'';
        var lockKey=index===0?'q':'w';
        return '<div class="ocard" id="oc-'+key+'"><div class="oh"><div class="olet">'+L+'</div><h3>'+o.label+'</h3></div><p>'+o.detail+'</p>'+vote+
          '<button class="btn accent big" data-act="choose" data-o="'+o.id+'" data-shortcut="'+(app.mode==='fac'?lockKey:key)+'" aria-keyshortcuts="'+(app.mode==='fac'?lockKey:key)+'" title="'+(app.mode==='fac'?'Lock in '+L+' ('+lockKey+')':'Choose '+L+' ('+key+')')+'" style="margin-top:auto">'+(app.mode==='fac'?'Lock in '+L:'Choose '+L)+'</button></div>';
      }).join('')+'</div>';
      var lock='';
      if(app.mode==='fac'){
        lock='<div class="lockbar"><div class="tmr" id="cptBox"><b id="cptVal">'+fmt(app.cpt.sec)+'</b><button class="btn toggle-status" id="cptBtn" data-act="cpt" data-shortcut="c" aria-keyshortcuts="c" aria-pressed="false" title="Start or pause discussion timer (c)">Start discussion timer</button><button class="btn" data-act="cptreset" data-shortcut="x" aria-keyshortcuts="x" title="Reset discussion timer (x)" aria-label="Reset timer">↺</button></div>'+
          '<div><button class="btn primary big" data-act="lock" data-shortcut="enter" aria-keyshortcuts="Enter" title="Lock in the majority (Enter)" id="lockBtn">Lock in the majority</button> <span class="muted small" id="tally"></span></div></div>'+
          '<p class="muted small key-help">Keys: <span class="kbd">a</span>/<span class="kbd">b</span> vote · <span class="kbd">Shift+a</span>/<span class="kbd">Shift+b</span> remove · <span class="kbd">q</span>/<span class="kbd">w</span> lock · <span class="kbd">Enter</span> majority · <span class="kbd">c</span> timer · <span class="kbd">x</span> reset · <span class="kbd">z</span> clear · <span class="kbd">v</span>/<span class="kbd">p</span> session timer · <span class="kbd">r</span> restart · <span class="kbd">t</span> theme</p>';
      }else{
        lock='<p class="muted small key-help">Keys: <span class="kbd">a</span>/<span class="kbd">b</span> choose · <span class="kbd">Enter</span> continue · <span class="kbd">r</span> restart · <span class="kbd">t</span> theme</p>';
      }
      return top+steps+meterHTML(st.m,null,false)+setting+scene+think+opts+lock+'</div>';
    }
    /* result phase */
    var L=app.last,o=L.opt,other=L.node.options.filter(function(x){return x.id!==o.id;})[0];
    var delta='<div class="delta">'+METERS.map(function(mt,i){var d=st.m[i]-L.prev.m[i];return d?'<span class="'+(d>0?'pos':'neg')+'">'+mt.n+' '+(d>0?'+':'')+d+'</span>':'';}).join('')+'</div>';
    var next=(st.node===null)?'See the outcome →':'Next checkpoint →';
    var altD='<div class="delta">'+METERS.map(function(mt,i){var d=other.fx[i];return d?'<span class="'+(d>0?'pos':'neg')+'">'+mt.n+' '+(d>0?'+':'')+d+'</span>':'';}).join('')+'</div>';
    return top+steps+meterHTML(st.m,L.prev.m,true)+
      '<div class="card result" aria-live="polite"><div class="rh"><div class="olet">'+L.choiceLabel+'</div><h2 style="margin:0">You chose '+L.choiceLabel+': '+o.label+'</h2>'+(o.best?'<span class="chip" style="--accent-t:var(--g-t)">Recommended choice</span>':'<span class="chip o">Trade-off</span>')+'</div>'+
      '<p style="font-size:1.05em"><b>What happened.</b> '+o.result+'</p>'+delta+
      '<div class="lesson'+(o.best?'':' warn')+'"><b>Lesson.</b> '+o.lesson+'</div>'+
      '<details><summary>What choice '+(L.choiceLabel==='A'?'B':'A')+' would have done: '+other.label+'</summary><p style="margin-top:8px">'+other.result+'</p>'+altD+'<p class="muted small"><i>'+other.lesson+'</i></p></details>'+
      '<div style="margin-top:14px"><button class="btn accent big" data-act="next" data-shortcut="enter" aria-keyshortcuts="Enter" title="'+next+' (Enter)">'+next+'</button> <span class="muted small">Press <span class="kbd">Enter</span></span></div></div></div>';
  }

  function endingHTML(sc){
    var st=app.st,key=endingKey(st),e=sc.endings[key],a=avg(st.m);
    var rows=st.path.map(function(p,i){
      var n=sc.nodes[p.node],o=optOf(sc.id,p.node,p.opt);
      return '<tr><td>'+(i+1)+'</td><td>'+n.when+'</td><td><b>'+(p.label||p.opt).toUpperCase()+'</b> · '+o.label+'</td><td class="'+(o.best?'best':'trade')+'">'+(o.best?'Recommended':'Trade-off')+'</td><td>'+o.lesson+'</td></tr>';
    }).join('');
    var idx=ORDER.indexOf(sc.id),nextId=ORDER[idx+1];
    return '<div class="card ending"><div class="kicker">Outcome</div><h1>'+e.title+'</h1><p style="font-size:1.08em">'+e.text+'</p>'+
      '<div class="lesson'+(key==='loss'?' warn':'')+'"><b>Takeaway.</b> '+e.take+'</div>'+
      meterHTML(st.m,null,false)+'<p class="muted small">Average of the four meters: <b>'+Math.round(a)+'</b>. A win needs at least '+sc.th.win+'. A partial result needs at least '+sc.th.partial+'.</p>'+
      '<h2 style="margin-top:14px">Path review</h2><table class="tb path"><tr><th>#</th><th>When</th><th>Your decision</th><th>Type</th><th>Lesson</th></tr>'+rows+'</table>'+
      '<h2 style="margin-top:16px">Debrief questions</h2><ul>'+sc.debrief.map(function(q){return '<li>'+q+'</li>';}).join('')+'</ul>'+
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><button class="btn" data-act="replay" data-shortcut="y" aria-keyshortcuts="y" title="Replay this scenario (y)">↺ Replay this scenario</button>'+
      (nextId?'<button class="btn accent big" data-act="open" data-sid="'+nextId+'" data-fresh="1" data-shortcut="n" aria-keyshortcuts="n" title="Next scenario (n)">Next: '+nextId+' · '+SCENARIOS[nextId].title+' →</button>':'')+
      '<button class="btn" data-act="home" data-shortcut="h" aria-keyshortcuts="h" title="Overview and scoreboard (h)">Overview and scoreboard</button></div></div>';
  }

  function printSlide(kicker,title,content,extra){
    return '<section class="print-slide '+(extra||'')+'"><header><div class="kicker">'+kicker+'</div><h1>'+title+'</h1></header><div class="print-content">'+content+'</div><footer>Data-Driven Cyber Defence <span>Individual practice</span><span class="print-page-number"></span></footer></section>';
  }
  function printPracticeGuide(){
    var pages=[];
    var overview=ORDER.map(function(id){
      var sc=SCENARIOS[id];
      return '<div class="print-scenario-summary"><b>'+id+' · '+sc.title+'</b><p>'+sc.blurb+'</p></div>';
    }).join('');
    var meterList=METERS.map(function(m){return '<li><b>'+m.n+':</b> '+m.d+'</li>';}).join('');
    pages.push(printSlide('Practice deck','Cyber Defence Simulation',
      '<p class="print-lead">Four branching stories about cyber defence. Read each checkpoint, compare both options, and choose the response you would take.</p>'+
      '<h2>Scenarios</h2>'+overview,
      'print-intro'));
    pages.push(printSlide('Quick reference','The four meters',
      '<p class="print-lead">Use these meters to track the trade-offs caused by each decision.</p><ul>'+meterList+'</ul>',
      'print-reference'));
    pages.push(printSlide('Quick reference','Key words',
      '<ul class="print-glossary">'+GLOSSARY.map(function(g){return '<li><b>'+g[0]+':</b> '+g[1]+'</li>';}).join('')+'</ul>',
      'print-reference'));

    ORDER.forEach(function(id){
      var sc=SCENARIOS[id],contexts=[],seen={};
      function collect(st){
        if(st.node===null)return;
        var nodeId=st.node,node=getNode(st),scene=sceneOf(st),key=nodeId+'|'+scene;
        if(!seen[key]){
          seen[key]=true;
          contexts.push({nodeId:nodeId,node:node,scene:scene,st:st});
        }
        node.options.forEach(function(option){collect(choose(st,option.id));});
      }
      collect(newState(id));

      pages.push(printSlide('Scenario '+id,sc.title,
        '<p class="print-lead">'+sc.blurb+'</p>'+
        '<div class="print-prompt"><b>Focus:</b> '+sc.goal+'</div>'+
        '<div class="print-prompt"><b>Situation:</b> '+sc.setting+'</div>'+
        '<div class="print-directions">At each checkpoint, choose A or B and note why. Branches may lead to different versions of later scenes.</div>',
        'print-scenario-title c-'+sc.color));

      contexts.forEach(function(context){
        var node=context.node;
        var options=node.options.map(function(option){
          return '<article class="print-option"><h2><span>'+option.id.toUpperCase()+'</span> '+option.label+'</h2><p>'+option.detail+'</p></article>';
        }).join('');
        pages.push(printSlide('Scenario '+id+' · Checkpoint '+(context.st.path.length+1)+' of 4',
          node.when+' · '+node.role,
          '<div class="print-scene">'+context.scene+'</div>'+
          '<div class="print-question"><b>Consider:</b> '+node.think+'</div>'+
          '<div class="print-options">'+options+'</div>'+
          '<div class="print-choice"><b>My choice:</b> □ A &nbsp;&nbsp; □ B<br><b>Reason:</b> _________________________________________________</div>',
          'print-decision c-'+sc.color));
      });

      Object.keys(sc.endings).forEach(function(key){
        var ending=sc.endings[key];
        pages.push(printSlide('Scenario '+id+' · Outcome',ending.title,
          '<p class="print-lead">'+ending.text+'</p><div class="print-directions"><b>Takeaway:</b> '+ending.take+'</div>',
          'print-outcome c-'+sc.color));
      });
      pages.push(printSlide('Scenario '+id+' · Debrief','Discuss and reflect',
        '<p class="print-lead">Use these questions to review the decisions and trade-offs in this scenario.</p><ul class="print-debrief">'+sc.debrief.map(function(q){return '<li>'+q+'</li>';}).join('')+'</ul>',
        'print-review c-'+sc.color));
    });
    $('#printGuide').innerHTML=pages.join('');
    Array.prototype.forEach.call($('#printGuide').querySelectorAll('.print-page-number'),function(number,index){
      number.textContent=(index+1)+' / '+pages.length;
    });
    window.print();
  }
  if($('#downloadGuide'))$('#downloadGuide').addEventListener('click',printPracticeGuide);

  function render(scroll){
    tabs();
    $('#app').innerHTML=(app.view==='home')?homeHTML():playHTML();
    if(app.view==='play'){animateBars(); if(app.phase==='decide'&&app.mode==='fac'){updateVotes();updCpt();}}
    if(scroll){$('#app').scrollTop=0;window.scrollTo(0,0);}
  }

  /* ---- voting ---- */
  function updateVotes(){
    var a=app.votes.a,b=app.votes.b;
    ['a','b'].forEach(function(k){var e=$('#vc-'+k);if(e)e.textContent=app.votes[k];var c=$('#oc-'+k);if(c)c.classList.toggle('lead',(k==='a'&&a>b)||(k==='b'&&b>a));});
    var t=$('#tally');if(t)t.textContent='A '+a+' : '+b+' B';
  }
  function vote(o,d){app.votes[o]=Math.max(0,app.votes[o]+d);updateVotes();}
  function lock(){
    var a=app.votes.a,b=app.votes.b;
    if(a===b){toast(a===0?'No votes yet: count hands first, or lock in an option':'Tie ('+a+' : '+b+'): discuss, then lock in A or B');return;}
    commit(optionForLabel(a>b?'a':'b').id);
  }
  function optionForLabel(label){
    var option=app.optionOrder[label==='a'?0:1];
    if(!option)throw new Error('No simulation option for label '+label.toUpperCase());
    return option;
  }

  /* ---- commit a decision ---- */
  function commit(optId){
    stopCpt();
    var prev=app.st,node=getNode(prev),opt=node.options.filter(function(x){return x.id===optId;})[0];
    var optionIndex=app.optionOrder.findIndex(function(option){return option.id===optId;});
    if(!opt||optionIndex<0)throw new Error('Unknown displayed option '+optId);
    var choiceLabel=optionIndex===0?'A':'B';
    app.st=choose(prev,optId,choiceLabel);
    app.states[app.sid]=app.st;
    app.last={prev:prev,node:node,opt:opt,choiceLabel:choiceLabel};
    app.phase='result';
    render(true);
  }
  function advance(){
    if(app.st.node===null){
      var sc=SCENARIOS[app.sid],key=endingKey(app.st),bestN=app.st.path.filter(function(p){return optOf(app.sid,p.node,p.opt).best;}).length;
      app.results[app.sid]={key:key,title:sc.endings[key].title,avg:avg(app.st.m),best:bestN,total:app.st.path.length};
      app.phase='ending';
    }else{app.phase='decide';app.votes={a:0,b:0};app.cpt.sec=120;shuffleOptions();}
    render(true);
  }

  /* ---- events ---- */
  document.addEventListener('click',function(ev){
    var t=ev.target.closest('[data-act]'); if(!t)return;
    var act=t.getAttribute('data-act');
    switch(act){
      case 'home':home();break;
      case 'open':start(t.getAttribute('data-sid'),t.getAttribute('data-fresh')==='1');break;
      case 'replay':start(app.sid,true);break;
      case 'choose':commit(t.getAttribute('data-o'));break;
      case 'vp':vote(t.getAttribute('data-o'),1);break;
      case 'vm':vote(t.getAttribute('data-o'),-1);break;
      case 'lock':lock();break;
      case 'next':advance();break;
      case 'cpt':toggleCpt();break;
      case 'cptreset':stopCpt();app.cpt.sec=120;updCpt();break;
    }
  });
  document.addEventListener('keydown',function(e){
    if(e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;
    var tg=e.target&&e.target.tagName; if(tg==='INPUT'||tg==='TEXTAREA'||tg==='SELECT')return;
    var k=e.key.toLowerCase();
    var shortcut=e.shiftKey?'Shift+'+e.key.toUpperCase():k;
    var shortcutTarget=document.querySelector('[data-shortcut="'+shortcut+'"]');
    var interactive=e.target.closest('button,a,summary,input,select,textarea,[contenteditable="true"]');
    if(shortcutTarget&&!(k==='enter'&&interactive)){
      e.preventDefault();
      shortcutTarget.click();
      return;
    }
    if(app.view!=='play')return;
    if(app.phase==='decide'){
      if(k==='z'&&app.mode==='fac'){e.preventDefault();app.votes={a:0,b:0};updateVotes();}
      else if((k==='a'||k==='b')&&app.mode==='fac'){e.preventDefault();vote(k,1);}
      else if((k==='a'||k==='b')&&app.mode==='ind'){e.preventDefault();commit(optionForLabel(k).id);}
    }
  });

  /* ---- init ---- */
  render(false);
})();
