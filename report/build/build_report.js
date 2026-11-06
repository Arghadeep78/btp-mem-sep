// BTP-1 report (Word)
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ShadingType,
  ImageRun, PageBreak, LevelFormat, Footer, PageNumber, BorderStyle, TabStopType } = require('docx');
const OUT = process.argv[2] || 'BTP1_report.docx';
const FIG = n => fs.readFileSync(`fig/${n}.png`);
const GREEN = '2D6A4F', LIGHT = 'EEF3EF', TXT = '1E2B26';

// ---------- helpers
const runs = (t, base = {}) => {
  // tiny markup: **bold** (may contain sub/sup), _{sub}, ^{sup}
  const out = []; const re = /(\*\*[^*]+\*\*|_\{[^}]+\}|\^\{[^}]+\})/g; let last = 0, m;
  while ((m = re.exec(t))) {
    if (m.index > last) out.push(new TextRun(Object.assign({ text: t.slice(last, m.index) }, base)));
    const s = m[0];
    if (s.startsWith('**')) out.push(...runs(s.slice(2, -2), Object.assign({}, base, { bold: true })));
    else if (s.startsWith('_')) out.push(new TextRun(Object.assign({ text: s.slice(2, -1), subScript: true }, base)));
    else out.push(new TextRun(Object.assign({ text: s.slice(2, -1), superScript: true }, base)));
    last = m.index + s.length;
  }
  if (last < t.length) out.push(new TextRun(Object.assign({ text: t.slice(last) }, base)));
  return out;
};
const P = (t, o = {}) => new Paragraph(Object.assign({ children: runs(t), spacing: { after: 120, line: 276 }, alignment: AlignmentType.JUSTIFIED }, o));
const H1 = t => new Paragraph({ text: t, heading: HeadingLevel.HEADING_1, pageBreakBefore: true });
const H1n = t => new Paragraph({ text: t, heading: HeadingLevel.HEADING_1 });
const H2 = t => new Paragraph({ text: t, heading: HeadingLevel.HEADING_2 });
const B = (t, lvl = 0) => new Paragraph({ children: runs(t), numbering: { reference: 'bul', level: lvl }, spacing: { after: 60, line: 276 } });
const N = t => new Paragraph({ children: runs(t), numbering: { reference: 'num', level: 0 }, spacing: { after: 60, line: 276 } });
const EQ = t => new Paragraph({ children: runs(t).map(r => r), alignment: AlignmentType.CENTER, spacing: { before: 80, after: 120 } });
let figN = 0, tabN = 0;
const FIGURE = (name, w, h, cap) => [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, children: [new ImageRun({ type: 'png', data: FIG(name), transformation: { width: w, height: h } })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: `Figure ${++figN}. `, bold: true, size: 20 }), ...runs(cap).map(r => r)] })];
const CAPT = cap => new Paragraph({ spacing: { before: 160, after: 80 }, keepNext: true, children: [new TextRun({ text: `Table ${++tabN}. `, bold: true, size: 20 }), ...runs(cap)] });
const border = { style: BorderStyle.SINGLE, size: 4, color: 'C9D3CD' };
function TABLE(rows, widths, opts = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({ width: { size: total, type: WidthType.DXA }, columnWidths: widths,
    rows: rows.map((r, i) => new TableRow({ tableHeader: i === 0, cantSplit: true, children: r.map((c, j) => new TableCell({
      width: { size: widths[j], type: WidthType.DXA },
      borders: { top: border, bottom: border, left: border, right: border },
      shading: i === 0 ? { type: ShadingType.CLEAR, color: 'auto', fill: GREEN } : (opts.zebra && i % 2 === 0 ? { type: ShadingType.CLEAR, color: 'auto', fill: LIGHT } : undefined),
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ keepNext: i < rows.length - 1, alignment: (opts.align && opts.align[j]) || AlignmentType.LEFT,
        children: (i === 0 ? [new TextRun({ text: c, bold: true, color: 'FFFFFF', size: 20 })] : runs(String(c)).map(x => x)) })] })) })) });
}
const TBL = (...a) => [TABLE(...a), SP()];
const SP = () => new Paragraph({ text: '', spacing: { after: 60 } });
const R_ = AlignmentType.RIGHT, C_ = AlignmentType.CENTER;

// ---------- content
const body = [];
// Title page
body.push(new Paragraph({ spacing: { before: 2400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Green Hydrogen from Organic Waste:', bold: true, size: 44, color: GREEN, font: 'Cambria' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: 'Biogas Upgrading with a Zeolite Membrane and Catalytic Methane Pyrolysis', bold: true, size: 32, color: GREEN, font: 'Cambria' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'BTP-1 2026 Report', size: 28 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: 'Arghadeep Ghosh', size: 26, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: '23CH3FP53', size: 24, bold: true  })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1600 }, children: [new TextRun({ text: 'Process simulation in Aspen Plus V14 and Aspen Custom Modeler', size: 22, italics: true, color: '5E6B66' })] }));

body.push(H1('Abstract'));
body.push(P('Wet organic waste is mostly landfilled, where it releases methane and its energy is lost. This work designs and analyses a process that converts such waste into hydrogen. Biogas from thermophilic anaerobic digestion is cleaned, compressed and upgraded in a DDR zeolite membrane, and the methane-rich retentate is cracked at 790 °C over a catalyst into hydrogen and solid carbon. The process was simulated in Aspen Plus V14; a key part of the work is a **custom membrane module developed in Aspen Custom Modeler (ACM)** and integrated into the flowsheet. The developed and verified model converts 8.5 t/d of wet biomass into **4.46 kg/h of H_{2}** and **15.4 kg/h of solid carbon**. The membrane raises methane from 59.4 % to 76.4 % with 97.1 % methane recovery.'));
body.push(P('The process needs 84.1 kW of heat and 5.7 kW of electricity, which is 18.9 kWh of heat and 1.28 kWh of electricity per kg of H_{2}. Two-thirds of the heat goes to the 790 °C pyrolysis section. An exergy analysis shows that 78 kW of exergy is destroyed, 79 % of it in hydrolysis and digestion, and that the digestate carries about 30 % of the input exergy out of the process. The exergy efficiency is 22 % for H_{2} alone and 45 % for H_{2} plus solid carbon. Scope 1 + 2 emissions are 5.6 kg CO_{2}e per kg H_{2} with natural-gas heating and grid electricity. A screening heat-integration case (digestate heat recovery, a product economiser and use of the CO off-gas as fuel) cuts external heat by about 77 % and emissions to about 2.1 kg CO_{2}e per kg H_{2}, at the 2 kg limit of the India Green Hydrogen Standard (1.2 with solar electricity). These results define the BTP-2 work: an economiser and energy analysis, followed by pinch analysis and optimisation.'));

body.push(H1n('Contents'));
['1  Introduction', '2  Process description and simulation model', '3  Results per unit', '4  Material and energy balance', '5  Exergy analysis', '6  CO2 emissions (Scope 1 + 2)',
 '7  Sensitivity: feed pressure vs separation', '8  Membrane models for zeolite membranes', '9  Limitations', '10  Conclusions and future work (BTP-2)', 'References', 'Appendix A: Assumptions', 'Appendix B: Sources']
  .forEach(t => body.push(new Paragraph({ children: [new TextRun(t.replace('CO2', 'CO₂'))], spacing: { after: 60 } })));

// 1 Introduction
body.push(H1('1  Introduction'));
body.push(H2('1.1  Organic waste and conventional routes'));
body.push(P('Large amounts of wet organic waste (food and market waste, agricultural residues, animal manure) are produced every day. The conventional routes handle this waste poorly from an energy and climate point of view:'));
body.push(B('**Landfill:** organic matter decomposes without air and releases methane, a strong greenhouse gas, together with leachate. Its energy is lost.'));
body.push(B('**Open burning:** releases CO_{2} and air pollutants and recovers no energy.'));
body.push(B('**Composting:** recovers nutrients but not energy.'));
body.push(B('**Incineration:** recovers some heat or power, but wet waste burns poorly.'));
body.push(P('**Anaerobic digestion** instead converts wet waste into biogas (about 60 % CH_{4} and 40 % CO_{2}) under controlled conditions, so the methane is captured rather than released, and the digestate can be used as fertiliser. This work takes the next step: upgrading the biogas and turning its methane into hydrogen.'));
body.push(H2('1.2  Routes to hydrogen'));
body.push(P('Most hydrogen today is made by steam reforming of natural gas ("grey" hydrogen), which emits about 10–12 kg CO_{2}e per kg H_{2} [9]. Alternatives include reforming with CO_{2} capture ("blue"), water electrolysis with renewable power ("green") and methane pyrolysis ("turquoise"), in which methane is split into hydrogen and solid carbon without forming CO_{2}:'));
body.push(EQ('CH_{4} → C(s) + 2 H_{2}        ΔH°_{298} = +74.8 kJ/mol'));
body.push(P('When the methane comes from biogas, the carbon is biogenic. Storing it as solid carbon can make the route carbon-negative. India’s Green Hydrogen Standard sets a limit of 2 kg CO_{2}e per kg H_{2} (well-to-gate) for hydrogen to count as green [8].'));
body.push(H2('1.3  Problem statement and objectives'));
body.push(P('**Problem statement.** Wet organic waste is mostly landfilled, where it releases methane and its energy is lost. This project designs and analyses an integrated process that converts wet organic waste into hydrogen and solid carbon, through anaerobic digestion, zeolite-membrane biogas upgrading and catalytic methane pyrolysis, and identifies where its energy use, exergy losses and CO_{2} emissions can be reduced.'));
body.push(P('The goals are to produce hydrogen from a greener source, reduce CO_{2} emissions, use the excess heat of the process and minimise its overall energy use. The objectives of BTP-1 are to:'));
['Develop and verify an Aspen Plus model of the integrated process, including a custom membrane model;', 'Report the results of each unit and the integrated material and energy balance, and identify the largest energy users;',
 'Carry out an exergy analysis of each unit and the whole process;', 'Estimate Scope 1 + 2 CO_{2} emissions;', 'Study the effect of membrane feed pressure on separation, and compare membrane models.'].forEach(t => body.push(N(t)));

// 2 Process
body.push(H1('2  Process description and simulation model'));
body.push(H2('2.1  Flowsheet'));
body.push(P('Figures 1 and 2 show the process (Aspen screenshots). Wet biomass (8.5 t/d, about 75 % water) is mixed with 13 t/d of process water and hydrolysed at 55 °C. The hydrolysate is digested in a continuous stirred reactor at 55 °C with a residence time of 15 days. The biogas is cooled to 25 °C to condense water, cleaned of H_{2}S and NH_{3}, compressed in two intercooled stages to 10 bar and fed to the zeolite membrane. The retentate (methane-rich) is let down to 1 bar, heated to 790 °C and cracked in a catalytic plug-flow reactor. The permeate (mostly CO_{2}) leaves the process.'));
body.push(...FIGURE('fig1a_aspen_main', 620, 150, 'Aspen Plus flowsheet, main section: hydrolysis, digestion and gas cleanup (screenshot).'));
body.push(...FIGURE('fig1b_aspen_meth', 620, 131, 'Aspen Plus flowsheet, hierarchy METH: compression (MCompr), zeolite membrane (ACM block MEMB1) and methane pyrolysis (screenshot).'));
body.push(H2('2.2  Hydrolysis and digestion'));
body.push(P('Hydrolysis is modelled in an RSTOIC block with 13 stoichiometric reactions run in series at fixed conversions: cellulose and starch to glucose, hemicellulose to acetic acid and xylose, fats to glycerol and long-chain fatty acids, proteins and keratin to amino acids and gases, and ethanol steps. The digester (RCSTR block B1) uses ADM1-style kinetics [1]: Monod substrate terms multiplied by inhibition terms for ammonia, long-chain fatty acids, acetate and hydrogen. The reactions cover acidogenesis (sugars, glycerol), acetogenesis (fatty acids and volatile fatty acids), amino-acid degradation (Stickland reactions), acetoclastic and hydrogenotrophic methanogenesis, and an equilibrium reaction for homoacetogenesis. Ten Fortran calculator blocks compute the rate constants from the reactor concentrations, and a damped Wegstein tear loop converges them.'));
body.push(H2('2.3  Gas cleanup and compression'));
body.push(P('A flash at 25 °C removes most of the water. Two component separators remove H_{2}S and all species other than CH_{4}, CO_{2}, H_{2} and CO (ideal cleanup). Two isentropic compressors (efficiency 0.75) raise the pressure from 1 to 3.2 to 10 bar, each followed by a cooler to 30 °C.'));
body.push(H2('2.4  Custom zeolite membrane module (Aspen Custom Modeler)'));
body.push(P('A central part of this work is a custom membrane module. Aspen Plus has no standard permeance-based gas-membrane block, so the membrane was written as a new model, **Zeo_real**, in Aspen Custom Modeler (ACM), exported as a model library and linked into the Aspen Plus flowsheet as block MEMB1. In the flowsheet it behaves like any other unit: it receives the feed stream with its full 62-component composition and returns the retentate and permeate streams with temperature, pressure and enthalpy.'));
body.push(...FIGURE('fig9_acm', 560, 238, 'Structure of the custom membrane module and its equations.'));
body.push(P('**Model equations.** The module is a well-mixed, single-stage membrane. For every component i in the component list, a mass balance links the feed (F, z_{i}) to the retentate (R, x_{i}) and permeate (V, y_{i}):'));
body.push(EQ('F · z_{i} = R · x_{i} + V · y_{i}'));
body.push(P('For the permeating gases (CO_{2}, H_{2} and CH_{4}) the permeate flow follows the partial-pressure flux law of Perry\u2019s Handbook (Eq. 20-85) [2]:'));
body.push(EQ('V · y_{i} = Π_{i} · A · (p_{F} · x_{i} − p_{P} · y_{i})'));
body.push(P('All other species have zero permeate flow and stay in the retentate. Both outlets leave at the feed temperature, the retentate pressure equals the feed pressure minus a pressure drop (zero here), and the permeate pressure is specified (1 bar). Molar enthalpies of both outlets are computed with Aspen\u2019s own property procedures, so the energy balance is consistent with the rest of the flowsheet.'));
body.push(P('**Inputs.** DDR zeolite permeances at 297 K [3]: CO_{2} 2.1×10^{-7}, H_{2} 1.36×10^{-7} and CH_{4} 3.03×10^{-9} mol/(m^{2}·s·Pa), giving a CO_{2}/CH_{4} selectivity of 69. The area is 5 m^{2}, the feed is at 10 bar and the permeate at 1 bar. Permeances, area and pressure drop are parameters, so the module can be reused for other membranes.'));
body.push(P('**Verification.** The module solves 193 equations and converges in 5 iterations inside the flowsheet. The mass balance closes exactly (64.3 kg/h in = 40.1 kg/h retentate + 24.2 kg/h permeate), outlet streams are electrically neutral, and an independent calculation with the same flux law reproduces the module\u2019s results.'));
body.push(H2('2.5  Methane pyrolysis'));
body.push(P('The pyrolysis reactor (RPLUG block CH4PYRO) runs isothermally at 790 °C and 1 bar with 24.7 kg of catalyst. Two power-law reactions on a catalyst-mass basis are included: methane cracking (CH_{4} → C(s) + 2 H_{2}) and the reverse water-gas shift (CO_{2} + H_{2} → CO + H_{2}O), which consumes the CO_{2} left in the retentate. Solid carbon is a conventional solid (CISOLID).'));
body.push(H2('2.6  Physical properties'));
body.push(P('The NRTL activity model is used, with Peng–Robinson as the secondary method. CO_{2}, CH_{4}, H_{2}, H_{2}S and CO are Henry components. The component list has 62 species, including sugars, fatty acids, 17 amino acids, biomass (C_{5}H_{7}NO_{2}), gases and solid carbon.'));
body.push(H2('2.7  Challenges during development and how they were solved'));
body.push(P('Several problems came up while building the model. Each was solved as follows:'));
body.push(B('**Membrane model:** Aspen Plus has no standard gas-membrane block, so a custom model was written in ACM. The first version used a component ID that did not exist, did not conserve mass, had a fixed split and no energy equations. It was rewritten from first principles; it now conserves mass and energy and converges in 5 iterations.'));
body.push(B('**Membrane driving force:** with biogas at 1 bar there was almost no pressure difference across the membrane, so CO_{2} could not permeate. Two-stage intercooled compression to 10 bar was added.'));
body.push(B('**Digester kinetics:** rates computed from inlet concentrations underestimated degradation. The calculator blocks now use reactor concentrations and are converged with a recycle (tear) loop; coding errors in the calculators and the temperature corrections were also resolved.'));
body.push(B('**Balances:** some hydrolysis and fatty-acid reactions were not mass- or element-balanced (palmitic acid had been entered with the wrong component). The stoichiometry was rebalanced.'));
body.push(B('**Hydrolysis order:** running the hydrolysis reactions in series was needed so that the ethanol and xylose steps act on the products of earlier steps.'));
body.push(B('**Properties:** Henry components were added for the dissolved gases, and inconsistent property entries were cleaned up.'));
body.push(P('The final run finishes with 0 errors and 4 minor warnings. Key results were checked against Perry’s Handbook: pH window, thermophilic temperature range, methane yield, methanogen yield and the membrane flux law [2]. The pyrolysis outlet was checked against chemical equilibrium (Section 3.3).'));

// 3 Results
body.push(H1('3  Results per unit'));
body.push(H2('3.1  Digester and biogas'));
body.push(P('The digester produces 2.36 kmol/h of dry biogas (about 53 Nm^{3}/h) containing 59.4 % CH_{4}, 40.3 % CO_{2} and 0.3 % H_{2}. This is about 31 Nm^{3}/h of methane, or 0.24 m^{3} CH_{4} per kg COD fed. Perry’s gives a theoretical maximum of 0.35 m^{3} per kg COD destroyed and a typical biogas range of 50–80 % CH_{4} [2]. About 820 kg/h of digestate leaves at 55 °C.'));
body.push(H2('3.2  Compression and membrane'));
body.push(P('Compression to 10 bar needs 5.7 kW. The membrane raises methane from 59.4 % to 76.4 % in the retentate (1.78 kmol/h, 10 bar) and removes 56.3 % of the CO_{2} into a permeate of 92 % CO_{2} (0.58 kmol/h, 1 bar). It keeps 97.1 % of the methane; the remaining 2.9 % leaves with the permeate (Figure 4).'));
body.push(...FIGURE('fig2_membrane', 400, 240, 'Composition of membrane feed, retentate and permeate (mol %).'));
body.push(H2('3.3  Pyrolysis and final product'));
body.push(P('At 790 °C the reactor reaches chemical equilibrium and 94 % of the methane is converted. The reactor produces 2.21 kmol/h of H_{2} (4.46 kg/h, about 107 kg/day) and 1.28 kmol/h of solid carbon (15.4 kg/h). The CO_{2} still in the retentate (23 %) reacts with hydrogen to CO and water (85 % of it is converted), so the product gas is about 72 % H_{2}, 11.5 % CO, 11.5 % H_{2}O, 2.6 % CH_{4} and 2.1 % CO_{2} (about 82 % H_{2} on a dry basis). This side reaction uses about 13 % of the hydrogen that could otherwise be produced.'));
body.push(P('Both reactions are modelled as reversible. Each has a reverse reaction whose rate constant is the forward rate constant divided by the equilibrium constant at 790 °C (NIST-JANAF thermochemical tables; Perry’s data give the same values within 0.5 %). The outlet therefore sits at chemical equilibrium (checked: K = 19.9 for methane cracking and 0.89 for the shift reaction). The Boudouard reaction (C + CO_{2} ⇌ 2 CO) is not included, because no rate constant has been published for this carbon.'));
body.push(H2('3.4  Key streams'));
body.push(CAPT('Key streams at the design point.'));
body.push(...TBL([['Stream', 'Flow (kmol/h)', 'T (°C)', 'P (bar)', 'CH₄ %', 'CO₂ %', 'H₂ %'],
  ['Biogas to membrane (GAS2C)', '2.358', '30', '10', '59.4', '40.3', '0.3'], ['Retentate (RET)', '1.779', '30', '10', '76.4', '23.4', '0.2'],
  ['Permeate (PER)', '0.580', '30', '1', '7.0', '92.2', '0.6'], ['Pyrolysis feed (PYROIN)', '1.779', '790', '1', '76.4', '23.4', '0.2'],
  ['Product gas (FINPROD)', '3.058 + 1.279 C(s)', '790', '1', '2.6', '2.1', '72.3']], [2900, 1700, 800, 800, 900, 900, 900], { zebra: true, align: [0, C_, C_, C_, C_, C_, C_] }));
body.push(SP());

// 4 Balances
body.push(H1('4  Material and energy balance'));
body.push(H2('4.1  Material balance'));
body.push(P('Table 2 shows the overall material balance, which closes exactly. About 92 % of the mass leaves as digestate, so the process is dominated by water.'));
body.push(CAPT('Overall material balance (kg/h).'));
body.push(...TBL([['In', 'kg/h', 'Out', 'kg/h'], ['Biomass (wet)', '354.2', 'Digestate (LIQUID)', '821.1'], ['Process water', '541.7', 'Flash water, NH₃ and H₂S purges', '10.4'],
  ['', '', 'Membrane permeate (mostly CO₂)', '24.2'], ['', '', 'Product gas (H₂ 4.46, CO 9.9, H₂O 6.3, CH₄ 1.3, CO₂ 2.8)', '24.7'], ['', '', 'Solid carbon', '15.4'],
  ['**Total in**', '**895.8**', '**Total out**', '**895.8**']], [2200, 1100, 4400, 1200], { align: [0, R_, 0, R_] }));
body.push(H2('4.2  Energy balance'));
body.push(P('The process needs 84.1 kW of heat and 5.7 kW of electricity (Figure 5). The pyrolysis section (preheat to 790 °C and the endothermic reactor) takes 55.9 kW, two-thirds of all heat. Heating the feed to 55 °C in the hydrolysis step takes 24.7 kW, mostly to warm the 13 t/d of process water. Per kg of hydrogen, the process uses 18.9 kWh of heat and 1.28 kWh of electricity. About 11 kW is removed by coolers.'));
body.push(...FIGURE('fig3_energy', 440, 230, 'Energy input by unit (kW), design point.'));
body.push(H2('4.3  Reducing the energy demand'));
body.push(P('Three heat sources in the process are currently unused: the warm digestate (55 °C), the hot product gas (790 °C, about 25 kW of sensible heat) and the CO in the product gas (27.7 kW on a lower-heating-value basis). Table 3 lists screening estimates for using them; Figure 6 shows the effect.'));
body.push(CAPT('Heat-integration options (screening estimates).'));
body.push(...TBL([['Measure', 'Saving'], ['Digestate (55 → 30 °C) preheats the digester feed', 'about 24 kW of low-temperature heat'],
  ['Hot product preheats the pyrolysis feed (economiser)', 'about 18 kW (90 % of HEAT2)'], ['Burn the CO in the product gas for the 790 °C heat', 'about 22 kW'],
  ['Expander on the 10 → 1 bar letdown', 'about 1.7 kW of power'], ['**Together**', '**external heat 84.1 → 19.8 kW (−77 %)**']], [5400, 3500], { zebra: true }));
body.push(...FIGURE('fig7_heatint', 300, 227, 'External heat demand now and with heat integration (kW).'));
body.push(P('These are first estimates with approach temperatures of 25–50 K. A pinch analysis is needed to confirm them, and the hot solid carbon must be separated from the product gas before any heat exchanger.'));

// 5 Exergy
body.push(H1('5  Exergy analysis'));
body.push(H2('5.1  Method'));
body.push(P('The dead state is T_{0} = 25 °C and P_{0} = 1.013 bar. The exergy of each stream is calculated from Aspen’s enthalpy and entropy, which are on a formation basis (elements at 25 °C and 1 atm), plus the standard chemical exergies of the elements from Szargut [4] (C 410.26, H_{2} 236.09, O_{2} 3.97, N_{2} 0.72 and S 609.6 kJ/mol):'));
body.push(EQ('Ex = F · (H − T_{0} S) + Σ_{e} n_{e} · ex°_{e}'));
body.push(P('For each unit the exergy destroyed is:'));
body.push(EQ('Ex_{D} = Σ Ex_{in} − Σ Ex_{out} + Q · (1 − T_{0}/T_{s}) + W'));
body.push(P('Heat is assumed to come from hot water at 90 °C for the digester section and from a furnace at 1000 °C for the pyrolysis section. Heat rejected to cooling water at T_{0} carries no exergy. As a check, the enthalpy change of every unit matches the Aspen duty within 0.1 % (0.4 % for the pyrolysis reactor), element balances close, and independent textbook exergy calculations for the gas streams agree within 0.12 %.'));
body.push(H2('5.2  Exergy destruction per unit'));
body.push(P('A total of 78 kW of exergy is destroyed (Figure 7). Hydrolysis (39.1 kW) and digestion (22.5 kW) account for 79 %, mostly because the biochemical reactions are inherently irreversible and because the feed is heated with fresh heat. The pyrolysis section destroys 11.0 kW (14 %), mainly through heat transfer from the furnace. The pressure letdown after the membrane destroys 2.8 kW, about half of the compressor work. Compression, membrane and gas cleanup together account for less than 4 %.'));
body.push(...FIGURE('fig4_exergy_units', 440, 257, 'Exergy destroyed per unit (kW).'));
body.push(H2('5.3  Whole-process exergy balance'));
body.push(CAPT('Whole-process exergy balance (kW).'));
body.push(...TBL([['Exergy in', 'kW', 'Exergy out', 'kW'], ['Biomass', '585.4', 'Product: H₂ 144.9, carbon 145.8, CO 26.9, heat 12.2, other gases 18.0', '347.7'],
  ['Process water', '7.8', 'Digestate (lost)', '191.0'], ['Electricity', '5.7', 'Permeate (lost)', '12.6'], ['Heat (exergy of 84.1 kW)', '47.8', 'H₂S, NH₃ and water purges (lost)', '17.1'],
  ['', '', 'Destroyed in units', '78.3'], ['**Total**', '**646.8**', '**Total**', '**646.8**']], [2300, 900, 4800, 900], { align: [0, R_, 0, R_] }));
body.push(...FIGURE('fig5_exergy_overall', 440, 176, 'Where the input exergy goes.'));
body.push(P('The exergy efficiency is **22 %** if only hydrogen is counted and **45 %** if the solid carbon is counted as a product. The largest single loss is the digestate, which carries 191 kW (about 30 % of the input) as undigested organic matter and warm water.'));
body.push(H2('5.4  Problems identified and the BTP-2 plan'));
body.push(CAPT('Problems identified by the exergy analysis and proposed solutions.'));
body.push(...TBL([['Problem', 'Proposed solution (BTP-2)'], ['Hot product at 790 °C is not used', 'Economiser: preheat the pyrolysis feed'],
  ['Feed heated to 55 °C with fresh heat while the digestate leaves warm', 'Digestate–feed heat exchanger'], ['Fired heat at 790 °C (fuel and CO₂)', 'Burn the CO off-gas; energy analysis and pinch analysis'],
  ['Compression energy lost at the 10 → 1 bar letdown', 'Expander, or use the pressure downstream']], [4400, 4500], { zebra: true }));
body.push(P('The main focus of BTP-2 will therefore be the **economiser and an energy analysis**, followed by pinch analysis and optimisation.'));

// 6 CO2
body.push(H1('6  CO₂ emissions (Scope 1 + 2)'));
body.push(H2('6.1  Boundary and method'));
body.push(P('Emissions follow the GHG Protocol [8]. **Scope 1** covers direct emissions: fuel burned on site for process heat and methane slip in the membrane permeate. **Scope 2** covers purchased electricity. Biogenic CO_{2} (the CO_{2} separated from biogas, and CO_{2} from burning biogas-derived gases) is reported separately, as the GHG Protocol requires; biogenic methane that escapes is counted in Scope 1. Scope 3 will be added later.'));
body.push(CAPT('Main inputs to the emission calculation.'));
body.push(...TBL([['Item', 'Value', 'Source'], ['Heat demand', '84.1 kW (28.2 low-T, 55.9 high-T)', 'Aspen simulation'], ['Electricity', '5.69 kW', 'Aspen simulation'],
  ['Heater efficiency', 'boiler 90 %, furnace 80 %', 'Assumption'], ['Natural gas emission factor', '56.1 kg CO₂/GJ', 'IPCC 2006, Vol. 2 [6]'],
  ['India grid', '0.727 kg CO₂/kWh (FY 2023-24)', 'CEA v20.0 [7]'], ['Coal / thermal power', '0.962 kg CO₂/kWh', 'CEA operating margin [7]'],
  ['Hydro, solar', '0 (no combustion)', 'GHG Protocol Scope 2'], ['CH₄ slip in permeate', '0.66 kg/h, flared at 98 %', 'Aspen; assumption'], ['GWP of biogenic CH₄', '27.0', 'IPCC AR6 [6]']],
  [2600, 3200, 3100], { zebra: true }));
body.push(H2('6.2  Results'));
body.push(P('Figure 9 compares three heat-supply cases (natural gas, electric heating, heat-integrated) for each electricity source.'));
body.push(...FIGURE('fig6_co2', 440, 244, 'Scope 1 + 2 emissions (kg CO₂e per kg H₂).'));
body.push(B('**Base case** (natural-gas heat, grid electricity): **5.6 kg CO_{2}e/kg H_{2}**, of which 4.6 comes from natural gas for heat.'));
body.push(B('**Electric heating** is worse on the Indian grid (14.7) or coal power (19.5), but close to zero with hydro or solar power.'));
body.push(B('**Heat-integrated case:** **2.1 kg CO_{2}e/kg H_{2}** on grid power, at the 2 kg green-hydrogen limit; about 1.2 with solar or hydro electricity.'));
body.push(B('**Permeate venting must be avoided:** venting the 0.66 kg/h of methane in the permeate instead of flaring it would add 4.0 kg CO_{2}e/kg H_{2}.'));
body.push(B('The permeate also contains 23.5 kg/h of biogenic CO_{2}. Capturing it in an absorption column (amine) is planned; together with the stored solid carbon, this could make the process net-negative.'));
body.push(P('Grey hydrogen emits about 10–12 kg CO_{2}e/kg H_{2} [9]. Even the base case is about half of that.'));

// 7 Sensitivity
body.push(H1('7  Sensitivity: feed pressure vs separation'));
body.push(P('The membrane feed pressure sets both the separation and the compression cost. A higher pressure removes more CO_{2}, which protects hydrogen from the reverse water-gas shift in the pyrolysis reactor, but needs more compressor power and stronger equipment. Perry’s notes that pressure ratios above about 6 become expensive [2].'));
body.push(...FIGURE('fig8_sensitivity', 620, 234, 'Sensitivity to the membrane feed pressure (Aspen runs; permeate 1 bar, area 5 m²): CH₄ purity and recovery (left), H₂ product and compressor power (right).'));
body.push(CAPT('Feed-pressure sensitivity (Aspen runs, all other inputs fixed).'));
body.push(...TBL([['Feed pressure (bar)', '4', '6', '8', '10', '12', '15'], ['CH₄ in retentate (%)', '64.3', '69.2', '73.2', '76.4', '79.1', '82.1'], ['CH₄ recovery (%)', '99.0', '98.4', '97.7', '97.1', '96.3', '95.2'], ['CO₂ removed (%)', '19.5', '35.9', '47.6', '56.3', '62.7', '69.7'], ['Compressor power (kW)', '3.24', '4.29', '5.07', '5.69', '6.20', '6.84'], ['H₂ product (kmol/h)', '2.075', '2.138', '2.181', '2.210', '2.228', '2.240']], [2600, 1050, 1050, 1050, 1050, 1050, 1050], { zebra: true }));
body.push(P('**Result:** 10 bar is the knee of the curve, so the current design (10 bar feed, 1 bar permeate, 5 m^{2}) is near optimal. Lowering the pressure to 6 bar saves 1.4 kW of compression but lets more CO_{2} reach the reactor, where it consumes hydrogen (−3.3 % H_{2}). Raising it to 15 bar gains only 1.4 % H_{2} for 20 % more compressor power, while methane lost to the permeate rises from 2.9 % to 4.8 % and the pressure ratio moves further above Perry’s economic limit.'));
body.push(P('**Why 10 bar.** A knee (diminishing-returns) analysis of the H_{2} output against compressor power places the knee at 8–10 bar: at 10 bar each extra kW of compression still gives about 93 g/h of H_{2}, against 39 g/h between 12 and 15 bar. A check over membrane areas of 3–10 m^{2} shows that a larger area moves the knee down to 8 bar but loses more methane to the permeate; 5 m^{2} at 10 bar is within 0.3 % of the highest H_{2} in the grid and keeps 97 % methane recovery. 10 bar with 5 m^{2} is therefore kept as the design point.'));
body.push(P('**Optimisation in BTP-2.** The knee analysis uses technical measures only. BTP-2 will optimise feed pressure, membrane area and the number of membrane stages together on cost: compressor and membrane capital (which rise with pressure and area), electricity and process heat, and the value of the methane lost in the permeate. It will also test pressure-dependent permeances, since the data used here were measured at 2 bar.'));

// 8 Membrane models
body.push(H1('8  Membrane models for zeolite membranes'));
body.push(P('Three modelling approaches are commonly used for gas permeation through zeolite membranes. Table 7 compares them and the difficulties of each.'));
body.push(CAPT('Comparison of zeolite membrane transport models.'));
body.push(...TBL([['', '1. Constant permeance (used)', '2. Adsorption–diffusion (Maxwell–Stefan)', '3. Activated diffusion'],
  ['Basis', 'Flux = permeance × partial-pressure difference', 'Gases adsorb in the pores (Langmuir), then diffuse; CO₂ hinders CH₄', 'Molecular sieving; permeance follows an Arrhenius law with temperature'],
  ['Data needed', 'One permeance per gas', 'Adsorption isotherms and Maxwell–Stefan diffusivities per gas', 'Permeance and activation energy per gas'],
  ['Captures', 'Basic separation; simple and robust', 'Mixture and pressure effects', 'Temperature effect'],
  ['Difficulties', 'Ignores pressure and mixture effects; data measured at 2 bar used at 10 bar', 'Many parameters; stiff equations; harder to converge in ACM', 'Activation energies for DDR are scarce; no mixture effect']],
  [1500, 2450, 2500, 2450]));
body.push(P('The constant-permeance model was chosen because reliable DDR permeance data are available [3] and it converges robustly inside Aspen Plus. Building it in ACM brought its own difficulties: the first version used a component ID that did not exist, did not conserve mass, had a hard-coded split and no energy equations. All of these were corrected in the current model. A Maxwell–Stefan model [5] would capture competitive adsorption of CO_{2} and CH_{4} and is a candidate for later work if isotherm data for DDR can be obtained.'));

// 9 Limitations
body.push(H1('9  Limitations'));
['Pyrolysis reactions are reversible and reach equilibrium; the Boudouard reaction (C + CO₂ ⇌ 2 CO) is not included because no rate constant is published.', 'Digester pH is fixed at 6.5–7 (no electrolyte chemistry).',
 'Hydrolysis conversions are fixed and not yet taken from a source.', 'Gas cleanup is ideal (perfect removal of water, H₂S and NH₃).',
 'The membrane is well-mixed with constant permeances (ideal gas; data at 2 bar applied at 10 bar).', 'The catalyst mass (24.7 kg) is small for the tube volume; conversion is nevertheless complete.',
 'Some amino-acid property data are placeholders; they affect only small streams.', 'Heat integration and the CO₂ heat-integrated case are screening estimates, not a pinch analysis; Scope 3 emissions are not included.']
  .forEach(t => body.push(B(t)));

// 10 Conclusions
body.push(H1('10  Conclusions and future work (BTP-2)'));
body.push(H2('Conclusions'));
['A custom zeolite membrane module was developed in Aspen Custom Modeler and integrated into the Aspen Plus flowsheet; it conserves mass and energy and converges robustly.', 'A verified Aspen Plus/ACM model converts 8.5 t/d of wet organic waste into 4.46 kg/h of H₂ and 15.4 kg/h of solid carbon.', 'The zeolite membrane at 10 bar raises methane from 59 % to 76 % with 97 % recovery; this pressure is near optimal.',
 'The 790 °C pyrolysis section needs two-thirds of the process heat; hydrolysis and digestion destroy 79 % of the exergy, and the digestate carries about 30 % of the input exergy out.',
 'Scope 1 + 2 emissions are 5.6 kg CO₂e/kg H₂ in the base case, about half of grey hydrogen, and about 2.1 with heat integration (at the 2 kg green limit; 1.2 with solar electricity).'].forEach(t => body.push(N(t)));
body.push(H2('Future work (BTP-2)'));
['Economiser and detailed energy analysis; pinch analysis, then optimisation.', 'CO₂ absorption column (amine or ethanol) on the membrane permeate to capture CO₂.',
 'CO₂ methanation as an alternative to the membrane, and comparison with the current process.', 'Cost analysis by electricity source: conventional (coal, hydro) vs solar.',
 'Further sensitivity studies: pyrolysis temperature, dilution water and digester residence time.', 'Scope 3 emissions.'].forEach(t => body.push(B(t)));

// References
body.push(H1('References'));
['Batstone D.J., Keller J., Angelidaki I., et al. (2002). Anaerobic Digestion Model No. 1 (ADM1). IWA Scientific and Technical Report No. 13. IWA Publishing.',
 'Green D.W., Perry R.H. (eds.) (2008). Perry’s Chemical Engineers’ Handbook, 8th ed. McGraw-Hill.',
 'Yang S., Cao Z., Arvanitis A., Sun X., Xu Z., Dong J. (2016). DDR-type zeolite membrane synthesis, modification and gas permeation studies. Journal of Membrane Science 505, 194–204.',
 'Szargut J., Morris D.R., Steward F.R. (1988). Exergy Analysis of Thermal, Chemical, and Metallurgical Processes. Hemisphere.',
 'Krishna R., Wesselingh J.A. (1997). The Maxwell–Stefan approach to mass transfer. Chemical Engineering Science 52, 861–911.',
 'IPCC (2006). Guidelines for National Greenhouse Gas Inventories, Vol. 2, Table 2.2; IPCC (2021). AR6 WG1, Chapter 7, Table 7.15.',
 'Central Electricity Authority (2024). CO₂ Baseline Database for the Indian Power Sector, User Guide Version 20.0.',
 'Ministry of New and Renewable Energy (2023). Green Hydrogen Standard for India; WRI/WBCSD GHG Protocol Corporate Standard and Scope 2 Guidance.',
 'International Energy Agency (2023). Global Hydrogen Review 2023. IEA, Paris.',
 'Smith J.M., Van Ness H.C., Abbott M.M. Introduction to Chemical Engineering Thermodynamics. McGraw-Hill (ideal-gas heat capacities).']
  .forEach((t, i) => body.push(new Paragraph({ children: [new TextRun(`[${i + 1}]  ${t}`)], spacing: { after: 100 }, indent: { left: 440, hanging: 440 } })));

// Appendix
body.push(H1('Appendix A: Assumptions'));
body.push(CAPT('Main assumptions used in the analysis.'));
body.push(...TBL([['Area', 'Assumption'], ['Exergy', 'Dead state 25 °C, 1.013 bar; Szargut element exergies; heat from 90 °C hot water (digester) and a 1000 °C furnace (pyrolysis)'],
  ['Exergy data', 'INERT treated as ash (no chemical exergy); retentate entropy from ideal-gas pressure correction'],
  ['CO₂', 'Boiler efficiency 90 %, furnace 80 %; flare efficiency 98 %; 8000 h/yr; GWP of biogenic CH₄ 27.0'],
  ['Heat integration', 'Digestate cooled to 30 °C; 90 % of HEAT2 recoverable from hot product; CO burned at 80 % efficiency'],
  ['Membrane', 'Well-mixed, ideal gas, no pressure drop; permeances at 297 K applied at 303 K'],
  ['Pyrolysis', 'Isothermal 790 °C, 1 bar; power-law kinetics on catalyst mass (carbon-type catalyst)']], [2000, 6900], { zebra: true }));

body.push(H1('Appendix B: Sources'));
body.push(P('Sources used to build, correct and check the simulation model (from the project edit log and fix notes), with what each was used for. Page and table numbers refer to the 8th edition of Perry’s Handbook.'));
body.push(CAPT('Sources used for the model and its checks.'));
body.push(...TBL([['Source', 'Used for'],
  ['Green D.W., Perry R.H. (eds.) (2008). Perry’s Chemical Engineers’ Handbook, 8th ed. McGraw-Hill. Section 2: Tables 2-151 (graphite Cp), 2-155/2-156 (ideal-gas Cp), 2-179 (ΔHf, ΔGf at 298 K), 2-2 (densities)', 'Property checks (ethanol Cp, amino-acid ΔHf basis, densities); pyrolysis equilibrium constants and reaction enthalpies'],
  ['Perry’s Handbook, Section 7: Eq. 7-5 and 7-8 (power-law rate, Arrhenius), Eq. 7-150/151 (Monod kinetics with inhibition)', 'Form of the digester and pyrolysis kinetics'],
  ['Perry’s Handbook, Section 10 (compressors, p. 10-45: pressure ratio per stage)', 'Two-stage intercooled compression to 10 bar'],
  ['Perry’s Handbook, Section 16: Eq. 16-81 (packed-bed void fraction 0.35–0.5)', 'Catalyst loading check of the pyrolysis reactor'],
  ['Perry’s Handbook, Section 20 (gas membranes, p. 20-57 to 20-63, Fig. 20-75)', 'Membrane flux law, pressure-ratio limit, staging'],
  ['Perry’s Handbook, Section 24: Eq. 24-18, 24-25, 24-26 (shift and Boudouard reactions); anaerobic digestion: thermophilic range 45–70 °C, HRT 10–30 d', 'Reversible shift reaction; Boudouard reaction check; digester temperature and residence time'],
  ['Chase M.W. (1998). NIST-JANAF Thermochemical Tables, 4th ed. J. Phys. Chem. Ref. Data, Monograph 9 (janaf.nist.gov: CH₄, CO, CO₂, H₂O)', 'Equilibrium constants at 790 °C (cracking 19.87, shift 0.887) for the reverse pyrolysis reactions'],
  ['Batstone D.J. et al. (2002). Anaerobic Digestion Model No. 1 (ADM1). IWA Scientific and Technical Report No. 13', 'Digester kinetic structure; hydrogenotrophic methanogen yield (0.06)'],
  ['Yang S. et al. (2016). Journal of Membrane Science 505, 194–204', 'DDR zeolite permeances (CO₂, H₂, CH₄) used in the ACM membrane model'],
  ['Himeno S. et al. (2007). Industrial & Engineering Chemistry Research 46, 6989–6997', 'High-selectivity DDR permeances for the sensitivity case'],
  ['CRC Handbook of Chemistry and Physics, 58th ed. (1977) and Merck Index, 11th ed. (1989), as tabulated by the JenaLib Amino Acid Repository (jenalib.leibniz-fli.de)', 'Amino-acid densities for standard liquid volumes'],
  ['Ramanadham M., Sikka S.K., Chidambaram R. (1973). Neutron diffraction structure of L-threonine (repository.ias.ac.in/86278)', 'Threonine crystal density'],
  ['Curland S. et al. (2018). Acta Crystallographica E 74 (pmc.ncbi.nlm.nih.gov/articles/PMC6002834)', 'Isoleucine crystal density (1.228 g/cm³)'],
  ['Serrano D.P. et al. (2008). Chemical Engineering Journal (methane decomposition over carbon catalysts)', 'Activation energy range of carbon catalysts (117–185 kJ/mol) vs the model’s 145.8 kJ/mol'],
  ['Soliman A.M.S. et al. (2026). Gases 6, 23 (CO₂ gasification of carbon from methane decomposition)', 'Boudouard kinetics check (no rate constant available, reaction not added)'],
  ['Szargut J. et al. (1988); Smith, Van Ness and Abbott; IPCC (2006, 2021); CEA v20.0 (2024); MNRE (2023)', 'Exergy, heat capacities and emission factors (see References)']], [5200, 3700], { zebra: true }));

// ---------- document
const doc = new Document({
  creator: 'Arghadeep Ghosh', title: 'BTP-1 2026 Report: Green Hydrogen from Organic Waste',
  styles: { default: { document: { run: { font: 'Calibri', size: 22, color: TXT } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Cambria', size: 32, bold: true, color: GREEN }, paragraph: { spacing: { before: 240, after: 180 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Cambria', size: 26, bold: true, color: GREEN }, paragraph: { spacing: { before: 220, after: 100 }, outlineLevel: 1, keepNext: true } }] },
  numbering: { config: [
    { reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    { reference: 'num', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] }] },
  sections: [{ properties: { page: { margin: { top: 1300, bottom: 1300, left: 1440, right: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '5E6B66' })] })] }) },
    children: body }] });
Packer.toBuffer(doc).then(b => { fs.writeFileSync(OUT, b); console.log('saved', OUT); });
