'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Library, LogOut, UserCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/Button';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { useAppContext } from './providers';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { authUser, returnToDashboard, handleSignOut } = useAppContext();

  // Check for API key
  const apiKeyMissing = !process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (apiKeyMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-library-paper p-4">
        <div className="max-w-md text-center p-8 border-2 border-library-wood rounded-lg bg-white shadow-xl">
          <AlertTriangle className="mx-auto text-amber-600 mb-4" size={48} />
          <h1 className="text-2xl font-serif font-bold text-library-wood mb-2">Missing Library Access Key</h1>
          <p className="text-library-ink mb-4">
            The Librarian requires an API Key to access the archives. Please ensure <code>process.env.API_KEY</code> is set in your environment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-library-paper flex flex-col font-sans text-library-ink relative">
      <div
        className="absolute top-0 left-0 right-0 h-[100vh] pointer-events-none z-0 bg-cover bg-top bg-no-repeat"
        style={{
          backgroundImage: "url('/library-athena.png')",
          maskImage: 'radial-gradient(ellipse 70% 150% at 50% 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 70%)',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-[100vh] pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle 35vw at 50% 15%, rgb(69, 106, 254) 0%, rgba(47, 65, 226, 0.78) 70%, rgba(105, 88, 255, 0) 100%)'        }}
      />

      {/* --- Navigation / Header --- */}
      <header className="bg-library-wood text-white shadow-lg sticky top-0 z-50 border-b-4 border-library-gold relative">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={returnToDashboard}
          >
            <div className="bg-white p-2 rounded-full text-library-wood shadow-inner">
              <Library size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-wide leading-none">Athena&apos;s Library</h1>
              <p className="text-xs text-library-paperDark opacity-80 uppercase tracking-widest">GRE Prep Archives</p>
            </div>
          </div>
          <NavBar />

          <div className="flex items-center gap-4">
            {pathname === '/practice' && (
              <Button variant="outline" onClick={returnToDashboard} className="text-white border-white hover:bg-white/20 text-sm py-2 px-4 hidden md:block">
                Reading Room
              </Button>
            )}

            {authUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs opacity-80">Logged in as</p>
                  <p className="font-bold text-sm text-library-gold">{authUser.user_metadata.username || authUser.email?.split('@')[0]}</p>
                </div>
                <Button variant="secondary" onClick={handleSignOut} className="px-3 py-1 text-xs">
                  <LogOut size={14} className="mr-1" /> Sign Out
                </Button>
              </div>
            ) : (
              pathname !== '/auth' && (
                <Button variant="secondary" onClick={() => router.push('/auth')} className="px-4 py-2">
                  <UserCircle size={18} className="mr-2" /> Login / Register
                </Button>
              )
            )}
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-grow container  mx-auto px-4 pb-0 relative"
      >

        {children}
      </main>
      <Footer />
    </div>
  );
};
