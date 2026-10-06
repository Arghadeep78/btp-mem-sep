# Session 4: Kinetics basis (calculators read the B1 inlet)

**Session status:** ✅ **DONE (4.1 installed, EDIT_LOG E029).** Calculators now read B1's LIQUID outlet via a damped Wegstein loop (TEAR-VAR = YES, WEG-QMAX 0.5, 200 iterations) on their exported PRE-EXP values; VOLFLOW stays STDVOL-FLOW of LIQUID (≈ actual for a 55 °C liquid) (not an auto FEED tear, which gave fake results). Converged in 10 iterations; self-consistency <0.01% on all 10 calculators. Run: 0 severe / 0 errors / 6 warnings (AFLEXC.1 ×10 gone).

This is the largest digester change. Back up first. Do Sessions 1–3 before this one.

---

## 4.1 Rate constants are computed from feed concentrations, not reactor concentrations (A3)

**Issue:**
- All 10 calculators read stream **5** (RSTOIC outlet = **B1 inlet**) and run *before* B1.
- In a CSTR, rates depend on **reactor (= outlet) concentrations**.
- Propionate, butyrate and valerate are produced **only inside B1**, so in stream 5 they are 0.
- The calculators then substitute C = 1e-8, which gives a Monod factor N ≈ 4e-8 and a rate constant k ≈ 0.

**Error it causes:**
- ACETOGEN rxns 2, 3, 4 (propionate, butyrate, valerate → acetate) are effectively **switched off**, so VFAs accumulate in the digestate and their CH₄ potential is lost.
- Inhibition by products formed in B1 (HAc, H₂, NH₃) is **under-estimated**.
- The 10 × AFLEXC.1 warnings are related: the calculators write B1 parameters while reading upstream data.

**Approach (two options):**

| Option | What | Pros | Cons |
|---|---|---|---|
| **A: recommended now** | Calculators read **B1's LIQUID outlet** and Aspen converges the loop (tear) | GUI only, no compiler | Iterative; needs initial guesses |
| B: long term | Write the kinetics as an Aspen **user kinetics Fortran subroutine** on B1 | Exact CSTR kinetics, no loop | Needs the Intel Fortran compiler and `aspcomp`/`asplink` on the Windows PC |

### Steps: Option A
1. **Do this for each calculator** (AMINODEG, BUTYDEG, DEXTDEG, GLYCDEG, LINODEG, METHAN, OLEICDEG, PALMDEG, PROPDEG, VALEDEG) → **Define** tab:
   - For every **Mass-Flow** variable on Stream `5`: change Stream to **LIQUID**. Substream and component stay the same.
   - For `VOLFLOW`: change Stream to **LIQUID**, and change Variable from `STDVOL-FLOW` to the **actual liquid volume flow** (`VOL-FLOW`, units cum/hr). Concentration = kg/h ÷ m³/h = kg/m³ at reactor conditions.
   - `T` (B1 TEMP) stays as it is.
2. **Sequence** tab (each calculator): change *Execute* from *Before block B1* to **Use import/export variables**. Aspen now sees "read B1 output → write B1 input" and creates a **convergence (tear) loop** automatically.
3. **Sim → Convergence → Conv Options → Defaults:** set the method for tear/calculator loops to **Broyden** (or Wegstein), and maximum iterations to **100**.
4. **Initial guesses:** the current PRE-EXP values in the reaction sets are the starting point and need no change. If it fails to converge, lower the damping (Wegstein bounds −5 to 0) or run once with the old setup to seed the values.

**Verify:**
- Control Panel: the convergence block (e.g. `$OLVER01`) shows **converged**. AFLEXC.1 warnings are gone or changed.
- BUTYDEG, PROPDEG and VALEDEG Results: BUTYFLOW, PROPFLOW and VALEFLOW are now **non-zero**, and KINETIC ≫ 1e-13.
- B1 LIQUID: propionate, butyrate and valerate are lower than before; CH₄ in BIOGAS changes. Record the numbers.

---

## 4.2 Modelling decisions: no fix needed, but state them in your report

### pH inhibition is inactive (B7)
**Finding:** H⁺ never has flow (no chemistry), so AMINODEG computes pH ≈ 6.95. Every other calculator hard-codes `PH = 6.5`, so the pH factors are constant.
**Decision:** state "fixed pH 6.5–7, no pH inhibition modelled". (A real pH needs an electrolyte CHEMISTRY block, which is a much bigger change and not recommended now.)

### No hydrogenotrophic methanogenesis (B5)
**Finding:** B1 has no CO₂ + 4 H₂ → CH₄ + 2 H₂O. H₂ goes to acetate through the equilibrium set `H2`.
**Optional fix:**
1. Reactions → **METHAN** → **Stoichiometry** → **New** rxn 2: CO2 −1, HYDROGEN −4 → METHANE 1, WATER 2.
2. **Kinetic** tab: PowerLaw, exponent HYDROGEN 1.
3. Rate constant: add a calculator `H2METH`, copied from METHAN, writing `METHAN … ID1=2`. Use ADM1 hydrogenotroph parameters from your reference.

### Part of the CH₄ bypasses the kinetics (B6)
**Finding:** RSTOIC rxn 12 (PROT → 6.5 CH₄ + 6.5 CO₂ …, 90 %) and rxn 11 (EtOH → HAc + CH₄, 80 %) make CH₄ at fixed conversion before B1.
**Decision:** state it in the report. Optionally route PROT to amino acids like KERATIN (rxn 13) so it passes through AMINOACI kinetics.
**If you route PROT to amino acids:**
- A protein composition that includes tyrosine, tryptophan, methionine or lysine activates AMINOACI rxns 19, 20, 6 and 14, which have run at zero so far.
- Do 1.3 (first-order rate laws) and 8.1 (DHFORM for TYROSINE, TRYPTOPH and METHIONI) first.
- Re-check RSTOIC mass balance for the new reaction.
