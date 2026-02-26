import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes accessible by admin and HR roles
router.route('/')
  .get(getEmployees)
  .post(admin, createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(admin, updateEmployee)
  .delete(admin, deleteEmployee);

export default router; 