import { getProfileByBusinessName } from '../services/profileService.js';

export function getApplicantProfile(req, res, next) {
  try {
    const { businessName } = req.params;
    const profile = getProfileByBusinessName(businessName);

    if (!profile) {
      res.status(404).json({ ok: false, row: null });
      return;
    }

    res.json({ ok: true, row: profile });
  } catch (err) {
    next(err);
  }
}

