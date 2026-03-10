import { getApplicationByBusinessName } from '../store/applicationsStore.js';
import { getProfileExtras } from '../store/profileExtrasStore.js';

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');
}

function makeDefaultProfileExtras(row) {
  const businessName = row?.businessName || 'vendor';
  const slug = slugify(businessName);
  const isFood = row?.application === 'Food & Beverage';
  const isAV = row?.application === 'AV & Tech';
  const isEntertainment = row?.application === 'Entertainment';
  const isSignage = row?.application === 'Signage & Branding';

  const boothSize = isFood ? '10×20' : isAV ? '10×10' : isSignage ? '10×10' : '10×10';
  const powerWatts = isFood ? 3000 : isAV ? 2000 : isEntertainment ? 1000 : 500;
  const setupMins = isFood ? 120 : isAV ? 90 : isEntertainment ? 60 : 45;

  const defaultOfferings = isFood
    ? ['Signature entrée', 'Beverages', 'Dessert option']
    : isSignage
      ? ['Banners', 'Wayfinding signage', 'On-site install']
      : isAV
        ? ['A/V support', 'Stage support', 'Equipment rentals']
        : isEntertainment
          ? ['Live performance', 'MC services', 'Soundcheck coordination']
          : ['Booth activation', 'Sampling', 'Brand engagement'];

  return {
    contact: {
      name: businessName.includes(' ') ? `${businessName.split(' ')[0]} Team` : 'Vendor Team',
      title: isFood ? 'Operations Manager' : isAV ? 'Technical Lead' : 'Owner',
      email: `${slug || 'vendor'}@example.com`,
      phone: '+1 (555) 123-4567',
    },
    company: {
      yearsInBusiness: 3,
      headquarters: 'United States',
      teamSize: isFood ? 8 : 4,
    },
    offerings: {
      categories: Array.isArray(row?.tag) ? row.tag : [],
      highlights: defaultOfferings,
      priceRange: isFood ? '$$' : '$$',
      allergens: isFood ? ['Dairy', 'Gluten'] : [],
      dietary: isFood ? ['Vegetarian option'] : [],
    },
    booth: {
      requestedSize: boothSize,
      setupTimeMinutes: setupMins,
      loadInWindow: '9:00 AM – 11:00 AM',
      power: {
        needed: powerWatts > 0,
        watts: powerWatts,
        notes: isFood ? '2× 20A circuits preferred' : isAV ? 'Dedicated circuit for rack' : '',
      },
      water: { needed: isFood, notes: isFood ? 'Access to potable water' : '' },
      propane: { needed: isFood, tanks: isFood ? 2 : 0 },
      refrigeration: { needed: isFood, notes: isFood ? '1× undercounter unit' : '' },
    },
    compliance: {
      w9OnFile: false,
      insurance: {
        required: true,
        status: 'Pending',
        expiresOn: '2026-12-31',
      },
      permits: isFood ? ['Health permit', 'Food handler certification'] : [],
      salesTaxId: isFood ? 'Pending' : 'N/A',
    },
    internal: {
      priority: row?.currentStatus === 'Approved' ? 'High' : 'Normal',
      reviewer: 'Ops Team',
      lastReviewedOn: '2026-03-01',
      flags: [],
      notes:
        'Review booth requirements, confirm load-in window, and verify compliance documents before final confirmation.',
    },
  };
}

export function getProfileByBusinessName(businessName) {
  const row = getApplicationByBusinessName(businessName);
  if (!row) return null;
  const defaults = makeDefaultProfileExtras(row);
  const extras = getProfileExtras(businessName);
  return { ...row, ...defaults, ...extras };
}

