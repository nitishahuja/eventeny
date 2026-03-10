import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'applications.json');

// Base seed used when no persisted file exists yet
const SEED_ROWS = [
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

// Initialize rows from disk if available; otherwise seed and persist
export let MOCK_ROWS = SEED_ROWS;

try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      MOCK_ROWS = parsed;
    }
  } else {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(MOCK_ROWS, null, 2));
  }
} catch (err) {
  // If anything goes wrong, fall back to in-memory seed data
  console.error('Failed to initialize MOCK_ROWS from disk:', err);
}

export const PROFILE_EXTRAS = {
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

export function persistRows() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(MOCK_ROWS, null, 2));
  } catch (err) {
    console.error('Failed to persist MOCK_ROWS to disk:', err);
  }
}

