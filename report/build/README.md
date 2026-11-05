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
Numbers in the slides and report come from `docs/results_2026-10-07.md` and `analysis/`.
