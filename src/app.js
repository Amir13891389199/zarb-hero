/* ============ ابزارها ============ */
const FA='۰۱۲۳۴۵۶۷۸۹';
const fa=x=>String(x).replace(/\d/g,d=>FA[d]).replace(/\./g,'٫').replace(/-/g,'−').replace(/\?/g,'؟');
const M=s=>`<span class="m">${fa(s)}</span>`;
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const app=$('#app');
const SPRING='cubic-bezier(.2,.9,.25,1.15)';

/* ============ ذخیره پیشرفت ============ */
const KEY='zarb-hero-v1';
let store=null;try{store=window.localStorage;store.getItem('t')}catch(e){store=null}
let S={xp:0,stars:{},lt:{},tm:{},best:0,mute:false,theme:'auto',lastDay:'',log:[]};
try{const d=store&&JSON.parse(store.getItem(KEY));if(d)S=Object.assign(S,d)}catch(e){}
S.tm=S.tm||{};S.log=S.log||[];
function save(){try{store&&store.setItem(KEY,JSON.stringify(S))}catch(e){}}

/* ============ صدا و لرزش ============ */
let actx=null;
function tone(fs,dur=.12,type='sine'){if(S.mute)return;try{actx=actx||new(window.AudioContext||window.webkitAudioContext)();const t=actx.currentTime;fs.forEach((f,i)=>{const o=actx.createOscillator(),g=actx.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.16,t+i*dur);g.gain.exponentialRampToValueAtTime(.001,t+(i+1)*dur);o.connect(g);g.connect(actx.destination);o.start(t+i*dur);o.stop(t+(i+1)*dur+.03)})}catch(e){}}
const buzz=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const sGood=()=>{tone([660,880],.09);buzz(12)};
const sBad=()=>{tone([260,200],.15,'triangle');buzz([30,40,30])};
const sWin=()=>tone([523,659,784,1046],.12);
const sTap=()=>tone([420],.03,'sine');

function confetti(){if(RM)return;const c=['#6d4aff','#12b76a','#ffb020','#f04467','#00b3ff','#ff6ec7'];for(let i=0;i<80;i++){const d=document.createElement('div');d.className='confetti';d.style.left=Math.random()*100+'vw';d.style.background=pick(c);d.style.animationDuration=(1.8+Math.random()*1.8)+'s';d.style.animationDelay=(Math.random()*.5)+'s';document.body.appendChild(d);setTimeout(()=>d.remove(),4300)}}
const praise=['آفرین! 🎉','عالی بود! 🌟','دمت گرم! 💪','ایول! 🔥','باریکلا! 👏','درسته! ✨','نابغه‌ای! 🧠','همینه! 🚀'];

/* ============ تصویرسازی ============ */
function groupsViz(a,b){let h='<div class="groups">';for(let i=0;i<a;i++){h+=`<div class="grp" style="animation-delay:${i*70}ms">`+'<i class="dot"></i>'.repeat(b)+'</div>'}return h+'</div>'}
function arrayViz(r,c,blue){return `<div class="arr" style="grid-template-columns:repeat(${c},16px)">`+`<i class="dot${blue?' b':''}"></i>`.repeat(r*c)+'</div>'}
function fingersViz(k){let h='<div class="fingers">';for(let i=1;i<=10;i++){h+=`<i class="${i===k?'fold':''}${i===6?' gap':''}"><span>${fa(i)}</span></i>`}return h+'</div>'}
function areaTable(cols,rows){let h='<table class="area"><tr><th>×</th>'+cols.map(c=>`<th>${fa(c)}</th>`).join('')+'</tr>';rows.forEach(r=>{h+=`<tr><th>${fa(r)}</th>`+cols.map(c=>`<td>${fa(r*c)}</td>`).join('')+'</tr>'});return h+'</table>'}

/* ============ راهبرد (ترفند) برای هر ضرب ============ */
const PRI=[0,1,10,2,5,4,9,3,6,8,7];
function stratM(a,b){const ia=PRI.indexOf(a),ib=PRI.indexOf(b);if(ia<0&&ib<0)return null;return(ib>=0&&(ia<0||ib<=ia))?b:a}
function strat(a,b){
  const ia=PRI.indexOf(a),ib=PRI.indexOf(b);
  if(ia<0&&ib<0)return M(`${a} × ${b} = ${a*b}`);
  let m,n,sw=false;
  if(ib>=0&&(ia<0||ib<=ia)){m=b;n=a}else{m=a;n=b;sw=true}
  let s='';
  switch(m){
    case 0:s=`هر عددی ضرب در صفر میشه صفر ← ${M(`${n} × 0 = 0`)}`;break;
    case 1:s=`هر عددی ضرب در یک میشه خودش ← ${M(`${n} × 1 = ${n}`)}`;break;
    case 10:s=`ضرب در ${M('10')} یعنی یه صفر بذار سمت راستش ← ${M(`${n} × 10 = ${n*10}`)}`;break;
    case 2:s=`ضرب در ${M('2')} یعنی دو برابر ← ${M(`${n} + ${n} = ${2*n}`)}`;break;
    case 5:s=`ضرب در ${M('5')} = نصفِ ضرب در ${M('10')} ← ${M(`${n} × 10 = ${10*n}`)} و نصفش میشه ${M(5*n)}`;break;
    case 4:s=`ضرب در ${M('4')} = دوبار دو برابر ← ${M(`${n} → ${2*n} → ${4*n}`)}`;break;
    case 9:s=`ضرب در ${M('9')} = ضرب در ${M('10')} منهای یکی ← ${M(`${10*n} − ${n} = ${9*n}`)}`;break;
    case 3:s=`ضرب در ${M('3')} = دو برابر به‌علاوه یکی ← ${M(`${2*n} + ${n} = ${3*n}`)}`;break;
    case 6:s=`ضرب در ${M('6')} = ضرب در ${M('5')} به‌علاوه یکی ← ${M(`${5*n} + ${n} = ${6*n}`)}`;break;
    case 8:s=`ضرب در ${M('8')} = سه‌بار دو برابر ← ${M(`${n} → ${2*n} → ${4*n} → ${8*n}`)}`;break;
    case 7:s=`ضرب در ${M('7')} = ضرب در ${M('5')} به‌علاوه ضرب در ${M('2')} ← ${M(`${5*n} + ${2*n} = ${7*n}`)}`;break;
  }
  if(sw&&a!==b)s=`🔄 جابه‌جا کن: ${M(`${a} × ${b}`)} همون ${M(`${b} × ${a}`)} است.<br>`+s;
  return s;
}

/* ============ جعبه لایتنر (تکرار با فاصله) ============ */
const fkey=(a,b)=>a<b?`${a}x${b}`:`${b}x${a}`;
const isCore=(a,b)=>a>=2&&a<=9&&b>=2&&b<=9;
function ltBox(a,b){return S.lt[fkey(a,b)]}
function ltUpdate(a,b,ok,ms){if(!isCore(a,b))return;const k=fkey(a,b);let v=S.lt[k]||0;if(!ok)v=0;else if(ms<7000)v=Math.min(5,v+1);S.lt[k]=v;if(ok)S.tm[k]=S.tm[k]?Math.round(S.tm[k]*.6+ms*.4):ms}
function coreFacts(){const f=[];for(let a=2;a<=9;a++)for(let b=a;b<=9;b++)f.push([a,b]);return f}
function mastered(){return coreFacts().filter(([a,b])=>(ltBox(a,b)||0)>=3).length}
let lastFact='';
function pickFact(){const f=coreFacts();let tot=0;const w=f.map(([a,b])=>{const bx=ltBox(a,b);const x=bx===undefined?16:Math.pow(6-bx,2);tot+=x;return x});
  for(let t=0;t<10;t++){let r=Math.random()*tot,i=0;while(r>w[i]){r-=w[i];i++}const [a,b]=f[Math.min(i,f.length-1)];if(fkey(a,b)!==lastFact||t===9){lastFact=fkey(a,b);return Math.random()<.5?[a,b]:[b,a]}}}
function weakFacts(n=4){return coreFacts().filter(([a,b])=>{const x=ltBox(a,b);return x!==undefined&&x<=1}).sort((p,q)=>(ltBox(...p)-ltBox(...q))||((S.tm[fkey(...q)]||9e9)-(S.tm[fkey(...p)]||9e9))).slice(0,n)}

/* ============ سازنده سوال ============ */
function factQ(a,b,extra){return Object.assign({text:M(`${a} × ${b} = ?`),ans:a*b,hint:strat(a,b),fact:[a,b]},extra||{})}
function tableGen(m){return()=>{const n=rnd(2,10);return Math.random()<.5?factQ(n,m):factQ(m,n)}}
function tableDeck(m){const ns=shuffle(range(2,10)).concat([pick([0,1,rnd(2,10)])]);return shuffle(ns).map(n=>Math.random()<.5?factQ(n,m):factQ(m,n))}
const fmtN=x=>x<0?`(${x})`:`${x}`;
function decStr(i,d){return d===0?String(i):(i/Math.pow(10,d)).toFixed(d)}

/* ============ مراحل ============ */
/*__STAGES__*/

const N=STAGES.length;
const totalStars=()=>Object.values(S.stars).reduce((a,b)=>a+b,0);
const passed=i=>(S.stars[STAGES[i].id]||0)>0;
const unlocked=i=>i===0||passed(i-1);
const nextStageIdx=()=>STAGES.findIndex((_,i)=>!passed(i));
const today=()=>new Date().toDateString();

/* ============ تم (Adaptive) ============ */
const THEMES=['auto','light','dark'],TICON={auto:'🌓',light:'☀️',dark:'🌙'},TNAME={auto:'خودکار (مثل سیستم)',light:'روشن',dark:'تاریک'};
const darkMQ=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):{matches:false};
const isDark=()=>S.theme==='dark'||(S.theme==='auto'&&darkMQ.matches);
function applyTheme(){const h=document.documentElement;if(S.theme==='auto')h.removeAttribute('data-theme');else h.setAttribute('data-theme',S.theme);const mt=$('meta[name=theme-color]');if(mt)mt.content=isDark()?'#07061a':'#eef0fb'}
try{darkMQ.addEventListener('change',applyTheme)}catch(e){}
function cycleTheme(ev){
  const nt=THEMES[(THEMES.indexOf(S.theme)+1)%3];
  const apply=()=>{S.theme=nt;save();applyTheme();updateHeader()};
  if(document.startViewTransition&&!RM&&ev){
    const r=ev.currentTarget.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    document.documentElement.classList.add('vt-theme');
    const vt=document.startViewTransition(apply);
    vt.ready.then(()=>document.documentElement.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${rad}px at ${x}px ${y}px)`]},{duration:600,easing:'cubic-bezier(.4,0,.2,1)',pseudoElement:'::view-transition-new(root)'})).catch(()=>{});
    vt.finished.finally(()=>document.documentElement.classList.remove('vt-theme'));
  }else apply();
  setTimeout(()=>toast(`${TICON[nt]} حالت نمایش: ${TNAME[nt]}`),150);
}

/* ============ انتقال صفحه‌ها ============ */
let cur='home';
function go(fn){const run=()=>{closeSheet(true);fn();window.scrollTo(0,0)};if(document.startViewTransition&&!RM){try{document.startViewTransition(run);return}catch(e){}}run()}

/* ============ هدر و ناوبری شناور ============ */
function renderChrome(){
  $('#top').innerHTML=`<button class="brand" id="brand" aria-label="خانه"><span class="logo">🦸</span><b>قهرمان ضرب</b></button>
  <div class="chips"><span class="chip" id="chStars" title="ستاره‌ها">⭐ <b></b></span><span class="chip" id="xpchip" title="امتیاز">⚡ <b></b></span><span class="chip hide-sm" id="chLvl" title="سطح">🎖️ <b></b></span>
  <button class="icon-btn" id="thBtn" aria-label="تغییر تم"></button><button class="icon-btn" id="muBtn" aria-label="صدا"></button></div>`;
  $('#brand').onclick=()=>home();$('#thBtn').onclick=cycleTheme;
  $('#muBtn').onclick=()=>{S.mute=!S.mute;save();updateHeader();toast(S.mute?'🔇 صدا خاموش شد':'🔊 صدا روشن شد')};
  $('#nav').innerHTML='<div class="pill" id="pill"></div>'+TABS.map(t=>`<button class="nav-item" data-tab="${t[0]}" aria-current="false"><span class="ni">${t[1]}</span>${t[2]}</button>`).join('');
  $$('.nav-item').forEach(b=>b.onclick=()=>{const t=TABS.find(x=>x[0]===b.dataset.tab);if(t)t[3]()});
  updateHeader();
}
function updateHeader(){const q=s=>$(s+' b');if(!q('#xpchip'))return;q('#chStars').textContent=fa(totalStars());q('#xpchip').textContent=fa(S.xp);q('#chLvl').textContent='سطح '+fa(Math.floor(S.xp/250)+1);$('#thBtn').textContent=TICON[S.theme];$('#muBtn').textContent=S.mute?'🔇':'🔊'}
let curTab='map';
function setTab(t){curTab=t;document.body.classList.toggle('focus',!t);$$('.nav-item').forEach(b=>b.setAttribute('aria-current',String(b.dataset.tab===t)));movePill()}
function movePill(){const it=curTab&&$(`.nav-item[data-tab=${curTab}]`),p=$('#pill');if(!it||!p)return;p.style.width=it.offsetWidth+'px';p.style.height=it.offsetHeight+'px';p.style.transform=`translate(${it.offsetLeft}px,${it.offsetTop}px)`}
addEventListener('resize',movePill);
addEventListener('scroll',()=>$('#top').classList.toggle('scrolled',scrollY>6),{passive:true});

/* نور پویا روی شیشه (دنبال کردن انگشت/ماوس) */
let lightRaf=0;
document.addEventListener('pointermove',e=>{if(lightRaf||RM)return;lightRaf=requestAnimationFrame(()=>{lightRaf=0;$$('.glass').forEach(g=>{const r=g.getBoundingClientRect();g.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');g.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')})})},{passive:true});
/* موج لمسی (micro-interaction) */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.pad button,.nav-item,.stage,.mode-card,.icon-btn,.continue');if(!b||RM)return;const r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*2.2,s=document.createElement('span');s.className='ripple';s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),650)});

/* ============ Toast ============ */
function toast(msg){const t=document.createElement('div');t.className='toast glass';t.innerHTML=msg;$('#layer').appendChild(t);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),400)},1900)}

/* ============ Sheet فضایی (از خودِ دکمه باز میشه) ============ */
let sheetState=null;
function openSheet(origin,html){
  closeSheet(true);
  const layer=$('#layer'),back=document.createElement('div'),sh=document.createElement('div');
  back.className='scrim';sh.className='sheet glass';sh.innerHTML=html;sh.setAttribute('role','dialog');
  layer.append(back,sh);
  const r=origin&&origin.getBoundingClientRect?origin.getBoundingClientRect():null;
  if(innerWidth<640||!r){sh.classList.add('bottom')}
  else{const w=sh.offsetWidth,h=sh.offsetHeight;sh.style.left=Math.min(Math.max(r.left+r.width/2-w/2,12),innerWidth-w-12)+'px';sh.style.top=Math.min(Math.max(r.top+r.height/2-h/2,80),innerHeight-h-12)+'px'}
  const sr=sh.getBoundingClientRect();
  if(!RM){
    let from='translateY(40px) scale(.96)';
    if(r){const dx=(r.left+r.width/2)-(sr.left+sr.width/2),dy=(r.top+r.height/2)-(sr.top+sr.height/2),s=Math.max(.12,Math.min(1,r.width/sr.width));from=`translate(${dx}px,${dy}px) scale(${s})`}
    sh.animate([{transform:from,opacity:0,borderRadius:'22px'},{transform:'none',opacity:1,borderRadius:'32px'}],{duration:480,easing:SPRING});
    back.animate([{opacity:0},{opacity:1}],{duration:260});
  }
  back.onclick=()=>closeSheet();
  sheetState={sh,back,origin:r};
  return sh;
}
function closeSheet(instant){
  if(!sheetState)return;const{sh,back,origin}=sheetState;sheetState=null;
  if(instant||RM){sh.remove();back.remove();return}
  const sr=sh.getBoundingClientRect();let to='translateY(40px) scale(.96)';
  if(origin){const dx=(origin.left+origin.width/2)-(sr.left+sr.width/2),dy=(origin.top+origin.height/2)-(sr.top+sr.height/2),s=Math.max(.12,Math.min(1,origin.width/sr.width));to=`translate(${dx}px,${dy}px) scale(${s})`}
  sh.animate([{transform:'none',opacity:1},{transform:to,opacity:0}],{duration:300,easing:'cubic-bezier(.4,0,.6,1)'}).onfinish=()=>sh.remove();
  back.animate([{opacity:1},{opacity:0}],{duration:280}).onfinish=()=>back.remove();
}
function askConfirm(o){
  openSheet(o.origin,`<div class="sheet-icon">${o.icon||'🤔'}</div><h3>${o.title}</h3>${o.text?`<p class="mut" style="margin-top:4px">${o.text}</p>`:''}<div class="sheet-actions"><button class="btn ${o.danger?'danger':''} block" id="cy">${o.yes||'بله'}</button><button class="btn ghost block" id="cn">${o.no||'نه، برگرد'}</button></div>`);
  $('#cy').onclick=()=>{o.onYes();closeSheet(true)};$('#cn').onclick=()=>closeSheet();
}

/* ============ مربی هوشمند (UX هوشمند داخل تجربه) ============ */
function greeting(){const h=new Date().getHours();return h<5?'شب بخیر 🌙':h<12?'صبح بخیر ☀️':h<17?'ظهر بخیر 🌤️':h<20?'عصر بخیر 🌇':'شب بخیر 🌙'}
function coach(){
  const done=STAGES.filter((_,i)=>passed(i)).length,nx=nextStageIdx(),weak=weakFacts();
  const recent=S.log.filter(t=>Date.now()-t<50*60000).length;
  const toNext=el=>nx>=0?stageSheet(nx,el):startReview();
  if(done===0&&!Object.keys(S.lt).length)return{e:'👋',t:'بیا از اول شروع کنیم',x:`اول می‌فهمیم ضرب اصلاً یعنی چی، با شکل و نقطه. فقط ${fa(5)} دقیقه طول می‌کشه و بعدش هر مرحله یه ترفند جدید یادت میده.`,a:[['شروع مرحله ۱ 🚀',el=>stageSheet(0,el),1]]};
  if(recent>=4)return{e:'☕',t:'وقت یه استراحت کوتاهه',x:`تو ${fa(50)} دقیقه‌ی اخیر ${fa(recent)} مرحله رو تموم کردی! ${fa(10)} دقیقه استراحت کن؛ مغزت موقع استراحت چیزایی که یاد گرفتی رو محکم می‌کنه.`,a:[['باشه، استراحت ☕',()=>{S.log=[];save();toast('☕ استراحت خوبی داشته باشی!');home()},1],['نه، ادامه بدیم',toNext,0]]};
  if(S.lastDay&&S.lastDay!==today()&&done>0)return{e:'🔁',t:'خوش برگشتی!',x:'قبل از ادامه یه مرور سریع بزنیم تا چیزایی که دفعه‌ی قبل یاد گرفتی از یادت نره. این همون «تکرار با فاصله»ست، یعنی بهترین روش علمی برای حفظ کردن.',a:[['مرور ۲ دقیقه‌ای 🧠',()=>startReview(),1],['ادامه‌ی مراحل',toNext,0]]};
  if(weak.length>=2&&done>=3)return{e:'🎯',t:'چند تا ضرب هنوز لجبازی می‌کنن',x:`این‌ها رو هنوز کامل بلد نیستی: ${weak.map(([a,b])=>M(`${a}×${b}`)).join('، ')}. یه تمرین هدفمند فقط روی همین‌ها بزنیم؟`,a:[['تمرین هدفمند 🎯',()=>startFocus(weak),1],['بعداً',toNext,0]]};
  if(passed(11)&&S.best<20&&nx>12)return{e:'⚡',t:'وقت سرعت گرفتنه',x:`جدول ضرب رو یاد گرفتی! حالا با مسابقه‌ی سرعت کاری کن جواب‌ها خودکار به ذهنت برسن. هدف: ${fa(30)} جواب در یک دقیقه.`,a:[['مسابقه سرعت ⚡',()=>speedIntro(),1],['ادامه‌ی مراحل',toNext,0]]};
  if(nx===-1)return{e:'🏆',t:'تو قهرمان ضربی!',x:`همه‌ی مراحل رو تموم کردی. برای اینکه همیشه یادت بمونه، تا یه هفته هر روز ${fa(5)} دقیقه مرور هوشمند بزن.`,a:[['مرور هوشمند 🧠',()=>startReview(),1]]};
  const s=STAGES[nx],mins=Math.max(3,Math.round(s.lesson.length*1.2+s.count*.35));
  return{e:s.icon,t:`قدم بعدی: ${s.title}`,x:`حدود ${fa(mins)} دقیقه طول می‌کشه. ${done?`تا اینجا ${fa(done)} مرحله رو رد کردی. ${done>=N/2?'بیشتر از نصف راه رو اومدی! 💪':'عالی پیش میری!'}`:''}`,a:[['بزن بریم 🚀',el=>stageSheet(nx,el),1]]};
}
function coachHTML(c){return `<section class="card coach" id="coach"><div class="coach-glow"></div><span class="coach-badge">✨ مربی هوشمند</span><div class="coach-body"><div class="coach-emoji">${c.e}</div><div><h3>${c.t}</h3><p id="coachText">${c.x}</p></div></div><div class="coach-actions">${c.a.map((a,i)=>`<button class="btn ${a[2]?'':'ghost'}" data-ca="${i}">${a[0]}</button>`).join('')}</div></section>`}
function bindCoach(c){$$('[data-ca]').forEach(b=>b.onclick=()=>c.a[+b.dataset.ca][1](b))}

/* ============ صفحه اصلی ============ */
function ringSVG(id,pct,size){const C=213.6;return `<div class="ring-wrap"${size?` style="width:${size}px;height:${size}px"`:''}><svg class="ring" viewBox="0 0 80 80"><defs><linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--acc)"/><stop offset="1" stop-color="var(--acc2)"/></linearGradient></defs><circle class="bgc" cx="40" cy="40" r="34"/><circle class="fgc" cx="40" cy="40" r="34" stroke="url(#g${id})" style="stroke-dasharray:${C};stroke-dashoffset:${C}" data-off="${C*(1-pct)}"/></svg><b>${fa(Math.round(pct*100))}٪</b></div>`}
function animateMeters(){setTimeout(()=>{$$('.fgc[data-off]').forEach(c=>c.style.strokeDashoffset=c.dataset.off);$$('.mini i[data-w]').forEach(i=>i.style.width=i.dataset.w);$$('.barv[data-h]').forEach(b=>b.style.height=b.dataset.h)},80)}
function home(){go(()=>{setTab('map');cur='home';renderHome()})}
function renderHome(){
  const done=STAGES.filter((_,i)=>passed(i)).length,nx=nextStageIdx(),c=coach(),mst=mastered(),lvl=Math.floor(S.xp/250)+1,lp=(S.xp%250)/250;
  let map='';STAGES.forEach((s,i)=>{if(s.sec)map+=`<div class="sec-title">${s.sec}</div>`;const st=S.stars[s.id]||0,lock=!unlocked(i),isNext=i===nx;
    map+=`<button class="stage ${lock?'locked':''} ${st?'done':''} ${isNext?'next':''}" data-i="${i}" style="--d:${Math.min(i,12)*28}ms"><div class="st-top"><span class="st-icon">${lock?'🔒':s.icon}</span><span class="st-num">${fa(i+1)}</span></div><div class="st-title">${s.title}</div><div class="st-stars">${[0,1,2].map(k=>`<span class="${k<st?'on':''}">★</span>`).join('')}</div>${isNext?'<span class="st-badge">بعدی</span>':''}${st?'<span class="st-check">✓</span>':''}</button>`});
  const web=location.protocol!=='file:';
  app.innerHTML=`
  <section class="hello"><div class="eyebrow">${greeting()}</div><h1>${done===N?'قهرمان ضرب! 🏆':'سلام قهرمان!'}</h1><p class="mut">${done===0?'امروز قراره ضرب رو از صفر تا صد، با بازی و ترفند یاد بگیری.':done===N?'همه‌ی مراحل رو فتح کردی. حالا فقط مرور کن که همیشه یادت بمونه.':`${fa(done)} مرحله از ${fa(N)} رو رد کردی. ادامه بده، داری عالی پیش میری.`}</p></section>
  ${coachHTML(c)}
  <section class="stat-grid">
    <div class="card stat">${ringSVG('a',done/N)}<div><div class="lbl">مراحل</div><b>${fa(done)}/${fa(N)}</b></div></div>
    <div class="card stat"><div class="lbl">ضرب‌های مسلط</div><div class="big">${fa(mst)}<span class="mut" style="font-size:14px">/${fa(36)}</span></div><div class="mini"><i data-w="${mst/36*100}%"></i></div></div>
    <div class="card stat"><div class="lbl">سطح ${fa(lvl)}</div><div class="big">⚡${fa(S.xp)}</div><div class="mini"><i data-w="${lp*100}%"></i></div></div>
  </section>
  ${nx>=0?`<button class="card continue" id="cont"><span class="ci">${STAGES[nx].icon}</span><div><div class="eyebrow">${done?'ادامه بده':'شروع کن'} — مرحله ${fa(nx+1)}</div><h3>${STAGES[nx].title}</h3></div><span class="arrow">←</span></button>`:''}
  <div class="section-h"><h2>نقشه‌ی مراحل</h2><span class="mut small">${fa(totalStars())} از ${fa(N*3)} ستاره</span></div>
  <div class="map">${map}</div>
  <details class="card plan"><summary>📅 برنامه‌ی یک‌روزه</summary><ul>
   <li>☀️ <b>صبح (حدود ۱ ساعت):</b> مراحل ۱ تا ۶، یعنی معنی ضرب و ترفندهای ${M('0, 1, 2, 5, 10, 4')}</li>
   <li>☕ <b>۱۵ دقیقه استراحت.</b> مغز موقع استراحت یادگرفته‌ها رو تثبیت می‌کنه.</li>
   <li>🌤️ <b>قبل از ظهر:</b> مراحل ۷ تا ۱۱، یعنی ترفندهای ${M('9, 3, 6, 8, 7')}</li>
   <li>🍽️ <b>ناهار و استراحت</b></li>
   <li>🌇 <b>عصر:</b> مرحله ۱۲، بعد ۱۰ دقیقه مرور هوشمند و یه دور مسابقه‌ی سرعت</li>
   <li>🌙 <b>شب:</b> مراحل ۱۳ تا ۱۸، یعنی ضرب عددهای بزرگ، منفی و اعشاری</li>
   <li>👹 <b>قبل خواب:</b> غول آخر و یه دور مرور هوشمند</li>
   <li>💡 <b>نکته طلایی:</b> تا یه هفته هر روز ۵ دقیقه مرور هوشمند بزن تا همیشه یادت بمونه.</li></ul></details>
  <div class="footer">${web?`<a class="btn good" href="https://github.com/Amir13891389199/zarb-hero/releases/latest/download/zarb-hero.apk">📱 دانلود نسخه اندروید</a>`:''}<span class="mut small">پیشرفتت خودکار ذخیره میشه.</span><button class="linkbtn" id="reset">شروع از اول</button></div>`;
  bindCoach(c);
  $$('.stage').forEach(b=>b.onclick=()=>stageSheet(+b.dataset.i,b));
  if($('#cont'))$('#cont').onclick=e=>stageSheet(nx,e.currentTarget);
  $('#reset').onclick=e=>askConfirm({origin:e.currentTarget,icon:'🗑️',title:'همه‌ی پیشرفت پاک بشه؟',text:'ستاره‌ها، امتیازها و جعبه‌های لایتنر صفر میشن.',yes:'آره، پاک کن',danger:1,onYes:()=>{const th=S.theme,mu=S.mute;S={xp:0,stars:{},lt:{},tm:{},best:0,mute:mu,theme:th,lastDay:'',log:[]};save();updateHeader();home()}});
  animateMeters();
}

function stageSheet(i,origin){
  const s=STAGES[i],st=S.stars[s.id]||0,lock=!unlocked(i);
  openSheet(origin,`<div class="sheet-icon" style="view-transition-name:hero">${s.icon}</div><div class="eyebrow center">مرحله ${fa(i+1)} از ${fa(N)}</div><h3>${s.title}</h3><div class="sheet-stars">${[0,1,2].map(k=>`<span class="${k<st?'on':''}">★</span>`).join('')}</div><div class="meta-row"><span>📖 ${fa(s.lesson.length)} صفحه درس</span><span>✏️ ${fa(s.count)} سوال</span><span>🎯 قبولی: ${fa(s.pass)}</span></div>${lock?`<div class="note warn">🔒 این مرحله هنوز قفله. پیشنهاد می‌کنم اول مرحله‌ی ${fa(i)} رو تموم کنی. ولی اگه این قسمت رو بلدی، می‌تونی بری.</div>`:''}<div class="sheet-actions"><button class="btn block" id="sa1">📖 ${st?'دوباره دیدن درس':'شروع درس'}</button><button class="btn ghost block" id="sa2">⚡ مستقیم برو تمرین</button></div>`);
  $('#sa1').onclick=()=>lesson(i,0);$('#sa2').onclick=()=>startQuiz(i);
}

/* ============ درس ============ */
let L=null;
function lesson(i,k){go(()=>{setTab(null);cur='lesson';renderLessonShell(i);showSlide(k,0)})}
function renderLessonShell(i){
  const s=STAGES[i];L={i,k:0};
  app.innerHTML=`<div class="lesson-head"><button class="icon-btn" id="lback" aria-label="برگشت">→</button><div class="lh-icon" style="view-transition-name:hero">${s.icon}</div><div class="lh-text"><div class="eyebrow">مرحله ${fa(i+1)} — درس</div><h2>${s.title}</h2></div><button class="btn ghost sm" id="lskip">تمرین ⏭</button></div>
  <article class="card lesson" id="lcard"></article>
  <div class="lesson-nav"><button class="btn ghost" id="lprev">→ قبلی</button><div class="sdots" id="ldots"></div><button class="btn" id="lnext">بعدی ←</button></div>${s.lesson.length>1?'<div class="swipe-hint">می‌تونی صفحه‌ها رو با کشیدن انگشت هم عوض کنی 👆</div>':''}`;
  $('#lback').onclick=()=>home();$('#lskip').onclick=()=>startQuiz(i);
  $('#lprev').onclick=()=>showSlide(L.k-1,-1);
  $('#lnext').onclick=()=>{if(L.k<s.lesson.length-1)showSlide(L.k+1,1);else startQuiz(i)};
  let sx=null,sy=0;const lc=$('#lcard');
  lc.addEventListener('pointerdown',e=>{if(e.target.closest('input,button'))return;sx=e.clientX;sy=e.clientY});
  lc.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){if(dx>0&&L.k<s.lesson.length-1)showSlide(L.k+1,1);else if(dx<0&&L.k>0)showSlide(L.k-1,-1)}});
}
function showSlide(k,dir){
  const s=STAGES[L.i],n=s.lesson.length;if(k<0||k>=n)return;L.k=k;const sl=s.lesson[k],lc=$('#lcard');
  lc.innerHTML=typeof sl==='string'?sl:sl.html;if(sl.mount)sl.mount();
  $('#ldots').innerHTML=s.lesson.map((_,j)=>`<i class="${j===k?'on':''}"></i>`).join('');
  $('#lprev').style.visibility=k>0?'visible':'hidden';
  const nb=$('#lnext'),last=k===n-1;nb.textContent=last?'بزن بریم تمرین! 🚀':'بعدی ←';nb.classList.toggle('good',last);
  if(dir&&!RM){sTap();lc.animate([{opacity:0,transform:`translateX(${dir>0?-48:48}px)`},{opacity:1,transform:'none'}],{duration:420,easing:SPRING})}
}

/* ============ کیبورد عددی ============ */
let pad=null;
function padHTML(){const k=[['7','7'],['8','8'],['9','9'],['4','4'],['5','5'],['6','6'],['1','1'],['2','2'],['3','3'],['-','−'],['0','0'],['.','٫']];return k.map(([v,l])=>`<button data-k="${v}" aria-label="${v==='.'?'ممیز':l}">${v==='.'?'<b style="font-size:34px;line-height:1">.</b>':fa(l)}</button>`).join('')+'<button class="bk" data-k="back" aria-label="پاک کردن">⌫</button><button class="ok" data-k="ok">✔ ثبت</button>'}
function bindPad(){$$('.pad button').forEach(b=>b.onclick=()=>padPress(b.dataset.k))}
function updateDisp(){const d=$('#disp');if(d)d.innerHTML=(pad&&pad.buf?`<span>${fa(pad.buf)}</span>`:'')+'<span class="caret"></span>'}
function padPress(k){if(!pad)return;if(pad.locked){if(k==='ok'&&pad.cont)pad.cont();return}
  if(k==='back')pad.buf=pad.buf.slice(0,-1);
  else if(k==='ok'){pad.submit();return}
  else if(k==='-')pad.buf=pad.buf.startsWith('-')?pad.buf.slice(1):'-'+pad.buf;
  else if(k==='.'){if(!pad.buf.includes('.'))pad.buf+=(pad.buf===''||pad.buf==='-')?'0.':'.'}
  else if(pad.buf.replace(/[-.]/g,'').length<9)pad.buf+=k;
  buzz(6);updateDisp()}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&sheetState){closeSheet();return}
  if(!pad||sheetState)return;let k=e.key;const i='۰۱۲۳۴۵۶۷۸۹'.indexOf(k),j='٠١٢٣٤٥٦٧٨٩'.indexOf(k);if(i>=0)k=String(i);if(j>=0)k=String(j);
  if(/^[0-9]$/.test(k))padPress(k);else if(k==='Enter'){e.preventDefault();padPress('ok')}else if(k==='Backspace')padPress('back');else if(k==='-')padPress('-');else if(k==='.'||k==='٫'||k==='/')padPress('.')});

function flyXP(from,amount){
  const chip=$('#xpchip');if(!chip||RM||!from){updateHeader();return}
  const a=from.getBoundingClientRect(),b=chip.getBoundingClientRect(),el=document.createElement('div');
  el.className='flyxp';el.textContent='+'+fa(amount);el.style.left=(a.left+a.width/2-18)+'px';el.style.top=(a.top+4)+'px';document.body.appendChild(el);
  const dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top-a.top;
  el.animate([{transform:'translate(0,0) scale(.8)',opacity:0},{transform:'translate(0,-34px) scale(1.3)',opacity:1,offset:.25},{transform:`translate(${dx}px,${dy}px) scale(.55)`,opacity:.85}],{duration:950,easing:'cubic-bezier(.5,0,.3,1)'}).onfinish=()=>{el.remove();updateHeader();chip.classList.remove('bump');void chip.offsetWidth;chip.classList.add('bump')};
}

/* ============ تمرین ============ */
let Q=null;
const TIP_STAGE={2:3,5:4,4:5,9:6,3:7,6:8,8:9,7:10};
function startQuiz(i){const s=STAGES[i];const deck=s.deck?s.deck():Array.from({length:s.count},()=>s.gen());beginQuiz({mode:'stage',i,title:`${s.icon} ${s.title}`,deck,pass:s.pass})}
function startReview(){lastFact='';beginQuiz({mode:'review',title:'🧠 مرور هوشمند',deck:Array.from({length:15},()=>factQ(...pickFact()))})}
function startFocus(facts){const d=[];while(d.length<10)shuffle(facts).forEach(f=>{if(d.length<10)d.push(f)});beginQuiz({mode:'focus',title:'🎯 تمرین هدفمند',deck:d.map(([a,b])=>Math.random()<.5?factQ(a,b):factQ(b,a))})}
function beginQuiz(o){Q=Object.assign({queue:o.deck,total:o.deck.length,done:0,first:0,xp:0,streak:0,maxStreak:0,wrong:[],t:Date.now(),wrongBy:{},tipped:{}},o);go(()=>{setTab(null);cur='quiz';renderQuizShell();nextQ(true)})}
function renderQuizShell(){
  app.innerHTML=`<div class="quiz"><div class="quiz-bar"><button class="icon-btn" id="qx" aria-label="خروج">✕</button><div class="pbar"><i id="pfill"></i></div><span class="qcount" id="qcount"></span></div><div class="card qcard" id="qcard"></div><div class="pad glass" id="pad">${padHTML()}</div></div>`;
  bindPad();
  $('#qx').onclick=e=>askConfirm({origin:e.currentTarget,icon:'🚪',title:'از تمرین خارج میشی؟',text:'نتیجه‌ی این دور ثبت نمیشه، ولی XPهایی که گرفتی می‌مونه.',yes:'آره، خروج',no:'نه، ادامه میدم',danger:1,onYes:()=>{clearTimeout(Q&&Q.ht);clearTimeout(window._nq);pad=null;home()}});
}
function nextQ(first){
  clearTimeout(Q.ht);if(!Q.queue.length)return finish();
  const c=Q.cur=Q.queue.shift();Q.t0=Date.now();Q.hint=false;
  $('#pfill').style.width=(Q.done/Q.total*100)+'%';$('#qcount').textContent=`${fa(Q.done)}/${fa(Q.total)}`;
  const qc=$('#qcard');
  qc.innerHTML=`<div class="q-top"><span>${Q.title}</span>${c.retry?'<span class="tag warn">🔁 دوباره</span>':''}${Q.streak>=3?`<span class="tag fire">🔥 ${fa(Q.streak)} تا پشت هم</span>`:''}</div>${c.viz||''}${c.sub?`<div class="qsub">${c.sub}</div>`:''}<div class="qtext">${c.text}</div><div class="disp" id="disp"></div><div class="fb" id="fb"></div><button class="hint-btn" id="hbtn">💡 راهنما</button>`;
  pad={buf:'',locked:false,submit:checkAns,cont:null};updateDisp();
  if(!first&&!RM)qc.animate([{opacity:0,transform:'translateX(-40px) scale(.98)'},{opacity:1,transform:'none'}],{duration:420,easing:SPRING});
  $('#hbtn').onclick=()=>{Q.hint=true;$('#fb').innerHTML=`<div class="hintbox">💡 ${c.hint}</div>`;$('#hbtn').style.display='none'};
  Q.ht=setTimeout(()=>{const h=$('#hbtn');if(h&&pad&&!pad.locked)h.classList.add('nudge')},12000);
}
function checkAns(){
  if(pad.buf===''||pad.buf==='-'||pad.buf==='.')return;
  const c=Q.cur,v=parseFloat(pad.buf),ok=Math.abs(v-c.ans)<1e-9,ms=Date.now()-Q.t0;clearTimeout(Q.ht);
  if(c.fact)ltUpdate(c.fact[0],c.fact[1],ok,ms);
  pad.locked=true;const d=$('#disp'),fb=$('#fb');$('#hbtn').style.display='none';
  if(!c.retry)Q.done++;
  $('#pfill').style.width=(Q.done/Q.total*100)+'%';$('#qcount').textContent=`${fa(Q.done)}/${fa(Q.total)}`;
  if(ok){
    sGood();Q.streak++;Q.maxStreak=Math.max(Q.maxStreak,Q.streak);if(!c.retry)Q.first++;
    const g=c.retry?3:(Q.hint?5:10)+(Q.streak>=5?2:0);Q.xp+=g;S.xp+=g;save();
    d.classList.add('ok');fb.innerHTML=`<span class="fb-chip good">${pick(praise)}${ms<4000&&!Q.hint?' ⚡ سریع!':''}</span>`;
    flyXP(d,g);window._nq=setTimeout(()=>nextQ(),900);
  }else{
    sBad();Q.streak=0;d.classList.add('bad');Q.queue.push(Object.assign({},c,{retry:true}));if(!c.retry)Q.wrong.push(c);
    d.innerHTML=`<s>${fa(pad.buf)}</s><span class="to">→</span><span class="right">${fa(c.ans)}</span>`;
    let tip='';
    if(c.fact){const m=stratM(c.fact[0],c.fact[1]);if(m!==null&&TIP_STAGE[m]!==undefined){Q.wrongBy[m]=(Q.wrongBy[m]||0)+1;if(Q.wrongBy[m]>=2&&!Q.tipped[m]&&Q.i!==TIP_STAGE[m]){Q.tipped[m]=1;tip=`<div class="coachtip">✨ <b>مربی:</b> به نظر میاد ضرب در ${M(m)} هنوز جا نیفتاده. بعد از این تمرین، درس «${STAGES[TIP_STAGE[m]].title}» رو یه بار دیگه ببین.</div>`}}}
    fb.innerHTML=`<span class="fb-chip bad">نزدیک بود! جواب درست: ${M(c.ans)}</span><div class="hintbox">💡 ${c.hint}</div>${tip}<button class="btn block" id="cbtn">فهمیدم، ادامه ←</button><div class="mut small" style="margin-top:6px">این سوال آخر تمرین دوباره میاد 🔁</div>`;
    pad.cont=()=>{pad=null;nextQ()};$('#cbtn').onclick=pad.cont;save();
    setTimeout(()=>{const b=$('#cbtn');if(b)b.scrollIntoView({block:'center',behavior:RM?'auto':'smooth'})},120);
  }
}
function finish(){
  pad=null;S.lastDay=today();const dur=Math.round((Date.now()-Q.t)/1000),durS=`${Math.floor(dur/60)}:${String(dur%60).padStart(2,'0')}`;
  let st=0,title,sub,emoji,actions;
  const wrongFacts=[...new Map(Q.wrong.filter(c=>c.fact).map(c=>[fkey(...c.fact),c.fact])).values()];
  if(Q.mode==='stage'){
    const s=STAGES[Q.i],f=Q.first,t=Q.total;st=f>=t?3:f>=Q.pass+Math.ceil((t-Q.pass)/2)?2:f>=Q.pass?1:0;
    if(st>(S.stars[s.id]||0))S.stars[s.id]=st;if(st){S.log.push(Date.now());S.log=S.log.slice(-20)}
    const hasNext=Q.i<N-1;
    if(st){emoji=Q.i===N-1?'👹':'🎉';title=Q.i===N-1?'غول رو شکست دادی! 🏆':'مرحله رد شد!';sub=st===3?'بی‌نقص! همه رو در اولین تلاش درست زدی.':'عالی بود! برای ⭐ بیشتر می‌تونی دوباره امتحان کنی.';
      actions=`${hasNext?`<button class="btn good" id="ra1">مرحله‌ی بعد ←</button>`:''}<button class="btn ghost" id="ra2">دوباره (برای ⭐ بیشتر)</button><button class="btn ghost" id="ra3">🗺️ نقشه</button>`}
    else{emoji='💪';title='تقریباً رسیدی!';sub=`برای قبولی ${fa(Q.pass)} جواب درست در اولین تلاش لازمه. مغز با اشتباه کردن یاد می‌گیره، پس یه بار دیگه امتحان کن!`;
      actions=`<button class="btn" id="ra2">دوباره امتحان کن 🔁</button><button class="btn ghost" id="ra4">📖 دیدن درس</button><button class="btn ghost" id="ra3">🗺️ نقشه</button>`}
  }else{emoji=Q.mode==='focus'?'🎯':'🧠';title=Q.mode==='focus'?'تمرین هدفمند تموم شد!':'مرور تموم شد!';sub=`ضرب‌های مسلط‌شده: ${fa(mastered())} از ${fa(36)}`;
    actions=`<button class="btn" id="ra5">یه دور دیگه 🔁</button><button class="btn ghost" id="ra6">📊 جدول من</button><button class="btn ghost" id="ra3">🗺️ نقشه</button>`}
  save();
  const mode=Q.mode,qi=Q.i,first=Q.first,total=Q.total,xp=Q.xp,ms=Q.maxStreak;
  go(()=>{setTab(null);cur='result';
    app.innerHTML=`<div class="card result"><div class="res-emoji">${emoji}</div>${mode==='stage'?`<div class="rstars">${[0,1,2].map(k=>`<span class="rstar ${k<st?'on':''}" style="animation-delay:${350+k*200}ms">★</span>`).join('')}</div>`:''}<h1 style="font-size:28px">${title}</h1><p class="mut">${sub}</p>
    <div class="res-stats"><div style="animation-delay:.1s"><b>${fa(first)}/${fa(total)}</b><span>درست در اولین تلاش</span></div><div style="animation-delay:.18s"><b>+${fa(xp)}</b><span>امتیاز XP</span></div><div style="animation-delay:.26s"><b>${M(durS)}</b><span>زمان</span></div><div style="animation-delay:.34s"><b>🔥${fa(ms)}</b><span>بهترین پشت‌سرهم</span></div></div>
    ${wrongFacts.length?`<div class="coachtip" style="margin-bottom:14px">✨ <b>مربی:</b> این‌ها رو اشتباه زدی: ${wrongFacts.slice(0,5).map(([a,b])=>M(`${a}×${b}`)).join('، ')}. تو مرور هوشمند بیشتر ازت پرسیده میشن تا کامل جا بیفتن.</div>`:''}
    <div class="res-actions">${actions}</div></div>`;
    const on=(id,fn)=>{const b=$('#'+id);if(b)b.onclick=fn};
    on('ra1',()=>lesson(qi+1,0));on('ra2',()=>startQuiz(qi));on('ra3',()=>home());on('ra4',()=>lesson(qi,0));on('ra5',()=>mode==='focus'&&wrongFacts.length?startFocus(wrongFacts):startReview());on('ra6',()=>tableScreen());
  });
  if(st||mode!=='stage'){setTimeout(sWin,300);if(st)setTimeout(confetti,350)}
}

/* ============ مسابقه سرعت ============ */
let SP=null;const TC=213.6;
function speedIntro(){go(()=>{setTab('speed');cur='speed';
  app.innerHTML=`<section class="hello"><div class="eyebrow">چالش ۶۰ ثانیه‌ای ⏱️</div><h1>مسابقه سرعت</h1><p class="mut">وقتی جواب‌ها بدون فکر کردن به ذهنت برسن، یعنی ضرب رو واقعاً یاد گرفتی. ${fa(60)} ثانیه وقت داری تا هر چند تا ضرب که می‌تونی جواب بدی!</p></section>
  <div class="card result"><div class="bigemoji">⚡</div><div class="res-stats" style="grid-template-columns:1fr 1fr"><div><b>${fa(S.best)}</b><span>رکورد تو</span></div><div><b>${fa(30)}+</b><span>هدف (تسلط کامل)</span></div></div><button class="btn good block" id="sgo" style="height:56px;font-size:17px">شروع! 🏁</button></div>`;
  $('#sgo').onclick=speedStart})}
function speedStart(){SP={score:0,wrong:0,end:Date.now()+60000};
  go(()=>{setTab(null);cur='speedRun';
    app.innerHTML=`<div class="quiz"><div class="quiz-bar"><button class="icon-btn" id="qx" aria-label="خروج">✕</button><div class="timer-ring" id="tring"><svg class="ring" viewBox="0 0 80 80"><defs><linearGradient id="gt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--acc)"/><stop offset="1" stop-color="var(--acc2)"/></linearGradient></defs><circle class="bgc" cx="40" cy="40" r="34"/><circle class="fgc" id="tfg" cx="40" cy="40" r="34" stroke="url(#gt)" style="stroke-dasharray:${TC};stroke-dashoffset:0;transition:none"/></svg><b id="tm">${fa(60)}</b></div><div class="score">✅ <span id="sc">${fa(0)}</span></div></div>
    <div class="card qcard"><div class="q-top">⚡ مسابقه سرعت</div><div class="qtext" id="sq"></div><div class="disp" id="disp"></div><div class="fb" id="fb"></div></div><div class="pad glass">${padHTML()}</div></div>`;
    bindPad();
    $('#qx').onclick=e=>askConfirm({origin:e.currentTarget,icon:'🏳️',title:'مسابقه رو تموم می‌کنی؟',yes:'آره، خروج',danger:1,onYes:()=>{clearInterval(window._spT);SP=null;pad=null;speedIntro()}});
    speedQ();
    clearInterval(window._spT);window._spT=setInterval(()=>{if(!SP)return clearInterval(window._spT);const rem=Math.max(0,(SP.end-Date.now())/1000),f=$('#tfg'),t=$('#tm');if(f)f.style.strokeDashoffset=TC*(1-rem/60);if(t)t.textContent=fa(Math.ceil(rem));if(rem<=10)$('#tring')?.classList.add('hurry');if(rem<=0){clearInterval(window._spT);speedEnd()}},100);
  })}
function speedQ(){if(!SP||Date.now()>=SP.end)return;const[a,b]=pickFact();SP.t0=Date.now();const sq=$('#sq');if(!sq)return;sq.innerHTML=M(`${a} × ${b} = ?`);$('#fb').innerHTML='';const d=$('#disp');d.className='disp';
  if(!RM)sq.animate([{opacity:0,transform:'scale(.85)'},{opacity:1,transform:'none'}],{duration:300,easing:SPRING});
  pad={buf:'',locked:false,cont:null,submit(){if(pad.buf===''||pad.buf==='-')return;const ok=parseInt(pad.buf,10)===a*b;ltUpdate(a,b,ok,Date.now()-SP.t0);pad.locked=true;
    if(ok){SP.score++;sGood();d.classList.add('ok');const sc=$('#sc');sc.textContent=fa(SP.score);sc.parentElement.classList.remove('bump');void sc.offsetWidth;sc.parentElement.classList.add('bump');setTimeout(speedQ,230)}
    else{SP.wrong++;sBad();d.classList.add('bad');$('#fb').innerHTML=`<span class="fb-chip bad">${M(`${a} × ${b} = ${a*b}`)}</span>`;setTimeout(speedQ,1300)}}};
  updateDisp()}
function speedEnd(){pad=null;if(!SP)return;const sc=SP.score,wr=SP.wrong,rec=sc>S.best;if(rec)S.best=sc;const g=sc*4;S.xp+=g;S.lastDay=today();save();SP=null;
  go(()=>{setTab(null);cur='result';
    app.innerHTML=`<div class="card result"><div class="res-emoji">${rec?'🏆':'⏱️'}</div><h1 style="font-size:28px">${rec?'رکورد جدید!':'وقت تموم شد!'}</h1><p class="mut">${sc>=30?'فوق‌العاده! جدول ضرب رو کاملاً مسلطی.':sc>=20?'خیلی خوبه! چند دور دیگه و به ۳۰ می‌رسی.':'هر دور سریع‌تر میشی. ادامه بده!'}</p>
    <div class="res-stats"><div><b>${fa(sc)}</b><span>درست</span></div><div><b>${fa(wr)}</b><span>اشتباه</span></div><div><b>${fa(S.best)}</b><span>رکورد</span></div><div><b>+${fa(g)}</b><span>XP</span></div></div>
    <div class="res-actions"><button class="btn good" id="r1">دوباره 🔁</button><button class="btn ghost" id="r2">🗺️ نقشه</button></div></div>`;
    $('#r1').onclick=speedStart;$('#r2').onclick=()=>home();updateHeader()});
  if(rec&&sc>0){setTimeout(sWin,300);setTimeout(confetti,350)}}

/* ============ مرور هوشمند (هاب) ============ */
function reviewHub(){go(()=>{setTab('review');cur='review';
  const weak=weakFacts(8),f=coreFacts(),cnt=[f.filter(x=>ltBox(...x)===undefined).length,...[0,1,2,3,4,5].map(b=>f.filter(x=>ltBox(...x)===b).length)],mx=Math.max(1,...cnt);
  const cols=['var(--surface2)','rgba(240,68,103,.55)','rgba(245,120,60,.55)','rgba(245,190,40,.6)','rgba(160,210,60,.65)','rgba(40,200,110,.7)','var(--good)'],labels=['جدید','جعبه ۰','جعبه ۱','جعبه ۲','جعبه ۳','جعبه ۴','جعبه ۵'];
  app.innerHTML=`<section class="hello"><div class="eyebrow">تکرار با فاصله 🧠</div><h1>مرور هوشمند</h1><p class="mut">مغز چیزی رو که درست قبل از فراموش شدن مرور کنه، برای همیشه نگه می‌داره. جعبه‌ی لایتنر دقیقاً همین کار رو می‌کنه: ضرب‌های سخت رو زیاد می‌پرسه و ضرب‌های آسون رو کم.</p></section>
  <div class="modes"><button class="mode-card" id="m1"><div class="mi">🧠</div><b>مرور هوشمند</b><small>${fa(15)} سوال — سخت‌ترها بیشتر</small></button><button class="mode-card" id="m2" ${weak.length?'':'disabled'} style="animation-delay:.06s"><div class="mi">🎯</div><b>ضرب‌های سختم</b><small>${weak.length?`${fa(weak.length)} ضرب نیاز به تمرین داره`:'فعلاً ضرب سختی نداری 🎉'}</small></button></div>
  <section class="card"><h3>جعبه‌های لایتنر تو</h3><p class="mut small">هر بار درست و سریع جواب بدی، اون ضرب یه جعبه جلو میره. اگه اشتباه بزنی، برمی‌گرده جعبه‌ی صفر. از جعبه‌ی ۳ به بعد یعنی مسلطی 💪</p>
  <div class="boxes">${cnt.map((c,i)=>`<div class="col"><b>${fa(c)}</b><div class="barv" style="background:${cols[i]}" data-h="${Math.max(4,c/mx*100)}%"></div><span>${labels[i]}</span></div>`).join('')}</div></section>
  ${weak.length?`<section class="card" style="margin-top:14px"><h3>نیاز به تمرین</h3><p class="mut small">روی هر کدوم بزن تا ترفندش رو ببینی 👇</p><div class="fchips">${weak.map(([a,b])=>`<button class="fchip" data-a="${a}" data-b="${b}">${M(`${a}×${b}`)}</button>`).join('')}</div></section>`:''}`;
  $('#m1').onclick=()=>startReview();if(weak.length)$('#m2').onclick=()=>startFocus(weak);
  $$('.fchip').forEach(b=>b.onclick=()=>factSheet(+b.dataset.a,+b.dataset.b,b));
  animateMeters()})}
function factSheet(a,b,origin){
  const core=isCore(a,b),bx=ltBox(a,b),tm=S.tm[fkey(a,b)];
  openSheet(origin,`<div class="sheet-icon txt">${M(`${a}×${b}`)}</div><h3>${M(`${a} × ${b} = ${a*b}`)}</h3><div class="hintbox">💡 ${strat(a,b)}</div>${core?`<div class="meta-row"><span>📦 ${bx===undefined?'هنوز تمرین نشده':'جعبه‌ی '+fa(bx)}</span>${tm?`<span>⏱️ میانگین ${fa((tm/1000).toFixed(1))} ثانیه</span>`:''}</div>`:''}<div class="sheet-actions">${core?`<button class="btn block" id="fs1">🎯 تمرین این ضرب</button>`:''}<button class="btn ghost block" id="fs2">فهمیدم</button></div>`);
  if(core)$('#fs1').onclick=()=>{const rel=[[a,b]];range(2,9).filter(x=>x!==b).sort(()=>Math.random()-.5).slice(0,3).forEach(x=>rel.push([a,x]));startFocus(rel)};
  $('#fs2').onclick=()=>closeSheet();
}

/* ============ جدول من ============ */
function tableScreen(){go(()=>{setTab('table');cur='table';
  let h='<div class="h">×</div>';for(let c=1;c<=10;c++)h+=`<div class="h" style="animation-delay:${c*15}ms">${fa(c)}</div>`;
  for(let r=1;r<=10;r++){h+=`<div class="h" style="animation-delay:${r*15}ms">${fa(r)}</div>`;for(let c=1;c<=10;c++){let cls='easy';if(isCore(r,c)){const b=ltBox(r,c);cls=b===undefined?'new':'b'+b}h+=`<div class="${cls}" data-r="${r}" data-c="${c}" style="animation-delay:${(r+c)*18}ms">${fa(r*c)}</div>`}}
  app.innerHTML=`<section class="hello"><div class="eyebrow">نقشه‌ی حافظه‌ی تو 📊</div><h1>جدول ضرب من</h1><p class="mut">رنگ هر خونه نشون میده چقدر بلدیش. جدول نسبت به قطرش قرینه‌ست (جابه‌جایی!). روی هر خونه بزن تا ترفندش رو ببینی.</p></section>
  <div class="card"><div class="tbl">${h}</div><div class="legend"><span class="new">هنوز تمرین نشده</span><span class="b0">نیاز به تمرین</span><span class="b2">در حال یادگیری</span><span class="b3">خوب</span><span class="b5">مسلط 💪</span><span class="easy">آسون (×۱، ×۱۰)</span></div></div>`;
  $$('.tbl div[data-r]').forEach(el=>el.onclick=()=>factSheet(+el.dataset.r,+el.dataset.c,el))})}

const TABS=[['map','🗺️','مراحل',home],['review','🧠','مرور',reviewHub],['speed','⚡','سرعت',speedIntro],['table','📊','جدول',tableScreen]];

/* دکمه‌ی برگشت اندروید */
window.onAndroidBack=function(){
  if(sheetState){closeSheet();return 'handled'}
  if(cur==='home')return 'exit';
  if(cur==='quiz'||cur==='speedRun'){const x=$('#qx');if(x)x.click();return 'handled'}
  home();return 'handled';
};

/* ============ شروع ============ */
applyTheme();renderChrome();setTab('map');renderHome();
requestAnimationFrame(movePill);setTimeout(movePill,300);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(movePill);
