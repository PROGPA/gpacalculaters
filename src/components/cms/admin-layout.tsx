import React from 'react';
import { useCMS } from './cms-context';
import { AdminLogin } from './admin-login';
import { AdminDashboard } from './admin-dashboard';

export function AdminLayout() {
  const { isLoggedIn } = useCMS();

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}