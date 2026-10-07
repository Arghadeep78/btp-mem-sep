# Phase 2, Session B: Check only / optional

Source checks, tests and optional deletions. No design change. The three checks that matter most for the results are B8 (membrane permeances), B9 (digester) and B1 (pyrolysis kinetics).

Other sessions: [A](A_will_do.md) · [C](C_parked.md). Overview and ranking: [../00_INDEX.md](../00_INDEX.md). Phase 1 (done): [../phase1/00_PHASE1_DONE.md](../phase1/00_PHASE1_DONE.md). Evidence: [source_check_results.md](source_check_results.md).

Contents: pyrolysis · property data · cleanup and documentation · membrane and digester.

---

## Pyrolysis reactor (CH4PYRO)


(Check when the source paper is available.)

(Scope and status for this topic: see [A_will_do.md](A_will_do.md).)

### B1. Source check: pyrolysis data

Mark each row **confirmed / differs (new value) / not in source**. Perry's Handbook does not contain these values (see [source_check_results.md](source_check_results.md) §4).

| # | Item | Current model | What the source must show |
|---|---|---|---|
| P1 | R-1 k₀ and its **full units** | 474600; no IN-UNITS line, so the global MET set (hour basis); CBASIS molarity, RBASIS cat-wt | Value; time unit (s or h), amount (mol/kmol), basis (kg-cat), concentration or partial-pressure basis |
| P2 | R-1 activation energy | 145.8 kJ/mol | Value |
| P3 | R-1 rate law | first order in CH₄, irreversible | Orders; reversible or equilibrium term? |
| P4 | R-2 k₀ and units | 24600, same unit basis | Same as P1 |
| P5 | R-2 activation energy | 82 kJ/mol | Value |
| P6 | R-2 rate law | CO₂¹·H₂⁰·³, irreversible | Orders; reverse term or K_eq |
| P7 | Catalyst | 24.668 kg, ρ = 1500 kg/m³ | Type, mass or loading, bulk density, voidage |
| P8 | Reactor | L 18.9 m, D 0.378 m, 790 °C, 1 bar, isothermal | Dimensions or space time, T, P |
| P9 | Reported performance | (model output, A1) | CH₄ conversion, H₂ yield, CO at the paper's conditions |

**Decision rule:** a units difference **alone is not a reason to edit**. The model already reaches about 100 % conversion, so rates 3600× too fast or too slow would saturate at equilibrium anyway. Record the difference. Edit only if the paper's R-1/R-2 are reversible or the units are wrong by a factor that would change a result you report (see C1–C3).

### B2. Catalyst loading vs reactor volume (check only)

The tube is π/4 × 0.378² × 18.9 = **2.12 m³**. Catalyst is 24.668 kg / 1500 kg/m³ = **0.0164 m³**, about 0.8 % of the tube. Rate basis is cat-wt, so only the 24.7 kg matters for the rate; the tube volume sets the residence time (29.9 s in the latest run). Confirm that P7 and P8 come from the same design. If they do not, record it; do not change either value without your decision.

---

## Property data cleanup


(Scope and status for this topic: see [A_will_do.md](A_will_do.md).)

### B3. HCO3⁻ heat capacity is likely ×4184 too large (review D1)

**Perry check:** not in Perry (no bicarbonate-ion data); a unit problem by inspection.

**Issue:** CPIG for HCO3- is entered under `MOLE-HEAT-CA = cal/mol-K`, but its numbers (19795 + 73.4·T) match J/kmol·K (the same numbers are entered for H2CO3 under SI).
**Error it causes:** none today (HCO3⁻ has no flow), but it would be wrong if chemistry were ever added.
**Steps:** CPIG-1 (the cal/mol-K set) → delete the HCO3- entry.

---

### B4. H2CO3 is a placeholder component (review C5)

**Perry check:** not in Perry (no carbonic acid data); placeholder values by inspection.

**Issue:** H2CO3 has dummy data (PLXANT 0/−1000, DHVLWT 100/300, OMEGA 7.18, PC 50, VC 150) and takes part in no reaction.
**Error it causes:** LCLIMS.3 and LCLIMS.4 out-of-bounds warnings.
**Steps:** first delete H2CO3 from every PROP-DATA set (PCES-1, PURE-2, CPIG-1, DHVLWT-1, MULAND-1, PLXANT-1). Then Components → Specifications → delete **H2CO3**. Also remove it from the H2S-SEP/NH3SEP split lists if Aspen asks.
**Verify:** 2 fewer warnings.

---

### B5. CYSTEINE data copied from PROLINE (review C7)

**Perry check:** not in Perry (no cysteine, proline or arginine); copy of PROLINE by inspection.

**Issue:**
- TC, PC, ZC, VC, PLXANT, DHVLWT, DHVLDP and the PCES values for CYSTEINE are identical to PROLINE's.
- The entered formula `C3H6NO2S` is one H short of cysteine (C3H7NO2S).

**Error it causes:** wrong cysteine volatility and enthalpy in B1 (small amounts, but wrong).
**Steps:**
1. Components → CYSTEINE → **Find** → confirm it maps to **L-cysteine C3H7NO2S**, and re-select it if not.
2. Delete CYSTEINE from PURE-1, PCES-1, DHVLWT-1, DHVLDP-1 and PLXANT-1.
3. Let the databank or PCES supply the values.

---

## Cleanup and documentation


(Scope and status for this topic: see [A_will_do.md](A_will_do.md).)

### B6. `PERMEATE.V` harmlessness test (5 min, Windows)
`PERMEATE.V` is fixed at 50 cc/mol (added in edit-6). No equation uses it, and Aspen re-flashes RET and PER at T and P, so it should not affect results.
1. Run; note RET/PER flows, CH₄/CO₂/H₂ fractions and temperatures.
2. METH → MEMB1 → Variables → `Permeate.V`: 50 → **25 000** (keep Fixed). Run.
3. Identical (to about 1e-6) → harmless; no further action (the ACM fix is parked, C17). Different → stop and record the numbers.
4. Set it back to 50, or do not save.

Correct values for reference: RT/P ≈ 25 204 cc/mol (PER, 1 bar, 30 °C) and ≈ 2 520 (RET, 10 bar), matching Aspen's `FEED.V` of 2 520.5.

### B7. Stream `NH3` warning icon (global flowsheet)
The GUI flags stream NH3 (NH3SEP liquid outlet); the `.his` logs no message for it. Open the stream's Status/Results and note what it says. One possibility: NH3SEP uses `FLASH-METHOD=GIBBS`, and this outlet needed 15 flash trials. Record the text; do not change anything.

---

## Assumptions and source check (membrane, digester)


(Check when the project's source paper is available.)

(Scope and status for this topic: see [A_will_do.md](A_will_do.md).)

Mark each row **confirmed / differs (new value) / not in source**. **Decision rule:** change a value only if it is clearly wrong (a wrong unit or a factor above about 2); otherwise record the difference.

### B8. Membrane data
| # | Item | Current model | What the source must show |
|---|---|---|---|
| PM1 | Membrane material | DDR zeolite | The zeolite type used in the project |
| PM2 | Π_CO₂ | 2.1e-7 mol/(m²·s·Pa) | Value, units (GPU or SI; 1 GPU = 3.348e-10 mol/m²·s·Pa), mixed or single gas |
| PM3 | Π_CH₄ | 3.03e-9 | Same (sets the selectivity, so it matters most) |
| PM4 | Π_H₂ | 1.36e-7 | Same; may be missing |
| PM5 | CO₂/CH₄ selectivity | ≈ 69 (ideal) | Mixed-gas separation factor; if only selectivity is given, Π_CH₄ = Π_CO₂ / selectivity |
| PM6 | Measurement T and P | 297 K, 2 bar | Conditions of the data |
| OP1–OP5 | Feed P, permeate P, T, area, pressure drop | 10 bar, 1 bar, 30 °C, 5 m², 0 | Source's operating values |

### B9. Digester and whole-process data
| # | Item | Current model | What the source must show |
|---|---|---|---|
| G1 | Feed | BIOMASS 8.5 t/d (75.2 % water) + WATERIN 13 t/d, 23 °C | Feedstock, flow, composition |
| G2 | Digester conditions | 55 °C, 1 atm, HRT 15 d (≈ 320 m³ liquid) | T, HRT or volume |
| G3 | Hydrolysis conversions | RSTOIC fixed conversions | Extents or kinetics |
| G4 | Kinetic constants | Calculator Monod/inhibition constants | k_max, K_S, inhibition constants |
| G5 | Hydrogenotrophic methanogenesis | not modelled | Included? parameters? |
| G6 | pH | fixed 6.5–7 | Operating pH |
| G7 | Expected performance | biogas CH₄ 58.7 % | Biogas yield, CH₄ %, specific CH₄ yield (validation target) |

### B10. Confirm that RSTOIC rxn 11 and rxn 8 do not fire (Windows, MCP read, 5 min)

**Finding (2026-10-07, from the stored stream 5 in the `.bkp`):** RSTOIC is set to `SERIES=NO`, so each conversion is applied to the **feed** amount of its key component. Rxn 11 (2 EtOH + CO₂ → 2 HAc + CH₄, 80 % of ETHANOL) and rxn 8 (XYLOSE → FURFURAL + 3 H₂O, 10 % of XYLOSE) have key components that are only made inside RSTOIC (by rxn 10 and rxn 7), so their extent is zero. Hand-computed extents against the stored outlet:

| Component in stream 5 (kmol/h) | If rxn 11 / rxn 8 are OFF | If they are ON | Stored value |
|---|---|---|---|
| ETHANOL | 0.06029 | 0.01206 | **0.06029** |
| ACETI-AC | 0.07707 | 0.12530 | **0.07707** |
| METHANE | 0.19454 | 0.20660 | **0.19454** |
| CO2 | 0.25483 | 0.24277 | **0.25483** |
| XYLOSE | 0.00617 | 0.00555 | **0.00617** (no furfural 0.00062) |

All other RSTOIC reactions match their hand-computed extents exactly (dextrose 0.12811, glycerol 0.02434, PALM 0.02968; unreacted cellulose 0.02261, hemicellulose 0.02466, starch 0.04522).

**Steps:** run once; read the component flows of stream **5** (ETHANOL, ACETI-AC, METHANE, CO2, XYLOSE, FURFURAL) through the MCP or Stream Results. Confirm they match the "OFF" column.
**Verify:** values recorded. If confirmed, the fix decision is parked in C26 / C27.

