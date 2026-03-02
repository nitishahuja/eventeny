/**
 * Mock API: returns rows filtered by search and filters.
 * Row shape: { businessName, tag, application, payment, currentStatus, date }
 */

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
]

/**
 * @param {string} searchValue - Search in businessName and application
 * @param {Object} filters - Optional: { application?: string, status?: string[], payment?: string[] }
 * @returns {Promise<Array>} Rows matching search and filters
 */
export function getData(searchValue = '', filters = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rows = [...MOCK_ROWS]

      const search = (searchValue || '').trim().toLowerCase()
      if (search) {
        rows = rows.filter(
          (row) =>
            row.businessName.toLowerCase().includes(search) ||
            row.application.toLowerCase().includes(search) ||
            row.tag.some((t) => t.toLowerCase().includes(search))
        )
      }

      if (filters.application) {
        rows = rows.filter((row) => row.application === filters.application)
      }
      if (filters.status && filters.status.length > 0) {
        const set = new Set(filters.status)
        rows = rows.filter((row) => set.has(row.currentStatus))
      }
      if (filters.payment && filters.payment.length > 0) {
        const set = new Set(filters.payment)
        rows = rows.filter((row) => set.has(row.payment))
      }

      resolve(rows)
    }, 300)
  })
}

/**
 * Mock update: mutate in-memory row status and return updated row
 * @param {string} businessName
 * @param {string} newStatus - one of: 'Approved', 'Rejected', 'Waitlisted', 'Withdrawn', 'Awaiting decision'
 * @returns {Promise<{ok: boolean, row: any}>}
 */

/**
 * Mock profile fetch: returns a single applicant by businessName
 * @param {string} businessName
 * @returns {Promise<{ok: boolean, row: any}>}
 */
export function getApplicantProfile(businessName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const row = MOCK_ROWS.find((r) => r.businessName === businessName);
      // Enriched mock profile details by businessName
      const EXTRAS = {
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
          documents: [
            { name: 'Menu & Allergen List.pdf', type: 'Menu', url: '#' },
          ],
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
      if (row) resolve({ ok: true, row: { ...row, ...(EXTRAS[row.businessName] || {}) } });
      else resolve({ ok: false, row: null });
    }, 200);
  });
}
