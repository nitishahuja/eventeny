import {
  getAllApplications,
  updateApplicationStatusByBusinessNames,
} from '../store/applicationsStore.js';

export function listApplications() {
  return getAllApplications();
}

export function bulkUpdateStatus({ businessNames, status }) {
  if (!Array.isArray(businessNames) || businessNames.length === 0 || !status) {
    return { ok: false, message: 'businessNames and status are required' };
  }

  updateApplicationStatusByBusinessNames(businessNames, status);
  return { ok: true };
}

