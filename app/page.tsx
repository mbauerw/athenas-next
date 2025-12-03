'use client';

import React from 'react';
import { Dashboard } from '@/views/Dashboard';
import { AppProvider, useAppContext } from './providers';
import { AppLayout } from './app-layout';

const DashboardPage: React.FC = () => {
  const { authUser, progress, userStats, startPractice } = useAppContext();

  return (
    <AppLayout>
      <Dashboard
        authUser={authUser}
        progress={progress}
        userStats={userStats}
        onStartPractice={startPractice}
      />
    </AppLayout>
  );
};

export default function Home() {
  return (
    <AppProvider>
      <DashboardPage />
    </AppProvider>
  );
}
