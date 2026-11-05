# Exergy analysis: per unit and whole process

Analysis only. The Aspen model was not changed.
**Data:** the stream results stored in `files/Memb-Integration-1.bkp`. These are from the **2026-10-06 GUI run** (biogas 2.268 kmol/h), the last run saved with results. The 2026-10-07 design point (after C25/C26) has about 5 % more flow in the upgrading and pyrolysis sections, so the shares and conclusions below do not change. Re-run `scripts/exergy.py` after the `.bkp` is re-run and saved from the GUI on Windows to get the 2026-10-07 numbers.

## Method
- Dead state: T₀ = 25 °C, P₀ = 1.013 bar. Standard chemical exergy of the elements from Szargut (1989): C 410.26, H₂ 236.09, O₂ 3.97, N₂ 0.72 kJ/mol, S 609.6 kJ/mol.
- **Stream exergy = F·(H − T₀S) + Σ (element moles × element exergy).** H and S come from Aspen on its formation basis, read from the `.bkp`. So the physical, chemical and mixing parts all use Aspen's own property model.
  - Check: liquid water at 25 °C gives 0.94 kJ/mol (Szargut 0.9); CH₄ gives 831.8 kJ/mol (Szargut 831.65).
- **Unit balance:** Ex_destroyed = ΣEx_in − ΣEx_out + Ex_Q + W. Heat supplied carries Ex_Q = Q·(1 − T₀/T_source). Heat rejected to cooling water at T₀ carries no exergy, so it is counted as destroyed in that unit.
- **Heat-source temperatures (assumption):** 90 °C hot water for RSTOIC and B1; a 1000 °C furnace for HEAT2 and CH4PYRO.
- **Energy balance check:** for every block, the enthalpy change taken from the stored streams equals Aspen's duty within 0.1 %. The overall exergy balance also closes: inputs = products + lost streams + destroyed.
- **Data patches:**
  - The pseudo-component formulas come from the RSTOIC stoichiometry. PROT = C₁₃H₂₅O₇N₃S (MW 367.4, which matches Aspen). KERATIN is taken from its amino-acid split. INERT is treated as ash (zero exergy; it passes every unit unchanged).
  - The entropy of RET is not stored for the ACM block, so it is taken as PROD4 − R·ln(10) (ideal gas).
  - The solid carbon in FINPROD uses graphite Cp (Smith, Van Ness & Abbott, Table C.2).

## Results per unit (kW)

| Unit | Heat in (kW) | Work (kW) | Exergy destroyed (kW) | Share |
|---|---|---|---|---|
| **RSTOIC** (hydrolysis + feed heating to 55 °C) | 25.0 | | **38.6** | **50.5 %** |
| **B1 digester** | 3.4 | | **21.9** | **28.7 %** |
| **CH4PYRO** (790 °C) | 36.0 | | **6.0** | 7.8 % |
| **HEAT2** (30 → 790 °C) | 19.4 | | **4.4** | 5.8 % |
| **FLASH3** (10 → 1 bar letdown) | 0 | | **2.7** | 3.5 % |
| MEMB1 | 0 | | 0.6 | 0.8 % |
| COMP1 / COMP2 | | 2.71 / 2.76 | 0.5 / 0.5 | 1.4 % |
| COOL1 / COOL2 | −2.6 / −2.8 | | 0.4 / 0.5 | 1.1 % |
| FLASH (biogas to 25 °C) | −5.3 | | 0.3 | 0.4 % |
| MIX1 | | | 0.2 | 0.3 % |
| H2S-SEP, NH3SEP | | | −0.1 each | ideal splitters (see note) |
| **Total destroyed** | | | **76.3** | 100 % |

By section: digestion 60.7 kW (80 %), pyrolysis 10.4 kW (14 %), membrane and letdown 3.3 kW, compression 1.9 kW, gas cleanup about 0.

**Note:** H2S-SEP and NH3SEP are perfect component splitters. They "un-mix" gas without any work input, so they show a small negative destruction. A real cleanup unit needs at least that much work. It is a known simplification.

## Whole process (kW)

| Exergy in | | Exergy out | |
|---|---|---|---|
| Biomass | 585.4 | **Product FINPROD** | **332.0** (H₂ 143.7, carbon 147.1, CO 30.1, sensible heat at 790 °C 11.6) |
| Process water | 7.8 | Digestate (LIQUID), lost | **207.1** |
| Electricity | 5.5 | Permeate (CO₂ + CH₄ slip), lost | 12.6 |
| Heat (exergy of 83.8 kW heat) | 47.5 | H₂S, NH₃ and water purge streams, lost | 18.3 |
| | | **Destroyed** | **76.3** |
| **Total** | **646.2** | **Total** | **646.2** |

**Exergy efficiency** (useful product ÷ all inputs):
- H₂ only: **22 %**
- H₂ + solid carbon: **45 %**
- H₂ + carbon + CO: **50 %**

## Main findings
1. **The digester section dominates.** RSTOIC and B1 together destroy 80 % of the exergy. This is mostly the biochemistry itself (hydrolysis and fermentation are irreversible). The rest is heating 21.5 t/d of feed to 55 °C with 90 °C heat.
2. **The digestate leaves 207 kW of exergy, a third of the input.** It carries unconverted organics (starch, cellulose, fats, ethanol, VFAs, biomass) plus 55 °C water. The biggest losses are digestate exergy leaving the process and destruction in the digester, not anything in the hydrogen section.
3. **Pyrolysis section:** HEAT2 and CH4PYRO lose 10.4 kW, mostly because heat comes from a 1000 °C source. The hot product leaves at 790 °C with **about 24 kW of sensible heat** (11.6 kW of exergy), more than HEAT2 needs (19.4 kW). This is the **economiser opportunity**.
4. **The 10 → 1 bar letdown (FLASH3) wastes 2.7 kW,** about half of the 5.5 kW of compressor work. An expander could recover about 1.6 kW, or the pressure could be used downstream.
5. **Compression, membrane and gas cleanup are small** (under 4 % together).

## Ways to cut energy use (screening, for the BTP-2 pinch analysis)

| Measure | Saves (heat) |
|---|---|
| Digestate (55 → 30 °C) preheats the feed | about 24 of 28 kW low-temperature heat |
| Hot product (790 °C) preheats the pyrolysis feed (economiser) | about 18 of 20 kW in HEAT2 |
| Burn the CO in the product gas (32.7 kW LHV) for the 790 °C heat | about 26 kW |
| Expander on the 10 → 1 bar letdown | about 1.6 kW electricity |
| **Together** | external heat **86.7 → about 18 kW (−79 %)** |

These are first estimates, assuming roughly 25–50 K approach temperatures. A pinch analysis should confirm them. Hot carbon must be separated from the product gas before any heat exchanger.

## Sensitivity to the heat-source temperature
The losses assigned to the heaters depend on the assumed source temperature:
- RSTOIC with heat at 55 °C instead of 90 °C: destroyed exergy falls from 38.6 to 36.4 kW.
- HEAT2, if heated at the stream's own mean temperature: 0, all its loss moves to the furnace.
- CH4PYRO with heat at 790 °C: 4.3 kW (the reaction itself).

The ranking of units does not change.

Script: [scripts/exergy.py](scripts/exergy.py), using the [scripts/bkp_streams.py](scripts/bkp_streams.py) decoder.
