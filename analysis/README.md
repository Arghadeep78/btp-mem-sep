# Analysis (semester work, from 2026-10-28)

Analysis only: the Aspen model is not changed (professor's rule).

| File | Contents |
|---|---|
| [co2_scope1_2.md](co2_scope1_2.md) | CO₂ emissions, Scope 1 + 2, for heat and electricity scenarios (India grid, coal, hydro, solar); heat-integrated case |
| [exergy_analysis.md](exergy_analysis.md) | Exergy balance per unit and for the whole process; where exergy is destroyed or lost; energy-saving options |
| [CO2_Exergy.xlsx](CO2_Exergy.xlsx) | Workbook with live formulas: Inputs (all assumptions + sources), Streams, Exergy_Units, Exergy_Overall, CO2_Scope12 (scenario table, vent switch), Charts. Blue cells can be changed |
| `scripts/make_workbook.py` | Rebuilds the workbook from the `.bkp` results (`python3 scripts/make_workbook.py`) |
| `scripts/bkp_streams.py` | Reads the stream results stored in `files/Memb-Integration-1.bkp`: T, P, component flows, H, S |
| `scripts/exergy.py` | Exergy per unit and overall (`python3 scripts/exergy.py`) |
| `scripts/co2_scope12.py` | Scope 1 + 2 calculation (`python3 scripts/co2_scope12.py`) |

**Data versions:**
- `exergy.py` uses the results saved in the `.bkp`, currently the 2026-10-06 GUI run.
- `co2_scope12.py` uses the 2026-10-07 design point (numbers typed in from `docs/results_2026-10-07.md`).

To bring the exergy analysis to the 2026-10-07 design point: on Windows, open the `.bkp`, run it and save it from the GUI. That changes no inputs, only the stored results. Then re-run `exergy.py`.
