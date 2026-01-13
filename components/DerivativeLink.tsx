
import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { calculateChebyshevPsi, RIEMANN_ZEROS } from '../services/mathUtils';

const DerivativeLink: React.FC = () => {
  const [numHarmonics, setNumHarmonics] = useState<number>(10);
  const xLimit = 50;

  const data = useMemo(() => {
    const steps = 800;
    const xValues: number[] = [];
    const synthesizedPsi: number[] = [];
    const normalizedWaveSum: number[] = [];

    const ln2Pi = Math.log(2 * Math.PI);
    const activeZeros = RIEMANN_ZEROS.slice(0, numHarmonics);

    for (let i = 0; i <= steps; i++) {
      const x = 1.01 + (i / steps) * (xLimit - 1.01);
      xValues.push(x);

      // Top Data: Synthesized ψ(x) (The Integral)
      let psiSum = 0;
      for (const gamma of activeZeros) {
        psiSum += Math.sin(gamma * Math.log(x)) / gamma;
      }
      const psiVal = x - ln2Pi - 2 * Math.sqrt(x) * psiSum;
      synthesizedPsi.push(psiVal);

      // Bottom Data: Wave Sum (The Derivative)
      let derivativeSum = 0;
      for (const gamma of activeZeros) {
        derivativeSum += Math.cos(gamma * Math.log(x));
      }
      // Normalize by sqrt(N) as per Mixing Deck logic
      const normFactor = numHarmonics > 0 ? Math.sqrt(numHarmonics) : 1;
      normalizedWaveSum.push(derivativeSum / normFactor);
    }

    return { xValues, synthesizedPsi, normalizedWaveSum };
  }, [numHarmonics]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Master Control Panel */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-400">The Derivative Link</h2>
          <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Calculus of Primes</p>
        </div>

        <div className="flex items-center gap-6 bg-slate-950/50 px-6 py-2 rounded-full border border-slate-800">
           <div className="flex flex-col items-center">
             <span className="text-[10px] font-bold text-slate-500">HARMONICS (N)</span>
             <span className="text-lg font-mono font-bold text-white">{numHarmonics}</span>
           </div>
           <input
             type="range"
             min="1"
             max="50"
             step="1"
             value={numHarmonics}
             onChange={(e) => setNumHarmonics(parseInt(e.target.value))}
             className="w-48 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
           />
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-2xl relative">
        <Plot
          data={[
            // Top Trace: The Integral
            {
              x: data.xValues,
              y: data.synthesizedPsi,
              type: 'scatter',
              mode: 'lines',
              name: 'Integral (ψ(x))',
              line: { color: '#f43f5e', width: 2.5, shape: 'spline' },
              xaxis: 'x',
              yaxis: 'y1',
              hovertemplate: 'ψ(x): %{y:.2f}<extra></extra>'
            },
            // Bottom Trace: The Derivative
            {
              x: data.xValues,
              y: data.normalizedWaveSum,
              type: 'scatter',
              mode: 'lines',
              name: 'Derivative (Density)',
              line: { color: '#ffffff', width: 1.5, shape: 'spline' },
              fill: 'tozeroy',
              fillcolor: 'rgba(255,255,255,0.03)',
              xaxis: 'x',
              yaxis: 'y2',
              hovertemplate: 'Density Pulse: %{y:.2f}<extra></extra>'
            }
          ]}
          layout={{
            autosize: true,
            grid: { rows: 2, columns: 1, pattern: 'independent' },
            hovermode: 'x unified',
            hoverlabel: {
              bgcolor: '#0f172a',
              bordercolor: '#10b981',
              font: { color: '#ffffff', size: 12 }
            },
            showlegend: false,
            margin: { l: 60, r: 40, b: 60, t: 40 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: {
              title: 'x (The Number Line)',
              color: '#64748b',
              gridcolor: '#1e293b',
              range: [1, xLimit],
              anchor: 'y2'
            },
            yaxis1: {
              title: 'Accumulated Count (ψ)',
              color: '#f43f5e',
              gridcolor: '#1e293b',
              domain: [0.55, 1],
              range: [0, xLimit]
            },
            yaxis2: {
              title: 'Prime Density Pulse',
              color: '#ffffff',
              gridcolor: '#1e293b',
              domain: [0, 0.45],
              range: [-3, 5],
              zeroline: true,
              zerolinecolor: '#334155'
            },
            annotations: [
              {
                x: 0.02,
                y: 0.95,
                xref: 'paper',
                yref: 'paper',
                text: 'THE ODOMETER: Total Prime Count',
                showarrow: false,
                font: { color: '#f43f5e', size: 10, weight: 'bold' },
                xanchor: 'left'
              },
              {
                x: 0.02,
                y: 0.4,
                xref: 'paper',
                yref: 'paper',
                text: 'THE SPEEDOMETER: Instantaneous Density',
                showarrow: false,
                font: { color: '#ffffff', size: 10, weight: 'bold' },
                xanchor: 'left'
              }
            ]
          }}
          useResizeHandler={true}
          className="w-full h-full"
          config={{ responsive: true, displayModeBar: false }}
        />

        {/* Floating Context Labels */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full flex justify-around">
            <div className="bg-slate-950/80 px-4 py-1 rounded border border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Pulse &rarr; Step
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex items-start gap-4">
           <div className="w-8 h-8 rounded bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20">
              <span className="text-rose-500 font-bold text-lg">&int;</span>
           </div>
           <div>
              <p className="text-xs font-bold text-rose-300 mb-1">Top Graph: The Integral</p>
              <p className="text-[11px] text-slate-500 leading-tight">
                This represents the total "Prime Fuel" consumed. When the density spikes below, the odometer above clicks forward, creating a vertical "cliff" or step.
              </p>
           </div>
        </div>
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex items-start gap-4">
           <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
              <span className="text-white font-bold text-sm">d/dx</span>
           </div>
           <div>
              <p className="text-xs font-bold text-slate-100 mb-1">Bottom Graph: The Derivative</p>
              <p className="text-[11px] text-slate-500 leading-tight">
                This shows interference pulses. At $x=13, 17, 19...$ the waves align to form a peak. The higher the precision (N), the sharper and cleaner these pulses become.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DerivativeLink;