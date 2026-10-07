# Fix sessions: what Claude can do

How much of each fix session (see [00_INDEX.md](00_INDEX.md)) Claude can apply by itself, and which steps need input from you.

| Session | Full | Partial | Needs you | Why |
|---|---|---|---|---|
| [S1 quick edits](phase1/01_quick_edits.md) | 9/9 | | | Calculator Define/Fortran changes, rate exponents, setting Ea to 0: all plain text or values |
| [S2 PALM + ACETOGEN](phase1/02_palm_and_acetogen.md) | 2/2 | | | Component formula, deleting the MW override and NRTL rows, new stoichiometry |
| [S3 Henry + B1 volume](phase1/03_henry_and_b1_volume.md) | 3.1 | 3.2 | | Henry setup is easy. For 3.2 I can do the check, but the fix needs your headspace/design volume |
| [S4 kinetics basis](phase1/04_kinetics_basis.md) | | 4.1, 4.2 (optional reactions) | 4.2 (report decisions) | The re-pointing edits are mechanical. Getting the loop to converge is untested and may need several runs. Hydrogenotroph kinetics need parameters from your ADM1 reference |
| [S5 compressor](phase1/05_membrane_compressor.md) | 1/1 | | | Add the COMP1 block and connections; your design values are already in the file |
| [S6 ACM rewrite](phase1/06_membrane_acm_rewrite.md) | | 6 | | I can write the model code. Compiling it and exporting the ATMLZ needs ACM, and I haven't tested whether ACM can be automated. The Aspen-side reload and run I can do |
| [Session A: will do](phase2/A_will_do.md) | A1 (MCP read), A2–A4 (deletions), A5, A6, A7, A8 (notes and records) | | | Deletions and notes are easy to apply and verify with a run. A1 is a read of the pyrolysis outlet. A7 and A8 are doc only |
| [Session B: check only / optional](phase2/B1_can_do_now.md) ([B2](phase2/B2_needs_source_paper.md)) | B3, B4, B6, B7, B10 | B5 (needs a GUI check first) | B1, B2, B8, B9 (source values) | The checks need your paper; the `PERMEATE.V` test and the stream status are quick |
| [Session C: parked](phase2/C/00_README.md) | | | C1–C29 (design decisions) | Nothing is planned; each item is revisited only if its "Revisit if" condition is met |
