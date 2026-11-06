"""Decode stored stream results (T, P, flows, H, S) from a .bkp with results.
Source: analysis/data/Memb-Integration-1_results_2026-11-06.bkp = COM run of the current files/Memb-Integration-1.bkp
(after C1/C2), saved only for its results; it is not the model (COM SaveAs drops a MEMB1 spec). Read-only."""
import re,json
names="WATER GLYCEROL OLEICACI DEXTROSE ACETI-AC PROPI-01 ISOBU-01 ISOVA-01 H+ OH- NH3 NH4+ CO2 C5H7NO2 ARGININE LYSINE TYROSINE TRYPTOPH PHENYLAL CYSTEINE METHIONI THREONIN SERINE LEUCINE ISOLEUCI VALINE GLUTAMIC ASPARTIC GLYCINE ALANINE PROLINE HYDROGEN METHANE INDOLE FROMAMID H2S CH4S BENZENE PHENOL H2CO3 HCO3- CO3-2 HS- CELLULOS HEMECELL GLUCOSE TRIOLEIN TRIPALM PALM SN-1--01 SN-1--02 XYLOSE FURFURAL LINOLEIC STARCH ETHANOL PROT KERATIN ACETATE INERT CO CARBON".split()
import os
BKP=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','data','Memb-Integration-1_results_2026-11-06.bkp')
L=open(BKP,errors='replace').read().replace('\r','').split('\n')
def grab(i):
    buf=L[i].split('(',1)[1]; j=i+1
    while not L[j].startswith(' DSET') and j<len(L):
        buf+=' '+L[j]; j+=1
        if buf.rstrip().endswith(')'): break
    return buf.rstrip().rstrip(')')
def expand(buf):
    out=[]
    for t in buf.split():
        m=re.fullmatch(r'<(\d+)>',t)
        if m: out+=[out[-1]]*(int(m.group(1))-1); continue
        try: out.append(float(t.replace('D','E')))
        except: out.append(t)
    return out
S={}
for i,l in enumerate(L):
    m=re.match(r' DSET STREAM MATERIAL ("[^"]+"|\S+) (STR_MAIN|RES_STR) ',l)
    if m:
        nm=m.group(1).strip('"'); S.setdefault(nm,{})[m.group(2)]=expand(grab(i))

# --- component mole flows are stored as triplets; their sum equals F
out={}
for nm,d in S.items():
    if 'RES_STR' not in d or 'STR_MAIN' not in d: continue
    r=d['RES_STR']
    F=r[19] if len(r)>19 and isinstance(r[19],float) else 0.0
    v=[x if isinstance(x,float) else None for x in d['STR_MAIN']]
    flows=None
    if F>0:
        for k in range(len(v)-186):
            w=[v[k+3*i] for i in range(62)]
            if None in w: continue
            if all(v[k+3*i]==v[k+3*i+1]==v[k+3*i+2] for i in range(62)) and abs(sum(w)-F)<1e-6*max(1,F):
                flows=w; break
    h=[x for x in d['STR_MAIN'][:2] if isinstance(x,str)]
    out[nm]=dict(src=(h[0] if h and h[0]!='*' else ''),dst=(h[1] if len(h)>1 and h[1]!='*' else ''),T=r[0],P=r[4],mass=r[9],F=F,vf=(r[22] if len(r)>22 else None),
                 n=(dict((a,b) for a,b in zip(names,flows) if b>1e-12) if flows else {}))

# enthalpy (kcal/mol) and entropy (cal/mol-K) of the MIXED substream, formation basis
for nm,s in out.items():
    v=S[nm]['STR_MAIN']; r=S[nm]['RES_STR']; T,P=r[0],r[4]; s['H']=s['S']=None
    for k in range(len(v)-40):
        if v[k:k+4]==[T]*4 and v[k+4:k+9]==[P]*5:
            s['H']=v[k+12]; j=k+20
            while v[j]==v[k+20]: j+=1
            s['S']=v[j]; break
