# Session 5: Add feed compression for the membrane (A2)

**Session status:** ⏳ Not started.

Do this **before** Session 6: the rewritten membrane needs a pressure driving force. Back up first.

---

## 5.1 The membrane has no pressure driving force

**Issue:** the membrane feed GAS2 is at **1.013 bar** and the permeate is fixed at **1.0 bar** (`PERMEATE.P SPEC=CONST`). The feed CO₂ partial pressure is 1.013 × 0.393 = **0.40 bar**. A CO₂-rich permeate (y_CO2 ≈ 0.9) at 1 bar has a CO₂ partial pressure of about **0.9 bar**.

**Error it causes:** the driving force (P_F·x − P_P·y) for CO₂ is **negative**, so a physical membrane model can't permeate CO₂ at all. The separation is **pressure-ratio limited**. Membrane area can't fix this.

**Approach:** compress the feed. Typical zeolite (DDR / SAPO-34) operation is 5–15 bar feed with the permeate at about 1 bar. Use **10 bar** as the base case. Cool after compression: zeolite permeances are quoted at about 297 K, and the membrane should stay near 25–30 °C.

**Steps (Aspen GUI, inside the METH hierarchy flowsheet)**
1. Open the **METH** hierarchy flowsheet. Disconnect stream **GAS2** from the **MEMB1** inlet (right-click the stream → *Reconnect Destination*).
2. From the Model Palette → **Pressure Changers** → place **MCompr** (multistage, with intercooling), named `COMP1`. A single **Compr** plus a **Heater** is also fine.
3. Connect **GAS2 → COMP1** inlet. Create a new outlet stream `GAS2C`.
   - COMP1 **Setup**: Type *Isentropic*, **Number of stages = 2**, *Fix discharge pressure* = **10 bar**, isentropic efficiency 0.75 (or your design value).
   - COMP1 **Cooler** tab: intercooler/aftercooler outlet temperature **30 °C**.
   - If you use single-stage **Compr**: add **Heater** `COOL1` after it (30 °C, pressure drop 0) and connect `GAS2 → COMP1 → COOL1 → MEMB1`.
4. Connect the cooled stream (`GAS2C`) to **MEMB1 Feed** (right-click → Reconnect Destination → MEMB1 port *Feed*).
5. **Retentate pressure:** after Session 6, the ACM model sets `Retentate.P = Feed.P − dP` (≈ 10 bar).
   - Downstream, **FLASH3** is specified at 1 bar and **HEAT2** at 1 bar, so the pressure letdown to the pyrolysis (1 bar) already happens there. **No valve is needed.**
   - If you'd rather show the letdown explicitly, add a **Valve** (outlet 1 bar) on RET before FLASH3.
6. **Permeate:** keep PER at 1 bar (MEMB1 → *Permeate.P* fixed, as now).

**Verify:**
- COMP1 Results: outlet 10 bar, 30 °C, and power in kW. Report the power: it is an energy penalty of the integration.
- Stream GAS2C: 10 bar, about 30 °C, and the same composition as GAS2.
- Until Session 6 is done, MEMB1 will still give garbage. That's expected.

**Optional sensitivity (later):** vary the COMP1 discharge pressure from 5 to 15 bar against CH₄ purity in RET and the compressor power.
