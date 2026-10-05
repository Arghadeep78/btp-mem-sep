# Session 7: Pyrolysis reactor CH4PYRO (B2, B3, B4)

Have your **source paper for the R-1/R-2 kinetics** open; it is needed to confirm units. Back up first.

---

## 7.1 R-1/R-2 pre-exponential factors may be in the wrong units (B3)

**Issue:** the reaction sets R-1 (CH₄ → C + 2 H₂, PRE-EXP 474600, Ea 145.8 kJ/mol) and R-2 (RWGS, PRE-EXP 24600, Ea 82 kJ/mol) have **no IN-UNITS line**, so PRE-EXP inherits the global **MET** unit set (time basis = **hour**). Literature k₀ values are usually per **second**.

**Error it causes:** if the paper's k₀ is per second, the rates are 3600× too slow, so CH₄ conversion and H₂ yield are badly under-predicted. If the paper's k₀ is per hour, everything is fine.

**Approach:** compare the units in Aspen with the paper's units.

**Steps**
1. Find k₀ for R-1 and R-2 in the paper and write down its full units, e.g. kmol/(kg-cat·s·(kmol/m³)ⁿ).
2. Open Reactions **R-1** → **Kinetic** tab. Look at the units shown next to *k* (the pre-exponential). Basis: CBASIS = Molarity, RBASIS = Cat-wt.
3. If the time unit is different (hr vs s), either:
   - change the unit dropdown next to *k* to match the paper (Aspen converts); or
   - multiply/divide by 3600 by hand.
4. Repeat for **R-2** (note that its rate law has order H₂ = 0.3, so the concentration units matter too).

**Verify:** CH4PYRO Results show a CH₄ conversion consistent with the paper's reported conversion at 790 °C and a similar space time.

---

## 7.2 RWGS (R-2) is irreversible at 790 °C (B2)

**Issue:** R-2 (CO₂ + H₂ → CO + H₂O) is an irreversible power law. At about 800 °C, RWGS is close to equilibrium (K ≈ 1).

**Error it causes:** CO₂ is over-converted and CO and H₂O over-predicted, while H₂ is under-predicted. The product gas composition and H₂ yield are wrong.

**Approach (choose one):**
- **Option 1 (recommended):** use the existing LHHW set `RWGS`, which already has a reverse driving-force term (`DFORCE-EQ-2 A=-4.33 B=4577.8`). Check its parameters against a source first.
- **Option 2:** add the reverse reaction to R-2 as reaction 2 (CO + H₂O → CO₂ + H₂) with k₀,rev = k₀,fwd / K_eq at 790 °C.

**Steps (Option 1)**
1. Open Block **METH.CH4PYRO** → **Reactions** tab. Replace `R-2` with **`RWGS`**, keeping `R-1`.
2. Reactions **RWGS** → check: Phase V, Rate basis Cat-wt, driving-force term 2 (A = −4.33, B = 4577.8 ↔ ln K). Confirm that these parameters reproduce K_eq(1063 K) ≈ 1 from a thermodynamic table.

**Verify:** the CO/CO₂ and H₂/H₂O ratios at the outlet approach (but don't exceed) RWGS equilibrium at 790 °C.

---

## 7.3 R-1 (CH₄ cracking) is also irreversible (optional)

**Issue:** CH₄ ⇌ C + 2 H₂ is equilibrium-limited, though conversion at 790 °C and 1 bar is high.
**Error it causes:** a slight over-prediction of CH₄ conversion if the reactor approaches equilibrium.
**Approach:** only if your paper models it as reversible, add the reverse term (LHHW form, like RWGS). Otherwise keep it irreversible and state that in the report.

---

## 7.4 Catalyst loading vs reactor volume (B4): check only

**Issue:** the tube is π/4 × 0.378² × 18.9 = **2.12 m³**. Catalyst is 24.668 kg / 1500 kg/m³ = **0.0164 m³**, about **0.8 %** of the tube.
**Error it causes:** none in Aspen. It is a design-consistency question: rate basis = cat-wt, so only the 24.7 kg matters for rate, while the volume sets the residence time (156.6 s).
**Steps:** confirm against your source that the catalyst mass, tube length and diameter come from the same design (e.g. a packed bed would have ~1500–2000 kg in 2.12 m³). Then change either the catalyst mass or the reactor size so they match the same design basis.
