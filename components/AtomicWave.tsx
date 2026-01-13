
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { RIEMANN_ZEROS } from '../services/mathUtils';
import StoryLayout, { StoryStep } from './StoryLayout';

const AtomicWave: React.FC = () => {
  const [selectedZeroIndex, setSelectedZeroIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentU, setCurrentU] = useState<number>(0); // u = ln(x)
  const [animationSpeed, setAnimationSpeed] = useState<number>(0.5);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [highlightTarget, setHighlightTarget] = useState<'phasor' | 'wave' | 'axis' | 'none'>('none');

  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(null);

  const gamma = RIEMANN_ZEROS[selectedZeroIndex];

  const animate = (time: number) => {
    if (lastTimeRef.current !== undefined && lastTimeRef.current !== null) {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      if (isPlaying) {
        // Increment u based on speed
        setCurrentU(prev => prev + deltaTime * animationSpeed);
      }
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, animationSpeed]);

  const waveData = useMemo(() => {
    const points = 150;
    const historyWidth = 6; // How many units of ln(x) to show
    const uVals: number[] = [];
    const yVals: number[] = [];

    // Show a window of the wave trailing the current point
    const startU = currentU - historyWidth;
    for (let i = 0; i <= points; i++) {
      const u = startU + (i / points) * historyWidth;
      uVals.push(u);
      yVals.push(Math.sin(gamma * u));
    }
    return { x: uVals, y: yVals, startU, historyWidth };
  }, [currentU, gamma]);

  const phasorAngleRad = (gamma * currentU) % (2 * Math.PI);
  const phasorAngleDeg = (phasorAngleRad * 180) / Math.PI;

  const steps: StoryStep[] = [
    {
      id: 'rotation',
      title: 'The Hidden Rotation',
      narrative: (
        <p>
          We found the number <b>14.13</b> in the landscape. But in the complex world, numbers aren't just static points—they are <b>rotations</b>. 
          Think of this as a clock hand spinning at a very specific speed.
        </p>
      ),
      action: () => {
        setSelectedZeroIndex(0);
        setAnimationSpeed(0.3);
        setHighlightTarget('phasor');
        setIsPlaying(true);
      }
    },
    {
      id: 'tracing',
      title: 'Tracing the Wave',
      narrative: (
        <p>
          As this clock spins, it traces out a wave over time. This is the <b>First Harmonic</b> of the prime number system. 
          It is a low, deep "bass note". Notice how the wave peaks exactly when the arm points up.
        </p>
      ),
      action: () => {
        setHighlightTarget('wave');
        setAnimationSpeed(0.5);
        setIsPlaying(true);
      }
    },
    {
      id: 'higher-energy',
      title: 'Higher Energy (Zero #2)',
      narrative: (
        <p>
          Now let's look at the second zero: <b>21.02</b>. Notice how the clock spins faster? 
          This creates a higher-pitched wave. This is the next "note" in the chord.
        </p>
      ),
      action: () => {
        setSelectedZeroIndex(1);
        setHighlightTarget('none');
        setAnimationSpeed(0.6);
        setIsPlaying(true);
      }
    },
    {
      id: 'log-time',
      title: 'Logarithmic Time',
      narrative: (
        <p>
          Notice the X-axis isn't normal time. It is <b>Logarithmic Time (ln x)</b>. 
          This is Riemann's trick: Primes act like music only if you stretch the number line in this special way.
        </p>
      ),
      action: () => {
        setHighlightTarget('axis');
        setAnimationSpeed(0.8);
        setIsPlaying(true);
      }
    }
  ];

  return (
    <StoryLayout
      steps={steps}
      isUnlocked={isUnlocked}
      onExploreFreely={() => setIsUnlocked(true)}
    >
      <div className="w-full h-full flex flex-col gap-4">
        {/* Dynamic Controls (Only visible in Sandbox) */}
        {isUnlocked && (
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Synthesizer Mode</label>
              <select
                value={selectedZeroIndex}
                onChange={(e) => setSelectedZeroIndex(parseInt(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-xs font-mono text-amber-400 outline-none focus:ring-1 focus:ring-amber-500"
              >
                {RIEMANN_ZEROS.slice(0, 20).map((z, i) => (
                  <option key={i} value={i}>Harmonic #{i + 1} (γ={z.toFixed(2)})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Tempo</span>
                <input
                  type="range" min="0.1" max="2.0" step="0.1"
                  value={animationSpeed} onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                  className="w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase transition-all ${
                  isPlaying ? 'bg-slate-800 text-slate-400' : 'bg-amber-600 text-white shadow-lg shadow-amber-900/20'
                }`}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        )}

        {/* Main Display Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 relative">
          
          {/* Connector Line Overlay (Simulated via coordinate mapping or visual alignment) */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
             {/* We rely on the two plots being in the same parent container and centered */}
          </div>

          {/* Left: The Phasor */}
          <div className={`bg-slate-900 rounded-2xl border transition-all duration-500 flex flex-col overflow-hidden shadow-2xl ${
            highlightTarget === 'phasor' ? 'border-amber-500 ring-4 ring-amber-500/10' : 'border-slate-800'
          }`}>
             <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">The Atomic Spinner</h3>
                <span className="text-[10px] font-mono text-amber-500 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-500/10">
                  {phasorAngleDeg.toFixed(0)}°
                </span>
             </div>
             <div className="flex-1 relative">
                <Plot
                  data={[
                    // Unit Circle Backing
                    {
                      r: Array(101).fill(1),
                      theta: Array.from({length: 101}, (_, i) => (i * 360) / 100),
                      type: 'scatterpolar',
                      mode: 'lines',
                      line: { color: '#1e293b', width: 2 },
                      hoverinfo: 'skip'
                    },
                    // The Phasor Arm
                    {
                      r: [0, 1],
                      theta: [0, phasorAngleDeg],
                      type: 'scatterpolar',
                      mode: 'lines+markers',
                      line: { color: '#fbbf24', width: 6 },
                      marker: { size: 12, color: '#fbbf24', symbol: 'diamond' },
                      name: 'Phasor'
                    }
                  ]}
                  layout={{
                    autosize: true,
                    polar: {
                      bgcolor: 'rgba(0,0,0,0)',
                      radialaxis: { visible: false, range: [0, 1.1] },
                      angularaxis: {
                        tickfont: { color: '#475569', size: 9 },
                        linecolor: '#1e293b',
                        gridcolor: '#1e293b'
                      }
                    },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    margin: { l: 40, r: 40, b: 40, t: 40 },
                    showlegend: false
                  }}
                  useResizeHandler={true}
                  className="w-full h-full"
                  config={{ responsive: true, displayModeBar: false }}
                />
                
                {/* Visual Cue Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-10 pointer-events-none">
                   <div className="w-48 h-48 border-4 border-amber-500 rounded-full animate-ping duration-[3000ms]" />
                </div>
             </div>
          </div>

          {/* Right: The Wave */}
          <div className={`bg-slate-900 rounded-2xl border transition-all duration-500 flex flex-col overflow-hidden shadow-2xl ${
            highlightTarget === 'wave' ? 'border-cyan-500 ring-4 ring-cyan-500/10' : 'border-slate-800'
          }`}>
             <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Harmonic Trace</h3>
                <span className="text-[10px] font-mono text-cyan-500 bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-500/10">
                  y = sin(γ · ln x)
                </span>
             </div>
             <div className="flex-1 relative">
                <Plot
                  data={[
                    // The Trailing Wave
                    {
                      x: waveData.x,
                      y: waveData.y,
                      type: 'scatter',
                      mode: 'lines',
                      line: { color: '#fbbf24', width: 3, shape: 'spline' },
                      fill: 'tozeroy',
                      fillcolor: 'rgba(251, 191, 36, 0.05)',
                      hoverinfo: 'skip'
                    },
                    // The Current Leading Point
                    {
                      x: [currentU],
                      y: [Math.sin(gamma * currentU)],
                      type: 'scatter',
                      mode: 'markers',
                      marker: { 
                        size: 16, 
                        color: '#ffffff', 
                        line: { color: '#fbbf24', width: 3 },
                        symbol: 'circle'
                      },
                      name: 'Current Pulse'
                    }
                  ]}
                  layout={{
                    autosize: true,
                    xaxis: {
                      title: { 
                        text: 'Logarithmic Time (ln x)', 
                        font: { size: 10, color: highlightTarget === 'axis' ? '#22d3ee' : '#64748b' } 
                      },
                      color: '#64748b',
                      gridcolor: '#1e293b',
                      range: [waveData.startU, currentU],
                      zeroline: false,
                      showline: true,
                      linecolor: highlightTarget === 'axis' ? '#22d3ee' : '#334155',
                      linewidth: highlightTarget === 'axis' ? 2 : 1
                    },
                    yaxis: {
                      title: { text: 'Contribution', font: { size: 10 } },
                      range: [-1.5, 1.5],
                      color: '#64748b',
                      gridcolor: '#1e293b',
                      zerolinecolor: '#334155'
                    },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    margin: { l: 50, r: 30, b: 50, t: 40 },
                    showlegend: false
                  }}
                  useResizeHandler={true}
                  className="w-full h-full"
                  config={{ responsive: true, displayModeBar: false }}
                />

                {/* Vertical Projection Connector (Simulated within plot) */}
                <div className="absolute top-0 bottom-0 right-0 w-px border-l border-dashed border-amber-500/30 opacity-50" />
             </div>
          </div>
        </div>

        {/* Sync Explanation Footer */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-start gap-4">
           <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
             <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
           </div>
           <div>
             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Visual Proof of Synchronization</h4>
             <p className="text-[11px] text-slate-500 leading-tight">
               Watch the <span className="text-amber-400 font-bold">Atomic Spinner</span> on the left. Every time the hand points <span className="text-slate-200">straight UP (90°)</span>, the wave on the right hits a <span className="text-white font-bold">PEAK</span>. This is the fundamental link between circular motion and prime number harmonics.
             </p>
           </div>
        </div>
      </div>
    </StoryLayout>
  );
};

export default AtomicWave;
