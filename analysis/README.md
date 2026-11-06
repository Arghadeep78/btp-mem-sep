# Analysis (semester work, from 2026-10-28)

Analysis only: the Aspen model is not changed (professor's rule).

| File | Contents |
|---|---|
| [co2_scope1_2.md](co2_scope1_2.md) | CO₂ emissions, Scope 1 + 2, for heat and electricity scenarios (India grid, coal, hydro, solar); heat-integrated case |
| [exergy_analysis.md](exergy_analysis.md) | Exergy balance per unit and for the whole process; where exergy is destroyed or lost; energy-saving options |
| [CO2_Exergy.xlsx](CO2_Exergy.xlsx) | Workbook with live formulas: Inputs (all assumptions + sources), Streams, Exergy_Units, Exergy_Overall, CO2_Scope12 (scenario table, vent switch), Charts. Blue cells can be changed |
| `scripts/make_workbook.py` | Rebuilds the workbook from the run results (`python3 scripts/make_workbook.py`) |
| `scripts/bkp_streams.py` | Reads the stream results stored in `data/Memb-Integration-1_results_2026-11-06.bkp`: T, P, component flows, H, S |
| `data/Memb-Integration-1_results_2026-11-06.bkp` | COM run of the current model (unchanged copy of `files/Memb-Integration-1.bkp`, after C1/C2), kept for its stored results. Not the model: COM SaveAs drops a MEMB1 spec |
| `scripts/exergy.py` | Exergy per unit and overall (`python3 scripts/exergy.py`) |
| `scripts/co2_scope12.py` | Scope 1 + 2 calculation (`python3 scripts/co2_scope12.py`) |

**Data version:** both analyses use the Aspen run of 2026-11-06 of the current model (pyrolysis reversible, at equilibrium; H₂ 2.210 kmol/h = 4.46 kg/h). To refresh: run the model through COM, save the results copy into `data/`, point `bkp_streams.py` at it, and update the duties in `exergy.py` and `co2_scope12.py`.
