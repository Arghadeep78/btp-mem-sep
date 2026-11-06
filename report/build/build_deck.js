// BTP‑1 presentation: biogas -> zeolite membrane -> CH4 pyrolysis
const pptxgen = require('pptxgenjs');
const { applyTheme } = require('./apply_theme.js');
const OUT = process.argv[2] || 'BTP1_presentation.pptx';

const THEME = {
  name: 'Biogas Hydrogen', headFontFace: 'Cambria', bodyFontFace: 'Calibri',
  colors: { dk1: '1E2B26', lt1: 'FFFFFF', dk2: '1B4332', lt2: 'EEF3EF',
    accent1: '2D6A4F', accent2: '74A57F', accent3: 'E07A1F', accent4: '3A7CA5', accent5: '9AA5A0', accent6: 'B23A48',
    hlink: '3A7CA5', folHlink: '6B4E71' } };
const HEX = { green: '2D6A4F', moss: '74A57F', orange: 'E07A1F', blue: '3A7CA5', grey: '9AA5A0', red: 'B23A48', dark: '1B4332', text: '1E2B26', light: 'EEF3EF', mid: '5E6B66' };

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';               // 10 x 5.625 in
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = 'BTP‑1: Green hydrogen from organic waste';
pres.author = 'Arghadeep Ghosh';
const C = pres.SchemeColor;

// ---------------- layouts
pres.defineSlideMaster({ title: 'TITLE', background: { color: HEX.dark },
  objects: [{ placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 1.35, w: 8.8, h: 1.6, fontSize: 34, bold: true, color: C.background1, valign: 'bottom', align: 'left' }, text: '' } },
            { placeholder: { options: { name: 'body', type: 'body', x: 0.6, y: 3.1, w: 8.8, h: 1.4, fontSize: 16, color: 'CFE3D6', valign: 'top' }, text: '' } }] });
pres.defineSlideMaster({ title: 'SECTION', background: { color: HEX.green },
  objects: [{ placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 2.0, w: 8.8, h: 1.0, fontSize: 32, bold: true, color: C.background1, align: 'left' }, text: '' } },
            { placeholder: { options: { name: 'body', type: 'body', x: 0.6, y: 3.05, w: 8.8, h: 0.8, fontSize: 16, color: 'D8EADF' }, text: '' } }],
  slideNumber: { x: 9.2, y: 5.2, w: 0.5, h: 0.3, fontSize: 10, color: 'D8EADF' } });
pres.defineSlideMaster({ title: 'CONTENT', background: { color: 'FFFFFF' },
  objects: [{ placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.25, w: 9.0, h: 0.7, fontSize: 26, bold: true, color: C.text2, valign: 'middle' }, text: '' } }],
  slideNumber: { x: 9.2, y: 5.25, w: 0.5, h: 0.3, fontSize: 10, color: HEX.mid } });

let sec = '';
function section(title, sub) {
  sec = title; pres.addSection({ title });
  const s = pres.addSlide({ masterName: 'SECTION', sectionTitle: sec });
  s.addText(title, { placeholder: 'title' }); s.addText(sub, { placeholder: 'body' }); return s;
}
function slide(title) { const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: sec }); s.addText(title, { placeholder: 'title' }); return s; }
function txt(s, t, o) { s.addText(t, Object.assign({ isTextBox: true, fontSize: 14, color: C.text1, valign: 'top', margin: 0.05 }, o)); }
function card(s, x, y, w, h, fill, name) { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.08, objectName: name }); }
function bullets(items, size = 14) { return items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 5, fontSize: size } })); }
function stat(s, x, y, w, big, small, col) {
  txt(s, big, { x, y, w, h: 0.62, fontSize: 30, bold: true, color: col || C.accent1, fontFace: 'Cambria' });
  txt(s, small, { x, y: y + 0.62, w, h: 0.5, fontSize: 12, color: HEX.mid });
}
function source(s, t) { txt(s, t, { x: 0.5, y: 5.2, w: 8.5, h: 0.3, fontSize: 10, color: HEX.mid, italic: true }); }
const AX = { catAxisLabelColor: HEX.mid, valAxisLabelColor: HEX.mid, catAxisLabelFontSize: 11, valAxisLabelFontSize: 10,
  catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt', dataLabelFontFace: '+mn-lt', titleFontFace: '+mn-lt', legendFontFace: '+mn-lt',
  valGridLine: { color: 'DDE3E0', size: 0.5 }, catGridLine: { style: 'none' }, dataLabelFontSize: 10, dataLabelColor: HEX.text, titleFontSize: 13, titleColor: HEX.text };

// ================= 1 Title
pres.addSection({ title: 'Introduction' }); sec = 'Introduction';
let s = pres.addSlide({ masterName: 'TITLE', sectionTitle: sec });
s.addText('Green hydrogen from organic waste: biogas, zeolite membrane and methane pyrolysis', { placeholder: 'title' });
s.addText([{ text: 'BTP‑1 progress presentation', options: { breakLine: true } },
           { text: 'Arghadeep Ghosh (23CH3FP53)  |  10 November 2026', options: { breakLine: true } },
           { text: 'Aspen Plus V14 with a custom membrane module in Aspen Custom Modeler', options: { fontSize: 13, color: '9FC4AD' } }], { placeholder: 'body' });

// ================= 2 Contents
s = slide('Contents');
const parts = [['1', 'Background', 'Waste routes and green hydrogen'], ['2', 'Process and model', 'Flowsheet, custom membrane module'],
  ['3', 'Results per unit', 'Biogas, upgrading, pyrolysis'], ['4', 'Material and energy balance', 'Largest energy users, how to cut them'],
  ['5', 'Exergy and CO₂', 'Where exergy is lost; Scope 1 + 2'], ['6', 'Sensitivity and models', 'Pressure, membrane models, next steps']];
parts.forEach((p, i) => {
  const x = 0.5 + (i % 3) * 3.05, y = 1.05 + Math.floor(i / 3) * 1.45;
  card(s, x, y, 2.85, 1.3, HEX.light, 'part' + i);
  s.addShape(pres.shapes.OVAL, { x: x + 0.15, y: y + 0.15, w: 0.42, h: 0.42, fill: { color: HEX.green }, line: { color: HEX.green } });
  txt(s, p[0], { x: x + 0.15, y: y + 0.15, w: 0.42, h: 0.42, align: 'center', valign: 'middle', color: 'FFFFFF', bold: true, fontSize: 14, margin: 0 });
  txt(s, p[1], { x: x + 0.68, y: y + 0.17, w: 2.1, h: 0.4, bold: true, fontSize: 14, valign: 'middle' });
  txt(s, p[2], { x: x + 0.15, y: y + 0.7, w: 2.6, h: 0.5, fontSize: 12, color: HEX.mid });
});
txt(s, 'Key terms', { x: 0.5, y: 4.0, w: 3.0, h: 0.3, bold: true, fontSize: 13, color: C.accent1 });
const terms = [['Biogas', 'gas made by microbes digesting waste: about 60\u00a0% CH\u2084, 40\u00a0% CO\u2082'], ['Membrane', 'thin layer that lets some gases pass faster than others'],
  ['Pyrolysis', 'splitting CH\u2084 with heat into H\u2082 and solid carbon'], ['Exergy', 'the useful part of energy that can still do work']];
terms.forEach((t, i) => { const x = 0.5 + i * 2.28;
  txt(s, [{ text: t[0] + ': ', options: { bold: true } }, { text: t[1] }], { x, y: 4.32, w: 2.15, h: 0.8, fontSize: 11.5 }); });


// ================= Background
section('1  Background', 'Organic waste today and green routes to hydrogen');
s = slide('Organic waste: conventional routes waste its energy');
const routes = [['Landfill', 'Uncontrolled CH₄ emissions (a strong greenhouse gas), leachate, land use. Energy is lost'],
  ['Open burning', 'Air pollution and CO₂; no energy recovered'],
  ['Composting', 'Recovers nutrients but not energy; CO₂ released'],
  ['Incineration', 'Recovers some heat or power, but wet waste burns poorly']];
routes.forEach((r, i) => {
  const y = 1.15 + i * 0.95;
  card(s, 0.5, y, 5.4, 0.82, HEX.light, 'route' + i);
  txt(s, r[0], { x: 0.65, y: y + 0.08, w: 1.6, h: 0.66, bold: true, fontSize: 15, valign: 'middle', color: C.accent6 });
  txt(s, r[1], { x: 2.25, y: y + 0.08, w: 3.55, h: 0.66, fontSize: 12.5, valign: 'middle' });
});
card(s, 6.2, 1.15, 3.3, 3.7, HEX.green, 'adcard');
txt(s, 'Anaerobic digestion', { x: 6.4, y: 1.3, w: 2.9, h: 0.45, bold: true, fontSize: 17, color: 'FFFFFF' });
txt(s, bullets(['Microbes turn wet organic waste into biogas (about 60 % CH₄, 40 % CO₂)', 'Captures the methane instead of releasing it', 'Leaves digestate usable as fertiliser', 'This work: upgrade the biogas and turn its CH₄ into H₂ + solid carbon'], 13),
  { x: 6.4, y: 1.8, w: 2.95, h: 2.95, color: 'FFFFFF' });

s = slide('Routes to hydrogen and where this work fits');
const hroutes = [['Grey', 'Steam reforming of natural gas', 'about 10–12', HEX.grey],
  ['Blue', 'Reforming + CO₂ capture', 'lower, not zero', HEX.blue],
  ['Green', 'Water electrolysis with renewable power', 'close to 0', HEX.moss],
  ['Turquoise', 'Methane pyrolysis: CH₄ → C(s) + 2 H₂', 'no CO₂ from the reaction', '2A9D8F'],
  ['This work', 'Pyrolysis of biomethane from waste', 'can be net negative (stored carbon)', HEX.orange]];
txt(s, 'Route', { x: 0.5, y: 1.05, w: 1.6, h: 0.3, bold: true, fontSize: 12, color: HEX.mid });
txt(s, 'Process', { x: 2.2, y: 1.05, w: 4.0, h: 0.3, bold: true, fontSize: 12, color: HEX.mid });
txt(s, 'kg CO₂e per kg H₂', { x: 6.4, y: 1.05, w: 3.1, h: 0.3, bold: true, fontSize: 12, color: HEX.mid });
hroutes.forEach((r, i) => {
  const y = 1.4 + i * 0.66;
  card(s, 0.5, y, 9.0, 0.56, i === 4 ? 'FCEBDD' : HEX.light, 'hr' + i);
  s.addShape(pres.shapes.OVAL, { x: 0.62, y: y + 0.15, w: 0.26, h: 0.26, fill: { color: r[3] }, line: { color: r[3] } });
  txt(s, r[0], { x: 1.0, y: y + 0.06, w: 1.2, h: 0.44, bold: true, fontSize: 14, valign: 'middle' });
  txt(s, r[1], { x: 2.2, y: y + 0.06, w: 4.1, h: 0.44, fontSize: 13, valign: 'middle' });
  txt(s, r[2], { x: 6.4, y: y + 0.06, w: 3.0, h: 0.44, fontSize: 13, valign: 'middle', bold: i === 4 });
});
txt(s, 'India Green Hydrogen Standard (MNRE, 2023): ≤ 2 kg CO₂e per kg H₂, well-to-gate', { x: 0.5, y: 4.75, w: 9.0, h: 0.35, fontSize: 13, bold: true, color: C.accent1 });
source(s, 'Grey H₂: IEA Global Hydrogen Review. Standard: MNRE notification, Aug 2023.');

s = slide('Problem statement');
card(s, 0.5, 1.1, 9.0, 1.75, HEX.green, 'ps');
txt(s, 'Wet organic waste is mostly landfilled, where it releases methane and its energy is lost. This project designs and analyses an integrated process that converts wet organic waste into hydrogen and solid carbon, through anaerobic digestion, zeolite-membrane biogas upgrading and catalytic methane pyrolysis, and identifies where its energy use, exergy losses and CO₂ emissions can be reduced.', { x: 0.75, y: 1.2, w: 8.5, h: 1.55, fontSize: 15, color: 'FFFFFF', valign: 'middle' });
txt(s, 'Goals', { x: 0.5, y: 2.95, w: 3.0, h: 0.3, bold: true, fontSize: 13, color: HEX.mid });
const goals = [['H₂', 'from a greener source'], ['CO₂', 'reduce emissions'], ['Heat', 'use the excess heat'], ['kWh', 'minimise energy use']];
goals.forEach((g, i) => {
  const x = 0.5 + i * 2.3;
  s.addShape(pres.shapes.OVAL, { x: x + 0.55, y: 3.3, w: 1.0, h: 1.0, fill: { color: [HEX.green, HEX.blue, HEX.orange, HEX.moss][i] }, line: { color: 'FFFFFF' } });
  txt(s, g[0], { x: x + 0.55, y: 3.3, w: 1.0, h: 1.0, align: 'center', valign: 'middle', bold: true, fontSize: 18, color: 'FFFFFF', margin: 0 });
  txt(s, g[1], { x: x, y: 4.4, w: 2.1, h: 0.45, align: 'center', fontSize: 14 });
});

// ================= Process and model
section('2  Process and model', 'Flowsheet, Aspen set-up and development');
s = slide('Process flow diagram');
const box = (x, y, w, h, t, fill, col) => { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.06 });
  txt(s, t, { x, y, w, h, align: 'center', valign: 'middle', fontSize: 11, bold: true, color: col || 'FFFFFF', margin: 0.02 }); };
const arr = (x1, y1, x2, y2) => s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001, flipH: x2 < x1, flipV: y2 < y1, line: { color: HEX.mid, width: 1.25, endArrowType: 'triangle' } });
const lab = (x, y, w, t, al) => txt(s, t, { x, y, w, h: 0.42, fontSize: 9.5, color: HEX.mid, align: al || 'center', margin: 0 });
// row 1: digestion
box(0.4, 1.25, 1.25, 0.6, 'Mix + hydrolysis\n(RSTOIC, 55 °C)', HEX.green);
box(2.15, 1.25, 1.35, 0.6, 'Digester B1\n(RCSTR, 55 °C, 15 d)', HEX.green);
box(4.0, 1.25, 1.35, 0.6, 'Cleanup\n(flash, H₂S, NH₃)', HEX.moss);
box(5.85, 1.25, 1.55, 0.6, '2-stage compression\n1 → 10 bar, 30 °C', HEX.blue);
box(7.9, 1.25, 1.6, 0.6, 'Zeolite membrane\nMEMB1 (ACM)', HEX.blue);
arr(1.65, 1.55, 2.15, 1.55); arr(3.5, 1.55, 4.0, 1.55); arr(5.35, 1.55, 5.85, 1.55); arr(7.4, 1.55, 7.9, 1.55);
txt(s, 'Feed: biomass 8.5 t/d + water 13 t/d', { x: 0.4, y: 0.95, w: 3.0, h: 0.28, fontSize: 9.5, color: HEX.mid, margin: 0 });

arr(2.82, 1.85, 2.82, 2.3); lab(2.0, 2.3, 1.7, 'Digestate\n(about 820 kg/h)');
arr(4.67, 1.85, 4.67, 2.3); lab(3.9, 2.3, 1.6, 'Water, H₂S,\nNH₃ purges');
arr(8.7, 1.85, 8.7, 2.3); lab(7.85, 2.3, 1.7, 'Permeate 1 bar\n92 % CO₂ (out)');
// row 2: pyrolysis (right to left)
box(7.9, 3.25, 1.6, 0.6, 'Letdown to 1 bar\n(FLASH3)', HEX.grey);
box(5.85, 3.25, 1.55, 0.6, 'Preheat to 790 °C\n(HEAT2)', HEX.orange);
box(3.6, 3.25, 1.75, 0.6, 'CH₄ pyrolysis\nCH4PYRO (RPLUG, 790 °C)', HEX.orange);
box(1.35, 3.25, 1.75, 0.6, 'Product\nH₂ + CO + solid C', HEX.dark);
s.addShape(pres.shapes.LINE, { x: 9.3, y: 1.85, w: 0.0001, h: 1.4, line: { color: HEX.mid, width: 1.25, endArrowType: 'triangle' } });
lab(7.55, 2.78, 1.6, 'Retentate 10 bar\n76 % CH₄', 'right');
arr(7.9, 3.55, 7.4, 3.55); arr(5.85, 3.55, 5.35, 3.55); arr(3.6, 3.55, 3.1, 3.55);
lab(1.2, 3.95, 2.1, 'H₂ 4.46 kg/h, C 15.4 kg/h');
txt(s, 'Heat in: 84 kW (RSTOIC 24.7, B1 3.5, HEAT2 20.4, CH4PYRO 35.4)   |   Electricity: 5.7 kW (compressors)', { x: 0.5, y: 4.5, w: 9.0, h: 0.35, fontSize: 12, bold: true, color: C.accent1 });
txt(s, [{ text: 'Retentate', options: { bold: true } }, { text: ' = gas that stays on the high-pressure side of the membrane (CH\u2084-rich).   ' }, { text: 'Permeate', options: { bold: true } }, { text: ' = gas that passes through it (CO\u2082-rich).' }], { x: 0.5, y: 4.88, w: 9.0, h: 0.3, fontSize: 11.5 });

s = slide('Aspen model set-up');
const setRows = [['Step', 'What it does (plain words)', 'Aspen blocks and key specification'],
  ['Hydrolysis', 'Breaks large molecules into sugars, acids and amino acids (55\u00a0\u00b0C)', 'MIX1, RSTOIC: 13 reactions in series, fixed conversions'],
  ['Digestion', 'Stirred tank where microbes make biogas (55\u00a0\u00b0C, 15 days)', 'B1 (RCSTR) + 10 calculator blocks: ADM1-style kinetics with inhibition, recycle loop'],
  ['Gas cleanup', 'Removes water, H\u2082S and NH\u2083 from the biogas', 'FLASH, H2S-SEP, NH3SEP (ideal splitters)'],
  ['Compression', 'A two-stage compressor with intercooling raises the pressure to 10 bar', 'COMP (MCompr, 2 stages): efficiency 0.75, cooled to 30\u00a0\u00b0C'],
  ['Membrane', 'Zeolite layer lets CO\u2082 through and keeps CH\u2084 (5\u00a0m\u00b2)', 'MEMB1: custom ACM model Zeo_real, DDR permeances'],
  ['Pyrolysis', 'Hot reactor with catalyst splits CH\u2084 into H\u2082 + carbon (790\u00a0\u00b0C)', 'FLASH3, HEAT2, CH4PYRO (RPLUG), 1 bar'],
  ['Properties', 'How Aspen calculates gas and liquid behaviour', 'NRTL + Peng\u2013Robinson, Henry gases, 62 components']];
s.addTable(setRows.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: i === 0 || j === 0, color: i === 0 ? 'FFFFFF' : (j === 2 ? HEX.mid : HEX.text), fontSize: i === 0 ? 12 : (j === 2 ? 10.5 : 12.5), fill: { color: i === 0 ? HEX.green : (i % 2 ? 'FFFFFF' : HEX.light) } } }))),
  { x: 0.5, y: 1.05, w: 9.0, colW: [1.35, 4.25, 3.4], border: { type: 'solid', pt: 0.5, color: 'D5DDD8' }, rowH: 0.48, valign: 'middle' });

s = slide('Custom membrane module in Aspen Custom Modeler');
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.6, y: 1.4, w: 1.9, h: 0.95, fill: { color: HEX.blue }, line: { color: HEX.blue }, rectRadius: 0.08, objectName: 'acmblock' });
txt(s, [{ text: 'MEMB1', options: { bold: true, fontSize: 16, breakLine: true } }, { text: 'Zeo_real (ACM)', options: { fontSize: 12 } }], { x: 1.6, y: 1.4, w: 1.9, h: 0.95, align: 'center', valign: 'middle', color: 'FFFFFF', margin: 0 });
const ln = (x, y, w, h) => s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: HEX.mid, width: 1.5, endArrowType: 'triangle' } });
ln(0.5, 1.87, 1.1, 0.0001); ln(3.5, 1.87, 1.0, 0.0001); ln(2.55, 2.35, 0.0001, 0.55);
txt(s, 'Feed, 10 bar', { x: 0.45, y: 1.5, w: 1.2, h: 0.3, fontSize: 11, color: HEX.mid, margin: 0 });
txt(s, 'Retentate, 10 bar', { x: 3.55, y: 1.5, w: 1.3, h: 0.3, fontSize: 11, color: HEX.mid, margin: 0 });
txt(s, 'Permeate, 1 bar', { x: 2.7, y: 2.6, w: 1.4, h: 0.3, fontSize: 11, color: HEX.mid, margin: 0 });
txt(s, 'Aspen Plus has no gas-membrane block, so I wrote this model in Aspen Custom Modeler (ACM, Aspen\u2019s tool for writing new unit models), exported it as a model library and linked it into the flowsheet as a normal block.', { x: 0.5, y: 3.05, w: 4.2, h: 0.85, fontSize: 12.5 });
card(s, 5.0, 1.1, 4.5, 2.8, HEX.light, 'acmeq');
const sub = (t, last) => { const parts = t.split(/(_\{[^}]+\})/).filter(x => x); return parts.map((x, k) => ({ text: x.startsWith('_{') ? x.slice(2, -1) : x, options: Object.assign({ subscript: x.startsWith('_{') }, k === 0 ? { bullet: true } : {}, (k === parts.length - 1 && !last) ? { breakLine: true } : {}) })); };
const eqs = ['Every component i:  F·z_{i} = R·x_{i} + V·y_{i}', 'CO₂, H₂, CH₄:  V·y_{i} = Π_{i}·A·(p_{F}·x_{i} − p_{P}·y_{i})', 'Other species stay in the retentate',
  'T_{R} = T_{P} = T_{F};  p_{R} = p_{F} − Δp', 'Enthalpies from Aspen’s property system', 'Inputs: DDR permeances (Yang 2016); area 5 m²'];
txt(s, [{ text: 'Equations', options: { bold: true, fontSize: 14, color: C.accent1, breakLine: true } }, ...eqs.flatMap((e, k) => sub(e, k === eqs.length - 1))], { x: 5.2, y: 1.2, w: 4.15, h: 2.6, fontSize: 12.5, paraSpaceAfter: 4 });
stat(s, 0.5, 4.05, 2.9, '193', 'equations solved');
stat(s, 3.55, 4.05, 2.9, '5 iterations', 'to converge in the flowsheet', HEX.blue);
stat(s, 6.6, 4.05, 2.9, 'Exact', 'mass and energy balance closure');

s = slide('Development challenges and how I solved them');
const devp = [['No gas-membrane block in Aspen Plus; my first ACM model did not conserve mass', 'Rewrote it from first principles: mass and energy balanced, converges in 5 iterations'],
  ['Biogas at 1 bar gave almost no driving force across the membrane', 'Added two-stage intercooled compression to 10 bar'],
  ['Digester rates from inlet concentrations underestimated degradation', 'Rates from reactor concentrations, converged with a recycle loop'],
  ['Some reactions were not mass- or element-balanced; gaps in property data', 'Rebalanced the stoichiometry; added Henry components; cleaned the property data']];
txt(s, 'Challenge', { x: 0.5, y: 1.0, w: 4.3, h: 0.3, bold: true, fontSize: 12, color: HEX.mid });
txt(s, 'How I solved it', { x: 5.2, y: 1.0, w: 4.3, h: 0.3, bold: true, fontSize: 12, color: HEX.mid });
devp.forEach((p, i) => { const y = 1.35 + i * 0.82;
  card(s, 0.5, y, 4.3, 0.7, 'F8E3E5', 'dp' + i); txt(s, p[0], { x: 0.65, y: y + 0.04, w: 4.0, h: 0.62, fontSize: 12.5, valign: 'middle' });
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 4.88, y: y + 0.22, w: 0.25, h: 0.26, fill: { color: HEX.mid }, line: { color: HEX.mid } });
  card(s, 5.2, y, 4.3, 0.7, 'DCEFE3', 'ds' + i); txt(s, p[1], { x: 5.35, y: y + 0.04, w: 4.0, h: 0.62, fontSize: 12.5, valign: 'middle', bold: true }); });
txt(s, 'Verified: mass, element and energy balances close; results checked against Perry\u2019s Handbook and chemical equilibrium; final run has 0 errors.', { x: 0.5, y: 4.7, w: 9.0, h: 0.45, fontSize: 12.5, bold: true, color: C.accent1 });

// ================= Results
section('3  Results per unit', 'Digester, membrane and pyrolysis');
s = slide('Digester: biogas with 59 % methane');
stat(s, 0.6, 1.2, 2.8, '2.36 kmol/h', 'biogas to upgrading (about 53 Nm³/h)');
stat(s, 3.5, 1.2, 2.8, '59.4 % CH₄', '40.3 % CO₂, 0.3 % H₂ (dry)');
stat(s, 6.4, 1.2, 3.1, '0.24 m³/kg', 'CH₄ per kg COD fed (Perry max 0.35)');
const dg = [['Feed', '8.5 t/d biomass (75 % water) + 13 t/d water, 23 °C'], ['Conditions', '55 °C (thermophilic), 15 d, about 320 m³ liquid'],
  ['Methane', 'about 31 Nm³/h, 1.40 kmol/h'], ['Digestate', 'about 820 kg/h liquid at 55 °C (to fertiliser use)'], ['Heat needed', 'RSTOIC 24.7 kW (mostly heating the feed water), B1 3.5 kW']];
s.addTable(dg.map((r, i) => [{ text: r[0], options: { bold: true, fill: { color: HEX.light } } }, { text: r[1] }]),
  { x: 0.6, y: 2.65, w: 8.9, colW: [1.8, 7.1], fontSize: 13, color: HEX.text, border: { type: 'solid', pt: 0.5, color: 'D5DDD8' }, rowH: 0.4 });
txt(s, [{ text: 'COD', options: { bold: true } }, { text: ' (chemical oxygen demand) = a measure of the organic content of the feed.' }], { x: 0.6, y: 4.8, w: 8.9, h: 0.3, fontSize: 11.5 });

s = slide('Upgrading: membrane lifts CH₄ from 59 % to 76 %');
s.addChart(pres.charts.BAR, [{ name: 'CH₄', labels: ['Feed (10 bar)', 'Retentate (10 bar)', 'Permeate (1 bar)'], values: [59.4, 76.4, 7.0] },
  { name: 'CO₂', labels: ['Feed (10 bar)', 'Retentate (10 bar)', 'Permeate (1 bar)'], values: [40.3, 23.4, 92.2] }],
  Object.assign({ x: 0.4, y: 1.05, w: 5.4, h: 3.9, barDir: 'col', barGrouping: 'stacked', chartColors: [HEX.green, HEX.grey], showValue: true, dataLabelPosition: 'ctr', dataLabelColor: 'FFFFFF',
    showLegend: true, legendPos: 'b', legendFontSize: 11, showTitle: true, title: 'Composition, mol %', valAxisMaxVal: 100 }, AX, { dataLabelColor: 'FFFFFF' }));
stat(s, 6.1, 1.15, 3.4, '97.1 %', 'of the CH₄ kept for pyrolysis');
stat(s, 6.1, 2.35, 3.4, '56.3 %', 'of the CO₂ removed (permeate)');
stat(s, 6.1, 3.55, 3.4, '5.7 kW', 'compression, 1 → 10 bar', HEX.blue);

s = slide('Pyrolysis: hydrogen and solid carbon');
stat(s, 0.6, 1.15, 2.8, '4.46 kg/h', 'H₂ (2.21 kmol/h, about 107 kg/day)');
stat(s, 3.5, 1.15, 2.8, '15.4 kg/h', 'solid carbon (by-product)');
stat(s, 6.4, 1.15, 3.1, '94 %', 'CH₄ converted (equilibrium, 790 °C)', HEX.orange);
s.addChart(pres.charts.DOUGHNUT, [{ name: 'Product gas', labels: ['H₂', 'CO', 'H₂O', 'CH₄', 'CO₂'], values: [72.3, 11.5, 11.5, 2.6, 2.1] }],
  Object.assign({ x: 0.5, y: 2.45, w: 3.6, h: 2.65, chartColors: [HEX.green, HEX.orange, HEX.blue, HEX.grey, HEX.text], showPercent: true, showLegend: true, legendPos: 'r', legendFontSize: 11, holeSize: 55,
    showTitle: true, title: 'Product gas, mol %', dataLabelColor: 'FFFFFF' }, AX, { dataLabelColor: 'FFFFFF' }));
txt(s, bullets(['Reactions: CH₄ ⇌ C(s) + 2 H₂ and CO₂ + H₂ ⇌ CO + H₂O', 'The 23 % CO₂ left after the membrane uses up about 13 % of the possible H₂ and makes CO', 'Both reactions are reversible and reach equilibrium at 790 °C (NIST-JANAF data; Perry’s agrees)', 'Heat: preheat 20.4 kW + reactor 35.4 kW'], 13),
  { x: 4.4, y: 2.5, w: 5.1, h: 2.6 });

s = slide('Key streams');
const sr = [['Stream', 'Flow (kmol/h)', 'T (°C)', 'P (bar)', 'CH₄ %', 'CO₂ %', 'H₂ %'],
  ['Biogas to membrane (GAS2C)', '2.358', '30', '10', '59.4', '40.3', '0.3'], ['Retentate (RET)', '1.779', '30', '10', '76.4', '23.4', '0.2'],
  ['Permeate (PER)', '0.580', '30', '1', '7.0', '92.2', '0.6'], ['Pyrolysis feed (PYROIN)', '1.779', '790', '1', '76.4', '23.4', '0.2'],
  ['Product gas (FINPROD)', '3.058 + 1.279 C(s)', '790', '1', '2.6', '2.1', '72.3']];
s.addTable(sr.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: i === 0, align: j ? 'center' : 'left', color: i === 0 ? 'FFFFFF' : HEX.text, fill: { color: i === 0 ? HEX.green : (i % 2 ? 'FFFFFF' : HEX.light) } } }))),
  { x: 0.5, y: 1.15, w: 9.0, colW: [2.75, 1.75, 0.8, 0.8, 0.95, 0.95, 1.0], fontSize: 13, border: { type: 'solid', pt: 0.5, color: 'D5DDD8' }, rowH: 0.45, valign: 'middle' });
txt(s, 'Product gas also holds about 11.5 % CO and 11.5 % H₂O (wet basis).', { x: 0.5, y: 4.0, w: 9.0, h: 0.35, fontSize: 13, color: HEX.mid });

// ================= Balances
section('4  Material and energy balance', 'Which unit uses the most energy, and how to cut it');
s = slide('Material balance closes (kg/h)');
const mb = [['In', 'kg/h', 'Out', 'kg/h'], ['Biomass (wet)', '354.2', 'Digestate (LIQUID)', '821.1'], ['Process water', '541.7', 'Flash water, NH₃, H₂S purges', '10.4'],
  ['', '', 'Membrane permeate (mostly CO₂)', '24.2'], ['', '', 'Product gas (H₂ 4.46, CO 9.9, H₂O 6.3, CH₄ 1.3, CO₂ 2.8)', '24.7'], ['', '', 'Solid carbon', '15.4'],
  ['Total in', '895.8', 'Total out', '895.8']];
s.addTable(mb.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: i === 0 || i === mb.length - 1, align: j % 2 ? 'right' : 'left', color: i === 0 ? 'FFFFFF' : HEX.text, fill: { color: i === 0 ? HEX.green : (i === mb.length - 1 ? HEX.light : 'FFFFFF') } } }))),
  { x: 0.5, y: 1.15, w: 9.0, colW: [2.2, 1.0, 4.6, 1.2], fontSize: 13, border: { type: 'solid', pt: 0.5, color: 'D5DDD8' }, rowH: 0.42, valign: 'middle' });
txt(s, 'About 92 % of the mass leaves as digestate: the process is mostly water.', { x: 0.5, y: 4.3, w: 9.0, h: 0.4, fontSize: 14, bold: true, color: C.accent1 });

s = slide('Energy: pyrolysis takes two-thirds of the heat');
s.addChart(pres.charts.BAR, [{ name: 'kW', labels: ['CH4PYRO reactor', 'RSTOIC (feed heating)', 'HEAT2 preheat', 'B1 digester', 'Compressors (power)'], values: [35.4, 24.7, 20.4, 3.5, 5.7] }],
  Object.assign({ x: 0.4, y: 1.05, w: 5.6, h: 3.95, barDir: 'bar', chartColors: [HEX.orange, HEX.green, HEX.orange, HEX.green, HEX.blue], showValue: true, dataLabelPosition: 'outEnd', showLegend: false,
    showTitle: true, title: 'Energy input by unit (kW)', catAxisOrientation: 'maxMin', dataLabelFormatCode: '0.0' }, AX));
stat(s, 6.3, 1.15, 3.2, '84 kW heat', '+ 5.7 kW electricity');
stat(s, 6.3, 2.3, 3.2, '66 %', 'of heat goes to 790 °C pyrolysis', HEX.orange);
stat(s, 6.3, 3.45, 3.2, '18.9 kWh', 'heat per kg H₂ (+ 1.28 kWh power)');
source(s, 'Cooling duties (about 11 kW) not shown.');

s = slide('Cutting the energy demand: heat integration');
s.addChart(pres.charts.BAR, [{ name: 'Low-temperature heat (digester)', labels: ['Now', 'Heat-integrated'], values: [28.2, 4.4] },
  { name: 'High-temperature heat (790 °C)', labels: ['Now', 'Heat-integrated'], values: [55.9, 15.3] }],
  Object.assign({ x: 0.4, y: 1.05, w: 4.4, h: 3.95, barDir: 'col', barGrouping: 'stacked', chartColors: [HEX.green, HEX.orange], showValue: true, dataLabelPosition: 'ctr', showLegend: true, legendPos: 'b', legendFontSize: 10,
    showTitle: true, title: 'External heat needed (kW)', dataLabelFormatCode: '0.0' }, AX, { dataLabelColor: 'FFFFFF' }));
const opts = [['Digestate 55 → 30 °C preheats the feed', 'about 24 kW'], ['Hot product (790 °C) preheats pyrolysis feed (economiser)', 'about 18 kW'],
  ['Burn the CO in the product gas for 790 °C heat', 'about 22 kW'], ['Expander on the 10 → 1 bar letdown', 'about 1.7 kW power']];
opts.forEach((o, i) => { const y = 1.15 + i * 0.85; card(s, 5.1, y, 4.4, 0.72, HEX.light, 'opt' + i);
  txt(s, o[0], { x: 5.25, y: y + 0.06, w: 2.95, h: 0.6, fontSize: 12.5, valign: 'middle' });
  txt(s, o[1], { x: 8.2, y: y + 0.06, w: 1.2, h: 0.6, fontSize: 13, bold: true, valign: 'middle', color: C.accent1, align: 'right' }); });
txt(s, 'External heat 84 → 20 kW (−77 %). Screening estimate; pinch analysis in BTP‑2.', { x: 5.1, y: 4.6, w: 4.4, h: 0.5, fontSize: 12.5, bold: true, color: C.accent1 });

// ================= Exergy and CO2
section('5  Exergy and CO₂ emissions', 'Where useful energy is destroyed; Scope 1 + 2 emissions');
s = slide('Exergy destroyed per unit: the digester dominates');
const exu = [['RSTOIC', 39.1], ['B1 digester', 22.5], ['CH4PYRO', 6.3], ['HEAT2', 4.6], ['FLASH3 letdown', 2.8], ['Compressors', 1.1], ['Coolers', 0.9], ['MEMB1', 0.6], ['Other', 0.3]];
s.addChart(pres.charts.BAR, [{ name: 'kW', labels: exu.map(e => e[0]), values: exu.map(e => e[1]) }],
  Object.assign({ x: 0.4, y: 1.05, w: 5.6, h: 3.95, barDir: 'bar', chartColors: [HEX.green, HEX.green, HEX.orange, HEX.orange, HEX.grey, HEX.blue, HEX.blue, HEX.blue, HEX.grey], showValue: true, dataLabelPosition: 'outEnd',
    showLegend: false, showTitle: true, title: 'Exergy destroyed (kW), total 78 kW', catAxisOrientation: 'maxMin', dataLabelFormatCode: '0.0' }, AX));
txt(s, [{ text: 'Exergy', options: { bold: true } }, { text: ' = the useful part of energy that can still do work. Destroyed exergy is lost forever.', options: { breakLine: true } }, { text: 'Calculated from Aspen enthalpy and entropy plus standard chemical exergies (Szargut), T\u2080 = 25\u00a0\u00b0C.', options: { fontSize: 11, color: HEX.mid } }],
  { x: 6.3, y: 1.1, w: 3.2, h: 1.55, fontSize: 12.5 });
stat(s, 6.3, 2.75, 3.2, '79 %', 'destroyed in hydrolysis + digestion');
stat(s, 6.3, 3.85, 3.2, '2.8 kW', 'wasted in the 10 → 1 bar letdown', HEX.grey);
source(s, 'The energy balance of every unit matches the Aspen duties within 0.1 % (pyrolysis reactor 0.4 %).');

s = slide('Whole process: where the exergy goes');
s.addChart(pres.charts.BAR, [{ name: 'Product (H₂, C, CO, heat)', labels: ['Exergy out'], values: [348] }, { name: 'Lost: digestate', labels: ['Exergy out'], values: [191] },
  { name: 'Lost: permeate and purges', labels: ['Exergy out'], values: [30] }, { name: 'Destroyed in units', labels: ['Exergy out'], values: [78] }],
  Object.assign({ x: 0.4, y: 1.05, w: 4.6, h: 3.95, barDir: 'bar', barGrouping: 'stacked', chartColors: [HEX.green, HEX.orange, HEX.grey, HEX.red], showValue: true, dataLabelPosition: 'ctr',
    showLegend: true, legendPos: 'b', legendFontSize: 10, showTitle: true, title: 'Exergy in = 647 kW', valAxisMaxVal: 650, valAxisMinVal: 0 }, AX, { dataLabelColor: 'FFFFFF' }));
stat(s, 5.3, 1.15, 2.1, '22 %', 'exergy efficiency, H₂ only');
stat(s, 7.5, 1.15, 2.0, '45 %', 'H₂ + solid carbon');
txt(s, bullets(['Inputs: biomass 585, heat 48, water 8, electricity 5.7 kW', 'The digestate carries out 191 kW (about 30 % of the input): undigested organics and warm water', 'The hot product leaves with about 25 kW of heat (12 kW exergy)'], 13),
  { x: 5.3, y: 2.5, w: 4.2, h: 2.5 });

s = slide('Problems found and what BTP‑2 will solve');
const probs = [['Hot product at 790 °C is not used', 'Economiser: preheat the pyrolysis feed'], ['Feed heated to 55 °C with fresh heat; digestate leaves warm', 'Digestate–feed heat exchanger'],
  ['Fired heat at 790 °C (fuel, CO₂)', 'Burn the CO off-gas; energy analysis + pinch'], ['Compression energy thrown away at the letdown', 'Expander or use pressure downstream']];
txt(s, 'Problem', { x: 0.5, y: 1.0, w: 4.3, h: 0.3, bold: true, fontSize: 12, color: HEX.mid });
txt(s, 'BTP‑2 solution', { x: 5.2, y: 1.0, w: 4.3, h: 0.3, bold: true, fontSize: 12, color: HEX.mid });
probs.forEach((p, i) => { const y = 1.35 + i * 0.88;
  card(s, 0.5, y, 4.3, 0.74, 'F8E3E5', 'pb' + i); txt(s, p[0], { x: 0.65, y: y + 0.05, w: 4.0, h: 0.64, fontSize: 13, valign: 'middle' });
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 4.88, y: y + 0.24, w: 0.25, h: 0.26, fill: { color: HEX.mid }, line: { color: HEX.mid } });
  card(s, 5.2, y, 4.3, 0.74, 'DCEFE3', 'sl' + i); txt(s, p[1], { x: 5.35, y: y + 0.05, w: 4.0, h: 0.64, fontSize: 13, valign: 'middle', bold: true }); });
txt(s, 'Main BTP‑2 focus: economiser + energy analysis', { x: 0.5, y: 4.9, w: 9.0, h: 0.35, fontSize: 14, bold: true, color: C.accent1 });

s = slide('CO₂ emissions, Scope 1 + 2 (kg CO₂e per kg H₂)');
s.addChart(pres.charts.BAR, [{ name: 'India grid', labels: ['Natural gas heat', 'Electric heat', 'Heat-integrated'], values: [5.60, 14.73, 2.10] },
  { name: 'Coal power', labels: ['Natural gas heat', 'Electric heat', 'Heat-integrated'], values: [5.90, 19.47, 2.40] },
  { name: 'Hydro / solar', labels: ['Natural gas heat', 'Electric heat', 'Heat-integrated'], values: [4.67, 0.08, 1.17] }],
  Object.assign({ x: 0.4, y: 1.05, w: 5.8, h: 3.95, barDir: 'col', chartColors: [HEX.grey, HEX.text, HEX.moss], showValue: true, dataLabelPosition: 'outEnd', showLegend: true, legendPos: 'b', legendFontSize: 11,
    showTitle: true, title: 'Electricity source', dataLabelFontSize: 9, dataLabelFormatCode: '0.0' }, AX));
txt(s, bullets(['Scope 1 = on-site emissions: fuel burned for heat, CH₄ slip (flared)', 'Scope 2 = emissions from bought electricity (India grid 0.727 kg/kWh)', 'Base case 5.6; green limit 2.0', 'Heat-integrated: 2.1 on grid power, at the limit; 1.2 with solar power'], 12.5),
  { x: 6.4, y: 1.15, w: 3.1, h: 3.9 });
source(s, 'Biogenic CO₂ reported separately (GHG Protocol). Scope 3 not yet included.');

s = slide('CO₂: what the numbers say');
const msgs = [['Heat is the main source', 'Natural gas for heat gives 4.6 of the 5.6 kg per kg H₂'], ['Electric heating needs clean power', 'On the grid it gives 14.7; with hydro or solar about 0'],
  ['Never vent the permeate', 'Its 0.66 kg/h of CH₄ would add 4.0 kg per kg H₂; flare or recycle it'], ['Capture the permeate CO₂', '23.5 kg/h of biogenic CO₂: target for the absorption column (amine)']];
msgs.forEach((m, i) => { const x = 0.5 + (i % 2) * 4.6, y = 1.15 + Math.floor(i / 2) * 1.85;
  card(s, x, y, 4.4, 1.6, HEX.light, 'msg' + i);
  txt(s, m[0], { x: x + 0.2, y: y + 0.15, w: 4.0, h: 0.45, bold: true, fontSize: 16, color: C.accent1 });
  txt(s, m[1], { x: x + 0.2, y: y + 0.65, w: 4.0, h: 0.85, fontSize: 13.5 }); });

// ================= Sensitivity and models
section('6  Sensitivity and models', 'Pressure vs separation, membrane models, other units');
s = slide('Sensitivity: feed pressure vs separation');
s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 5.6, h: 3.9, fill: { color: 'F7F9F8' }, line: { color: HEX.grey, width: 1, dashType: 'dash' } });
txt(s, '[Aspen sensitivity plot to be added]\nCH₄ purity and recovery, compressor power vs feed pressure', { x: 0.7, y: 2.6, w: 5.2, h: 0.9, align: 'center', valign: 'middle', fontSize: 14, color: HEX.mid, italic: true });
card(s, 6.4, 1.1, 3.1, 1.5, HEX.green, 'sensres');
txt(s, 'Result: the current design (10 bar feed, 1 bar permeate, 5 m²) is near optimal', { x: 6.55, y: 1.2, w: 2.8, h: 1.3, fontSize: 14, bold: true, color: 'FFFFFF', valign: 'middle' });
txt(s, bullets(['Lower pressure saves compression power', 'But less CO₂ is removed, so more H₂ is lost to CO₂ + H₂ → CO + H₂O', 'Cost of pressure to be weighed in BTP‑2'], 12.5), { x: 6.4, y: 2.8, w: 3.1, h: 2.2 });

s = slide('Zeolite membrane models compared');
const mm = [['', '1. Constant permeance (used now)', '2. Adsorption–diffusion (Maxwell–Stefan)', '3. Activated diffusion (molecular sieving)'],
  ['Idea', 'Flux = permeance × partial-pressure difference', 'Gases adsorb in pores, then diffuse; CO₂ blocks CH₄', 'Permeance rises with temperature (Arrhenius)'],
  ['Needs', 'One permeance per gas', 'Adsorption isotherms + diffusivities per gas', 'Permeance + activation energy per gas'],
  ['Captures', 'Basic separation; simple, robust', 'Mixture and pressure effects', 'Temperature effect'],
  ['Difficulty', 'Ignores pressure and mixture effects; data at 2 bar used at 10 bar', 'Many parameters; stiff equations; hard to converge in ACM', 'Activation energies for DDR hard to find; no mixture effect']];
s.addTable(mm.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: i === 0 || j === 0, color: i === 0 ? 'FFFFFF' : HEX.text, fill: { color: i === 0 ? (j === 1 ? HEX.orange : HEX.green) : (j === 0 ? HEX.light : 'FFFFFF') } } }))),
  { x: 0.5, y: 1.05, w: 9.0, colW: [1.2, 2.6, 2.6, 2.6], rowH: [0.55, 0.7, 0.6, 0.55, 0.75], fontSize: 12, border: { type: 'solid', pt: 0.5, color: 'D5DDD8' }, valign: 'middle' });
txt(s, 'Difficulties I faced in ACM: wrong component IDs, mass not conserved (+504 %), no energy equations, hard-coded split. All fixed in the current model.', { x: 0.5, y: 4.45, w: 9.0, h: 0.55, fontSize: 12.5, color: HEX.mid });

s = slide('Other units: what is modelled and what is simplified');
const ou = [['Digester', 'ADM1-style Monod kinetics with inhibition, 10 calculator blocks, recycle (tear) loop', 'pH fixed at 6.5–7; no electrolyte chemistry'],
  ['Hydrolysis', '13 reactions in series, fixed conversions', 'Conversions not yet from a source'],
  ['Gas cleanup', 'Flash + component splitters', 'Ideal removal of H₂S, NH₃, water'],
  ['Pyrolysis', 'Plug-flow reactor, power-law kinetics on catalyst mass', 'Reversible, at equilibrium; no Boudouard reaction; only 24.7 kg catalyst']];
txt(s, 'Unit', { x: 0.5, y: 1.0, w: 1.6, h: 0.3, bold: true, fontSize: 12, color: HEX.mid });
txt(s, 'Modelled as', { x: 2.2, y: 1.0, w: 4.0, h: 0.3, bold: true, fontSize: 12, color: HEX.mid });
txt(s, 'Simplification', { x: 6.3, y: 1.0, w: 3.2, h: 0.3, bold: true, fontSize: 12, color: HEX.mid });
ou.forEach((o, i) => { const y = 1.35 + i * 0.9; card(s, 0.5, y, 9.0, 0.78, i % 2 ? 'FFFFFF' : HEX.light, 'ou' + i);
  txt(s, o[0], { x: 0.65, y: y + 0.05, w: 1.5, h: 0.68, bold: true, fontSize: 14, valign: 'middle', color: C.accent1 });
  txt(s, o[1], { x: 2.2, y: y + 0.05, w: 4.0, h: 0.68, fontSize: 12.5, valign: 'middle' });
  txt(s, o[2], { x: 6.3, y: y + 0.05, w: 3.1, h: 0.68, fontSize: 12.5, valign: 'middle', color: HEX.red }); });

s = slide('Conclusions and next steps');
txt(s, 'Conclusions', { x: 0.5, y: 1.05, w: 4.3, h: 0.4, bold: true, fontSize: 18, color: C.accent1 });
txt(s, bullets(['Custom zeolite membrane module built in ACM and integrated into Aspen Plus', 'Working, verified model: 8.5 t/d waste → 4.46 kg/h H₂ + 15.4 kg/h carbon', 'Membrane at 10 bar: 76 % CH₄, 97 % recovery; near optimal', 'Pyrolysis section uses 66 % of the heat; digester 79 % of exergy destroyed', 'Heat integration could cut external heat by about 77 % and CO₂ to about 2.1 kg/kg H₂'], 13),
  { x: 0.5, y: 1.5, w: 4.3, h: 3.5 });
card(s, 5.1, 1.05, 4.4, 4.0, HEX.light, 'next');
txt(s, 'Next (BTP‑2)', { x: 5.3, y: 1.15, w: 4.0, h: 0.4, bold: true, fontSize: 18, color: C.accent1 });
txt(s, bullets(['Economiser and energy analysis; pinch analysis, then optimisation', 'CO₂ absorption column (amine) on the permeate', 'CO₂ methanation as an alternative to the membrane', 'Cost of electricity source: coal/hydro vs solar', 'More sensitivities: pyrolysis temperature, dilution water', 'Scope 3 emissions'], 13),
  { x: 5.3, y: 1.6, w: 4.0, h: 3.35 });

s = slide('References');
const refs = ['Batstone D.J. et al. (2002). Anaerobic Digestion Model No. 1 (ADM1). IWA Scientific and Technical Report No. 13.',
  'Perry R.H., Green D.W. (eds.). Perry’s Chemical Engineers’ Handbook, 8th ed. McGraw-Hill.',
  'Yang S., Cao Z., Arvanitis A., Sun X., Xu Z., Dong J. (2016). DDR-type zeolite membrane synthesis, modification and gas permeation studies. Journal of Membrane Science 505, 194–204.',
  'Szargut J., Morris D.R., Steward F.R. (1988). Exergy Analysis of Thermal, Chemical and Metallurgical Processes. Hemisphere.',
  'Smith J.M., Van Ness H.C., Abbott M.M. Introduction to Chemical Engineering Thermodynamics (heat-capacity data).',
  'IPCC (2006). Guidelines for National GHG Inventories, Vol. 2, Table 2.2. IPCC AR6 WG1 (2021), Table 7.15. IPCC AR5 WGIII Annex III.',
  'Central Electricity Authority (2024). CO₂ Baseline Database for the Indian Power Sector, Version 20.0.',
  'MNRE (2023). Green Hydrogen Standard for India. WRI/WBCSD GHG Protocol: Corporate Standard and Scope 2 Guidance.',
  'International Energy Agency (2023). Global Hydrogen Review 2023. IEA, Paris.'];
txt(s, refs.map((r, i) => ({ text: r, options: { bullet: { type: 'number' }, breakLine: i < refs.length - 1, paraSpaceAfter: 4, fontSize: 11.5 } })), { x: 0.5, y: 1.05, w: 9.0, h: 4.1 });

(async () => { await pres.writeFile({ fileName: OUT }); await applyTheme(OUT, THEME); console.log('saved', OUT); })();
