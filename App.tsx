
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

const VIEW_SEQUENCE = [
  { mode: ViewMode.INTRO_MYSTERY, label: "0. The Great Mystery", color: "bg-slate-700" },
  { mode: ViewMode.EULER_GOLDEN_KEY, label: "1. Euler's Golden Key", color: "bg-amber-600" },
  { mode: ViewMode.RIEMANN_TWIST, label: "2. Riemann's Twist", color: "bg-indigo-600" },
  { mode: ViewMode.CONCEPT_MAP, label: "3. The Concept Map", color: "bg-cyan-600" },
  { mode: ViewMode.LANDSCAPE_3D, label: "4. The Landscape", color: "bg-cyan-600" },
  { mode: ViewMode.ZERO_HUNTER, label: "5. The Zero Hunter", color: "bg-cyan-600" },
  { mode: null, label: "DIVIDER" }, // Divider marker
  { mode: ViewMode.ATOMIC_WAVE, label: "6. The Atomic Wave", color: "bg-amber-600" },
  { mode: ViewMode.MIXING_DECK, label: "7. The Mixing Deck", color: "bg-indigo-600" },
  { mode: ViewMode.HARMONIC_SYNTHESIS, label: "8. Harmonic Synthesis", color: "bg-rose-600" },
  { mode: ViewMode.DERIVATIVE_LINK, label: "9. The Derivative Link", color: "bg-emerald-600" },
  { mode: ViewMode.PRIME_STAIRCASE, label: "10. Prime Verification", color: "bg-cyan-600" },
];

const App: React.FC = () => {
  const [tStart, setTStart] = useState<number>(0);
  const [tEnd, setTEnd] = useState<number>(30);
  const [iterations, setIterations] = useState<number>(150);
  const [xMax, setXMax] = useState<number>(100);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.INTRO_MYSTERY);
  
  // Custom Formula State
  const [formulaInput, setFormulaInput] = useState<string>("x / (log(x) - 1.08366)");
  const [plottedFormula, setPlottedFormula] = useState<string>("x / (log(x) - 1.08366)");
  const [formulaError, setFormulaError] = useState<string | null>(null);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setTStart(Math.max(0, val - 15));
    setTEnd(val + 15);
  };

  const handlePlotFormula = () => {
    setPlottedFormula(formulaInput);
    setFormulaError(null);
  };

  const currentStepIndex = VIEW_SEQUENCE.findIndex(v => v.mode === viewMode);
  const nextStep = VIEW_SEQUENCE.slice(currentStepIndex + 1).find(v => v.mode !== null);

  const goToNextStep = () => {
    if (nextStep && nextStep.mode) {
      setViewMode(nextStep.mode);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-80 p-6 flex flex-col gap-6 bg-slate-900 border-r border-slate-800 shadow-xl z-10 shrink-0 overflow-y-auto custom-scrollbar">
        <header>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Riemann Vision
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            A linear journey through the "Music of the Primes".
          </p>
        </header>

        <div className="space-y-6">
          <section>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Narrative Steps
            </label>
            <div className="flex flex-col gap-1.5 p-1 bg-slate-950 rounded-lg">
              {VIEW_SEQUENCE.map((item, idx) => {
                if (item.label === "DIVIDER") {
                  return <div key={`div-${idx}`} className="h-px bg-slate-800 my-2 mx-4" />;
                }
                return (
                  <button
                    key={item.mode}
                    onClick={() => setViewMode(item.mode as ViewMode)}
                    className={`w-full py-2 px-3 rounded-md text-xs font-medium text-left transition-all ${
                      viewMode === item.mode
                        ? `${item.color} text-white shadow-lg`
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Context-Specific Controls */}
          <div className="pt-4 border-t border-slate-800">
            {viewMode === ViewMode.PRIME_STAIRCASE ? (
              <>
                <section className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Search Range (X)
                    </label>
                    <span className="text-cyan-400 font-mono text-sm">{xMax}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={xMax}
                    onChange={(e) => setXMax(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </section>

                <section>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                    Test Your Formula (f(x))
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formulaInput}
                      onChange={(e) => setFormulaInput(e.target.value)}
                      placeholder="e.x. x / (log(x) - 1)"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                    <button
                      onClick={handlePlotFormula}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] px-3 py-1.5 rounded font-bold uppercase tracking-tighter"
                    >
                      Plot
                    </button>
                  </div>
                  {formulaError && (
                    <p className="text-[10px] text-red-400 mt-1 font-medium">{formulaError}</p>
                  )}
                </section>
              </>
            ) : viewMode !== ViewMode.CONCEPT_MAP && 
                viewMode !== ViewMode.MIXING_DECK && 
                viewMode !== ViewMode.HARMONIC_SYNTHESIS &&
                viewMode !== ViewMode.ATOMIC_WAVE &&
                viewMode !== ViewMode.INTRO_MYSTERY &&
                viewMode !== ViewMode.EULER_GOLDEN_KEY &&
                viewMode !== ViewMode.RIEMANN_TWIST &&
                viewMode !== ViewMode.DERIVATIVE_LINK ? (
              <>
                <section className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Imaginary Center (t)
                    </label>
                    <span className="text-cyan-400 font-mono text-sm">
                      {((tStart + tEnd) / 2).toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    step="1"
                    value={(tStart + tEnd) / 2}
                    onChange={handleRangeChange}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-2 italic">
                    Range: [{tStart.toFixed(0)}, {tEnd.toFixed(0)}]
                  </p>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Precision (N)
                    </label>
                    <span className="text-cyan-400 font-mono text-sm">{iterations} terms</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={iterations}
                    onChange={(e) => setIterations(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </section>
              </>
            ) : (
               <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Description</h4>
                <p className="text-xs text-slate-400 leading-tight">
                  {viewMode === ViewMode.INTRO_MYSTERY && "Primes appear random and unpredictable. Is there a hidden order?"}
                  {viewMode === ViewMode.EULER_GOLDEN_KEY && "Euler discovered that studying integers is identical to studying primes."}
                  {viewMode === ViewMode.RIEMANN_TWIST && "Moving from 1D to 2D. How imaginary powers turn numbers into spirals."}
                  {viewMode === ViewMode.CONCEPT_MAP && "A spatial overview of the complex plane and the locations of the zeros."}
                  {viewMode === ViewMode.ATOMIC_WAVE && "Watch how a single zero creates a vibrational frequency in log-space."}
                  {viewMode === ViewMode.MIXING_DECK && "Combining harmonics to isolate prime signals through interference."}
                  {viewMode === ViewMode.HARMONIC_SYNTHESIS && "Riemann's formula: using zeros to reconstruct the staircase."}
                  {viewMode === ViewMode.DERIVATIVE_LINK && "The fundamental link between prime density and the prime count."}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Insight</h3>
          <p className="text-[11px] text-slate-500 leading-tight">
            {viewMode === ViewMode.PRIME_STAIRCASE 
              ? "Verification: See how the theoretical synthesis matches the actual number line."
              : viewMode === ViewMode.INTRO_MYSTERY
              ? "Primes are the building blocks of all numbers, yet they follow no simple pattern."
              : viewMode === ViewMode.EULER_GOLDEN_KEY
              ? "The Bridge: Integers and Primes are two sides of the same coin."
              : viewMode === ViewMode.RIEMANN_TWIST
              ? "The Twist: Imaginary numbers add rotation, turning lines into wave-like spirals."
              : viewMode === ViewMode.CONCEPT_MAP
              ? "All non-trivial zeros are conjectured to lie exactly on the line Re(s) = 0.5."
              : viewMode === ViewMode.MIXING_DECK
              ? "Interference hotspots align perfectly with primes when zeros are included."
              : viewMode === ViewMode.HARMONIC_SYNTHESIS
              ? "Each zero adds a specific vibration. More zeros = sharper steps."
              : viewMode === ViewMode.ATOMIC_WAVE
              ? "Imaginary parts of zeros are frequencies. They determine the distribution's 'waviness'."
              : viewMode === ViewMode.DERIVATIVE_LINK
              ? "Primes are where the speed of counting spikes! The pulse becomes a step."
              : "Finding zeros means finding where the Zeta function magnitude hits exactly zero."
            }
          </p>
        </div>
      </aside>

      {/* Main Visualization Canvas */}
      <main className="flex-1 p-4 md:p-8 relative min-h-0 flex flex-col">
        <div className="w-full h-full relative flex-1 mb-4">
          {viewMode === ViewMode.INTRO_MYSTERY && <IntroMystery />}
          {viewMode === ViewMode.EULER_GOLDEN_KEY && <EulerGoldenKey />}
          {viewMode === ViewMode.RIEMANN_TWIST && <RiemannTwist />}
          {viewMode === ViewMode.CONCEPT_MAP && <ConceptMap />}
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

        {/* Next Step Navigation Footer */}
        {nextStep && (
          <footer className="shrink-0 flex justify-end items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Up Next</p>
                <p className="text-xs font-semibold text-slate-200">{nextStep.label}</p>
              </div>
              <button
                onClick={goToNextStep}
                className="group flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-cyan-900/40"
              >
                Next Step
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
