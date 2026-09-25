# یک‌بار اجرا: ایموجی‌ها -> آیکون‌های برداری (Lucide، مجوز ISC)
import re,sys
def I(name,c=None,fill=False):
    iid='i'+re.sub('[^a-z]','',name)
    cls='icf' if fill else 'ic'
    return f'<svg class={cls}{" data-c="+c if c else ""}><use href=#{iid}></use></svg>'
E={'🎉':('party-popper','pink'),'🌟':('sparkles','gold'),'💪':('biceps-flexed','orange'),'🔥':('flame','orange'),'👏':('thumbs-up','violet'),
'✨':('sparkles','violet'),'🧠':('brain','pink'),'🚀':('rocket','violet'),'🔄':('arrow-left-right','blue'),'🌓':('sun-moon',None),'☀':('sun','amber'),
'🌙':('moon','violet'),'🐢':('turtle',None),'🐇':('rabbit',None),'✓':('check',None),'🔊':('volume-2',None),'🔇':('volume-x',None),'⏸':('pause',None),
'🎖':('award','violet'),'🤔':('message-circle-question','violet'),'🌤':('cloud-sun','amber'),'🌇':('sunset','orange'),'👋':('hand','amber'),
'☕':('coffee','orange'),'🔁':('repeat','blue'),'🎯':('target','red'),'⚡':('zap','amber'),'🏆':('trophy','gold'),'📅':('calendar-days','violet'),
'🍽':('utensils','teal'),'👹':('swords','red'),'💡':('lightbulb','amber'),'📱':('smartphone',None),'🗑':('trash-2','red'),'📖':('book-open',None),
'✏':('pencil',None),'🔒':('lock',None),'⏭':('chevrons-left',None),'👆':('pointer',None),'⌫':('delete',None),'✔':('check',None),'✕':('x',None),
'🚪':('door-open','red'),'⏱':('timer','blue'),'🏁':('flag','green'),'✅':('circle-check','green'),'🏳':('flag','mut'),'👇':('arrow-down',None),
'📦':('package',None),'📊':('grid-3x3',None),'🗺':('map',None),'🍎':('apple','red'),'🟦':('square','blue'),'🎮':('gamepad-2','violet'),
'😎':('smile','amber'),'🎁':('gift','pink'),'✌':('copy','violet'),'🖐':('hand','amber'),'🍀':('clover','green'),'🪄':('wand-sparkles','violet'),
'✋':('hand','amber'),'🔍':('search','blue'),'🔺':('triangle','red'),'😉':('smile','amber'),'🎲':('dice-5','violet'),'🐙':('footprints','pink'),
'🌈':('rainbow','pink'),'🔢':('hash','blue'),'🎩':('wand-sparkles','violet'),'🔨':('hammer','orange'),'📝':('notebook-pen','blue'),
'⬅':('chevron-left',None),'🧩':('puzzle','teal'),'✍':('pen-line','blue'),'➕':('plus','green'),'➖':('minus','red'),'🔸':('diamond','orange')}
REMOVE={'🔟'}
def conv(s):
    s=s.replace('\ufe0f','').replace('\ufe0e','')
    s=s.replace('✋✋','✋')
    s=s.replace('⭐',I('star','gold',True)).replace('★',I('star',None,True))
    s=s.replace('▶',I('play'))
    for r in REMOVE: s=s.replace(' '+r,'').replace(r,'')
    for k,(n,c) in E.items(): s=s.replace(k,I(n,c))
    return s
p='app.js';a=open(p,encoding='utf-8').read()
# موارد دستی قبل از تبدیل
def rep(x,y,n=1):
    global a
    assert a.count(x)>=1,('missing',x[:60]);a=a.replace(x,y,n)
rep(".replace(/[💡✨🔁⚡🎉🌟💪🔥👏🧠🚀]/g,'')","")
rep("q('#xpchip').textContent=fa(S.xp)","q('#xpchip').textContent=fa(S.xp)")
rep("$('#thBtn').textContent=TICON[S.theme];$('#muBtn').textContent=S.mute?'🔇':'🔊'","$('#thBtn').innerHTML=TICON[S.theme];$('#muBtn').innerHTML=S.mute?'🔇':'🔊'")
rep("if(l)l.textContent=st==='idle'?el.dataset.l:NLBL[st]","if(l)l.innerHTML=st==='idle'?el.dataset.l:NLBL[st]")
rep("b.textContent=RATES[S.rate][1])","b.innerHTML=RATES[S.rate][1])")
rep("b.textContent=S.auto?'▶︎ خودکار':'خودکار'","b.innerHTML=S.auto?'▶︎ خودکار':'خودکار'")
rep("nb.textContent=last?'بزن بریم تمرین! 🚀':'بعدی ←'","nb.innerHTML=last?'بزن بریم تمرین! 🚀':'بعدی ⬅'")
rep('<span class="arrow">←</span>','<span class="arrow">⬅</span>')
rep('id="lback" aria-label="برگشت">→</button>','id="lback" aria-label="برگشت">'+I('chevron-right')+'</button>')
rep('id="lprev">→ قبلی</button>','id="lprev">'+I('chevron-right')+' قبلی</button>')
rep('id="lnext">بعدی ←</button>','id="lnext">بعدی ⬅</button>')
rep('id="cbtn">فهمیدم، ادامه ←</button>','id="cbtn">فهمیدم، ادامه ⬅</button>')
rep('id="ra1">مرحله‌ی بعد ←</button>','id="ra1">مرحله‌ی بعد ⬅</button>')
rep("toast('🔊 سرعت صدا: '","toast('🔊 سرعت صدا: '")
a=conv(a)
open(p,'w',encoding='utf-8').write(a)
p='stages.js';b=open(p,encoding='utf-8').read()
b=b.replace(".textContent=i<steps.length-1?'قدم بعدی ⬅️':'از اول 🔁'",".innerHTML=i<steps.length-1?'قدم بعدی ⬅️':'از اول 🔁'")
SI={'s1':'apple','s2':'arrow-left-right','s3':'target','s4':'#×۲','s5':'#×۵','s6':'#×۴','s7':'#×۹','s8':'#×۳','s9':'#×۶','s10':'#×۸','s11':'#×۷',
's12':'grid-3x3','s13':'#×۱۰','s14':'hammer','s15':'calculator','s16':'layout-grid','s17':'diff','s18':'decimals-arrow-right','s19':'swords'}
for k,v in SI.items():
    b,n=re.subn(r"\{id:'%s',icon:'[^']*'"%k,"{id:'%s',icon:'%s'"%(k,v),b);assert n==1,k
b=b.replace("sec:'🏁 نبرد نهایی'","sec:'نبرد نهایی'")
b=conv(b)
open(p,'w',encoding='utf-8').write(b)
left=re.compile('[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B50\u23F1\u23F8\u23ED\u232B\u2B05]')
for f,t in [('app.js',a),('stages.js',b)]:
    print(f,'left:',set(x for x in left.findall(t) if x not in '←→'))
