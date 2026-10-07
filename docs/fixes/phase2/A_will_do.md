# Phase 2, Session A: We will do

**Session status (2026-10-07):** ✅ A1–A8 done (EDIT_LOG E048–E050, E052–E053). A1, A6, A7, A8 were records for the report only; their content now lives only in [results_2026-10-07.md](../../results_2026-10-07.md) (A1 pyrolysis vs equilibrium, A6 final run, A7 assumptions, A8 design point) and was removed here.

Records, notes and small clean edits. **Nothing here changes the headline results** (the property-data deletions A2–A4 only change small data entries).

Other sessions: [B1](B1_can_do_now.md) · [B2](B2_needs_source_paper.md) · [C](C/00_README.md). Overview and ranking: [../00_INDEX.md](../00_INDEX.md). Phase 1 (done): [../phase1/00_PHASE1_DONE.md](../phase1/00_PHASE1_DONE.md). Evidence: [source_check_results.md](source_check_results.md).

Contents: property data (A2–A4) · cleanup and documentation (A5).

---

## Property data cleanup


**Scope and status**

**Status:** ⏳ Not started. Scope agreed 2026-10-06 (obvious errors only; design near final): **do** A2, A3, A4; **optional** B3, B4, B5 (no effect on results, they only remove warnings or bad data); **leave and state as assumptions** C6 (mixed ΔHf basis; effect limited to the small KERATIN stream) and C7 (NH4+ has no flow). Perry's Handbook check: [source_check_results.md](source_check_results.md) §3; per-item results are in the "Perry check" lines below.

All in **Props → Methods → Parameters** (Pure Components / Binary Interaction) and **Props → Components → Specifications**. Back up first.

Items: **A (we will do)** · **B (optional / check, no effect on results)** · **C (parked)** (looks like an error, decided to leave and state it as an assumption; revisit later). Former numbers 8.1–8.9 are now A2–A4, B3–B5 and C6–C8 (see the mapping in the index).

### A2. ETHANOL heat capacity is entered in the wrong units (review C5)

**Issue:** the PROP-DATA CPIG-1 coefficients for ETHANOL are cal/mol·K with T in °C, but they were entered under SI.
**Error it causes:** LCCHCK.4: Cp = 15.697 J/kmol·K (should be about 65 000). The enthalpy of every stream containing ethanol is wrong.
**Perry check (done):** Perry's ideal-gas Cp for ethanol (Table 2-156, PDF p.221, printed 2-178) gives 65 407 J/kmol·K at 300 K (15.63 cal/mol·K). The entered polynomial, read as cal/mol·K with T in °C, matches it: 0.4 % at 27 °C, 0.2 % at 100 °C, 0.6 % at 300 °C, 2 % at 770 °C, 7 % at the 1045 °C upper limit. So the **data are right and only the units are wrong** (Aspen reads them as J/kmol·K, about 4 000× too small).
**Steps:** Pure Components → **CPIG-1** → delete the **ETHANOL** column/row. The databank (PURE40) value is then used. (Re-entering the same coefficients ×4184 in SI would also work.)
**Effect on results (checked 2026-10-07 from the stored streams):** ethanol is 0.0603 kmol/h out of RSTOIC (all of it from rxn 10, because rxn 11 never fires: see C26); 0.0547 kmol/h ends in the digestate and 0.0056 kmol/h in the biogas (removed later at FLASH/NH3SEP). The Cp error shifts the RSTOIC duty by about **34 W of 25.0 kW (0.14 %)** and leaves the **B1 duty unchanged** (ethanol enters and leaves B1 at the same temperature). No product flow changes. (The log reports duties in W: HEAT2 computed with Perry's Cp is 19.44 kW against 19 385 W logged.)
**Verify:** LCCHCK.4 is gone.

**Status:** ✅ Done 2026-10-07 (E048): ETHANOL entry deleted from CPIG-1. LCCHCK.4 gone; RSTOIC duty +34 W (25.036 → 25.070 kW); B1 unchanged.

---

### A3. Copy-pasted VLSTD values (review D3)

**Issue:** REVIEW-1 VLSTD: THREONIN = VALINE = ASPARTIC = 0.156261 m³/kmol, and SERINE = ALANINE = 0.0588971.
**Error it causes:** wrong standard liquid volumes, which feed `STDVOL-FLOW`. That was the concentration basis in the calculators before Session 4.
**Perry check (done):** Perry's Table 2-2 (printed 2-28 onwards, PDF p.71–83) has only glycine (density 1.161 g/cm³), leucine (1.293) and alanine (no density). The copied value 0.156261 m³/kmol (156.3 cc/mol) implies a density of only 0.75–0.85 g/cc for THREONIN, VALINE and ASPARTIC, implausible for solid amino acids, so the **copy-paste is confirmed**. SERINE at 0.0588971 (58.9 cc/mol) implies 1.78 g/cc, which is high. For reference, glycine from Perry's density is 64.7 cc/mol (entered 50.7) and leucine 101.4 cc/mol (entered 135.2); sources disagree on glycine's density, so treat that as a flag only.
**Steps:** REVIEW-1 → delete these VLSTD values (the databank/PCES supplies them), or enter real values.

**Status:** ✅ Done 2026-10-07 (E052). Deleting the values was tested first and does **not** work: no databank holds VLSTD for these amino acids and PCES does not estimate it, so the calculators lose `VOLFLOW` (APLX2S.5/.3, 60 warnings) and biogas falls from 2.75 to 0.57 kmol/h. Instead the copied values were **replaced** by MW ÷ crystal density (the same convention as the other amino acids). ISOLEUCI (0.179153, implying 0.73 g/cm³) was wrong too and was corrected with them.

| Component | Crystal density (g/cm³) | Source | Old VLSTD (m³/kmol) | New VLSTD = MW/ρ (m³/kmol) |
|---|---|---|---|---|
| ALANINE | 1.401 | CRC / Merck | 0.0588971 | 0.0635931 |
| SERINE | 1.537 | CRC / Merck | 0.0588971 | 0.0683754 |
| VALINE | 1.230 | CRC / Merck | 0.156261 | 0.0952423 |
| ASPARTIC | 1.660 | CRC / Merck | 0.156261 | 0.0801831 |
| THREONIN | 1.4505 (from cell) | Ramanadham et al. 1973 | 0.156261 | 0.0821248 |
| ISOLEUCI | 1.228 | Curland et al. 2018 | 0.179153 | 0.10682 |

Sources: CRC Handbook of Chemistry and Physics, 58th ed. (1977) and Merck Index, 11th ed. (1989), as tabulated by the [JenaLib Amino Acid Repository](https://jenalib.leibniz-fli.de/IMAGE_AA.html); threonine from the neutron-diffraction cell a = 13.630, b = 7.753, c = 5.162 Å, Z = 4 (Ramanadham et al. 1973); isoleucine D_x = 1.228 g/cm³ ([Curland et al., Acta Cryst. E 74 (2018)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6002834)).

**Effect:** below 1e-6 on all duties, flows and compressor power; warnings unchanged. Not changed (flag only): LEUCINE (PCES 135.2 cc/mol vs 110.1 from the CRC density 1.191) and GLYCINE (PCES 50.7 vs 46.7 from 1.607).

---

### A4. Duplicate entries (review C3, C4)

| Issue | Warning | Steps |
|---|---|---|
| DHVLWT **and** DHVLDP for PROLINE, CYSTEINE, ARGININE (Aspen uses DHVLWT) | DPRSW2.3 ×3 | Pure Components → **delete the DHVLDP-1 set** |
| GLYCINE VLSTD in both PCES-1 (50.745 cc/mol) and REVIEW-1 (0.0507 m³/kmol) | PVAL.7 | Delete the GLYCINE VLSTD from **REVIEW-1** |

**Verify:** 4 fewer warnings.

**Status:** ✅ Done 2026-10-07 (E048): the 3 user DHVLDP entries (the ignored ones) and the user GLYCINE VLSTD in REVIEW-1 deleted (the PCES value 50.745 cc/mol is the same number). DPRSW2.3 ×3 and PVAL.7 gone; no results change. The databank rows of DHVLDP-1 are kept.

##### Property data: verify all (A2–A4)
Printed warning messages (last run: 13 in total, of which 3 are simulation warnings): A2–A4 remove **5** (LCCHCK.4; 3 × DPRSW2.3; PVAL.7), so 13 → **8**. B4 (optional) removes 2 more (the H2CO3 LCLIMS), so → **6**. What remains: DGCHK1.1 (DHFORM, parked C6), 2 × LCLIMS for CARBON (benign) and the 3 simulation warnings (NH3SEP and MEMB1 Henry messages, PURGAS zero flow). Record the RSTOIC and B1 duties before and after (expected change about 0.14 % on RSTOIC, none on B1).
**Result 2026-10-07 (A2 + A4):** 13 → **8** printed warnings, as predicted. A3 (values replaced, E052) leaves the count at 8.
Other expected effects: A3 changes the calculators' standard-volume basis by about 0.04 % (the copied amino acids are a tiny part of the liquid), so the tear loop reconverges with negligible change; A4 changes nothing (Aspen already used one entry of each). Headline results stay the same.

---

## Cleanup and documentation


**Scope and status**

**Status:** 🟡 Reduced scope. The design is near final, so only obvious errors are removed; tidy-ups and anything that touches the flowsheet are parked in section C.

Sections: **A. We will do** · **B. Check only** · **C. Parked** (looks like an error or leftover, not touched because of a design decision; revisit later).

Back up the `.bkp` before any Aspen step.

### A5. Update the project notes (`CLAUDE.md`), Mac, doc only

**Status:** ✅ Done 2026-10-07 (E050). Correction: `_3908gjr.*`, `.apw`, `.appdf` and the crash dump **do** sit in `files/` on the Windows PC; they are git-ignored, so they are not in the repo.
Record in `CLAUDE.md` (§4):
- File inventory: `_3908gjr.*`, `.apw`, `.appdf` and the crash dump are not in `files/`.
- M9 ("ACMEXP block METH.B1 not initialized") cannot be verified with the current files.
- Mark each fixed item ✅ with the session date; add the parked items (Session C) under "Parked (decided not to touch)".
- Keep the line pointing to `docs/fixes/00_INDEX.md`.
