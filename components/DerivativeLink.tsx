
import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { calculateChebyshevPsi, RIEMANN_ZEROS } from '../services/mathUtils';
import StoryLayout, { StoryStep } from './StoryLayout';

const DerivativeLink: React.FC = () => {
  const [numHarmonics, setNumHarmonics] = useState<number>(10);
  const [highlight, setHighlight] = useState<'top' | 'bottom' | 'link' | 'none'>('none');
  const [indicatorX, setIndicatorX] = useState<number | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
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

  const steps: StoryStep[] = [
    {
      id: 'speedometer',
      title: 'The Speedometer (Density)',
      narrative: (
        <p>
          In the previous view (Mixing Deck), we saw how waves interfere to create "Spikes". 
          Look at the <b>Bottom Graph</b>. This acts like a car's speedometer. It stays at zero (silence) and pulses up only when we hit a prime.
        </p>
      ),
      action: () => {
        setNumHarmonics(10);
        setHighlight('bottom');
        setIndicatorX(null);
      }
    },
    {
      id: 'odometer',
      title: 'The Odometer (Counting)',
      narrative: (
        <p>
          Now look at the <b>Top Graph</b>. This is the Odometer. It counts the total distance traveled. 
          Every time the bottom graph "Pulses", the top graph must <b>Step Up</b>.
        </p>
      ),
      action: () => {
        setHighlight('top');
        setIndicatorX(null);
      }
    },
    {
      id: 'link',
      title: 'The Mechanical Link',
      narrative: (
        <p>
          Watch what happens at <b>x = 13</b>. The waves align to create a Spike (Bottom). 
          This Spike pushes the Red Line up (Top). In Calculus, this is called <b>Integration</b>.
        </p>
      ),
      action: () => {
        setHighlight('link');
        setIndicatorX(13);
      }
    },
    {
      id: 'sharpen',
      title: 'Sharpening the Steps',
      narrative: (
        <p>
          If we only use 10 harmonics, the "Spike" is wide, so the "Step" is sloppy and curved. 
          To get a perfect vertical staircase, we need infinite harmonics. Watch the curves turn into sharp cliffs.
        </p>
      ),
      action: () => {
        setHighlight('none');
        setIndicatorX(null);
        setNumHarmonics(50);
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
        {/* Master Control Panel (Only in Sandbox) */}
        {isUnlocked && (
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div>
              <h2 className="text-xl font-bold text-emerald-400">Calculus of Primes</h2>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Lab Mode Enabled</p>
            </div>

            <div className="flex items-center gap-6 bg-slate-950/50 px-6 py-2 rounded-full border border-slate-800">
               <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-slate-500">HARMONICS (N)</span>
                 <span className="text-lg font-mono font-bold text-white">{numHarmonics}</span>
               </div>
               <input
                 type="range" min="1" max="100" step="1"
                 value={numHarmonics}
                 onChange={(e) => setNumHarmonics(parseInt(e.target.value))}
                 className="w-48 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
               />
            </div>
          </div>
        )}

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
                opacity: highlight === 'bottom' ? 0.2 : 1,
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
                opacity: highlight === 'top' ? 0.2 : 1,
                hovertemplate: 'Density Pulse: %{y:.2f}<extra></extra>'
              },
              // Indicator Line for Step 3
              ...(indicatorX !== null ? [{
                x: [indicatorX, indicatorX],
                y: [-3, 50],
                type: 'scatter',
                mode: 'lines',
                line: { color: '#22d3ee', dash: 'dash', width: 2 },
                xaxis: 'x',
                yaxis: 'y1',
                hoverinfo: 'skip'
              } as any] : [])
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
                title: 'Odometer (ψ)',
                color: '#f43f5e',
                gridcolor: '#1e293b',
                domain: [0.55, 1],
                range: [0, xLimit]
              },
              yaxis2: {
                title: 'Speedometer (Density)',
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
                  text: 'THE INTEGRAL: Total Prime Energy',
                  showarrow: false,
                  font: { color: '#f43f5e', size: 10, weight: 'bold' },
                  xanchor: 'left',
                  opacity: highlight === 'bottom' ? 0.2 : 1
                },
                {
                  x: 0.02,
                  y: 0.4,
                  xref: 'paper',
                  yref: 'paper',
                  text: 'THE DERIVATIVE: Interference Spikes',
                  showarrow: false,
                  font: { color: '#ffffff', size: 10, weight: 'bold' },
                  xanchor: 'left',
                  opacity: highlight === 'top' ? 0.2 : 1
                }
              ]
            }}
            useResizeHandler={true}
            className="w-full h-full"
            config={{ responsive: true, displayModeBar: false }}
          />

          {/* Step Highlights */}
          {highlight === 'bottom' && (
            <div className="absolute bottom-0 left-0 right-0 h-[45%] border-t-2 border-white/20 bg-white/5 pointer-events-none" />
          )}
          {highlight === 'top' && (
            <div className="absolute top-0 left-0 right-0 h-[45%] border-b-2 border-rose-500/20 bg-rose-500/5 pointer-events-none" />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex items-start gap-4">
             <div className="w-8 h-8 rounded bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20">
                <span className="text-rose-500 font-bold text-lg">&int;</span>
             </div>
             <div>
                <p className="text-xs font-bold text-rose-300 mb-1">Integral Thinking</p>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Calculus connects the rhythm (waves) to the results (steps). The smooth growth of ψ(x) is the average, the jumps are the primes.
                </p>
             </div>
          </div>
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex items-start gap-4">
             <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <span className="text-white font-bold text-sm">d/dx</span>
             </div>
             <div>
                <p className="text-xs font-bold text-slate-100 mb-1">Derivative Pulses</p>
                <p className="text-[11px] text-slate-500 leading-tight">
                  A prime is just a place where the "Music of the Zeros" plays in perfect unison, creating a spike in probability.
                </p>
             </div>
          </div>
        </div>
      </div>
    </StoryLayout>
  );
};

export default DerivativeLink;
