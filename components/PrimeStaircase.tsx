
import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { calculatePrimeData } from '../services/mathUtils';

interface PrimeStaircaseProps {
  xMax: number;
}

const PrimeStaircase: React.FC<PrimeStaircaseProps> = ({ xMax }) => {
  const data = useMemo(() => calculatePrimeData(xMax), [xMax]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
        <Plot
          data={[
            {
              x: data.xValues,
              y: data.piX,
              type: 'scatter',
              mode: 'lines',
              name: 'Actual Primes π(x)',
              line: { shape: 'hv', color: '#22d3ee', width: 2.5 },
              hovertemplate: 'Current Number: %{x}<br>Count: %{y}<extra></extra>'
            },
            {
              x: data.xValues,
              y: data.gaussApprox,
              type: 'scatter',
              mode: 'lines',
              name: "Gauss's Prediction (x/ln x)",
              line: { dash: 'dash', color: '#facc15', width: 2 },
              hovertemplate: 'x: %{x}<br>Prediction: %{y:.2f}<extra></extra>'
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
              text: 'The Prime Staircase',
              font: { color: '#f8fafc', size: 18 }
            },
            xaxis: {
              title: 'x (Integers)',
              color: '#94a3b8',
              gridcolor: '#1e293b',
              zerolinecolor: '#334155'
            },
            yaxis: {
              title: 'π(x) / Count',
              color: '#94a3b8',
              gridcolor: '#1e293b',
              zerolinecolor: '#334155'
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: { l: 60, r: 40, b: 60, t: 80 },
            legend: { font: { color: '#f8fafc' }, x: 0, y: 1 }
          }}
          useResizeHandler={true}
          className="w-full h-full"
          config={{ responsive: true }}
        />
      </div>
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
        <p className="text-sm text-slate-400 text-center italic">
          "The yellow line is the prediction. The blue steps are the reality. 
          The 'wobble' between the prediction and reality is exactly what the Riemann Zeros control."
        </p>
      </div>
    </div>
  );
};

export default PrimeStaircase;
