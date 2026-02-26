import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HRPortal from '../pages/hr-system/HRPortal';
import Dashboard from '../pages/hr-system/Dashboard';
import LeavesPage from '../pages/hr-system/leaves/LeavesPage';
import EmployeesPanel from '../pages/hr-system/panels/EmployeesPanel';
import CandidatesPanel from '../pages/hr-system/panels/CandidatesPanel';
import AttendancePanel from '../pages/hr-system/panels/AttendancePanel';
import ProtectedRoute from './ProtectedRoute';

const HRRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><HRPortal /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leaves" element={<LeavesPage />} />
        <Route path="employees" element={<EmployeesPanel />} />
        <Route path="candidates" element={<CandidatesPanel />} />
        <Route path="attendance" element={<AttendancePanel />} />
      </Route>
    </Routes>
  );
};

export default HRRoutes; 