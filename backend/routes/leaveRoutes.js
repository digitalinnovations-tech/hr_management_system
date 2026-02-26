import express from 'express';
import {
  getLeaves,
  getLeaveById,
  getEmployeeLeaves,
  createLeave,
  updateLeave,
  deleteLeave,
  updateLeaveStatus,
  getApprovedLeaves,
  downloadDocument,
} from '../controllers/leaveController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getLeaves)
  .post(createLeave);

router.route('/approved')
  .get(getApprovedLeaves);

router.route('/:id')
  .get(getLeaveById)
  .put(updateLeave)
  .delete(deleteLeave);

router.get('/employee/:id', getEmployeeLeaves);
router.put('/:id/status', admin, updateLeaveStatus);
router.get('/:leaveId/documents/:documentId', downloadDocument);

export default router; 