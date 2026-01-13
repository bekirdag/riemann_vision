
import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { calculateZeta, Complex } from '../services/mathUtils';

interface ZeroHunterProps {
  tStart: number;
  tEnd: number;
  iterations: number;
}

const KNOWN_ZEROS = [
  { t: 14.134725, label: 'γ₁' },
  { t: 21.022040, label: 'γ₂' },
  { t: 25.010858, label: 'γ₃' }
];

const ZeroHunter: React.FC<ZeroHunterProps> = ({ tStart, tEnd, iterations }) => {
  const data = useMemo(() => {
    const steps = 400;
    const stepSize = (tEnd - tStart) / steps;
    const tValues: number[] = [];
    const magnitudes: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = tStart + i * stepSize;
      const zeta = calculateZeta(new Complex(0.5, t), iterations);
      tValues.push(t);
      magnitudes.push(zeta.abs());
    }

    return { tValues, magnitudes };
  }, [tStart, tEnd, iterations]);

  const annotations = useMemo(() => {
    return KNOWN_ZEROS.filter(z => z.t >= tStart && z.t <= tEnd).map(z => ({
      x: z.t,
      y: 0,
      xref: 'x',
      yref: 'y',
      text: z.label,
      showarrow: true,
      arrowhead: 2,
      ax: 0,
      ay: -40,
      font: { color: '#22d3ee', size: 14 }
    }));
  }, [tStart, tEnd]);

  return (
    <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
      <Plot
        data={[
          {
            x: data.tValues,
            y: data.magnitudes,
            type: 'scatter',
            mode: 'lines',
            name: '|ζ(1/2 + it)|',
            line: { color: '#22d3ee', width: 2 },
            fill: 'tozeroy',
            fillcolor: 'rgba(34, 211, 238, 0.1)',
            hovertemplate: '<b>s = 0.5 + %{x:.4f}i</b><br>|ζ(s)|: %{y:.6f}<extra></extra>'
          },
          {
            x: [tStart, tEnd],
            y: [0, 0],
            type: 'scatter',
            mode: 'lines',
            name: 'Zero Line',
            line: { color: '#64748b', dash: 'dash', width: 1 },
            hoverinfo: 'skip'
          }
        ]}
        layout={{
          autosize: true,
          hovermode: 'closest',
          hoverlabel: {
            bgcolor: '#1e293b',
            bordercolor: '#22d3ee',
            font: { color: '#ffffff', family: 'monospace', size: 13 }
          },
          title: {
            text: 'Magnitude along the Critical Line (Re(s) = 0.5)',
            font: { color: '#f8fafc', size: 18 }
          },
          xaxis: {
            title: 'Imaginary Part (t)',
            color: '#94a3b8',
            gridcolor: '#1e293b',
            zerolinecolor: '#334155'
          },
          yaxis: {
            title: 'Magnitude |ζ(0.5 + it)|',
            color: '#94a3b8',
            gridcolor: '#1e293b',
            zerolinecolor: '#334155'
          },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          margin: { l: 60, r: 40, b: 60, t: 80 },
          showlegend: false,
          annotations: annotations as any
        }}
        useResizeHandler={true}
        className="w-full h-full"
        config={{ responsive: true }}
      />
    </div>
  );
};

export default ZeroHunter;
