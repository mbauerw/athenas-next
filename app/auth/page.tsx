'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthPage } from '@/views/AuthPage';
import { AppProvider } from '../providers';
import { AppLayout } from '../app-layout';

const AuthPageWrapper: React.FC = () => {
  const router = useRouter();

  return (
    <AppLayout>
      <AuthPage
        onSuccess={() => router.push('/')}
        onCancel={() => router.push('/')}
      />
    </AppLayout>
  );
};

export default function Auth() {
  return (
    <AppProvider>
      <AuthPageWrapper />
    </AppProvider>
  );
}
