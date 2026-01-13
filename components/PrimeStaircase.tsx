
import React, { useMemo, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { calculatePrimeData } from '../services/mathUtils';
import * as math from 'mathjs';

interface PrimeStaircaseProps {
  xMax: number;
  customFormula?: string;
  onFormulaError?: (error: string | null) => void;
}

type DisplayMode = 'STAIRCASE' | 'SCATTER';

const PrimeStaircase: React.FC<PrimeStaircaseProps> = ({ xMax, customFormula, onFormulaError }) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('STAIRCASE');
  const data = useMemo(() => calculatePrimeData(xMax), [xMax]);

  const scatterData = useMemo(() => {
    const primesX: number[] = [];
    const primesY: number[] = [];
    for (let x = 1; x <= xMax; x++) {
      if (data.isPrime[x]) {
        primesX.push(x);
        primesY.push(data.piX[x - 1]);
      }
    }
    return { x: primesX, y: primesY };
  }, [data, xMax]);

  const customTraceData = useMemo(() => {
    if (!customFormula) return null;
    
    try {
      const node = math.parse(customFormula);
      const code = node.compile();
      const yValues: number[] = [];
      const xValues: number[] = [];

      for (let x = 1; x <= xMax; x++) {
        try {
          const val = code.evaluate({ x });
          if (typeof val === 'number' && isFinite(val)) {
            xValues.push(x);
            yValues.push(val);
          }
        } catch (e) {
          // Skip invalid points
        }
      }
      
      onFormulaError?.(null);
      return { x: xValues, y: yValues };
    } catch (err: any) {
      onFormulaError?.(`Invalid Syntax: ${err.message}`);
      return null;
    }
  }, [customFormula, xMax, onFormulaError]);

  const mainTrace = displayMode === 'STAIRCASE' ? {
    x: data.xValues,
    y: data.piX,
    type: 'scatter' as const,
    mode: 'lines' as const,
    name: 'Actual Primes π(x)',
    line: { shape: 'hv' as const, color: '#22d3ee', width: 2.5 },
    hovertemplate: 'Current Number: %{x}<br>Count: %{y}<extra></extra>'
  } : {
    x: scatterData.x,
    y: scatterData.y,
    type: 'scatter' as const,
    mode: 'markers' as const,
    name: 'Prime Points',
    marker: { color: '#22d3ee', size: 6, opacity: 0.8 },
    hovertemplate: 'Prime Number: %{x}<br>Index: %{y}<extra></extra>'
  };

  const traces: any[] = [
    mainTrace,
    {
      x: data.xValues,
      y: data.gaussApprox,
      type: 'scatter',
      mode: 'lines',
      name: "Gauss's Prediction (x/ln x)",
      line: { dash: 'dash', color: '#facc15', width: 2, opacity: 0.5 },
      hovertemplate: 'x: %{x}<br>Prediction: %{y:.2f}<extra></extra>'
    }
  ];

  if (customTraceData) {
    traces.push({
      x: customTraceData.x,
      y: customTraceData.y,
      type: 'scatter',
      mode: 'lines',
      name: 'Custom User Formula',
      line: { color: '#d946ef', width: 2 },
      hovertemplate: 'x: %{x}<br>Your Estimate: %{y:.2f}<extra></extra>'
    });
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* View Toggle */}
      <div className="flex justify-center">
        <div className="bg-slate-900 p-1 rounded-lg flex gap-1 shadow-inner border border-slate-800">
          <button
            onClick={() => setDisplayMode('STAIRCASE')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              displayMode === 'STAIRCASE'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            STAIRCASE
          </button>
          <button
            onClick={() => setDisplayMode('SCATTER')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              displayMode === 'SCATTER'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            PRIME DOTS
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
        <Plot
          data={traces}
          layout={{
            autosize: true,
            hovermode: 'closest',
            hoverlabel: {
              bgcolor: '#1e293b',
              bordercolor: '#22d3ee',
              font: { color: '#ffffff', family: 'monospace', size: 13 }
            },
            title: {
              text: displayMode === 'STAIRCASE' ? 'The Prime Staircase π(x)' : 'Prime Distribution Scatter',
              font: { color: '#f8fafc', size: 18 }
            },
            xaxis: {
              title: 'x (Integers)',
              color: '#94a3b8',
              gridcolor: '#1e293b',
              zerolinecolor: '#334155'
            },
            yaxis: {
              title: 'Count',
              color: '#94a3b8',
              gridcolor: '#1e293b',
              zerolinecolor: '#334155'
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: { l: 60, r: 40, b: 60, t: 80 },
            legend: { font: { color: '#f8fafc', size: 10 }, x: 0, y: 1 }
          }}
          useResizeHandler={true}
          className="w-full h-full"
          config={{ responsive: true }}
        />
      </div>

      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
        <p className="text-sm text-slate-400 text-center italic">
          {displayMode === 'STAIRCASE' 
            ? "Compare the actual primes (cyan) with Gauss (yellow) and your custom formula (magenta)."
            : "Only prime numbers are plotted here. See which approximation line best tracks the clusters."}
        </p>
      </div>
    </div>
  );
};

export default PrimeStaircase;
