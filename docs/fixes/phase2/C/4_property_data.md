# C · 4. Property data

[README](00_README.md) · [1_digester](1_digester.md) · [2_pyrolysis](2_pyrolysis.md) · [3_membrane](3_membrane.md) · [4_property_data](4_property_data.md) · [5_flowsheet_tidyups](5_flowsheet_tidyups.md)

### C6. Missing and mixed-basis heats of formation (review C2)

- **Issue:** TYROSINE, TRYPTOPH and METHIONI have no DHFORM/DHAQFM. The values entered for the other amino acids (REVIEW-1, e.g. alanine −561.2 kJ/mol) look like **solid-state** ΔHf, but Aspen's DHFORM is the **ideal-gas** ΔHf at 298 K.
- **Effect:** log DGCHK1.1 (B1): "absence … will result in incorrect enthalpy results". The missing values have **no numerical effect today** (TYR/TRP/MET have no source in the model, so their flow is zero); they matter once these amino acids get a source. The **mixed basis** of the entered values does affect results today: those amino acids come from KERATIN, so B1's heat duty (4275.86 in the log) and the reaction heats are wrong.
- **Perry check (done):** Table 2-179 (PDF p.238 onwards, printed 2-195 onwards) lists the **ideal-gas** ΔHf at 298.15 K, so Aspen's DHFORM basis is confirmed and the solid-state REVIEW-1 values are the wrong basis. **No amino acids are tabulated.** Perry's estimation method is Domalski–Hearing (PDF p.521, printed 2-478, group values in Table 2-343).
- **Decision:** leave and state it as an assumption. **First check the project source:** if it states ΔHf values or the enthalpy basis, follow it; otherwise use Route 1.
- **Route 1 (estimate everything consistently):** (1) Props → Components → **Molecular Structure** → for each amino acid choose **Define molecule by its connectivity**, or import a .mol file (PubChem); (2) delete the DHFORM values from REVIEW-1; (3) with `ESTIMATE ALL` on, PCES (Benson group contribution) estimates DHFORM for all of them on the same ideal-gas basis.
- **Route 2 (literature):** take **gas-phase** ΔHf from the NIST WebBook for every amino acid used and enter them in REVIEW-1 → DHFORM, including TYR/TRP/MET.
- **Verify:** DGCHK1.1 is gone and the B1 duty changes; record the new value.
- **Revisit if:** the digester energy balance is a reported result, or TYR/TRP/MET get a source.

### C29. CYSTEINE data copied from PROLINE (review C7; moved from B5)

- **Issue:** TC, PC, ZC, VC, PLXANT, DHVLWT, DHVLDP and the PCES values for CYSTEINE are identical to PROLINE's. The entered formula `C3H6NO2S` is one H short of cysteine (C3H7NO2S). Perry: not tabulated (no cysteine, proline or arginine).
- **Findings (2026-10-07):** CYSTEINE maps to the databank species `CYSTEINE-E-2` (C3H6NO2S, MW 120.15), not L-cysteine (C3H7NO2S, 121.16). AMINOACI rxn 23 (CYSTEINE + 2 H2O → HAc + NH3 + CO2 + 0.5 H2 + H2S) balances **only** with C3H6NO2S, and RSTOIC rxn 13 makes 0.067 CYSTEINE per KERATIN. The user data (TC 1021, PC 6.74e6, ZC 0.186, VC 0.234, DHFORM −5.344e8, CPSDIP, PLXANT) are PROLINE's.
- **Why parked:** a reaction change, not a cleanup; effect on results very small (cysteine is a minor amino acid).
- **Fix:** (1) Components → CYSTEINE → **Find** → re-select **L-cysteine C3H7NO2S**; (2) change rxn 23 H2 from 0.5 to 1.0; (3) recheck the KERATIN mass balance (RXMBCK); (4) delete CYSTEINE from PURE-1, PCES-1, DHVLWT-1, DHVLDP-1 and PLXANT-1; (5) confirm the databank or PCES fills TC/PC/VC/ZC (A3 showed PCES does not always).
- **Revisit if:** the amino-acid chemistry must be exact (for example a COD or element balance of the digester that includes cysteine).

### C28. H2CO3 is a placeholder component (review C5; moved from B4)

- **Issue:** H2CO3 has dummy data (PLXANT 0/−1000, DHVLWT 100/300, OMEGA 7.18, PC 50, VC 150) and takes part in no reaction. Perry: not tabulated.
- **Effect:** LCLIMS.3 and LCLIMS.4 out-of-bounds warnings only; no flow, no result change.
- **Why parked:** needs a GUI edit. Deleting a component cannot be done safely as a `.bkp` text edit: H2CO3 appears in 55 places, including stored results arrays sized by the component count, the MEMB1 (ACM) component vectors and the H2S-SEP/NH3SEP/PURGAS split lists, and a COM save drops the MEMB1 `PERMEATE.P` spec.
- **Fix (about 5 min in the GUI):** delete H2CO3 from every PROP-DATA set (PCES-1, PURE-2, CPIG-1, DHVLWT-1, MULAND-1, PLXANT-1), then Components → Specifications → select H2CO3 → Delete; accept Aspen's prompts (split lists); run, save. **Verify:** 2 fewer warnings.
- **Revisit if:** you want the 2 LCLIMS warnings gone, or chemistry (ions) is ever added.

### C7. NH4+ is a neutral copy of NH3 (review D2)

- **Issue:** NH4+ is defined with formula **H3N** (ammonia, MW 17.03 instead of the ion H₄N⁺, 18.04), and its NRTL pairs are copies of NH3's. Perry: not tabulated.
- **Effect:** none today (no flow, no chemistry), but the name is misleading; the calculators add NH3 + NH4 assuming it is the ion.
- **Fix (choose one):** **delete NH4+**: first remove it from the calculator DEFINEs (NH4 variables) and drop `+ NH4` from the Fortran: `C_TNH3 = NH3 + NH4` → `C_TNH3 = NH3`; in PROPDEG `C_TNH3 = TNH3FLOW + NH4` → `C_TNH3 = TNH3FLOW`; in VALEDEG `CTNH3 = TNH3FLOW + NH4` → `CTNH3 = TNH3FLOW`. Or keep it and describe it as "unused".
- **Revisit if:** a CHEMISTRY block is added.

### C8. Benign: no action

- CARBON TC/VC out of bounds (LCLIMS.3): CARBON is CISOLID, so its critical properties are never used.
- PCERTE.10 "structure not defined" for all 62 components: information only. It matters only for PROT, KERATIN and INERT (user components), if you ever need estimated properties for them.
