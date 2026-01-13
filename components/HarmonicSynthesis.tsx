
import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { calculateChebyshevPsi, RIEMANN_ZEROS } from '../services/mathUtils';

const HarmonicSynthesis: React.FC = () => {
  const [numHarmonics, setNumHarmonics] = useState<number>(0);
  const xLimit = 50;

  const data = useMemo(() => {
    const steps = 300;
    const xValues: number[] = [];
    const targetPsi: number[] = [];
    const synthesized: number[] = [];
    const currentHarmonic: number[] = [];

    const ln2Pi = Math.log(2 * Math.PI);

    for (let i = 0; i <= steps; i++) {
      const x = 1.001 + (i / steps) * (xLimit - 1.001);
      xValues.push(x);
      
      // Target Step Function: Chebyshev Psi(x)
      targetPsi.push(calculateChebyshevPsi(x));

      // Synthesized Approximation using Explicit Formula
      // psi(x) ~ x - sum_{rho} x^rho / rho - ln(2pi)
      // Since rho = 0.5 + i*gamma and 0.5 - i*gamma:
      // x^(0.5+i*gamma) / (0.5+i*gamma) + x^(0.5-i*gamma) / (0.5-i*gamma)
      // reduces to approximately 2 * sqrt(x) * sin(gamma * ln x) / gamma for large gamma
      let sum = 0;
      const activeZeros = RIEMANN_ZEROS.slice(0, numHarmonics);
      for (const gamma of activeZeros) {
        sum += Math.sin(gamma * Math.log(x)) / gamma;
      }
      
      const val = x - ln2Pi - 2 * Math.sqrt(x) * sum;
      synthesized.push(val);

      // Current isolated harmonic (the contribution of the N-th zero)
      if (numHarmonics > 0) {
        const lastGamma = RIEMANN_ZEROS[numHarmonics - 1];
        currentHarmonic.push(- (2 * Math.sqrt(x) * Math.sin(lastGamma * Math.log(x))) / lastGamma);
      } else {
        currentHarmonic.push(0);
      }
    }

    return { xValues, targetPsi, synthesized, currentHarmonic };
  }, [numHarmonics]);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 shadow-lg">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-white">The Music of the Primes</h2>
            <p className="text-xs text-slate-400">Synthesizing &psi;(x) from Riemann Zeros</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Active Harmonics</span>
              <span className="text-2xl font-mono font-bold text-rose-500">{numHarmonics}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={numHarmonics}
              onChange={(e) => setNumHarmonics(parseInt(e.target.value))}
              className="w-48 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-rows-[2fr,1fr] gap-4 flex-1 min-h-0">
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative border border-slate-800/50">
          <Plot
            data={[
              {
                x: data.xValues,
                y: data.targetPsi,
                type: 'scatter',
                mode: 'lines',
                name: 'Target: ψ(x) (Prime Steps)',
                line: { shape: 'hv', color: '#22d3ee', width: 2 },
                opacity: 0.6
              },
              {
                x: data.xValues,
                y: data.synthesized,
                type: 'scatter',
                mode: 'lines',
                name: 'Synthesized Curve',
                line: { shape: 'spline', color: '#f43f5e', width: 2.5 },
                hovertemplate: 'x: %{x:.2f}<br>ψ(x) ≈ %{y:.4f}<extra></extra>'
              }
            ]}
            layout={{
              autosize: true,
              hovermode: 'x unified',
              hoverlabel: {
                bgcolor: '#ffffff',
                bordercolor: '#22d3ee',
                font: { color: '#1e293b', size: 13 }
              },
              title: {
                text: 'Reconstructing the Prime Staircase',
                font: { color: '#f8fafc', size: 16 }
              },
              xaxis: { 
                title: 'x', 
                color: '#94a3b8', 
                gridcolor: '#1e293b', 
                range: [1, xLimit] 
              },
              yaxis: { 
                title: 'ψ(x)', 
                color: '#94a3b8', 
                gridcolor: '#1e293b', 
                range: [0, 50] 
              },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              margin: { l: 50, r: 20, b: 40, t: 60 },
              legend: { font: { color: '#f8fafc', size: 10 }, x: 0, y: 1 },
              showlegend: true
            }}
            useResizeHandler={true}
            className="w-full h-full"
            config={{ responsive: true }}
          />
          
          <div className="absolute bottom-4 right-4 max-w-[200px] pointer-events-none">
             <p className="text-[10px] text-slate-500 bg-slate-950/80 p-2 rounded border border-slate-800 italic">
               Adding more zeros creates higher-frequency interference that sharpens the vertical jumps.
             </p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative border border-slate-800/50">
          <Plot
            data={[
              {
                x: data.xValues,
                y: data.currentHarmonic,
                type: 'scatter',
                mode: 'lines',
                name: `Zero #${numHarmonics}`,
                line: { color: numHarmonics > 0 ? '#fbbf24' : 'rgba(0,0,0,0)', width: 1.5 },
                fill: 'tozeroy',
                fillcolor: 'rgba(251, 191, 36, 0.1)'
              }
            ]}
            layout={{
              autosize: true,
              hoverlabel: {
                bgcolor: '#ffffff',
                bordercolor: '#22d3ee',
                font: { color: '#1e293b', size: 13 }
              },
              title: {
                text: numHarmonics > 0 ? `N-th Harmonic Detail (Zero at γ ≈ ${RIEMANN_ZEROS[numHarmonics-1].toFixed(2)})` : 'Add Zeros to see Harmonics',
                font: { color: '#94a3b8', size: 12 }
              },
              xaxis: { visible: false, range: [1, xLimit] },
              yaxis: { title: 'Contribution', color: '#64748b', gridcolor: '#1e293b' },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              margin: { l: 50, r: 20, b: 20, t: 40 },
              showlegend: false
            }}
            useResizeHandler={true}
            className="w-full h-full"
            config={{ responsive: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default HarmonicSynthesis;
