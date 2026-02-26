import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/hr-system/Dashboard';
import HRPortal from '../pages/hr-system/HRPortal';
import AuthRoute from '../utils/AuthRoute';
import Unauthorized from '../pages/auth/Unauthorized';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '/dashboard',
    element: (
      <AuthRoute>
        <Dashboard />
      </AuthRoute>
    ),
  },
  {
    path: '/hr-portal',
    element: (
      <AuthRoute>
        <HRPortal />
      </AuthRoute>
    ),
    children: [
      {
        path: 'candidates',
        element: <div>Candidates Panel</div>,
      },
      {
        path: 'employees',
        element: <div>Employees Panel</div>,
      },
      {
        path: 'attendance',
        element: <div>Attendance Panel</div>,
      },
      {
        path: 'leaves',
        element: <div>Leaves Panel</div>,
      },
    ],
  },
]);

export default router; 