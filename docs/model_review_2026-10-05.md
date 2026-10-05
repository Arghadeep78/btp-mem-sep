# Memb-Integration-1: Model Review (issues and fixes)

**Date:** 2026-10-05
**Scope:** read-only review of the files in `files/`. Nothing in the simulation was changed or run.
**Sources:**
- `Memb-Integration-1.his`: run log, including the full input echo (input lines 1–1905) and the calculation trace
- `Memb-Integration-1.bkp`: input, plus the stored ACM variable values (around line 14200)
- `Zeo_real.ATMLZ`: extracted to a scratch copy; `CustomModeling/Zeo_real.acmf`, PortDef, SolverSettings
- `zeo_real.acmf`: the desktop copy
- An element-balance script over every reaction, using the formulas as entered in Aspen

**Status legend:**
- ✅ **Confirmed**: read directly from the files or computed from them
- 🟡 **Likely**: strong evidence, but the final value can only be seen in a run or the GUI
- 🔍 **Check in GUI**: needs a look at results that aren't readable as text

**Not available for this review:** `.apw`, `.appdf`, `_3908gjr.*` and the crash dump are not in `files/`. Per-stream result tables are stored encrypted (`.ads`) and could not be read.

---

## Summary

| Severity | Count | IDs |
|---|---|---|
| Critical (results wrong) | 9 | M1–M4, M6, A1, A2, A3, A4, A5, A6, C1/R1 |
| Major (physics / basis) | 12 | R2/R3, B1–B7, §4.6, R4, R5, C2 |
| Calculator bugs (other) | 7 (2 benign) | §C |
| Property data / components | 10 (3 benign) | §D |
| Minor | 7 | §E |

---

## A. Critical: results are wrong

### M1–M4. MEMB1 (ACM): phantom component, unconstrained outlets, mass gain, charge imbalance ✅
**Evidence**
- Log: `!! Unable to find name for variable …` / `!! Index out of bounds (218 vars in list)` ×3.
- Log BALMAS.1: `MASS INLET FLOW = 0.011934, OUTLET = 0.072110 kg/s, RELATIVE DIFFERENCE = 5.04`.
- Stored ACM values in the `.bkp`:

  | Variable | Value | Meaning |
  |---|---|---|
  | `FEED.Z(METHANE)` | 0.60273 | real feed |
  | `FEED.Z(CO2)` | 0.39308 | real feed |
  | `FEED.Z(HYDROGEN)` | 0.004186 | real feed (sum = 1.000) |
  | `FEED.Z(CH4)` | 0.5 | **phantom**: not in Aspen's component list, default value |
  | `RETENTATE.Z(CH4)` | 0.55 | computed on the phantom |
  | `RETENTATE.Z(METHANE)`, `PERMEATE.Z(METHANE)` | 0.016129 = 1/62 | real methane is lost |
  | all other outlet z (water, amino acids, ions …) | 0.016129 = 1/62 | unconstrained: ACM default initial value |

- The ATMLZ source writes equations only for `z("CH4")` and `z("CO2")`; Aspen's ID is `METHANE`.
- Charge imbalance (BALCHG.1, relative difference −5.0) in METH.H2O-2, RET and PER comes from the free ion z's (H+, OH-, NH4+, … = 1/62). Nothing upstream carries ions.
- The run completed and saved. The crash dump was a later, separate event.

**Fix:** rewrite the ACM model (see §F) and re-export the ATMLZ.

### M6. ACM outlets are hard-coded; the physics is dead code ✅
`Permeate.F = 0.2*Feed.F`, `Permeate.z("CH4") = 0.3`, `Permeate.z("CO2") = 0.7`. The D, S, K, J and nCH4_P… equations are computed but never feed the outlets. There are 20 equations, matching the log's "Total number of equations = 20".
**Fix:** §F.

### A1. Even if wired up, the membrane physics gives ~zero permeation ✅
At T = 298.15 K, with the ATMLZ parameters:

| | D (m²/s) | S | K = D·S/L | `max()` floor | K used |
|---|---|---|---|---|---|
| CH₄ | 3.13e-11 | 1.33e-5 | 4.17e-10 | 1e-8 | **1e-8 (floor)** |
| CO₂ | 4.71e-10 | 5.96e-5 | 2.81e-8 | 5e-8 | **5e-8 (floor)** |

- J_CH4 = 1e-8 · 250 · (1.01325·0.6027 − 1.0·0.3) ≈ **7.8e-7**, against a feed of 1.59 kmol/h.
- J_CO2 = **0**: the fixed `Permeate.z("CO2") = 0.7` is higher than the feed's 0.393, so the driving force is negative and gets clipped to 0.
- Units are inconsistent: P is in bar (ACM ports), flows are in kmol/h, and the permeance has no stated basis. `P_perm` (Pa) is unused.

**Fix: replace the D·S/L parameter set with measured permeances.**

*Basis.* Perry's Chemical Engineers' Handbook (Sec. 20, membrane gas separation) defines permeance as the pressure-normalised flux (unit: GPU) and the partial-pressure flux law used below. Perry's does not tabulate zeolite-membrane permeances, so the values come from the primary literature (see the Sources list at the end of this section). Perry's itself was not available to read during this review.

*Unit conversion:* 1 GPU = 10⁻⁶ cm³(STP)/(cm²·s·cmHg) = **3.348 × 10⁻¹⁰ mol/(m²·s·Pa)**.

*Literature permeances, Π [mol/(m²·s·Pa)], near 297 K:*

| Membrane | Conditions | Π_CO2 | Π_H2 | Π_CH4 | CO₂/CH₄ selectivity | Source |
|---|---|---|---|---|---|---|
| **DDR (Al-DDR, modified): recommended default** | 297 K, 2 bar feed, single gas | **2.1 × 10⁻⁷** (≈ 630 GPU) | **1.36 × 10⁻⁷** | **3.03 × 10⁻⁹** | 69 (ideal); mixture ≈ 1.8 × 10⁻⁷ CO₂, roughly independent of feed composition | [1] |
| DDR (pure-silica) | 298 K, 0.2 MPa feed / 0.1 MPa permeate, single gas | 4.2 × 10⁻⁷ | n/r (order CO₂ > H₂ > CH₄) | 1.2 × 10⁻⁹ | 340 (ideal); 200 mixture (Π_CO2 = 3.0 × 10⁻⁷) | [2] |
| SAPO-34 | 297 K, CO₂/CH₄ mixture | 1.6 × 10⁻⁷ | n/r | — | 67 (mixture) | [3] |

The recommended default is DDR [1], because it is the only one of these sources that reports all three gases (CO₂, H₂, CH₄) measured on the same membrane. Use [2] as the high-selectivity case in a sensitivity run. In DDR the permeance order is CO₂ > H₂ > CH₄, so H₂ goes partly to the permeate; route it with its own Π_H2 rather than 100 % to the retentate.

*Flux law*, applied to each of CH₄, CO₂ and H₂, with the well-mixed retentate composition x_i and permeate composition y_i:

  n_P,i [kmol/h] = Π_i · A · (P_F·x_i − P_P·y_i)[Pa] · 3.6     (3.6 = 3600 s/h ÷ 1000 mol/kmol)

ACM port pressures are in bar, so Δp[Pa] = 1e5 · (Feed.P·x_i − Permeate.P·y_i).

*Smooth forms.* Remove the `max()`/`min()` clamps. With x_i and y_i solved implicitly, the well-mixed equations bound themselves. If a guard is still needed, use smax(a) = 0.5·(a + sqrt(a² + ε²)) with ε ≈ 1e-6 bar.

*Temperature.* The data above are at 297–298 K and the membrane feed is about 298 K (keep the compressor aftercooler at 25–30 °C). Use Π at T_ref = 297 K and do not extrapolate. In DDR, CO₂ permeance **decreases** with temperature (adsorption-dominated transport) [1]. The current form S = S0·exp(−H/RT) with H > 0 gives the opposite trend. If T dependence is needed, use Π_i(T) = Π_i,ref · exp[−(E_i/R)(1/T − 1/T_ref)], with E_i fitted to the 297–453 K data in [1]. Read T from `Feed.T`, not the fixed parameter.

*Sizing check (affects the A parameter).* The feed CO₂ is 1.593 kmol/h × 0.393 = 0.626 kmol/h.
- At 10 bar feed (A2), Δp_CO2 is roughly 3 bar, so the flux is about 2.1e-7 · 3e5 · 3.6 ≈ 0.23 kmol/(h·m²). The required area is of order **3–10 m², not 250 m²**.
- At 1 atm with the permeate at 1 bar, there is no positive driving force: P_F·x_CO2 = 0.40 bar while P_P·y_CO2 is about 0.9 bar. The separation is **pressure-ratio limited**, which is why A2 (compressor or permeate vacuum) is required.

*Water.* Humidity strongly reduces CO₂ permeance in DDR [1]. GAS2 is dry because NH3SEP removes all water, so the dry values above apply.

*Sources:*
1. Yang, Cao, Arvanitis, Sun, Xu, Dong, "DDR-type zeolite membrane synthesis, modification and gas permeation studies", *J. Membr. Sci.* (2016). [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0376738816300436) · [OSTI full text](https://www.osti.gov/servlets/purl/1253193)
2. Himeno, Tomita et al., "Synthesis and Permeation Properties of a DDR-Type Zeolite Membrane for Separation of CO₂/CH₄ Gaseous Mixtures", *Ind. Eng. Chem. Res.* (2007). [doi:10.1021/ie061682n](https://pubs.acs.org/doi/10.1021/ie061682n)
3. Li, Falconer, Noble, "SAPO-34 membranes for CO₂/CH₄ separation", *J. Membr. Sci.* (2004). [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0376738804003217)

### A2. No compressor before the membrane ✅
Feed is at 1.01325 bar (GAS2) and permeate at 1.0 bar (`PERMEATE.P SPEC=CONST`), so Δp ≈ 0.013 bar total. Gas-separation membranes need about 5–15 bar feed or a vacuum on the permeate.
**Fix:** add a `COMPR` (with an aftercooler) between PURGAS and MEMB1. Set the retentate P ≈ feed P (minus a small drop). If the pyrolysis stays at 1 bar, add a valve before HEAT2.

### A3. VFA degradation (ACETOGEN 2, 3, 4) is effectively switched off ✅
- Every calculator reads stream **5**, the B1 *inlet*.
- Propionate, butyrate and valerate (PROPI-01, ISOBU-01, ISOVA-01) are produced **only inside B1** (ACIDOGEN, AMINOACI). They are not in BIOMASS, and no RSTOIC reaction makes them, so their flow in stream 5 is zero.
- The calculators then use C = 1e-8, which gives a Monod factor N = 1/(1 + U/(1e-8/V̇)) ≈ 4e-8, so the rate constant k ≈ 0.
- More generally, a CSTR rate should use the **reactor (outlet) concentrations**, not the feed concentrations. This affects every substrate and inhibition term (HAc, H₂, NH₃ produced in B1 are underestimated).

**Fix (proper):** move the kinetics into a user kinetics subroutine for RCSTR B1, so rates are evaluated at reactor conditions.
**Fix (quick):** make the calculators read the B1 **LIQUID** outlet (component mass flows and volume flow) and let Aspen tear-converge the loop around B1.

### A4. GLYCDEG never writes its result ✅
`DEFINE KINETIIC …ACIDOGEN… ID1=2` (typo). The code computes `KINETIC = L*N*M*O*Q`, a local variable, while `WRITE-VARS KINETIIC` writes back the unchanged value. ACIDOGEN rxn 2 therefore keeps its static `PRE-EXP = 1.0079E-6`.
**Fix:** rename the DEFINE and WRITE-VARS to `KINETIC`.

### A5. BUTYDEG reads a mass fraction as a mass flow ✅
`DEFINE BUTYFLOW MASS-FRAC STREAM=5 … COMPONENT=ISOBU-01`, which is then divided by the volume flow (m³/h). Every other calculator uses `MASS-FLOW … UOM="kg/hr"`.
**Fix:** `DEFINE BUTYFLOW MASS-FLOW STREAM=… SUBSTREAM=MIXED COMPONENT=ISOBU-01 UOM="kg/hr"`.

### A6. Tyrosine and tryptophan degradation have product terms in the rate law 🟡
`POWLAW-EXP 19 … TYROSINE 1 / PHENOL 1 / ACETI-AC 1` and `POWLAW-EXP 20 … TRYPTOPH 1 / INDOLE 1 / ACETI-AC 1`. PHENOL and INDOLE are made only by these reactions, so the rate is autocatalytic. Starting from zero, the solver will most likely sit at the trivial solution r = 0. The calculator also writes k in 1/s, which does not fit a third-order law.
**Current impact: none.** TYROSINE, TRYPTOPH, METHIONI and LYSINE have no source in the model: they are not in BIOMASS, KERATIN (RSTOIC 13) doesn't yield them, and PROT bypasses the amino acids. AMINOACI rxns 6, 14, 19 and 20 therefore always run at zero. The fix matters once a source is added (B6 option, or an extended keratin composition).
**Fix:** keep only `TYROSINE 1.0` and `TRYPTOPH 1.0` in POWLAW-EXP.

### C1/R1. PALM is defined as hexadecanol, which breaks RSTOIC 3, 5, 6 ✅
- `PALM C16H34O` (1-hexadecanol, calculated MW 242.4454) with a forced `REVIEW-1 MW PALM 256.1449667`. Log LOADMW.5 (information).
- RSTOIC mass errors (ZURE07.8): −0.85174, −0.28391, −0.28391. The ratio is exactly 3:1:1, matching PALM's coefficient (3, 1, 1).
- Element balance with C16H34O: rxn 3 ΔH +6, ΔO −3; rxns 5 and 6 ΔH +2, ΔO −1. **All three close exactly with palmitic acid C16H32O2.**

**Fix:** replace PALM with databank palmitic acid (Components → Find "palmitic", C16H32O2). Delete the `REVIEW-1 MW PALM` entry and re-retrieve the PALM NRTL pairs (WATER, BENZENE, ETHANOL).

---

## B. Major: physics or modelling basis

### R2/R3. ACETOGEN 1, 5, 6 fail the element balance ✅
Log RXMBCK.1 mass errors: 0.16430, 0.016550, 0.28084. Element balance (products − reactants):

| Rxn | Substrate | ΔC | ΔH | ΔO |
|---|---|---|---|---|
| 1 | oleic | +0.409 | −7.567 | +0.180 |
| 5 | linoleic | +0.409 | −5.807 | +0.060 |
| 6 | PALM (as C16H34O) | +1.249 | −1.069 | 0 |
| 6 | PALM after the C1 fix (C16H32O2) | +1.249 | +0.931 | −1.000 |

The coefficients appear to come from an ionic-form model (oleate⁻, HCO₃⁻, NH₄⁺, acetate⁻) but were applied to neutral species.
**Fix:** rebuild from balanced catabolic cores (all three checked exactly), then add the biomass yield (C5H7NO2) and close the balance with CO₂/NH₃/H₂O:
- Oleic: C18H34O2 + 16 H₂O → 9 HAc + 15 H₂
- Linoleic: C18H32O2 + 16 H₂O → 9 HAc + 14 H₂
- Palmitic: C16H32O2 + 14 H₂O → 8 HAc + 14 H₂

All other reactions pass the element balance: RSTOIC 1, 2, 4, 7–11, ACIDOGEN 1–2, AMINOACI (all 21), METHAN, H2, R-1, R-2 and the LHHW sets. RSTOIC 12/13 balance by mass; PROT and KERATIN have no formula.

### B1. No Henry components ✅
The input defines no `HENRY-COMPS` set. The `.bkp` has a HENRY parameter form, but it is never activated. CO₂, CH₄, H₂, H₂S and CO are therefore handled by NRTL with extrapolated vapour pressures, and the WATER–CO2, WATER–H2S and WATER–CH4S NRTL parameters are all 0. Gas solubility in the digestate and the B1/FLASH vapour–liquid splits are unreliable.
**Fix:** Properties → Components → Henry Comps → new `HC-1` = CO2, METHANE, HYDROGEN, H2S, CO. Methods → Global → Henry components = HC-1, in both the global section and METH. Confirm that the HENRY parameters are retrieved (APV140 BINARY / HENRY-AP).

### §4.6. B1 RCSTR volume basis 🔍
Log: `VOLUME = 19036.4` m³, `RES TIME = 1.296E6 s` (15 d), vapour fraction 0.0416. The liquid throughput is about 21.5 t/d, so 15 d ≈ **320 m³** of liquid. The residence-time spec is applied to the total (vapour + liquid) outlet volume.
**Check:** B1 → Results: condensed-phase volume and residence time.
**Fix if wrong:** specify the reactor volume plus the condensed-phase volume fraction, or a condensed-phase residence time.

### R4. AMINOACI activation-energy unit slip ✅
Rxns 17 (valine) and 19 (tyrosine): `ACT-ENERGY = −5.921695E+10` J/kmol, against −1.4143726E+7 for the rest. The ratio is exactly 4186.8 (cal ↔ J ×1000). No effect at T = T-REF = 328.15 K, but it blows up if B1's temperature changes.
**Fix:** set both to −1.4143726E+7.

### R5 (refined). Double temperature correction, AMINOACI only ✅
AMINODEG applies `Z = 70·exp(−(−14143.7/8.314)(1/T − 1/T0))`, and AMINOACI also carries ACT-ENERGY −1.414e7 J/kmol with T-REF 328.15. ACETOGEN, ACIDOGEN and METHAN have ACT-ENERGY = 0, so they are not affected.
**Fix:** set the AMINOACI ACT-ENERGY to 0, consistent with the other sets.

### B2. Irreversible RWGS and CH₄ cracking at 790 °C 🟡
R-2 (CO₂ + H₂ → CO + H₂O) is an irreversible POWERLAW. RWGS is close to equilibrium around 800 °C, so CO is over-predicted. R-1 (CH₄ → C + 2 H₂) is also irreversible.
**Fix:** use the already-defined `RWGS` LHHW set (it has a reverse driving-force term; check its parameters), or add a reverse reaction. Consider an equilibrium limit for R-1.

### B3. R-1/R-2 pre-exponential units ✅ (units inherited) / 🔍 (value)
R-1 and R-2 have **no `IN-UNITS` line**, so PRE-EXP (474600 and 24600) inherits the global **MET** units (hour time basis). ACT-ENERGY is given explicitly in kJ/mol.
**Fix:** check these against the source paper's units. Add `IN-UNITS SI` if they are per second.

### B4. CH4PYRO catalyst loading vs reactor volume ✅ (numbers) / 🔍 (intent)
The tube is π/4 · 0.37795² · 18.8976 = **2.12 m³**. Catalyst is 24.668 kg / 1500 kg/m³ = **0.0164 m³**, about 0.8 % of the volume.
**Fix:** confirm that the catalyst mass and tube size come from the same design basis.

### B5. Hydrogenotrophic methanogenesis missing ✅
B1 has no CO₂ + 4 H₂ → CH₄ + 2 H₂O. All H₂ goes to acetate through the equilibrium `H2` set (2 CO₂ + 4 H₂ → HAc + 2 H₂O).
**Fix:** add it as a kinetic reaction if your reference model (ADM1-type) includes it.

### B6. Part of the CH₄ bypasses the kinetics ✅
RSTOIC rxn 12 (PROT → 6.5 CO₂ + 6.5 CH₄ + 3 NH₃ + H₂S, 90 % conversion) and rxn 11 (2 EtOH + CO₂ → 2 HAc + CH₄, 80 %) make methane in the hydrolysis step at fixed conversion.
**Fix:** this is a modelling choice; state it in the report. Consider routing PROT to amino acids, as KERATIN already is (rxn 13).

### B7. pH logic does nothing ✅
H⁺ never has flow (no CHEMISTRY block), so AMINODEG's computed pH = −log₁₀(1e-7/V̇) ≈ 6.95. The other calculators hard-code `PH = 6.5`. pH inhibition is therefore inactive everywhere.
**Fix:** state a fixed pH explicitly, or add an electrolyte CHEMISTRY block.

### C2. Missing and inconsistent heats of formation ✅
DGCHK1.1 (B1): DHFORM/DHAQFM is missing for TYROSINE, TRYPTOPH and METHIONI ("incorrect enthalpy results"). These three never have flow (see A6), so the missing values don't change any number today. The REVIEW-1 values (e.g. alanine −561.2 kJ/mol) look like **solid-state** ΔHf, but Aspen's DHFORM is the ideal-gas value. That mixed basis does affect B1's duty today, because those amino acids come from KERATIN.
**Fix:** use one basis for all amino acids. Either enter NIST gas-phase values, or define the molecular structures and let PCES (Benson) estimate them consistently.

---

## C. Calculator bugs (other)

| Calc | Bug | Status | Fix |
|---|---|---|---|
| LINODEG, PALMDEG | `O = (LCFAFLOW / C_VOL)/5.` but `LCFAFLOW` is never DEFINEd. The stored results show it reads as 0, so the Haldane self-inhibition term is missing (PALMDEG k over-predicted ~2.7×) | ✅ | Use the block's own substrate, as OLEICDEG does: `O = (C_LINO / C_VOL)/5.` and `O = (C_PALM / C_VOL)/5.` |
| BUTYDEG, DEXTDEG, GLYCDEG, METHAN, PROPDEG, VALEDEG | The LCFA inhibition term uses OLEICACI only; palmitic and linoleic acid are ignored (pool 9.59 vs 18.88 kg/m³ in stream 5) | ✅ | Sum all three: `C_LCFA = LCFAFLOW + LINOFL + PALMFL`, with two new Mass-Flow Defines |
| PROPDEG | `C_TNH3 = NH3 + NH4`, but only `TNH3FLOW` is defined (NH3 is uninitialised) | ✅ | `C_TNH3 = TNH3FLOW + NH4` |
| AMINODEG | `HIS` is in `AA1` but is never defined (histidine is not a component) | ✅ | Remove HIS |
| AMINODEG | KIN15/KIN16 are wired to IDs 16/15; KIN3 and KIN12 are assigned but not defined | ✅ harmless (all equal K) | Tidy |
| METHAN | Computes the H₂ term `S` and the pH factor `Q`, but `K = L·N·M·O·P·R` uses neither. At pH 6.5, R = 1.00 and Q = 0.39 | ✅ | Decide on intent; include S and Q if you want them |
| VALEDEG | Reads NH4 but uses only TNH3FLOW in the NH₃ total | ✅ | Make it consistent with the other calculators |
| all | AFLEXC.1 ×10 "sequence may be inconsistent" | ✅ benign | None needed (it will change if A3 is fixed with a tear) |

Implicit Fortran typing was checked: every variable starting with I–N is declared REAL, so there are no integer truncation bugs.

---

## D. Property data / components

| ID | Issue | Status | Fix |
|---|---|---|---|
| C5 | ETHANOL CPIG gives 15.697 J/kmol·K (LCCHCK.4). The coefficients are cal/mol·K with T in °C, entered under SI | ✅ | Delete the ETHANOL entry from PROP-DATA CPIG-1; the databank value is good |
| D1 | HCO3⁻ CPIG is entered under `MOLE-HEAT-CA='cal/mol-K'`, but its magnitudes (19795 + 73.4·T) match J/kmol·K (the same numbers are used for H2CO3 under SI). Likely ×4184 too large | 🟡 | Delete it (no flow) or re-enter it under SI |
| C5 | H2CO3 has placeholder data: PLXANT 0/−1000, DHVLWT 100/300, OMEGA 7.18 (LCLIMS ×2). It takes part in no reaction | ✅ | Delete the component |
| D2 | NH4+ is defined with formula **H3N**, i.e. a neutral copy of NH₃. Its NRTL pairs are copied from NH₃ | ✅ | Delete it, or use a real ion with chemistry |
| C7 | CYSTEINE copies PROLINE: TC/PC/ZC/VC, PLXANT, DHVLWT, PCES VB/OMEGA/RKTZRA/VLSTD/DHVLB (MULAND nearly the same). The entered formula C3H6NO2S is one H short of cysteine (C3H7NO2S) | ✅ data / 🔍 formula | Re-pick the databank cysteine and enter real data |
| D3 | REVIEW-1 VLSTD is copy-pasted: THREONIN = VALINE = ASPARTIC = 0.156261; SERINE = ALANINE = 0.0588971 | ✅ | Re-enter real values, or delete and use the databank/PCES |
| C3 | DHVLWT + DHVLDP both entered for PROLINE, CYSTEINE, ARGININE (DPRSW2.3; DHVLWT is used) | ✅ | Delete the DHVLDP-1 set |
| C4 | GLYCINE VLSTD entered twice (PCES-1 50.745 cc/mol vs REVIEW-1 0.0507284 m³/kmol) (PVAL.7) | ✅ harmless | Delete one |
| C5 | CARBON TC = 0.001 and VC = 0 out of bounds | ✅ benign (CISOLID) | Ignore |
| C6 | PCERTE.10 "structure not defined" for all 62 components | ✅ information only | Matters only for PROT, KERATIN and INERT (PC-USER). Add structures only where estimation is needed |

---

## E. Minor / cleanup

| ID | Item | Fix |
|---|---|---|
| P1 | PURGAS/WASTE is empty by design (USP03.1: only WASTE's own flash is skipped; nothing is downstream). Its FRAC list includes CARBON in MIXED, which does nothing | Delete PURGAS or give it a real purge fraction |
| E1 | FLASH3 (30 °C) is redundant once MEMB1 is fixed: NH3SEP already removes all water, so FLASH3 currently only removes MEMB1's garbage components | Keep or delete after the ACM fix |
| E2 | NH3SEP is really an ideal "keep CO₂/H₂/CH₄/CO, remove everything else (water included)" splitter. H2S-SEP was checked: it sends only H₂S to stream H2S | Rename or document |
| P2 | `TRUE-COMPS=YES`, `FREE-WATER=STEAM-TA` and `SOLU-WATER=3` in METH have no effect (no chemistry; FREE-WATER=NO in the blocks) | Remove |
| E3 | MEMB1 block has `IN-UNITS ENG`. Harmless (ACM values are in native units) but confusing | Set to SI/MET |
| E4 | A sensitivity analysis on B1 RES-TIME (1–40 d, tabulating CH₄ in BIOGAS and B1 volume) exists only in a hidden buffer in the `.bkp`, so it is inactive | Re-activate if needed |
| — | The CO2METH and COMETH LHHW sets are unused | Delete, but keep `RWGS` if adopting B2 |

---

## F. ACM rewrite: required structure

1. Use Aspen's real IDs, held in string parameters: `"METHANE"`, `"CO2"`, `"HYDROGEN"`.
2. Write equations over the **whole ComponentList**:
   ```
   Permeate.F*Permeate.z(c)   = theta(c)*Feed.F*Feed.z(c)
   Retentate.F*Retentate.z(c) = (1-theta(c))*Feed.F*Feed.z(c)
   Permeate.F + Retentate.F   = Feed.F
   ```
   theta(c) = 0 for every component except CH₄, CO₂ and H₂.
3. Get theta for CH₄/CO₂/H₂ from the permeance (values and basis: §A1):
   - Default DDR values, mol/(m²·s·Pa): Π_CO2 = 2.1e-7, Π_H2 = 1.36e-7, Π_CH4 = 3.03e-9 at T_ref = 297 K.
   - Well-mixed: n_P,i = Π_i·A·1e5·(Feed.P·Retentate.z(i) − Permeate.P·Permeate.z(i))·3.6 [kmol/h], with theta(i) = n_P,i / (Feed.F·Feed.z(i)).
   - No `max`/`min`; use smax only as a guard.
   - Re-size A: of order 3–10 m² at about 10 bar feed, not 250 m².
   - In DDR the order is CO₂ > H₂ > CH₄, so H₂ partly permeates.
4. Use a port type that carries T, P and h. Add `Retentate.T = Feed.T`, `Permeate.T = Feed.T`, `Retentate.P = Feed.P` (or minus a drop), and a fixed `Permeate.P`. This removes the unphysical 487.8 K (RET) and 526.5 K (PER) outlet flashes.
5. Read T from `Feed.T`, not the fixed parameter (currently 298.15 is set from Aspen).
6. Re-export the ATMLZ after every change and copy the source back to the desktop `zeo_real.acmf`. The desktop file is currently an older 10 %-split variant, different from the ATMLZ.

---

## G. Corrections to `CLAUDE.md`

- File inventory: `_3908gjr.*`, `.apw`, `.appdf` and the crash dump are not in `files/`.
- M9 ("ACMEXP block METH.B1 is not initialized properly") **cannot be verified** with the files present; it is not in `Memb-Integration-1.his`.
- R5 applies to **AMINOACI only**.
- New items not yet in the register: A1–A6, B1–B7, D1–D3, E1–E4.

---

## H. Suggested order for the Windows session

1. **One-line edits:** A4 (GLYCDEG typo), A5 (BUTYDEG MASS-FLOW), A6 (AMINOACI 19/20 orders), R4 (Ea slip), the §C calculator fixes.
2. **PALM → palmitic acid** (C1), then re-derive ACETOGEN 1, 5, 6 (R2/R3).
3. **Henry components** (B1); then check the B1 volume basis (§4.6).
4. **Kinetics basis** (A3): calculators read the B1 outlet with a tear, or a user kinetics subroutine.
5. **ACM rewrite** (§F) plus a **compressor** (A2), with real permeances (A1).
6. **Pyrolysis:** units (B3), reversibility (B2), catalyst loading (B4).
7. **Cleanup:** §D, §E.

After each step, re-run and compare: the warning count (currently 15), MEMB1 BALMAS, CH₄ in BIOGAS and B1 volume.
