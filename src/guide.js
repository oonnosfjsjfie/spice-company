  /* ---------- Manufacturing guide: what to make, how to make it, machines, setting up, licences, costing ---------- */
  const G_SRC = {
    ehedg: ["EHEDG guideline catalogue", "https://ehedg.org/guidelines"],
    gl8: ["EHEDG GL 8: Hygienic design principles", "https://www.ehedg.org/guidelines-working-groups/guidelines/guidelines/detail/hygienic-design-principles"],
    gl22: ["EHEDG GL 22: Dry particulate materials", "https://www.ehedg.org/guidelines-working-groups/guidelines/guidelines/detail/general-hygienic-design-criteria-for-the-safe-processing-of-dry-particulate-materials"],
    en1672: ["EN 1672-2: Food processing machinery, hygiene requirements", "https://standards.iteh.ai/catalog/standards/sist/834860b2-2200-4955-8a54-a4e19c840f48/sist-en-1672-2-2005"],
    dust: ["Dust explosion hazard (NFPA 652, ATEX) explained", "https://sgsystemsglobal.com/glossary/dust-explosion-hazard-nfpa-652-atex/"],
    asta: ["ASTA Clean, Safe Spices Guidance Document", "https://www.astaspice.org/food-safety/clean-safe-spices-guidance-document/"],
    astagmp: ["ASTA Good Manufacturing Practices guide for spices", "https://astaspice.org/resources/good-manufacturing-practices-gmp-guide-for-spices"],
    esa: ["CBI: EU buyer requirements for spices (incl. ESA Quality Minima)", "https://www.cbi.eu/market-information/spices-herbs/buyer-requirements"],
    gma: ["GMA: Control of Salmonella in Low-Moisture Foods", "https://ucfoodsafety.ucdavis.edu/sites/g/files/dgvnsk7366/files/files/page/SalmonellaControlGuidance.pdf"],
    fssai: ["FSSAI standards for spices (Chapter 2.9)", "https://www.fssai.gov.in/upload/uploadfiles/files/Chapter%202_9_Salt_Spices_Condiments%20and%20related%20products.pdf"],
    tiers: ["FSSAI turnover limits revised from 1 April 2026", "https://irismsme.com/blog/msme-alert-fssai-turnover-limits-revised-from-1-april-2026"],
    cres: ["Spices Board FAQ on exporter registration (CRES)", "https://indianspices.com/hin/sites/default/files/faq.pdf"],
    pmfme: ["PMFME explained (July 2026)", "https://www.onmanorama.com/upsc/current-affairs/2026/07/16/explained-pmfme-scheme.html"],
    pepper: ["NIFTEM: black pepper processing (PMFME)", "https://niftem.ac.in/newsite/pmfme/wp-content/uploads/2022/08/blackpepperprocessing.pdf"],
    turmeric: ["Kerala Agricultural University: turmeric harvest & curing", "https://www.celkau.in/Crops/spices/turmeric/harvesting.php"],
    lm: ["Legal Metrology (Packaged Commodities) Rules, 2011", "https://leap.unep.org/en/countries/in/national-legislation/legal-metrology-packaged-commodities-rules-2011"],
    kspcb: ["KSPCB industry categorisation list 2026", "https://www.corpseed.com/law-update/kspcb-industry-categorisation-list-2026"],
  };
  // [product, why make it, raw material & where from, typical harvest/arrival season, difficulty, key machines, watch out for, FSSAI max moisture]
  const IDEAS = [
    ["Turmeric powder", "An everyday staple in every Indian kitchen; steady year-round demand.", "Dried, polished turmeric fingers (Erode, Nizamabad, Sangli; Alleppey finger from Kerala).", "Harvest Jan–Mar", 1, "Pulveriser, sifter, packing machine", "Adulteration checks (lead chromate, colours); curcumin varies by variety.", "10%"],
    ["Chilli powder", "A staple with big volumes; Kashmiri-type chilli sells on colour.", "Dry red chillies (Guntur in Andhra Pradesh, Byadgi in Karnataka).", "Arrivals mainly Jan–May", 2, "Destalker, pulveriser with dust control, sifter", "Aflatoxin and illegal dyes (Sudan); fiery dust needs extraction and masks.", "11%"],
    ["Coriander powder", "Used in almost every curry; simple to make.", "Coriander seed (Rajasthan, Madhya Pradesh, Gujarat).", "Harvest Feb–Apr", 1, "Cleaner, roaster (optional), pulveriser", "Moisture must stay very low; uneven roasting tastes burnt.", "9%"],
    ["Black pepper (whole & powder)", "Kerala's own spice; you can buy close to the farms.", "Dried pepper from farmers, traders and Kochi market.", "Harvest Dec–Mar", 1, "Thresher, dryer, cleaner-grader, grinder", "Big price swings; light berries and papaya-seed adulteration.", "12% (powder)"],
    ["Green cardamom (graded)", "High value; Idukki auctions are on your doorstep.", "Cardamom from the Kerala & Tamil Nadu auctions.", "Harvest Aug–Feb", 2, "Grader, colour sorting, moisture-proof packing", "Needs lots of working capital; colour fades in light.", "—"],
    ["Cumin powder", "Popular in North Indian cooking and snacks.", "Cumin seed (Gujarat, Rajasthan).", "Harvest Feb–Mar", 1, "Cleaner, roaster (optional), pulveriser", "Look-alike seeds and stones; cleaning matters.", "10%"],
    ["Masalas & blends", "Higher value and easier to build a brand: sambar, garam, chicken, fish, biryani.", "8–20 different spices per recipe, bought in season.", "Buy each spice in its season", 2, "Roaster, pulveriser, ribbon blender, sifter", "Keeping every batch the same; many raw materials to test and store.", "12% (mixed masala)"],
    ["Hotel & catering packs", "Restaurants and caterers buy 1–5 kg packs regularly.", "Same as your retail powders and masalas.", "Year-round", 1, "Bulk filling and sealing", "Credit periods; price-sensitive buyers.", "As per product"],
    ["Steam-sterilised spices for export", "Export buyers often need low microbial counts.", "Cleaned whole or ground spices.", "Year-round", 3, "Steam steriliser, lab, export packing", "Higher investment; export registrations and buyer audits.", "As per buyer"],
    ["Spice oils & oleoresins", "Concentrated flavours for food factories.", "Pepper, turmeric, ginger, chilli.", "Year-round", 3, "Extraction plant (solvent or CO₂), distillation", "Large investment and specialised licences; a later-stage idea.", "—"],
  ];
  const DIFF = ["", "Easy start", "Some experience", "Advanced"];
  // How to make: product-specific steps (my own words, from the sources above and common practice)
  const HOW = {
    "Turmeric powder": { moist: "10%", src: "turmeric", steps: [
      ["Buy or cure the fingers", "Most units buy dried, polished fingers. If you start from fresh turmeric, boil (cure) it within 2–3 days of harvest until a wooden needle pierces it easily."],
      ["Dry", "Spread boiled fingers thinly in the sun, or use a dryer at no more than 60°C for a brighter colour."],
      ["Polish & clean", "Polish in a rotating drum to remove the rough skin; sieve out dust, stones and bits; run past a magnet."],
      ["Grind", "Crush, then grind in a pulveriser. Don't let the grinder run hot."],
      ["Sieve & check", "Sieve to an even powder. Test moisture (FSSAI limit 10%), colour (curcumin) and purity."],
      ["Pack", "Moisture-proof, light-proof pouches, labelled and batch-coded."]] },
    "Chilli powder": { moist: "11%", steps: [
      ["Sort & destalk", "Remove stalks, mouldy or pale pods and foreign matter. Mouldy pods are the main aflatoxin risk."],
      ["Dry", "Dry further if the pods aren't crisp. Overheating dulls the colour."],
      ["Grind with dust control", "Grind in a pulveriser fitted with a cyclone or dust collector. Workers need masks and goggles."],
      ["Blend for colour & heat", "Mix chilli types to hit a steady colour (ASTA) and heat level batch after batch."],
      ["Sieve & test", "Moisture (FSSAI limit 11%), colour, aflatoxin and illegal dyes."],
      ["Pack", "Pack in light-proof pouches; colour fades in light."]] },
    "Coriander powder": { moist: "9%", steps: [
      ["Clean", "Destoner, sieve and magnet remove stones, stalks and dust."],
      ["Dry or lightly roast", "Dry to very low moisture; a light, even roast adds aroma."],
      ["Cool", "Cool fully before grinding, or the powder sweats and cakes."],
      ["Grind & sieve", "Grind and sieve to an even powder."],
      ["Test & pack", "FSSAI moisture limit is 9%, the tightest of the common powders. Pack straight away."]] },
    "Cumin powder": { moist: "10%", steps: [
      ["Clean carefully", "Cumin often carries stones, dust and look-alike weed seeds; use a destoner and sieves."],
      ["Roast (optional)", "Roast lightly for a nuttier flavour, then cool."],
      ["Grind & sieve", "Grind in short runs; cumin is oily and clogs a hot mill."],
      ["Test & pack", "FSSAI moisture limit is 10%."]] },
    "Black pepper (whole & powder)": { moist: "12% (powder)", src: "pepper", steps: [
      ["Thresh", "Separate berries from the spikes, by hand or with a thresher (a mechanical one handles about 320 kg an hour)."],
      ["Blanch (optional)", "Dip in boiling water for about a minute for a cleaner, more even black colour."],
      ["Dry", "Sun-dry for 3–5 days or use a mechanical dryer, down to about 10% moisture."],
      ["Clean & grade", "Winnow, sieve and grade by size and bulk density; remove light berries."],
      ["Grind (for powder)", "Use a hammer, pin or plate mill without adding anything else."],
      ["Pack", "Food-grade lined bags for bulk; sealed pouches for retail. Powder limit: 12% moisture."]] },
    "Masalas & blends": { moist: "12% (mixed masala)", steps: [
      ["Prepare each spice", "Clean, dry and test every ingredient separately; buy each one in its season."],
      ["Roast where the recipe needs it", "Roast spices separately (they roast at different speeds), then cool fully."],
      ["Grind", "Grind ingredients separately or together, as your recipe works best."],
      ["Weigh to the recipe", "Use a written batch sheet and a calibrated scale, so every batch tastes the same."],
      ["Blend & sieve", "Mix in a ribbon blender until even, then sieve."],
      ["Taste, test & pack", "Taste against your reference sample; test moisture (12% for mixed masala); pack quickly to keep the aroma."]] },
    "Whole spices": { moist: "Varies", steps: [
      ["Clean", "Remove dust, stones, stalks and broken pieces."],
      ["Grade", "Sort by size and colour; better grades sell for more."],
      ["Check moisture", "Dry further if needed so nothing grows mould in the pack."],
      ["Pack", "Moisture-proof packs; keep cardamom away from light to stay green."]] },
  };
  const MACHINES = [
    ["Weighing scales", "Essential", "A platform scale for raw material and a precise scale for packs and recipes. Get them stamped under Legal Metrology."],
    ["Destoner / cleaner", "Essential", "Removes stones, dust and stalks from seeds and whole spices."],
    ["Magnetic separator", "Essential", "Catches iron bits before they reach the grinder or the pack."],
    ["Sieves / vibro sifter", "Essential", "Cleans raw spice and gives powders an even texture."],
    ["Dryer", "Often needed", "Tray, cabinet or solar dryer for spices that arrive damp. Pepper thresher-to-dryer lines suit Kerala."],
    ["Roaster", "For masalas", "Drum roaster for coriander, cumin and masala ingredients."],
    ["Pulveriser / hammer mill / pin mill", "Essential", "The main grinder. A water-cooled or low-heat mill keeps more aroma."],
    ["Cyclone & dust collector", "Essential for chilli", "Keeps spice dust out of the air and the factory."],
    ["Ribbon blender", "For masalas", "Mixes blends evenly."],
    ["Pouch packing machine", "As you grow", "Auger filler or form-fill-seal machine for steady, accurate packs."],
    ["Band sealer & batch coder", "Essential", "Seals pouches and prints batch number and dates."],
    ["Metal detector", "Recommended", "Checks finished packs; many big buyers ask for it."],
    ["Basic lab", "Essential", "Moisture analyser or hot-air oven, test sieves and a magnifier for daily checks; send samples to an NABL lab for full tests."],
    ["Steam steriliser", "For export", "Lowers microbe counts for export buyers."],
  ];
  const SETUP = [
    ["Pick your products & buyers", "Start with 3–5 products you can source well and sell to buyers you know: local shops, hotels, distributors or online."],
    ["Write a project report", "Machines, building, working capital (money for raw material stock), expected sales and costs. Banks and subsidy schemes ask for it."],
    ["Arrange money", "Your own funds plus a bank (MUDRA or MSME) loan; check subsidy schemes such as PMFME (see Licences)."],
    ["Find a building", "Dry, well-ventilated, easy to clean. Plan one-way flow: raw store → cleaning → drying/roasting → grinding → packing → finished goods. Keep toilets and washing away from food areas."],
    ["Get licences", "Udyam, FSSAI, GST, Legal Metrology, local body and pollution board consent. Exporters also need IEC and CRES."],
    ["Install machines", "Place dusty jobs (chilli grinding) apart from packing; fit dust collection; keep floors and walls washable and insects out."],
    ["Trial batches & tests", "Run small batches, test them in a lab, and fix your recipes and settings before selling."],
    ["Design packs & labels", "FSSAI labels need: product name, ingredients, net quantity, FSSAI logo and licence number, batch number, packing and best-before dates, MRP, veg symbol, manufacturer address and customer care."],
    ["Start selling", "Retail shops and distributors, hotels and caterers, online marketplaces, and later export."],
  ];
  // Machine standards: there is no single standard just for spice machines; buyers and machine makers use these together.
  const STD_GROUPS = [
    ["EHEDG guidelines for machines & parts", "The European Hygienic Engineering & Design Group writes the best-known guidelines for food equipment that is easy to clean.", [
      ["GL 8 · Hygienic design principles", "The basics for any machine maker: smooth welds and rounded inside corners, no open screw threads where product touches, and smooth stainless steel (a surface roughness around Ra 0.8 µm or better is the usual target for product-contact parts).", "gl8"],
      ["GL 22, 33, 36, 38, 40, 41, 53 · Dry powders and granules", "The core set for spice lines: general design for dry materials, discharging, transfer (conveying), rotary valves, valves, diverter valves and bulk pack-off.", "gl22"],
      ["GL 31 · Spray dryers & fluid beds", "Applies to fluid-bed dryers and coolers, for example after steam sterilising or washing whole spices.", "ehedg"],
      ["GL 25 · Mechanical seals & GL 48 · Elastomeric seals", "Seals on mills, ribbon blenders and steriliser airlocks face heat, gritty spice particles and spice oils. These guidelines cover seals that stay tight and cleanable.", "ehedg"],
      ["GL 35 · Hygienic welding of tubing & GL 54 · Testing weld joints", "For pneumatic conveying pipes and cyclone ducts: weld burrs inside pipes trap powder.", "ehedg"],
      ["GL 58 · Hygienic design risk management", "A method for checking a machine's hygiene risks when you buy it and at factory acceptance testing (FAT).", "ehedg"],
    ]],
    ["International machine standards", "Formal standards that machine makers quote, and that BRCGS and FSSC 22000 auditors look for.", [
      ["ISO 14159 · Hygiene requirements for the design of machinery", "The ISO standard for hygienic risk assessment, cleanability and construction of processing machines.", null],
      ["EN 1672-2 · Food processing machinery, hygiene requirements", "Splits a machine into a food area, a splash area and a non-food area, with rules for each: rounded inside corners and no dead spaces in hoppers, chutes and housings.", "en1672"],
    ]],
    ["Dust-explosion safety", "Fine spice dust burns, and a dust cloud in a grinder, sifter or dust collector can explode. Grinding and dust collection need explosion protection.", [
      ["NFPA 61 & NFPA 652 (USA)", "US fire codes for food and agricultural dust and for combustible dust in general: hazard analysis, explosion venting, grounding and housekeeping.", "dust"],
      ["ATEX (EU Directive 2014/34/EU)", "EU law for equipment used where explosive atmospheres can form: certified motors, airlocks that stop flames, venting and spark detection.", "dust"],
      ["In India", "These are not Indian law, but export buyers and auditors often expect them. Follow the Factories Act and your state's factory rules on dust, and ask your machine maker for earthing (grounding), explosion vents and dust-tight electricals on grinders, sifters and dust collectors.", null],
    ]],
    ["Spice industry guidance (free)", "Written by spice and food trade associations; widely used by buyers.", [
      ["ASTA Clean, Safe Spices Guidance Document", "From the American Spice Trade Association: cleaning machines (destoners, aspirators, sifters, optical sorters), proving that steam or other microbial-reduction steps work, and stopping recontamination after them.", "asta"],
      ["ESA Quality Minima Document", "From the European Spice Association: what European buyers expect, including foreign-body removal, metal and X-ray detection, and equipment hygiene.", "esa"],
      ["GMA: Control of Salmonella in Low-Moisture Foods", "Widely used in spices and seasonings: sanitary equipment design checklists, separate tools for dry cleaning, and keeping water out.", "gma"],
    ]],
  ];
  // What to ask for when buying a machine (for your enquiry / requirement specification)
  const MACHINE_SPEC = [
    ["Materials", "Product-contact parts in food-grade stainless steel (usually SS 304 or SS 316) with material certificates; food-grade plastics and seals."],
    ["Surface finish", "Smooth, polished product-contact surfaces (ask for the roughness value, e.g. Ra 0.8 µm or better) and smooth, ground welds."],
    ["No hiding places", "Rounded inside corners, no ledges, gaps, open threads or dead spaces where powder can build up; self-emptying hoppers and chutes."],
    ["Easy dry cleaning", "Quick-release covers and screens, tool-free opening, access to every product area for brushing and vacuuming."],
    ["Seals & bearings", "Food-grade seals suited to heat and spice oils; bearings outside the product zone; food-grade (H1) lubricants where they could touch product."],
    ["Dust & explosion", "Dust-tight design, dust extraction points, earthing of all metal parts, explosion vents or suppression on mills and dust collectors, and dust-proof electricals."],
    ["Heat control", "For grinders: cooling (water jacket or cool air) and temperature display, to protect colour and aroma."],
    ["Foreign bodies", "Magnets before grinding and packing, sieves with checkable screens, and space for a metal detector."],
    ["Documents", "Drawings, manuals, spare parts list, cleaning instructions, material and calibration certificates, electrical safety and warranty."],
    ["Testing before you accept", "A factory acceptance test (FAT) with your own spice: capacity, fineness, temperature, dust and how easily it strips down for cleaning."],
  ];

  const LICENCES = [
    ["Business registration & PAN", "Everyone", "Proprietorship, partnership, LLP or company, with a PAN and bank account."],
    ["Udyam (MSME) registration", "Recommended", "Free online at udyamregistration.gov.in; needed for most MSME loans and schemes."],
    ["FSSAI registration or licence", "Everyone", "From 1 April 2026: basic registration up to ₹1.5 crore turnover, state licence from ₹1.5 crore to ₹50 crore, central licence above ₹50 crore. Exporters and multi-state businesses may need a central licence whatever their turnover.", "tiers"],
    ["GST registration", "Usually", "Needed above the turnover limit, and for selling online or across states."],
    ["Legal Metrology packer registration", "If you sell packed spices", "Manufacturers and packers of pre-packed goods register under the Legal Metrology (Packaged Commodities) Rules, 2011, and follow their label rules (net quantity, MRP, manufacturer details).", "lm"],
    ["Local body licence", "Everyone", "Panchayat or municipality licence for running the unit, and building permits."],
    ["Pollution Control Board consent", "Usually", "Kerala's KSPCB puts each activity in a category (white, green, orange or red) that sets which consent you need. Check your exact activity on KSPCB's current list.", "kspcb"],
    ["Factory licence & fire safety", "Depends on size", "The Factories Act applies once you have 10 or more workers using power. Bigger units may also need a fire NOC."],
    ["IEC (Importer Exporter Code)", "Exporters", "From DGFT, online."],
    ["CRES from the Spices Board", "Exporters", "Certificate of Registration as Exporter of Spices: required to export spices. Fee ₹5,000; issued for a three-year block.", "cres"],
    ["Quality certifications", "Optional", "ISO 22000 or FSSC 22000, HACCP, AGMARK, organic (NPOP). Big buyers and export markets often ask for these."],
  ];
  const SCHEMES = [
    ["PMFME", "35% credit-linked subsidy on project cost, up to ₹10 lakh, for micro food processing units (more for FPOs and SHGs). Extended until September 2026, with a PMFME 2.0 being considered; check the current status with your District Industries Centre.", "pmfme"],
    ["PMEGP", "Margin-money subsidy for new micro units through KVIC and banks; check current limits with KVIC or your DIC."],
    ["MUDRA & MSME loans", "Bank loans for small businesses, often without collateral up to set limits."],
    ["Kerala single window (K-SWIFT)", "Kerala's online single window for many state clearances to start a business."],
  ];

  const TESTS = [
    ["Moisture", "Too much moisture lets mould grow. FSSAI sets a maximum for each spice (9–14%)."],
    ["Volatile oil", "Measures aroma strength, especially for pepper, cardamom, cumin and coriander."],
    ["Colour value", "Chilli colour is measured in ASTA units; turmeric is checked for curcumin."],
    ["Purity & adulterants", "Starch, sawdust, brick powder, artificial colours (such as Sudan dyes) and lead chromate in turmeric."],
    ["Extraneous matter & ash", "Stones, stalks, insect damage, and total ash within FSSAI limits."],
    ["Microbes", "Total plate count, yeast and mould, E. coli and Salmonella."],
    ["Aflatoxin & mycotoxins", "Toxins from moulds; chillies, nutmeg and some seeds are prone to them."],
    ["Pesticide residues", "Tested against FSSAI limits, and stricter importing-country limits for export."],
  ];
  const HYGIENE = [
    ["Zones & one-way flow", "Raw store → cleaning → drying/roasting → grinding → packing → finished goods, so cleaned product never meets raw material again."],
    ["Keep dry areas dry", "Water in a dry-spice factory means mould. Clean mostly by brushing and vacuuming; if anything is washed, dry it completely."],
    ["No places for powder to hide", "Smooth, food-grade surfaces; no ledges or dead corners in machines; equipment that opens for cleaning."],
    ["Pests out", "Screens on windows, sealed gaps, pest control records, nothing stored on the floor."],
    ["People", "Clean uniforms, hair nets, hand washing, no eating in production; health checks for workers."],
    ["Records", "Batch sheets, cleaning logs and test results. FSSAI's hygiene schedule and buyers' audits ask for them."],
  ];
  const LABEL = ["Name of the product", "Ingredients (for blends, in descending order of weight)", "Net quantity", "FSSAI logo and licence/registration number", "Batch or lot number", "Date of packing/manufacture and best before", "MRP (inclusive of all taxes)", "Green veg symbol", "Name and full address of the manufacturer or packer", "Customer care details", "Storage instructions and allergen notes where needed"];
  const STORE_TIPS = [
    ["Airtight", "Airtight, moisture-proof packs; air carries away aroma."],
    ["Cool & dark", "Store away from heat, sunlight and steam; light fades chilli and cardamom."],
    ["Off the floor", "Raw spices on pallets, away from walls, first-in first-out."],
    ["Whole lasts longer", "Whole spices keep flavour much longer than powders; grind in small, frequent batches."],
  ];
  const PROBLEMS = [
    ["Powder caking or forming lumps", "Too much moisture, or packed while warm. Dry further, cool fully before packing, and use better barrier pouches."],
    ["Chilli powder losing colour", "Overheating in the grinder, light exposure, or old stock. Grind cooler, pack in light-proof pouches, and blend in a high-colour variety."],
    ["Weak aroma", "Old raw material, too much heat when roasting or grinding, or slow packing. Buy fresher, roast and grind cooler, pack quickly."],
    ["Insects in stock", "Store dry and cool, keep raw and finished goods apart, rotate stock, and keep pest control records."],
    ["Failing microbial tests", "Damp raw material, dirty equipment or poor storage. Improve drying, cleaning and hygiene; consider steam sterilisation for sensitive buyers."],
    ["Batches tasting different", "Raw material varies. Keep reference samples, test each lot, and adjust recipes by written batch sheets."],
  ];
  function srcLink(k) { const s = G_SRC[k]; if (!s) return null; const a = el("a", "srclink", "Source: " + s[0]); a.href = s[1]; a.target = "_blank"; a.rel = "noopener"; return a; }
  function renderGuide() {
    $("gTitle").textContent = SEGS[gSeg][0]; $("gLead").textContent = SEGS[gSeg][1];
    const body = $("gBody"); body.replaceChildren();
    const steps = (list, one) => { const st = el("div", "steps" + (one ? " one" : "")); list.forEach(([t, d], i) => { const x = el("div", "step"); x.append(el("span", "si", String(i + 1))); const tx = el("div"); tx.append(el("b", null, t), el("p", null, d)); x.append(tx); st.append(x); }); return st; };
    const askBtn = (label, q) => { const r = el("div", "chips"); const b = el("button", "qchip", label); b.type = "button"; b.onclick = () => { if (/: $/.test(q)) { setChat(true); $("q").value = q; $("q").focus(); } else send(q); }; r.append(b); return r; };
    if (gSeg === "what") {
      const intro = el("section", "pblk"); intro.append(el("h3", null, "Product ideas"), el("p", "sub", "Good first products are ones you can buy well near you and sell to buyers you already know. Tap \"How to make it\" on any card."));
      const grid = el("div", "idea-grid");
      IDEAS.forEach(r => {
        const c = el("article", "idea");
        const top = el("div", "itop"); top.append(el("b", null, r[0]), el("span", "lvl l" + r[4], DIFF[r[4]])); c.append(top);
        c.append(el("p", null, r[1]));
        const kv = (k, v) => { if (!v || v === "—") return; const p = el("p", "ikv"); p.append(el("span", null, k + ": "), document.createTextNode(v)); c.append(p); };
        kv("Raw material", r[2]); kv("Season", r[3]); kv("Machines", r[5]); kv("Watch out", r[6]); kv("FSSAI max moisture", r[7]);
        const key = HOW[r[0]] ? r[0] : /cardamom/i.test(r[0]) ? "Whole spices" : /hotel/i.test(r[0]) ? "Masalas & blends" : null;
        if (key) { const b = el("button", "btn-lg sm", "How to make it →"); b.type = "button"; b.onclick = () => { gHow = key; store.set("sc.ghow", key); showTab("guide", "how"); }; c.append(b); }
        grid.append(c);
      });
      intro.append(grid);
      const ch = el("section", "pblk"); ch.append(el("h3", null, "Questions to ask before you choose"));
      const ul = el("ul", "glist");
      ["Where will your raw material come from, and can you buy it in season?", "Who will buy: shops, hotels, distributors, online or export?", "How much money can you put in, including raw material stock for several months?", "Do you have a dry building with power for grinders?", "Which products can you make better or fresher than what's on the shelf now?"].forEach(t => ul.append(el("li", null, t)));
      ch.append(ul, askBtn("Ask the AI what suits me", "I'm choosing my first spice products. Ask me the questions you need, then suggest what to make."));
      body.append(intro, ch);
    } else if (gSeg === "how") {
      const s = el("section", "pblk"); s.append(el("h3", null, "Pick a product"));
      const pick = el("div", "chips"); Object.keys(HOW).forEach(k => { const b = el("button", "qchip" + (k === gHow ? " on" : ""), k); b.type = "button"; b.onclick = () => { gHow = k; store.set("sc.ghow", k); renderGuide(); }; pick.append(b); });
      s.append(pick);
      const H = HOW[gHow] || HOW["Turmeric powder"];
      s.append(el("p", "sub", "Every spice goes: receive & inspect → clean → dry → (roast) → grind → sieve → test → pack. Here's what's special about " + gHow.toLowerCase() + ". FSSAI maximum moisture: " + H.moist + "."));
      s.append(steps(H.steps));
      [H.src, "fssai"].filter(Boolean).forEach(k => { const a = srcLink(k); if (a) s.append(a, document.createTextNode(" ")); });
      s.append(askBtn(`Ask the AI about making ${gHow.toLowerCase()}`, `How do I manufacture ${gHow.toLowerCase()} in a small unit? What should I watch out for?`));
      body.append(s);
    } else if (gSeg === "setup") {
      const s = el("section", "pblk"); s.append(el("h3", null, "Roadmap: from idea to first sale"));
      s.append(steps(SETUP, true));
      const m = el("section", "pblk"); m.append(el("h3", null, "Machines for a small unit"), el("p", "sub", "What a small powder and masala unit typically needs. Get quotes from several makers and ask to see a machine running before you buy."));
      MACHINES.forEach(([n, need, d]) => { const r = el("div", "mrow"); r.append(el("b", null, n), el("span", "need n-" + slug(need), need), el("p", null, d)); m.append(r); });
      const toStd = el("button", "btn-lg sm", "Machine standards & buying checklist →"); toStd.type = "button"; toStd.onclick = () => showTab("guide", "standards");
      m.append(toStd, document.createElement("br"), srcLink("pepper"), askBtn("Ask the AI to plan my machines", "Plan the machines and layout for a small spice powder unit making about 200 kg a day. What do I need?"));
      body.append(s, m);
    } else if (gSeg === "standards") {
      const intro = el("section", "pblk"); intro.append(el("h3", null, "No single standard, but a well-known set"), el("p", "sub", "There is no one standard just for spice machines. Machine makers and spice companies use hygienic design guidelines, machine safety and hygiene standards, and spice-industry guidance together. Ask your machine maker which of these their machines meet, and ask for proof."));
      body.append(intro);
      STD_GROUPS.forEach(([h, d, items]) => {
        const s = el("section", "pblk"); s.append(el("h3", null, h), el("p", "sub", d));
        items.forEach(([n, t, src]) => { const r = el("div", "mrow"); r.append(el("b", null, n), el("p", null, t)); if (src) r.append(srcLink(src)); s.append(r); });
        body.append(s);
      });
      const sp = el("section", "pblk"); sp.append(el("h3", null, "Buying a machine: what to ask for"), el("p", "sub", "Put these in your enquiry to machine makers (your requirement specification), and check them when the machine arrives."));
      MACHINE_SPEC.forEach(([n, t]) => { const r = el("label", "ckrow"); const c = el("input"); c.type = "checkbox"; const k = "sc.spec." + slug(n); c.checked = !!store.get(k, false); c.onchange = () => store.set(k, c.checked); const tx = el("span"); tx.append(el("b", null, n + ": "), document.createTextNode(t)); r.append(c, tx); sp.append(r); });
      const acts = el("div", "chips"); acts.append(dlButton("⬇ Download machine spec checklist (PDF)", specPdf));
      const ask = el("button", "qchip", "Ask the AI to write a spec for my machine"); ask.type = "button"; ask.onclick = () => { setChat(true); $("q").value = "Write a requirement specification for buying a "; $("q").focus(); };
      acts.append(ask); sp.append(acts);
      body.append(sp);
    } else if (gSeg === "licences") {
      const s = el("section", "pblk"); s.append(el("h3", null, "Licences & registrations (India, Kerala)"), el("p", "sub", "Rules change, so confirm each one with the department or a consultant before you apply. Last checked: November 2026."));
      LICENCES.forEach(([n, who, d, src]) => { const r = el("div", "mrow"); r.append(el("b", null, n), el("span", "need", who)); r.append(el("p", null, d)); if (src) r.append(srcLink(src)); s.append(r); });
      const s2 = el("section", "pblk"); s2.append(el("h3", null, "Schemes that can help"));
      SCHEMES.forEach(([n, d, src]) => { const r = el("div", "mrow"); r.append(el("b", null, n)); r.append(el("p", null, d)); if (src) r.append(srcLink(src)); s2.append(r); });
      s2.append(askBtn("Ask the AI which apply to me", "I'm starting a small spice unit in Kerala. Which licences and schemes apply to me?"));
      body.append(s, s2);
    } else if (gSeg === "quality") {
      const t = el("section", "pblk"); t.append(el("h3", null, "Quality tests"), el("p", "sub", "Do quick checks (moisture, look, smell) on every batch in your own lab, and send samples to an NABL-accredited lab for the full tests."));
      TESTS.forEach(([a, b]) => { const r = el("div", "mrow"); r.append(el("b", null, a), el("p", null, b)); t.append(r); });
      const lim = el("section", "pblk"); lim.append(el("h3", null, "FSSAI moisture limits for powders"));
      const tb = el("table"); tb.innerHTML = "<thead><tr><th>Powder</th><th>Max moisture</th></tr></thead>"; const bd = el("tbody");
      [["Coriander", "9%"], ["Turmeric", "10%"], ["Cumin", "10%"], ["Chilli", "11%"], ["Black pepper", "12%"], ["Mixed masala", "12%"], ["Curry powder", "14%"]].forEach(([a, b]) => { const tr = el("tr"); tr.append(el("td", null, a), el("td", null, b)); bd.append(tr); });
      tb.append(bd); const tw = el("div", "tw qtable"); tw.append(tb); lim.append(tw, srcLink("fssai"));
      const h = el("section", "pblk"); h.append(el("h3", null, "A hygienic factory")); h.append(steps(HYGIENE));
      const l = el("section", "pblk"); l.append(el("h3", null, "What your label needs (FSSAI)")); const ul = el("ul", "glist"); LABEL.forEach(x => ul.append(el("li", null, x))); l.append(ul);
      const st = el("section", "pblk"); st.append(el("h3", null, "Storage")); st.append(steps(STORE_TIPS));
      const p = el("section", "pblk"); p.append(el("h3", null, "Common problems & fixes"));
      PROBLEMS.forEach(([a, b]) => { const r = el("div", "mrow"); r.append(el("b", null, a), el("p", null, b)); p.append(r); });
      p.append(askBtn("Describe your problem to the AI", "I have a quality problem with my spice powder: "));
      body.append(t, lim, h, l, st, p);
    } else {
      body.append(costCalc(), batchCalc());
    }
    body.append(el("p", "note pnote", "General guidance for small spice units in India, not legal or financial advice. Check rules and figures with the authorities, your bank or a consultant before investing."));
  }

  /* masala batch calculator */
  function batchCalc() {
    const s = el("section", "pblk"); s.append(el("h3", null, "Masala batch calculator"), el("p", "sub", "Write your recipe in parts (or grams), pick a batch size, and see how much of each spice to weigh out. The example is a simple home-style garam masala; use your own recipe."));
    let rows = store.get("sc.recipe", [["Coriander seed", 4], ["Cumin seed", 2], ["Black pepper", 1], ["Cardamom", 1], ["Cinnamon", 1], ["Cloves", 0.5]]);
    let batch = store.get("sc.batch", 25);
    const tbl = el("div", "rtable"); const out = el("div", "rout");
    const draw = () => {
      tbl.replaceChildren();
      rows.forEach((r, i) => {
        const row = el("div", "rrow");
        const n = el("input"); n.value = r[0]; n.setAttribute("aria-label", "Ingredient"); n.oninput = () => { rows[i][0] = n.value; save(); };
        const q = el("input"); q.type = "number"; q.min = "0"; q.step = "any"; q.inputMode = "decimal"; q.value = r[1]; q.setAttribute("aria-label", "Parts"); q.oninput = () => { rows[i][1] = parseFloat(q.value) || 0; save(); };
        const x = el("button", "icon-btn", "✕"); x.type = "button"; x.setAttribute("aria-label", "Remove " + r[0]); x.onclick = () => { rows.splice(i, 1); save(); draw(); };
        row.append(n, q, x); tbl.append(row);
      });
      const add = el("button", "qchip", "+ Add spice"); add.type = "button"; add.onclick = () => { rows.push(["", 1]); save(); draw(); }; tbl.append(add);
      calc();
    };
    const bIn = el("input"); bIn.type = "number"; bIn.min = "0"; bIn.step = "any"; bIn.inputMode = "decimal"; bIn.value = batch; bIn.oninput = () => { batch = parseFloat(bIn.value) || 0; save(); };
    const bl = el("label", "inl", "Batch size (kg) "); bl.append(bIn);
    const save = () => { store.set("sc.recipe", rows); store.set("sc.batch", batch); calc(); };
    const calc = () => {
      const tot = rows.reduce((a, r) => a + (r[1] || 0), 0); out.replaceChildren();
      if (!tot || !batch) return;
      const t = el("table"); t.innerHTML = "<thead><tr><th>Spice</th><th>Share</th><th>For " + esc(fmtN(batch)) + " kg</th></tr></thead>";
      const tb = el("tbody"); rows.filter(r => r[1] > 0).forEach(r => { const tr = el("tr"); tr.append(el("td", null, r[0] || "—"), el("td", null, (r[1] / tot * 100).toFixed(1) + "%"), el("td", null, fmtN(r[1] / tot * batch, 2) + " kg")); tb.append(tr); });
      t.append(tb); const w = el("div", "tw"); w.append(t); out.append(w);
      out.append(el("p", "note", "Weights are before roasting and grinding; roasting and grinding lose a little moisture, so the final batch weighs slightly less."));
    };
    s.append(bl, tbl, out); draw();
    return s;
  }

  /* cost & price calculator */
  const COST_DEF = { raw: 180, loss: 8, labour: 12, overhead: 8, transport: 4, packCost: { 50: 2.5, 100: 3.5, 250: 5, 500: 7, 1000: 10 }, margin: 20, trade: 25, gst: 5, product: "Turmeric powder" };
  let cost = Object.assign({}, COST_DEF, store.get("sc.cost", {}));
  function costRows() {
    const effRaw = cost.raw / Math.max(0.01, 1 - cost.loss / 100);
    const perKg = effRaw + cost.labour + cost.overhead + cost.transport;
    return Object.keys(cost.packCost).map(Number).sort((a, b) => a - b).map(g => {
      const c = perKg * g / 1000 + (cost.packCost[g] || 0);
      const exf = c * (1 + cost.margin / 100);
      const mrp = exf * (1 + cost.trade / 100) * (1 + cost.gst / 100);
      return { g, c, exf, mrp, profit: exf - c };
    }).concat([{ perKg, effRaw }]);
  }
  function costCalc() {
    const s = el("section", "pblk"); s.append(el("h3", null, "Cost & price calculator"), el("p", "sub", "Work out the cost of each pack and a selling price. All numbers are your own; the starting values are only examples, so change them to your real costs."));
    const form = el("div", "cform");
    const num = (label, key, unit, hint) => {
      const l = el("label"); l.append(el("span", null, label)); const w = el("div", "uin"); const i = el("input"); i.type = "number"; i.step = "any"; i.min = "0"; i.inputMode = "decimal"; i.value = cost[key];
      i.oninput = () => { cost[key] = parseFloat(i.value) || 0; store.set("sc.cost", cost); out(); }; w.append(i, el("small", null, unit)); l.append(w); if (hint) l.append(el("em", null, hint)); form.append(l); return i;
    };
    const rawIn = num("Raw material price", "raw", "₹/kg", "What you pay per kg of raw spice.");
    num("Cleaning & drying loss", "loss", "%", "Weight lost in cleaning, drying and grinding.");
    num("Labour & power", "labour", "₹/kg", "Wages and electricity per kg made.");
    num("Rent & other overheads", "overhead", "₹/kg", "Rent, maintenance, tests, admin per kg.");
    num("Transport", "transport", "₹/kg", "");
    num("Your margin", "margin", "%", "Your profit on top of cost.");
    num("Distributor & shop margin", "trade", "%", "What the trade keeps between you and the buyer.");
    num("GST", "gst", "%", "Check the rate for your product.");
    // market price helper
    const P = MKT.prices || {}, mrows = [...(P.india_official || []), ...(P.india_ai || [])];
    if (mrows.length) {
      const l = el("label", "wide"); l.append(el("span", null, "Use today's market price"));
      const sel = el("select"); sel.append(el("option", null, "Pick a Spices Board price…"));
      mrows.forEach((r, i) => { const o = el("option", null, `${r.spice}${r.grade ? " · " + r.grade : ""} · ${r.market}: ₹${fmtN(r.price)}/kg (${niceDate(r.date)})`); o.value = i; sel.append(o); });
      sel.onchange = () => { const r = mrows[+sel.value]; if (!r) return; cost.raw = r.price; cost.product = r.spice; rawIn.value = r.price; store.set("sc.cost", cost); out(); };
      l.append(sel, el("em", null, "Wholesale market prices; your buying price may differ.")); form.append(l);
    }
    const packs = el("div", "wide"); packs.append(el("span", "lblx", "Packing material per pack (pouch, label, carton share)"));
    const pr = el("div", "packcost");
    Object.keys(cost.packCost).map(Number).sort((a, b) => a - b).forEach(g => { const l = el("label"); l.append(el("small", null, g >= 1000 ? g / 1000 + " kg" : g + " g")); const i = el("input"); i.type = "number"; i.step = "any"; i.min = "0"; i.inputMode = "decimal"; i.value = cost.packCost[g]; i.oninput = () => { cost.packCost[g] = parseFloat(i.value) || 0; store.set("sc.cost", cost); out(); }; l.append(i, el("small", null, "₹")); pr.append(l); });
    packs.append(pr); form.append(packs);
    const res = el("div", "cres");
    const out = () => {
      const rs = costRows(), meta = rs.pop(); res.replaceChildren();
      res.append(el("p", "cbig", `Cost of finished powder: ₹${fmtN(meta.perKg, 2)} per kg`), el("p", "note", `Raw material after ${cost.loss}% loss: ₹${fmtN(meta.effRaw, 2)}/kg, plus labour, overheads and transport.`));
      const t = el("table"); t.innerHTML = "<thead><tr><th>Pack</th><th>Your cost</th><th>Your selling price</th><th>Your profit</th><th>Suggested MRP</th></tr></thead>";
      const tb = el("tbody"); rs.forEach(r => { const tr = el("tr"); tr.append(el("td", null, r.g >= 1000 ? r.g / 1000 + " kg" : r.g + " g"), el("td", null, "₹" + fmtN(r.c, 2)), el("td", null, "₹" + fmtN(r.exf, 2)), el("td", null, "₹" + fmtN(r.profit, 2)), el("td", null, "₹" + fmtN(Math.ceil(r.mrp), 0))); tb.append(tr); });
      t.append(tb); const w = el("div", "tw"); w.append(t); res.append(w);
      res.append(el("p", "note", "Suggested MRP = your selling price + trade margin + GST, rounded up. Check competitors' shelf prices too."));
    };
    const reset = el("button", "qchip", "Reset to examples"); reset.type = "button"; reset.onclick = () => { cost = JSON.parse(JSON.stringify(COST_DEF)); store.set("sc.cost", cost); renderGuide(); };
    const acts = el("div", "chips"); acts.append(reset, dlButton("⬇ Download costing PDF", costPdf));
    s.append(form, res, acts); out();
    return s;
  }
  function costPdf() {
    const d = newPdf("Spice costing"); pdfHeader(d, "Spice costing sheet", stamp());
    const rs = costRows(), meta = rs.pop();
    d.para("Inputs", { size: 12, bold: true, gap: 4 });
    d.table([{ label: "Item", w: 220, bold: true }, { label: "Value", w: d.CW - 220 }], [["Raw material price", `Rs ${fmtN(cost.raw, 2)} per kg`], ["Cleaning, drying & grinding loss", cost.loss + "%"], ["Labour & power", `Rs ${fmtN(cost.labour, 2)} per kg`], ["Rent & overheads", `Rs ${fmtN(cost.overhead, 2)} per kg`], ["Transport", `Rs ${fmtN(cost.transport, 2)} per kg`], ["Your margin", cost.margin + "%"], ["Distributor & shop margin", cost.trade + "%"], ["GST", cost.gst + "%"]]);
    d.para(`Cost of finished powder: Rs ${fmtN(meta.perKg, 2)} per kg`, { size: 12, bold: true, gap: 6 });
    d.table([{ label: "Pack", w: 70, bold: true }, { label: "Packing", w: 80, align: "r" }, { label: "Your cost", w: 90, align: "r" }, { label: "Selling price", w: 100, align: "r", bold: true }, { label: "Profit", w: 80, align: "r" }, { label: "Suggested MRP", w: d.CW - 420, align: "r", bold: true }],
      rs.map(r => [r.g >= 1000 ? r.g / 1000 + " kg" : r.g + " g", "Rs " + fmtN(cost.packCost[r.g], 2), "Rs " + fmtN(r.c, 2), "Rs " + fmtN(r.exf, 2), "Rs " + fmtN(r.profit, 2), "Rs " + fmtN(Math.ceil(r.mrp), 0)]));
    d.para("Suggested MRP = selling price + trade margin + GST, rounded up. Figures come from the numbers entered; check them against real quotes and market prices.", { size: 8.5, color: C.muted });
    return { bytes: d.bytes(), name: `Spice costing ${fileStamp()}.pdf` };
  }

  function specPdf() {
    const d = newPdf("Machine spec checklist"); pdfHeader(d, "Spice machine spec checklist", stamp());
    d.para("Machine: ______________________   Maker: ______________________   Quote no.: ____________", { size: 10, gap: 10 });
    d.h2("What we require");
    d.table([{ label: "Requirement", w: 110, bold: true }, { label: "Details", w: d.CW - 110 - 70 }, { label: "Met?", w: 70, draw: (v, x, y, w, h) => { d.rect(x + 4, y + 1, 9, 9, { stroke: C.muted }); d.text(x + 16, y + 9, "Yes", { size: 7.5, color: C.muted }); d.rect(x + 34, y + 1, 9, 9, { stroke: C.muted }); d.text(x + 46, y + 9, "No", { size: 7.5, color: C.muted }); } }],
      MACHINE_SPEC.map(([n, t]) => [n, t, ""]), { size: 8.8 });
    d.h2("Standards to ask about");
    STD_GROUPS.forEach(([h, , items]) => { d.para(h, { size: 10, bold: true, gap: 2 }); items.forEach(([n]) => d.para("• " + n, { size: 9, indent: 8, gap: 1 })); d.y += 4; });
    d.h2("Notes"); for (let i = 0; i < 5; i++) { d.room(22); d.line([[d.M, d.y + 16], [d.M + d.CW, d.y + 16]], { color: C.line, lw: 0.6 }); d.y += 22; }
    d.para("Made with Spice Guide. General guidance, not a legal specification; agree final requirements with your machine maker and auditor.", { size: 8, color: C.muted });
    return { bytes: d.bytes(), name: `Spice machine spec checklist ${fileStamp()}.pdf` };
  }

  /* guide knowledge for the chat (built-in answers + notes for the AI) */
  function guideAnswer(t) {
    t = t.toLowerCase();
    if (/\b(ehedg|iso 14159|en 1672|1672|atex|nfpa|asta|esa|hygienic design|machine standards?|standards? for (spice )?machine\w*|dust explosion|explosion)\b/.test(t))
      return { text: "**Standards for spice machines**\n\nThere's no single standard just for spice machines; these are used together:\n\n" + STD_GROUPS.map(([h, , items]) => `**${h}**\n` + items.map(([n, d]) => `- **${n}**: ${d}`).join("\n")).join("\n\n"), chips: [{ label: "Machine standards page", go: "guide", seg: "standards" }] };
    if (/\b(spec|specification|urs|rfq|buying a machine|buy a machine|machine quote|what to ask)\b/.test(t))
      return { text: "**Buying a machine: what to ask for**\n\n" + MACHINE_SPEC.map(([n, d]) => `- **${n}**: ${d}`).join("\n"), chips: [{ label: "Download the checklist", go: "guide", seg: "standards" }] };
    if (/\b(licen[cs]es?|registrations?|register|fssai|udyam|msme|gst|legal metrology|pollution|kspcb|iec|cres|permits?|noc)\b/.test(t) && /\b(need|require|get|which|what|how|start|apply|licen\w*)\b/.test(t))
      return { text: "**Licences for a spice unit in India**\n\n" + LICENCES.map(([n, w, d]) => `- **${n}** (${w}): ${d}`).join("\n") + "\n\n*Confirm each with the department; rules change.*", chips: [{ label: "Licences & schemes", go: "guide", seg: "licences" }] };
    if (/\b(subsid\w*|schemes?|pmfme|pmegp|loans?|mudra|funding|finance)\b/.test(t))
      return { text: "**Schemes that can help**\n\n" + SCHEMES.map(([n, d]) => `- **${n}**: ${d}`).join("\n"), chips: [{ label: "Licences & schemes", go: "guide", seg: "licences" }] };
    if (/\b(machines?|machinery|equipment|grinders?|pulveri[sz]ers?|blenders?|packing machines?)\b/.test(t))
      return { text: "**Machines for a small spice unit**\n\n" + MACHINES.map(([n, need, d]) => `- **${n}** (${need}): ${d}`).join("\n"), chips: [{ label: "Machines & setup", go: "guide", seg: "setup" }] };
    if (/\b(what (should|can) i (make|manufacture|produce|start)|which (spice|product)s? (to|should)|business idea|best (spice|product) to (make|start))\b/.test(t))
      return { text: "**Good spice products to start with**\n\n" + IDEAS.map(r => `- **${r[0]}** (${DIFF[r[4]].toLowerCase()}): ${r[1]} Raw material: ${r[2]} ${r[3]}.`).join("\n"), chips: [{ label: "What to make", go: "guide", seg: "what" }] };
    const m = t.match(/\b(how (do i|to|can i) (make|manufacture|produce|process)|manufactur(e|ing) (of )?|process(ing)? (of )?|steps (to|for) (make|making))\b/);
    if (m) {
      const k = Object.keys(HOW).find(k => k.toLowerCase().split(/[ (&]/).filter(w => w.length > 4).some(w => t.includes(w.replace(/s$/, "")))) || (/masala|blend|garam|sambar/.test(t) ? "Masalas & blends" : /cardamom|clove|whole|cinnamon|nutmeg/.test(t) ? "Whole spices" : null);
      if (k) return { text: `**How to make ${k.toLowerCase()}** (FSSAI max moisture: ${HOW[k].moist})\n\n` + HOW[k].steps.map(([a, b], i) => `${i + 1}. **${a}**: ${b}`).join("\n"), chips: [{ label: "Step-by-step guide", go: "guide", seg: "how", how: k }] };
      return { text: "**Setting up a spice unit**\n\n" + SETUP.map(([a, b], i) => `${i + 1}. **${a}**: ${b}`).join("\n"), chips: [{ label: "Manufacturing guide", go: "guide", seg: "setup" }] };
    }
    const pr = PROBLEMS.find(([a]) => a.toLowerCase().split(/[^a-z]+/).filter(w => w.length > 4 && !/powder|stock|tests|batches/.test(w)).some(w => t.includes(w.slice(0, 5))));
    if (pr && /\b(problem|issue|wrong|why|fix|help|my|is|are|keeps?)\b/.test(t)) return { text: `**${pr[0]}**\n\n${pr[1]}`, chips: [{ label: "Quality & hygiene", go: "guide", seg: "quality" }] };
    if (/\b(cost|costing|profit|margin|mrp|selling price|price my|how much to charge)\b/.test(t) && /\b(calculat|work out|my|pack|product|per kg|charge)\b/.test(t))
      return { text: "Use the **cost calculator**: enter your raw material price, losses, labour, overheads, packing costs and margins, and it works out cost, selling price, profit and a suggested MRP for each pack size.", chips: [{ label: "Open cost calculator", go: "guide", seg: "cost" }] };
    return null;
  }
  function guideContext(text) {
    const t = text.toLowerCase();
    if (!/manufactur|make|making|produce|process|start|unit|factory|machine|ehedg|standard|iso|atex|nfpa|asta|dust|explosion|hygien|weld|seal|spec|licen|fssai|udyam|gst|subsid|scheme|cost|margin|mrp|grind|blend|business|export/.test(t)) return "";
    return ["GUIDE (checked facts for answering manufacturing questions; still advise confirming rules with authorities):",
      "FSSAI max moisture: chilli powder 11%, turmeric powder 10%, coriander powder 9%, cumin powder 10%, black pepper powder 12%, mixed masala 12%, curry powder 14%.",
      "FSSAI tiers from 1 April 2026: basic registration up to Rs 1.5 crore turnover; state licence Rs 1.5-50 crore; central above Rs 50 crore (exporters/multi-state may need central).",
      "Exporters: IEC from DGFT + CRES from Spices Board (Rs 5,000, three-year block).",
      "PMFME: 35% credit-linked subsidy up to Rs 10 lakh for micro units; extended until September 2026, PMFME 2.0 under consideration - check current status.",
      "Pepper: thresh (mechanical ~320 kg/h), blanch ~1 min optional, sun-dry 3-5 days to ~10% moisture, clean and grade. Turmeric: cure within 2-3 days of harvest by boiling until soft, dry thin layers or below 60C, polish.",
      "Machines: " + MACHINES.map(m => m[0]).join(", ") + ".",
      "Machine standards (no single spice-machine standard; used together): " + STD_GROUPS.map(([h, , items]) => h + ": " + items.map(i => i[0] + " - " + i[1]).join("; ")).join(" | "),
      "Machine buying checklist: " + MACHINE_SPEC.map(([n, d]) => n + ": " + d).join(" "),
      "Licences: " + LICENCES.map(l => l[0]).join(", ") + "."].join("\n");
  }
