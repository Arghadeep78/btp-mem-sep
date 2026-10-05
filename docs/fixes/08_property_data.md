# Session 8: Property data cleanup

All in **Props → Methods → Parameters** (Pure Components / Binary Interaction) and **Props → Components → Specifications**. Back up first.

---

## 8.1 Missing and mixed-basis heats of formation (C2)

**Issue:**
- TYROSINE, TRYPTOPH and METHIONI have no DHFORM/DHAQFM.
- The values entered for the other amino acids (REVIEW-1, e.g. alanine −561.2 kJ/mol) look like **solid-state** ΔHf, but Aspen's DHFORM is the **ideal-gas** ΔHf at 298 K.

**Error it causes:**
- Log DGCHK1.1 (B1): "absence … will result in incorrect enthalpy results".
- B1's heat duty (4275.86 in the log) and reaction heats are wrong.

**Approach:** use one consistent basis for all amino acids.

**Steps (choose one)**
- **Option A, estimate everything consistently:**
  1. Props → Components → **Molecular Structure** → for each amino acid choose **Define molecule by its connectivity**, or import a .mol file (PubChem).
  2. Delete the DHFORM values from REVIEW-1.
  3. With `ESTIMATE ALL` on, PCES (Benson group contribution) estimates DHFORM for all of them on the same ideal-gas basis.
- **Option B, literature values:** take **gas-phase** ΔHf from the NIST WebBook for every amino acid used. Enter them in REVIEW-1 → DHFORM for all of them, including TYR/TRP/MET.

**Verify:** DGCHK1.1 is gone and the B1 duty changes. Record the new value.

---

## 8.2 ETHANOL heat capacity is entered in the wrong units (C5)

**Issue:** the PROP-DATA CPIG-1 coefficients for ETHANOL are cal/mol·K with T in °C, but they were entered under SI.
**Error it causes:** LCCHCK.4: Cp = 15.697 J/kmol·K (should be about 65 000). The enthalpy of every stream containing ethanol is wrong.
**Steps:** Pure Components → **CPIG-1** → delete the **ETHANOL** column/row. The databank (PURE40) value is then used.
**Verify:** LCCHCK.4 is gone.

---

## 8.3 HCO3⁻ heat capacity is likely ×4184 too large (D1)

**Issue:** CPIG for HCO3- is entered under `MOLE-HEAT-CA = cal/mol-K`, but its numbers (19795 + 73.4·T) match J/kmol·K (the same numbers are entered for H2CO3 under SI).
**Error it causes:** none today (HCO3⁻ has no flow), but it would be wrong if chemistry were ever added.
**Steps:** CPIG-1 (the cal/mol-K set) → delete the HCO3- entry.

---

## 8.4 H2CO3 is a placeholder component (C5)

**Issue:** H2CO3 has dummy data (PLXANT 0/−1000, DHVLWT 100/300, OMEGA 7.18, PC 50, VC 150) and takes part in no reaction.
**Error it causes:** LCLIMS.3 and LCLIMS.4 out-of-bounds warnings.
**Steps:** first delete H2CO3 from every PROP-DATA set (PCES-1, PURE-2, CPIG-1, DHVLWT-1, MULAND-1, PLXANT-1). Then Components → Specifications → delete **H2CO3**. Also remove it from the H2S-SEP/NH3SEP split lists if Aspen asks.
**Verify:** 2 fewer warnings.

---

## 8.5 NH4+ is a neutral copy of NH3 (D2)

**Issue:** NH4+ is defined with formula **H3N** (ammonia), and its NRTL pairs are copies of NH3's.
**Error it causes:** no effect today (no flow, no chemistry), but the name is misleading. The calculators add NH3 + NH4 assuming it is the ion.
**Steps (choose one):**
- **Delete NH4+** (simplest). First remove it from the calculator DEFINEs (NH4 variables) and set `C_TNH3 = NH3` in the Fortran; or
- keep it, but rename it in the model description to "unused".

---

## 8.6 CYSTEINE data copied from PROLINE (C7)

**Issue:**
- TC, PC, ZC, VC, PLXANT, DHVLWT, DHVLDP and the PCES values for CYSTEINE are identical to PROLINE's.
- The entered formula `C3H6NO2S` is one H short of cysteine (C3H7NO2S).

**Error it causes:** wrong cysteine volatility and enthalpy in B1 (small amounts, but wrong).
**Steps:**
1. Components → CYSTEINE → **Find** → confirm it maps to **L-cysteine C3H7NO2S**, and re-select it if not.
2. Delete CYSTEINE from PURE-1, PCES-1, DHVLWT-1, DHVLDP-1 and PLXANT-1.
3. Let the databank or PCES supply the values.

---

## 8.7 Copy-pasted VLSTD values (D3)

**Issue:** REVIEW-1 VLSTD: THREONIN = VALINE = ASPARTIC = 0.156261 m³/kmol, and SERINE = ALANINE = 0.0588971.
**Error it causes:** wrong standard liquid volumes, which feed `STDVOL-FLOW`. That was the concentration basis in the calculators before Session 4.
**Steps:** REVIEW-1 → delete these VLSTD values (the databank/PCES supplies them), or enter real values.

---

## 8.8 Duplicate entries (C3, C4)

| Issue | Warning | Steps |
|---|---|---|
| DHVLWT **and** DHVLDP for PROLINE, CYSTEINE, ARGININE (Aspen uses DHVLWT) | DPRSW2.3 ×3 | Pure Components → **delete the DHVLDP-1 set** |
| GLYCINE VLSTD in both PCES-1 (50.745 cc/mol) and REVIEW-1 (0.0507 m³/kmol) | PVAL.7 | Delete the GLYCINE VLSTD from **REVIEW-1** |

**Verify:** 4 fewer warnings.

---

## 8.9 Benign: no action
- CARBON TC/VC out of bounds (LCLIMS.3): CARBON is CISOLID, so its critical properties are never used.
- PCERTE.10 "structure not defined" for all 62 components: information only. It matters only for PROT, KERATIN and INERT (user components), if you ever need estimated properties for them.

## Session 8: verify all
Warning count drops by roughly 9 (DGCHK, LCCHCK, 2 × LCLIMS, 3 × DPRSW, PVAL, plus any H2CO3-related). Record the B1 duty before and after.
