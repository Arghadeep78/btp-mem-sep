# Phase 1: Sessions 1–6 (DONE)

All six sessions are applied to `files/Memb-Integration-1.bkp` (Session 6 also updated `zeo_real.acmf` and `Zeo_real.ATMLZ`). Rollback copies: `files/Memb-Integration-1_before-s01.bkp` … `_before-s06.bkp` (plus `_before-s01b`); see the "Undo all of …" lines at the end of [../../EDIT_LOG.md](../../EDIT_LOG.md).

| # | Session | Status | EDIT_LOG | What was fixed |
|---|---|---|---|---|
| 1 | [Quick edits](01_quick_edits.md) | ✅ Done | E015, E020 | GLYCDEG, BUTYDEG, PROPDEG, VALEDEG, AMINODEG, LINODEG/PALMDEG; AMINOACI orders and Ea; LCFA pool in 6 calculators; flash MAXIT 100 and CH4PYRO tolerance 1E-4 |
| 2 | [PALM + ACETOGEN](02_palm_and_acetogen.md) | ✅ Done | E025 | PALM is now palmitic acid; ACETOGEN rxns 1, 5, 6 rebalanced by element |
| 3 | [Henry + B1 volume](03_henry_and_b1_volume.md) | ✅ Done | E027 | Henry set `HC-1`; B1 volume checked, no change needed |
| 4 | [Kinetics basis](04_kinetics_basis.md) | ✅ Done | E029, E030 | 10 calculators read the B1 outlet; damped Wegstein tear loop |
| 5 | [Compressor](05_membrane_compressor.md) | ✅ Done | E032 | 2-stage COMPR + HEATER train to 10 bar, 30 °C (5.5 kW) |
| 6 | [ACM rewrite](06_membrane_acm_rewrite.md) | ✅ Done (by user) | E033 | New well-mixed all-component membrane model, re-exported ATMLZ |

**Result:** 0 errors and 3 warnings (baseline 15 warnings and a +504 % MEMB1 mass imbalance); no MEMB1 mass or charge imbalance; RET/PER at 303 K.

**Verification (2026-10-06, read-only on the Mac):** 30 automated checks of the current `.bkp` and the last run's input echo: 29 pass. The one flagged item is an unused `HIS` in AMINODEG's `REAL` declaration (the sum itself is fixed, so it is harmless). Also: GLYCDEG still spells `KINETIIC`, but Define, Fortran and WRITE-VARS agree, so the result is written. The ATMLZ model matches `zeo_real.acmf`; the tear loop `$OLVER01` converged in 10 iterations (final margin 0.979 against a limit of 1); every reaction passes an element balance (RSTOIC 12/13 have no formula and cannot be tested).

**Not verifiable from the Mac:** the 320 m³ B1 liquid volume (only on Windows); anything that needs a fresh Aspen run.

Remaining work: [Phase 2](../00_INDEX.md) (sections [A](../phase2/A_will_do.md), [B](../phase2/B_check_only.md), [C](../phase2/C_parked.md)).
