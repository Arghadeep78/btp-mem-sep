# Phase 2, Session C: Parked (folder)

Things that look wrong but were deliberately not touched (design decision, harmless, or needs data). Nothing here is planned; pick an item only when its **Revisit if** condition is met.

Other sessions: [A](../A_will_do.md) · [B1](../B1_can_do_now.md) · [B2](../B2_needs_source_paper.md) · [Index](../../00_INDEX.md) · Evidence: [source_check_results.md](../source_check_results.md) · Report wording: [results_2026-10-07.md](../../../results_2026-10-07.md) (Report notes)

**Closed 2026-10-07:** **C26 + C27 fixed** (EDIT_LOG E070): RSTOIC `SERIES = YES`, rxn 7 conversion 0.1 → 0.2, rxn 10 conversion 0.4 → 0.571429 (keeps the old cellulose/hemicellulose split). Rxn 11 (ethanol → HAc + CH₄) and rxn 8 (xylose → furfural) now act; biogas CH₄ +5.2 %, H₂ product +5.3 %; new design point in [results_2026-10-07.md](../../../results_2026-10-07.md). Cause: `SERIES = NO` (Aspen default) left on by mistake while two chain reactions were written. **C25 added (EDIT_LOG E072; verified by a run 2026-10-07, E074):** METHAN rxn 2 hydrogenotrophic methanogenesis 4 H₂ + 1.06 CO₂ + 0.024 NH₃ → 0.024 C₅H₇NO₂ + 0.94 CH₄ + 2.072 H₂O (ADM1 Y = 0.06), rate constant `KINETIC2 = X·S·M·Q` in calculator METHAN (the builder's unused hydrogenotroph terms), seeded PRE-EXP 1.1E-005; CH4PYRO `INT-TOL` 1E-4 → 1E-5 to clear a BALMAS.1 tolerance flag; verification run: 0 errors (BALMAS.1 gone), tear loop converged at iteration 11, results unchanged (H₂ 2.3075 kmol/h, CO −0.004 %). Scratch test (before the tolerance change): all results unchanged (≤ 0.03 %), because the `H2` equilibrium reaction already consumes the dissolved H₂. **C24 confirmed until proven otherwise** (propionate yield/Ks: thermophilic ADM1-style values, Perry's are mesophilic; reopen only if the source paper or ADM1 STR13 (B2·G4) gives different values).

**Closed:** C23 (55 °C digester): resolved by B2·G2, Perry gives thermophilic 45–70 °C and anaerobic processes run thermophilic on purpose; report note N8 (calculator constants are written around T0 = 55 °C; re-fit at 35 °C only if the source paper is mesophilic). C22 merged into C17 (same item).

## Files (highest priority first; items inside each file are also ordered by effect on results)

1. [1_digester.md](1_digester.md): Digester and hydrolysis: empty (all items closed 2026-10-07)
2. [2_pyrolysis.md](2_pyrolysis.md): Pyrolysis reactor (CH4PYRO): C1, C2, C4, C3, C5. Largest effect: H₂ +4.4 % (C1)
3. [3_membrane.md](3_membrane.md): Membrane (MEMB1, ACM `Zeo_real`): C21, C18, C19, C20, C17. Largest effect: CO₂ flux ≈ +5 % (C21), power/purity (C18)
4. [4_property_data.md](4_property_data.md): Property data: C6, C29, C28, C7, C8. Largest effect: B1 duty (C6)
5. [5_flowsheet_tidyups.md](5_flowsheet_tidyups.md): Flowsheet tidy-ups (no effect on results): C9, C16, C11, C12, C13, C14, C15, C10, C30. Largest effect: none (warnings and naming only)
