# Session 1: Quick edits (calculators and AMINOACI)

Low-risk edits, each only a few clicks. Back up the `.bkp` first (see [00_INDEX.md](00_INDEX.md)).

---

## 1.1 GLYCDEG never writes its result (A4)

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

**Issue:** `BUTYFLOW` is defined as **Mass-Frac** of ISOBU-01. The Fortran divides it by a volume flow (m³/h), treating it like the other calculators' kg/h flows.

**Error it causes:** the butyrate concentration is wrong by a factor of (total mass flow), so the butyrate degradation rate (ACETOGEN rxn 3) is wrong.

**Approach:** use mass flow in kg/h, like every other calculator.

**Steps**
1. Open Calculator **BUTYDEG** → **Define** → row `BUTYFLOW` → **Edit**.
2. Set Type = **Mass-Flow**, Stream = 5, Substream = MIXED, Component = ISOBU-01, Units = **kg/hr**.

**Verify:** BUTYDEG → Results: BUTYFLOW is in kg/hr. (It is still ~0 until Session 4; see 4.1.)

---

## 1.3 Tyrosine and tryptophan rates depend on their own products (A6)

**Issue:** the AMINOACI rate law for rxn 19 is `TYROSINE¹·PHENOL¹·ACETI-AC¹`, and for rxn 20 it is `TRYPTOPH¹·INDOLE¹·ACETI-AC¹`. PHENOL and INDOLE are produced *only* by these reactions.

**Error it causes:** the rate is proportional to a product concentration that starts at zero, so the solver most likely stays at rate = 0. Tyrosine and tryptophan never degrade, and no phenol or indole forms.

**Approach:** make each rate first order in its amino acid only, like rxns 1–18 and 21–23.

**Steps**
1. Open Reactions **AMINOACI** → **Kinetic** tab → select **Rxn No. 19**.
2. In the exponents, set **PHENOL = 0** and **ACETI-AC = 0**, and keep TYROSINE = 1.
3. Select **Rxn No. 20**. Set **INDOLE = 0** and **ACETI-AC = 0**, and keep TRYPTOPH = 1.

**Verify:** B1 results now show non-zero PHENOL and INDOLE in LIQUID/BIOGAS.

---

## 1.4 AMINOACI activation energy: unit slip plus double counting (R4 + R5)

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

## 1.5 LINODEG and PALMDEG use a variable that was never defined

**Issue:** both calculators compute `O = (LCFAFLOW / C_VOL)/5.`, but `LCFAFLOW` is not defined in either block.

**Error it causes:** LCFAFLOW is uninitialised (random or 0), so the LCFA self-inhibition term is undefined and the linoleic/palmitic rate constants are unreliable.

**Approach:** define LCFAFLOW the same way OLEICDEG does.

**Steps (repeat for LINODEG and PALMDEG)**
1. Open Calculator → **Define** → **New**.
2. Name `LCFAFLOW`, Type **Mass-Flow**, Stream 5, Substream MIXED, Component **OLEICACI**, Units **kg/hr**, **Import**.

**Verify:** the calculator Results show a numeric LCFAFLOW, and the run has no Fortran error.

---

## 1.6 PROPDEG uses an undefined NH3

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

**Issue:** `CTNH3 = TNH3FLOW`, while the other calculators use NH3 + NH4.

**Error it causes:** none today, because NH4+ never has flow. It is an inconsistency.

**Steps:** Calculator **VALEDEG** → **Calculate**: change `CTNH3 = TNH3FLOW` to `CTNH3 = TNH3FLOW + NH4`.

---

## 1.9 METHAN: unused lines (no functional change needed)

**Finding:** METHAN computes `S` (H₂ inhibition), `Q` (pH 5–6 window) and `X`, but `K = L·N·M·O·P·R` uses none of them. This turns out to be **consistent with ADM1**: acetoclastic methanogens get the pH 6–7 window (`R`) and no H₂ inhibition.

**Action:** optional tidy-up only. Delete the `X`, `U`, `S` and `Q` lines, or add a comment `C  S, Q not used (ADM1: acetoclastic)`. Do not add them to K.

---

## Session 1: verify all
1. Run. The warning count should still be 15 or fewer; nothing new from the calculators.
2. Control Panel: there should be no "Fortran error" or "undefined variable" messages.
3. Check the Results tab of GLYCDEG, BUTYDEG, LINODEG, PALMDEG, PROPDEG and AMINODEG.
4. Save as `.bkp` and tick S1 in [00_INDEX.md](00_INDEX.md).
