# Session 6: Rewrite the ACM membrane model (M1–M4, M6, A1, F)

**Session status:** ✅ **DONE** (by user, EDIT_LOG E033, commit 007cc74). Model compiled and exported (ATMLZ 2026-10-06 16:06). Run: 0 errors / 3 warnings; MEMB1 converges in 5 iterations (193 equations); no BALMAS/BALCHG; RET/PER at 303 K; RET CH₄ 76.4 %, CH₄ recovery ≈ 96.9 % (A = 5 m², 10 bar). Block spec added: `PERMEATE.V` fixed = 50.

Needs **Aspen Custom Modeler** + Notepad + Aspen Plus. Do Session 5 (compressor) first. Back up the `.bkp` **and** `Zeo_real.ATMLZ`.

---

## 6.1 What is wrong now (all from the current ATMLZ model)

| # | Issue | Error it causes |
|---|---|---|
| M2 | The model uses component `"CH4"`; Aspen's ID is `METHANE` | `!! Unable to find name for variable` / `Index out of bounds (218 vars)` ×3. A phantom `FEED.Z(CH4) = 0.5` (default value) while the real `FEED.Z(METHANE) = 0.6027` |
| M3 | Equations only for z("CH4") and z("CO2"). The other 60 components have no equations | Their outlet z's sit at the default 1/62 = 0.0161 |
| M1 | Free z's × molecular weights | **Mass out 6× mass in** (BALMAS.1, relative difference 5.04) |
| M4 | Free ion z's (H+, OH-, NH4+ …) = 1/62 | Charge imbalance (BALCHG.1) in RET, PER, H2O-2 |
| M6 | `Permeate.F = 0.2*Feed.F`, `z = 0.3/0.7` hard-coded; the flux equations are dead code | Results don't depend on the membrane at all |
| A1 | D·S/L permeances fall below the `max()` floor; units are inconsistent | Even if connected, permeation ≈ 0 (J_CH4 ≈ 8e-7, J_CO2 = 0) |
| M7 | No T/h equations | Outlets flash to 487.8 K (RET) and 526.5 K (PER) from a 298 K feed |

**Approach:**
- Write **one component balance per component over the whole `ComponentList`**.
- Use **literature permeances** (DDR zeolite, see the review §A1) for the permeable gases (CO₂, H₂, CH₄), with zero permeation for everything else.
- Give the outlets the feed temperature, and get enthalpy from a property call.
- Use a well-mixed (perfect-mixing) membrane: conservative and robust.

---

## 6.2 New model code

Edit this in ACM, or in Notepad and paste it into ACM. It replaces the whole `Model Zeo_real … End` block.

```
Model Zeo_real
  // ===== Ports (ACM units: F kmol/hr, T C, P bar, h GJ/kmol) =====
  Feed      as input  MoleFractionPort;
  Permeate  as output MoleFractionPort;
  Retentate as output MoleFractionPort;

  // ===== Parameters =====
  // Aspen Plus component IDs that permeate (must match Aspen exactly)
  PermSet as StringSet (["CO2", "HYDROGEN", "METHANE"]);

  // Permeance, mol/(m2.s.Pa), DDR zeolite at 297 K
  // Source: Yang et al., J. Membr. Sci. 2016 (CO2 2.1e-7, H2 1.36e-7, CH4 3.03e-9)
  Pi(PermSet) as RealParameter;
  Pi("CO2")      : 2.1e-7;
  Pi("HYDROGEN") : 1.36e-7;
  Pi("METHANE")  : 3.03e-9;

  A      as RealParameter (value: 5.0);   // m2  (size 3-10 m2 at ~10 bar feed)
  dP_ret as RealParameter (value: 0.0);   // bar, retentate-side pressure drop

  // ===== Variables =====
  nP(ComponentList) as flow_mol (initial: 0.01);   // permeate component flows, kmol/hr

  // ===== Component balances: EVERY component =====
  Feed.F*Feed.z(ComponentList) = Permeate.F*Permeate.z(ComponentList)
                               + Retentate.F*Retentate.z(ComponentList);
  Permeate.F*Permeate.z(ComponentList) = nP(ComponentList);

  // ===== Permeation, well-mixed: driving force uses retentate composition =====
  // kmol/hr = Pi [mol/m2/s/Pa] * A [m2] * dp [Pa] * 3.6 ; dp[Pa] = 1e5 * dp[bar]
  For c In PermSet Do
    nP(c) = Pi(c)*A*1e5*(Feed.P*Retentate.z(c) - Permeate.P*Permeate.z(c))*3.6;
  EndFor

  // Non-permeating components stay in the retentate
  For c In ComponentList - PermSet Do
    nP(c) = 0;
  EndFor

  // ===== Totals =====
  Permeate.F = sigma(nP);
  sigma(Retentate.z) = 1;

  // ===== Temperature, pressure, enthalpy =====
  Retentate.T = Feed.T;
  Permeate.T  = Feed.T;
  Retentate.P = Feed.P - dP_ret;
  // Permeate.P is fixed from Aspen Plus (PERMEATE.P SPEC=CONST, 1 bar)
  Call (Retentate.h) = pEnth_Mol(Retentate.T, Retentate.P, Retentate.z);
  Call (Permeate.h)  = pEnth_Mol(Permeate.T,  Permeate.P,  Permeate.z);
End
```

**Equation count check** (N = number of components):
- Unknowns: F×2, z×2N, nP×N, T×2, Retentate.P, h×2 = **3N + 7**
- Equations: balances N + nP-definition N + permeation/zero N + 1 + 1 + 2 T + 1 P + 2 h = **3N + 7** ✓

**Syntax notes (ACM V14):**
- `PermSet - ...` set subtraction, `sigma()` and `For … In … Do` are standard ACM. If the compiler complains about assigning `Pi("CO2") : …` inside the model, make `Pi` three separate scalar RealParameters (`Pi_CO2`, `Pi_H2`, `Pi_CH4`) and write three explicit permeation equations instead of the `For` loop.
- `pEnth_Mol` is the standard ACM molar-enthalpy procedure. If ACM reports it as unknown, check *Help → Physical property procedures* for the exact name in your version.
- If `MoleFractionPort` in your library has no `h`, delete the two `Call` lines; Aspen will then flash the outlets at the given T and P.

---

## 6.3 Steps

1. **Open the model in ACM.** Launch Aspen Custom Modeler → open the working `.acmf` (desktop `zeo_real.acmf`) or a new simulation → **Custom Modeling → Models → Zeo_real** → right-click → **Edit**.
2. Replace the model text with the code in 6.2. Delete the old `Zeo_real_1` model if it is not used.
3. **Compile** (right-click model → Compile). Fix any syntax messages using the notes above. Check that the status bar shows **0 degrees of freedom** when tested with a dummy feed (CO2/HYDROGEN/METHANE component list).
4. **Export to Aspen Plus:** *Tools → Package Model for Aspen Plus/HYSYS* (the exact menu name may vary slightly in V14). Select `Zeo_real` and export. This regenerates **`Zeo_real.ATMLZ`**. Install or register it (double-click the ATMLZ, or copy it next to the `.bkp` / into the Aspen user library folder, as you did originally).
5. **Keep the desktop copy in sync:** save the same model text into `files/zeo_real.acmf`. The desktop file is currently an older 10 %-split variant, so overwrite it with the new model.
6. **Aspen Plus:** open the `.bkp` → Block **METH.MEMB1** → check that it still references model `Zeo_real`. If Aspen asks, **reload the model** (right-click block → *Reload*). On the block's ACM **Variables** form:
   - check `Permeate.P` = **Fixed, 1 bar**;
   - delete the old `RETENTATE.T`/`PERMEATE.T` VALUE entries if they appear as fixed (T is now computed);
   - set `T` (the old REALPARAM) — no longer used, ignore or delete.
7. Run.

---

## 6.4 Verify

| Check | Expected |
|---|---|
| Control Panel | **No** "Unable to find name" / "Index out of bounds" |
| BALMAS.1 for METH.MEMB1 | **Gone** (mass in = mass out) |
| BALCHG.1 for RET, PER, H2O-2 | **Gone** (no free ion z's) |
| RET and PER temperature | ≈ feed T (about 30 °C after the aftercooler), **not** 487.8 / 526.5 K |
| RET composition | CH₄-enriched (> GAS2's ~60 %), CO₂ reduced, all other components 0 |
| PER composition | CO₂-rich, some H₂, little CH₄ |
| Overall warning count | Should drop by 4 (BALMAS + 3 × BALCHG) |

**Tuning:** vary `A` (3, 5, 10 m²) and the compressor pressure (Session 5). Report CH₄ purity in RET against CH₄ loss to PER. For a high-selectivity sensitivity case, use Himeno 2007 values: Π_CO2 = 4.2e-7, Π_CH4 = 1.2e-9.
