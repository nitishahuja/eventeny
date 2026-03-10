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
  ).then((res) => {
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
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to bulk update status: ${res.status}`);
    }
    return res.json();
  });
}
