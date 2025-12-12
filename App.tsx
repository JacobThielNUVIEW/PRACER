
import React, { useEffect } from 'react';
import { RouterProvider, useRouter, usePathname } from './lib/router-context';
import DashboardLayout from './app/(dashboard)/layout';
import DashboardPage from './app/(dashboard)/dashboard/page';
import TrainingLogPage from './app/(dashboard)/training-log/page';
import RacesPage from './app/(dashboard)/races/page';
import ProfilePage from './app/(dashboard)/profile/page';
import SettingsPage from './app/(dashboard)/settings/page';
import LoginPage from './app/(auth)/login/page';

const AppRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Debug logging
  console.log("Current Path:", pathname);

  // 1. Auth Routes (Login & Signup)
  if (pathname === '/login' || pathname === '/signup') {
    return <LoginPage />;
  }

  // 2. Dashboard Routes (and Catch-All)
  // We determine the content based on path, but default to DashboardPage
  // so we never return null (white screen).
  let content = <DashboardPage />;

  if (pathname === '/training-log') {
    content = <TrainingLogPage />;
  } else if (pathname === '/races') {
    content = <RacesPage />;
  } else if (pathname === '/profile') {
    content = <ProfilePage />;
  } else if (pathname === '/settings') {
    content = <SettingsPage />;
  }
  
  // Wrap in Dashboard Layout
  return (
    <DashboardLayout>
      {content}
    </DashboardLayout>
  );
};

const App: React.FC = () => {
  return (
    <RouterProvider>
      <AppRoutes />
    </RouterProvider>
  );
};

export default App;
