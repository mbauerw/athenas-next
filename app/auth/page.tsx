'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthScreen } from '../../components/AuthScreen';
import { AppLayout } from '../app-layout';

export default function Auth() {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <AuthScreen
          onSuccess={() => router.push('/')}
          onCancel={() => router.push('/')}
        />
      </div>
    </AppLayout>
  );
}
