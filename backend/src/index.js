import express from 'express';
import cors from 'cors';
import { MOCK_ROWS, PROFILE_EXTRAS, persistRows } from './mockData.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Return all applications (same shape as mockApi getData, but unfiltered)
app.get('/api/applications', (req, res) => {
  res.json({ rows: MOCK_ROWS });
});

// Return a single applicant profile by businessName, with extra fields
app.get('/api/profile/:businessName', (req, res) => {
  const { businessName } = req.params;
  const row = MOCK_ROWS.find((r) => r.businessName === businessName);
  if (!row) {
    res.status(404).json({ ok: false, row: null });
    return;
  }
  const extras = PROFILE_EXTRAS[row.businessName] || {};
  res.json({ ok: true, row: { ...row, ...extras } });
});

// Bulk update currentStatus for a list of business names
app.post('/api/applications/bulk-status', (req, res) => {
  const { businessNames, status } = req.body || {};
  if (!Array.isArray(businessNames) || !status) {
    res.status(400).json({ ok: false, message: 'businessNames and status are required' });
    return;
  }

  businessNames.forEach((name) => {
    const row = MOCK_ROWS.find((r) => r.businessName === name);
    if (row) {
      row.currentStatus = status;
    }
  });

  persistRows();

  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});

