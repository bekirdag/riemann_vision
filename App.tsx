
import React, { useState } from 'react';
import { ViewMode } from './types';
import ZeroHunter from './components/ZeroHunter';
import Landscape3D from './components/Landscape3D';
import PrimeStaircase from './components/PrimeStaircase';
import ConceptMap from './components/ConceptMap';
import HarmonicSynthesis from './components/HarmonicSynthesis';
import AtomicWave from './components/AtomicWave';
import MixingDeck from './components/MixingDeck';
import DerivativeLink from './components/DerivativeLink';
import IntroMystery from './components/IntroMystery';
import EulerGoldenKey from './components/EulerGoldenKey';
import RiemannTwist from './components/RiemannTwist';
import HypothesisStatement from './components/HypothesisStatement';

const VIEW_SEQUENCE = [
  // Act I: The Mystery
  { mode: ViewMode.INTRO_MYSTERY, label: "0. The Great Mystery", color: "bg-slate-700", act: "Act I: The Mystery" },
  { mode: ViewMode.EULER_GOLDEN_KEY, label: "1. Euler's Golden Key", color: "bg-amber-600", act: "Act I: The Mystery" },
  
  // Act II: The Machine
  { mode: ViewMode.RIEMANN_TWIST, label: "2. Riemann's Twist", color: "bg-indigo-600", act: "Act II: The Machine" },
  { mode: ViewMode.HYPOTHESIS_STATEMENT, label: "3. The Hypothesis", color: "bg-cyan-600", act: "Act II: The Machine" },
  
  // Act III: The Landscape
  { mode: ViewMode.CONCEPT_MAP, label: "4. Concept Map", color: "bg-cyan-600", act: "Act III: The Landscape" },
  { mode: ViewMode.LANDSCAPE_3D, label: "5. 3D Landscape", color: "bg-cyan-600", act: "Act III: The Landscape" },
  { mode: ViewMode.ZERO_HUNTER, label: "6. 2D Zero Hunter", color: "bg-cyan-600", act: "Act III: The Landscape" },
  
  // Act IV: The Connection
  { mode: ViewMode.ATOMIC_WAVE, label: "7. The Atomic Wave", color: "bg-amber-600", act: "Act IV: The Connection" },
  { mode: ViewMode.MIXING_DECK, label: "8. The Mixing Deck", color: "bg-indigo-600", act: "Act IV: The Connection" },
  { mode: ViewMode.HARMONIC_SYNTHESIS, label: "9. Harmonic Synthesis", color: "bg-rose-600", act: "Act IV: The Connection" },
  { mode: ViewMode.DERIVATIVE_LINK, label: "10. The Derivative Link", color: "bg-emerald-600", act: "Act IV: The Connection" },
  { mode: ViewMode.PRIME_STAIRCASE, label: "11. Prime Verification", color: "bg-cyan-600", act: "Act IV: The Connection" },
];

const App: React.FC = () => {
  const [tStart, setTStart] = useState<number>(0);
  const [tEnd, setTEnd] = useState<number>(30);
  const [iterations, setIterations] = useState<number>(150);
  const [xMax, setXMax] = useState<number>(100);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.INTRO_MYSTERY);
  
  const [formulaInput, setFormulaInput] = useState<string>("x / (log(x) - 1.08366)");
  const [plottedFormula, setPlottedFormula] = useState<string>("x / (log(x) - 1.08366)");
  const [formulaError, setFormulaError] = useState<string | null>(null);

  const handleTStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setTStart(val);
    if (val >= tEnd) setTEnd(val + 10);
  };

  const handleTEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setTEnd(val);
    if (val <= tStart) setTStart(Math.max(0, val - 10));
  };

  const handlePlotFormula = () => {
    setPlottedFormula(formulaInput);
    setFormulaError(null);
  };

  const currentStepIndex = VIEW_SEQUENCE.findIndex(v => v.mode === viewMode);
  const nextStep = VIEW_SEQUENCE[currentStepIndex + 1];

  const goToNextStep = () => {
    if (nextStep && nextStep.mode) {
      setViewMode(nextStep.mode as ViewMode);
    }
  };

  // Grouped steps for sidebar
  const acts = ["Act I: The Mystery", "Act II: The Machine", "Act III: The Landscape", "Act IV: The Connection"];

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-80 p-6 flex flex-col gap-6 bg-slate-900 border-r border-slate-800 shadow-xl z-10 shrink-0 overflow-y-auto custom-scrollbar">
        <header>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-900/20">ζ</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Riemann Vision
            </h1>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed uppercase tracking-widest font-bold">
            Interactive Exploration
          </p>
        </header>

        <div className="space-y-6 flex-1">
          {acts.map((act) => (
            <section key={act} className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">
                {act}
              </label>
              <div className="flex flex-col gap-1">
                {VIEW_SEQUENCE.filter(s => s.act === act).map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => setViewMode(item.mode as ViewMode)}
                    className={`w-full py-2 px-3 rounded-md text-[11px] font-bold text-left transition-all border ${
                      viewMode === item.mode
                        ? `${item.color} text-white border-transparent shadow-lg scale-[1.02]`
                        : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>
          ))}

          {/* Contextual Settings */}
          <div className="pt-4 border-t border-slate-800 space-y-6">
            {(viewMode === ViewMode.ZERO_HUNTER || viewMode === ViewMode.LANDSCAPE_3D) && (
              <>
                <section>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3">
                    Imaginary Range (t)
                  </label>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Start</span>
                        <span className="text-cyan-400">{tStart.toFixed(1)}</span>
                      </div>
                      <input
                        type="range" min="0" max="150" step="1"
                        value={tStart} onChange={handleTStartChange}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>End</span>
                        <span className="text-cyan-400">{tEnd.toFixed(1)}</span>
                      </div>
                      <input
                        type="range" min="0" max="200" step="1"
                        value={tEnd} onChange={handleTEndChange}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                      Precision (N)
                    </label>
                    <span className="text-cyan-400 font-mono text-[11px]">{iterations} terms</span>
                  </div>
                  <input
                    type="range" min="10" max="1000" step="10"
                    value={iterations} onChange={(e) => setIterations(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </section>
              </>
            )}

            {viewMode === ViewMode.PRIME_STAIRCASE && (
              <section className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span className="uppercase font-black tracking-widest text-slate-600">Range (X)</span>
                    <span className="text-cyan-400">{xMax}</span>
                  </div>
                  <input
                    type="range" min="10" max="2000" step="10"
                    value={xMax} onChange={(e) => setXMax(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    Custom Formula
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="text" value={formulaInput} onChange={(e) => setFormulaInput(e.target.value)}
                      placeholder="e.g. x/log(x)"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-[11px] font-mono focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                    <button
                      onClick={handlePlotFormula}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white text-[9px] px-2 py-1 rounded font-bold uppercase"
                    >
                      Plot
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</h4>
            <p className="text-[11px] text-slate-400 leading-tight">
              {viewMode === ViewMode.INTRO_MYSTERY && "Investigating prime distribution randomness."}
              {viewMode === ViewMode.EULER_GOLDEN_KEY && "Bridging primes and integers via Zeta summation."}
              {viewMode === ViewMode.RIEMANN_TWIST && "Observing rotation in the complex plane."}
              {viewMode === ViewMode.HYPOTHESIS_STATEMENT && "Exploring the Millenium Prize claim."}
              {viewMode === ViewMode.CONCEPT_MAP && "Mapping the critical strip and its boundaries."}
              {viewMode === ViewMode.LANDSCAPE_3D && "Clamping pole at s=1 to visualize magnitudes."}
              {viewMode === ViewMode.ZERO_HUNTER && "Hunting for non-trivial zeros on Re(s)=0.5."}
              {viewMode === ViewMode.ATOMIC_WAVE && "Decomposing zeros into harmonic frequencies."}
              {viewMode === ViewMode.MIXING_DECK && "Simulating wave interference for prime detection."}
              {viewMode === ViewMode.HARMONIC_SYNTHESIS && "Summing zeros to approximate the step function."}
              {viewMode === ViewMode.DERIVATIVE_LINK && "Analyzing the pulse-density relationship."}
              {viewMode === ViewMode.PRIME_STAIRCASE && "Verifying theoretical results against reality."}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Visualization Canvas */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <div className="flex-1 p-4 md:p-8 overflow-hidden flex flex-col">
          <div className="w-full h-full relative flex-1">
            {viewMode === ViewMode.INTRO_MYSTERY && <IntroMystery />}
            {viewMode === ViewMode.EULER_GOLDEN_KEY && <EulerGoldenKey />}
            {viewMode === ViewMode.RIEMANN_TWIST && <RiemannTwist />}
            {viewMode === ViewMode.CONCEPT_MAP && <ConceptMap />}
            {viewMode === ViewMode.HYPOTHESIS_STATEMENT && <HypothesisStatement />}
            {viewMode === ViewMode.DERIVATIVE_LINK && <DerivativeLink />}
            {viewMode === ViewMode.ZERO_HUNTER && <ZeroHunter tStart={tStart} tEnd={tEnd} iterations={iterations} />}
            {viewMode === ViewMode.MIXING_DECK && <MixingDeck />}
            {viewMode === ViewMode.LANDSCAPE_3D && <Landscape3D tStart={tStart} tEnd={tEnd} iterations={iterations} />}
            {viewMode === ViewMode.PRIME_STAIRCASE && (
              <PrimeStaircase 
                xMax={xMax} 
                customFormula={plottedFormula} 
                onFormulaError={setFormulaError}
              />
            )}
            {viewMode === ViewMode.HARMONIC_SYNTHESIS && <HarmonicSynthesis />}
            {viewMode === ViewMode.ATOMIC_WAVE && <AtomicWave />}
          </div>
        </div>

        {/* Footer Navigation */}
        {nextStep && (
          <footer className="p-4 bg-slate-900/60 border-t border-slate-800 backdrop-blur-sm flex justify-between items-center px-8">
            <div className="hidden md:block">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Progress</span>
              <div className="flex gap-1 mt-1">
                {VIEW_SEQUENCE.map((s, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1 rounded-full transition-all duration-500 ${
                      idx <= currentStepIndex ? 'w-4 bg-cyan-500' : 'w-2 bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Next Phase</p>
                <p className="text-sm font-bold text-slate-200">{nextStep.label.split('. ')[1]}</p>
              </div>
              <button
                onClick={goToNextStep}
                className="group flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-cyan-900/40"
              >
                Continue
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
};

export default App;
