import React from 'react';
import { AuthScreen } from '../components/AuthScreen';

interface AuthPageProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onCancel }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <AuthScreen
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </div>
  );
};
