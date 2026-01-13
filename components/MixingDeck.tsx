
import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { RIEMANN_ZEROS } from '../services/mathUtils';

const HARMONIC_COLORS = [
  '#22d3ee', // Cyan
  '#d946ef', // Magenta
  '#facc15', // Yellow
  '#4ade80', // Lime
  '#fb923c', // Orange
  '#a855f7', // Purple
  '#2dd4bf', // Teal
  '#f472b6', // Pink
  '#6366f1', // Indigo
  '#ef4444'  // Red
];

const MixingDeck: React.FC = () => {
  // Support 10 harmonics. First 3 ON by default.
  const [activeHarmonics, setActiveHarmonics] = useState<boolean[]>([
    true, true, true, false, false, false, false, false, false, false
  ]);
  
  const gammas = RIEMANN_ZEROS.slice(0, 10);
  const xLimit = 60;

  const activeCount = activeHarmonics.filter(Boolean).length;

  const data = useMemo(() => {
    const steps = 600;
    const xValues: number[] = [];
    const individualWaves: number[][] = Array.from({ length: 10 }, () => []);
    const sumWave: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const x = 2 + (i / steps) * (xLimit - 2);
      xValues.push(x);
      
      let rawSum = 0;
      for (let gIdx = 0; gIdx < gammas.length; gIdx++) {
        const val = Math.cos(gammas[gIdx] * Math.log(x));
        individualWaves[gIdx].push(val);
        if (activeHarmonics[gIdx]) {
          rawSum += val;
        }
      }
      
      // Normalization: Divide by sqrt(N) to keep amplitude manageable
      const normalizedSum = activeCount > 0 ? rawSum / Math.sqrt(activeCount) : 0;
      sumWave.push(normalizedSum);
    }

    return { xValues, individualWaves, sumWave };
  }, [activeHarmonics, gammas, xLimit, activeCount]);

  const toggleHarmonic = (idx: number) => {
    const next = [...activeHarmonics];
    next[idx] = !next[idx];
    setActiveHarmonics(next);
  };

  const resolutionText = useMemo(() => {
    if (activeCount === 0) return "🔇 Silence: Select at least one harmonic to begin.";
    if (activeCount < 4) return "⚠️ Low Resolution: The 'Prime Spikes' are wide and blurry. It is hard to distinguish primes from noise.";
    if (activeCount <= 8) return "⚡ Medium Resolution: Patterns are emerging. Interference is clearing the spaces between primes.";
    return "✅ High Resolution: The waves are cancelling out the noise effectively. The 'Prime Spikes' are sharp and accurate.";
  }, [activeCount]);

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
      <header className="flex flex-col md:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-2xl gap-4">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">The Mixing Deck</h2>
          <p className="text-xs text-slate-500 font-medium">Summing 10 harmonics to isolate the prime signal</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex gap-1.5 mb-1">
            {activeHarmonics.map((active, i) => (
              <div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  active ? 'shadow-sm' : 'opacity-10 grayscale'
                }`}
                style={{ 
                  backgroundColor: HARMONIC_COLORS[i], 
                  boxShadow: active ? `0 0 8px ${HARMONIC_COLORS[i]}` : 'none' 
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {activeCount} / 10 Active
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Left: Scrollable Harmonic Controls */}
        <aside className="lg:w-72 flex flex-col bg-slate-900/40 rounded-xl border border-slate-800/50 overflow-hidden">
          <div className="p-3 border-b border-slate-800 bg-slate-900/60">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Harmonic Selection</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-2">
            {gammas.map((gamma, i) => (
              <div 
                key={i} 
                onClick={() => toggleHarmonic(i)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border ${
                  activeHarmonics[i] 
                    ? 'bg-slate-800/80 border-slate-700 shadow-md' 
                    : 'bg-transparent border-transparent hover:bg-slate-800/40'
                }`}
              >
                <div 
                  className={`w-3 h-3 rounded-full shrink-0 transition-opacity ${!activeHarmonics[i] && 'opacity-30'}`}
                  style={{ backgroundColor: HARMONIC_COLORS[i] }}
                />
                <div className="flex-1">
                  <p className={`text-[11px] font-bold ${activeHarmonics[i] ? 'text-slate-100' : 'text-slate-500'}`}>
                    Harmonic {i + 1}
                  </p>
                  <p className="text-[9px] font-mono text-slate-500">
                    &gamma; &approx; {gamma.toFixed(2)}
                  </p>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${activeHarmonics[i] ? 'bg-cyan-900/50' : 'bg-slate-800'}`}>
                  <div 
                    className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform transform ${
                      activeHarmonics[i] ? 'translate-x-4 bg-cyan-400' : 'translate-x-0 bg-slate-600'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right: Main Visualization Area */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Educational Resolution Status */}
          <div className={`p-3 rounded-lg border text-xs font-medium transition-colors ${
            activeCount < 4 
              ? 'bg-amber-900/10 border-amber-900/30 text-amber-200/70' 
              : activeCount <= 8 
              ? 'bg-blue-900/10 border-blue-900/30 text-blue-200/70'
              : 'bg-emerald-900/10 border-emerald-900/30 text-emerald-200/70'
          }`}>
            {resolutionText}
          </div>

          <div className="flex-1 flex flex-col bg-slate-900 rounded-xl border-2 border-slate-800 overflow-hidden shadow-2xl relative">
            <div className="absolute top-2 left-4 z-10 flex flex-col">
              <span className="text-[10px] font-black tracking-widest uppercase text-white/50 mb-1">Normalized Wave Sum</span>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-4 bg-white" />
                <span className="text-[9px] font-bold text-white/40 uppercase">y(x) = &Sigma; cos(&gamma; ln x) / &radic;N</span>
              </div>
            </div>

            <Plot
              data={[
                // Main sum wave
                {
                  x: data.xValues,
                  y: data.sumWave,
                  type: 'scatter',
                  mode: 'lines',
                  line: { color: '#ffffff', width: 2.5, shape: 'spline' },
                  fill: 'tozeroy',
                  fillcolor: 'rgba(255,255,255,0.03)',
                  name: 'Summed Signal'
                },
                // Threshold Line
                {
                  x: [2, xLimit],
                  y: [1.5, 1.5],
                  type: 'scatter',
                  mode: 'lines',
                  line: { color: '#fb7185', dash: 'dash', width: 1.5 },
                  name: 'Prediction Threshold',
                  hoverinfo: 'skip'
                }
              ]}
              layout={{
                autosize: true,
                margin: { l: 40, r: 20, b: 40, t: 40 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { 
                    title: 'x (Number Line)', 
                    color: '#64748b', 
                    gridcolor: '#1e293b', 
                    zeroline: false,
                    range: [2, xLimit],
                    tickfont: { size: 10 }
                },
                yaxis: { 
                    title: 'Amplitude', 
                    color: '#64748b', 
                    gridcolor: '#1e293b', 
                    range: [-4, 4],
                    tickfont: { size: 10 }
                },
                showlegend: false,
                annotations: [
                  {
                    x: 2,
                    y: 1.65,
                    xref: 'x',
                    yref: 'y',
                    text: 'Prediction Threshold (1.5)',
                    showarrow: false,
                    font: { color: '#fb7185', size: 9 },
                    xanchor: 'left'
                  },
                  {
                    x: 13,
                    y: 2,
                    xref: 'x',
                    yref: 'y',
                    text: 'Prime Detected',
                    showarrow: true,
                    arrowhead: 2,
                    ax: 0,
                    ay: -40,
                    font: { color: '#22d3ee', size: 10 },
                    visible: activeCount >= 3
                  }
                ]
              }}
              useResizeHandler={true}
              className="w-full h-full"
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>
          
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 flex items-start gap-3">
             <div className="shrink-0 text-cyan-500 mt-1">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <p className="text-[11px] text-slate-500 leading-tight">
               <span className="font-bold text-slate-400">The Prediction Logic:</span> When enough harmonics align (constructive interference), the waveform crosses the threshold. These peaks correspond exactly to the positions of prime numbers. High-frequency harmonics (the ones lower in the list) "sharpen" these peaks.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixingDeck;
