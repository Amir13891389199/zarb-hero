import base64,os
D=os.path.dirname(os.path.abspath(__file__))
r=lambda f:open(os.path.join(D,f),encoding='utf-8').read()
font=base64.b64encode(open(os.path.join(D,'vazirmatn.woff2'),'rb').read()).decode()
css=r('style.css').replace('__FONT__',font)
js=r('app.js').replace('/*__STAGES__*/',r('stages.js'))
out=r('template.html').replace('/*__CSS__*/',css).replace('/*__JS__*/',js)
open(os.path.join(D,'..','index.html'),'w',encoding='utf-8').write(out)
print('built',len(out))
