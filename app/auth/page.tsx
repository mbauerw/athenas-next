'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthScreen } from '@/components/AuthScreen';
import { AppProvider } from '../providers';
import { AppLayout } from '../app-layout';

const AuthPageContent: React.FC = () => {
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
};

export default function Auth() {
  return (
    <AppProvider>
      <AuthPageContent />
    </AppProvider>
  );
}
