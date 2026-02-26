import express from 'express';
import {
  getAttendanceRecords,
  getEmployeeAttendance,
  getAttendanceByDate,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from '../controllers/attendanceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getAttendanceRecords)
  .post(createAttendance);

router.route('/:id')
  .put(updateAttendance)
  .delete(admin, deleteAttendance);

router.get('/employee/:id', getEmployeeAttendance);
router.get('/date/:date', getAttendanceByDate);

export default router; 