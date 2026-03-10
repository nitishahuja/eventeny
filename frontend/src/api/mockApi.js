const MOCK_ROWS = [
  {
    businessName: 'Acme Events Co',
    tag: ['vendor', 'catering'],
    application: 'Food & Beverage',
    payment: 'paid',
    currentStatus: 'Approved',
    date: '2025-02-15',
  },
  {
    businessName: 'Bright Signs LLC',
    tag: ['vendor', 'signage'],
    application: 'Signage & Branding',
    payment: 'Not Paid',
    currentStatus: 'Awaiting decision',
    date: '2025-02-18',
  },
  {
    businessName: 'Summit Productions',
    tag: ['entertainment'],
    application: 'Entertainment',
    payment: 'paid',
    currentStatus: 'Approved',
    date: '2025-02-10',
  },
  {
    businessName: 'Green Catering',
    tag: ['vendor', 'catering'],
    application: 'Food & Beverage',
    payment: 'Not Paid',
    currentStatus: 'Waitlisted',
    date: '2025-02-20',
  },
  {
    businessName: 'Tech Expo Inc',
    tag: ['sponsor'],
    application: 'Sponsorship',
    payment: 'paid',
    currentStatus: 'Approved',
    date: '2025-02-12',
  },
  {
    businessName: 'Local Flavor Kitchen',
    tag: ['vendor', 'catering'],
    application: 'Food & Beverage',
    payment: 'Not Paid',
    currentStatus: 'Rejected',
    date: '2025-02-22',
  },
  {
    businessName: 'Premier Audio Visual',
    tag: ['vendor', 'av'],
    application: 'AV & Tech',
    payment: 'paid',
    currentStatus: 'Approved',
    date: '2025-02-08',
  },
  {
    businessName: 'Metro Florals',
    tag: ['vendor', 'decor'],
    application: 'Decor & Florals',
    payment: 'Not Paid',
    currentStatus: 'Awaiting decision',
    date: '2025-02-25',
  },
  {
    businessName: 'City Sound DJs',
    tag: ['entertainment'],
    application: 'Entertainment',
    payment: 'paid',
    currentStatus: 'Approved',
    date: '2025-02-11',
  },
  {
    businessName: 'Fresh Bites Catering',
    tag: ['vendor', 'catering'],
    application: 'Food & Beverage',
    payment: 'Not Paid',
    currentStatus: 'Waitlisted',
    date: '2025-02-19',
  },
  {
    businessName: 'Elite Sponsors Group',
    tag: ['sponsor'],
    application: 'Sponsorship',
    payment: 'paid',
    currentStatus: 'Approved',
    date: '2025-02-09',
  },
  {
    businessName: 'Stage Right Events',
    tag: ['vendor', 'entertainment'],
    application: 'Entertainment',
    payment: 'Not Paid',
    currentStatus: 'Rejected',
    date: '2025-02-24',
  },
  {
    businessName: 'Banner World',
    tag: ['vendor', 'signage'],
    application: 'Signage & Branding',
    payment: 'paid',
    currentStatus: 'Approved',
    date: '2025-02-14',
  },
  {
    businessName: 'Gourmet Street Kitchen',
    tag: ['vendor', 'catering'],
    application: 'Food & Beverage',
    payment: 'paid',
    currentStatus: 'Awaiting decision',
    date: '2025-02-26',
  },
  {
    businessName: 'Spark AV Solutions',
    tag: ['vendor', 'av'],
    application: 'AV & Tech',
    payment: 'Not Paid',
    currentStatus: 'Waitlisted',
    date: '2025-02-17',
  },
  {
    businessName: 'Bloom & Petal',
    tag: ['vendor', 'decor'],
    application: 'Decor & Florals',
    payment: 'paid',
    currentStatus: 'Approved',
    date: '2025-02-13',
  },
  {
    businessName: 'Main Stage Band',
    tag: ['entertainment'],
    application: 'Entertainment',
    payment: 'Not Paid',
    currentStatus: 'Awaiting decision',
    date: '2025-02-27',
  },
  {
    businessName: 'Global Events Sponsor',
    tag: ['sponsor'],
    application: 'Sponsorship',
    payment: 'Not Paid',
    currentStatus: 'Rejected',
    date: '2025-02-21',
  },
  {
    businessName: 'Quick Print Signs',
    tag: ['vendor', 'signage'],
    application: 'Signage & Branding',
    payment: 'Not Paid',
    currentStatus: 'Awaiting decision',
    date: '2025-02-23',
  },
  {
    businessName: 'Pacific Catering Co',
    tag: ['vendor', 'catering'],
    application: 'Food & Beverage',
    payment: 'paid',
    currentStatus: 'Waitlisted',
    date: '2025-02-16',
  },
];

/** Extra profile fields keyed by businessName */
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

// -----------------------------------------------------------------------------
// Filter helpers (pure)
// -----------------------------------------------------------------------------

function matchSearch(row, search) {
  if (!search) return true;
  const q = search.trim().toLowerCase();
  return (
    row.businessName.toLowerCase().includes(q) ||
    row.application.toLowerCase().includes(q) ||
    row.tag.some((t) => t.toLowerCase().includes(q))
  );
}

export function applyFilters(rows, searchValue, filters) {
  let result = rows;
  const search = (searchValue || '').trim().toLowerCase();

  result = result.filter((row) => matchSearch(row, search));

  if (filters.application) {
    result = result.filter((row) => row.application === filters.application);
  }
  if (filters.status?.length) {
    const statusSet = new Set(filters.status);
    result = result.filter((row) => statusSet.has(row.currentStatus));
  }
  if (filters.payment?.length) {
    const paymentSet = new Set(filters.payment);
    result = result.filter((row) => paymentSet.has(row.payment));
  }

  return result;
}

const MOCK_DELAY_MS = 300;
const PROFILE_DELAY_MS = 200;

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

/**
 * Returns the full dataset (client-side filtering happens in App).
 * @returns {Promise<Array>} All rows
 */
export function getData() {
  return fetch(`${API_BASE_URL}/api/applications`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load applications: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.rows)) return data.rows;
      return [];
    });
}

/**
 * Returns a single applicant profile by businessName, with optional extra fields.
 * @param {string} businessName
 * @returns {Promise<{ ok: boolean, row: object | null }>}
 */
export function getApplicantProfile(businessName) {
  return fetch(
    `${API_BASE_URL}/api/profile/${encodeURIComponent(businessName)}`,
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load profile: ${res.status}`);
      }
      return res.json();
    });
}

/**
 * Bulk update status for the given business names.
 * Backend updates its in-memory store; frontend also updates local state.
 * @param {string[]} businessNames
 * @param {string} status
 * @returns {Promise<{ ok: boolean }>}
 */
export function bulkUpdateStatus(businessNames, status) {
  if (!Array.isArray(businessNames) || !status) {
    return Promise.resolve({ ok: false });
  }

  return fetch(`${API_BASE_URL}/api/applications/bulk-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ businessNames, status }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to bulk update status: ${res.status}`);
      }
      return res.json();
    })
    .catch(() => ({ ok: false }));
}
