# Fix sessions: what Claude can do

How much of each fix session (see [00_INDEX.md](00_INDEX.md)) Claude can apply by itself, and which steps need input from you.

| Session | Full | Partial | Needs you | Why |
|---|---|---|---|---|
| [S1 quick edits](01_quick_edits.md) | 9/9 | | | Calculator Define/Fortran changes, rate exponents, setting Ea to 0: all plain text or values |
| [S2 PALM + ACETOGEN](02_palm_and_acetogen.md) | 2/2 | | | Component formula, deleting the MW override and NRTL rows, new stoichiometry |
| [S3 Henry + B1 volume](03_henry_and_b1_volume.md) | 3.1 | 3.2 | | Henry setup is easy. For 3.2 I can do the check, but the fix needs your headspace/design volume |
| [S4 kinetics basis](04_kinetics_basis.md) | | 4.1, 4.2 (optional reactions) | 4.2 (report decisions) | The re-pointing edits are mechanical. Getting the loop to converge is untested and may need several runs. Hydrogenotroph kinetics need parameters from your ADM1 reference |
| [S5 compressor](05_membrane_compressor.md) | 1/1 | | | Add the COMP1 block and connections; your design values are already in the file |
| [S6 ACM rewrite](06_membrane_acm_rewrite.md) | | 6 | | I can write the model code. Compiling it and exporting the ATMLZ needs ACM, and I haven't tested whether ACM can be automated. The Aspen-side reload and run I can do |
| [S7 pyrolysis](07_pyrolysis.md) | 7.2 | | 7.1, 7.3, 7.4 | I can swap in the RWGS set and check K_eq. The k₀ units, reversibility and catalyst basis come from your paper |
| [S8 property data](08_property_data.md) | 8.2–8.8 (7) | 8.1 | | Mostly deletions. For 8.1, Option B needs NIST values (I can look them up, but you should confirm them). Option A means entering molecular structures: possible, but slow |
| [S9 cleanup](09_cleanup.md) | 8/8 | | | Small renames and deletions, plus updating CLAUDE.md. For 9.1 you pick: delete PURGAS or make it a real purge |
