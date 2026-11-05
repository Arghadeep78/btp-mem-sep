# CO₂ emissions: Scope 1 + Scope 2

Analysis only. The Aspen model was not changed. **Design point:** the Aspen run of 2026-10-07 ([results_2026-10-07.md](../docs/results_2026-10-07.md)). H₂ output is 4.65 kg/h. Annual figures assume 8000 h/yr. Script: [scripts/co2_scope12.py](scripts/co2_scope12.py).

## Boundary and definitions (GHG Protocol)
- **Scope 1 (direct):** fuel burned on site for process heat, and process vents (CH₄ slip in the membrane permeate).
- **Scope 2 (indirect):** purchased electricity (compressors 5.69 kW; and all heating, if electric heating is used).
- **Biogenic CO₂ is reported separately, not in Scope 1.** This covers the CO₂ removed from the biogas and the CO₂ from burning biogas or the CO in the product. Biogenic **CH₄** that escapes **is** counted in Scope 1.
- Scope 3 (upstream fuel, equipment, feedstock transport, product use) comes later.

## Inputs

| Item | Value | Source |
|---|---|---|
| Heat demand | 86.7 kW: low-temperature 28.3 (RSTOIC 24.7, B1 3.5); high-temperature 58.5 (HEAT2 20.4, CH4PYRO 38.1) | Aspen 2026-10-07 |
| Electricity | 5.69 kW (COMP1 + COMP2) | Aspen 2026-10-07 |
| CH₄ slip in permeate | 0.65 kg/h (about 3 % of the CH₄) | Aspen 2026-10-07 |
| Biogenic CO₂ in permeate | 23.5 kg/h | Aspen 2026-10-07 |
| Natural gas emission factor | 56.1 kg CO₂/GJ (NCV basis) | IPCC 2006 Guidelines, Vol. 2, Table 2.2 |
| Heater efficiency | boiler 90 %, fired furnace 80 % | Assumption |
| GWP₁₀₀ of CH₄ (non-fossil) | 27.0 | IPCC AR6 WG1 Table 7.15, via GHG Protocol GWP table (Aug 2024) |
| Flare destruction efficiency | 98 % | Assumption (common default) |
| India grid emission factor | **0.727 t CO₂/MWh** (FY 2023-24 weighted average) | [CEA CO₂ Baseline Database v20.0](https://cea.nic.in/api/cdm-report-version/view-pdf/en/76) |
| Coal/thermal power | 0.962 t CO₂/MWh (CEA operating margin, thermal plants) | CEA v20.0 |
| Hydro, solar PV | 0 in Scope 2 (no combustion). Lifecycle values, for information: hydro 24 g/kWh, solar PV 48 g/kWh, coal 820 g/kWh | [IPCC AR5 WGIII Annex III](https://www.ipcc.ch/site/assets/uploads/2018/02/ipcc_wg3_ar5_annex-iii.pdf), Table A.III.2 (medians) |

## Results

### Scope 1
| Source | kg CO₂e/h | kg CO₂e/kg H₂ | t/yr |
|---|---|---|---|
| Natural gas for all process heat (104.5 kW of fuel) | 21.1 | **4.54** | 169 |
| CH₄ slip, **flared** | 0.35 | 0.08 | 3 |
| CH₄ slip, **vented** (instead of flared) | 17.6 | **3.78** | 141 |
| *Biogenic CO₂ in permeate (reported separately)* | *23.5* | *5.06* | *188* |

### Scope 2 (compressors only)
| Electricity source | kg CO₂/h | kg CO₂/kg H₂ |
|---|---|---|
| India grid | 4.14 | 0.89 |
| Coal/thermal | 5.47 | 1.18 |
| Hydro / solar | 0 | 0 |

### Total Scope 1 + 2 (permeate CH₄ flared)
| Case | Grid | Coal | Hydro / solar |
|---|---|---|---|
| **A. Heat from natural gas** (base) | **5.50** | 5.79 | 4.61 |
| **B. All heat electric** (92.4 kW of electricity in total) | 14.5 | 19.2 | **0.08** (lifecycle 0.5–1.0) |
| **C. Heat-integrated** (economisers + CO burned, see below) | **1.93** | — | **1.04** |

All figures are kg CO₂e per kg H₂.

**Benchmarks:**
- India Green Hydrogen Standard (MNRE, Aug 2023): ≤ **2 kg CO₂e/kg H₂**, well-to-gate.
- Grey hydrogen from steam methane reforming: about 10–12 kg CO₂e/kg H₂ (IEA).

## Findings
1. **Process heat is the main emission source.** Natural gas for heat gives 4.5 of the 5.5 kg CO₂e/kg H₂ in the base case.
2. **Electric heating only helps with clean power.** On the Indian grid it almost triples emissions (14.5 kg/kg). With hydro or solar it brings Scope 1 + 2 close to zero.
3. **The permeate must not be vented.** Venting its 0.65 kg/h of CH₄ adds 3.8 kg CO₂e/kg H₂, as much as all the natural gas heat. Flaring it, or recycling it to the digester or burner, removes this.
4. **Heat integration (case C) brings the process just under the 2 kg green limit**, even on grid power. This combines digestate heat recovery, an economiser on the 790 °C product, and burning the CO in the product gas. With solar electricity it reaches about 1 kg/kg. This supports the economiser and energy-analysis focus for BTP-2.
5. **The 23.5 kg/h of biogenic CO₂ in the permeate is the target for the planned CO₂ absorption column (amine).** Capturing it would make the process net-negative on a biogenic-carbon basis. The solid carbon (16.3 kg/h) also stores carbon.

## Limitations
- Scope 3 is not included: upstream natural gas (about 10 kg CO₂e/GJ), equipment, feedstock, digestate handling. The India standard is well-to-gate, so upstream emissions must be added before claiming "green".
- Not modelled: digester fugitive CH₄ (typically 1–2 % of production; 1 % would add about 1.3 kg CO₂e/kg H₂), and pump and mixer electricity.
- Case C is a screening estimate, not a pinch analysis.
- The CH₄ GWP of 27.0 is the current GHG Protocol value. An IPCC erratum reported in 2025 (not verified here) may lower it to about 25.
