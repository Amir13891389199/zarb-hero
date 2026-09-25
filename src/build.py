import base64,os,re
D=os.path.dirname(os.path.abspath(__file__))
r=lambda f:open(os.path.join(D,f),encoding='utf-8').read()
font=base64.b64encode(open(os.path.join(D,'vazirmatn.woff2'),'rb').read()).decode()
css=r('style.css').replace('__FONT__',font)
js=r('app.js').replace('/*__STAGES__*/',r('stages.js'))
# اسپرایت آیکون‌ها (Lucide - ISC)
sid=lambda n:'i'+re.sub(r'\d',lambda m:'abcdefghij'[int(m.group())],n.replace('-','_'))
syms=[]
for f in sorted(os.listdir(os.path.join(D,'icons'))):
    t=r('icons/'+f);inner=re.search(r'<svg[^>]*>(.*)</svg>',t,re.S).group(1)
    inner=re.sub(r'\s+',' ',inner).replace(' />','/>').strip()
    syms.append(f'<symbol id="{sid(f[:-4])}" viewBox="0 0 24 24">{inner}</symbol>')
used=set(re.findall(r'href=#(i[a-z_]+)>',js))|{sid(n) for n in re.findall(r"(?:ic\(|icon:)'([a-z0-9-]+)'",js)}
have={re.search(r'id="([^"]+)"',s).group(1) for s in syms}
assert not (used-have), used-have
sprite='<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true"><!-- Lucide icons, ISC license -->'+''.join(syms)+'</svg>'
out=r('template.html').replace('/*__CSS__*/',css).replace('/*__JS__*/',js).replace('<!--__SPRITE__-->',sprite)
open(os.path.join(D,'..','index.html'),'w',encoding='utf-8').write(out)
print('built',len(out),'icons',len(syms))
