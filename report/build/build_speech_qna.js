// Speaker script (slide by slide, ~10 min) and Q&A preparation for the BTP-1 presentation
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Footer, PageNumber, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle } = require('docx');
const GREEN = '2D6A4F', MID = '5E6B66';

const runs = (t, base = {}) => {
  const out = []; const re = /(\*\*[^*]+\*\*)/g; let last = 0, m;
  while ((m = re.exec(t))) {
    if (m.index > last) out.push(new TextRun(Object.assign({ text: t.slice(last, m.index) }, base)));
    out.push(new TextRun(Object.assign({ text: m[0].slice(2, -2), bold: true }, base))); last = m.index + m[0].length;
  }
  if (last < t.length) out.push(new TextRun(Object.assign({ text: t.slice(last) }, base)));
  return out;
};
const styles = { default: { document: { run: { font: 'Calibri', size: 24 } } },
  paragraphStyles: [{ id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Cambria', size: 32, bold: true, color: GREEN }, paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Cambria', size: 26, bold: true, color: GREEN }, paragraph: { spacing: { before: 300, after: 80 }, outlineLevel: 1, keepNext: true } }] };
const footer = { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: MID })] })] }) };
const page = { margin: { top: 1200, bottom: 1200, left: 1300, right: 1300 } };

// ======================= SPEECH =======================
// [slide no, title, seconds, text]
const S0 = [
[1, 'Title', 20, 'Good morning. My name is Arghadeep, and I will show how wet organic waste can be turned into **hydrogen and solid carbon** using anaerobic digestion, a zeolite membrane and methane pyrolysis, simulated in Aspen Plus.'],
[2, 'Contents', 10, 'I will cover six parts: the background, the process and model, results for each unit, the energy balance, exergy and CO₂ emissions, and finally sensitivity and next steps. At the bottom are four key terms I will use: **biogas**, the gas microbes make from waste; a **membrane**, a thin layer that lets some gases pass faster than others; **pyrolysis**, splitting methane with heat; and **exergy**, the useful part of energy.'],
[3, 'Section 1: Background', 3, 'First, the background.'],
[4, 'Organic waste: conventional routes', 35, 'Today, most organic waste goes to **landfill**, where it rots without air and releases methane, a strong greenhouse gas, while its energy is lost. Burning, composting and incineration recover little energy from wet waste. **Anaerobic digestion** is better: microbes convert the waste into biogas, roughly 60 per cent methane and 40 per cent CO₂, and the methane is captured instead of escaping. My work starts from this biogas.'],
[5, 'Routes to hydrogen', 40, 'Most hydrogen today is **grey**, made by steam reforming natural gas, at about 10 to 12 kg of CO₂ per kg of hydrogen. Blue adds carbon capture; green uses electrolysis with renewable power. **Methane pyrolysis**, sometimes called turquoise, splits methane into hydrogen and **solid carbon**, so the reaction itself releases no CO₂. With waste methane, storing that carbon can make the route **carbon negative**. The benchmark I use is India’s Green Hydrogen Standard: at most **2 kg CO₂ per kg of hydrogen**.'],
[6, 'Problem statement', 25, 'So the problem I am solving is this: wet organic waste is mostly landfilled, releasing methane and wasting its energy. My aim is to **design and analyse an integrated process** that turns this waste into **hydrogen and solid carbon**, and to find where its energy use, exergy losses and CO\u2082 emissions can be reduced.'],
[7, 'Section 2: Process and model', 3, 'Now the process and the model.'],
[8, 'Process flow diagram', 45, 'Here is the flowsheet. **8.5 tonnes per day** of wet biomass, mixed with 13 tonnes of water, is hydrolysed and digested at **55 °C for 15 days**. The biogas is cleaned and compressed to **10 bar**. The zeolite membrane lets CO₂ through and keeps the methane. The gas that passes through is called the **permeate**; the gas that stays behind, rich in methane, is the **retentate**. The methane-rich retentate is let down to 1 bar, heated to **790 °C** and cracked over a catalyst, giving hydrogen and solid carbon.'],
[9, 'Aspen model set-up', 30, 'This table says what each step does in plain words, with the Aspen blocks in grey. Hydrolysis breaks large molecules into sugars and acids. The digester is a **stirred tank where microbes make biogas**, modelled with ADM1-style microbial kinetics. The membrane is a **custom model I wrote in Aspen Custom Modeler**, and pyrolysis is a plug-flow reactor with methane cracking and the reverse water-gas shift.'],
[10, 'Custom membrane module', 0, 'A central part of this BTP is the **custom membrane module**. Aspen Plus has no gas-membrane block, so I wrote one in **Aspen Custom Modeler**, which is Aspen’s tool for writing new unit models. For every component it solves a mass balance, and for CO\u2082, hydrogen and methane a permeation law: flow equals permeance, times area, times the partial-pressure difference. I exported it as a library and linked it into the flowsheet as a normal block. It solves **193 equations**, converges in **five iterations** and closes the mass balance exactly.'],
[11, 'Development challenges', 35, 'Building the model brought several challenges. **My first version of the membrane module did not conserve mass**, so I rewrote it from first principles. At 1 bar there was almost no driving force across the membrane, so I **added compression to 10 bar**. I also fixed the digester rates and rebalanced several reactions. The final model closes its mass, element and energy balances and was **checked against Perry\u2019s Handbook**.'],
[12, 'Section 3: Results per unit', 3, 'Next, the results for each unit.'],
[13, 'Digester', 30, 'The digester produces **2.36 kmol per hour of biogas** with **59 per cent methane**, about 31 normal cubic metres of methane per hour. That is 0.24 cubic metres per kg of COD, where COD is a measure of the organic content of the feed; this is about two-thirds of Perry’s theoretical maximum of 0.35.'],
[14, 'Membrane', 30, 'The membrane raises methane from **59 to 76 per cent**. It keeps **97 per cent of the methane** and removes 56 per cent of the CO₂, into a permeate that is 92 per cent CO₂. Compression for this costs 5.7 kW.'],
[15, 'Pyrolysis', 35, 'At 790 °C the reactor reaches chemical equilibrium: 94 per cent of the methane is converted, giving **4.46 kg of hydrogen per hour**, about 107 kg per day, plus **15 kg per hour of solid carbon**. The CO₂ left after the membrane reacts with hydrogen to CO and water, which costs about 13 per cent of the possible hydrogen. Both reactions are reversible in the model, so the outlet sits at equilibrium, which I checked with thermochemical data.'],
[16, 'Key streams', 15, 'This table summarises the main streams, from the biogas at 10 bar to the product gas at 790 °C.'],
[17, 'Section 4: Material and energy balance', 3, 'Now the material and energy balance.'],
[18, 'Material balance', 20, 'The material balance closes exactly at about **896 kg per hour**. About 92 per cent of the mass leaves as digestate, so this is mainly a water-handling process; the gas side is small.'],
[19, 'Energy balance', 30, 'On energy, the **pyrolysis section takes two-thirds of the heat**: 35 kW in the reactor and 20 kW to preheat the gas. The next largest user is feed heating in hydrolysis, about 25 kW. Per kg of hydrogen, the process uses **18.9 kWh of heat and 1.3 kWh of electricity**.'],
[20, 'Heat integration', 35, 'Much of this heat is available inside the process. Warm digestate can preheat the feed, the hot product can preheat the pyrolysis feed in an **economiser**, and the CO in the product can be burned. Together, these could cut external heat from **87 to about 18 kW, minus 79 per cent**. I will confirm this with pinch analysis.'],
[21, 'Section 5: Exergy and CO₂', 3, 'Now exergy and CO₂ emissions.'],
[22, 'Exergy per unit', 35, '**Exergy** is the useful part of energy, the part that can still do work; once destroyed, it is lost for good. For exergy, I used Aspen’s enthalpies and entropies together with Szargut’s standard chemical exergies, and checked every unit’s energy balance against Aspen. In total **78 kW of exergy is destroyed**, and **79 per cent of it in hydrolysis and digestion**, because biochemical reactions are highly irreversible. The pressure letdown after the membrane wastes 2.8 kW, about half of the compressor work.'],
[23, 'Whole-process exergy', 30, 'Of the 647 kW of exergy entering, 348 kW leaves in the product. The digestate carries out **191 kW, about 30 per cent of the input**, as undigested organics and warm water. The exergy efficiency is **22 per cent for hydrogen alone and 45 per cent if the solid carbon is counted**.'],
[24, 'Problems and BTP-2 plan', 25, 'These losses define BTP-2: mainly the **economiser and a full energy analysis**, followed by pinch analysis.'],
[25, 'CO₂ Scope 1 + 2', 35, 'For emissions, **Scope 1** means emissions on site, from fuel burned for heat and methane slip, and **Scope 2** means emissions from the electricity we buy, using the Indian grid factor of 0.727 kg per kWh. The base case with natural-gas heating gives **5.6 kg CO₂ per kg of hydrogen**, about half of grey hydrogen. Electric heating is worse on the grid but near zero with hydro or solar. With heat integration, the process reaches **2.1**, right at the green limit of 2, and about 1.2 with solar electricity.'],
[26, 'CO₂ key messages', 25, 'Four messages: heat is the main source of emissions; electric heating only helps with clean power; the permeate must **never be vented**, because its methane would add 4.0 kg per kg of hydrogen; and the 23 kg per hour of biogenic CO₂ in the permeate is the target for a capture column.'],
[27, 'Section 6: Sensitivity and models', 3, 'Finally, sensitivity and models.'],
[28, 'Pressure sensitivity', 25, 'I varied the membrane feed pressure. A lower pressure saves compression power, but less CO₂ is removed, so more hydrogen is lost in the reactor. The result is that the **current design at 10 bar is near optimal**. The cost of pressure will be included in BTP-2.'],
[29, 'Membrane models', 30, 'For zeolite membranes there are three main modelling approaches. I use the **constant-permeance model**, which is simple and robust in Aspen. An **adsorption–diffusion, Maxwell–Stefan** model would capture competition between CO₂ and methane, but needs many parameters and is hard to converge.'],
[30, 'Other units', 20, 'For the other units, the main simplifications are a fixed pH in the digester, fixed hydrolysis conversions, ideal gas cleanup, and no Boudouard reaction in the pyrolysis reactor. I have stated each of these as a limitation.'],
[31, 'Conclusions and next steps', 35, 'To conclude: I developed a **custom membrane module** in ACM and a **verified model** that turns 8.5 tonnes per day of waste into **4.46 kg per hour of hydrogen** and 15 kg per hour of carbon. The membrane at 10 bar is near optimal. Heat integration could bring emissions to the green limit. In BTP-2 I will work on the **economiser and energy analysis**, pinch analysis, CO₂ capture, CO₂ methanation as an alternative route, and the electricity-source comparison.'],
[32, 'References / Thank you', 8, 'These are my main references. Thank you, I am happy to take your questions.']];

const S = S0.map(([n, ti, _, tx]) => [n, ti, Math.max(3, Math.round(tx.replace(/\*\*/g, '').split(/\s+/).length / 135 * 60)), tx]);
const sp = [];
sp.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: 'BTP-1 Presentation: Speaker Script' }));
const total = S.reduce((a, s) => a + s[2], 0);
const words = S.reduce((a, s) => a + s[3].replace(/\*\*/g, '').split(/\s+/).length, 0);
sp.push(new Paragraph({ children: runs(`Total: about **${Math.round(total / 60 * 10) / 10} minutes**, ${words} words, ${S.length} slides. Times assume about 135 words per minute. **Bold** = stress these numbers. Times are guides, not limits.`), spacing: { after: 200 } }));
const sec = [['Background (slides 1–6)', 1, 6], ['Process and model (7–11)', 7, 11], ['Results (12–16)', 12, 16], ['Balances (17–20)', 17, 20], ['Exergy and CO₂ (21–26)', 21, 26], ['Sensitivity, models, close (27–32)', 27, 32]];
let elapsed = 0;
const tb = new Table({ width: { size: 6000, type: WidthType.DXA }, columnWidths: [4200, 1800], rows: [['Part', 'Ends at (min:s)'], ...sec.map(([n, a, b]) => {
  elapsed += S.filter(s => s[0] >= a && s[0] <= b).reduce((x, s) => x + s[2], 0); return [n, `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`]; })]
  .map((r, i) => new TableRow({ children: r.map((c, j) => new TableCell({ width: { size: [4200, 1800][j], type: WidthType.DXA }, shading: i === 0 ? { type: ShadingType.CLEAR, color: 'auto', fill: GREEN } : undefined,
    margins: { top: 50, bottom: 50, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: c, bold: i === 0, color: i === 0 ? 'FFFFFF' : undefined, size: 22 })] })] })) })) });
sp.push(tb);
let t = 0;
for (const [n, title, sec_, text] of S) {
  t += sec_;
  sp.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(`Slide ${n}  ·  ${title}`), new TextRun({ text: `    (~${sec_} s, ends ${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')})`, size: 20, color: MID, bold: false })] }));
  sp.push(new Paragraph({ children: runs(text, { size: 28 }), spacing: { after: 120, line: 360 } }));
}
const speech = new Document({ creator: 'Arghadeep', title: 'BTP-1 speaker script', styles, sections: [{ properties: { page }, footers: footer, children: sp }] });
Packer.toBuffer(speech).then(b => { fs.writeFileSync(process.argv[2] || '../BTP1_speech_script.docx', b); console.log('speech', total, 's', words, 'words'); });

// ======================= Q&A =======================
const Q = [
['A. Big picture', [
 ['Why make hydrogen from biogas instead of using the biogas directly for power or as biomethane?', 'Using biogas directly is the usual benchmark. Converting its methane to hydrogen by pyrolysis gives a carbon-free fuel and, at the same time, locks almost half of the methane’s heating value into **solid carbon** that can be stored or sold. Because the carbon is biogenic, storing it removes CO₂ from the atmosphere, which direct combustion cannot do.'],
 ['Why methane pyrolysis and not steam reforming of the biogas?', 'Reforming releases all the carbon as CO₂ and needs shift reactors and CO₂ separation. Pyrolysis releases no CO₂ from the reaction itself and gives solid carbon. It also needs less energy per mol of hydrogen: about **37 kJ/mol H₂** for cracking methane, compared with about 286 kJ/mol for splitting water by electrolysis.'],
 ['What problem does this work address?', 'Wet organic waste is mostly landfilled, releasing methane. This work designs an integrated route from that waste to hydrogen and solid carbon. What is new is the integration of a full anaerobic-digestion model, a custom zeolite membrane model and catalytic pyrolysis in one flowsheet, plus an energy, exergy and CO₂ analysis of the whole chain, which shows where to focus heat recovery.'],
  ['Is there an alternative to the membrane?', 'Yes. In BTP-2 I will study CO\u2082 methanation (CO\u2082 + 4 H\u2082 \u2192 CH\u2084 + 2 H\u2082O) in place of the membrane, which turns the CO\u2082 into more methane for pyrolysis but consumes hydrogen, and compare it with the current process.']]],
['B. Feed and digester', [
 ['What is the feed?', '8.5 t/d of wet organic waste, about 75 % water, containing cellulose, hemicellulose, starch, fats, proteins, keratin and inert matter, diluted with 13 t/d of water. The composition is the project’s base case; I would like to confirm it against a measured feedstock.'],
 ['Why 55 °C (thermophilic) and not 35 °C?', 'Thermophilic digestion is faster and kills pathogens; Perry’s gives 45–70 °C as the thermophilic range. The cost is more heat for the feed, about 25 kW, which is why heat recovery from the digestate matters. Comparing 35 °C is a planned sensitivity, but the kinetic constants would need refitting.'],
 ['How is the digester modelled?', 'Hydrolysis uses fixed conversions in an RSTOIC block. The digester is a CSTR with ADM1-style kinetics: Monod terms multiplied by inhibition from ammonia, fatty acids, acetate and hydrogen. Ten Fortran calculator blocks compute the rate constants from the reactor concentrations, and Aspen converges them with a recycle (tear) loop.'],
 ['Why not the full ADM1 model?', 'Aspen Plus has no built-in ADM1, and full ADM1 needs electrolyte chemistry for pH. I kept the ADM1 structure for the rates but fixed pH, which keeps the model stable and focused on the hydrogen chain.'],
 ['How is pH handled?', 'pH is fixed at 6.5–7 because there is no electrolyte chemistry. This is inside Perry’s recommended range of 6.5–7.5. It is a stated limitation.'],
 ['Is a methane yield of 0.24 m³ per kg COD reasonable?', 'Yes. It is about two-thirds of the theoretical maximum of 0.35 m³ per kg COD, which is plausible for a 15-day residence time and waste that is only partly degradable. Biogas at 59 % methane is inside the typical 50–80 %.'],
 ['Why is RSTOIC the second-largest heat user?', 'It heats about 21.5 t/d of feed, mostly water, from 23 to 55 °C. Reducing dilution water or recovering heat from the warm digestate would cut this, and both are on the list.']]],
['C. Gas cleanup and compression', [
 ['Why is gas cleanup ideal?', 'The focus of BTP-1 is the hydrogen chain. H₂S, ammonia and water removal are modelled as perfect separators; their energy use is small compared with heating and pyrolysis. Real units (scrubber, adsorber, dryer) can be added later. A dryer is important because zeolite membranes are sensitive to water.'],
 ['Why two compression stages?', 'The overall ratio is 10. Two stages of about 3.2 each, with cooling to 30 °C in between, keep each stage within the usual limit of about 4 and save power compared with one stage.']]],
['D. Membrane', [
 ['Why a DDR zeolite membrane?', 'DDR has pores of about 0.36 nm. CO₂ (0.33 nm) passes and methane (0.38 nm) is largely blocked, so selectivity is high: CO₂/CH₄ about **69** with the data used. Zeolites are also thermally and chemically stable. Polymer membranes are cheaper but less selective.'],
 ['Where do the permeances come from?', 'From Yang et al. (2016), measured on DDR membranes at 297 K: CO₂ 2.1×10⁻⁷, H₂ 1.36×10⁻⁷ and CH₄ 3.03×10⁻⁹ mol/(m²·s·Pa).'],
 ['Why did you write your own membrane module?', 'Aspen Plus has no standard permeance-based gas-membrane block, so I developed one in Aspen Custom Modeler and linked it into the flowsheet. It is a well-mixed model with a component balance and the partial-pressure flux law (Perry Eq. 20-85). Developing this module was a major part of the project.'],
  ['How is the ACM module linked to Aspen Plus?', 'I wrote the model in Aspen Custom Modeler using Aspen\u2019s standard material ports, compiled it and exported it as a model library. In Aspen Plus it appears in the model palette and is placed like any other block (MEMB1). Aspen passes the feed stream in, and the module returns both outlets with flow, composition, temperature, pressure and enthalpy.'],
 ['What exactly does the module solve?', 'For every component, a mass balance between feed, retentate and permeate; for CO\u2082, H\u2082 and CH\u2084, the flux law V\u00b7y = \u03a0\u00b7A\u00b7(p_F\u00b7x \u2212 p_P\u00b7y); outlet temperature equal to the feed, retentate pressure equal to feed pressure minus the pressure drop, a specified permeate pressure, and enthalpies from Aspen\u2019s property calls. In total 193 equations.'],
 ['How did you verify the module?', 'The mass balance closes exactly (64.3 kg/h in, 40.1 + 24.2 kg/h out), the outlets are electrically neutral, the energy balance is consistent with Aspen, and an independent calculation with the same flux law gives the same retentate and permeate. It converges in 5 iterations.'],
 ['Can the module be reused?', 'Yes. Permeances, area and pressure drop are parameters, and the permeating species are a set, so the same module can model other membranes or gases, for example a polymer membrane or a different zeolite, by changing inputs only.'],
['Why a well-mixed model?', 'It is the simplest and most robust, and it is conservative: cross-flow or counter-current modules usually separate better, so real performance should be at least this good.'],
 ['The permeances were measured at 2 bar but you use 10 bar. Is that a problem?', 'At higher pressure, competitive adsorption can lower permeance, so CO₂ removal may be slightly overestimated. I state it as an assumption; a Maxwell–Stefan model or permeance sensitivity would quantify it.'],
 ['Why only 76 % methane?', 'A single stage at a pressure ratio of 10 is limited by the pressure ratio. A second stage could reach above 90 %, but with more area and compression. Some CO₂ is tolerable here, although it costs about 13 % of the hydrogen in the reactor.'],
 ['Why is 10 bar near optimal when Perry says ratios above 6 get expensive?', 'In my sensitivity, a lower pressure saves only a little compressor power (for example, about 1.4 kW at 6 bar) but lets more CO₂ reach the reactor, which cuts hydrogen by about 7 %. At this scale, compression is only about 6 kW, so the hydrogen gain is worth more.'],
 ['What happens to the methane lost in the permeate?', 'About 3 % of the methane (0.66 kg/h) leaves with the permeate. It must be flared or recycled to the burner; venting it would add 4.0 kg CO₂e per kg H₂.'],
 ['What was the hardest part of the membrane model?', 'My first version used a wrong component ID, went out of array bounds, created mass (+504 %), had a hard-coded split and no energy equations. I rewrote it from first principles; it now conserves mass and energy and converges in 5 iterations.']]],
['E. Pyrolysis', [
 ['Why 790 °C?', 'Catalytic methane decomposition is typically run at about 700–900 °C at atmospheric pressure. At 790 °C equilibrium strongly favours hydrogen, and the reactor is not as hot as non-catalytic pyrolysis (above 1000 °C).'],
 ['What catalyst is assumed?', 'The activation energy in the kinetics (about 146 kJ/mol) falls in the range reported for carbon catalysts. The catalyst type and mass should be confirmed from the kinetics source.'],
 ['Are your pyrolysis reactions reversible?', 'Yes. Each reaction has a reverse reaction whose rate constant is the forward one divided by the equilibrium constant at 790 °C (NIST-JANAF data; Perry’s agrees within 0.5 %). The outlet sits at equilibrium: 94 % of the methane and 85 % of the CO₂ are converted. Making them reversible lowered H₂ by about 4 %. The Boudouard reaction is not included because no rate constant is published for this carbon.'],
 ['What about catalyst deactivation by carbon?', 'Carbon deposition is the main practical problem in methane pyrolysis. The model does not include deactivation; carbon catalysts are partly self-sustaining, but regeneration or replacement would have to be designed.'],
 ['24.7 kg of catalyst seems small for the reactor. Why?', 'It comes from the kinetics basis; the outlet still reaches equilibrium, so it does not change the results. The reactor size and catalyst loading have not been designed yet and will be reconciled.'],
 ['How pure is the hydrogen?', 'The product is about 82 % H₂, 13 % CO, 3 % CH₄ and 2 % CO₂ on a dry basis. For fuel-cell use it would need a water-gas shift and pressure-swing adsorption, which are not yet in the flowsheet.'],
 ['What happens to the solid carbon?', 'It would be separated by a cyclone and filter (not yet modelled). It can be sold, for example as carbon black or a soil additive, or stored; storing biogenic carbon is a form of CO₂ removal.']]],
['F. Energy and exergy', [
 ['Which unit uses the most energy?', 'The pyrolysis section: about 58 kW of the 87 kW of heat (reactor 38 kW and preheat 20 kW). Next is feed heating in hydrolysis, about 25 kW.'],
 ['How did you calculate exergy?', 'For each stream: exergy = F(H − T₀S) + element exergies, using Aspen’s formation-basis enthalpy and entropy and Szargut’s standard chemical exergies of the elements, at T₀ = 25 °C. For each unit: destroyed = in + heat exergy + work − out. I checked that every unit’s energy balance matches Aspen within 0.1 % (0.4 % for the pyrolysis reactor) and that element balances close.'],
 ['Why does the digester destroy the most exergy?', 'Biochemical conversions release a lot of free energy as heat used by the microbes; they are inherently irreversible. Part of the loss also comes from heating the feed with fresh heat, which heat recovery can reduce.'],
 ['An exergy efficiency of 22 % seems low.', 'The input includes the full chemical exergy of the biomass, and about a third of it leaves in the digestate as undigested organics. Counting the solid carbon as a product, the efficiency is 45 %. Better digestion, and use of the digestate, would raise it.'],
 ['Do the assumed heat-source temperatures change the result?', 'They change how much destruction is assigned to the heaters, but not the ranking: the digester section stays first and pyrolysis second.'],
 ['Is a 77 % heat saving realistic?', 'It is a screening estimate with 25–50 K approach temperatures. It needs a pinch analysis, and the hot solid carbon must be separated before any heat exchanger. That is exactly the BTP-2 work.']]],
['G. CO₂ emissions', [
 ['What are Scope 1, 2 and 3?', 'Scope 1: direct emissions on site (fuel burned for heat, methane slip). Scope 2: emissions from purchased electricity. Scope 3: everything else in the value chain (upstream fuel, equipment, transport). I have done Scopes 1 and 2; Scope 3 is next.'],
 ['Why is the CO₂ in the biogas not counted?', 'It is biogenic: the carbon was taken from the air recently by plants. The GHG Protocol reports biogenic CO₂ separately, outside Scope 1. Escaping biogenic methane is still counted, because methane has a much stronger warming effect.'],
 ['Which electricity factor did you use?', 'The Indian grid average of 0.727 kg CO₂/kWh (CEA CO₂ Baseline Database v20, FY 2023-24). For coal/thermal power, the CEA operating margin of 0.962. Hydro and solar have no combustion emissions in Scope 2.'],
 ['Why is electric heating worse?', 'The heat demand (87 kW) is 15 times the compressor power, and the grid is mostly coal, so heating with grid electricity emits more than burning gas directly. With hydro or solar power it becomes nearly zero.'],
 ['How does this compare with grey hydrogen and the green standard?', 'The base case is 5.6 kg CO₂e/kg H₂, about half of grey hydrogen (10–12). With heat integration it is about 2.1, right at India’s 2 kg green limit (1.2 with solar electricity), and Scope 3 still has to be added.'],
 ['How would you capture the permeate CO₂?', 'With an absorption column using an amine (or a physical solvent) on the permeate, which is already 92 % CO₂. This is planned for BTP-2.']]],
['H. Next steps and general', [
 ['What will you do in BTP-2?', 'Mainly the economiser and a detailed energy analysis, then pinch analysis and optimisation; a CO₂ absorption column; CO₂ methanation as an alternative to the membrane; a comparison of electricity sources (coal, hydro, solar); and more sensitivity studies (pyrolysis temperature, dilution water, residence time).'],
 ['What about cost?', 'The economic analysis is planned for the next phase. I first wanted a correct model and a clear picture of energy, exergy and emissions, because these drive the cost. The electricity-source cost comparison is part of BTP-2.'],
 ['How would the results change at a larger scale?', 'Results per kg of hydrogen (energy, exergy, emissions) scale roughly linearly. Larger plants make heat integration and carbon handling easier and reduce cost per kg.'],
 ['Why Aspen Plus?', 'It has property databanks, kinetic reactor models, calculator blocks for custom kinetics and the ability to link custom models from Aspen Custom Modeler, which I needed for the membrane.'],
 ['What was the biggest challenge?', 'Making the model trustworthy: debugging the membrane model and the digester kinetics, and checking every unit’s mass, element and energy balance.']]]];

const qa = [new Paragraph({ heading: HeadingLevel.HEADING_1, text: 'BTP-1 Presentation: Questions and Answers' }),
  new Paragraph({ children: runs('Prepared for a panel seeing the work for the first time. Answers are short enough to say in 20–40 seconds. **Key numbers:** feed 8.5 t/d; biogas 2.36 kmol/h, 59 % CH₄; membrane 10 bar, 76 % CH₄, 97 % recovery; H₂ 4.46 kg/h, carbon 15.4 kg/h; heat 84 kW, electricity 5.7 kW; exergy destroyed 78 kW (79 % digester); efficiency 22 % (H₂) / 45 % (H₂ + C); CO₂ 5.6 base, 2.1 heat-integrated (kg CO₂e/kg H₂).', { size: 22 }), spacing: { after: 200 } })];
let qn = 0;
for (const [h, items] of Q) {
  qa.push(new Paragraph({ heading: HeadingLevel.HEADING_2, text: h }));
  for (const [q, a] of items) {
    qa.push(new Paragraph({ keepNext: true, spacing: { before: 160, after: 60 }, children: [new TextRun({ text: `Q${++qn}. ${q}`, bold: true, size: 23, color: '1E2B26' })] }));
    qa.push(new Paragraph({ children: runs(a, { size: 22 }), spacing: { after: 80, line: 300 }, indent: { left: 360 } }));
  }
}
const qdoc = new Document({ creator: 'Arghadeep', title: 'BTP-1 Q&A', styles, sections: [{ properties: { page }, footers: footer, children: qa }] });
Packer.toBuffer(qdoc).then(b => { fs.writeFileSync(process.argv[3] || '../BTP1_QnA.docx', b); console.log('qna', qn, 'questions'); });
