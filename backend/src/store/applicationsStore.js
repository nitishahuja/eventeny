import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'applications.json');

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

let rows = [];

function tryLoadRowsFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to read applications.json:', err);
  }
  return null;
}

function tryPersistRowsToDisk() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error('Failed to persist applications.json:', err);
  }
}

function init() {
  const loaded = tryLoadRowsFromDisk();
  if (loaded) {
    rows = loaded;
    return;
  }
  rows = SEED_ROWS;
  tryPersistRowsToDisk();
}

init();

export function getAllApplications() {
  return rows;
}

export function getApplicationByBusinessName(businessName) {
  return rows.find((r) => r.businessName === businessName);
}

export function updateApplicationStatusByBusinessNames(businessNames, status) {
  const set = new Set(businessNames);
  rows.forEach((row) => {
    if (set.has(row.businessName)) {
      row.currentStatus = status;
    }
  });
  tryPersistRowsToDisk();
}

