# Build files for the BTP-1 presentation and report

- `figs.py` makes the report figures in `fig/` (needs matplotlib).
- `build_deck.js` makes `../BTP1_presentation.pptx` (needs `npm install pptxgenjs`).
- `build_speech_qna.js` makes `../BTP1_speech_script.docx` and `../BTP1_QnA.docx` (`node build_speech_qna.js`).
- `build_report.js` makes `../BTP1_report.docx` (needs `npm install docx`).

Run from this folder:
```
npm install pptxgenjs docx
python3 figs.py
node build_deck.js ../BTP1_presentation.pptx
node build_report.js ../BTP1_report.docx
```
Numbers in the slides and report come from the current model (COM run of 2026-11-06, after C1/C2; `docs/results_2026-10-07.md`, 2026-10-09 block) and `analysis/`.
Node packages need not live in this folder: install them elsewhere and set `NODE_PATH` to that `node_modules` folder (do not commit `node_modules`).
