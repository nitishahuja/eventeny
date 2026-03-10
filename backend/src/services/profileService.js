import { getApplicationByBusinessName } from '../store/applicationsStore.js';
import { getProfileExtras } from '../store/profileExtrasStore.js';

export function getProfileByBusinessName(businessName) {
  const row = getApplicationByBusinessName(businessName);
  if (!row) return null;
  const extras = getProfileExtras(businessName);
  return { ...row, ...extras };
}

