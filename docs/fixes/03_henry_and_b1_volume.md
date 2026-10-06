# Session 3: Henry components and the B1 reactor volume basis

**Session status:** ✅ **DONE.** 3.1 installed (EDIT_LOG E027). 3.2 checked: no change needed. Run: 0 severe / 0 errors / 16 warnings (+1 cosmetic PURGAS warning, removed in Session 9).

Back up first.

---

## 3.1 No Henry components: dissolved-gas behaviour is unreliable (B1)

**Status:** ✅ Applied (EDIT_LOG E027): `HC-1` = CO2, METHANE, HYDROGEN, H2S, CO, set as the global Henry components. METH inherits it, so no separate METH setting is needed.

**Issue:**
- The property method is NRTL with **no Henry component set**. The `.bkp` has a HENRY parameter form, but it is never activated.
- CO₂, CH₄, H₂, H₂S and CO, which are all supercritical or light gases at 25–55 °C, are treated with extrapolated vapour pressures (Raoult's law).
- The WATER–CO2 and WATER–H2S NRTL parameters are all 0.

**Error it causes:**
- Wrong gas solubility in the digestate.
- Wrong vapour/liquid split in B1 (vapour fraction 0.0416) and FLASH.
- Wrong CO₂ loss with LIQUID/H2O1, which changes the biogas CO₂/CH₄ ratio going to the membrane.

**Approach:** standard Aspen practice for an activity-coefficient method with light gases is to declare them as Henry components, so their liquid fugacity uses Henry's constants (databank APV140 BINARY / HENRY-AP).

**Steps (Aspen GUI)**
1. **Props → Components → Henry Comps → New** → ID `HC-1`. Move into *Selected components*: **CO2, METHANE, HYDROGEN, H2S, CO**. Leave NH3 out: it is condensable and NRTL handles it.
2. **Props → Methods → Specifications → Global** → field **Henry components** = `HC-1`.
3. The METH hierarchy has its own property method. Go to **Sim → Hierarchy METH → Properties** (or Methods for METH) and set **Henry components = HC-1** there too.
4. **Props → Methods → Parameters → Binary Interaction → HENRY-1**: press **Run** (properties only). Rows for CO2/METHANE/HYDROGEN/H2S/CO with WATER should fill from APV140. If a pair is empty, note it. Pairs with organics are fine to leave empty; water is the important solvent.

**Verify:**
- Control Panel: no "missing Henry parameter" errors for WATER pairs.
- B1 results: **less** gas stays dissolved, which matches Henry's law. Tested: LIQUID CO₂ 5.66 → 0.24 kg/h (hand check ≈ 0.29), LIQUID CH₄ 0.79 → 0.0065 kg/h (≈ 0.008); BIOGAS CH₄ 14.60 → 15.37 kg/h, CO₂ 23.97 → 29.39 kg/h; B1 vapour fraction 0.038 → 0.043. NRTL with Raoult's law had been over-dissolving the gases (CO₂ ~20×, CH₄ ~100×).
- **Known cosmetic warning (+1):** PURGAS (USP03.1), "all components are Henry components". Its streams are 100 % dry gas, so there's no effect; it goes away when PURGAS is reworked or deleted (Session 9, 9.1).
- Record the new BIOGAS composition, because it is the membrane feed for Session 6.

---

## 3.2 B1 reactor volume is about 60× too large (§4.6), check first

**Status:** ✅ Checked, no change needed. B1 reports condensed-phase volume **320 m³** (317 m³ with Henry) and residence time 360 h = 15 d, exactly the design liquid volume. The 17 000–19 600 m³ total is headspace vapour, which the liquid-phase reactions don't use.

**Issue:** B1 (RCSTR, 2-phase) is specified with **Residence time = 15 d**. The log shows **VOLUME = 19036.4 m³**. The liquid throughput is about 21.5 t/d, so 15 d of liquid is about **320 m³**. Aspen applies the residence time to the **total outlet volumetric flow, including vapour**, so the vapour (biogas) flow inflates the volume.

**Error it causes:** if the liquid-phase rates (all reactions are PHASE=L) use a liquid volume of that size, every conversion is over-predicted: CH₄ is too high and digestate VFAs/sugars too low.

**Approach:** first **check** what liquid volume Aspen actually used, then switch to a liquid-based specification if needed.

**Steps: check**
1. Run. Open **Block B1 → Results → Summary**. Note *Reactor volume*, *Vapor/condensed phase volume* (or *Condensed phase volume fraction*), and *Residence time* per phase if shown.
2. If the condensed-phase volume is about 320 m³ (15 d × liquid flow), no change is needed. Record that in the report and stop here.
3. If the condensed-phase volume is ≫ 320 m³ (e.g. ~19000 × liquid fraction), apply the fix below.

**Steps: fix**
1. **Block B1 → Setup → Specifications.** Change *Specification type* from *Residence time* to an option that fixes the **condensed (liquid) phase**:
   - **Reactor volume + Phase volume**, with the condensed phase volume = design liquid volume (e.g. 15 d × liquid m³/h, ≈ 320 m³) and the reactor volume = liquid + headspace (e.g. 1.15 × liquid ≈ 370 m³); or
   - **Residence time + phase volume fraction** with *Phase = Liquid*.

   Use whichever your V14 dropdown offers.
2. If the sensitivity on RES-TIME (hidden, see Session 9) is re-activated later, re-target it to the liquid volume.

**Verify:** B1 Results show a condensed-phase residence time ≈ 15 d and a volume consistent with ~320 m³ of liquid. CH₄ in BIOGAS will most likely **drop**; record the before/after values.
