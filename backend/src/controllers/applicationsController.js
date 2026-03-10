import {
  listApplications,
  bulkUpdateStatus,
} from '../services/applicationsService.js';

export function getApplications(req, res) {
  res.json({ rows: listApplications() });
}

export function bulkUpdateApplicationStatus(req, res, next) {
  try {
    const { businessNames, status } = req.body || {};
    const result = bulkUpdateStatus({ businessNames, status });

    if (!result.ok) {
      res.status(400).json({ ok: false, message: result.message });
      return;
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

