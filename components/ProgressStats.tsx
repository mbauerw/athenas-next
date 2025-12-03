import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { GraduationCap, ChevronDown, BookOpen, Calculator } from 'lucide-react';
import type { UserProgressStats } from '@/types';

// 1. Reusable Card Component
interface StatCardProps {
  icon: React.ElementType;
  title: string;
  attempted: number;
  total: number;
  percentage: number;
  label: string;
  colorClass: string;
  onClick?: () => void;
  isExpanded?: boolean;
  isMain?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  attempted,
  total,
  percentage,
  label,
  colorClass,
  onClick,
  isExpanded,
  isMain = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-library-wood text-library-paper rounded-lg shadow-md relative overflow-hidden group select-none w-full
        ${isMain ? 'cursor-pointer' : ''}
      `}
    >
      <div className="p-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-library-paper/10 rounded-full">
            <Icon size={32} />
          </div>
          <div>
            <h4 className="text-xl font-serif font-bold flex items-center gap-2">
              {title}
              {isMain && (
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: .6 }}
                >
                  <ChevronDown size={18} className="opacity-70" />
                </motion.div>
              )}
            </h4>
            <p className="text-library-paperDark/80 text-sm mt-1">
              Questions Attempted: {attempted} / {total}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold font-serif">
            {percentage}%
          </div>
          <p className="text-sm opacity-80">{label}</p>
        </div>
      </div>

      {/* Visual Progress Bar (Background Fill) */}
      <div className="absolute bottom-0 left-0 w-full h-3 bg-black/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className={`h-full ${colorClass}`}
        />
      </div>
    </div>
  );
};

// 2. Animation Variants

// Controls the container visibility
const listVariants: Variants = {
  expanded: {
    opacity: 1,
    transition: {
      staggerChildren: .2,
      when: "beforeChildren",
      duration: .4
    }
  },
  collapsed: {
    opacity: 0,
    transition: {
      staggerChildren: 0.2,
      staggerDirection: -1,
      when: "afterChildren",
      duration: 0.4 // Quick fade out for container after children collapse
    }
  }
};

// Controls the individual card sliding movement
const itemVariants: Variants = {
  expanded: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 }
  },
  collapsed: {
    y: -120, // Moves UP behind the main card
    opacity: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeInOut" }
  }
};

// 3. Main Component
interface ProgressStatsProps {
  userStats: UserProgressStats | null;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ userStats }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!userStats) return null;

  // --- Calculations ---
  const totalAccuracy = userStats.totalAttempted > 0
    ? Math.round((userStats.totalCorrect / userStats.totalAttempted) * 100)
    : 0;

  // Mock Data (Assuming 50/50 split for demo if not provided)
  const verbalTotal = Math.round(userStats.totalQuestions / 2);
  const verbalAttempted = Math.round(userStats.totalAttempted / 2);
  const verbalPercent = verbalTotal > 0 ? Math.round((verbalAttempted / verbalTotal) * 100) : 0;

  const quantTotal = userStats.totalQuestions - verbalTotal;
  const quantAttempted = userStats.totalAttempted - verbalAttempted;
  const quantPercent = 85;

  return (
    // z-40 ensures the entire component (when expanded) sits above the content below it (like the Footer or Next Section)
    <div className="max-w-5xl mx-auto mt-8 relative z-40">
      
      {/* 
        MAIN CARD
        z-50: Highest priority. It stays on top of its own children.
      */}
      <div className="relative z-50 bg-library-wood rounded-lg shadow-md">
        <StatCard 
          icon={GraduationCap}
          title="Total Progress"
          attempted={userStats.totalAttempted}
          total={userStats.totalQuestions}
          percentage={totalAccuracy}
          label="Accuracy Rate"
          colorClass="bg-yellow-500/80"
          isMain={true}
          isExpanded={isExpanded}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>

      {/* 
        EXPANDABLE STACK CONTAINER 
        absolute: Removes it from flow so it overlays content below.
        top-24: Starts roughly at the bottom of the main card (~96px).
        left-0 w-full: Matches width.
      */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="content"
            variants={listVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="absolute top-24 mt-2 left-0 w-full flex flex-col pointer-events-none" // pointer-events-none on wrapper to pass clicks through gaps, enable on children
          >
            {/* 
               VERBAL CARD 
               z-40: Below Main Card (z-50) but above Quant (z-30).
               pointer-events-auto: Re-enable clicking if we add click handlers later.
            */}
            <motion.div 
              variants={itemVariants} 
              className="relative z-40 mt-2 pointer-events-auto" 
            >
              <StatCard 
                icon={BookOpen}
                title="Verbal Progress"
                attempted={verbalAttempted}
                total={verbalTotal}
                percentage={verbalPercent}
                label="Completion Rate"
                colorClass="bg-blue-400/80"
              />
            </motion.div>

            {/* 
               QUANT CARD 
               z-30: Below Verbal.
            */}
            <motion.div 
              variants={itemVariants} 
              className="relative z-30 mt-4 pointer-events-auto" 
            >
              <StatCard 
                icon={Calculator}
                title="Quant Progress"
                attempted={quantAttempted}
                total={quantTotal}
                percentage={quantPercent}
                label="Retention Score"
                colorClass="bg-green-400/80"
              />
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressStats;