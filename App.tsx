
import React, { useState } from 'react';
import { ViewMode } from './types';
import ZeroHunter from './components/ZeroHunter';
import Landscape3D from './components/Landscape3D';
import PrimeStaircase from './components/PrimeStaircase';

const App: React.FC = () => {
  const [tStart, setTStart] = useState<number>(0);
  const [tEnd, setTEnd] = useState<number>(30);
  const [iterations, setIterations] = useState<number>(150);
  const [xMax, setXMax] = useState<number>(100);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ZERO_HUNTER);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setTStart(Math.max(0, val - 15));
    setTEnd(val + 15);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-80 p-6 flex flex-col gap-8 bg-slate-900 border-r border-slate-800 shadow-xl z-10 shrink-0">
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

          {viewMode !== ViewMode.PRIME_STAIRCASE ? (
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
              <p className="text-[11px] text-slate-500 mt-2">
                Increase the limit to see the divergence and approximation at larger scales.
              </p>
            </section>
          )}
        </div>

        <div className="mt-auto p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Did you know?</h3>
          <p className="text-[11px] text-slate-500 leading-tight">
            {viewMode === ViewMode.PRIME_STAIRCASE 
              ? "The 'gap' between the stairs and the curve is bounded by the Riemann Hypothesis if it holds true."
              : "The first zero occurs at t ≈ 14.13. Notice how the magnitude drops to 0 at these specific heights along the critical line."
            }
          </p>
        </div>
      </aside>

      {/* Main Visualization Canvas */}
      <main className="flex-1 p-4 md:p-8 relative min-h-0 flex flex-col">
        <div className="w-full h-full relative flex-1">
          {viewMode === ViewMode.ZERO_HUNTER && (
            <ZeroHunter tStart={tStart} tEnd={tEnd} iterations={iterations} />
          )}
          {viewMode === ViewMode.LANDSCAPE_3D && (
            <Landscape3D tStart={tStart} tEnd={tEnd} iterations={iterations} />
          )}
          {viewMode === ViewMode.PRIME_STAIRCASE && (
            <PrimeStaircase xMax={xMax} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
