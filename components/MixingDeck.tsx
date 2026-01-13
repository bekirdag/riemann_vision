
import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { RIEMANN_ZEROS } from '../services/mathUtils';

const MixingDeck: React.FC = () => {
  const [activeHarmonics, setActiveHarmonics] = useState<boolean[]>([true, true, true]);
  
  const gammas = RIEMANN_ZEROS.slice(0, 3);
  const colors = ['#22d3ee', '#d946ef', '#facc15']; // Cyan, Magenta, Yellow
  const xLimit = 60;

  const data = useMemo(() => {
    const steps = 400;
    const xValues: number[] = [];
    const individualWaves: number[][] = [[], [], []];
    const sumWave: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const x = 2 + (i / steps) * (xLimit - 2);
      xValues.push(x);
      
      let currentSum = 0;
      for (let gIdx = 0; gIdx < gammas.length; gIdx++) {
        const val = Math.cos(gammas[gIdx] * Math.log(x));
        individualWaves[gIdx].push(val);
        if (activeHarmonics[gIdx]) {
          currentSum += val;
        }
      }
      sumWave.push(currentSum);
    }

    return { xValues, individualWaves, sumWave };
  }, [activeHarmonics, gammas, xLimit]);

  const toggleHarmonic = (idx: number) => {
    const next = [...activeHarmonics];
    next[idx] = !next[idx];
    setActiveHarmonics(next);
  };

  const renderHarmonicGraph = (idx: number) => {
    const isActive = activeHarmonics[idx];
    return (
      <div key={idx} className="flex-1 min-h-0 flex flex-col relative group">
        <div className="absolute top-2 left-4 z-10 flex items-center gap-3">
          <button
            onClick={() => toggleHarmonic(idx)}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
              isActive ? 'bg-slate-700' : 'bg-slate-800'
            }`}
          >
            <div 
              className={`w-4 h-4 rounded-full transition-all transform ${
                isActive ? 'translate-x-6' : 'translate-x-0'
              }`}
              style={{ backgroundColor: isActive ? colors[idx] : '#475569' }}
            />
          </button>
          <span className="text-[10px] font-bold tracking-tighter uppercase text-slate-400">
            Harmonic {idx + 1} (γ ≈ {gammas[idx].toFixed(2)})
          </span>
        </div>
        <div className="flex-1 bg-slate-900/40 rounded-lg border border-slate-800/50 overflow-hidden">
          <Plot
            data={[
              {
                x: data.xValues,
                y: data.individualWaves[idx],
                type: 'scatter',
                mode: 'lines',
                line: { color: isActive ? colors[idx] : '#1e293b', width: 2 },
                fill: isActive ? 'tozeroy' : undefined,
                fillcolor: `${colors[idx]}10`,
                hoverinfo: 'skip'
              }
            ]}
            layout={{
              autosize: true,
              margin: { l: 40, r: 20, b: 20, t: 10 },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              xaxis: { visible: false, range: [2, xLimit] },
              yaxis: { visible: false, range: [-1.2, 1.2] },
              showlegend: false
            }}
            useResizeHandler={true}
            className="w-full h-full"
            config={{ responsive: true, displayModeBar: false }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
      <header className="flex flex-col md:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-2xl gap-4">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">The Mixing Deck</h2>
          <p className="text-xs text-slate-500 font-medium">Summing frequencies to find the prime signal</p>
        </div>
        <div className="flex gap-2">
          {activeHarmonics.map((active, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full transition-all duration-500 shadow-sm ${
                active ? 'animate-pulse' : 'opacity-20'
              }`}
              style={{ backgroundColor: colors[i], boxShadow: active ? `0 0 10px ${colors[i]}` : 'none' }}
            />
          ))}
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-2 min-h-0">
        {/* The Ingredients */}
        <div className="grid grid-rows-3 flex-[1.5] gap-2">
          {gammas.map((_, i) => renderHarmonicGraph(i))}
        </div>

        {/* The Mixer Result */}
        <div className="flex-[1] flex flex-col relative mt-2">
          <div className="absolute top-2 left-4 z-10 flex items-center gap-2">
            <span className="text-[11px] font-black tracking-widest uppercase text-white bg-slate-800 px-2 py-0.5 rounded">The Resulting Waveform</span>
          </div>
          
          <div className="flex-1 bg-slate-900 rounded-xl border-2 border-slate-800 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <Plot
              data={[
                {
                  x: data.xValues,
                  y: data.sumWave,
                  type: 'scatter',
                  mode: 'lines',
                  line: { color: '#ffffff', width: 3, shape: 'spline' },
                  fill: 'tozeroy',
                  fillcolor: 'rgba(255,255,255,0.05)',
                  name: 'Summed Signal'
                }
              ]}
              layout={{
                autosize: true,
                margin: { l: 40, r: 20, b: 40, t: 10 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { 
                    title: 'x (Number Line)', 
                    color: '#64748b', 
                    gridcolor: '#1e293b', 
                    zeroline: false,
                    range: [2, xLimit]
                },
                yaxis: { 
                    title: 'Amplitude', 
                    color: '#64748b', 
                    gridcolor: '#1e293b', 
                    range: [-3.5, 3.5]
                },
                showlegend: false,
                annotations: [
                  {
                    x: 13,
                    y: 2.8,
                    xref: 'x',
                    yref: 'y',
                    text: 'Constructive (Primes Nearby)',
                    showarrow: true,
                    arrowhead: 2,
                    ax: 0,
                    ay: -30,
                    font: { color: '#ffffff', size: 10 }
                  },
                  {
                    x: 35,
                    y: 0,
                    xref: 'x',
                    yref: 'y',
                    text: 'Destructive (Silence)',
                    showarrow: true,
                    arrowhead: 2,
                    ax: 40,
                    ay: 20,
                    font: { color: '#475569', size: 10 }
                  }
                ]
              }}
              useResizeHandler={true}
              className="w-full h-full"
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>
        </div>
      </div>

      <footer className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-center">
        <p className="text-[11px] text-slate-500 italic">
          "Each zero of the Zeta function adds a specific note. In the silence where they cancel out, no primes exist. Where they shout together, a prime is found."
        </p>
      </footer>
    </div>
  );
};

export default MixingDeck;
