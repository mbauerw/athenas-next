import React, { useState } from 'react';
import { Button } from './Button';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../services/supabaseService';
import { BookOpen, User, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onCancel }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // Redirect happens automatically
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        onSuccess();
      } else {
        const { error } = await signUpWithEmail(email, password, {
          username,
          first_name: firstName,
          last_name: lastName
        });
        if (error) throw error;
        // For many setups, signup automatically logs in or requires confirmation
        // If successful without error, we can assume progress
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-library-wood overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-library-wood p-6 text-center border-b-4 border-library-gold">
          <BookOpen className="mx-auto text-library-paper mb-2" size={32} />
          <h2 className="text-2xl font-serif font-bold text-library-paper">Athena's Gate</h2>
          <p className="text-library-paperDark opacity-80 text-sm">Identify yourself to enter the archives</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-library-paperDark">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
              mode === 'login' 
                ? 'bg-white text-library-wood border-b-2 border-library-wood' 
                : 'bg-library-paperDark/30 text-gray-500 hover:bg-library-paperDark/50'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
              mode === 'register' 
                ? 'bg-white text-library-wood border-b-2 border-library-wood' 
                : 'bg-library-paperDark/30 text-gray-500 hover:bg-library-paperDark/50'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-bold text-library-wood mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-library-paperDark rounded focus:outline-none focus:border-library-wood focus:ring-1 focus:ring-library-wood"
                  placeholder="scholar@university.edu"
                />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-library-wood mb-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-library-paperDark rounded focus:outline-none focus:border-library-wood focus:ring-1 focus:ring-library-wood"
                      placeholder="Choose a scholar name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-library-wood mb-1">First Name</label>
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-library-paperDark rounded focus:outline-none focus:border-library-wood"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-library-wood mb-1">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-library-paperDark rounded focus:outline-none focus:border-library-wood"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-library-wood mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-library-paperDark rounded focus:outline-none focus:border-library-wood focus:ring-1 focus:ring-library-wood"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              disabled={isLoading}
              className="mt-6"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? 'Enter Library' : 'Register Scholar')}
            </Button>
          </form>

          <div className="my-6 flex items-center justify-center">
            <span className="bg-gray-200 h-px w-full"></span>
            <span className="px-3 text-xs text-gray-500 uppercase">Or</span>
            <span className="bg-gray-200 h-px w-full"></span>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            fullWidth 
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Continue with Google
          </Button>

          <div className="mt-4 text-center">
            <button 
              onClick={onCancel} 
              className="text-sm text-gray-500 hover:text-library-wood underline"
            >
              Continue as Guest
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};