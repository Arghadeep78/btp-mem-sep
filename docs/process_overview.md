# What this simulation does, in simple terms

**One sentence:** we turn wet organic waste into biogas, clean and concentrate the methane in that biogas with a membrane, and then heat the methane until it splits into **hydrogen gas** and **solid carbon**.

The model is built in **Aspen Plus V14** (the flowsheet) with one custom block written in **Aspen Custom Modeler** (the membrane). Numbers below are from the run of 2026-10-07 (after C26/C27).

---

## The process at a glance

```
 Wet biomass + water
        │
 [1] Mix and break down (hydrolysis, 55 °C)
        │
 [2] Digester: microbes make biogas (55 °C, 15 days)  ──►  Digestate (wet leftover, out)
        │ biogas
 [3] Clean the gas: remove water, H₂S, NH₃, everything except CH₄ / CO₂ / H₂ / CO
        │
 [4] Compress to 10 bar (2 stages, cooled to 30 °C)
        │
 [5] Membrane: CO₂ passes through, CH₄ stays behind  ──►  CO₂-rich gas (out)
        │ methane-rich gas
 [6] Drop pressure to 1 bar, heat to 790 °C
        │
 [7] Pyrolysis reactor with catalyst: CH₄ → C (solid) + 2 H₂
        │
 Hydrogen-rich gas + solid carbon
```

---

## Step by step

### 1. Feed and hydrolysis
- **In:** 8.5 tonnes/day of biomass (about 75 % water; the rest is cellulose, hemicellulose, starch, fats, protein, keratin and some inert matter) mixed with 13 tonnes/day of water.
- **What happens:** large molecules are broken into smaller ones that microbes can eat. Cellulose and starch become sugar, fats become glycerol and fatty acids, proteins become amino acids. This is modelled with fixed conversions (e.g. 70 % of the starch is converted).
- **Aspen blocks:** MIX1 (mixer), RSTOIC (reactor with fixed conversions).

### 2. Anaerobic digester
- **What happens:** in a closed tank without air, at 55 °C for 15 days, microbes eat the sugars, fats and amino acids in steps: first to acids (mainly acetic acid) and hydrogen, then to **methane (CH₄)** and **CO₂**. Together these gases are called **biogas**.
- **How the model handles it:** reaction rates follow microbial growth laws (Monod kinetics, with slow-down from ammonia, acids and fatty acids). The rates are recalculated from the reactor's own concentrations until they settle (a convergence loop).
- **Out:** biogas (about 59 % CH₄, 40 % CO₂, a little H₂) and digestate (the wet leftover, about 820 kg/h).
- **Aspen blocks:** B1 (stirred-tank reactor) plus 10 small calculation blocks for the rates.

### 3. Gas cleanup
- **What happens:** the biogas is cooled to 25 °C so water condenses out, then H₂S and everything except CH₄, CO₂, H₂ and CO is removed. These are idealised splitters: they remove the unwanted gases completely, without modelling the real equipment.
- **Aspen blocks:** FLASH, H2S-SEP, NH3SEP.

### 4. Compression
- **Why:** a membrane needs pressure on one side to push gas through it.
- **What happens:** the gas is compressed from 1 bar to 10 bar in two stages, cooled back to 30 °C after each one. Power used: about **5.7 kW**.
- **Aspen blocks:** COMP1, COOL1, COMP2, COOL2.

### 5. Membrane (the custom block)
- **What happens:** the gas flows past a thin **zeolite (DDR) membrane** of 5 m². Small molecules (CO₂ and H₂) pass through it much faster than CH₄, so:
  - the gas that passes through (**permeate**, 1 bar) is mostly CO₂ (92 %) and leaves the process;
  - the gas left behind (**retentate**, 10 bar) is enriched in methane: **76 % CH₄**, keeping about **97 %** of all the methane.
- **How it is modelled:** each gas passes at a rate proportional to its "permeance" (how easily it goes through) × membrane area × pressure difference. Permeance values come from the literature (Yang et al. 2016).
- **Aspen block:** MEMB1 (written in Aspen Custom Modeler).

### 6. Pressure letdown and heating
- **What happens:** the methane-rich gas is brought back to 1 bar and heated from 30 °C to **790 °C** (about 20 kW of heat).
- **Aspen blocks:** FLASH3 (also catches any liquid), HEAT2.

### 7. Methane pyrolysis
- **What happens:** in a long tube with catalyst at 790 °C, methane splits into hydrogen and solid carbon. The leftover CO₂ reacts with some of the hydrogen to form CO and water.
  - CH₄ → C (solid) + 2 H₂
  - CO₂ + H₂ → CO + H₂O
- **Out (model):** about **2.3 kmol/h of H₂** (about 4.65 kg/h, roughly 110 kg/day), about **16.3 kg/h of solid carbon**, plus some CO and water.
- **Aspen block:** CH4PYRO (plug-flow reactor).

---

## Key numbers (run of 2026-10-07)

| What | Value |
|---|---|
| Biomass in | 8.5 t/day (+ 13 t/day water) |
| Biogas | 2.36 kmol/h; CH₄ 59.4 %, CO₂ 40.3 %, H₂ 0.3 % |
| Methane produced | about 31 m³/h (at standard conditions) |
| Compression power | 5.7 kW |
| Membrane product (to pyrolysis) | 1.78 kmol/h, 76.4 % CH₄; 97.1 % of the methane kept |
| Heating to 790 °C | about 20 kW |
| Hydrogen out | about 2.3 kmol/h (4.65 kg/h) |
| Solid carbon out | about 16.3 kg/h |

---

## Main simplifications (good to state in a report)

- Gas cleanup is idealised (perfect removal, no real equipment).
- The digester runs at a fixed pH. Hydrogen-consuming methane microbes are included but have a negligible effect.
- The membrane is treated as perfectly mixed on each side, with fixed permeance values.
- The pyrolysis reactions are one-way, so the model slightly overshoots what is thermodynamically possible: hydrogen is about 4 % higher than at equilibrium.

Details of every check and fix: [fixes/00_INDEX.md](fixes/00_INDEX.md).
