# Memb-Integration-1 — Biogas → Zeolite Membrane → CH₄ Pyrolysis (Aspen Plus V14 / ACM)

Reference notes built from a read-only review of `files/` on 2026-10-05.
Sources: `_3908gjr.inm` (full input language), `_3908gjr.his` / `Memb-Integration-1.his` (run log, identical runs),
`zeo_real.acmf`, and the contents of `Zeo_real.ATMLZ` (a zip; extracted copy only, original untouched).

> **Working rule for this folder:** do not modify simulation files unless explicitly asked. Analyse, then propose.

---

## 1. File inventory

| File | What it is | Notes |
|---|---|---|
| `Memb-Integration-1.bkp` | Aspen Plus backup (text) — **source of truth for the flowsheet** | Runid `memb-integration-1`, originally run from `C:\Users\CAPE\Desktop\Arg` |
| `Memb-Integration-1.apw` / `.appdf` / `.ads` / `.his` / `.def` | Aspen working doc, results, run history | `.his` = run log with all warnings |
| `_3908gjr.*` | Aspen's temp run directory files | `.inm` = **readable full input file** (best file to read the model); `.his` = run log; `.jnl` = GUI command journal |
| `zeo_real.acmf` | ACM text model (the "notepad file") | **NOT the version Aspen runs** — see §5 |
| `Zeo_real.ATMLZ` | Exported ACM model loaded by Aspen Plus block `METH.MEMB1` | Zip; contains its own `CustomModeling/Zeo_real.acmf` (encrypted `ModelDef`) |
| `AM_zeo_real/` | ACM Properties Plus working folder | Not needed for Aspen Plus |
| `aspenplus_ExceptionDump_Mon_Oct__5_14_46_23_2026.dmp` | Aspen crash dump (14:46, after last logged run at 14:19) | Crash consistent with MEMB1 index-out-of-bounds |

The `.bkp` references the ACM model only by name (`MODEL="Zeo_real"`), so the `.ATMLZ` must stay reachable by Aspen (working folder or registered library). If you move files, re-check that link.

---

## 2. Flowsheet

Screenshots of the Aspen GUI flowsheets (captured 2026-10-05):
- Global: [docs/flowsheets/flowsheet_global.png](docs/flowsheets/flowsheet_global.png). Warning icon on stream **NH3**.
- METH hierarchy: [docs/flowsheets/flowsheet_METH_hierarchy.png](docs/flowsheets/flowsheet_METH_hierarchy.png). Warning icons on **PURGAS** (WASTE zero flow), **MEMB1** (mass balance) and **FLASH3** (charge balance, inherited from MEMB1).

### Global section (anaerobic digestion + gas cleanup)
```
BIOMASS (8.5 t/d, 23 °C) ─┐
WATERIN (13 t/d water)  ──┴─ MIX1 ─ FEED ─ RSTOIC (hydrolysis, 55 °C) ─ 5 ─ B1 RCSTR (55 °C, 15 d, 2-phase)
                                                                           ├─ LIQUID (digestate, out)
                                                                           └─ BIOGAS ─ FLASH (25 °C,1 atm)
                                                                                         ├─ H2O1 (out)
                                                                                         └─ GAS ─ H2S-SEP ─ GAS2 ─ NH3SEP ─ GAS3 ─ $C-1 ─► METH.GAS
                                                                                                    └─ H2S          └─ NH3 (out: everything except CO2/H2/CH4/CO)
```
**NH3SEP is really a "keep only CO2, H₂, CH₄, CO" splitter**: GAS3 gets fraction 1 of CO2, HYDROGEN, METHANE, CO and 0 of everything else, water included. **The METH hierarchy therefore only ever sees 4 non-zero components.** CO is essentially zero because nothing upstream makes CO.

### Hierarchy `METH` (upgrading + pyrolysis), `SOLVE METHOD=SM`
```
GAS ─ PURGAS (SEP) ─ GAS2 ─ MEMB1 (ACM Zeo_real) ─ RET ─ FLASH3 (30 °C, 1 bar) ─ PROD4 ─ HEAT2 (790 °C, 1 bar) ─ PYROIN ─ CH4PYRO (RPLUG) ─ FINPROD
        └─ WASTE (always 0)                 └─ PER (out)          └─ H2O-2 (out)
```
- PURGAS sends fraction 1 of WATER/CO2/H₂/CH₄/CO/CARBON to GAS2, so WASTE is always empty (by design).
- CH4PYRO: L = 18.9 m, D = 0.378 m, T-spec 790 °C, catalyst 24.668 kg (ρ = 1500 kg/m³), vapour phase. Reactions R-1 (CH₄ → C(s) + 2 H₂) and R-2 (CO₂ + H₂ → CO + H₂O).

### Property methods
- Global: `NRTL` (secondary `PENG-ROB`), `ESTIMATE ALL`, stream class `MIXCISLD` (CARBON is CISOLID).
- METH: `NRTL` with `FREE-WATER=STEAM-TA SOLU-WATER=3 TRUE-COMPS=YES`. There is no CHEMISTRY block, so `TRUE-COMPS` does nothing.
- 22 databanks enabled (APV140 PURE40/AQUEOUS/SOLIDS/…, NIST-TRC, AP-EOS).

### Components (62)
Water; glycerol; LCFAs (OLEICACI, LINOLEIC, PALM); sugars (DEXTROSE, GLUCOSE, XYLOSE); VFAs (ACETI-AC, PROPI-01, ISOBU-01, ISOVA-01, ACETATE); 17 amino acids; biomass `C5H7NO2`; gases (CO2, HYDROGEN, **METHANE** (ID is `METHANE`, not `CH4`), CO, H2S, NH3, CH4S); aromatics (BENZENE, PHENOL, INDOLE, FROMAMID, FURFURAL); ions (H+, OH-, NH4+, HCO3-, CO3-2, HS-, H2CO3); polymers (CELLULOS, HEMECELL, STARCH, TRIOLEIN, TRIPALM, SN-1--01, SN-1--02); user-defined PROT, KERATIN, INERT (PC-USER); CARBON (CISOLID); ETHANOL.
The ions never get flow because there is no chemistry. They act as placeholders that the calculators read (and get 0).

---

## 3. Reactions

| Set / block | Type | Content |
|---|---|---|
| `RSTOIC` block | 13 stoich. rxns, conversions | Hydrolysis: cellulose/starch→dextrose, hemicellulose→HAc/xylose, TAGs/DAGs→glycerol+LCFA, xylose→furfural, cellulose→EtOH+CO₂, EtOH+CO₂→HAc+CH₄, PROT→CO₂/CH₄/NH₃/H₂S, KERATIN→amino acids |
| `ACIDOGEN` (B1) | PowerLaw, 2 | dextrose, glycerol → VFAs + biomass |
| `ACETOGEN` (B1) | PowerLaw, 6 | oleic(1), propionate(2), butyrate(3), valerate(4), linoleic(5), palmitic(6) → HAc + H₂ |
| `AMINOACI` (B1) | PowerLaw, 21 (IDs 1–23 without 3, 12) | Stickland-type amino-acid degradation |
| `METHAN` (B1) | PowerLaw, 1 | acetoclastic methanogenesis |
| `H2` (B1) | Equilibrium | 2 CO₂ + 4 H₂ → HAc + 2 H₂O |
| `R-1`, `R-2` (CH4PYRO) | PowerLaw, cat-wt basis | CH₄ cracking, RWGS |
| `CO2METH`, `COMETH`, `RWGS` | LHHW | **Defined but not used by any block** |

### Calculator blocks (all `EXECUTE BEFORE BLOCK B1`; they read stream `5` and write rate constants)

| Calculator | Writes PRE-EXP of | Notes |
|---|---|---|
| AMINODEG | AMINOACI 1–23 (not 3, 12) | Uses computed pH (not overridden) |
| DEXTDEG / GLYCDEG | ACIDOGEN 1 / 2 | |
| OLEICDEG / PROPDEG / BUTYDEG / VALEDEG / LINODEG / PALMDEG | ACETOGEN 1 / 2 / 3 / 4 / 5 / 6 | `PH = 6.5` hard override, so pH inhibition is off |
| METHAN | METHAN 1 | `PH = 6.5` override |

Pattern: Monod substrate term × NH₃/LCFA/HAc/H₂ inhibition × Arrhenius-like correction around T0 = 55 °C. B1 runs at exactly 55 °C, so the temperature terms are currently 1.

---

## 4. Issue register (self-diagnosed list checked against the run log)

Legend: ✅ confirmed in log · 🔧 corrected/refined · ➕ new finding

### 4.1 METH.MEMB1 (ACM) — **root cause of most METH problems**

| # | Issue | Status | Evidence / root cause |
|---|---|---|---|
| M1 | Crash / "index out of bounds", mass generation | ✅🔧 | Log: `!! Unable to find name for variable …` / `!! Index out of bounds (218 vars in list)` ×3. `MASS IN = 0.011934 kg/s, OUT = 0.072110 kg/s, rel. diff = 5.04` (+504 %). The ports are sized to Aspen's 62 components (218 vars), but the model only writes equations for z("CH4") and z("CO2"). |
| M2 | METHANE vs CH4 ID conflict | ✅ | Aspen component ID is `METHANE` (formula CH4). ACM looks up `z("CH4")`, which does not exist in Aspen's list, so the lookup fails and you get the "unable to find name" errors. The "0.5 vs 0.6027" duplicate values you observed fit this, but the log can't show them directly. |
| M3 | No equations for the other components | ✅🔧 | Only **4** components are non-zero in GAS2 (CO2, H₂, CH₄, ~0 CO). The real gap is **H₂**, plus all 60 zero-flow z's left as **free, unbounded variables**. Free z's on the outlets → Aspen sums garbage × MW → mass generation and the negative ionic flows seen in M4. |
| M4 | Charge imbalance in METH.H2O-2, RET, PER | 🔧 symptom of M1–M3 | No ion has any flow upstream (no chemistry), and RET and H2O-2 show identical anion/cation numbers, so the ions come from MEMB1's unconstrained outlet z's. FLASH3 sends them all to liquid. This fixes itself once MEMB1 constrains every component. |
| M5 | The ATMLZ ≠ the desktop `.acmf` | ➕ | Aspen runs the **ATMLZ** version (20 equations, which matches the log's "Total number of equations = 20"). The desktop `.acmf` is an older 10 %-split variant (12 equations). Edits to the `.acmf` do nothing until you re-export. |
| M6 | Hard-coded results in the exported model | ➕ | ATMLZ `Zeo_real`: `Permeate.F = 0.2*Feed.F`, `Permeate.z("CH4")=0.3`, `Permeate.z("CO2")=0.7`. The permeance/flux equations (D, S, K, J, nCH4_P …) are computed but **never feed the outlets** (dead code). |
| M7 | No T / h equations | ➕ | Outlet T, h aren't defined by the model. The log shows the outlets flashing to **487.8 K (RET) and 526.5 K (PER)** from a 298 K feed, with P = 1 bar from `PERMEATE.P SPEC=CONST`. The temperatures are meaningless. |
| M8 | Units / robustness | ➕ | `T` is a fixed parameter (323.15 K, overridden to 298.15 in Aspen) rather than `Feed.T`. Driving force uses port P (ACM ports are in bar) while `P_perm` is in Pa and is unused. J (from SI permeance) is compared with flows in kmol/h inside `min()`. `max()`/`min()` are non-smooth and hurt Newton convergence. |
| M9 | Stale reference | ➕ | Log tail: `ACMEXP block METH.B1 is not initialized properly`. That name doesn't exist in METH (the block is MEMB1). Probably a leftover name from before the block was renamed. |

**Decision pending (user):** how to route the non-CH₄/CO₂ species. Only H₂ is actually present.
In zeolite membranes H₂ (kinetic diameter ≈ 2.9 Å) permeates faster than CO₂ (3.3 Å) and CH₄ (3.8 Å). Sending 100 % of H₂ to the retentate is therefore not physical, though it's acceptable as a first approximation because the retentate goes to pyrolysis, which makes H₂ anyway. Recommended: give H₂ its own permeance (or a fixed split fraction). Send every other component 100 % to the retentate (all have zero flow anyway).

### 4.2 Hierarchy METH, other

| # | Issue | Status | Notes |
|---|---|---|---|
| P1 | PURGAS: WASTE zero flow | ✅🔧 **benign** | `USP03.1`: only WASTE's *own* flash is skipped, and nothing is downstream of WASTE. It's empty by design (every fraction is 1 and GAS only contains the 4 gases). Either delete PURGAS or give it a real purge fraction. |
| P2 | `TRUE-COMPS=YES` without chemistry | ➕ | Has no effect. NRTL in a 790 °C gas section is fine at 1 bar (ideal vapour), but PENG-ROB would be the natural choice there. |

### 4.3 Reaction stoichiometry

| # | Issue | Status | Root cause |
|---|---|---|---|
| R1 | RSTOIC rxns 3, 5, 6 fail mass balance (−0.852, −0.284, −0.284) | ✅🔧 **all caused by PALM** | See C1. With palmitic acid C₁₆H₃₂O₂ (MW 256.43), rxn 3: TRIPALM (807.34) + 3 H₂O = glycerol (92.09) + 3 × 256.43 = 861.38 — **exact**. With the entered 256.145 → −0.855, which matches the log. Rxns 5 and 6 are atom-balanced with palmitic acid too. |
| R2 | ACETOGEN rxn 6 (PALM) mass error 0.281 | ✅🔧 | Also caused by PALM's MW. It becomes mass-balanced with MW 256.43, **but the element balance still fails** (by hand: ΔC ≈ +1.25, ΔH ≈ +0.93, ΔO ≈ −1.00 per mol). Aspen only checks mass, so this passes unnoticed. |
| R3 | ACETOGEN rxns 1, 5 (oleic, linoleic) mass errors 0.164, 0.0166 | ✅🔧 | Element balance (hand calc): rxn 1 ΔC +0.41, ΔH −7.57, ΔO +0.18; rxn 5 ΔC +0.41, ΔH −5.81, ΔO +0.06. The coefficients (15.2359 H₂O, 0.482 CO₂, 0.1701 NH₃ …) look like they come from an **ionic-form LCFA model** (oleate⁻, HCO₃⁻, NH₄⁺, acetate⁻, H⁺) but were applied to neutral species without re-balancing. Re-derive with C/H/O/N balances on the neutral species. |
| R4 | AMINOACI activation energies | ➕ | Rxns 17 (valine) and 19 (tyrosine): `ACT-ENERGY = −5.921695E+10` J/kmol versus −1.4143726E+7 for the rest. The ratio is exactly **4186.8**, a cal↔J ×1000 unit slip. All values are negative (rate falls as T rises). No effect today (T = T-REF = 328.15 K); it **blows up if B1's temperature changes**. |
| R5 | Double temperature correction | ➕ | The calculators apply their own Arrhenius-like factor and then overwrite PRE-EXP, while the reaction set also carries ACT-ENERGY/T-REF. That double-counts the temperature effect once T ≠ 55 °C. |

### 4.4 Component / property data

| # | Issue | Status | Root cause / fix |
|---|---|---|---|
| C1 | PALM MW 256.145 vs formula 242.45 | ✅🔧 **root cause of R1, R2** | `PALM` was created with formula **C16H34O (1-hexadecanol, MW 242.45)**, then given a manual MW of 256.145 meant for **palmitic acid C16H32O2 (MW 256.43)**. Fix: switch the component to palmitic acid (databank `PALMITIC-ACID`) and delete the MW override. Afterwards, re-check the PALM NRTL pairs (water, benzene, ethanol). |
| C2 | Missing DHFORM/DHAQFM: TYROSINE, TRYPTOPH, METHIONI (`DGCHK1.1`, B1) | ✅ | These take part in AMINOACI 19/20/6, so B1's energy balance is wrong. The other amino acids were given values in REVIEW-1 that look like **solid-state ΔHf** (e.g., alanine −561.2 kJ/mol), but DHFORM is the *ideal-gas* heat of formation. Use one basis consistently. Candidate solid values (check against NIST before entering): Tyr ≈ −685 kJ/mol, Trp ≈ −415 kJ/mol, Met ≈ −577 kJ/mol. |
| C3 | DHVLWT + DHVLDP for PROLINE, CYSTEINE, ARGININE (`DPRSW2.3`) | ✅ | Aspen uses DHVLWT and ignores DHVLDP. Delete the DHVLDP set (or the other one) to remove the warning. |
| C4 | GLYCINE VLSTD twice | ✅ | PCES-1 50.745 cc/mol vs REVIEW-1 0.0507284 m³/kmol (= 50.73). Almost identical, so harmless. Remove one. |
| C5 | Out-of-bounds: CARBON TC/VC, H2CO3 DHVLWT/OMEGA, ETHANOL CPIG | ✅🔧 | **ETHANOL CPIG is a units error:** the coefficients are in **cal/mol·K with T in °C** (14.63 + 0.0403·26.85 ≈ 15.7 cal/mol·K ≈ 65.7 J/mol·K, the correct value at 300 K), but they were entered under `IN-UNITS SI`. Simplest fix: delete the override; PURE40's ethanol data are good. **CARBON**: it's CISOLID, so Tc/Vc warnings are benign as long as it stays solid. **H2CO3**: its parameters are placeholders (PLXANT 0/−1000, DHVLWT 100 300, CPIG copied from HCO3-), and it takes part in no reaction. Remove the species or set realistic values. |
| C6 | PCES "structure not defined" | ✅ **info only** | `PCERTE.10` is INFORMATION, not a warning, and it appears for every component, databank ones too. It matters only for components whose missing parameters PCES must estimate (PROT, KERATIN, INERT, plus anything with user-supplied partial data). Add a molecular structure only where estimation is actually needed. |
| C7 | CYSTEINE = copy of PROLINE | ➕ | TC/PC/ZC/VC, DHVLWT, DHVLDP (Tmin/Tmax), PLXANT and PCES values for CYSTEINE are identical to PROLINE's. They were evidently copy-pasted, so CYSTEINE has no real data of its own. |

### 4.5 Calculator (Fortran) bugs — new

| Calc | Bug |
|---|---|
| LINODEG, PALMDEG | `O = (LCFAFLOW / C_VOL)/5.` but `LCFAFLOW` is **never DEFINEd** in these blocks, so the value is uninitialised. |
| PROPDEG | `C_TNH3 = NH3 + NH4` but only `TNH3FLOW` is defined, so **NH3 is uninitialised**. |
| AMINODEG | `HIS` (histidine) is in the sum `AA1` but is not a component and is never defined, so it's uninitialised. KIN15/KIN16 are wired to IDs 16/15 (harmless, all equal K). |
| METHAN | Computes Q (pH) and S (H₂ inhibition) but leaves both out of `K` (uses R instead). Check this is intended. |
| all | `AFLEXC.1` "sequence … may be inconsistent" ×10: benign; they read stream 5 and write reaction PRE-EXP ahead of B1. |

### 4.5b Open: warning on stream NH3 (global)
The GUI flags stream `NH3` (NH3SEP liquid outlet: water + NH3 + everything that isn't CO2/H₂/CH₄/CO). The saved `.his` logs no message for this stream. Open the stream's Status/Results in the GUI to see what it says. One possibility: NH3SEP has `FLASH-METHOD=GIBBS`, and the `.his` shows its NH3 outlet needed 15 flash trials.

### 4.6 Reactor B1 — check
The log shows `VOLUME = 19036.4` (m³) with vapour fraction 0.042. The liquid throughput is about 0.9 m³/h, so 15 d corresponds to roughly 330 m³ of liquid. The residence-time spec therefore appears to be applied to **total (vapour + liquid)** volume. If the liquid-phase rates use that volume, conversions are greatly over-predicted. Check the RCSTR spec: use condensed-phase residence time, or reactor volume plus phase volume fraction.

---

## 5. ACM model `Zeo_real`

**What Aspen actually runs** (inside `Zeo_real.ATMLZ`):
- Ports `Feed`/`Permeate`/`Retentate` as `MoleFractionPort` (export PortDef: MATERIAL, MIXED substream only).
- Parameters: A = 250 m², L = 1 µm, Ea/D0/H/S0 for CH4 & CO2, T = 323.15 K, P_perm = 1e5 Pa (unused).
- Physics computed but disconnected (see M6). Outlets are fixed at a 20 % permeate split with 30/70 CH4/CO2.
- Properties package "None", so the component list comes from Aspen at run time (all 62).

**Desktop `zeo_real.acmf`:** `Zeo_real` is a 10 % split per component with physics parameters that have no values. `Zeo_real_1` is the same split, and the flowsheet instantiates `B1 as Zeo_real_1`. Its own component list is `["CH4","CO2"]` with PropertiesPlus/PENG-ROB.

**Requirements for a working rewrite** (not applied):
1. Look up Aspen's real IDs: `"METHANE"` and `"CO2"`. Better: hold them in string parameters so the model isn't tied to one flowsheet.
2. Write equations over the **whole `ComponentList`**, for example `Permeate.F*Permeate.z(c) = theta(c)*Feed.F*Feed.z(c)` and the retentate complement. Total F is the sum, so Σz = 1 holds automatically.
3. Set `theta` for CH₄, CO₂ (and H₂) from the permeance/flux equations. Set `theta = 0` for every other component.
4. Use a port type that carries T, P, h, and add `Retentate.T = Feed.T`, `Permeate.T = Feed.T` (or an energy balance), pressures, and enthalpy via a property call such as `pEnth_Mol` (check the exact procedure name in ACM help).
5. Keep units consistent (ACM ports: kmol/h, bar, °C). Replace `max`/`min` with smooth forms.
6. **Re-export the ATMLZ** after every change and keep the desktop `.acmf` in step with it.

---

## 6. Suggested fix order
1. **MEMB1 ACM rewrite** (§5): fixes M1–M4 and M6–M8, the crash, the +504 % mass gain and the METH charge imbalance.
2. **PALM → palmitic acid**: fixes C1, R1 and the mass side of R2.
3. Re-balance ACETOGEN 1, 5, 6 by elements (R2, R3).
4. Delete the ETHANOL CPIG override (C5) and add DHFORM for Tyr/Trp/Met (C2).
5. Fix the calculator bugs (§4.5) and the AMINOACI Ea unit slip (R4).
6. Cleanup: C3, C4, C7, H2CO3, PURGAS, unused LHHW sets and ions.
7. Check the B1 RCSTR volume basis (§4.6).

---

## 7. Tooling
- An **AspenPlus MCP server** is installed at `AspenPlus-MCP-Server/` (venv, `mcp<2` pinned) and registered in `.mcp.json`. Tools: open/run/close/save simulation, get/set node values, place/delete blocks and streams, connect streams. It drives **Aspen Plus only**, through COM.
- **ACM cannot be driven through the MCP.** Review ACM models by reading the `.acmf` text. The ATMLZ is a zip: its `CustomModeling/*.acmf` is readable, `ModelDef/*_Export.xml` is encrypted.
- Fastest way to understand the Aspen model without opening Aspen: read `_3908gjr.inm` (input) and the run log `.his`, which holds all warnings and the calculation trace.
