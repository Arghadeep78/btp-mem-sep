# Source check results: Perry's Handbook against the model (Phase 2 checks B8, B9, C6, B1)

**Date:** 2026-10-06. **Status:** analysis only; no simulation file was changed.

**Source used:** `Perrys_Chemical_Engineers_Handbook.pdf` (Perry's Chemical Engineers' Handbook, 8th ed., 2,735 PDF pages; git-ignored via `*.pdf`). It is a general handbook, **not a project paper**. It confirms theory, units and typical values. It cannot confirm project-specific values (feed, permeances, reaction rate constants); those are marked **Not in source**. If a separate paper exists for them, run the same checklists against it.

**Page references:** *PDF p* = page number in the PDF viewer; *Printed* = Perry's own page number (section-page). Searching the PDF text with the printed number also works.

**Verdict legend:** ✅ Confirmed · ⚠️ Differs (model vs source) · ❓ Not in source · 💡 Opinion / decision

---

## 1. Membrane (checks B8, C18–C21)

| # | Item | Model value | Verdict | What Perry says | PDF p / Printed |
|---|---|---|---|---|---|
| M1 | Flux law | `Pi·A·(Pf·x − Pp·y)`, partial pressures | ✅ | J_i = (ρ_i/z)(p_i,feed − p_i,permeate), Eq 20-85, 20-86 | 2197 / 20-58 |
| M2 | Unit conversion | 1 GPU = 3.348e-10 mol/(m²·s·Pa) | ✅ | 1 Barrer/cm = 3.348e-17 kmol/m²·s·Pa; 1 GPU = 10⁴ Barrer/cm | 2197 / 20-58, Table 20-28 |
| M3 | Result vs Perry's pressure-ratio equation | y_CO2/y_CH4 = 12.936 | ✅ | J_i/J_j = α(x_i − y_i/Φ)/(x_j − y_j/Φ), Eq 20-93. With α = 69.3, Φ = 10 the right-hand side is also 12.936 (exact) | 2197 / 20-58 |
| M4 | Which gas permeates | H₂, CO₂ fast; CH₄ slow | ✅ | Kinetic diameters (nm): H₂ 0.289, CO₂ 0.33, CO 0.376, CH₄ 0.38. "Methane is a slow gas; CO₂, H₂S, H₂O are fast"; H₂ is a fast gas | 2196 / 20-57, Table 20-26 |
| M5 | Feed / permeate pressure ratio | 10 bar / 1 bar = 10 | ⚠️ | "Pressure ratios higher than six become expensive; vacuum is very expensive" | 2201 / 20-62 |
| M6 | Permeate pressure | 1 bar | ✅ | Vacuum or sweep on the permeate side are the less common, costly options | 2199 / 20-60; 2201 / 20-62 |
| M7 | Driving force basis | partial pressure (ideal gas) | 💡 | "Fugacity must be used for CO₂ and usually for H₂ at high pressure." At 10 bar and 30 °C, partial pressure overstates the CO₂ flux by about 5 % (my estimate from a virial coefficient, not from Perry). Keep as a stated assumption | 2197 / 20-58 |
| M8 | Flow pattern | well-mixed | 💡 | "Calculation for real devices requires iterative calculation dependent on module geometry." Well-mixed is the simple case; the model satisfies the θ-independent relation Eq 20-93 | 2197 / 20-58 |
| M9 | Stages | 1 stage | 💡 | Staging with recompression is unusual (compressor economics); CH₄ loss to the permeate is the key design issue; dividing the same area into two stages gives two permeates, one of higher value | 2201 / 20-62; 2202 / 20-63 |
| M10 | Competitiveness for CH₄ | — | context | Membranes compete at low purity and near pipeline quality (98 %); absorption/PSA are competitive at large scale | 2202 / 20-63 |
| M11 | Temperature dependence of Π | none (297 K values) | ❓ | Temperature text covers **polymer** membranes only (permeability up, selectivity down) | 2199 / 20-60 |
| M12 | DDR material; Π_CO₂ 2.1e-7, Π_H₂ 1.36e-7, Π_CH₄ 3.03e-9 (Yang 2016) | — | ❓ | No zeolite-membrane permeances. Table 20-31 (Robeson upper bound) is for polymers: CO₂/CH₄ log k = 6.0309, m = 2.6264; H₂/CH₄ 4.2672, 1.2112 | 2199 / 20-60, Table 20-31, Eq 20-97 |
| M13 | Membrane area, retentate pressure drop, operating T | 5 m², 0 bar, 30 °C | ❓ | Perry notes frictional pressure drops on both sides reduce the driving force | 2197 / 20-58 |
| M14 | `PERMEATE.V` / molar volume | fixed 50 cc/mol | ❓ | Not covered. Ideal gas V = RT/P agrees with Aspen's own `FEED.V` (2 520 cc/mol at 10 bar, 30 °C) | — |

**Compressor (added check):** compression ratio per stage is "generally limited to 4" (maximum set by the allowed discharge temperature). The model uses 3.14 per stage (discharge 135–142 °C): ✅. PDF 1081 / 10-45.

---

## 2. Digester and whole process (check B9)

| # | Item | Model value | Verdict | What Perry says | PDF p / Printed |
|---|---|---|---|---|---|
| G1 | Feed flow and composition | 8.5 t/d biomass + 13 t/d water, 23 °C | ❓ | Project-specific. Self-check: the BIOMASS mass fractions sum to 1.000 | — |
| G2a | HRT | 15 d | ✅ | An anaerobic digester is a no-recycle complete-mix reactor controlled by HRT; minimum 3–4 d; HRT kept at 10–30 d. Anaerobic SRT of at least 8 d for 95 % destruction | 2453 / 22-79; 2441 / 22-67 |
| G2b | Reactor type | RCSTR, no recycle | ✅ | Same | 2453 / 22-79 |
| G2c | Temperature | 55 °C (thermophilic) | ⚠️ | Digesters are heated to 35–37 °C; thermophilic operation is only mentioned. Keep 55 °C as a stated assumption (the calculator constants use T0 = 55 °C) | 2453 / 22-79; 2440 / 22-66 |
| G3 | Hydrolysis conversions in RSTOIC | e.g. cellulose 0.3 + 0.4, PROT 0.9 | ❓ | — | — |
| G4a | Acetate methanogens: yield | 0.022 mol C₅H₇NO₂/mol HAc = 0.039 g/g COD | ✅ | Y = 0.04 mg biomass/mg COD | 2443 / 22-69, Table 22-46 |
| G4b | Acetate methanogens: Ks | 0.12 kg/m³ ≈ 128 mg COD/L | ✅ same order | Ks = 165 mg COD/L (k_max 8.7 mg COD/mg biomass·d, b = 0.035 d⁻¹, 35 °C) | 2443 / 22-69 |
| G4c | Propionate degraders: yield | 0.0625 g/g COD | ⚠️ | Y = 0.04 (anaerobic mixed, propanoic acid) | 2443 / 22-69 |
| G4d | Propionate degraders: Ks | 0.259 kg/m³ ≈ 392 mg COD/L | ⚠️ | Ks = 60 mg COD/L (35 °C) | 2443 / 22-69 |
| G4e | k_max and other Monod / inhibition constants | pseudo-first-order rate constants in 1/d | ❓ | Perry gives k_max per kg biomass at 35 °C; the model uses ADM1-style constants at 55 °C, so they are not directly comparable | 2443 / 22-69 |
| G5 | Hydrogenotrophic methanogenesis (CO₂ + 4 H₂ → CH₄) | not modelled (B5) | ⚠️ | The methane bacteria "split acetic acid to methane and CO₂ and produce methane from CO₂ and H₂". Effect here is small (biogas H₂ is 0.32 %) | 2453 / 22-79 |
| G6 | pH | fixed 6.5–7 | ✅ | Effective methane fermentation needs pH 6.5–7.5; alkalinity 3000–5000 mg/L; protein-rich feed can raise pH above 7.5 (free-ammonia toxicity) | 2440 / 22-66; 2453 / 22-79 |
| G7a | Biogas composition | CH₄ 58.7 %, CO₂ 40.9 %, H₂ 0.3 % | ✅ | Digester gas is 50–80 % CH₄ and 20–50 % CO₂ | 2453 / 22-79 |
| G7b | CH₄ yield | 29.9 m³(STP)/h from feed COD 130.7 kg/h = **0.228 m³/kg COD fed** (0.367 m³/kg VS) | ✅ plausible | 0.35 m³ CH₄ per kg BCOD **destroyed** (the theoretical ceiling). The model's value is 65 % of that, as expected (not all COD is destroyed). The COD was computed from the feed fractions; KERATIN assumed 1.2 g COD/g | 2453 / 22-79 |
| G7c | Biomass formula | C₅H₇NO₂ (N 12.4 wt %) | ✅ | C₆₀H₈₇O₂₃N₁₂P (N 12 wt %) | 2440 / 22-66 |

---

## 3. Heats of formation (C6)

| Item | Verdict | Finding | PDF p / Printed |
|---|---|---|---|
| Basis of Aspen's DHFORM | ✅ | Perry's Table 2-179 lists the **ideal-gas** enthalpy of formation at 298.15 K. Aspen's DHFORM is the same quantity, so the solid-state values entered in REVIEW-1 (e.g. alanine −561.2 kJ/mol) are the wrong basis | 238 / Table 2-179 (printed 2-195 onwards) |
| Values for TYROSINE, TRYPTOPH, METHIONI (and the other amino acids) | ❓ | **Not tabulated**: Table 2-179 has no amino acids. Perry cannot supply the numbers | 238–243 |
| Estimation method | 💡 | Domalski–Hearing group contribution, expected uncertainty 3 %, group values in Table 2-343. Aspen's own PCES (Benson) does the same job from molecular structures | 521 / 2-478 |
| Recommendation | 💡 | **Route 1** (give Aspen the molecular structures and let it estimate all amino acids on one basis; delete the REVIEW-1 DHFORM values). Low priority: TYR/TRP/MET have zero flow today | — |

---

## 4. Pyrolysis (checks B1, C1–C3)

Thermodynamics computed from Perry's data only (ideal-gas Cp with the Aly–Lee form, Table 2-155, printed 2-175 to 2-181; ΔHf and ΔGf at 298 K, Table 2-179; graphite Cp, Table 2-151, p.2-157; Gibbs–Helmholtz integration).

| # | Item | Verdict | Result / what Perry says | PDF p / Printed |
|---|---|---|---|---|
| P1–P6 | R-1 / R-2 k₀, activation energies, rate orders | ❓ | Perry has no catalytic CH₄-cracking kinetics. Only the forms: power law r = k·C_Aᵃ·C_Bᵇ (Eq 7-5) and Arrhenius k = k₀·exp(−E/RT) (Eq 7-8). Units of k depend on the rate basis (volume, catalyst mass), so they must be stated | 845 / 7-6 |
| P-a | RWGS is reversible | ✅ | Perry's example of a reversible reaction: CO + H₂O ⇌ CO₂ + H₂ (also Eq 24-18 and Eq 24-25) | 844 / 7-5; 2608 / 24-14; 2614 / 24-20 |
| P-b | RWGS equilibrium (R-2) | ✅ computed | ΔH₂₉₈ = +41.17 kJ/mol, ΔH(790 °C) = +34.2 kJ/mol. **K = 0.888 at 790 °C** (0.373 at 600 °C, 0.618 at 700 °C, 1.269 at 900 °C). The irreversible R-2 is wrong here | Tables 2-155, 2-179 |
| P-c | CH₄ cracking equilibrium (R-1) | ✅ computed | ΔH₂₉₈ = +74.52 kJ/mol, ΔH(790 °C) = +89.6 kJ/mol. **K = 19.98 at 790 °C**; equilibrium CH₄ conversion **91.3 %** at 1 bar for pure CH₄. Check that the run does not exceed this | Tables 2-155, 2-179, 2-151 |
| P-d | Side reaction | 💡 | Boudouard 2CO → C(s) + CO₂ (Eq 24-26) is not in the model; minor | 2614 / 24-20 |
| P7–P9 | Catalyst type, density, loading; reactor size; paper conversion | ❓ | Not in Perry | — |

---

## 5. Sensitivity for the D1 decision

**Method.** A Python replica of the ACM model (single well-mixed stage; partial-pressure driving force; DDR permeances from Yang 2016) reproduces Aspen's stored MEMB1 result to six digits (permeate 0.579162 kmol/h, retentate 1.688849 kmol/h, RET CH₄ 0.76431). Compressor power is calibrated to the Aspen log (γ = 1.30, η = 0.75, two equal stages with cooling to 30 °C): 5.50 kW at 10 bar against 5.47 kW in Aspen. **Power for other pressures is an estimate; confirm with an Aspen run.** Feed: GAS2C 2.268 kmol/h, CH₄ 58.7 %, CO₂ 40.9 %, H₂ 0.32 %.

**RET CH₄ purity (%), by area and feed pressure**

| A (m²) \ P (bar) | 4 | 6 | 8 | 10 | 12 | 15 |
|---|---|---|---|---|---|---|
| 3 | 62.1 | 65.8 | 69.0 | 71.8 | 74.3 | 77.3 |
| 5 | 63.9 | 69.0 | 73.1 | **76.4** | 79.1 | 82.2 |
| 8 | 66.1 | 72.4 | 77.1 | 80.5 | 83.1 | 86.0 |
| 10 | 67.2 | 74.1 | 78.9 | 82.3 | 84.8 | 87.6 |
| 15 | 69.5 | 77.0 | 81.9 | 85.1 | 87.5 | 90.0 |
| 20 | 71.1 | 79.0 | 83.7 | 86.9 | 89.1 | 91.4 |
| 30 | 73.5 | 81.5 | 86.1 | 89.0 | 91.0 | 93.0 |

**CH₄ recovery to the retentate (%)**

| A (m²) \ P (bar) | 4 | 6 | 8 | 10 | 12 | 15 |
|---|---|---|---|---|---|---|
| 3 | 99.4 | 99.0 | 98.7 | 98.2 | 97.8 | 97.2 |
| 5 | 99.0 | 98.3 | 97.6 | **96.9** | 96.1 | 95.0 |
| 8 | 98.3 | 97.2 | 96.0 | 94.8 | 93.5 | 91.6 |
| 10 | 97.9 | 96.4 | 94.9 | 93.4 | 91.8 | 89.4 |
| 15 | 96.7 | 94.5 | 92.1 | 89.7 | 87.3 | 83.7 |
| 20 | 95.5 | 92.5 | 89.3 | 86.1 | 82.9 | 78.0 |
| 30 | 93.2 | 88.4 | 83.6 | 78.8 | 73.9 | 66.6 |

**Compressor power (kW, estimate):** 4 bar 3.12 · 6 bar 4.15 · 8 bar 4.90 · 10 bar 5.50 · 12 bar 6.01 · 15 bar 6.64.

**Finding.** One stage cannot reach pipeline grade: **90 % CH₄ costs at least 20 % CH₄ loss** (e.g. A = 20 m², 15 bar: 91.4 % purity, 78.0 % recovery). Perry's Fig 20-75 and text (p.20-62/63) make the same point and recommend two stages when purity matters.

**Comparable operating points (recovery about 96–97 %)**

| A, P | RET CH₄ | Recovery | Power | Note |
|---|---|---|---|---|
| 5 m², 10 bar (current) | 76.4 % | 96.9 % | 5.50 kW | pressure ratio 10 |
| 8 m², 8 bar | 77.1 % | 96.0 % | **4.90 kW** | pressure ratio 8 |
| 10 m², 6 bar | 74.1 % | 96.4 % | **4.15 kW** | pressure ratio 6 (Perry's limit) |
| 5 m², 12 bar | 79.1 % | 96.1 % | 6.01 kW | more purity, more power |

---

## 6. Proposed decisions (for you to confirm)

| # | Decision | Proposal | Reason |
|---|---|---|---|
| D1 | Membrane design target | CH₄ recovery ≥ 95 %, then the highest purity per kW. Suggested point: **8 m², 8 bar** (or 10 m², 6 bar to respect Perry's ratio of 6) | CH₄ is the pyrolysis feedstock; CO₂ in the retentate only costs H₂ through RWGS |
| D2 | Reported outputs | RET CH₄ %, CH₄ recovery, CO₂ removal, compressor kW (COMP1 + COMP2) | — |
| PURGAS | Delete it | There is no recycle, so a purge does nothing. Connect `METH.GAS` straight to COMP1 | WASTE is always empty |
| FLASH3 | Keep it; rename to e.g. "LETDOWN" | It is the 10 → 1 bar letdown (HEAT2 is also set to 1 bar) and acts as a knockout drum | Deleting it would also remove the pressure letdown |
| C6 | Route 1 for amino-acid ΔHf | Structures plus PCES; delete the REVIEW-1 DHFORM values | Perry has no amino acids |
| G2c | Keep 55 °C | State it as an assumption (Perry: 35–37 °C) | Calculator constants are written around T0 = 55 °C |
| G5 | Keep hydrogenotrophic methanogenesis out | State it (H₂ is 0.3 % of the biogas) | Small effect |

---

## 7. ACM text for the Windows session (one recompile)

Area per the D1 choice; the V lines resolve C17 in [C/00_README.md](C/00_README.md) (`PERMEATE.V`).

```
A as RealParameter (value: 8.0);    // m2, per D1 (8 m2 / 8 bar)

// after: Retentate.P = Feed.P - dP_ret;
Permeate.V  = 0.08314*(Permeate.T + 273.15)/Permeate.P;    // m3/kmol, ideal gas
Retentate.V = 0.08314*(Retentate.T + 273.15)/Retentate.P;
```

Then in Aspen: set `PERMEATE.V` to Free; set COMP1/COMP2 discharge pressures for the chosen feed pressure (COMP1 about √(P/1.01325) × 1.01325 bar; for 8 bar: 2.87 bar then 8 bar); keep `Pi(...)` at the Yang 2016 values until the real source values are available.

---

## 8. Still needed

- The project's own source for: permeances (A2–A4) and conditions (A6), digester kinetic constants and feed (G1, G3, G4), and the R-1/R-2 k₀, Eₐ, orders, catalyst and reactor basis (P1–P9).
- A Windows run to check: RET/PER values for the chosen operating point; that CH₄ conversion in CH4PYRO stays below the 91.3 % equilibrium ceiling; CO/CO₂ ratio against K(RWGS) = 0.888.
