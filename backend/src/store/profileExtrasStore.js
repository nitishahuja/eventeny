const PROFILE_EXTRAS = {
  'Acme Events Co': {
    email: 'contact@acmeevents.com',
    phone: '+1 (415) 555-0139',
    website: 'https://acmeevents.com',
    address: '88 Townsend St, San Francisco, CA',
    country: 'United States',
    description:
      'Acme Events Co provides full-service food concessions for large outdoor events with a focus on sustainable packaging and fast throughput.',
    documents: [
      { name: 'Insurance Certificate.pdf', type: 'Insurance', url: '#' },
      { name: 'Health Permit.pdf', type: 'Permit', url: '#' },
    ],
  },
  'Green Catering': {
    email: 'hello@greencatering.io',
    phone: '+1 (206) 555-0171',
    website: 'https://greencatering.io',
    address: '424 Pine St, Seattle, WA',
    country: 'United States',
    description:
      'Farm-to-table catering specializing in vegetarian and vegan menus. Experienced with VIP backstage service and high-volume booths.',
    documents: [{ name: 'Menu & Allergen List.pdf', type: 'Menu', url: '#' }],
  },
  'Tech Expo Inc': {
    email: 'info@techexpo.example',
    phone: '+1 (312) 555-0198',
    website: 'https://techexpo.example',
    address: '100 W Randolph St, Chicago, IL',
    country: 'United States',
    description:
      'Technical production partner providing staging, AV, and exhibitor support for indoor/outdoor expos.',
    documents: [],
  },
};

export function getProfileExtras(businessName) {
  return PROFILE_EXTRAS[businessName] || {};
}

