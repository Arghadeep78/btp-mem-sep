# Session 9: Cleanup and documentation

Low-risk tidy-up. Back up first.

---

## 9.1 PURGAS has an always-empty outlet (P1)

**Issue:** SEP block PURGAS sends fraction 1 of every gas to GAS2, so WASTE is always empty. Its FRAC list also includes CARBON in substream MIXED (CARBON is CISOLID), which does nothing.
**Error it causes:** USP03.1 warning "WASTE has zero flow, flash bypassed". Harmless.
**Approach (choose one):**
- **Delete PURGAS:** connect METH.GAS directly to COMP1 (Session 5) and delete WASTE.
- **Make it a real purge:** e.g. a 1 % purge of everything (FRAC = 0.99 to GAS2).

**Verify:** USP03.1 is gone.

---

## 9.2 FLASH3 becomes redundant after Session 6 (E1)

**Issue:** NH3SEP already removes all water, so after the ACM fix RET is dry gas. Today FLASH3 only "removes" MEMB1's garbage components.
**Steps:** after Session 6, check FLASH3 → H2O-2. If its flow is ≈ 0, either delete FLASH3 (RET → HEAT2) or keep it as a knockout drum and document why.

---

## 9.3 NH3SEP's name hides what it does (E2)

**Issue:** NH3SEP is an ideal splitter that keeps **CO2, HYDROGEN, METHANE, CO** and removes everything else (including water) to stream NH3.
**Steps:** rename it (right-click → Rename) to e.g. `GASCLEAN` and stream NH3 to `CONDENS`, or add a block description. Also check the warning icon on stream NH3 in the GUI (Stream → Status).

---

## 9.4 METH property options that do nothing (P2)

**Issue:** `TRUE-COMPS=YES`, `FREE-WATER=STEAM-TA` and `SOLU-WATER=3` in the METH method. There is no chemistry, and the blocks use FREE-WATER=NO.
**Steps:** Hierarchy METH → Properties → reset these to defaults.

---

## 9.5 Unused reaction sets
**Issue:** CO2METH and COMETH (LHHW) are defined but used by no block. If you used RWGS in Session 7, keep it.
**Steps:** Reactions → right-click **CO2METH** / **COMETH** → Delete.

---

## 9.6 MEMB1 input unit set (E3)
**Issue:** block MEMB1 has `IN-UNITS ENG` while everything else is SI/MET. It's harmless (the ACM values are in native units) but confusing.
**Steps:** Block METH.MEMB1 → Setup → Units → set it to the same unit set as the flowsheet.

---

## 9.7 Hidden sensitivity analysis (E4)
**Finding:** the `.bkp` contains a hidden sensitivity `RESTIME` (vary B1 RES-TIME 1–40 d; tabulate CH₄ in BIOGAS and B1 volume). It is inactive.
**Steps (if wanted):** Model Analysis Tools → Sensitivity → unhide/activate `RESTIME`. After Session 3, re-target it to the liquid volume or condensed-phase residence time.

---

## 9.8 Update the project notes (Notepad)
Edit `CLAUDE.md` (section 4) to record:
- File inventory: `_3908gjr.*`, `.apw`, `.appdf` and the crash dump are not in `files/`.
- M9 ("ACMEXP block METH.B1 not initialized") cannot be verified with the current files.
- R5 applies to AMINOACI only.
- Mark each fixed item ✅ with the session date.
- Add a line pointing to `docs/fixes/00_INDEX.md`.

---

## Final verify (whole project)
| Metric | Baseline | Target |
|---|---|---|
| Warnings (Control Panel) | 15 | ≈ 1–3 (only benign info) |
| MEMB1 mass balance | +504 % | 0 % |
| Charge imbalance streams | 3 | 0 |
| RET/PER temperature | 488 / 526 K | ≈ 303 K |
| B1 liquid volume | 19036 m³ total | ≈ 320 m³ liquid |

Record the final CH₄ yield, RET purity, compressor power and H₂ production for the report.
