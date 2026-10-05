# Session 2: PALM → palmitic acid, and element-balanced ACETOGEN

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
3. **Props → Methods → Parameters → Binary Interaction → NRTL-1.** The pairs WATER–PALM, BENZENE–PALM and ETHANOL–PALM were retrieved for hexadecanol. Delete those three rows, then press **Run** (properties only) so Aspen re-retrieves the databank pairs for palmitic acid. If none are found, Aspen estimates them (UNIFAC) because `ESTIMATE ALL` is on.
4. Run properties (Props → Run). Check that the Control Panel has **no LOADMW.5** message.

**Verify after the full run:**
- ZURE07.8 for RSTOIC 3, 5, 6 is **gone**, so the warning count drops by 3.
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
| **1** (oleic) | OLEICACI −1 · NH3 −0.1701 · WATER −15.4897 | C5H7NO2 0.1701 · ACETI-AC 8.5747 · HYDROGEN 15.0000 |
| **5** (linoleic) | LINOLEIC −1 · NH3 −0.1701 · WATER −15.4897 | C5H7NO2 0.1701 · ACETI-AC 8.5747 · HYDROGEN 14.0000 |
| **6** (palmitic) | PALM −1 · NH3 −0.1701 · WATER −13.4897 | C5H7NO2 0.1701 · ACETI-AC 7.5747 · HYDROGEN 14.0000 |

(Without biomass the cores are: oleic + 16 H₂O → 9 HAc + 15 H₂; linoleic + 16 H₂O → 9 HAc + 14 H₂; palmitic + 14 H₂O → 8 HAc + 14 H₂.)

**Steps (Aspen GUI)**
1. Open Reactions **ACETOGEN** → **Stoichiometry** tab → select **Rxn 1** → **Edit**.
2. Reactants: OLEICACI 1, NH3 0.1701, WATER 15.4897. **Remove CO2** from the reactants.
3. Products: C5H7NO2 0.1701, ACETI-AC 8.5747, HYDROGEN 15.
4. Do the same for **Rxn 5** and **Rxn 6** using the table.
5. On the **Kinetic** tab, check that the exponents are still: OLEICACI 1 (rxn 1), LINOLEIC 1 (rxn 5), PALM 1 (rxn 6), and 0 for everything else.

**Verify:**
- All three ACETOGEN RXMBCK.1 warnings are **gone**.
- After 2.1 and 2.2 together, the warning count is **15 − 6 = 9** (assuming no other changes).
- B1 results: compare HAc, H₂ and CH₄ against the previous run and note the change in CH₄ yield for your report.
