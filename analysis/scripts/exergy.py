"""Exergy analysis per unit and overall, from the stream results stored in the .bkp. Run: python3 exergy.py"""
import re,math
T0=298.15; R=8.314462
KCAL=4.184
from bkp_streams import out as d
# --- fixes for streams Aspen did not store fully
d['METH.RET']['S']=d['METH.PROD4']['S']-1.98720*math.log(10.0/1.0)   # ideal gas, same comp/T, 10 bar vs 1 bar
fin=d['METH.FINPROD']; nC=1.2908
fin['F']=fin['F']-nC                                    # MIXED substream only
fin['n']={'HYDROGEN':2.1907,'CO':0.3945,'WATER':0.3945,'METHANE':0.00003}
fin['carbon']=nC
# graphite (CISOLID) at T: H=int cp dT, S=int cp/T dT from 298.15 (formation basis, element reference)
def graphite(T):
    A,B,D=1.771,0.771e-3,-0.867e5     # Cp/R, Smith-Van Ness-Abbott Table C.2
    H=R*(A*(T-T0)+B/2*(T*T-T0*T0)-D*(1/T-1/T0))/1000      # kJ/mol
    S=R*(A*math.log(T/T0)+B*(T-T0)+D/2*(1/T**2-1/T0**2))  # J/mol-K
    return H,S
# --- elemental formulas
form={'WATER':'H2O','GLYCEROL':'C3H8O3','OLEICACI':'C18H34O2','DEXTROSE':'C6H12O6','ACETI-AC':'C2H4O2','PROPI-01':'C3H6O2',
'ISOBU-01':'C4H8O2','ISOVA-01':'C5H10O2','NH3':'NH3','NH4+':'NH3','CO2':'CO2','C5H7NO2':'C5H7NO2','ARGININE':'C6H14N4O2',
'LYSINE':'C6H14N2O2','TYROSINE':'C9H11NO3','TRYPTOPH':'C11H12N2O2','PHENYLAL':'C9H11NO2','CYSTEINE':'C3H6NO2S','METHIONI':'C5H11NO2S',
'THREONIN':'C4H9NO3','SERINE':'C3H7NO3','LEUCINE':'C6H13NO2','ISOLEUCI':'C6H13NO2','VALINE':'C5H11NO2','GLUTAMIC':'C5H9NO4',
'ASPARTIC':'C4H7NO4','GLYCINE':'C2H5NO2','ALANINE':'C3H7NO2','PROLINE':'C5H9NO2','HYDROGEN':'H2','METHANE':'CH4','INDOLE':'C8H7N',
'FROMAMID':'CH3NO','H2S':'H2S','CH4S':'CH4S','BENZENE':'C6H6','PHENOL':'C6H6O','H2CO3':'H2CO3','CELLULOS':'C6H10O5','HEMECELL':'C5H8O4',
'GLUCOSE':'C6H12O6','TRIOLEIN':'C57H104O6','TRIPALM':'C51H98O6','PALM':'C16H32O2','SN-1--01':'C37H70O5','SN-1--02':'C37H68O5',
'XYLOSE':'C5H10O5','FURFURAL':'C5H4O2','LINOLEIC':'C18H32O2','STARCH':'C6H10O5','ETHANOL':'C2H6O','CO':'CO','CARBON':'C',
'PROT':'C13H25O7N3S'}   # PROT from RSTOIC rxn 12 (element balance; MW 367.4 = Aspen MW 367.42)
def parse(f):
    c={}
    for el,k in re.findall(r'([A-Z][a-z]?)(\d*)',f): c[el]=c.get(el,0)+(int(k) if k else 1)
    return c
EL={k:parse(v) for k,v in form.items()}
# KERATIN from RSTOIC rxn 13: KERATIN + 0.3337 H2O -> amino acids
ker={'ARGININE':.045,'ASPARTIC':.048,'THREONIN':.047,'SERINE':.172,'GLUTAMIC':.074,'PROLINE':.111,'GLYCINE':.25,'ALANINE':.047,
'CYSTEINE':.067,'VALINE':.074,'LEUCINE':.07,'ISOLEUCI':.046,'PHENYLAL':.036}
k={}
for a,nu in ker.items():
    for el,c in EL[a].items(): k[el]=k.get(el,0)+nu*c
for el,c in EL['WATER'].items(): k[el]-=0.3337*c
EL['KERATIN']=k
MW={'C':12.011,'H':1.008,'O':15.999,'N':14.007,'S':32.06}
# standard chemical exergy of the elements, Szargut (1989), kJ/mol of element atom
exel={'C':410.26,'H':236.09/2,'O':3.97/2,'N':0.72/2,'S':609.6}
def elem_ex(n):
    e=0
    for c,f in n.items():
        if c=='INERT' or c in ('H+','OH-','HCO3-','CO3-2','HS-','ACETATE') and f<1e-9: continue   # ash-like, no element data; passes every unit unchanged
        e+=f*sum(cnt*exel[el] for el,cnt in EL[c].items())
    return e   # kmol/h * kJ/mol
def Ex(nm):
    s=d[nm]
    if not s['F'] or s.get('H') in (None,'*'): return 0.0
    B=s['F']*(s['H']*KCAL - T0*s['S']*KCAL/1000)          # kmol/h * kJ/mol
    n={c:v for c,v in s['n'].items() if c!='INERT'}
    if 'INERT' in s['n']:
        pass
    e=B+elem_ex(n)
    if s.get('carbon'):
        H,Sc=graphite(s['T']+273.15); e+=s['carbon']*(H-T0*Sc/1000+410.26)
    return e/3.6   # kW
def Hk(nm):
    s=d[nm]
    if not s['F'] or s.get('H') in (None,'*'): return 0.0
    h=s['F']*s['H']*KCAL
    if s.get('carbon'): h+=s['carbon']*graphite(s['T']+273.15)[0]
    return h/3.6
# INERT: B of its own is in the stream B; remove it consistently: not separable -> it cancels in every unit (no reaction).
blocks=[  # name, inlets, outlets, Q (kW, + = heat in), W (kW), heat-source/sink T (C), area
('MIX1',['BIOMASS','WATERIN'],['FEED'],0,0,None,'Digestion'),
('RSTOIC',['FEED'],['5'],25.036,0,90,'Digestion'),
('B1 digester',['5'],['BIOGAS','LIQUID'],3.428,0,90,'Digestion'),
('FLASH',['BIOGAS'],['GAS','H2O1'],-5.297,0,25,'Gas cleanup'),
('H2S-SEP',['GAS'],['GAS2','H2S'],None,0,25,'Gas cleanup'),
('NH3SEP',['GAS2'],['GAS3','NH3'],None,0,25,'Gas cleanup'),
('COMP1',['METH.GAS2'],['METH.C1OUT'],0,2.710,None,'Compression'),
('COOL1',['METH.C1OUT'],['METH.K1OUT'],-2.596,0,25,'Compression'),
('COMP2',['METH.K1OUT'],['METH.C2OUT'],0,2.758,None,'Compression'),
('COOL2',['METH.C2OUT'],['METH.GAS2C'],-2.758,0,25,'Compression'),
('MEMB1',['METH.GAS2C'],['METH.RET','METH.PER'],None,0,25,'Membrane'),
('FLASH3 (10 to 1 bar)',['METH.RET'],['METH.PROD4'],None,0,25,'Membrane'),
('HEAT2',['METH.PROD4'],['METH.PYROIN'],19.385,0,1000,'Pyrolysis'),
('CH4PYRO',['METH.PYROIN'],['METH.FINPROD'],None,0,1000,'Pyrolysis'),
]
rows=[]
for nm,i,o,Q,W,Ts,area in blocks:
    dH=sum(Hk(x) for x in o)-sum(Hk(x) for x in i)
    Qbal=dH-W
    Quse=Qbal if Q is None else Q
    exQ=0.0
    if Quse>0 and Ts is not None: exQ=Quse*(1-T0/(Ts+273.15))
    # heat rejected to cooling water at T0 carries no exergy (counted as destroyed/lost in the unit)
    exin=sum(Ex(x) for x in i); exout=sum(Ex(x) for x in o)
    D=exin+exQ+W-exout
    rows.append(dict(block=nm,area=area,Q_aspen=Q,Q_balance=round(Qbal,3),W=W,ExQ=exQ,Ex_in=exin,Ex_out=exout,Ex_dest=D))
tot=sum(r['Ex_dest'] for r in rows)
print(f"{'block':22s}{'Q aspen':>9s}{'Q bal':>9s}{'W':>6s}{'ExQ':>8s}{'Ex in':>10s}{'Ex out':>10s}{'Ex dest':>9s}{'share':>7s}")
for r in rows:
    print(f"{r['block']:22s}{(r['Q_aspen'] if r['Q_aspen'] is not None else float('nan')):9.3f}{r['Q_balance']:9.3f}{r['W']:6.2f}{r['ExQ']:8.2f}{r['Ex_in']:10.2f}{r['Ex_out']:10.2f}{r['Ex_dest']:9.3f}{100*r['Ex_dest']/tot:6.1f}%")
print('total destroyed',round(tot,2))
for nm in d:
    if d[nm]['F']: print('EX',nm,round(Ex(nm),3))

# ---------------- overall balance (2026-10-06 stored run)
exch={'HYDROGEN':236.09,'CO':275.10,'WATER':9.50,'METHANE':831.65,'CO2':19.87}
n=fin['n']; Fg=sum(n.values())
ch_gas=sum(v*exch[c] for c,v in n.items())+Fg*R*T0/1000*sum((v/Fg)*math.log(v/Fg) for v in n.values() if v>0)
ch_fin=(ch_gas+nC*410.26)/3.6
phys_fin=Ex('METH.FINPROD')-ch_fin
ExQ_in=sum(r['ExQ'] for r in rows); W=2.710+2.758; Q_in=sum((r['Q_aspen'] if r['Q_aspen'] is not None else r['Q_balance']) for r in rows if (r['Q_aspen'] or r['Q_balance'])>0.5)
inp=Ex('BIOMASS')+Ex('WATERIN')+W+ExQ_in
out_p=Ex('METH.FINPROD')
lost={k:Ex(k) for k in ['LIQUID','METH.PER','H2S','NH3','H2O1']}
print('\nINPUT  biomass %.1f water %.1f elec %.2f heat-exergy %.2f (heat energy %.1f kW) = %.1f kW'%(Ex('BIOMASS'),Ex('WATERIN'),W,ExQ_in,Q_in,inp))
print('PRODUCT FINPROD %.1f  (H2 %.1f, C %.1f, CO %.1f, physical/hot %.1f)'%(out_p,2.1907*236.09/3.6,nC*410.26/3.6,.3945*275.1/3.6,phys_fin))
print('LOST STREAMS',{k:round(v,1) for k,v in lost.items()},'sum %.1f'%sum(lost.values()))
print('DESTROYED %.1f ; check in-out-lost %.1f'%(tot,inp-out_p-sum(lost.values())))
print('eff H2 only %.1f%%, H2+C %.1f%%, H2+C+CO %.1f%%, all FINPROD %.1f%%'%(100*2.1907*236.09/3.6/inp,100*(2.1907*236.09+nC*410.26)/3.6/inp,100*(2.1907*236.09+nC*410.26+.3945*275.1)/3.6/inp,100*out_p/inp))
# heat available in hot product (790 C -> 30 C), energy
dHfin=Hk('METH.FINPROD')
# product cooled to 30C: recompute enthalpy with same comp ideal gas cp (SVNA) + graphite
cpR={'HYDROGEN':(3.249,0.422e-3,0,0.083e5),'CO':(3.376,0.557e-3,0,-0.031e5),'WATER':(3.470,1.450e-3,0,0.121e5),'METHANE':(1.702,9.081e-3,-2.164e-6,0)}
def dh(c,T1,T2):
    A,B,C,D=cpR[c]; return R*(A*(T2-T1)+B/2*(T2**2-T1**2)+C/3*(T2**3-T1**3)-D*(1/T2-1/T1))/1000
Qhot=(sum(v*dh(c,303.15,1063.15) for c,v in n.items())+nC*(graphite(1063.15)[0]-graphite(303.15)[0]))/3.6
print('Sensible heat in hot product 790->30 C: %.1f kW (HEAT2 needs 19.4 kW)'%Qhot)
area={}
for r in rows: area[r['area']]=area.get(r['area'],0)+r['Ex_dest']
print('by area',{k:round(v,1) for k,v in area.items()})
