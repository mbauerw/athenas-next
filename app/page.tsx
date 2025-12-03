'use client';

import React from 'react';
import { Dashboard } from '@/views/Dashboard';
import { useAppContext } from './providers';
import { AppLayout } from './app-layout';

export default function Home() {
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
}