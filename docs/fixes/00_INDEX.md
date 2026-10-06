# Fix Plan: one file per session

The full evidence for every item is in [../model_review_2026-10-05.md](../model_review_2026-10-05.md). These files are the **work plan**: do one per Windows session, in order.

Every issue in these files has the same five parts:
**Issue** → **Error it causes** → **Approach** → **Steps** (Aspen GUI / Fortran / ACM code) → **Verify**

## Before every session (2 min)
1. Copy `Memb-Integration-1.bkp` to `Memb-Integration-1_before-sNN.bkp`, so you can roll back.
2. Open the `.bkp` in Aspen Plus V14 and run it once (F5). Note the warning count in the **Control Panel**. The baseline is **15 warnings**.
3. After the session: run, compare against the **Verify** list, then **File → Save As → .bkp**.

## Sessions

| # | Status | File | What gets fixed | Approx. time | What drives the time | Needs |
|---|---|---|---|---|---|---|
| 1 | ✅ Done | [01_quick_edits.md](01_quick_edits.md) | GLYCDEG, BUTYDEG, AMINOACI orders + Ea, calculator bugs, LCFA basis, 2 companion settings | — | Applied: EDIT_LOG E015, E020 | — |
| 2 | ✅ Done (1 known error until S6) | [02_palm_and_acetogen.md](02_palm_and_acetogen.md) | PALM → palmitic acid; element-balanced ACETOGEN 1, 5, 6 | **45–60 min** | Component swap and NRTL re-retrieve ~20 min; typing 3 reactions ~15 min; run and verify | Aspen GUI |
| 3 | ✅ Done (+1 cosmetic warning until S9) | [03_henry_and_b1_volume.md](03_henry_and_b1_volume.md) | Henry components (gas solubility); B1 reactor volume basis | **40–60 min** | Henry setup ~15 min; B1 check 10 min, plus ~20 min if the spec must change | Aspen GUI |
| 4 | ✅ Done | [04_kinetics_basis.md](04_kinetics_basis.md) | Calculators read the B1 outlet, not the inlet (VFA rates ≈ 0 today) | **1.5–3 h** ⚠️ | Re-pointing ~60 Define variables across 10 calculators ~1 h; getting the convergence loop to converge can take 1 h or more | Aspen GUI |
| 5 | ⏳ Not started | [05_membrane_compressor.md](05_membrane_compressor.md) | Add feed compression for the membrane | **30–45 min** | Place and connect 1–2 blocks, set specs, run | Aspen GUI |
| 6 | ⏳ Not started | [06_membrane_acm_rewrite.md](06_membrane_acm_rewrite.md) | Rewrite the ACM model (crash, +504 % mass, charge imbalance, real permeances) | **2–4 h** ⚠️ | ACM compile and debug (code not yet compiled) 1–2 h; ATMLZ export and re-link 30 min; Aspen run and tuning 30–60 min | ACM + Notepad + Aspen GUI |
| 7 | ⏳ Not started | [07_pyrolysis.md](07_pyrolysis.md) | R-1/R-2 units, RWGS reversibility, catalyst loading | **45–90 min** | Depends on finding the k₀ units in the paper; Aspen edits ~20 min | Aspen GUI + source paper |
| 8 | ⏳ Not started | [08_property_data.md](08_property_data.md) | DHFORM, ETHANOL CPIG, H2CO3, NH4+, CYSTEINE, VLSTD, duplicates | **1–1.5 h** | Mostly deletions; +30 min if Option A for DHFORM (drawing molecular structures) | Aspen GUI |
| 9 | ⏳ Not started | [09_cleanup.md](09_cleanup.md) | PURGAS, FLASH3, unused sets, METH options, docs | **30–45 min** | Small deletions and renames, plus updating `CLAUDE.md` | Aspen GUI + Notepad |

**Total: about 9–15 h**, roughly 9 sessions of 1–2 h each. Times include the backup, a test run and the verify checks. One full Aspen run takes about 2 min (the log shows ~121 s).

**Planning your Windows access**
- ⚠️ **Sessions 4 and 6 are the risky ones.** Book a long slot (3–4 h) for each, and don't start them near the end of a visit.
- **Sessions that can share one 2–3 h visit:** 1 + 2, 3 + 5, 8 + 9.
- **Session 6 can be partly prepared on the Mac.** You can't compile there, but you can have the ACM model text final and reviewed beforehand, so the Windows time goes on compiling and testing.

**Why this order:**
- 1–2 are small and low-risk.
- 3–4 fix the digester basis.
- 5 must come before 6, because the membrane has no driving force without compression.
- 7–9 are refinements.

## Progress checklist
- [x] S1 quick edits (EDIT_LOG E015, E020)
- [x] S2 PALM + ACETOGEN (EDIT_LOG E025; 1 known CH4PYRO error until S6)
- [x] S3 Henry + B1 volume (EDIT_LOG E027; 3.2 no change needed)
- [x] S4 kinetics basis (EDIT_LOG E029; tear-variable convergence block, not Fortran user kinetics)
- [ ] S5 compressor
- [ ] S6 ACM rewrite
- [ ] S7 pyrolysis
- [ ] S8 property data
- [ ] S9 cleanup

## Navigation shorthand used in these files
- **Props →** = Properties environment (bottom-left button **Properties**)
- **Sim →** = Simulation environment (bottom-left button **Simulation**)
- **Calculator X → Define / Calculate / Sequence** = Sim → Flowsheeting Options → Calculator → X, then that tab
- **Reactions X** = Sim → Reactions → X
- **Block X** = Sim → Blocks → X (blocks in METH are under Hierarchy METH)
