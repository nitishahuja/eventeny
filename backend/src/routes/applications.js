import { Router } from 'express';
import {
  getApplications,
  bulkUpdateApplicationStatus,
} from '../controllers/applicationsController.js';

export const applicationsRouter = Router();

applicationsRouter.get('/', getApplications);
applicationsRouter.post('/bulk-status', bulkUpdateApplicationStatus);

