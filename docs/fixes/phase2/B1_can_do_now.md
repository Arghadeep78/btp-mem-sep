# Phase 2, Session B1: Check only, can be done now (no source paper needed)

Tests and optional deletions that need no source paper: B3 (property data), B6 (cleanup), B10 (RSTOIC check). B4, B5 and B7 were moved to Session C as C28, C29 and C30 on 2026-10-07. Split from the former `B_check_only.md` (Section 1) on 2026-10-07.

Other sessions: [A](A_will_do.md) · [B2](B2_needs_source_paper.md) · [C](C_parked.md). Overview and ranking: [../00_INDEX.md](../00_INDEX.md). Phase 1 (done): [../phase1/00_PHASE1_DONE.md](../phase1/00_PHASE1_DONE.md). Evidence: [source_check_results.md](source_check_results.md).

---

**Section status (2026-10-07):** ✅ complete. B3 done (E055) · B6 harmless · B10 confirmed.

## Property data cleanup

### B3. HCO3⁻ heat capacity is likely ×4184 too large (review D1)

**Perry check:** not in Perry (no bicarbonate-ion data); a unit problem by inspection.

**Issue:** CPIG for HCO3- is entered under `MOLE-HEAT-CA = cal/mol-K`, but its numbers (19795 + 73.4·T) match J/kmol·K (the same numbers are entered for H2CO3 under SI).
**Error it causes:** none today (HCO3⁻ has no flow), but it would be wrong if chemistry were ever added.
**Steps:** CPIG-1 (the cal/mol-K set) → delete the HCO3- entry.

**Status:** ✅ Done 2026-10-07 (E055). Confirmed first: the entry carried `UNITLABEL2 = "cal/mol-K"` with the J/kmol·K numbers copied from H2CO3. After deleting it: no new messages, results change < 1e-8.

---

## Cleanup and documentation

### B6. `PERMEATE.V` harmlessness test (5 min, Windows)
`PERMEATE.V` is fixed at 50 cc/mol (added in edit-6). No equation uses it, and Aspen re-flashes RET and PER at T and P, so it should not affect results.
1. Run; note RET/PER flows, CH₄/CO₂/H₂ fractions and temperatures.
2. METH → MEMB1 → Variables → `Permeate.V`: 50 → **25 000** (keep Fixed). Run.
3. Identical (to about 1e-6) → harmless; no further action (the ACM fix is parked, C17). Different → stop and record the numbers.
4. Set it back to 50, or do not save.

**Status:** ✅ Done 2026-10-07 (COM test on a scratch copy, nothing saved): with `PERMEATE.V` = 25 000 every flow, duty, temperature and density is identical (difference 0). Harmless; the ACM fix stays parked (C17). The FPEPRT.8 severe error of COM runs is present with both values, so `PERMEATE.V` is not its cause.

Correct values for reference: RT/P ≈ 25 204 cc/mol (PER, 1 bar, 30 °C) and ≈ 2 520 (RET, 10 bar), matching Aspen's `FEED.V` of 2 520.5.

---

## Digester (RSTOIC)

### B10. Confirm that RSTOIC rxn 11 and rxn 8 do not fire (Windows, MCP read, 5 min)

**Finding (2026-10-07, from the stored stream 5 in the `.bkp`):** RSTOIC is set to `SERIES=NO`, so each conversion is applied to the **feed** amount of its key component. Rxn 11 (2 EtOH + CO₂ → 2 HAc + CH₄, 80 % of ETHANOL) and rxn 8 (XYLOSE → FURFURAL + 3 H₂O, 10 % of XYLOSE) have key components that are only made inside RSTOIC (by rxn 10 and rxn 7), so their extent is zero. Hand-computed extents against the stored outlet:

| Component in stream 5 (kmol/h) | If rxn 11 / rxn 8 are OFF | If they are ON | Stored value |
|---|---|---|---|
| ETHANOL | 0.06029 | 0.01206 | **0.06029** |
| ACETI-AC | 0.07707 | 0.12530 | **0.07707** |
| METHANE | 0.19454 | 0.20660 | **0.19454** |
| CO2 | 0.25483 | 0.24277 | **0.25483** |
| XYLOSE | 0.00617 | 0.00555 | **0.00617** (no furfural 0.00062) |

All other RSTOIC reactions match their hand-computed extents exactly (dextrose 0.12811, glycerol 0.02434, PALM 0.02968; unreacted cellulose 0.02261, hemicellulose 0.02466, starch 0.04522).

**Steps:** run once; read the component flows of stream **5** (ETHANOL, ACETI-AC, METHANE, CO2, XYLOSE, FURFURAL) through the MCP or Stream Results. Confirm they match the "OFF" column.
**Verify:** values recorded. If confirmed, the fix decision is parked in C26 / C27.

**Status:** ✅ Confirmed 2026-10-07 (COM run): stream 5 = ETHANOL 0.06029, ACETI-AC 0.07707, METHANE 0.19454, CO2 0.25483, XYLOSE 0.00617, FURFURAL 0, exactly the "OFF" column. Rxn 11 and rxn 8 do not fire; decision stays parked in C26 / C27.
