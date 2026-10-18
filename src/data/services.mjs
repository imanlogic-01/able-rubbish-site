// Primary service first. Each service has a full standalone landing page at /services/<slug>.

export const services = [
  {
    slug: 'waste-removal',
    primary: true,
    name: 'Waste Removal',
    navLabel: 'Waste & Rubbish Removal',
    keyword: 'waste removal service Essex & east London',
    title: 'Waste Removal Service | Essex & East London | Able Rubbish',
    metaDescription:
      'Household, bulky and commercial waste removal across Basildon, south Essex and east London. We load, carry and take it all away. Free quotes on 07407 415289.',
    h1: 'Waste removal that’s loaded, carried and gone the same visit',
    label: 'Primary service',
    heroLead:
      'From a single sofa to a full van of household rubbish, we do the lifting, load our caged tipper and take it away — so you don’t have to hire a skip, borrow a van or queue at the tip.',
    summary:
      'Household rubbish, bulky furniture, appliances and commercial waste — lifted from wherever it is and taken away in one visit.',
    image: 'van',
    featureImage: 'garagesBefore',
    beforeAfter: ['garagesBefore', 'garagesAfter'],
    beforeAfterSecondary: ['driveBefore', 'driveAfter'],
    beforeAfterSecondaryCaption: 'Waste removal — a mattress, wheelchair, suitcase and household rubbish cleared from a front drive.',
    intro: [
      'Waste removal is a collection service where a team comes to your property, loads your unwanted items and rubbish into a vehicle and takes it away for disposal. You don’t need to move anything to the kerb first.',
      'Able Rubbish and Gardening Services removes household, bulky and commercial waste across Basildon and the surrounding towns. Tell us what needs to go, get a free quote, and we’ll arrange a time that suits you — 7 days a week, from 6am to 11pm.',
    ],
    includes: [
      { title: 'Household rubbish', text: 'Bagged rubbish, clutter, boxes, old toys, bedding and the general build-up that bin collections won’t take.' },
      { title: 'Bulky items', text: 'Sofas, mattresses, beds, wardrobes, tables, carpets and other furniture that won’t fit in a car.' },
      { title: 'Appliances', text: 'Washing machines, cookers, fridges and freezers. Some appliances need specialist handling, so mention them when you ask for a quote.' },
      { title: 'Garage and shed clear-outs', text: 'Years of stored items, old tools, paint tins, bikes and broken garden furniture.' },
      { title: 'Shop and office waste', text: 'Old office furniture, shop fittings, stock packaging and one-off commercial clear-outs.' },
      { title: 'Wait and load', text: 'We arrive while you or your trades are working and load as you go, so waste never piles up on site.' },
    ],
    whoFor: [
      'Homeowners and tenants with more rubbish than the bins will take',
      'Families helping a relative clear out or downsize',
      'Landlords and letting agents between tenancies',
      'Shops, offices and small businesses with one-off waste',
      'Anyone without a van, time or the ability to lift heavy items',
    ],
    benefits: [
      { title: 'No skip, no permit', text: 'Nothing sits on your drive or road for days, and you don’t need a skip permit for the street.' },
      { title: 'We do the heavy lifting', text: 'Items are carried out from wherever they are — upstairs, in the loft or at the back of the garden.' },
      { title: 'One clear quote', text: 'You’re quoted for the job before we start, based on what you actually need removed.' },
      { title: 'Early and late slots', text: 'We work 7 days a week, from 6am to 11pm, so collections can fit around work.' },
    ],
    process: [
      { title: 'Tell us what’s going', text: 'Call, send a quote request or share photos. A rough idea of the items and how much there is helps.' },
      { title: 'Get a free quote', text: 'We price the job on volume, type of waste and access, and agree a collection time with you.' },
      { title: 'We load everything', text: 'The team carries items out and loads the van, leaving the area clear.' },
      { title: 'Taken away', text: 'Your waste leaves with us in the same visit. Nothing is left for you to deal with.' },
    ],
    jobTypes: ['Single-item sofa or mattress collection', 'Full garage clear-out', 'Loft and spare-room clutter', 'End-of-tenancy rubbish', 'Office furniture disposal', 'Shop fitting removal', 'Post-party or post-move rubbish', 'Scrap and broken appliances'],
    faqs: [
      {
        q: 'How much does waste removal cost?',
        a: 'The price depends on how much there is, what type of waste it is and how easy it is to reach. A single bulky item costs far less than a full van load, and items such as fridges, mattresses or plasterboard can cost more to dispose of. Call 07407 415289 or send photos for a free quote before any work starts.',
      },
      {
        q: 'Do I need to bring everything outside first?',
        a: 'No. We carry items out from inside the property, the garden, the garage or the loft. If you can point us to what’s going, we’ll do the lifting.',
      },
      {
        q: 'Can you collect today?',
        a: 'Often, yes. Same-day and next-day collections depend on where you are and what’s already booked, so call 07407 415289 and we’ll tell you the earliest slot.',
      },
      {
        q: 'What can’t you take?',
        a: 'Tell us about anything hazardous — such as asbestos, chemicals, gas bottles or clinical waste — when you request a quote. Some materials need specialist disposal and we’ll be upfront about what we can and can’t remove.',
      },
      {
        q: 'Do you remove commercial waste?',
        a: 'Yes. We carry out one-off clearances for shops, offices and trades, including office furniture, shop fittings and packaging waste.',
      },
    ],
    related: ['house-clearance', 'builders-waste-removal', 'garden-clearance'],
  },
  {
    slug: 'house-clearance',
    name: 'House Clearance',
    navLabel: 'House Clearance',
    keyword: 'house clearance Basildon',
    title: 'House Clearance in Basildon, Essex & East London | Able Rubbish',
    metaDescription:
      'Full and partial house clearances, flat clearances, garage and loft clear-outs across Basildon, Essex and east London. Free quotes — call 07407 415289.',
    h1: 'House clearances handled carefully, from one room to the whole property',
    label: 'Clearance service',
    heroLead:
      'Whether you’re moving, managing a relative’s home or getting a rental ready, we clear the rooms you need emptied and take everything away — leaving floors clear and ready for what comes next.',
    summary:
      'Full or partial clearances of houses, flats, garages and lofts — ideal for moves, downsizing, end of tenancy and family homes.',
    image: 'hallwayBefore',
    featureImage: 'hallwayAfter',
    beforeAfter: ['hallwayBefore', 'hallwayAfter'],
    intro: [
      'A house clearance is the removal of furniture, belongings and rubbish from part or all of a property, so it can be sold, let, renovated or lived in again.',
      'Able Rubbish and Gardening Services clears houses, flats and apartments across Basildon, south Essex and east London. We can clear a single room, a loft or garage, or a whole property in one go — and we’ll agree exactly what stays and what goes before we start.',
    ],
    includes: [
      { title: 'Whole-property clearances', text: 'Every room emptied of furniture, belongings and rubbish, down to clear floors.' },
      { title: 'Partial clearances', text: 'Just the rooms, items or areas you choose — the rest stays exactly where it is.' },
      { title: 'Flat and apartment clearances', text: 'Stairs and communal areas handled with care, with items carried down and loaded quickly.' },
      { title: 'Loft, garage and shed clear-outs', text: 'The spaces that fill up over decades, cleared in a single visit.' },
      { title: 'End-of-tenancy clearances', text: 'Left-behind furniture and rubbish removed so the property is ready to re-let.' },
      { title: 'Office clearances', text: 'Desks, chairs, filing cabinets and general office waste removed.' },
    ],
    whoFor: [
      'Families clearing a parent’s or relative’s home',
      'People downsizing or moving house',
      'Landlords and letting agents between tenants',
      'Homeowners preparing for renovation work',
      'Businesses leaving or refitting an office',
    ],
    benefits: [
      { title: 'You decide what goes', text: 'We walk through what’s staying and what’s leaving before anything is moved.' },
      { title: 'Less stress at a hard time', text: 'Clearing a family home can be emotional. We keep it straightforward and respectful.' },
      { title: 'Done in a visit', text: 'Most clearances are completed in a single visit, depending on the size of the property.' },
      { title: 'Rubbish and belongings together', text: 'One team removes furniture, clutter and general waste — no separate collections to arrange.' },
    ],
    process: [
      { title: 'Talk it through', text: 'Tell us the property type, the rooms involved and any items that must stay. Photos help.' },
      { title: 'Free quote', text: 'We price on the volume, the number of rooms, stairs and access, and agree a date.' },
      { title: 'Clearance day', text: 'The team carries everything out, loads the van and works room by room.' },
      { title: 'Clear and ready', text: 'You’re left with emptied rooms, ready for cleaning, sale, letting or renovation.' },
    ],
    jobTypes: ['Family home clearance', 'Flat clearance with stairs', 'Loft clear-out', 'Garage clear-out', 'End-of-tenancy clearance', 'Downsizing clearance', 'Hoarded property clearance', 'Office clearance'],
    faqs: [
      {
        q: 'How much does a house clearance cost?',
        a: 'House clearance prices depend on the size of the property, how full it is, how many floors are involved and whether there are items that need specialist disposal. We give a free quote first, and photos or a quick walkthrough help us price accurately.',
      },
      {
        q: 'How long does a house clearance take?',
        a: 'A room or garage is usually cleared within a few hours. A full house depends on how much there is and the access — we’ll give you an idea of timing when we quote.',
      },
      {
        q: 'Do I need to be there during the clearance?',
        a: 'It helps to be there at the start, so we can confirm what stays and what goes. After that, many customers leave us to it — just arrange access with us beforehand.',
      },
      {
        q: 'Can you clear a flat on an upper floor?',
        a: 'Yes. Let us know the floor, whether there’s a lift and any parking restrictions when you ask for a quote, so we can plan the job properly.',
      },
      {
        q: 'Can you clear just part of a property?',
        a: 'Yes. Partial clearances are common — a single bedroom, the loft, the garage or just the bulky furniture.',
      },
    ],
    related: ['waste-removal', 'garden-clearance', 'builders-waste-removal'],
  },
  {
    slug: 'builders-waste-removal',
    name: 'Builders’ Waste Removal',
    navLabel: 'Builders’ Waste & Rubble',
    keyword: 'builders waste removal Basildon',
    title: 'Builders’ Waste & Rubble Removal in Basildon | Able Rubbish',
    metaDescription:
      'Builders’ waste, rubble, construction debris, strip-outs and demolition waste removed across Basildon, Essex and east London. Wait and load available. 07407 415289.',
    h1: 'Builders’ waste and rubble removed without waiting for a skip',
    label: 'Trade service',
    heroLead:
      'Bagged rubble, timber, old kitchens and strip-out waste loaded straight from site. Book a one-off collection or a wait-and-load visit to keep your job moving and your drive clear.',
    summary:
      'Rubble, construction debris, strip-out and demolition waste collected from homes and sites — including wait-and-load visits.',
    image: 'buildersBags',
    featureImage: 'buildersPile',
    beforeAfter: null,
    intro: [
      'Builders’ waste removal is the collection of rubble, timber, plasterboard, packaging and other debris created during building, renovation and demolition work.',
      'Able Rubbish and Gardening Services collects builders’ waste for homeowners and trades across Basildon, south Essex and east London. We handle trades clearances, strip-outs and demolition waste, and our wait-and-load service means we load as you work — no skip permit, no waste left on the road.',
    ],
    includes: [
      { title: 'Rubble and hardcore', text: 'Bagged or loose brick, concrete, tiles and soil from building and landscaping work.' },
      { title: 'Construction debris', text: 'Timber offcuts, packaging, old pipework and general site waste.' },
      { title: 'Strip-outs', text: 'Old kitchens, bathrooms, flooring and fitted furniture removed and taken away.' },
      { title: 'Demolition waste', text: 'Waste from knocking down garages, sheds, outbuildings and internal walls.' },
      { title: 'Plasterboard', text: 'Plasterboard is disposed of separately from general waste, so let us know if it’s part of the load.' },
      { title: 'Wait and load', text: 'We stay on site while the waste is loaded, ideal for tight streets where a skip isn’t practical.' },
    ],
    whoFor: [
      'Homeowners with leftover waste after building work',
      'Builders, plumbers, electricians and kitchen fitters',
      'Landlords refurbishing between tenants',
      'Properties where a skip won’t fit or needs a permit',
      'DIY renovators with bags of rubble and old fittings',
    ],
    benefits: [
      { title: 'Keep the site clear', text: 'Regular collections stop waste from blocking drives, gardens and access.' },
      { title: 'No skip permits', text: 'Nothing is left on the road, so there’s no permit to arrange with the council.' },
      { title: 'Loaded for you', text: 'Our team does the lifting — your trades stay on the work they’re paid for.' },
      { title: 'Strip-out and removal in one', text: 'We can take out old fittings and remove the waste in the same visit.' },
    ],
    process: [
      { title: 'Describe the waste', text: 'Tell us what’s on site — rubble, timber, plasterboard, fittings — and roughly how much.' },
      { title: 'Quote and booking', text: 'We price on volume, waste type and access, then book a collection or wait-and-load slot.' },
      { title: 'Load on site', text: 'We load bags, loose waste and fittings straight into the van.' },
      { title: 'Site left clear', text: 'The waste leaves with us and the area is left clear.' },
    ],
    jobTypes: ['Bagged rubble collection', 'Kitchen strip-out', 'Bathroom rip-out', 'Garage demolition waste', 'Shed demolition and removal', 'Trades clearance', 'Renovation clear-up', 'Wait and load on site'],
    faqs: [
      {
        q: 'Is builders’ waste removal cheaper than a skip?',
        a: 'It often works out better for smaller jobs, tight streets or where you’d need a skip permit, because you only pay for the waste removed and we do the loading. For a long project, regular collections or wait-and-load visits keep the site clear. We’ll give you a free quote so you can compare.',
      },
      {
        q: 'Do you take rubble and soil?',
        a: 'Yes. Rubble, hardcore and soil are heavy, so tell us roughly how many bags or how much loose material there is so we can quote accurately.',
      },
      {
        q: 'Can you take plasterboard?',
        a: 'Yes, but plasterboard has to be kept separate from general waste for disposal. Please mention it when you ask for a quote.',
      },
      {
        q: 'Do you demolish sheds and garages?',
        a: 'We carry out strip-outs and demolition of structures such as sheds and outbuildings, and remove the waste. Describe the structure and send photos, and we’ll confirm what’s involved.',
      },
      {
        q: 'What is a wait-and-load service?',
        a: 'Instead of a skip sitting outside for days, we arrive with the van and wait while the waste is loaded — by us or by your trades — then take it straight away.',
      },
    ],
    related: ['waste-removal', 'house-clearance', 'garden-clearance'],
  },
  {
    slug: 'garden-clearance',
    name: 'Garden Clearance',
    navLabel: 'Garden Clearance',
    keyword: 'garden clearance Basildon',
    title: 'Garden Clearance & Tree Removal in Basildon | Able Rubbish',
    metaDescription:
      'Overgrown garden clearance, tree removal, green waste removal, hedge work, shed removal and garden tidy-ups across Basildon, Essex and east London. Free quotes.',
    h1: 'Garden clearance and tree removal that give you your outdoor space back',
    label: 'Gardening service',
    heroLead:
      'Overgrown gardens, trees, hedges, broken fencing, old sheds and years of garden rubbish — cut back, cleared and taken away, so the garden is usable again.',
    summary:
      'Overgrown gardens cut back and cleared, trees removed or cut back, green waste and garden rubbish taken away, plus hedge and shed work.',
    image: 'gardenOvergrownAfter',
    featureImage: 'treeAfter',
    beforeAfter: ['gardenOvergrownBefore', 'gardenOvergrownAfter'],
    beforeAfterSecondary: ['treeBefore', 'treeAfter'],
    beforeAfterSecondaryCaption: 'Tree removal — a large tree taken down and the area left clear.',
    intro: [
      'Garden clearance is the cutting back, clearing and removal of overgrowth, green waste and rubbish from a garden, leaving it tidy and ready to use, plant or landscape.',
      'Able Rubbish and Gardening Services clears front and back gardens across Basildon, south Essex and east London. Alongside clearance, we remove and cut back trees, take down old sheds and fencing, and take away all the waste we create.',
    ],
    includes: [
      { title: 'Overgrown gardens', text: 'Long grass, brambles, weeds and self-seeded growth cut back to a manageable garden.' },
      { title: 'Green waste removal', text: 'Grass cuttings, hedge trimmings, branches, leaves and bagged garden waste taken away.' },
      { title: 'Tree removal and cutting back', text: 'Trees taken down or cut back, with the branches, logs and cuttings all removed from site.' },
      { title: 'Hedge trimming and removal', text: 'Hedges cut back or taken out, with every trimming removed.' },
      { title: 'Shed, greenhouse and fence removal', text: 'Old structures dismantled and removed along with broken fence panels.' },
      { title: 'Garden rubbish', text: 'Old furniture, toys, pots, paving slabs and general rubbish left in the garden.' },
      { title: 'Garden tidy-ups and restoration', text: 'Lawns cut and gardens left neat after clearance, ready for new planting or turf.' },
    ],
    whoFor: [
      'Homeowners with a garden that’s got out of hand',
      'Families preparing a home for sale',
      'Landlords getting gardens ready for new tenants',
      'Older residents who can’t manage heavy garden work',
      'Anyone planning landscaping who needs a blank canvas',
    ],
    benefits: [
      { title: 'Use the garden again', text: 'Space for children to play, somewhere to sit, room to grow — not a no-go area.' },
      { title: 'Waste taken with us', text: 'No bags of cuttings left behind for weeks, and no trips to the tip.' },
      { title: 'Kerb appeal', text: 'A cleared front garden makes a property easier to sell or let.' },
      { title: 'Clearance and gardening in one', text: 'One team to cut back, clear, remove structures and take the waste.' },
    ],
    process: [
      { title: 'Show us the garden', text: 'Send photos or describe the size, what’s overgrown and anything that needs removing.' },
      { title: 'Free quote', text: 'We price on the size of the garden, the amount of growth and waste, and access.' },
      { title: 'Cut back and clear', text: 'The team clears growth, dismantles structures and bags or loads the waste.' },
      { title: 'Left tidy', text: 'Everything is removed and the garden is left neat and ready to use.' },
    ],
    jobTypes: ['Overgrown back garden', 'Front garden tidy-up', 'Hedge trimming and removal', 'Tree removal', 'Tree cutting back', 'Shed removal', 'Greenhouse removal', 'Broken fence panel removal', 'Green waste collection'],
    faqs: [
      {
        q: 'How much does garden clearance cost?',
        a: 'Garden clearance prices depend on the size of the garden, how overgrown it is, how much waste there is and access to the road. A small front garden tidy costs far less than a large overgrown back garden with a shed to remove. We give free quotes, and photos help.',
      },
      {
        q: 'Do you take the garden waste away?',
        a: 'Yes. All green waste, cuttings and garden rubbish we clear goes with us — you won’t be left with piles of bags.',
      },
      {
        q: 'Do you remove sheds and greenhouses?',
        a: 'Yes. We dismantle and remove old sheds, greenhouses and broken fencing, and take the materials away.',
      },
      {
        q: 'Can you access a back garden with no side gate?',
        a: 'Usually, yes — waste can be carried through the property with care. Tell us about access when you ask for a quote so we can plan for it.',
      },
      {
        q: 'Do you remove trees?',
        a: 'Yes. We take trees down or cut them back, and remove all the branches, logs and cuttings. Send photos and tell us about the tree and access. If a tree is protected you may need permission first, and we’ll flag that when we quote.',
      },
    ],
    related: ['waste-removal', 'house-clearance', 'builders-waste-removal'],
  },
];

export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
