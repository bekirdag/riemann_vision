
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { RIEMANN_ZEROS } from '../services/mathUtils';

const AtomicWave: React.FC = () => {
  const [selectedZeroIndex, setSelectedZeroIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentU, setCurrentU] = useState<number>(0); // u = ln(x)
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const gamma = RIEMANN_ZEROS[selectedZeroIndex];

  const animate = (time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      if (isPlaying) {
        // Speed scaling to keep animation visible and pleasant
        setCurrentU(prev => prev + deltaTime * 0.5);
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
  }, [isPlaying]);

  const waveData = useMemo(() => {
    const points = 100;
    const historyWidth = 5; // How many units of ln(x) to show
    const uVals: number[] = [];
    const yVals: number[] = [];

    for (let i = 0; i <= points; i++) {
      const u = (currentU - historyWidth) + (i / points) * historyWidth;
      uVals.push(u);
      yVals.push(Math.sin(gamma * u));
    }
    return { x: uVals, y: yVals };
  }, [currentU, gamma]);

  const phasorAngle = (gamma * currentU) % (2 * Math.PI);
  const phasorX = Math.cos(phasorAngle);
  const phasorY = Math.sin(phasorAngle);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-amber-400">The Atomic Wave</h2>
          <p className="text-xs text-slate-400">Visualizing the frequency component of Zero #{selectedZeroIndex + 1}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Select Riemann Zero</label>
            <select
              value={selectedZeroIndex}
              onChange={(e) => {
                setSelectedZeroIndex(parseInt(e.target.value));
                setCurrentU(0); // Reset for visual consistency
              }}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {RIEMANN_ZEROS.slice(0, 5).map((z, i) => (
                <option key={i} value={i}>Zero #{i + 1} (γ ≈ {z.toFixed(2)})</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-6 py-2 rounded-lg font-bold text-xs uppercase transition-all shadow-lg ${
              isPlaying 
                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
                : 'bg-amber-600 text-white hover:bg-amber-500 shadow-amber-900/40'
            }`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      {/* Animation Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Left: Phasor (The Spinner) */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative shadow-2xl">
          <Plot
            data={[
              // Unit Circle
              {
                r: Array(101).fill(1),
                theta: Array.from({length: 101}, (_, i) => (i * 360) / 100),
                type: 'scatterpolar',
                mode: 'lines',
                line: { color: '#334155', width: 1 },
                hoverinfo: 'skip'
              },
              // The Phasor Vector
              {
                r: [0, 1],
                theta: [0, (phasorAngle * 180) / Math.PI],
                type: 'scatterpolar',
                mode: 'lines+markers',
                line: { color: '#fbbf24', width: 4 },
                marker: { size: 10, color: '#fbbf24' },
                name: 'Phasor',
                hovertemplate: `Angle: ${phasorAngle.toFixed(2)} rad<extra></extra>`
              }
            ]}
            layout={{
              autosize: true,
              title: {
                text: 'Rotating Phasor (The Clock)',
                font: { color: '#f8fafc', size: 16 }
              },
              polar: {
                bgcolor: 'rgba(0,0,0,0)',
                radialaxis: { visible: false, range: [0, 1.1] },
                angularaxis: {
                  tickfont: { color: '#64748b', size: 10 },
                  linecolor: '#1e293b'
                }
              },
              paper_bgcolor: 'rgba(0,0,0,0)',
              margin: { l: 40, r: 40, b: 40, t: 60 },
              showlegend: false
            }}
            useResizeHandler={true}
            className="w-full h-full"
            config={{ responsive: true, displayModeBar: false }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
            <span className="text-9xl font-bold text-amber-400 font-mono">
              γ={gamma.toFixed(1)}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 bg-slate-950/80 p-3 rounded-lg border border-slate-800 max-w-[240px]">
            <p className="text-[11px] text-slate-400 leading-tight">
              The imaginary part <span className="text-amber-400">γ</span> acts as the rotation frequency. It determines how fast this phasor spins in the complex plane.
            </p>
          </div>
        </div>

        {/* Right: Wave Output */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative shadow-2xl">
          <Plot
            data={[
              {
                x: waveData.x,
                y: waveData.y,
                type: 'scatter',
                mode: 'lines',
                line: { color: '#fbbf24', width: 3, shape: 'spline' },
                fill: 'tozeroy',
                fillcolor: 'rgba(251, 191, 36, 0.05)',
                name: 'sin(γ·ln x)'
              },
              // Current Point Marker
              {
                x: [currentU],
                y: [Math.sin(gamma * currentU)],
                type: 'scatter',
                mode: 'markers',
                marker: { size: 14, color: '#ffffff', line: { color: '#fbbf24', width: 2 } },
                hoverinfo: 'none'
              }
            ]}
            layout={{
              autosize: true,
              title: {
                text: 'Logarithmic Frequency Wave',
                font: { color: '#f8fafc', size: 16 }
              },
              xaxis: {
                title: 'Time (ln x)',
                color: '#64748b',
                gridcolor: '#1e293b',
                zeroline: false
              },
              yaxis: {
                title: 'Contribution to ψ(x)',
                range: [-1.2, 1.2],
                color: '#64748b',
                gridcolor: '#1e293b'
              },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              margin: { l: 50, r: 40, b: 60, t: 60 },
              showlegend: false
            }}
            useResizeHandler={true}
            className="w-full h-full"
            config={{ responsive: true, displayModeBar: false }}
          />
          <div className="absolute bottom-4 right-4 bg-slate-950/80 p-3 rounded-lg border border-slate-800 max-w-[240px]">
            <p className="text-[11px] text-slate-400 leading-tight">
              As the phasor spins, it traces a wave. This specific "pitch" is what Riemann summed up to find the exact location of primes.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="bg-amber-600/10 border border-amber-600/20 p-4 rounded-xl">
        <p className="text-sm text-amber-200/70 text-center italic">
          "Each zero of the Zeta function corresponds to a harmonic in the distribution of primes. The higher the zero, the faster the rotation, the higher the frequency."
        </p>
      </div>
    </div>
  );
};

export default AtomicWave;
