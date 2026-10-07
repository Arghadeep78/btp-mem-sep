# Phase 2, Session C: Parked (looks like an error, decided not to touch; ponder later)

Each row says why it is parked, what we would do later, and what would make us revisit it.

Other sessions: [A](A_will_do.md) · [B](B_check_only.md). Overview and ranking: [../00_INDEX.md](../00_INDEX.md). Phase 1 (done): [../phase1/00_PHASE1_DONE.md](../phase1/00_PHASE1_DONE.md). Evidence: [source_check_results.md](source_check_results.md).

Contents: pyrolysis · property data · cleanup and documentation · membrane and digester.

---

## Pyrolysis reactor (CH4PYRO)


(Scope and status for this topic: see [A_will_do.md](A_will_do.md).)

| # | What looks wrong | Why we are not touching it now | What we would do later | Revisit if |
|---|---|---|---|---|
| C1 | **R-2 (RWGS) is irreversible.** At 790 °C K = 0.888, so the real CO₂ conversion is about 85 %, not 99.99 % | The kinetics come from your source (design). Effect: H₂ about +4.4 %, CO₂ left 0 vs 0.06 kmol/h | **Option 1:** use the existing LHHW set `RWGS` (its equilibrium term `A = −4.33, B = 4577.8` gives K ≈ 1.02 at 790 °C, within about 13 % of Perry's 0.888), replacing R-2 in CH4PYRO. Steps: Block METH.CH4PYRO → Reactions: replace `R-2` with `RWGS`, keep `R-1`; check phase V, cat-wt basis. **Option 2:** add the reverse reaction to R-2 with k₀,rev = k₀,fwd / K(790 °C) | The source paper's R-2 is reversible, or CO / H₂O composition becomes a reported result |
| C2 | **R-1 (CH₄ cracking) is irreversible.** Equilibrium conversion is 94 % (91 % for pure CH₄) while the model gives about 100 % | Same reason; the overshoot is small (CH₄ left 0.076 kmol/h) | Add a reverse term in LHHW form, like RWGS, with K = 19.98 at 790 °C | The source models R-1 as reversible, or unconverted CH₄ matters downstream |
| C3 | **R-1/R-2 k₀ units** (hour basis, no IN-UNITS line) may differ from the paper's | Moot for the result, because conversion saturates | Open Reactions R-1/R-2 → Kinetic tab; set the time unit next to *k* to the paper's (Aspen converts), or scale by 3600. If the paper uses partial pressures, set CBASIS = partial pressure | The paper's units differ **and** you want the rate itself (not just conversion) to be right, e.g. for a sensitivity on catalyst mass or space time |
| C4 | **Boudouard reaction** 2CO → C(s) + CO₂ (Perry Eq 24-26) is not modelled | Minor at 790 °C and 1 bar; adds a reaction not in the design | Add as a kinetic or equilibrium reaction | CO appears in a reported result |
| C5 | **Catalyst fills only 0.8 % of the tube** (B2) | It is a design-consistency question, not an Aspen error | Change the catalyst mass or the tube size so they come from one design basis | The source states a bed design |

---

## Property data cleanup


(Scope and status for this topic: see [A_will_do.md](A_will_do.md).)

### C6. Missing and mixed-basis heats of formation (review C2)

**Issue:**
- TYROSINE, TRYPTOPH and METHIONI have no DHFORM/DHAQFM.
- The values entered for the other amino acids (REVIEW-1, e.g. alanine −561.2 kJ/mol) look like **solid-state** ΔHf, but Aspen's DHFORM is the **ideal-gas** ΔHf at 298 K.

**Error it causes:**
- Log DGCHK1.1 (B1): "absence … will result in incorrect enthalpy results".
- The missing values themselves have **no numerical effect today**. TYROSINE, TRYPTOPH and METHIONI have no source in the model (see 1.3), so their flow is always zero. They start to matter as soon as these amino acids get a source.
- The **mixed basis** of the values that are entered (solid ΔHf used as ideal-gas DHFORM) does affect results today. Those amino acids come from KERATIN, so B1's heat duty (4275.86 in the log) and the reaction heats are wrong.

**Approach:** use one consistent basis for all amino acids. **First check the project source:** if it states ΔHf values, or the enthalpy basis its digester model uses, follow it (that decides Route 1 vs B below). If it says nothing, use Route 1.
**Perry check (done):** Perry's Table 2-179 (PDF p.238 onwards, printed 2-195 onwards) lists the **ideal-gas** ΔHf at 298.15 K, so Aspen's DHFORM basis is confirmed and the solid-state REVIEW-1 values are the wrong basis. **No amino acids are tabulated**, so Perry cannot supply numbers for Route 2. Perry's estimation method is Domalski–Hearing (PDF p.521, printed 2-478, group values in Table 2-343). **Decision:** leave and state it as an assumption; if it is ever fixed, use Route 1.

**Steps (choose one)**
- **Route 1, estimate everything consistently:**
  1. Props → Components → **Molecular Structure** → for each amino acid choose **Define molecule by its connectivity**, or import a .mol file (PubChem).
  2. Delete the DHFORM values from REVIEW-1.
  3. With `ESTIMATE ALL` on, PCES (Benson group contribution) estimates DHFORM for all of them on the same ideal-gas basis.
- **Route 2, literature values:** take **gas-phase** ΔHf from the NIST WebBook for every amino acid used. Enter them in REVIEW-1 → DHFORM for all of them, including TYR/TRP/MET.

**Verify:** DGCHK1.1 is gone and the B1 duty changes. Record the new value.

---

### C7. NH4+ is a neutral copy of NH3 (review D2)

**Perry check:** not in Perry; wrong by inspection (formula H₃N, MW 17.03, instead of the ion H₄N⁺, 18.04). No flow, so leave it.

**Issue:** NH4+ is defined with formula **H3N** (ammonia), and its NRTL pairs are copies of NH3's.
**Error it causes:** no effect today (no flow, no chemistry), but the name is misleading. The calculators add NH3 + NH4 assuming it is the ion.
**Steps (choose one):**
- **Delete NH4+** (simplest). First remove it from the calculator DEFINEs (NH4 variables) and drop `+ NH4` from the Fortran: `C_TNH3 = NH3 + NH4` → `C_TNH3 = NH3`; in PROPDEG `C_TNH3 = TNH3FLOW + NH4` → `C_TNH3 = TNH3FLOW`; in VALEDEG `CTNH3 = TNH3FLOW + NH4` → `CTNH3 = TNH3FLOW`. Or:
- keep it, but rename it in the model description to "unused".

---

### C8. Benign: no action
- CARBON TC/VC out of bounds (LCLIMS.3): CARBON is CISOLID, so its critical properties are never used.
- PCERTE.10 "structure not defined" for all 62 components: information only. It matters only for PROT, KERATIN and INERT (user components), if you ever need estimated properties for them.

---

## Cleanup and documentation


(Decided not to touch because it is a design decision or harmless; ponder later.)

(Scope and status for this topic: see [A_will_do.md](A_will_do.md).)

| # | What looks wrong | Why we are not touching it now | What we would do later | Revisit if |
|---|---|---|---|---|
| C9 | **PURGAS has an always-empty outlet** (WASTE = 0; its FRAC list includes CARBON in MIXED, which does nothing). USP03.1 warning | Harmless, and deleting it means rewiring the flowsheet | **Delete PURGAS:** connect `METH.GAS` directly to COMP1 and delete WASTE; or **real purge:** FRAC = 0.99 to GAS2. There is no recycle loop, so deleting is the sensible option | You want a clean 0-warning run, or a recycle is added |
| C10 | **FLASH3 looks redundant** (RET is dry; H2O-2 ≈ 0) | It is the 10 → 1 bar letdown and acts as a knockout drum. Deleting it would remove the pressure letdown | Keep it; optionally rename to `LETDOWN`. If ever removed, add a valve first | An expander is added or the letdown moves |
| C11 | **NH3SEP's name hides what it does** (it keeps only CO₂, H₂, CH₄, CO and sends water and everything else to stream NH3) | Naming only | Rename block to `GASCLEAN` and stream NH3 to `CONDENS` (right-click → Rename), or add a block description | Handing the model to someone else |
| C12 | **METH property options do nothing:** `TRUE-COMPS=YES`, `FREE-WATER=STEAM-TA`, `SOLU-WATER=3` (no chemistry; blocks use FREE-WATER=NO) | No effect on results | Hierarchy METH → Properties → reset to defaults | A CHEMISTRY block is added |
| C13 | **Unused reaction sets** CO2METH and COMETH (LHHW) | Defined but harmless | Reactions → right-click → Delete. **Keep `RWGS`** (C1) | You want a smaller file |
| C14 | **MEMB1 has `IN-UNITS ENG`** while the rest is SI/MET | Harmless (ACM values are in native units), only confusing | Block METH.MEMB1 → Setup → Units → match the flowsheet | The block is edited again |
| C15 | **Hidden sensitivity `RESTIME`** (B1 RES-TIME 1–40 d vs CH₄ in BIOGAS and B1 volume) is inactive | It is not an error | Model Analysis Tools → Sensitivity → unhide/activate; re-target it to the condensed-phase residence time | You want a yield-vs-HRT curve for the report |
| C16 | **Henry warnings (2):** NH3SEP and MEMB1 flashes: "all components are Henry components, yet CO₂ is sub-critical" | Cosmetic side effect of `HC-1`; the streams are vapour-only | Set the flashes of GAS3 / MEMB1 outlets to vapour-only, or accept the warning | You need a zero-warning run |
| C17 | **`PERMEATE.V` is a default value (50 cc/mol)** and RETENTATE.V too | No equation uses V (test B1). Fixing it needs another ACM recompile and ATMLZ export | In ACM `Zeo_real`, after `Retentate.P = Feed.P - dP_ret;` add `Permeate.V = 0.08314*(Permeate.T + 273.15)/Permeate.P;` and `Retentate.V = 0.08314*(Retentate.T + 273.15)/Retentate.P;`. Compile; if ACM says over-specified, set Permeate.V Free there; re-export the ATMLZ; copy the text into `files/zeo_real.acmf`; in Aspen set `PERMEATE.V` to Free; check V ≈ 25 204 / 2 520 cc/mol | The ACM model is changed for another reason (fold it in), or V is quoted somewhere |

---

## Assumptions and source check (membrane, digester)


(Scope and status for this topic: see [A_will_do.md](A_will_do.md).)

| # | What looks wrong or suboptimal | Why we are not touching it now | What we would do later | Revisit if |
|---|---|---|---|---|
| C18 | **Pressure ratio 10 > Perry's "above 6 becomes expensive"** (p.20-62); and the area/pressure point is not optimised | The design is near final. A single stage trades purity for recovery: 90 % CH₄ costs at least 20 % CH₄ loss | Sensitivity (Python replica reproduces Aspen to 6 digits): at about 96 % recovery, **8 m², 8 bar** gives 77.1 % CH₄ at 4.90 kW and **10 m², 6 bar** gives 74.1 % at 4.15 kW, versus 76.4 % at 5.50 kW today. Full grids in [source_check_results.md](source_check_results.md) §5. To apply: set `A` in ACM, set COMP1/COMP2 pressures; recompile and export once | A lower compressor energy matters, or purity must rise (then add a second stage, Perry p.20-62/63) |
| C19 | **One stage**: CH₄ loss to the permeate is 3.1 % | Perry says staging with recompression is unusual; the design is final | Add a second stage or recycle the permeate | CH₄ loss becomes a reported result |
| C20 | **Π has no temperature dependence** (297 K values used at 30 °C) | Same temperature region; Perry covers polymers only | Add Π(T) = Π_ref·exp[−(E/R)(1/T − 1/T_ref)] if the source gives E | The operating T moves away from 297 K |
| C21 | **Partial pressure instead of fugacity for CO₂** (Perry p.20-58). At 10 bar and 30 °C the CO₂ flux is overstated by about 5 % (my estimate) | Small; ideal gas is the stated assumption | Use fugacity coefficients in the flux equation | CO₂ removal is a reported result |
| C22 | **`PERMEATE.V` fixed at 50 cc/mol** | Harmless (test B6); needs another recompile | Ideal-gas V lines, see C17. Fold in if the ACM is edited for C18/C20/C21 | The ACM is edited anyway |
| C23 | **Digester at 55 °C** while Perry's digesters run at 35–37 °C | The calculator constants are written around T0 = 55 °C | State it as an assumption; re-fit constants at 35 °C only if the source uses mesophilic | The source uses 35–37 °C |
| C24 | **Propionate yield (0.0625 vs Perry 0.04 g/g COD) and Ks (392 vs 60 mg COD/L)** | ADM1-style constants chosen as design; thermophilic basis | Re-fit to the source's constants | The source gives propionate constants |
| C25 | **No hydrogenotrophic methanogenesis** (Perry: methane bacteria also make CH₄ from CO₂ + H₂, p.22-79) | H₂ is only 0.3 % of the biogas | Add `METHAN` rxn 2: CO₂ + 4 H₂ → CH₄ + 2 H₂O with ADM1 hydrogenotroph parameters (copy METHAN, write rxn 2) | H₂ in the biogas becomes significant |
| C26 | **RSTOIC rxn 11 never fires** (2 EtOH + CO₂ → 2 HAc + CH₄, meant to convert 80 % of the ethanol). With `SERIES=NO`, conversion is based on the feed ethanol, which is zero (evidence: B10) | It is a design setting of the hydrolysis step; fixing it changes how the other conversions are applied | **Option 1:** RSTOIC → `SERIES=YES`. Then each conversion applies to the amount left after the earlier reactions, so re-enter the shared ones to keep today's split: cellulose rxn 10 = 0.4 / 0.7 ≈ 0.571 (after rxn 1 at 0.3), hemicellulose rxn 7 = 0.1 / 0.5 = 0.2 (after rxn 2 at 0.5); check that rxn order is 1 → 10 → 11 and 2 → 7 → 8. **Option 2:** move EtOH → HAc + CH₄ into B1 as a kinetic reaction. Effect: CH₄ **+1.8 %** directly (0.024 kmol/h); up to **+5 %** if the extra 0.048 kmol/h of acetate is methanated in B1; 2.5 kg/h less ethanol in the digestate | You want the ethanol pathway to count in the CH₄ yield, or the source paper includes it |
| C27 | **RSTOIC rxn 8 never fires** (XYLOSE → FURFURAL, 10 %), same `SERIES=NO` reason (evidence: B10) | Negligible (furfural would be 0.0006 kmol/h) | Fixed together with C26 if `SERIES=YES` is used | C26 is applied |

