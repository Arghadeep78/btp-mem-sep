# Fix Plan: two phases

The full evidence for every item is in [../model_review_2026-10-05.md](../model_review_2026-10-05.md). These files are the **work plan**: do one per Windows session, in order.

| Phase | Sessions | Status | Start here |
|---|---|---|---|
| **Phase 1** | 1–6 | ✅ Done | [phase1/00_PHASE1_DONE.md](phase1/00_PHASE1_DONE.md) |
| **Phase 2** | A, B, C | 🟡 Reduced scope: obvious errors only; design near final | [phase2/A_will_do.md](phase2/A_will_do.md), [B1_can_do_now.md](phase2/B1_can_do_now.md), [B2_needs_source_paper.md](phase2/B2_needs_source_paper.md), [C/00_README.md](phase2/C/00_README.md) |

Who can do what (Claude vs you): [claude_coverage.md](claude_coverage.md). Source-check evidence (Perry's Handbook against the model): [phase2/source_check_results.md](phase2/source_check_results.md).

Every issue in these files has the same five parts:
**Issue** → **Error it causes** → **Approach** → **Steps** (Aspen GUI / Fortran / ACM code) → **Verify**

Phase 2 is organised by section, not by topic: **A. We will do** · **B. Check only / optional** · **C. Parked** (looks like an error, decided not to touch because of a design decision; revisit later).

## Before every session (2 min)
1. Copy `Memb-Integration-1.bkp` to `Memb-Integration-1_before-sNN.bkp`, so you can roll back.
2. Open the `.bkp` in Aspen Plus V14 and run it once (F5). Note the warning count in the **Control Panel**. The baseline is **15 warnings**.
3. After the session: run, compare against the **Verify** list, then **File → Save As → .bkp**.

---

# Phase 1: Sessions 1–6 (DONE)

| # | Status | File | What gets fixed | Approx. time | What drives the time | Needs |
|---|---|---|---|---|---|---|
| 1 | ✅ Done | [01_quick_edits.md](phase1/01_quick_edits.md) | GLYCDEG, BUTYDEG, AMINOACI orders + Ea, calculator bugs, LCFA basis, 2 companion settings | — | Applied: EDIT_LOG E015, E020 | — |
| 2 | ✅ Done | [02_palm_and_acetogen.md](phase1/02_palm_and_acetogen.md) | PALM → palmitic acid; element-balanced ACETOGEN 1, 5, 6 | **45–60 min** | Component swap and NRTL re-retrieve ~20 min; typing 3 reactions ~15 min; run and verify | Aspen GUI |
| 3 | ✅ Done (Henry warnings are cosmetic and parked: Phase 2 C16) | [03_henry_and_b1_volume.md](phase1/03_henry_and_b1_volume.md) | Henry components (gas solubility); B1 reactor volume basis | **40–60 min** | Henry setup ~15 min; B1 check 10 min, plus ~20 min if the spec must change | Aspen GUI |
| 4 | ✅ Done | [04_kinetics_basis.md](phase1/04_kinetics_basis.md) | Calculators read the B1 outlet, not the inlet (VFA rates ≈ 0 today) | **1.5–3 h** ⚠️ | Re-pointing ~60 Define variables across 10 calculators ~1 h; getting the convergence loop to converge can take 1 h or more | Aspen GUI |
| 5 | ✅ Done | [05_membrane_compressor.md](phase1/05_membrane_compressor.md) | Add feed compression for the membrane | **30–45 min** | Place and connect 1–2 blocks, set specs, run | Aspen GUI |
| 6 | ✅ Done (by user, edit-6) | [06_membrane_acm_rewrite.md](phase1/06_membrane_acm_rewrite.md) | Rewrite the ACM model (crash, +504 % mass, charge imbalance, real permeances) | **2–4 h** ⚠️ | ACM compile and debug (code not yet compiled) 1–2 h; ATMLZ export and re-link 30 min; Aspen run and tuning 30–60 min | ACM + Notepad + Aspen GUI |

**Planning notes from the original plan (historical)**
- ⚠️ **Sessions 4 and 6 were the risky ones.** Book a long slot (3–4 h) for each, and don't start them near the end of a visit.
- **Sessions that could share one 2–3 h visit:** 1 + 2, 3 + 5.
- **Session 6 could be partly prepared on the Mac.** You can't compile there, but you can have the ACM model text final and reviewed beforehand, so the Windows time goes on compiling and testing.
- **Why this order:** 1–2 are small and low-risk; 3–4 fix the digester basis; 5 must come before 6, because the membrane has no driving force without compression; the rest became Phase 2.
- **Original total: about 9–15 h**, roughly 9 sessions of 1–2 h each. Times include the backup, a test run and the verify checks. One full Aspen run takes about 2 min (the log shows ~121 s).

---

# Phase 2: three sessions, A, B and C (remaining; reduced scope)

Phase 2 is **three sessions, one file each**. Items are grouped by topic inside each file and carry a new ID (A1–A8, B1–B10, C1–C29; B4 and B5 moved to C28 and C29) that is unique across the phase.

| Session | File | Contents | Approx. time |
|---|---|---|---|
| **A: We will do** (✅ done 2026-10-07) | [phase2/A_will_do.md](phase2/A_will_do.md) | **Pyrolysis:** A1 record the outlet against equilibrium. **Property data:** A2 ETHANOL Cp, A3 copied VLSTD, A4 duplicate entries. **Cleanup:** A5 update `CLAUDE.md`, A6 final run and record. **Membrane/digester:** A7 record assumptions, A8 record the design point | A1 5–10 min · A2–A4 30–40 min · A5, A6 5–10 min + doc · A7, A8 20–30 min (Mac, doc only) |
| **B: Check only / optional** | [phase2/B1_can_do_now.md](phase2/B1_can_do_now.md) + [phase2/B2_needs_source_paper.md](phase2/B2_needs_source_paper.md) | **Pyrolysis:** B1 source check P1–P9, B2 catalyst loading. **Property data (optional):** B3 HCO₃⁻ Cp, B4 H₂CO₃, B5 CYSTEINE. **Cleanup:** B6 `PERMEATE.V` test, B7 NH3 stream status. **Membrane/digester:** B8 membrane data (PM1–PM6, OP1–OP5), B9 digester data (G1–G7). **Hydrolysis:** B10 confirm RSTOIC rxn 11 and rxn 8 do not fire | B1, B2 30–60 min · B3–B5 20–30 min · B6, B7 5–10 min · B8, B9 1–2 h (Mac, with the paper) · B10 5 min |
| **C: Parked** (looks like an error, not touched because of a design decision) | [phase2/C/00_README.md](phase2/C/00_README.md) | **Pyrolysis:** C1–C5 (R-2/R-1 irreversible, k₀ units, Boudouard, catalyst). **Property data:** C6 mixed ΔHf basis, C7 NH4+, C8 benign. **Cleanup:** C9–C17 (PURGAS, FLASH3, renames, METH options, unused sets, MEMB1 units, sensitivity, Henry warnings, `PERMEATE.V`). **Membrane/digester:** C18–C25 (pressure ratio and area/pressure point, second stage, Π(T), fugacity, V, 55 °C, propionate, hydrogenotrophs). **Hydrolysis:** C26 RSTOIC rxn 11 never fires (CH₄ up to +5 %), C27 rxn 8 never fires. **Moved from B (2026-10-07):** C28 delete H2CO3 by hand in the GUI, C29 CYSTEINE identity and rxn 23 change | not planned; revisit only when a "Revisit if" condition is met |

**Old references → new IDs** (for earlier chat notes, the edit log and the review): former Session 7 items A1, B1, B2, C1–C5 are unchanged · former 8.2, 8.7, 8.8 → A2, A3, A4 · 8.3, 8.4, 8.6 → B3, B4, B5 · 8.1, 8.5, 8.9 → C6, C7, C8 · former Session 9 A1, A2 → A5, A6; B1, B2 → B6, B7; C1–C9 → C9–C17 · former Session 10 A1, A2 → A7, A8; B1, B2 → B8, B9; C1–C8 → C18–C25 · the membrane checklist labels A1–A6 and B1–B5 are now PM1–PM6 and OP1–OP5 · the ΔHf "Option A / Option B" are now "Route 1 / Route 2". Review IDs (C5, D1 …) are written "review C5" in headings.

### What could move the results summary (ranked), with section, difficulty and time

Estimates; "check" is on the Mac with the source, "apply" is Aspen/ACM work on Windows (Claude edits, you approve).

| Rank | Item | Section | What it could change | Difficulty | Check | Apply | Total |
|---|---|---|---|---|---|---|---|
| 1 | **Digester basis** (feed, hydrolysis conversions, Monod/inhibition constants, temperature) | **B9**; **C23, C24, C25** | Biogas flow and CH₄ yield; everything downstream scales with it. Size cannot be quantified without a run (today 0.228 m³ CH₄/kg COD, 65 % of Perry's ceiling) | **High** if constants or T change; Low if the paper matches | 1–2 h | Feed/HRT/T 20–30 min; RSTOIC conversions 20 min; constants in 10 calculators 1–2 h; tear-loop re-convergence 0.5–1.5 h | 0.5 h to 4–6 h |
| 2 | **Pyrolysis kinetics from the paper** | **B1** | H₂, carbon and CO. Conversion is about 100 % today; much slower real kinetics (50–60 %) would cut H₂ and carbon by more than 30 % | **Medium** | 30–60 min | k₀/Eₐ/orders 15–30 min; partial-pressure basis 30 min; compare and adjust 30–45 min | 1.5–2.5 h |
| 3 | **Membrane permeances** | **B8** (PM2–PM4) | Π_CO₂ and Π_H₂ ×0.5 / ×2: RET CH₄ 70 % / 82 % (now 76.4 %). Π_CH₄ ×3 / ×0.33: recovery 91 % / 99 % (now 96.9 %). Himeno 2007 values: 81.7 % purity, 98.7 % recovery | **Low–Medium** | 30–60 min | Edit 3 numbers in ACM, compile, export, re-link, run: 45–90 min | 1.5–2.5 h |
| 4 | **Membrane area or pressure** | **C18** | 10 m²: 82.3 % purity, 93.4 % recovery. 8 m² / 8 bar: 77.1 % at 4.9 kW | **Low** | 10 min (tables done) | Pressures in COMP1/COMP2 10 min; area via ACM 45–60 min (possibly none if `A` can be overridden in Aspen; untested); run 15 min | 0.5–1.5 h |
| 5 | **RSTOIC rxn 11 never fires** (`SERIES=NO`) | **C26** (confirm: **B10**) | Ethanol is not converted in hydrolysis: CH₄ +1.8 % directly, up to **+5 %** with the extra acetate methanated; digestate ethanol 2.5 kg/h lower | **Low–Medium** | 5 min (B10) | `SERIES=YES` and re-enter the shared conversions (cellulose rxn 10 → 0.571, hemicellulose rxn 7 → 0.2): 20–30 min; run and check 15 min | 0.5–1 h |
| 6 | **Pyrolysis reversibility** | **C1, C2** | At equilibrium: CO −15 %, H₂ −4 %, carbon −6 %, 0.06 kmol/h CO₂ left | **Medium–High** | 15 min | R-2 → `RWGS` set 20–30 min + check 30 min; R-1 reverse term 45–90 min | 1 h (R-2 only) to 2–3 h |

**Small effects:** fugacity for CO₂ (about 5 % on the CO₂ flux), Π(T), a second stage (C19–C21); propionate constants, hydrogenotrophs (C24, C25).
**No effect on results:** `PERMEATE.V` (B6 test; C17 / C22 fix), PURGAS, FLASH3, renames, METH options, unused sets, Henry warnings (C9–C16), the k₀ units alone (C3). The property-data deletions (A2–A4) change enthalpies and duties, not product flows.

If the source agrees with the current values for items 1–3, the whole list collapses to about 0.5–1.5 h.

---

### Suggested order of work

1. **Mac, now:** A7, A8 (assumptions, design point) and A5 (`CLAUDE.md`). Source checks B9 → C6 note → B8 → B1 as soon as the paper is available.
2. **Windows visit 1 (about 1 h):** A2–A4 (deletions), A1 (pyrolysis outlet), B6 and B7 (the `PERMEATE.V` test, NH3 stream) and A6 (final run).
3. **Windows visit 2 (only if the source checks show a mismatch):** the matching item from the ranked table, in rank order. Item 4 (pressure only) is the cheapest way to move the summary.
4. **Anything in Session C** is revisited only when its "Revisit if" condition is met.

Who can do what (Claude vs you): [claude_coverage.md](claude_coverage.md).

## Progress checklist (Phase 1 sessions 1–6; Phase 2 sessions A–C)
- [x] S1 quick edits (EDIT_LOG E015, E020)
- [x] S2 PALM + ACETOGEN (EDIT_LOG E025; the CH4PYRO BALMAS error seen afterwards was cleared by S6)
- [x] S3 Henry + B1 volume (EDIT_LOG E027; 3.2 no change needed)
- [x] S4 kinetics basis (EDIT_LOG E029; tear-variable convergence block, not Fortran user kinetics)
- [x] S5 compressor (EDIT_LOG E032; 2-stage COMPR+HEATER, 10 bar, 5.5 kW)
- [x] S6 ACM rewrite (EDIT_LOG E033, commit 007cc74; 0 errors / 3 warnings)
- [x] Phase 2 Session A (will do): A1–A8 done 2026-10-07 (EDIT_LOG E048–E050, E052–E053; A3 by replacing the copied VLSTD values with CRC/crystallographic values)
- [ ] Phase 2 Session B (check only / optional): Section 1 done 2026-10-07 except the B7 GUI text (EDIT_LOG E055–E057; B4, B5 moved to C28, C29); Section 2 (B1, B2, B8, B9) waits for the source paper
- [ ] Phase 2 Session C (parked): nothing planned

## Navigation shorthand used in these files
- **Props →** = Properties environment (bottom-left button **Properties**)
- **Sim →** = Simulation environment (bottom-left button **Simulation**)
- **Calculator X → Define / Calculate / Sequence** = Sim → Flowsheeting Options → Calculator → X, then that tab
- **Reactions X** = Sim → Reactions → X
- **Block X** = Sim → Blocks → X (blocks in METH are under Hierarchy METH)
