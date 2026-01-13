
import React, { useMemo, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { RIEMANN_ZEROS } from '../services/mathUtils';
import StoryLayout, { StoryStep } from './StoryLayout';

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

const HarmonicSparkline: React.FC<{ gamma: number; color: string; active: boolean }> = ({ gamma, color, active }) => {
  const points = 40;
  const width = 80;
  const height = 24;
  
  const pathData = useMemo(() => {
    let d = `M 0 ${height / 2}`;
    for (let i = 0; i <= points; i++) {
      const xCoord = (i / points) * width;
      const xVal = 2 + (i / points) * 20; 
      const y = (height / 2) + (Math.cos(gamma * Math.log(xVal)) * (height / 2.5));
      d += ` L ${xCoord} ${y}`;
    }
    return d;
  }, [gamma]);

  return (
    <svg width={width} height={height} className={`transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-20'}`}>
      <path d={pathData} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

const MixingDeck: React.FC = () => {
  const [activeHarmonics, setActiveHarmonics] = useState<boolean[]>(new Array(10).fill(false));
  const [isUnlocked, setIsUnlocked] = useState(false);
  const gammas = useMemo(() => RIEMANN_ZEROS.slice(0, 10), []);
  const xLimit = 60;

  const activeCount = activeHarmonics.filter(Boolean).length;

  const data = useMemo(() => {
    const steps = 800; // High resolution for precise alignment
    const xValues: number[] = [];
    const individualWaves: number[][] = Array.from({ length: 10 }, () => []);
    const sumWave: number[] = [];

    const startX = 2;
    const endX = xLimit;
    const stepSize = (endX - startX) / steps;

    for (let i = 0; i <= steps; i++) {
      // CRITICAL FIX: The current x-coordinate is explicitly derived from the iterator.
      // We use this exact same value for both the plot axis and the log calculation.
      const x = startX + i * stepSize;
      xValues.push(x);
      
      let rawSum = 0;
      for (let gIdx = 0; gIdx < gammas.length; gIdx++) {
        // Calculation and coordinate are strictly 1:1 linked
        const val = Math.cos(gammas[gIdx] * Math.log(x));
        individualWaves[gIdx].push(val);
        if (activeHarmonics[gIdx]) {
          rawSum += val;
        }
      }
      
      const normalizedSum = activeCount > 0 ? rawSum / Math.sqrt(activeCount) : 0;
      sumWave.push(normalizedSum);
    }

    return { xValues, individualWaves, sumWave };
  }, [activeHarmonics, gammas, xLimit, activeCount]);

  const toggleHarmonic = (idx: number) => {
    if (!isUnlocked) return;
    const next = [...activeHarmonics];
    next[idx] = !next[idx];
    setActiveHarmonics(next);
  };

  const steps: StoryStep[] = [
    {
      id: 'fundamental',
      title: 'The Fundamental Tone (γ1)',
      narrative: (
        <p>
          We start with the first zero (<b>14.13</b>). By itself, it is just a smooth, repetitive wave. 
          It creates a gentle rhythm, but it's too broad to point at individual primes.
        </p>
      ),
      action: () => {
        const next = new Array(10).fill(false);
        next[0] = true;
        setActiveHarmonics(next);
      }
    },
    {
      id: 'interference',
      title: 'The Interference (Adding γ2)',
      narrative: (
        <p>
          Now we add the second zero (<b>21.02</b>). Watch what happens: In some places, the waves go up together 
          (<span className="text-cyan-400 font-bold">Constructive</span>). 
          In others, they cancel out (<span className="text-rose-400 font-bold">Destructive</span>).
          The "Ghost Traces" show the individual components.
        </p>
      ),
      action: () => {
        const next = new Array(10).fill(false);
        next[0] = true;
        next[1] = true;
        setActiveHarmonics(next);
      }
    },
    {
      id: 'pattern',
      title: 'The Pattern Emerges (Top 5)',
      narrative: (
        <p>
          As we layer more frequencies, the "Noise" between numbers starts to flatten out (Silence), 
          and the "Spikes" at the prime numbers get louder. 
          Notice how the Individual components are now hidden to focus on the <b>Summed Signal</b>.
        </p>
      ),
      action: () => {
        const next = new Array(10).fill(false);
        for(let i=0; i<5; i++) next[i] = true;
        setActiveHarmonics(next);
      }
    },
    {
      id: 'hd',
      title: 'High Definition (All 10)',
      narrative: (
        <p>
          With all 10 harmonics active, the prime spikes are sharp and distinct. 
          The interference cancels the energy everywhere except at the primes. 
          We have successfully filtered the <b>Signal</b> from the <b>Noise</b>.
        </p>
      ),
      action: () => {
        setActiveHarmonics(new Array(10).fill(true));
      }
    }
  ];

  const resolutionText = useMemo(() => {
    if (activeCount === 0) return "🔇 Silence: Select at least one harmonic to begin.";
    if (activeCount < 3) return "⚠️ Low Resolution: Ghost traces enabled. Components visible.";
    if (activeCount <= 8) return "⚡ Medium Resolution: Patterns are emerging. Noise is clearing.";
    return "✅ High Resolution: Prime spikes are sharp and accurate.";
  }, [activeCount]);

  return (
    <StoryLayout
      steps={steps}
      isUnlocked={isUnlocked}
      onExploreFreely={() => setIsUnlocked(true)}
    >
      <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-2xl gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-950 rounded-lg flex items-center justify-center border border-slate-800 shadow-inner">
               <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
               </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">The Mixing Deck</h2>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${activeCount > 8 ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' : 'bg-amber-950/30 border-amber-500/30 text-amber-400'}`}>
                  {resolutionText.split(':')[0]}
                </span>
                <p className="text-[10px] text-slate-500 font-medium">{resolutionText.split(': ')[1]}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1.5 p-2 bg-slate-950 rounded-lg border border-slate-800/50">
            {activeHarmonics.map((active, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  active ? 'shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'opacity-10 grayscale'
                }`}
                style={{ backgroundColor: HARMONIC_COLORS[i] }}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          <aside className="lg:w-80 flex flex-col bg-slate-900/40 rounded-xl border border-slate-800/50 overflow-hidden">
            <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Harmonic Conductor</h3>
              {isUnlocked && <span className="text-[9px] text-cyan-500 font-bold uppercase animate-pulse">Live</span>}
            </div>
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-2">
              {gammas.map((gamma, i) => (
                <div 
                  key={i} 
                  onClick={() => toggleHarmonic(i)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all border group ${
                    activeHarmonics[i] 
                      ? 'bg-slate-800/80 border-slate-700 shadow-lg scale-[1.02]' 
                      : 'bg-transparent border-transparent opacity-50 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'
                  } ${isUnlocked ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex flex-col flex-1 gap-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black uppercase ${activeHarmonics[i] ? 'text-white' : 'text-slate-500'}`}>
                        H-{i + 1}
                      </span>
                      <span className="text-[9px] font-mono text-slate-600">γ ≈ {gamma.toFixed(2)}</span>
                    </div>
                    <HarmonicSparkline gamma={gamma} color={HARMONIC_COLORS[i]} active={activeHarmonics[i]} />
                  </div>
                  
                  {isUnlocked && (
                    <div className={`w-8 h-4 rounded-full relative transition-colors shrink-0 ${activeHarmonics[i] ? 'bg-cyan-900/50' : 'bg-slate-800'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform transform ${
                        activeHarmonics[i] ? 'translate-x-4 bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'translate-x-0 bg-slate-600'
                      }`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          <div className="flex-1 bg-slate-900 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-2xl relative flex flex-col min-h-0">
             <div className="p-4 border-b border-slate-800 bg-slate-950/30 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interference Pattern Sum</h3>
                </div>
                <div className="text-[10px] font-mono text-slate-500">Scale: log(x) mapping</div>
             </div>

             <div className="flex-1 relative">
                <Plot
                  data={[
                    ...((activeCount > 0 && activeCount < 3) ? gammas.map((g, i) => {
                      if (!activeHarmonics[i]) return null;
                      return {
                        x: data.xValues,
                        y: data.individualWaves[i],
                        type: 'scatter' as const,
                        mode: 'lines' as const,
                        name: `H-${i+1}`,
                        line: { color: HARMONIC_COLORS[i], width: 1.5, dash: 'dash' as const },
                        opacity: 0.4,
                        hoverinfo: 'skip'
                      };
                    }).filter(Boolean) : []),
                    
                    {
                      x: data.xValues,
                      y: data.sumWave,
                      type: 'scatter',
                      mode: 'lines',
                      name: 'Mixed Signal',
                      line: { color: '#ffffff', width: 3, shape: 'spline' },
                      fill: 'tozeroy',
                      fillcolor: 'rgba(255,255,255,0.03)',
                      hovertemplate: 'x: %{x:.4f}<br>Amplitude: %{y:.4f}<extra></extra>'
                    },
                    
                    ...(activeCount >= 5 ? [
                      {
                        x: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59],
                        y: Array(17).fill(1.8),
                        type: 'scatter',
                        mode: 'markers',
                        name: 'Primes',
                        marker: { color: '#22d3ee', size: 12, symbol: 'triangle-down' },
                        hoverinfo: 'name'
                      }
                    ] : [])
                  ]}
                  layout={{
                    autosize: true,
                    margin: { l: 50, r: 20, b: 50, t: 20 },
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
                        title: 'Combined Amplitude', 
                        color: '#64748b', 
                        gridcolor: '#1e293b', 
                        range: [-4, 4],
                        tickfont: { size: 10 },
                        zerolinecolor: '#334155'
                    },
                    showlegend: isUnlocked,
                    legend: { font: { color: '#64748b', size: 9 }, x: 0, y: 1 },
                    hovermode: 'x unified'
                  }}
                  useResizeHandler={true}
                  className="w-full h-full"
                  config={{ responsive: true, displayModeBar: false }}
                />

                {!isUnlocked && activeCount < 3 && (
                   <div className="absolute top-6 right-6 bg-slate-950/80 p-3 rounded-lg border border-indigo-500/30 max-w-[160px] pointer-events-none animate-in fade-in slide-in-from-right-4 duration-500">
                     <p className="text-[10px] text-indigo-300 leading-tight">
                       <span className="font-bold">Visualizing Components:</span> Showing dashed lines for individual frequencies to illustrate interference.
                     </p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </StoryLayout>
  );
};

export default MixingDeck;
