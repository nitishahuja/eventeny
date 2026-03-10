import { Router } from 'express';
import { getApplicantProfile } from '../controllers/profileController.js';

export const profileRouter = Router();

profileRouter.get('/:businessName', getApplicantProfile);

