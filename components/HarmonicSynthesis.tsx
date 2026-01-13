
import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { calculateChebyshevPsi, RIEMANN_ZEROS } from '../services/mathUtils';
import StoryLayout, { StoryStep } from './StoryLayout';

const HarmonicSynthesis: React.FC = () => {
  const [numHarmonics, setNumHarmonics] = useState<number>(0);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
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
      
      targetPsi.push(calculateChebyshevPsi(x));

      let sum = 0;
      const activeZeros = RIEMANN_ZEROS.slice(0, numHarmonics);
      for (const gamma of activeZeros) {
        sum += Math.sin(gamma * Math.log(x)) / gamma;
      }
      
      const val = x - ln2Pi - 2 * Math.sqrt(x) * sum;
      synthesized.push(val);

      if (numHarmonics > 0) {
        const lastGamma = RIEMANN_ZEROS[numHarmonics - 1];
        currentHarmonic.push(- (2 * Math.sqrt(x) * Math.sin(lastGamma * Math.log(x))) / lastGamma);
      } else {
        currentHarmonic.push(0);
      }
    }

    return { xValues, targetPsi, synthesized, currentHarmonic };
  }, [numHarmonics]);

  const steps: StoryStep[] = [
    {
      id: 'step1',
      title: 'The Flat Line',
      narrative: (
        <p>
          We start with a linear approximation ($y=x$). This simple model assumes primes are distributed evenly across the number line. 
          As you can see, the red line is far from the reality of the blue prime steps.
        </p>
      ),
      action: () => setNumHarmonics(0)
    },
    {
      id: 'step2',
      title: 'The First Wave',
      narrative: (
        <p>
          Let's add the first zero ($\gamma_1 \approx 14.13i$). This introduces a large, lazy wave. 
          Notice how the curve begins to bend, attempting to reconcile the linear growth with the first "bump" in prime density.
        </p>
      ),
      action: () => setNumHarmonics(1)
    },
    {
      id: 'step3',
      title: 'The Correction',
      narrative: (
        <p>
          Adding the second zero ($\gamma_2 \approx 21.02i$) provides a correction to the first wave. 
          The interference between these two harmonics starts to "carve out" the shape of the prime staircase.
        </p>
      ),
      action: () => setNumHarmonics(2)
    },
    {
      id: 'step4',
      title: 'The Lock-In',
      narrative: (
        <p>
          Now watch what happens with 50 zeros. The higher-frequency waves interfere constructively to sculpt sharp corners. 
          The "Music of the Primes" is now in full polyphony, perfectly matching the staircase.
        </p>
      ),
      action: () => setNumHarmonics(50)
    }
  ];

  return (
    <StoryLayout 
      steps={steps} 
      onExploreFreely={() => setIsUnlocked(true)}
      isUnlocked={isUnlocked}
    >
      <div className="w-full h-full flex flex-col gap-6">
        {isUnlocked && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex flex-col">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Sandbox Controls</h2>
                <p className="text-[10px] text-slate-500">Manual Harmonic Tuning</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Active Harmonics</span>
                  <span className="text-lg font-mono font-bold text-rose-500">{numHarmonics}</span>
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
        )}

        <div className={`grid gap-4 flex-1 min-h-0 ${isUnlocked ? 'grid-rows-[2fr,1fr]' : 'grid-rows-[1fr]'}`}>
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800/50">
            <Plot
              data={[
                {
                  x: data.xValues,
                  y: data.targetPsi,
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Target: ψ(x)',
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
                  text: 'The Explicit Formula Approximation',
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
          </div>

          {isUnlocked && (
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800/50 animate-in fade-in zoom-in-95 duration-700">
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
                  title: {
                    text: numHarmonics > 0 ? `N-th Harmonic Detail` : 'Add Zeros to see Harmonics',
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
          )}
        </div>
      </div>
    </StoryLayout>
  );
};

export default HarmonicSynthesis;
