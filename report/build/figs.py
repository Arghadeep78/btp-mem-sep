import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
G,M,O,B,GR,D,RD='#2D6A4F','#74A57F','#E07A1F','#3A7CA5','#9AA5A0','#1B4332','#B23A48'
# Report figures are drawn at their printed size (inches) so 1 pt here = 1 pt on the page:
# Chart text should LOOK 1 pt above the 12 pt body text. Matplotlib renders Times ~5 % larger than Word does (measured
# on a report screenshot, 2026-11-06), so FS=12.4 gives ~13 pt as seen next to the body text. Diagram headings FS+1.
FS=12.4
plt.rcParams.update({'font.family':'serif','font.serif':['Times New Roman','Times','DejaVu Serif'],'mathtext.fontset':'stix',
  'font.size':FS,'axes.labelsize':FS,'xtick.labelsize':FS,'ytick.labelsize':FS,'legend.fontsize':FS,
  'axes.spines.top':False,'axes.spines.right':False})
def save(f,n): f.tight_layout(pad=0.3); f.savefig(f'fig/{n}.png',dpi=300); plt.close(f)
# 1 block flow diagram
f,ax=plt.subplots(figsize=(10,4.2)); ax.set_xlim(0,10); ax.set_ylim(0,4.2); ax.axis('off')
def box(x,y,w,h,t,c):
    ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle='round,pad=0.02,rounding_size=0.08',fc=c,ec=c)); ax.text(x+w/2,y+h/2,t,ha='center',va='center',color='white',fontsize=8.5,fontweight='bold')
def ar(x1,y1,x2,y2): ax.annotate('',xy=(x2,y2),xytext=(x1,y1),arrowprops=dict(arrowstyle='-|>',color='#5E6B66',lw=1.2))
def lb(x,y,t,ha='center'): ax.text(x,y,t,ha=ha,va='center',fontsize=7.5,color='#5E6B66')
r1=3.0; h=0.65
box(0.1,r1,1.6,h,'Mix + hydrolysis\nRSTOIC, 55 °C',G); box(2.1,r1,1.6,h,'Digester B1\nRCSTR, 55 °C, 15 d',G)
box(4.1,r1,1.5,h,'Gas cleanup\nflash, H$_2$S, NH$_3$',M); box(6.0,r1,1.7,h,'2-stage compression\n1 → 10 bar, 30 °C',B); box(8.1,r1,1.8,h,'Zeolite membrane\nMEMB1 (ACM)',B)
for a,b in [(1.7,2.1),(3.7,4.1),(5.6,6.0),(7.7,8.1)]: ar(a,r1+h/2,b,r1+h/2)
lb(0.9,3.95,'Biomass 8.5 t/d + water 13 t/d'); ar(0.9,3.85,0.9,r1+h)
ar(2.9,r1,2.9,2.45); lb(2.9,2.32,'Digestate ≈ 820 kg/h'); ar(4.85,r1,4.85,2.45); lb(4.85,2.32,'Water, H$_2$S, NH$_3$')
ar(8.6,r1,8.6,2.45); lb(8.6,2.25,'Permeate 1 bar\n92 % CO$_2$'); ar(9.6,r1,9.6,1.4); lb(9.5,1.65,'Retentate\n10 bar, 76 % CH$_4$','right')
r2=0.75
box(8.1,r2,1.8,h,'Letdown to 1 bar\nFLASH3',GR); box(6.0,r2,1.7,h,'Preheat to 790 °C\nHEAT2',O); box(3.7,r2,1.9,h,'CH$_4$ pyrolysis\nCH4PYRO, 790 °C',O); box(1.4,r2,1.9,h,'Product\nH$_2$ + CO + solid C',D)
for a,b in [(8.1,7.7),(6.0,5.6),(3.7,3.3)]: ar(a,r2+h/2,b,r2+h/2)
lb(2.35,0.45,'H$_2$ 4.46 kg/h, carbon 15.4 kg/h')
save(f,'fig1_pfd')
# 2 membrane compositions
f,ax=plt.subplots(figsize=(4.2,3.0)); lab=['Feed\n(10 bar)','Retentate\n(10 bar)','Permeate\n(1 bar)']; ch=[59.4,76.4,7.0]; co=[40.3,23.4,92.2]
ax.bar(lab,ch,color=G,label='CH$_4$'); ax.bar(lab,co,bottom=ch,color=GR,label='CO$_2$')
for i in range(3):
    if ch[i]>12: ax.text(i,ch[i]/2,f'{ch[i]:.1f}',ha='center',va='center',color='white')
    ax.text(i,ch[i]+co[i]/2,f'{co[i]:.1f}',ha='center',va='center',color='white')
ax.text(2,ch[2]+1.5,'7.0',ha='center',va='bottom',color='#1E2B26')
ax.set_ylabel('mol %'); ax.set_ylim(0,100); ax.legend(frameon=False,loc='lower center',ncol=2,bbox_to_anchor=(0.5,1.0)); save(f,'fig2_membrane')
# 3 energy
f,ax=plt.subplots(figsize=(5.6,2.8)); u=['CH4PYRO reactor','RSTOIC (feed heating)','HEAT2 preheat','Compressors (electricity)','B1 digester']; v=[35.4,24.7,20.4,5.7,3.5]; c=[O,G,O,B,G]
ax.barh(u[::-1],v[::-1],color=c[::-1]); [ax.text(x+0.5,i,f'{x:.1f}',va='center') for i,x in enumerate(v[::-1])]; ax.set_xlim(0,41); ax.set_xlabel('kW'); save(f,'fig3_energy')
# 4 exergy per unit
f,ax=plt.subplots(figsize=(5.4,3.7)); u=['RSTOIC','B1 digester','CH4PYRO','HEAT2','FLASH3 letdown','Compressors','Coolers','MEMB1','Other']; v=[39.1,22.5,6.3,4.6,2.8,1.1,0.9,0.6,0.3]; c=[G,G,O,O,GR,B,B,B,GR]
ax.barh(u[::-1],v[::-1],color=c[::-1]); [ax.text(x+0.4,i,f'{x:.1f}',va='center') for i,x in enumerate(v[::-1])]; ax.set_xlim(0,45); ax.set_xlabel('Exergy destroyed (kW)'); save(f,'fig4_exergy_units')
# 5 exergy overall
f,ax=plt.subplots(figsize=(6.2,2.1)); parts=[('Product',348,G),('Lost: digestate',191,O),('Lost: permeate + purges',30,GR),('Destroyed',78,RD)]; x=0
for n,val,c in parts:
    ax.barh([0],[val],left=x,color=c,label=f'{n} ({val} kW)')
    if val>50: ax.text(x+val/2,0,str(val),ha='center',va='center',color='white',fontweight='bold')
    x+=val
ax.set_yticks([]); ax.set_xlabel('kW (total exergy in = 647 kW)'); ax.legend(frameon=False,ncol=2,loc='lower center',bbox_to_anchor=(0.5,1.0)); save(f,'fig5_exergy_overall')
# 6 CO2
import numpy as np
f,ax=plt.subplots(figsize=(5.6,3.2)); cases=['Natural gas heat','Electric heat','Heat-integrated']; d={'India grid':[5.60,14.73,2.10],'Coal power':[5.90,19.47,2.40],'Hydro / solar':[4.67,0.08,1.17]}
x=np.arange(3); w=0.27
for i,(k,vals) in enumerate(d.items()):
    ax.bar(x+(i-1)*w,vals,w,label=k,color=[GR,'#1E2B26',M][i]); [ax.text(xx+(i-1)*w,vv+0.35,f'{vv:.1f}',ha='center',fontsize=FS-1,bbox=dict(fc='white',ec='none',pad=0.4)) for xx,vv in zip(x,vals)]
ax.axhline(2.0,color=RD,ls='--',lw=1,label='Green H$_2$ limit (2.0)')
ax.set_ylim(0,22); ax.set_xticks(x); ax.set_xticklabels(cases); ax.set_ylabel('kg CO$_2$e per kg H$_2$'); ax.legend(frameon=False,ncol=2,loc='lower center',bbox_to_anchor=(0.5,1.0)); save(f,'fig6_co2')
# 7 heat integration
f,ax=plt.subplots(figsize=(4.0,3.1)); ax.bar(['Now','Heat-integrated'],[28.2,4.4],color=G,label='Low-T heat (55 °C)'); ax.bar(['Now','Heat-integrated'],[55.9,15.3],bottom=[28.2,4.4],color=O,label='High-T heat (790 °C)')
ax.text(0,84.1+2,'84.1',ha='center'); ax.text(1,19.7+2,'19.8',ha='center'); ax.set_ylabel('External heat (kW)'); ax.set_ylim(0,95); ax.legend(frameon=False,loc='lower center',bbox_to_anchor=(0.5,1.0)); save(f,'fig7_heatint')
# 9 ACM module structure
f,ax=plt.subplots(figsize=(6.25,3.0)); ax.set_xlim(0,6.25); ax.set_ylim(0,3.0); ax.axis('off')
ax.add_patch(FancyBboxPatch((0.75,1.05),1.75,1.1,boxstyle='round,pad=0.02,rounding_size=0.08',fc=B,ec=B))
ax.text(1.625,1.8,'MEMB1',ha='center',va='center',color='white',fontsize=FS+1,fontweight='bold'); ax.text(1.625,1.4,'Zeo_real (ACM)',ha='center',va='center',color='white')
def ar9(x1,y1,x2,y2): ax.annotate('',xy=(x2,y2),xytext=(x1,y1),arrowprops=dict(arrowstyle='-|>',color='#1E2B26',lw=1.4))
def lb9(x,y,t): ax.text(x,y,t,ha='center',va='center',color='#1E2B26')
ar9(0.0,1.6,0.75,1.6); lb9(0.37,2.05,'Feed\n10 bar')
ar9(2.5,1.6,3.38,1.6); lb9(3.0,2.05,'Retentate\n10 bar')
ar9(1.625,1.05,1.625,0.2); lb9(2.2,0.5,'Permeate\n1 bar')
ax.plot([3.48,3.48],[0.15,2.9],color='#C9D3CD',lw=1)
eq=['For every component i:','  F z$_i$ = R x$_i$ + V y$_i$','For CO$_2$, H$_2$, CH$_4$:','  V y$_i$ = $\\Pi_i$ A (p$_F$ x$_i$ $-$ p$_P$ y$_i$)','Other species: V y$_i$ = 0','T$_R$ = T$_P$ = T$_F$;  p$_R$ = p$_F$ $-$ $\\Delta$p','h from Aspen property calls']
for k,t in enumerate(eq): ax.text(3.58,2.72-k*0.4,t,va='center',color='#1E2B26',fontweight='bold' if k in (0,2) else 'normal')
f.tight_layout(pad=0.2); f.savefig('fig/fig9_acm.png',dpi=300); plt.close(f)
# 8 feed-pressure sensitivity (Aspen COM run 2026-11-06; analysis/data/sensitivity_feed_pressure_2026-11-06.csv)
# 6.25 x 2.36 in keeps the aspect ratio the deck uses (5.9 x 2.23 in).
P=[4, 6, 8, 10, 12, 15]; pur=[64.30,69.18,73.19,76.43,79.05,82.13]; rec=[99.03,98.41,97.75,97.05,96.34,95.24]; W=[3.240,4.293,5.068,5.685,6.200,6.844]; h2=[2.0754,2.1380,2.1815,2.2100,2.2278,2.2403]
f,(a1,a2)=plt.subplots(1,2,figsize=(6.25,2.36))
a1.plot(P,pur,'o-',color=G,ms=4,label='CH$_4$ purity'); a1.plot(P,rec,'s-',color=B,ms=4,label='CH$_4$ recovery'); a1.set_xlabel('Feed pressure (bar)'); a1.set_ylabel('%'); a1.axvline(10,color=GR,ls='--',lw=1); a1.legend(frameon=False,loc='upper left',bbox_to_anchor=(0.0,0.88),handlelength=1.0,borderaxespad=0.2)
a2.plot(P,[x*2.01588 for x in h2],'o-',color=G,ms=4); a2.set_xlabel('Feed pressure (bar)'); a2.set_ylabel('H$_2$ (kg/h)',color=G)
a3=a2.twinx(); a3.spines['right'].set_visible(True); a3.plot(P,W,'s-',color=O,ms=4); a3.set_ylabel('Power (kW)',color=O); a2.axvline(10,color=GR,ls='--',lw=1)
save(f,'fig8_sensitivity')
print('done')
