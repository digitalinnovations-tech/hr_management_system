import express from 'express';
import {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  addCandidateInterview,
  downloadResume,
  convertToEmployee,
} from '../controllers/candidateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getCandidates)
  .post(createCandidate);

router.route('/:id')
  .get(getCandidateById)
  .put(updateCandidate)
  .delete(deleteCandidate);

router.route('/:id/interviews')
  .post(addCandidateInterview);

// New routes
router.route('/:id/resume')
  .get(downloadResume);

router.route('/:id/convert')
  .post(convertToEmployee);

export default router; 