"""Scope 1 + 2 CO2 emissions at the 2026-10-07 design point. Run: python3 co2_scope12.py"""
# Scope 1 + 2 CO2 emissions, design point = Aspen run 2026-10-07 (docs/results_2026-10-07.md)
H2=4.65                     # kg/h
heat={'RSTOIC':24.74,'B1':3.51,'HEAT2':20.42,'CH4PYRO':38.06}   # kW
lowT=heat['RSTOIC']+heat['B1']; highT=heat['HEAT2']+heat['CH4PYRO']
elec=5.69                   # kW compressors
eta_lo,eta_hi=0.90,0.80     # boiler (hot water), fired furnace -- assumptions
EF_NG=56.1                  # kg CO2/GJ, IPCC 2006 Vol.2 Table 2.2 (NCV)
GWP=27.0                    # non-fossil CH4, IPCC AR6 (GHG Protocol GWP table Aug 2024)
ch4_slip=0.580*0.070*16.043 # kg/h CH4 in permeate
co2_perm=0.580*0.922*44.01  # kg/h biogenic CO2 in permeate
flare_eff=0.98
grid={'India grid (CEA v20, FY23-24)':0.727,'Coal/thermal (CEA operating margin)':0.962,'Hydro':0.0,'Solar PV':0.0}
life={'India grid (CEA v20, FY23-24)':None,'Coal/thermal (CEA operating margin)':0.820,'Hydro':0.024,'Solar PV':0.048}
fuel_GJh=(lowT/eta_lo+highT/eta_hi)*3.6/1000
s1_heat_ng=fuel_GJh*EF_NG
s1_flare=ch4_slip*(1-flare_eff)*GWP
s1_vent=ch4_slip*GWP
print(f'heat {lowT+highT:.2f} kW (low-T {lowT:.2f}, high-T {highT:.2f}); NG fuel {fuel_GJh*1000/3.6:.1f} kW = {fuel_GJh:.4f} GJ/h')
print(f'S1 NG heat {s1_heat_ng:.2f} kg/h = {s1_heat_ng/H2:.2f} kg/kg H2')
print(f'S1 CH4 slip {ch4_slip:.3f} kg/h: vented {s1_vent:.2f} kg CO2e/h ({s1_vent/H2:.2f}/kg); flared {s1_flare:.2f} ({s1_flare/H2:.3f}/kg)')
print(f'biogenic CO2 permeate {co2_perm:.1f} kg/h ({co2_perm/H2:.2f}/kg) + flare CO2 {ch4_slip*flare_eff*44.01/16.043:.2f}')
print('\nScope 2 (compressors only) and totals:')
for k,f in grid.items():
    s2=elec*f; s2e=(elec+lowT+highT)*f
    tA=s1_heat_ng+s1_flare+s2; tB=s1_flare+s2e
    lc='' if life[k] is None else f' | lifecycle elec-heat case {(elec+lowT+highT)*life[k]/H2:.2f}'
    print(f'{k:38s} EF {f:.3f}: S2 {s2:.2f} kg/h | A) NG heat: total {tA:.1f} kg/h = {tA/H2:.2f} kg/kg | B) electric heat: total {tB:.1f} kg/h = {tB/H2:.2f} kg/kg{lc}')
# CO-rich offgas as fuel: CO in product 0.4154 kmol/h * 283.0 MJ/kmol LHV
co_kw=0.4154*283.0/3.6
print(f'\nCO in product as fuel: {co_kw:.1f} kW LHV (biogenic); covers {co_kw*eta_hi/highT*100:.0f}% of the high-T heat')
print('annual (8000 h):',{k:round(v*8,1) for k,v in {'S1 NG heat t/yr':s1_heat_ng,'S2 grid t/yr':elec*0.727,'CH4 vent t CO2e/yr':s1_vent}.items()})

# ---- screening heat-integration case (NOT a pinch analysis; indicative only)
dig=823.3*4.18*(55-30)/3600            # digestate 55 -> 30 C preheats the feed (2026-10-06 digestate flow)
ext_lo=max(0,lowT-dig)
prod_heat=24.0*1.053                   # sensible heat of hot product 790 -> 30 C (exergy.py, 10-06) scaled to 10-07 flow
rec_hi=min(heat['HEAT2']*0.9,prod_heat)
co_heat=co_kw*eta_hi                   # CO in product burned for high-T heat
ext_hi=max(0,heat['HEAT2']-rec_hi+heat['CH4PYRO']-co_heat)
fuel=(ext_lo/eta_lo+ext_hi/eta_hi)*3.6/1000
s1=fuel*EF_NG+s1_flare; s2=elec*0.727
print(f'\nHeat-integrated screening case: digestate heat {dig:.1f} kW, product heat recovered {rec_hi:.1f} kW, CO fuel heat {co_heat:.1f} kW')
print(f'external heat {ext_lo+ext_hi:.1f} kW (base 86.7); S1 {s1:.2f} + S2 grid {s2:.2f} = {(s1+s2)/H2:.2f} kg CO2e/kg H2; with solar electricity {s1/H2:.2f}')
