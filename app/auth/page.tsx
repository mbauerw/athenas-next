'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthPage } from '@/views/AuthPage';
import { AppLayout } from '../app-layout';

export default function Auth() {
  const router = useRouter();

  return (
    <AppLayout>
      <AuthPage
        onSuccess={() => router.push('/')}
        onCancel={() => router.push('/')}
      />
    </AppLayout>
  );
}