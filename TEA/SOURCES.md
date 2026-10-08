# Sources for the TEA/LCA workbook

Workbook: [TEA_LCA_Memb-Integration-1.xlsx](TEA_LCA_Memb-Integration-1.xlsx). All costs in USD, 2024 basis.
For each source: what it is, the value taken, and where it is used. Values not backed by a source are listed at the end as assumptions.

---

## 1. Method (reference papers in `LCA-ref-docs/`)

| # | Source | Values used | Where |
|---|---|---|---|
| 1 | Patel, Oyedun, Kumar, Gupta (2019). *What is the production cost of renewable diesel from woody biomass and agricultural residue based on experimentation?* Fuel Processing Technology 191: 79–92. File: `LCA-ref-docs/1-s2.0-S0378382018318666-main.pdf` | Capital build-up (Table 4): TIC 302 % TPEC, indirect 89 % TPEC, contingency 20 %, location factor 10 %. Operating factors (Table 5): maintenance 3 % TPI, operating charges 25 % of labour, plant overhead 50 % of labour + maintenance, G&A 8 % of total operating cost. 20-year life, 10 % IRR, start-up factors 0.70/0.80/0.85, escalation rates. Biochar credit 100 $/t (section 3.2). Net energy ratio definition (section 4.5) | Assumptions (economic method, capital and operating factors), CAPEX, OPEX, DCF, LCA |
| 2 | Patel, Oyedun, Kumar, Gupta (2019). *A Techno-Economic Assessment of Renewable Diesel and Gasoline Production from Aspen Hardwood.* Waste and Biomass Valorization 10: 2745–2760. File: `LCA-ref-docs/s12649-018-0359-x.pdf` | Same capital method (Table 5). Key assumptions (Table 6): construction spread 20/35/45 %, escalation (capital 5 %, products 5 %, raw material 3.5 %, O&M 3 %, utilities 3 %, G&A 3.5 %). Plant capital scale factor 0.71 | Assumptions, DCF, README |

Both papers are fast-pyrolysis / renewable-diesel studies. Only their **method and economic factors** are used; their equipment costs do not apply to this process.

---

## 2. Equipment costs

| # | Source | Values used | Where |
|---|---|---|---|
| 3 | IEA Bioenergy Task 37 (2015). *Exploring the viability of small scale anaerobic digesters in livestock farming.* ISBN 978-1-910154-25-0. [PDF](https://www.ieabioenergy.com/wp-content/uploads/2015/12/Small_Scale_RZ_web2.pdf) | Section 5.1.1: median capital cost **£3,223/kWe** for Austrian and German AD plants smaller than 250 kWe. Section 5.1: split 45 % civil works and tanks, 49 % mechanical and electrical, **6 % CHP** (removed here); feasibility, permits and licences add **10–15 %**. Section 5.1.2: small upgrading units (10–30 m³/h) **£233,000–361,000**. Appendix A: **1 £ = 1.61 USD** (27 Oct 2014) | CAPEX item 1 (AD plant); owner costs 12.5 %; sensitivity "upgrading ×2.5" |
| 4 | IEA Bioenergy Task 44 (2025). *Technologies for Flexible Bioenergy (Updated).* p. 24. [PDF](https://www.ieabioenergy.com/wp-content/uploads/2025/05/IEAB-Task-44_2025_-Report-Technologies-for-Flexible-Bioenergy-Update.pdf) | Membrane upgrading investment **2,500–6,000 €/(Nm³/h)** for 100–400 Nm³/h (6,000 used); electricity **0.2–0.38 kWh/Nm³** (0.2 used); maintenance 3–4 %; membranes replaced every **5–10 years** (5 used) | CAPEX item 2 (upgrading unit); OPEX electricity; membrane life |
| 5 | Towler, G. & Sinnott, R. (2013). *Chemical Engineering Design*, 2nd ed., Elsevier. Chapter 7, Table 7.2 (US Gulf Coast, Jan 2010, CEPCI 532.9) and Table 7.6. [Chapter PDF](https://e-tarjome.com/storage/panel/fileuploads/2021-08-24/1629797579_E15570.pdf) | Cylindrical furnace: **Ce = 80,000 + 109,000 S^0.8** (S = duty, MW; valid 0.2–60). Double-pipe exchanger: **Ce = 1,900 + 2,500 A** (A in m², valid 1–80). Material factor Nickel/Inconel 1.7 (Table 7.6; cross-check only) | CAPEX item 5 (furnace), item 8 (product cooler); CEPCI 2010 = 532.9 |
| 6 | Turton et al. *Analysis, Synthesis and Design of Chemical Processes*, 5th ed., Appendix A (2001 basis, CEPCI 394.3). Constants as coded in [ChemEngDPpy capex.py](https://github.com/weepctxb/ChemEngDPpy) | Vertical process vessel: **log₁₀ Cp = 3.4974 + 0.4485 log₁₀V + 0.1074 (log₁₀V)²** (V in m³, valid 0.3–520). Vessel material factor, Ni alloy **7.1** | CAPEX item 4 (pyrolysis reactor tube) |
| 7 | Perry's Chemical Engineers' Handbook, 8th ed., Section 9 (PDF in project root, git-ignored) | Six-tenths rule, **Eq. 9-1**; exponent 0.4–0.9, average about 0.6 (printed p. 9-12) | Scaling of the upgrading cost (exponent 0.6) |
| 8 | *Biogas upgrading to biomethane with zeolite membranes: separation performance and economic analysis.* Chem. Eng. Res. Des. (2024). [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0263876224003162) | Inorganic membranes typically 1,000–5,000 €/m²; zeolite multistage schemes economic up to about **2,000 $/m²** (as summarised in literature searches) | Zeolite membrane price 2,000 $/m²; sensitivity at 5,000 $/m² |
| 9 | *Large and Highly Selective and Permeable CHA Zeolite Membranes.* Ind. Eng. Chem. Res. (2023), [doi:10.1021/acs.iecr.3c02016](https://pubs.acs.org/doi/10.1021/acs.iecr.3c02016) | Industrial polymeric membrane modules about **100 $/m²**; small, non-automated zeolite production much higher (about 32,200 $/m²) | Polymer price subtracted for the zeolite premium (item 3) |

---

## 3. Cost indices and exchange rates

| # | Source | Value used |
|---|---|---|
| 10 | Chemical Engineering magazine, [2024 CEPCI updates](https://www.chemengonline.com/2024-cepci-updates-june-prelim-and-may-final/) | 2024 monthly CEPCI 795.4 (Jan) to 800.2 (May): **800** used |
| 11 | Chemical Engineering, [Economic Indicators, Jan 2015](https://user.eng.umd.edu/~adomaiti/chbe446/literature/ChECostIndexJan2015.pdf) | CEPCI 2014 annual **576.1** |
| 12 | Towler & Sinnott Table 7.2 note 7 (source 5) | CEPCI Jan 2010 **532.9** |
| 13 | Turton 5th ed. via ChemEngDPpy (source 6) | CEPCI 2001 **394.3** |
| 14 | ECB reference rates, [2024 average](https://currencyapi.com/central-bank-exchange-rates/ecb/usd/2024) | **1 € = 1.08238 $** |
| 15 | IEA Task 37 (2015) Appendix A (source 3) | **1 £ = 1.61 $** (27 Oct 2014) |

---

## 4. Prices, wages and emission factors

| # | Source | Value used | Where |
|---|---|---|---|
| 16 | US EIA, [Natural Gas Annual 2024](https://www.eia.gov/naturalgas/annual/pdf/table_023.pdf) | Industrial natural gas **3.93 $/Mcf** (converted with about 1,036 Btu/ft³ to **3.60 $/GJ**) | Assumptions, OPEX heating |
| 17 | US EIA, Electric Power Annual 2024, [sales, revenue and price](https://www.eia.gov/electricity/sales_revenue_price/pdf/table_4.pdf) | Industrial electricity **8.13 ¢/kWh** (papers used 5.6 and 4.0 ¢/kWh) | OPEX electricity |
| 18 | US BLS OEWS May 2024, [Chemical Plant and System Operators (SOC 51-8091)](https://blsmon1.bls.gov/oes/current/oes518091.htm) | Median annual wage **$80,030** | OPEX labour |
| 19 | US EPA, [GHG Equivalencies Calculator (eGRID2022)](https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator-calculations-and-references) | US total output CO₂ rate 823.1 lb/MWh = **0.3733 kg CO₂/kWh** | LCA electricity emissions |
| 20 | IPCC 2006 Guidelines, Vol. 2, Table 2.2 | Natural gas combustion **56.1 kg CO₂/GJ** | LCA |
| 21 | [ChemAnalyst carbon black prices](https://www.chemanalyst.com/Pricing-data/carbon-black-42) and price reports | Carbon black about **1,040–1,820 $/t** in 2024 | Sensitivity "carbon credit 1,200 $/t" |

---

## 5. Process and property data

| # | Source | Values used |
|---|---|---|
| 22 | Aspen Plus COM run of 2026-10-07 after C26/C27 (`docs/results_2026-10-07.md`, first table); digestate flow from the 2026-10-06 run (`.his`) | Flows and duties on Process_Data (biogas 2.358 kmol/h, RET 1.779, H₂ 2.307 kmol/h, HEAT2 20.42 kW, RSTOIC 24.74, B1 3.51, compressors 5.69 kW total). Derived or scaled from those figures: PER composition, CO, COMP1/COMP2 split, FLASH/COOL1/COOL2 duties |
| 23 | Perry's Handbook, 8th ed.: ideal-gas Cp **Table 2-156**, ΔHf and net heat of combustion **Table 2-179**, graphite Cp **Table 2-151** | Pyrolysis reaction enthalpies at 790 °C (89.63 and 34.20 MJ/kmol), used to estimate the reactor heat duty; methane LHV 802.3 MJ/kmol |

---

## 6. Values that are still assumptions (no source)

These are blue input cells, most with yellow fill, on the Assumptions or CAPEX sheet. Replace them when better data is available.

| Assumption | Value | Why it matters |
|---|---|---|
| Solid carbon separation (cyclone + filter) | $30,000 purchased | About 5 % of the investment; no correlation found at this size |
| Furnace size below the correlation range | 0.055 MW vs valid 0.2–60 MW | Correlation extrapolated |
| CHP electrical efficiency (to express the AD plant in kWe) | 38 % | Scales the AD plant cost |
| Product gas cooler area | 2 m² | Small |
| Pyrolysis catalyst price and replacement | 40 $/kg, once a year | Small |
| Natural gas heater efficiencies | 85 % (digester), 80 % (790 °C) | Fuel use |
| Cooling water, process water prices | 0.35 $/GJ, 0.50 $/m³ | Very small |
| Biomass feed cost | 0 $/t (organic waste) | A gate fee would lower the cost |
| Operators | 2 FTE | Labour is about 20 % of yearly cost |
| Digester mixing and pump power | 2 kW | Small |
| Fossil primary energy per unit electricity | 2.5 | Net energy ratio |
| Natural gas upstream emissions | 10 kg CO₂e/GJ | GHG |
| Hydrogen LHV | 120 MJ/kg | Standard value |
| Digestate value | 0 $/t | Could add revenue |
