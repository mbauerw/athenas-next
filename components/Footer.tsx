import React from 'react';
import { Library } from 'lucide-react';
import { NAV_DATA } from './NavBar';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-library-wood/10 pt-16 pb-12 mt-16 relative z-10">
      <div className="container mx-auto px-4">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {(Object.keys(NAV_DATA) as Array<keyof typeof NAV_DATA>).map((category) => (
            <div key={category} className="col-span-1">
              <h4 className="font-serif font-bold text-library-wood uppercase tracking-widest mb-6 text-sm">
                {category}
              </h4>
              <ul className="space-y-4">
                {NAV_DATA[category].map((link, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-library-wood transition-colors text-sm font-medium block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-library-paperDark mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-library-wood p-2 rounded-full text-white shadow-sm">
              <Library size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-library-wood leading-none tracking-wide">Athena's Library</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">GRE Prep Archives</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-sm font-medium">
            © {new Date().getFullYear()} Athena's Library. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};