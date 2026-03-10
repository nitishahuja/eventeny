const PROFILE_EXTRAS = {
  'Acme Events Co': {
    contact: {
      name: 'Jordan Kim',
      title: 'Event Operations',
      email: 'contact@acmeevents.com',
      phone: '+1 (415) 555-0139',
    },
    website: 'https://acmeevents.com',
    address: '88 Townsend St, San Francisco, CA',
    country: 'United States',
    description:
      'Acme Events Co provides full-service food concessions for large outdoor events with a focus on sustainable packaging and fast throughput.',
    company: {
      yearsInBusiness: 11,
      headquarters: 'San Francisco, CA',
      teamSize: 22,
    },
    offerings: {
      categories: ['vendor', 'catering'],
      highlights: ['Smash burgers', 'Street tacos', 'Craft sodas', 'Express line'],
      priceRange: '$$',
      allergens: ['Gluten', 'Dairy'],
      dietary: ['Vegetarian option'],
    },
    booth: {
      requestedSize: '10×20',
      setupTimeMinutes: 150,
      loadInWindow: '8:30 AM – 10:30 AM',
      power: { needed: true, watts: 3500, notes: '2× 20A circuits preferred' },
      water: { needed: true, notes: 'Potable water hookup preferred' },
      propane: { needed: true, tanks: 2 },
      refrigeration: { needed: true, notes: '1× undercounter unit' },
    },
    compliance: {
      w9OnFile: true,
      insurance: { required: true, status: 'Verified', expiresOn: '2026-10-15' },
      permits: ['Health permit', 'Fire inspection'],
      salesTaxId: 'CA-FTB-2910',
    },
    internal: {
      priority: 'High',
      reviewer: 'Casey (Ops)',
      lastReviewedOn: '2026-03-06',
      flags: ['Power draw high'],
      notes:
        'Strong performer in past events. Confirm electrical layout early; recommend placing near service entrance.',
    },
    documents: [
      { name: 'Insurance Certificate.pdf', type: 'Insurance', url: '#' },
      { name: 'Health Permit.pdf', type: 'Permit', url: '#' },
    ],
  },
  'Green Catering': {
    contact: {
      name: 'Ava Patel',
      title: 'Owner',
      email: 'hello@greencatering.io',
      phone: '+1 (206) 555-0171',
    },
    website: 'https://greencatering.io',
    address: '424 Pine St, Seattle, WA',
    country: 'United States',
    description:
      'Farm-to-table catering specializing in vegetarian and vegan menus. Experienced with VIP backstage service and high-volume booths.',
    company: { yearsInBusiness: 6, headquarters: 'Seattle, WA', teamSize: 12 },
    offerings: {
      categories: ['vendor', 'catering'],
      highlights: ['Vegan bowls', 'Seasonal salads', 'Cold brew', 'Allergen labeling'],
      priceRange: '$$',
      allergens: ['Tree nuts'],
      dietary: ['Vegan', 'Gluten-free option'],
    },
    booth: {
      requestedSize: '10×20',
      setupTimeMinutes: 120,
      loadInWindow: '9:00 AM – 11:00 AM',
      power: { needed: true, watts: 3000, notes: 'Hot holding + POS' },
      water: { needed: true, notes: 'Handwash station required' },
      propane: { needed: false, tanks: 0 },
      refrigeration: { needed: true, notes: '2× coolers' },
    },
    compliance: {
      w9OnFile: false,
      insurance: { required: true, status: 'Pending', expiresOn: '2026-12-31' },
      permits: ['Health permit', 'Food handler certification'],
      salesTaxId: 'Pending',
    },
    internal: {
      priority: 'Normal',
      reviewer: 'Riley (Food)',
      lastReviewedOn: '2026-03-02',
      flags: ['Needs W-9', 'Insurance pending'],
      notes:
        'Menu is a great fit. Approve contingent on insurance + W-9 upload; confirm cold storage plan.',
    },
    documents: [{ name: 'Menu & Allergen List.pdf', type: 'Menu', url: '#' }],
  },
  'Tech Expo Inc': {
    contact: {
      name: 'Morgan Lee',
      title: 'Technical Producer',
      email: 'info@techexpo.example',
      phone: '+1 (312) 555-0198',
    },
    website: 'https://techexpo.example',
    address: '100 W Randolph St, Chicago, IL',
    country: 'United States',
    description:
      'Technical production partner providing staging, AV, and exhibitor support for indoor/outdoor expos.',
    company: { yearsInBusiness: 14, headquarters: 'Chicago, IL', teamSize: 35 },
    offerings: {
      categories: ['sponsor', 'av'],
      highlights: ['Stage build', 'LED wall', 'RF coordination', 'On-site tech desk'],
      priceRange: '$$$',
      allergens: [],
      dietary: [],
    },
    booth: {
      requestedSize: '10×10',
      setupTimeMinutes: 90,
      loadInWindow: '7:00 AM – 9:00 AM',
      power: { needed: true, watts: 2000, notes: 'Dedicated circuit for demo rack' },
      water: { needed: false, notes: '' },
      propane: { needed: false, tanks: 0 },
      refrigeration: { needed: false, notes: '' },
    },
    compliance: {
      w9OnFile: true,
      insurance: { required: true, status: 'Verified', expiresOn: '2027-01-31' },
      permits: [],
      salesTaxId: 'IL-REG-5541',
    },
    internal: {
      priority: 'High',
      reviewer: 'Dana (Production)',
      lastReviewedOn: '2026-03-05',
      flags: ['Load-in early'],
      notes:
        'Preferred production partner. Reserve early load-in and confirm dock access; ensure RF plan shared with venue.',
    },
    documents: [],
  },
  'Bright Signs LLC': {
    contact: {
      name: 'Sam Rivera',
      title: 'Account Manager',
      email: 'hello@brightsigns.example',
      phone: '+1 (646) 555-0112',
    },
    website: 'https://brightsigns.example',
    address: '25 W 35th St, New York, NY',
    country: 'United States',
    offerings: {
      categories: ['vendor', 'signage'],
      highlights: ['Wayfinding', 'Sponsor banners', 'Day-of installs'],
      priceRange: '$$',
      allergens: [],
      dietary: [],
    },
    booth: {
      requestedSize: '10×10',
      setupTimeMinutes: 45,
      loadInWindow: '9:00 AM – 11:00 AM',
      power: { needed: false, watts: 0, notes: '' },
      water: { needed: false, notes: '' },
      propane: { needed: false, tanks: 0 },
      refrigeration: { needed: false, notes: '' },
    },
    compliance: {
      w9OnFile: true,
      insurance: { required: true, status: 'Pending', expiresOn: '2026-09-30' },
      permits: [],
      salesTaxId: 'NY-REG-2210',
    },
    internal: {
      priority: 'Normal',
      reviewer: 'Taylor (Brand)',
      lastReviewedOn: '2026-03-03',
      flags: [],
      notes:
        'Good signage vendor; confirm install crew size and whether ladder access is required in venue.',
    },
    documents: [{ name: 'Production Capabilities.pdf', type: 'Capabilities', url: '#' }],
  },
  'Summit Productions': {
    contact: {
      name: 'Chris Nguyen',
      title: 'Talent Coordinator',
      email: 'bookings@summitproductions.example',
      phone: '+1 (310) 555-0191',
    },
    website: 'https://summitproductions.example',
    address: '300 S Broadway, Los Angeles, CA',
    country: 'United States',
    offerings: {
      categories: ['entertainment'],
      highlights: ['Live band', 'Stage management', 'Meet & greet'],
      priceRange: '$$$',
      allergens: [],
      dietary: [],
    },
    booth: {
      requestedSize: 'N/A',
      setupTimeMinutes: 60,
      loadInWindow: '12:00 PM – 2:00 PM',
      power: { needed: true, watts: 1000, notes: 'Backline + monitors' },
      water: { needed: false, notes: '' },
      propane: { needed: false, tanks: 0 },
      refrigeration: { needed: false, notes: '' },
    },
    compliance: {
      w9OnFile: true,
      insurance: { required: true, status: 'Verified', expiresOn: '2026-11-01' },
      permits: [],
      salesTaxId: 'N/A',
    },
    internal: {
      priority: 'High',
      reviewer: 'Jamie (Programming)',
      lastReviewedOn: '2026-03-04',
      flags: ['Soundcheck needed'],
      notes:
        'Great crowd engagement. Confirm soundcheck time and stage plot; coordinate with venue audio team.',
    },
    documents: [{ name: 'Stage Plot.pdf', type: 'Tech Rider', url: '#' }],
  },
};

export function getProfileExtras(businessName) {
  return PROFILE_EXTRAS[businessName] || {};
}

