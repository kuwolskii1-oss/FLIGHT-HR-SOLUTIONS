import re, json, sys, subprocess, html
from urllib.parse import urljoin, urlparse
from collections import Counter
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
def get(u, maxtime=40):
    r=subprocess.run(['curl','-sS','-L','--compressed','--max-time',str(maxtime),'-A',UA,'-o','-','-w','\n%{http_code} %{url_effective} %{content_type}',u],capture_output=True)
    out=r.stdout; 
    try: body,meta=out.rsplit(b'\n',1)
    except ValueError: return '', '000', u, ''
    parts=meta.decode(errors='replace').split(' ',2); code=parts[0]; final=parts[1] if len(parts)>1 else u; ct=parts[2] if len(parts)>2 else ''
    return body.decode('utf-8','replace'), code, final, ct
sites=[l.split() for l in open(sys.argv[1]) if l.strip()]
results={}
for label,url in sites:
    h,code,final,ct=get(url)
    rec={'label':label,'url':url,'final':final,'status':code,'contentType':ct,'htmlBytes':len(h)}
    if code!='200' or len(h)<500: rec['error']='document not retrievable via curl'; results[label]=rec; print(label,'FAIL',code,final); continue
    origin='{u.scheme}://{u.netloc}'.format(u=urlparse(final))
    t=re.search(r'<title>([^<]*)',h); rec['title']=html.unescape(t.group(1).strip()) if t else None
    d=re.search(r'name="description"\s+content="([^"]*)"',h); rec['description']=html.unescape(d.group(1)) if d else None
    g=re.search(r'name="generator"\s+content="([^"]*)"',h); rec['generator']=g.group(1) if g else None
    rec['lang']=(re.search(r'<html[^>]*\blang="([^"]*)"',h) or [None,None])[1]
    css_links=[urljoin(final,m) for m in re.findall(r'<link[^>]+rel=["\']?stylesheet["\']?[^>]*href=["\']([^"\']+)',h)+re.findall(r'<link[^>]+href=["\']([^"\']+)["\'][^>]*rel=["\']?stylesheet',h)]
    inline_css=' '.join(re.findall(r'<style[^>]*>(.*?)</style>',h,re.S))
    css=inline_css
    fetched=[]
    for u in css_links[:6]:
        b,c,f,ctype=get(u)
        if c=='200': css+='\n'+b; fetched.append((u.split('/')[-1][:50],len(b)))
    rec['cssFiles']=fetched
    faces=[]
    for m in re.finditer(r'@font-face\s*\{([^}]*)\}',css):
        fam=re.search(r'font-family:\s*([^;]+)',m.group(1)); w=re.search(r'font-weight:\s*([^;]+)',m.group(1))
        if fam: faces.append((fam.group(1).strip().strip('"\''),w.group(1).strip() if w else ''))
    rec['fontFaces']=sorted(set(faces))
    fams=Counter(x.strip().strip('"\'') for m in re.findall(r'font-family:\s*([^;}]+)',css) for x in [m.split(',')[0]])
    rec['fontFamilyDecls']=fams.most_common(6)
    rootvars={}
    for r in re.findall(r':root\s*\{([^}]*)\}',css):
        for m in re.finditer(r'(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);',r): rootvars.setdefault(m.group(1),m.group(2).strip()[:60])
    rec['rootVarCount']=len(rootvars); rec['rootVarsSample']={k:v for k,v in list(rootvars.items()) if re.search(r'color|font|space|ease|duration|radius|grid|container|size|scale|lh|line|letter',k,re.I)}
    rec['rootVarsSample']=dict(list(rec['rootVarsSample'].items())[:50])
    rec['fontSizeDecls']=Counter(m.strip() for m in re.findall(r'font-size:\s*([^;}]+)',css)).most_common(12)
    rec['clamp']=css.count('clamp('); rec['vwUnits']=len(re.findall(r'\d(vw|svw|dvw|cqw)',css))
    rec['media']=Counter(m.strip() for m in re.findall(r'@media\s*([^{]+)\{',css)).most_common(10)
    trans=' '.join(re.findall(r'transition[^;}]*',css))
    rec['durations']=Counter(re.findall(r'(\d*\.?\d+m?s)\b',trans)).most_common(8)
    rec['easings']=Counter(re.findall(r'cubic-bezier\([^)]*\)',css)).most_common(6)
    rec['hexColors']=Counter(c.upper() for c in re.findall(r'#(?:[0-9a-fA-F]{3}){1,2}\b',css)).most_common(12)
    rec['maxWidths']=Counter(m.strip() for m in re.findall(r'max-width:\s*([^;}]+)',css) if 'px' in m or 'rem' in m).most_common(6)
    rec['keyframes']=len(re.findall(r'@keyframes',css)); rec['letterSpacing']=Counter(m.strip() for m in re.findall(r'letter-spacing:\s*([^;}]+)',css)).most_common(5); rec['textTransformUpper']=len(re.findall(r'text-transform:\s*uppercase',css))
    scripts=[urljoin(final,m) for m in re.findall(r'<script[^>]+src=["\']([^"\']+)',h)]
    rec['scriptHosts']=sorted(set(urlparse(s).netloc for s in scripts))
    sig=Counter(); checked=0
    pats={'gsap':r'gsap|greensock','ScrollTrigger':r'ScrollTrigger','Lenis':r'[Ll]enis','LocomotiveScroll':r'locomotive-scroll|LocomotiveScroll','three':r'WebGLRenderer|three\.module|THREE\.','ogl':r'\bOGL\b|ogl','barba':r'barba','swup':r'[Ss]wup','taxi':r'@unseenco/taxi','Splitting':r'Splitting','SplitText':r'SplitText','lottie':r'lottie|bodymovin','PIXI':r'PIXI','framer-motion':r'framer-motion','alpine':r'Alpine','vue':r'__vue|Vue\.','react':r'react-dom|__reactFiber','svelte':r'svelte','astro':r'astro','swiper':r'Swiper','glsl':r'gl_FragColor|precision (high|medium)p float','reducedMotion':r'prefers-reduced-motion','IntersectionObserver':r'IntersectionObserver'}
    for s in scripts:
        if urlparse(s).netloc!=urlparse(final).netloc and not re.search(r'_nuxt|_next|_astro|assets|static|bundle|chunk',s): continue
        b,c,f,ctype=get(s,30)
        if c!='200': continue
        checked+=1
        for k,p in pats.items():
            if re.search(p,b): sig[k]+=1
        if checked>=8: break
    rec['scriptSignatures']=dict(sig); rec['scriptsChecked']=checked
    rec['hints']={k:len(re.findall(k,h)) for k in ['_astro','_nuxt','_next','wp-content','cpresources','Shopify','webflow','contentful','data-scroll','data-swup','data-barba','data-taxi','lenis','hs-scripts','gtag','recaptcha'] if re.search(k,h)}
    rec['h1']=[html.unescape(re.sub(r'<[^>]+>','',x)).strip()[:120] for x in re.findall(r'<h1[^>]*>(.*?)</h1>',h,re.S)][:3]
    rec['navLinks']=[html.unescape(re.sub(r'<[^>]+>','',x)).strip()[:30] for x in re.findall(r'<nav.*?</nav>',h,re.S)[:1] for x in re.findall(r'<a[^>]*>(.*?)</a>',x,re.S)][:14]
    rec['images']=len(re.findall(r'<img',h)); rec['videos']=len(re.findall(r'<video',h)); rec['canvas']=len(re.findall(r'<canvas',h))
    results[label]=rec; print(label,'ok',code,final,'| css files',len(fetched),'| faces',rec['fontFaces'][:6],'| sigs',dict(sig))
json.dump(results,open(sys.argv[2],'w'),indent=1)
