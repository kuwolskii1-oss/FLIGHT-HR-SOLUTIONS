import re, os
S=os.environ.get('S', '.')  # directory holding section*.md and section6_v2.md
R=lambda n: open(f'{S}/{n}').read()
steps=[('--step--2',12,13,'metadata labels (mono, uppercase, +0.06 em)'),('--step--1',14,15.5,'captions, table body, footer'),
       ('--step-0',17,19,'body copy'),('--step-1',17*1.2,19*1.333,'lead paragraphs, menu secondary links'),
       ('--step-2',17*1.2**2,19*1.333**2,'H3, ruled-row titles'),('--step-3',17*1.2**3,19*1.333**3,'H2, footer address, menu destinations'),
       ('--step-4',17*1.2**4,19*1.333**4,'H1 on inner pages'),('--step-5',17*1.2**5,19*1.333**5,'hero and closing statements'),
       ('--step-6',17*1.2**6,19*1.333**6,'section numerals'),('--step-display',56,148,'the one enormous step: key figures, single-word statements (≈10 % of a 1440 px viewport, the measured median)')]
rows=['| Token | 390 px | 1440 px | `clamp()` (root 16 px) | Use |','|---|---|---|---|---|']
for tok,mn,mx,use in steps:
    slope=(mx-mn)/(1440-390); icpt=mn-slope*390
    rows.append(f"| `{tok}` | {mn:.1f} px | {mx:.1f} px | `clamp({mn/16:.3f}rem, {icpt/16:.3f}rem + {slope*100:.3f}vw, {mx/16:.3f}rem)` | {use} |")
s8=R('section8.md').replace('<!-- TYPE-RAMP -->','\n'.join(rows))
g=R('section6_v2.md'); i1=g.index('\n### '); i2=g.index('### Cross-site aggregates')
table=g[:i1].strip()+'\n'; sheets=g[i1+1:i2].strip()+'\n'; agg=g[i2:].split('\n',1)[1].strip()+'\n'
body=(R('section6_intro.md').rstrip()+'\n\n'+table+R('section6_blocked.md')+sheets+R('section6_agg_intro.md')+agg+R('section6_reading.md')
      +'\n'+R('section7.md').rstrip()+'\n\n'+s8.rstrip()+'\n\n'+R('section9.md').rstrip()+'\n')
p='/home/user/FLIGHT-HR-SOLUTIONS/docs/research/08-locomotive-design-blueprint.md'; doc=open(p).read()
head=doc[:doc.index('## 6. Measured design data for the shortlist')] if '## 6. Measured design data' in doc else doc.replace('<!-- DATA-SHEETS -->','')
doc=head.rstrip()+'\n\n'+body
open(p,'w').write(doc)
print('words', len(doc.split()))
bad=0
for block in re.findall(r'((?:^\|.*\n?)+)', doc, re.M):
    ls=[l for l in block.strip().split('\n') if l.startswith('|')]; n=ls[0].count('|')
    bad+=sum(1 for l in ls if l.count('|')!=n)
refs=set(re.findall(r'([a-z0-9-]+-(?:desktop|mobile)-(?:fold|view2|menu|full)\.jpg)', doc))
print('mismatched table rows', bad, '| screenshot refs', len(refs), 'missing', [r for r in refs if not os.path.exists('/home/user/FLIGHT-HR-SOLUTIONS/docs/research/assets/locomotive/'+r)], '| markers', re.findall(r'<!--.*?-->', doc), '| h2 count', len(re.findall(r'^## ', doc, re.M)))
