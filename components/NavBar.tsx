
import React, { useState } from 'react';
import { ChevronDown, Book, PenTool, GraduationCap, Users, FileText, Coffee, Bookmark, Target } from 'lucide-react';

type NavSection = 'Quizzes' | 'Practice' | 'Tests' | 'Forum';

interface NavLink {
  label: string;
  icon: React.ReactNode;
}

export const NAV_DATA: Record<NavSection, NavLink[]> = {
  Quizzes: [
    { label: "Daily Vocabulary Blitz", icon: <Book size={18} /> },
    { label: "Quant Quick Fire", icon: <Target size={18} /> },
    { label: "Sentence Equivalence Challenge", icon: <FileText size={18} /> },
    { label: "Data Interpretation Drills", icon: <Target size={18} /> },
  ],
  Practice: [
    { label: "Adaptive Verbal Section", icon: <Book size={18} /> },
    { label: "Adaptive Quant Section", icon: <Target size={18} /> },
    { label: "Analytical Writing Essay", icon: <PenTool size={18} /> },
    { label: "Review Flagged Questions", icon: <Bookmark size={18} /> },
  ],
  Tests: [
    { label: "Full-Length Mock Test 1", icon: <GraduationCap size={18} /> },
    { label: "Full-Length Mock Test 2", icon: <GraduationCap size={18} /> },
    { label: "Diagnostic Test", icon: <FileText size={18} /> },
    { label: "Section-Adaptive Preview", icon: <Target size={18} /> },
  ],
  Forum: [
    { label: "General Discussion", icon: <Users size={18} /> },
    { label: "Study Groups", icon: <Coffee size={18} /> },
    { label: "Exam Strategy & Tips", icon: <GraduationCap size={18} /> },
    { label: "Admissions Advice", icon: <FileText size={18} /> },
  ]
};

export const NavBar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<NavSection | null>(null);

  const toggleMenu = (menu: NavSection) => {
    setActiveMenu(prev => prev === menu ? null : menu);
  };

  return (
    <nav className="bg-transparent border-t border-library-wood/30 relative z-40">
      <div className="container mx-auto px-4">
        {/* Top Level Links */}
        <ul className="flex items-center gap-8">
          {(Object.keys(NAV_DATA) as NavSection[]).map((section) => (
            <li key={section}>
              <button
                onClick={() => toggleMenu(section)}
                className={`
                  flex items-center gap-1 py-3 px-2 text-sm font-bold tracking-wide uppercase transition-colors border-b-4
                  ${activeMenu === section 
                    ? 'text-white border-library-gold bg-library-wood/20' 
                    : 'text-library-paper/90 border-transparent hover:text-white hover:bg-library-wood/10'
                  }
                `}
              >
                {section}
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-300 ${activeMenu === section ? 'rotate-180' : ''}`} 
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mega Menu Dropdown */}
      {activeMenu && (
        <div className="absolute top-full left-0 w-full bg-library-paper border-b-4 border-library-gold shadow-2xl animate-fade-in z-50">
          <div className="container mx-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1: Description */}
              <div className="col-span-1 border-r border-library-wood/10 pr-8">
                <h3 className="text-2xl font-serif font-bold text-library-wood mb-2">{activeMenu}</h3>
                <p className="text-library-ink/70 italic font-serif">
                  {activeMenu === 'Quizzes' && "Quick exercises to sharpen your mind between classes."}
                  {activeMenu === 'Practice' && "Deep dives into specific topics with untimed problem sets."}
                  {activeMenu === 'Tests' && "Simulate the actual exam experience under timed conditions."}
                  {activeMenu === 'Forum' && "Connect with fellow scholars and share knowledge."}
                </p>
              </div>

              {/* Column 2 & 3: Links */}
              <div className="col-span-2 grid grid-cols-2 gap-4">
                {NAV_DATA[activeMenu].map((link, idx) => (
                  <a 
                    key={idx} 
                    href="#" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-library-wood/5 transition-colors group"
                  >
                    <div className="text-library-woodLight group-hover:text-library-wood transition-colors">
                      {link.icon}
                    </div>
                    <span className="font-sans font-semibold text-library-ink group-hover:text-library-wood transition-colors">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom Decorative Strip */}
          <div className="h-2 bg-library-wood w-full opacity-10"></div>
        </div>
      )}
      
      {/* Overlay to close menu when clicking outside */}
      {activeMenu && (
        <div 
          className="fixed inset-0 top-[100px] bg-black/20 z-30" 
          onClick={() => setActiveMenu(null)}
        />
      )}
    </nav>
  );
};
