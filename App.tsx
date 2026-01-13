
import React, { useState } from 'react';
import { ViewMode } from './types';
import ZeroHunter from './components/ZeroHunter';
import Landscape3D from './components/Landscape3D';
import PrimeStaircase from './components/PrimeStaircase';
import ConceptMap from './components/ConceptMap';
import HarmonicSynthesis from './components/HarmonicSynthesis';

const App: React.FC = () => {
  const [tStart, setTStart] = useState<number>(0);
  const [tEnd, setTEnd] = useState<number>(30);
  const [iterations, setIterations] = useState<number>(150);
  const [xMax, setXMax] = useState<number>(100);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ZERO_HUNTER);
  
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

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-80 p-6 flex flex-col gap-8 bg-slate-900 border-r border-slate-800 shadow-xl z-10 shrink-0 overflow-y-auto">
        <header>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Riemann Vision
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Exploring the "Music of the Primes" via the Dirichlet Eta function approximation.
          </p>
        </header>

        <div className="space-y-6">
          <section>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              View Strategy
            </label>
            <div className="grid grid-cols-1 gap-2 p-1 bg-slate-950 rounded-lg">
              <button
                onClick={() => setViewMode(ViewMode.CONCEPT_MAP)}
                className={`w-full py-2 px-3 rounded-md text-xs font-medium transition-all ${
                  viewMode === ViewMode.CONCEPT_MAP
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Complex Concept Map
              </button>
              <button
                onClick={() => setViewMode(ViewMode.ZERO_HUNTER)}
                className={`w-full py-2 px-3 rounded-md text-xs font-medium transition-all ${
                  viewMode === ViewMode.ZERO_HUNTER
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2D Zero Hunter
              </button>
              <button
                onClick={() => setViewMode(ViewMode.HARMONIC_SYNTHESIS)}
                className={`w-full py-2 px-3 rounded-md text-xs font-medium transition-all ${
                  viewMode === ViewMode.HARMONIC_SYNTHESIS
                    ? 'bg-rose-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Harmonic Synthesis
              </button>
              <button
                onClick={() => setViewMode(ViewMode.LANDSCAPE_3D)}
                className={`w-full py-2 px-3 rounded-md text-xs font-medium transition-all ${
                  viewMode === ViewMode.LANDSCAPE_3D
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3D Landscape
              </button>
              <button
                onClick={() => setViewMode(ViewMode.PRIME_STAIRCASE)}
                className={`w-full py-2 px-3 rounded-md text-xs font-medium transition-all ${
                  viewMode === ViewMode.PRIME_STAIRCASE
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Prime Staircase
              </button>
            </div>
          </section>

          {viewMode === ViewMode.CONCEPT_MAP ? (
            <section className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Static Overview</h4>
              <p className="text-xs text-slate-400 leading-tight">
                This diagram provides a spatial overview of the key mathematical structures discussed in the Riemann Hypothesis.
              </p>
            </section>
          ) : viewMode === ViewMode.HARMONIC_SYNTHESIS ? (
            <section className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Explicit Formula</h4>
               <p className="text-xs text-slate-400 leading-tight">
                 Each zero adds a specific "vibration" to the number line. When combined, these vibrations cancel out between primes and constructively interfere at primes.
               </p>
            </section>
          ) : viewMode !== ViewMode.PRIME_STAIRCASE ? (
            <>
              <section>
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
                  Showing range: [{tStart.toFixed(0)}, {tEnd.toFixed(0)}]
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
            <>
              <section>
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
                <p className="text-[10px] text-slate-500 mt-2 italic leading-tight">
                  Try <code className="text-slate-400">x / (log(x) - 1)</code> to see how shifting the denominator changes the fit!
                </p>
              </section>
            </>
          )}
        </div>

        <div className="mt-auto p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Did you know?</h3>
          <p className="text-[11px] text-slate-500 leading-tight">
            {viewMode === ViewMode.PRIME_STAIRCASE 
              ? "Legendre discovered that subtracting ~1.08366 from the logarithm makes the curve fit much better at small scales."
              : viewMode === ViewMode.CONCEPT_MAP
              ? "The 'Trivial Zeros' occur at every negative even integer (-2, -4, -6...) and are perfectly understood."
              : viewMode === ViewMode.HARMONIC_SYNTHESIS
              ? "Bernhard Riemann's 'Explicit Formula' connects primes to zeros. Each zero acts as a frequency in the 'Music of the Primes'."
              : "The first zero occurs at t ≈ 14.13. Notice how the magnitude drops to 0 at these specific heights along the critical line."
            }
          </p>
        </div>
      </aside>

      {/* Main Visualization Canvas */}
      <main className="flex-1 p-4 md:p-8 relative min-h-0 flex flex-col">
        <div className="w-full h-full relative flex-1">
          {viewMode === ViewMode.CONCEPT_MAP && (
            <ConceptMap />
          )}
          {viewMode === ViewMode.ZERO_HUNTER && (
            <ZeroHunter tStart={tStart} tEnd={tEnd} iterations={iterations} />
          )}
          {viewMode === ViewMode.LANDSCAPE_3D && (
            <Landscape3D tStart={tStart} tEnd={tEnd} iterations={iterations} />
          )}
          {viewMode === ViewMode.PRIME_STAIRCASE && (
            <PrimeStaircase 
              xMax={xMax} 
              customFormula={plottedFormula} 
              onFormulaError={setFormulaError}
            />
          )}
          {viewMode === ViewMode.HARMONIC_SYNTHESIS && (
            <HarmonicSynthesis />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
