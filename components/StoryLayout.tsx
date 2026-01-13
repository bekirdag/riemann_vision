
import React, { useState, useEffect, useRef } from 'react';

export interface StoryStep {
  id: string;
  title: string;
  narrative: React.ReactNode;
  action?: () => void;
}

interface StoryLayoutProps {
  steps: StoryStep[];
  children: React.ReactNode;
  onExploreFreely?: () => void;
  isUnlocked?: boolean;
}

const StoryLayout: React.FC<StoryLayoutProps> = ({ steps, children, onExploreFreely, isUnlocked }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleStepClick = (index: number) => {
    setActiveStepIndex(index);
    steps[index].action?.();
  };

  useEffect(() => {
    // Trigger initial step action
    steps[0].action?.();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-6 overflow-hidden">
      {/* Left Panel: Narrative Guide (30%) */}
      <aside className="lg:w-[30%] flex flex-col gap-4 overflow-hidden shrink-0">
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4 pb-12" ref={scrollContainerRef}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer group ${
                activeStepIndex === index
                  ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-900/10'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  activeStepIndex === index ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  {index + 1}
                </span>
                <h3 className={`text-sm font-bold uppercase tracking-widest ${
                  activeStepIndex === index ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  {step.title}
                </h3>
              </div>
              <div className={`text-xs leading-relaxed transition-colors ${
                activeStepIndex === index ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {step.narrative}
              </div>
            </div>
          ))}

          {!isUnlocked && onExploreFreely && (
            <button
              onClick={onExploreFreely}
              className="w-full py-4 mt-4 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-slate-700 shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Unlock Sandbox Mode</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </button>
          )}
          
          {isUnlocked && (
             <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl">
               <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest text-center">
                 Sandbox Unlocked: Use UI controls to explore freely
               </p>
             </div>
          )}
        </div>
      </aside>

      {/* Right Panel: Interactive Graph (70%) */}
      <main className="flex-1 h-full min-w-0 bg-slate-900/20 rounded-2xl overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default StoryLayout;
