# TEA / LCA: initial version (v1, refreshed 2026-10-09 to the 2026-10-07 model)

Screening-level techno-economic and life-cycle (energy/GHG) assessment of the current Aspen model (biogas → zeolite membrane → catalytic methane pyrolysis). All costs in USD, 2024 basis.

| File | Contents |
|---|---|
| [TEA_LCA_Memb-Integration-1.xlsx](TEA_LCA_Memb-Integration-1.xlsx) | Workbook: README, Summary, Process_Data, Assumptions, CAPEX, OPEX, DCF, LCA. Blue = inputs, black = formulas, green = links, yellow = values to check. Excel recalculates on opening (no cached values are stored) |
| [SOURCES.md](SOURCES.md) | Every source used, the value taken and where it is used, plus the remaining assumptions |
| `LCA-ref-docs/` | The two method papers (Patel et al. 2019). PDFs are git-ignored; full citations are in SOURCES.md |

## Method
- Economic method of the two reference papers: Peters & Timmerhaus capital factors, O&M factors, 20-year life, 10 % IRR, start-up factors, escalation; levelised cost of hydrogen (LCOH) by discounted cash flow. Net energy ratio (NER) as defined in the papers.
- Process data: Aspen COM run of 2026-10-07 after C26/C27 (RSTOIC `SERIES = YES`), C25 and A2–A4, taken from `docs/results_2026-10-07.md`. That record gives 4 significant figures, so the PER composition, CO, the COMP1/COMP2 split and the FLASH/COOL duties are derived or scaled (marked in the Process_Data notes); the digestate flow is still from 2026-10-06. Replace them with exact values from a GUI run when available.
- Equipment costs: IEA Bioenergy (digestion plant, biogas upgrading; turnkey), Turton and Towler & Sinnott correlations (pyrolysis reactor, furnace, cooler), escalated with CEPCI to 2024.
- Prices: EIA 2024 (electricity, natural gas), BLS May 2024 (wages), EPA eGRID2022 (grid CO₂).

## Results (base case)

| Result | Value |
|---|---|
| Hydrogen | 34.6 t/yr (4.65 kg/h at 85 % capacity factor) |
| Solid carbon by-product | 122 t/yr |
| Total project investment | $3.16 M (59 % from IEA turnkey data) |
| Annual operating cost | $467k/yr |
| **LCOH, DCF at 10 % IRR** (papers' method, first-year price escalating 5 %/yr) | **$20.3/kg H₂** |
| LCOH, constant dollars | $23.8/kg H₂ |
| Net energy ratio | 1.13 |
| GHG, gate-to-gate | 6.4 kg CO₂e/kg H₂ (about −6.4 if the solid carbon counts as stored) |

## Conclusions
1. **Not cost-competitive at this size.** About $20–24/kg against about $1.5/kg for fossil hydrogen and $5–7/kg for electrolytic clean hydrogen. About 95 % of the cost is capital, labour, maintenance and overheads, driven by the very small plant (8.5 t/day of waste).
2. **Model corrections do not change this.** C25 and C26/C27 are now in the model (H₂ +5 %, LCOH about −4 %). The remaining parked corrections in `docs/fixes/phase2/C/` (C1/C2 equilibrium, C21, …) would change the LCOH by about +4–5 % (the H₂ −4.2 % sensitivity gives $24.9 against $23.8/kg constant-dollar). C3 (kinetic units) and C5 (catalyst loading) need the pyrolysis source paper and could only raise the cost.
3. **Emissions are already below fossil hydrogen** (typical published range about 9–12 kg CO₂e/kg). Heating from the process's own off-gas plus heat integration could bring this to about 1, and counting stored carbon below zero.
4. **What could make it feasible (rough estimates):** combining fewer operators, carbon sold near carbon-black prices (~$1,200/t), a waste tipping fee, cheaper financing and higher availability gives about $10/kg at this size. With a roughly 10× larger plant as well, roughly $2–5/kg. Feasibility depends on scale, carbon price and policy credits more than on the process model.

## Main limitations
- Furnace correlation extrapolated below its 0.2 MW range; carbon separator cost is an estimate; small upgrading units may cost ~2.5× the scaled IEA value; zeolite membrane price spans 1,000–5,000 €/m².
- Not costed: hydrogen purification (PSA), heat integration, taxes, working capital, land.
- Process-model issue carried into the numbers: pyrolysis slightly beyond equilibrium (H₂ about 4 % high).
- LCA is gate-to-gate; it excludes construction, feedstock production and transport, and digestate use.

## Next steps (not yet done)
- Scenario sheet: scale, carbon price, gate fee, PSA cost, heat integration, policy credits.
- Replace the remaining estimates (carbon separator, furnace below range) with vendor or APEA costs.
- Replace the derived Process_Data cells with exact values from a GUI run; re-run once the Phase 2 checks (B1, B8, B9) and the pyrolysis paper (C3, C5) are settled.
