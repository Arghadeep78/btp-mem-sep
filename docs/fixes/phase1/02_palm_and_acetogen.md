# Session 2: PALM → palmitic acid, and element-balanced ACETOGEN

**Session status:** ✅ **DONE (installed, EDIT_LOG E025).** Tested: 6 warning messages removed (RSTOIC ZURE07.8 ×3, ACETOGEN RXMBCK ×3), LOADMW gone. The CH4PYRO BALMAS error seen after this session was **cleared by Session 6** (run of 2026-10-06: no BALMAS or RXMBCK messages; see the end of this file).

Back up first. Do 2.1 before 2.2.

---

## 2.1 PALM is defined as hexadecanol, not palmitic acid (C1, R1)

**Issue:** component `PALM` has formula **C16H34O** (1-hexadecanol, MW 242.45), plus a manual MW override of 256.145 (REVIEW-1). Palmitic acid is **C16H32O2** (MW 256.43).

**Error it causes:**
- Log LOADMW.5: "MW entered 256.1450 ≠ calculated 242.4454".
- RSTOIC reactions 3, 5, 6 fail the mass balance (ZURE07.8: −0.85174, −0.28391, −0.28391). The 3:1:1 ratio matches PALM's coefficients.
- The element balance is also off: rxn 3 ΔH +6, ΔO −3.
- All of PALM's properties (vapour pressure, NRTL, Cp) are hexadecanol's.

**Approach:** point the existing component ID `PALM` at the databank palmitic acid. Keeping the ID means reactions and calculators don't have to change. Then remove the MW override.

**Steps (Aspen GUI)**
1. **Props → Components → Specifications.** On the `PALM` row, click **Find**. Search for name "palmitic" or formula **C16H32O2**. Select **PALMITIC-ACID** (n-hexadecanoic acid) → **Add selected compounds**. If Aspen adds it as a new row, delete the new row, then type its *Component name* / *Alias* into the `PALM` row instead. The Component ID must stay `PALM`.
2. **Props → Methods → Parameters → Pure Components → REVIEW-1.** Find the **MW** entry for PALM and delete that value (leave the cell blank).
3. **NRTL pairs need no action.** The `.bkp` stores only source tags for the WATER/BENZENE/ETHANOL–PALM pairs (`NISTV140 NIST-IG`), not values. Aspen retrieves them for whichever compound PALM points to, so they follow the switch automatically.
4. Run properties (Props → Run). Check that the Control Panel has **no LOADMW.5** message.

**Verify after the full run:**
- LOADMW.5 is gone. The component report shows PALM as `C16H32O2`.
- ZURE07.8 for RSTOIC 3, 5, 6 is **gone**.
- RXMBCK for ACETOGEN 6 changes. This is expected and is fixed in 2.2.

---

## 2.2 ACETOGEN reactions 1, 5, 6 don't balance by element (R2, R3)

**Issue:** the stoichiometric coefficients look like they come from an ionic (oleate⁻/HCO₃⁻/NH₄⁺) model but were applied to neutral species.

**Error it causes:**
- Log RXMBCK.1 mass errors 0.164, 0.0166, 0.281.
- Element errors per mol:

  | Rxn | ΔC | ΔH | ΔO |
  |---|---|---|---|
  | 1 | +0.41 | −7.57 | +0.18 |
  | 5 | +0.41 | −5.81 | +0.06 |
  | 6 | +1.25 | +0.93 | −1.00 (after 2.1) |

- Carbon, hydrogen and oxygen are created or destroyed in the digester. H₂ and HAc yields are therefore wrong, so CH₄ is wrong.

**Approach:** use β-oxidation stoichiometry with the **same biomass yield as your model** (0.1701 mol C5H7NO2 per mol LCFA, with NH₃ as the N source). Solve C/H/O exactly, taking CO₂ = 0 because β-oxidation releases no CO₂. All three sets below were checked and balance exactly (ΔC = ΔH = ΔO = ΔN = 0).

| Rxn | Reactants (coefficient) | Products (coefficient) |
|---|---|---|
| **1** (oleic) | OLEICACI −1 · NH3 −0.1701 · WATER −15.4897 | C5H7NO2 0.1701 · ACETI-AC 8.57475 · HYDROGEN 15 |
| **5** (linoleic) | LINOLEIC −1 · NH3 −0.1701 · WATER −15.4897 | C5H7NO2 0.1701 · ACETI-AC 8.57475 · HYDROGEN 14 |
| **6** (palmitic) | PALM −1 · NH3 −0.1701 · WATER −13.4897 | C5H7NO2 0.1701 · ACETI-AC 7.57475 · HYDROGEN 14 |

Enter ACETI-AC with all five decimals: 8.57475 = (18 − 5 × 0.1701)/2 and 7.57475 = (16 − 5 × 0.1701)/2, from the carbon balance. With these values ΔC = ΔH = ΔO = ΔN = 0 and Δmass = 0 exactly.

**Why CO₂ = 0 is the right closure:**
- Fixing the biomass yield leaves one degree of freedom. β-oxidation releases no CO₂, so CO₂ = 0 closes it.
- The resulting COD split matches ADM1 for LCFA degradation: acetate ≈ 0.67, H₂ ≈ 0.29, biomass ≈ 0.03 of the substrate COD (ADM1: 0.7 and 0.3 of the non-biomass share).
- The current coefficients don't conserve COD: −50, −34 and +63 g COD per mol for rxns 1, 5 and 6.

(Without biomass the cores are: oleic + 16 H₂O → 9 HAc + 15 H₂; linoleic + 16 H₂O → 9 HAc + 14 H₂; palmitic + 14 H₂O → 8 HAc + 14 H₂.)

**Steps (Aspen GUI)**
1. Open Reactions **ACETOGEN** → **Stoichiometry** tab → select **Rxn 1** → **Edit**.
2. Reactants: OLEICACI 1, NH3 0.1701, WATER 15.4897. **Remove CO2** from the reactants.
3. Products: C5H7NO2 0.1701, ACETI-AC 8.57475, HYDROGEN 15.
4. Do the same for **Rxn 5** and **Rxn 6** using the table.
5. On the **Kinetic** tab, check that the exponents are still: OLEICACI 1 (rxn 1), LINOLEIC 1 (rxn 5), PALM 1 (rxn 6), and 0 for everything else.

**Verify:**
- All three ACETOGEN RXMBCK.1 warnings are **gone**.
- After 2.1 and 2.2 together, the run log has **6 fewer warning messages**: ZURE07.8 ×3 and RXMBCK.1 ×3. The Control Panel's simulation-warning total stays at **15**, because these six are input-checking messages and that total doesn't include them.
- B1 results: compare HAc, H₂ and CH₄ against the previous run and note the change in CH₄ yield for your report. Test-run values: BIOGAS CH₄ 14.652 → 14.595 kg/h, CO₂ 25.75 → 23.97 kg/h, B1 duty 0.00352 → 0.00164.

**Side effect seen while MEMB1 was unfixed: RESOLVED by Session 6 (MEMB1 now constrains every component; the 2026-10-06 run has no BALMAS).** What was observed:
- After 2.1 + 2.2, CH4PYRO reports **BALMAS.1** (relative mass imbalance 3.4E-4, above the 1E-4 limit).
- Its feed is MEMB1's outlet, which currently carries about 6× the inlet mass in spurious components (M1–M3). The small shift in biogas composition after 2.2 changes that spurious feed.
- Tightening the CH4PYRO integration tolerance (1E-4 → 1E-5) does **not** remove it, so it isn't an integration-accuracy problem.
- It disappears once MEMB1 constrains every component. Don't hide it by loosening the global mass-balance tolerance.
