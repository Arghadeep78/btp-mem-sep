# Session 1: Quick edits (calculators and AMINOACI)

**Session status:** ✅ **DONE.** All items applied to `files/Memb-Integration-1.bkp` (EDIT_LOG E015, E020). Verified run: 0 severe / 0 errors / 15 warnings. Kept as a reference list.

---

## 1.1 GLYCDEG never writes its result (A4)

**Status:** ✅ Applied (EDIT_LOG E015). Done as Fortran `KINETIIC = …` (same effect as renaming the Define).

**Issue:** the Define variable is spelled `KINETIIC` (two I's). The Fortran assigns `KINETIC`.

**Error it causes:** the calculated glycerol rate constant is thrown away. ACIDOGEN reaction 2 always uses its static PRE-EXP of 1.0079E-6, so glycerol degradation ignores the NH₃/LCFA inhibition terms. There is no warning; it fails silently.

**Approach:** make the Define variable name match the Fortran name.

**Steps (Aspen GUI)**
1. Open Sim → Flowsheeting Options → Calculator → **GLYCDEG** → **Define** tab.
2. Select row `KINETIIC` → **Edit**.
3. Change the variable name to `KINETIC`. Keep Category = Reactions, Type = Reac-Var, Reaction = ACIDOGEN, Variable = PRE-EXP, Sentence = RATE-CON, ID1 = 2.
4. Make sure it is flagged as an **Export** variable.
5. Look at the **Calculate** tab. The last line is already `KINETIC = L * N * M * O * Q`, so no change is needed there.

**Verify:** after the run, GLYCDEG → Results shows KINETIC ≠ 1.0079E-6. Reactions ACIDOGEN → rxn 2 PRE-EXP shows the new value.

---

## 1.2 BUTYDEG reads a mass fraction as a flow (A5)

**Status:** ✅ Applied (EDIT_LOG E015).

**Issue:** `BUTYFLOW` is defined as **Mass-Frac** of ISOBU-01. The Fortran divides it by a volume flow (m³/h), treating it like the other calculators' kg/h flows.

**Error it causes:** the butyrate concentration is wrong by a factor of (total mass flow), so the butyrate degradation rate (ACETOGEN rxn 3) is wrong.

**Approach:** use mass flow in kg/h, like every other calculator.

**Steps**
1. Open Calculator **BUTYDEG** → **Define** → row `BUTYFLOW` → **Edit**.
2. Set Type = **Mass-Flow**, Stream = 5, Substream = MIXED, Component = ISOBU-01, Units = **kg/hr**.

**Verify:** BUTYDEG → Results: BUTYFLOW is in kg/hr. (It is still ~0 until Session 4; see 4.1.)

---

## 1.3 Tyrosine and tryptophan rate laws contain their own products (A6)

**Status:** ✅ Applied (EDIT_LOG E020).

**Issue:**
- The AMINOACI rate law for rxn 19 is `TYROSINE¹·PHENOL¹·ACETI-AC¹`, and for rxn 20 it is `TRYPTOPH¹·INDOLE¹·ACETI-AC¹`.
- PHENOL and INDOLE are produced *only* by these two reactions, so each rate is **autocatalytic** in a product that starts at zero. r = 0 is always a solution, and the solver stays there.
- The rate constant written by AMINODEG is in 1/s (first-order units). A third-order law would need (m³/kmol)²/s, so the current law is also dimensionally inconsistent.
- The stoichiometry itself is fine: rxns 19 and 20 balance exactly in C, H, O and N.

**Error it causes:** none with the current feed. TYROSINE, TRYPTOPH (and METHIONI, LYSINE) have **no source anywhere** in the model: they are not in BIOMASS, KERATIN (RSTOIC rxn 13) doesn't yield them, and PROT goes straight to CH₄/CO₂/NH₃/H₂S. So AMINOACI rxns 6, 14, 19 and 20 always run at zero. The faulty law becomes a real error once any of these amino acids gets a source (Session 4 B6, or an extended keratin composition).

**Approach:** make each rate first order in its amino acid only, like every other AMINOACI reaction.

**Steps**
1. Reactions **AMINOACI** → **Kinetic** → **Rxn 19**: exponents **PHENOL = 0**, **ACETI-AC = 0**, keep TYROSINE = 1.
2. **Rxn 20**: **INDOLE = 0**, **ACETI-AC = 0**, keep TRYPTOPH = 1.

**Verify:** rxn 19 lists only TYROSINE and rxn 20 only TRYPTOPH (exponent 1). Results are **unchanged** (PHENOL, INDOLE stay 0), as expected.

**Model-scope note:** real keratin contains some tyrosine, lysine and methionine. If your keratin reference gives their fractions, add them to RSTOIC rxn 13 (re-check its water coefficient), after settling their heats of formation (Session 8, 8.1).

---

## 1.4 AMINOACI activation energy: unit slip plus double counting (R4 + R5)

**Status:** ✅ Applied (EDIT_LOG E015).

**Issue:**
- (a) Rxns 17 and 19 have Ea = −5.921695E+10 J/kmol, while all the others have −1.4143726E+7. The ratio is exactly 4186.8, a cal↔J ×1000 slip.
- (b) Calculator AMINODEG already applies its own temperature factor `Z = 70·exp(…)`, and AMINOACI applies Ea a second time.

**Error it causes:** none today, because B1 is at T-REF = 55 °C. If B1's temperature changes, rxns 17 and 19 blow up (exp of ±10⁴), and every AMINOACI rate double-counts the temperature effect.

**Approach:** let the calculator own the temperature dependence, as ACETOGEN, ACIDOGEN and METHAN already do (their Ea = 0). Setting all AMINOACI Ea to 0 fixes both (a) and (b).

**Steps**
1. Open Reactions **AMINOACI** → **Kinetic** tab.
2. For each reaction 1, 2, 4–11, 13–23, set **E = 0** and leave T-REF as it is.

**Verify:** with B1 at 55 °C, the results are unchanged from before this step, which is expected. To test, temporarily set B1 to 50 °C: it should run without overflow. Then set it back.

---

## 1.5 LINODEG and PALMDEG: substrate self-inhibition term reads an undefined variable

**Status:** ✅ Applied (EDIT_LOG E020).

**Issue:**
- LINODEG and PALMDEG are copies of OLEICDEG, all using the Haldane form `N = 1 / (1 + Ks/S + S/Ki)` (Ks = 0.02, Ki = 5 kg/m³).
- In OLEICDEG the self-term uses its **own substrate**: `O = (C_LCFA / C_VOL)/5.`.
- In LINODEG and PALMDEG it reads `O = (LCFAFLOW / C_VOL)/5.`, and `LCFAFLOW` is **not defined** in either block.

**Error it causes:** the stored results show the undefined variable reads as **0**, so the self-inhibition term is missing. Back-calculating LINODEG k = 1.1007E-4 and PALMDEG k = 1.1212E-4 reproduces N exactly with O = 0. This affects results, because RSTOIC makes both acids (stream 5: palmitic 8.33, linoleic 0.95, oleic 9.59 kg/m³).

**Approach:** complete the Haldane term with each block's own substrate (`C_LINO`, `C_PALM` already exist in the blocks). One Fortran line each, no new Define.

**Steps**
1. **LINODEG** → Calculate: `O = ( LCFAFLOW / C_VOL ) / 5.` → `O = ( C_LINO / C_VOL ) / 5.`
2. **PALMDEG** → Calculate: same line → `O = ( C_PALM / C_VOL ) / 5.` (7-space indent in both)

**Verify:** LINODEG KINETIC 1.1007E-4 → ≈ 9.28E-5 (−16 %); PALMDEG 1.1212E-4 → ≈ 4.21E-5 (−62 %). No Fortran errors.

---

## 1.5b LCFA inhibition of the other microbial groups counts oleic acid only

**Status:** ✅ Applied (EDIT_LOG E020).

**Issue:** six calculators (BUTYDEG, DEXTDEG, GLYCDEG, METHAN, PROPDEG, VALEDEG) apply `1/(1 + C_LCFA/5)` with `LCFAFLOW` = OLEICACI only. LCFA inhibition is caused by the **total** LCFA pool; palmitic acid is nearly half of it here.

**Error it causes:** the pool is 9.59 kg/m³ (oleic only) vs **18.88 kg/m³** total, so the factor is 0.343 vs 0.209. These rate constants were about **39 % too high**.

**Approach:** sum all three LCFAs into the existing `C_LCFA` (VALEDEG: `CLCFA`). The Haldane self-term in OLEICDEG, LINODEG and PALMDEG stays on its own substrate (1.5).

**Steps (each of the six)**
1. Define → New: `LINOFL`, Mass-Flow, stream 5, MIXED, **LINOLEIC**, kg/hr, Import.
2. Define → New: `PALMFL`, same, **PALM**.
3. Calculate: `C_LCFA = LCFAFLOW` → `C_LCFA = LCFAFLOW + LINOFL + PALMFL` (VALEDEG: `CLCFA = …`, 6-space indent).

**Verify:** KINETIC in each drops to about 0.61× at unchanged other inputs. No Fortran errors.

---

## 1.6 PROPDEG uses an undefined NH3

**Status:** ✅ Applied (EDIT_LOG E015).

**Issue:** the Fortran has `C_TNH3 = NH3 + NH4`, but this block defines `TNH3FLOW`, not `NH3`.

**Error it causes:** NH3 is uninitialised, so the ammonia inhibition term in the propionate rate (ACETOGEN rxn 2) is unreliable.

**Steps**
1. Open Calculator **PROPDEG** → **Calculate** tab.
2. Replace the line
   ```fortran
         C_TNH3 = NH3 + NH4
   ```
   with
   ```fortran
         C_TNH3 = TNH3FLOW + NH4
   ```
   Keep the 6-space Fortran indent.

---

## 1.7 AMINODEG sums an undefined HIS

**Status:** ✅ Applied (EDIT_LOG E015).

**Issue:** `AA1 = ARG + HIS + LYS + …`. Histidine is not a component, and HIS is never defined.

**Error it causes:** HIS is uninitialised, so the amino-acid total, the Monod term N and every AMINOACI rate constant are unreliable.

**Steps**
1. Open Calculator **AMINODEG** → **Calculate**.
2. Change the line to:
   ```fortran
         AA1 = ARG + LYS + TYR + TRYP + PHE + CYS + MET + THR + SER
   ```

---

## 1.8 VALEDEG leaves NH4 out of the NH₃ total (consistency)

**Status:** ✅ Applied (EDIT_LOG E015).

**Issue:** `CTNH3 = TNH3FLOW`, while the other calculators use NH3 + NH4.

**Error it causes:** none today, because NH4+ never has flow. It is an inconsistency.

**Steps:** Calculator **VALEDEG** → **Calculate**: change `CTNH3 = TNH3FLOW` to `CTNH3 = TNH3FLOW + NH4`.

---

## 1.9 METHAN: unused lines (no functional change needed)

**Status:** ✅ Checked: no change needed (consistent with ADM1).

**Finding:** METHAN computes `S` (H₂ inhibition), `Q` (pH 5–6 window) and `X`, but `K = L·N·M·O·P·R` uses none of them. This turns out to be **consistent with ADM1**: acetoclastic methanogens get the pH 6–7 window (`R`) and no H₂ inhibition.

**Action:** optional tidy-up only. Delete the `X`, `U`, `S` and `Q` lines, or add a comment `C  S, Q not used (ADM1: acetoclastic)`. Do not add them to K.

---

## 1.10 Companion settings: needed to keep the run error-free after 1.1–1.8

**Status:** ✅ Applied (EDIT_LOG E015).

**Issue:** the S1 edits shift the digester outputs slightly, which tips two numerical settings that were already at their limit.

| Setting | Where | Change | Error without it |
|---|---|---|---|
| Flash max iterations (global) | Setup → Simulation Options → Flash convergence | 30 → **100** | **Severe** USP03.1: the H2S-SEP flash of GAS2 fails (needed 28 of 30, needs 37 after) |
| CH4PYRO integration tolerance | METH.CH4PYRO → Convergence → Integration | 0.001 → **0.0001** | BALMAS.1 on CH4PYRO (1.18E-4 vs 1E-4 limit) |

**Saving:** use **File → Save As → .bkp** in the GUI. Don't save through COM/MCP: it drops MEMB1's `PERMEATE.P` fixed spec.

---

## Session 1: verify all
1. Run: 0 severe / 0 errors / 15 warnings.
2. No "Fortran error" or "undefined variable" messages.
3. GLYCDEG KINETIIC ≈ 2.03E-6 (was 1.0079E-6); LINODEG ≈ 9.28E-5; PALMDEG ≈ 4.21E-5; six LCFA calculators ≈ 0.61×.
