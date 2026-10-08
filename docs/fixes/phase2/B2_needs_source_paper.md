# Phase 2, Session B2: Source checks (need the source paper)

Items B1, B2 (pyrolysis), B8 (membrane), B9 (digester). Every item checked 2026-10-07 against reputed literature and Perry's (8th ed., full text searched) and placed in one of two sections.

Other sessions: [A](A_will_do.md) · [B1](B1_can_do_now.md) · [C](C/00_README.md) · [Index](../00_INDEX.md) · Evidence: [source_check_results.md](source_check_results.md)

**Perry's has:** thermophilic range 45–70 °C (PDF 2440), packed-bed void fraction 0.35–0.5 (Eq 16-81, PDF 1809), Monod + inhibition form (Eq 7-150/151, PDF 870), RWGS reversible (Eq 24-18). **Not in Perry's:** CH₄-cracking kinetics, zeolite-membrane permeances, catalyst bulk density, thermophilic ADM1 constants.

**References:** [Yang et al., J. Membr. Sci. 505 (2016)](https://www.osti.gov/pages/biblio/1253193) (model's membrane source) · CH₄ decomposition: [activated carbon](https://www.researchgate.net/publication/223169703_Catalytic_decomposition_of_methane_over_activated_carbon), [Serrano et al. 2008](https://www.sciencedirect.com/science/article/abs/pii/S1385894707003956), [palm-shell carbon TCD](https://knova.um.edu.my/research_publications_2006_2010/2186) · ADM1: Batstone et al., IWA STR 13 (2002) ([summary](https://research.wur.nl/en/publications/the-iwa-anaerobic-digestion-model-no-1-adm1/); tables not online)

**Rules when the paper arrives:** pyrolysis: a units difference alone is no reason to edit (conversion saturates); edit only if R-1/R-2 are reversible in the paper or a unit error changes a reported result (C1–C3). Membrane/digester: change a value only if clearly wrong (wrong unit or factor > 2).

---

# Section 1: Confirmed ✅

## 1α: No action needed

| # | Item (model) | Evidence | Action |
|---|---|---|---|
| B1·P5 | R-2 E = 82 kJ/mol | Catalytic RWGS: ≈ 50–100 kJ/mol | None |
| B1·P8 | 790 °C, 1 bar, isothermal | Thermocatalytic CH₄ decomposition is run at 700–925 °C, atmospheric pressure, fixed bed; equilibrium favourable (K = 19.98, Perry data) | None (tube size: see B2 in Section 2) |
| B8·PM1 | DDR zeolite | Yang 2016 is DDR on α-alumina | None |
| B8·PM2 | Π_CO₂ 2.1e-7 mol/(m²·s·Pa) | Source mixed-gas 1.8e-7 (model +17 %, below factor-2 rule) | None (optional sensitivity at 1.8e-7) |
| B8·PM3, PM5 | Π_CH₄ 3.03e-9, selectivity 69 | Source separation factor 62–92 (10–90 % CO₂); feed is 41 % CO₂ | None |
| B8·PM4 | Π_H₂ 1.36e-7 | H₂ is 0.3 % of feed | None |
| B8·PM6 | Data at 297 K, 2 bar | Matches source | None |
| B8·OP1–5 | 10 bar / 1 bar, 30 °C, 5 m², ΔP 0 | Design choice; pressure ratio parked (C18) | None |
| B9·G2 | 55 °C, 1 atm, HRT 15 d (≈ 320 m³) | Perry: HRT 10–30 d; thermophilic 45–70 °C used on purpose (PDF 2440) | None |
| B9·G4 form | Monod × inhibition | Perry Eq 7-150/151. Propionate Ks/Y "differences" were mesophilic vs thermophilic (false doubt) | None |
| B9·G6 | pH fixed 6.5–7 | Perry 6.5–7.5; ADM1 acetoclastic window 6–7 | None |
| B9·G7 | CH₄ 58.7 %, 0.228 m³/kg COD | Perry 50–80 %; 65 % of 0.35 ceiling | Optional: compare with paper's yield |

## 1β: Action needed

| # | Item (model) | Evidence | Action |
|---|---|---|---|
| B1·P1, P4 | k₀ 474600 / 24600, global MET (hour), CBASIS molarity, RBASIS cat-wt | Conversion ≈ 100 % (A1); even 3600× (s vs h) still saturates | State "k₀ on global MET basis, per kg catalyst" |
| B1·P2 | R-1 E = 145.8 kJ/mol | Carbon catalysts: 117–185 kJ/mol (Ni: 30–90) | State catalyst family (carbon) |

# Section 2: Not confirmed 🔶

P3, P6 (R-1/R-2 irreversible) and G5 (no hydrogenotrophs) are in Session C only: [C2, C1, C25](C/00_README.md).

## 2α: No action needed

(none: every unconfirmed item needs an action)

## 2β: Action needed

Doubt = how likely the model value is wrong (0 = surely right, 10 = surely wrong).

| # | Item (model) | Evidence | Action | Doubt (/10) |
|---|---|---|---|---|
| B1·P7 | Catalyst 24.668 kg, ρ 1500 kg/m³, type not stated | No reputable value for this catalyst's density; type unknown. No effect on results | Paper: catalyst type, mass, bulk density, voidage | **5**: no data on type/density; no effect on results |
| B2 (P7 vs P8) | 24.7 kg catalyst in 2.12 m³ tube (L 18.9 m, D 0.378 m) | Packed bed would hold 1.6–2.1 t (ρ 1500, ε 0.35–0.5); fill 0.8 %. No effect on results | Report catalyst mass and W/F only, not tube size | **8**: tube and catalyst clearly not one design |
| B1·P9 | Paper's performance | Only compared with equilibrium (A1) | Paper: CH₄ conversion, H₂ yield, CO | **4**: equilibrium check passed; paper comparison missing |
| B8·PM6 use | Permeances used at 303 K, 10 bar | Data at 2 bar; zeolite permeance may fall at high P | State as assumption | **5**: 5× pressure extrapolation, direction known (lower permeance) |
| B9·G4 values | Calculator k_max, K_S, inhibition constants | ADM1 STR13 thermophilic tables not accessible online | Compare once with STR13 thermophilic table (~15 min) | **5**: ADM1-style, propionate Ks/Y unverified |
| B9·G1 | Feed: BIOMASS 8.5 t/d (75.2 % water) + WATERIN 13 t/d, 23 °C | Project-specific; no outside source can confirm | Paper: feedstock, flow, composition | **3**: self-consistent (fractions sum to 1); only the paper can confirm |
| B9·G3 | RSTOIC fixed hydrolysis conversions | Project-specific; rxn 8/11 never fire (C26/C27) | Paper: extents or kinetics | **6**: fixed extents unsourced; rxn 8/11 known not to fire |
