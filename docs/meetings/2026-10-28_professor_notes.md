# Professor meeting: 2026-10-28

Notes from the progress meeting, written up clearly. The raw notes are kept at the end.

## Rules and scope
- **No changes to the Aspen model unless the professor asks.**
- **TEA/LCA is for next semester.** It is archived in `archive/TEA_LCA_next_semester/` and not presented now.

## Project aim
Produce **H₂ from a greener source**, **reduce CO₂ emissions**, **use the excess heat** the process produces, and **minimise the energy use** of the whole process.

**Two pathways are being explored:**
1. Biogas → **membrane** → CH₄ pyrolysis (the current model).
2. Biogas → **CO₂ methanation** (instead of the membrane) → CH₄ pyrolysis.

## Presentation (first draft due **10 Nov 2026**)

| # | Slides | Content |
|---|---|---|
| 1 | 1–2 | **Background:** landfill and conventional ways of handling waste; what we have done; the target green routes to hydrogen |
| 2 | 1 | **Process diagram** of the integrated process |
| 3 | about 4 | **Results per unit:** e.g. biogas (how much CH₄), membrane, pyrolysis; the final product; the energy needed |
| 4 | 1–2 | **Material and energy balance** of the integrated process: which unit needs the most energy, and how to reduce it |
| 5 | 1–2 | **Exergy analysis:** where the problems are, and what BTP-2 will solve |
| 6 | 1 | **Sensitivity:** pressure vs separation, optimised with cost in mind (high pressure is expensive). **Status 2026-11-04: sensitivity done; the current design (10 bar feed / 1 bar permeate, 5 m²) is near optimal** |
| 7 | 1 | **Membrane models:** comparison of the 3 membrane models and the difficulties met |
| 8 | 1 | **Other units** |

## Work items

| Item | When | Notes | Status |
|---|---|---|---|
| CO₂ emission calculation, **Scope 1 (direct) and Scope 2 (indirect)** | Now | Scope 3 (other indirect) later; focus on 1 and 2 | Done: [analysis/co2_scope1_2.md](../../analysis/co2_scope1_2.md) |
| **Exergy analysis**, each unit and the whole process | Now | | Done: [analysis/exergy_analysis.md](../../analysis/exergy_analysis.md) |
| **Sensitivity: pressure vs separation** | Now | Slide 6 | **Done 2026-11-04: current design (10 bar, 5 m²) is near optimal.** (Earlier screening: 6 bar saves about 1.4 kW of compression but cuts H₂ by about 7 %) |
| LCA reference documents | Now | May be used if useful | — |
| **Economiser + energy analysis** | BTP-2 | The **two main things** for BTP-2 | Screening ideas in the exergy file |
| **CO₂ absorption column** (amine or ethanol) on the membrane outlet to capture CO₂ | BTP-2 | Feeds into the Scope 1/2/3 accounting | — |
| **Cost analysis of electricity source:** conventional (hydro, coal) vs solar (renewable) | BTP-2 | | Emission side done in the CO₂ file |
| **Pinch analysis**, then **optimisation** | BTP-2 | | — |

---

## Raw notes (as written)

> 1-2 slides landfill waste converional methods and what have we done, what are the target green path for producitng hydrogen, once integrated do material and energy balance, which unit is producing large amount of energy and what we can do to minimise the energy requirements, (bio gas + membrane + pyrolysis) (instead of membrane co2 methanation) (2 pathway we are exploring) idea is to produce h2 from a greener source, reduce co2 emision, utilise excess heat produced and minimise energy utilisationm of overall process.
> process diagram, results from each unit, eg from bio gas what was methane etc.., what is the final product what is the energy requirements (4 sldies on results)
> then we come to exergy alsysis: what are the problems and what we solve for the btp2 -> economiser + energy analysis (these 2 are the main things)
>
> first draft of presentation: 10th nov
>
> sensitivity analysis diff pressure vs sepration optimisation taken into account cost as it is expensive to
> one slide for 3 membrane comparison model difficulties
> other units
>
> next target: co2 emission calculation (scope 1, scope2, scope 3 : direct, indirect, teriary focus on 1,2 )
>
> we need to c02 abs column ethanol/amine outlet of memberane capture co2 (scope 1, scope2, scope 3 : direct, indirect, teriary focus on )
>
> const analysis: conventional source of electricity (hydro, cola power), solar power(renewable)
> we need to do pinch analysis, then optimisaiton
>
> Current work given: (i) all TEA/LCA are for next semester, move them to archive; (ii) no changes to model unless ma'am tells; (iii) CO₂ emission calculation Scope 1 + 2; (iv) exergy analysis for each unit and whole; (v) may use LCA ref docs if useful.
