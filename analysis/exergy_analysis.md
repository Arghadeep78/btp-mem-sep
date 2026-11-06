# Exergy analysis: per unit and whole process

Analysis only. The Aspen model was not changed.
**Data:** the stream results of the **Aspen run of 2026-11-06 of the current model** (biogas 2.358 kmol/h; pyrolysis reversible, at equilibrium after C1/C2). The run was made through COM on an unchanged copy of `files/Memb-Integration-1.bkp`, and its results are kept in [data/Memb-Integration-1_results_2026-11-06.bkp](data/Memb-Integration-1_results_2026-11-06.bkp) (a results file, not the model).

## Method
- Dead state: T₀ = 25 °C, P₀ = 1.013 bar. Standard chemical exergy of the elements from Szargut (1989): C 410.26, H₂ 236.09, O₂ 3.97, N₂ 0.72 kJ/mol, S 609.6 kJ/mol.
- **Stream exergy = F·(H − T₀S) + Σ (element moles × element exergy).** H and S come from Aspen on its formation basis, read from the `.bkp`. So the physical, chemical and mixing parts all use Aspen's own property model.
  - Check: liquid water at 25 °C gives 0.94 kJ/mol (Szargut 0.9); CH₄ gives 831.8 kJ/mol (Szargut 831.65).
- **Unit balance:** Ex_destroyed = ΣEx_in − ΣEx_out + Ex_Q + W. Heat supplied carries Ex_Q = Q·(1 − T₀/T_source). Heat rejected to cooling water at T₀ carries no exergy, so it is counted as destroyed in that unit.
- **Heat-source temperatures (assumption):** 90 °C hot water for RSTOIC and B1; a 1000 °C furnace for HEAT2 and CH4PYRO.
- **Energy balance check:** for every block, the enthalpy change taken from the stored streams equals Aspen's duty within 0.1 % (CH4PYRO 0.4 %, from the graphite Cp used for the solid carbon). The overall exergy balance also closes: inputs = products + lost streams + destroyed.
- **Data patches:**
  - The pseudo-component formulas come from the RSTOIC stoichiometry. PROT = C₁₃H₂₅O₇N₃S (MW 367.4, which matches Aspen). KERATIN is taken from its amino-acid split. INERT is treated as ash (zero exergy; it passes every unit unchanged).
  - If the entropy of RET is not stored for the ACM block, it is taken as PROD4 − R·ln(10) (ideal gas). In this run it is stored and agrees with that estimate.
  - The solid carbon in FINPROD uses graphite Cp (Smith, Van Ness & Abbott, Table C.2).

## Results per unit (kW)

| Unit | Heat in (kW) | Work (kW) | Exergy destroyed (kW) | Share |
|---|---|---|---|---|
| **RSTOIC** (hydrolysis + feed heating to 55 °C) | 24.7 | | **39.1** | **50.0 %** |
| **B1 digester** | 3.5 | | **22.5** | **28.8 %** |
| **CH4PYRO** (790 °C) | 35.4 | | **6.3** | 8.1 % |
| **HEAT2** (30 → 790 °C) | 20.4 | | **4.6** | 5.9 % |
| **FLASH3** (10 → 1 bar letdown) | 0 | | **2.8** | 3.6 % |
| MEMB1 | 0 | | 0.6 | 0.8 % |
| COMP1 / COMP2 | | 2.82 / 2.87 | 0.5 / 0.5 | 1.4 % |
| COOL1 / COOL2 | −2.7 / −2.9 | | 0.4 / 0.5 | 1.1 % |
| FLASH (biogas to 25 °C) | −5.5 | | 0.3 | 0.4 % |
| MIX1 | | | 0.2 | 0.3 % |
| H2S-SEP, NH3SEP | | | −0.1 each | ideal splitters (see note) |
| **Total destroyed** | | | **78.3** | 100 % |

By section: digestion 61.9 kW (79 %), pyrolysis 11.0 kW (14 %), membrane and letdown 3.4 kW, compression 2.0 kW, gas cleanup about 0.

**Note:** H2S-SEP and NH3SEP are perfect component splitters. They "un-mix" gas without any work input, so they show a small negative destruction. A real cleanup unit needs at least that much work. It is a known simplification.

## Whole process (kW)

| Exergy in | | Exergy out | |
|---|---|---|---|
| Biomass | 585.4 | **Product FINPROD** | **347.7** (H₂ 144.9, carbon 145.8, CO 26.9, sensible heat at 790 °C 12.2; rest CH₄, CO₂, H₂O) |
| Process water | 7.8 | Digestate (LIQUID), lost | **191.0** |
| Electricity | 5.7 | Permeate (CO₂ + CH₄ slip), lost | 12.6 |
| Heat (exergy of 84.1 kW heat) | 47.8 | H₂S, NH₃ and water purge streams, lost | 17.1 |
| | | **Destroyed** | **78.3** |
| **Total** | **646.8** | **Total** | **646.8** |

**Exergy efficiency** (useful product ÷ all inputs):
- H₂ only: **22 %**
- H₂ + solid carbon: **45 %**
- H₂ + carbon + CO: **49 %**

## Main findings
1. **The digester section dominates.** RSTOIC and B1 together destroy 79 % of the exergy. This is mostly the biochemistry itself (hydrolysis and fermentation are irreversible). The rest is heating 21.5 t/d of feed to 55 °C with 90 °C heat.
2. **The digestate leaves 191 kW of exergy, about 30 % of the input.** It carries unconverted organics (starch, cellulose, fats, ethanol, VFAs, biomass) plus 55 °C water. The biggest losses are digestate exergy leaving the process and destruction in the digester, not anything in the hydrogen section.
3. **Pyrolysis section:** HEAT2 and CH4PYRO lose 11.0 kW, mostly because heat comes from a 1000 °C source. The hot product leaves at 790 °C with **about 25 kW of sensible heat** (12.2 kW of exergy), more than HEAT2 needs (20.4 kW). This is the **economiser opportunity**.
4. **The 10 → 1 bar letdown (FLASH3) wastes 2.8 kW,** about half of the 5.7 kW of compressor work. An expander could recover about 1.7 kW, or the pressure could be used downstream.
5. **Compression, membrane and gas cleanup are small** (under 4 % together).

## Ways to cut energy use (screening, for the BTP-2 pinch analysis)

| Measure | Saves (heat) |
|---|---|
| Digestate (55 → 30 °C) preheats the feed | about 24 of 28 kW low-temperature heat |
| Hot product (790 °C) preheats the pyrolysis feed (economiser) | about 18 of 20 kW in HEAT2 |
| Burn the CO in the product gas (27.7 kW LHV) for the 790 °C heat | about 22 kW |
| Expander on the 10 → 1 bar letdown | about 1.7 kW electricity |
| **Together** | external heat **84.1 → about 20 kW (−77 %)** |

These are first estimates, assuming roughly 25–50 K approach temperatures. A pinch analysis should confirm them. Hot carbon must be separated from the product gas before any heat exchanger.

## Sensitivity to the heat-source temperature
The losses assigned to the heaters depend on the assumed source temperature:
- RSTOIC with heat at 55 °C instead of 90 °C: destroyed exergy falls from 39.1 to 37.0 kW.
- HEAT2, if heated at the stream's own mean temperature: 0, all its loss moves to the furnace.
- CH4PYRO with heat at 790 °C: 4.7 kW (the reaction itself).

The ranking of units does not change.

Script: [scripts/exergy.py](scripts/exergy.py), using the [scripts/bkp_streams.py](scripts/bkp_streams.py) decoder.
