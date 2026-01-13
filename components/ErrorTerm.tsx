
import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { calculateErrorData } from '../services/mathUtils';
import StoryLayout, { StoryStep } from './StoryLayout';

const ErrorTerm: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState('gauss');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const xLimit = 200;
  const numZeros = 50;

  const data = useMemo(() => calculateErrorData(xLimit, numZeros), [xLimit, numZeros]);

  const steps: StoryStep[] = [
    {
      id: 'gauss',
      title: "Gauss's Guess (Li(x))",
      narrative: (
        <p>
          In 1793, Gauss predicted that primes follow a smooth curve called the <b>Logarithmic Integral, $Li(x)$</b>. 
          From a distance, it looks almost perfect. The actual primes (Cyan steps) track the curve (Yellow line) remarkably well.
        </p>
      ),
      action: () => setActiveStepId('gauss')
    },
    {
      id: 'deviation',
      title: "The Deviation (The Noise)",
      narrative: (
        <p>
          But if we subtract the smooth curve from the primes ($π(x) - Li(x)$), we see <b>chaos</b>. 
          This jagged line represents the "randomness" of the prime numbers. It oscillates around zero, seemingly without a rule.
        </p>
      ),
      action: () => setActiveStepId('deviation')
    },
    {
      id: 'correction',
      title: "Riemann's Correction",
      narrative: (
        <p>
          This is where Riemann steps in. If we sum up our <b>Harmonic Waves</b> (from the Zeros we found) and overlay them (Red line), something magical happens. 
          The smooth waves line up perfectly with the jagged chaos. The "noise" is actually <b>music</b>.
        </p>
      ),
      action: () => setActiveStepId('correction')
    },
    {
      id: 'bounds',
      title: "The Hypothesis (The Bounds)",
      narrative: (
        <p>
          The Riemann Hypothesis is a promise about this error. It guarantees that this chaos will never exceed strict boundaries. 
          The dashed lines represent these theoretical limits. If a single zero were off the line, the error would <b>explode</b> past these bounds.
        </p>
      ),
      action: () => setActiveStepId('bounds')
    }
  ];

  const plotTraces = useMemo(() => {
    if (activeStepId === 'gauss') {
      return [
        {
          x: data.xValues,
          y: data.piX,
          type: 'scatter',
          mode: 'lines',
          name: 'Actual Primes π(x)',
          line: { shape: 'hv', color: '#22d3ee', width: 2 },
          hovertemplate: 'x: %{x}<br>Count: %{y}<extra></extra>'
        },
        {
          x: data.xValues,
          y: data.liValues,
          type: 'scatter',
          mode: 'lines',
          name: 'Gauss Approx Li(x)',
          line: { color: '#facc15', width: 2, dash: 'dot' },
          hovertemplate: 'x: %{x}<br>Li(x): %{y:.2f}<extra></extra>'
        }
      ];
    }

    const traces: any[] = [
      {
        x: data.xValues,
        y: data.actualError,
        type: 'scatter',
        mode: 'lines',
        name: 'Prime Error (π - Li)',
        line: { shape: 'hv', color: '#22d3ee', width: 2 },
        hovertemplate: 'x: %{x}<br>Error: %{y:.4f}<extra></extra>'
      }
    ];

    if (activeStepId === 'correction' || activeStepId === 'bounds' || isUnlocked) {
      traces.push({
        x: data.xValues,
        y: data.riemannCorrection,
        type: 'scatter',
        mode: 'lines',
        name: 'Riemann Correction Sum',
        line: { color: '#f43f5e', width: 2 },
        hovertemplate: 'x: %{x}<br>Correction: %{y:.4f}<extra></extra>'
      });
    }

    if (activeStepId === 'bounds' || isUnlocked) {
      traces.push(
        {
          x: data.xValues,
          y: data.boundsUpper,
          type: 'scatter',
          mode: 'lines',
          name: 'Hypothesis Bound (+)',
          line: { color: '#475569', dash: 'dash', width: 1 },
          hoverinfo: 'skip'
        },
        {
          x: data.xValues,
          y: data.boundsLower,
          type: 'scatter',
          mode: 'lines',
          name: 'Hypothesis Bound (-)',
          line: { color: '#475569', dash: 'dash', width: 1 },
          fill: 'tonexty',
          fillcolor: 'rgba(71, 85, 105, 0.05)',
          hoverinfo: 'skip'
        }
      );
    }

    return traces;
  }, [data, activeStepId, isUnlocked]);

  return (
    <StoryLayout
      steps={steps}
      isUnlocked={isUnlocked}
      onExploreFreely={() => setIsUnlocked(true)}
    >
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
          <Plot
            data={plotTraces as any}
            layout={{
              autosize: true,
              hovermode: 'x unified',
              title: {
                text: activeStepId === 'gauss' ? 'The Prime Trend' : 'The Error Landscape',
                font: { color: '#f8fafc', size: 18 }
              },
              xaxis: {
                title: 'Number line (x)',
                color: '#94a3b8',
                gridcolor: '#1e293b',
                zerolinecolor: '#334155'
              },
              yaxis: {
                title: activeStepId === 'gauss' ? 'Count' : 'Deviation (π - Li)',
                color: '#94a3b8',
                gridcolor: '#1e293b',
                zerolinecolor: '#334155'
              },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              margin: { l: 60, r: 40, b: 60, t: 80 },
              legend: { font: { color: '#94a3b8', size: 10 }, x: 0, y: 1 },
              showlegend: true
            }}
            useResizeHandler={true}
            className="w-full h-full"
            config={{ responsive: true, displayModeBar: false }}
          />
        </div>

        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-6">
           <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">Order from Chaos</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Riemann proved that the Primes are not random. They are the sum of pure musical tones. The zeros of the Zeta function are the frequencies that tell the primes where to go.
              </p>
           </div>
           <div className="shrink-0 flex items-center gap-2 bg-emerald-950/20 px-4 py-2 rounded-lg border border-emerald-500/20">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Finale Reached</span>
           </div>
        </div>
      </div>
    </StoryLayout>
  );
};

export default ErrorTerm;
