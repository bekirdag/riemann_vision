
import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';

const HypothesisStatement: React.FC = () => {
  const [scannerSigma, setScannerSigma] = useState<number>(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      // Oscillate scanner between 0 and 1
      const sigma = 0.5 + 0.5 * Math.sin(elapsed * 2);
      setScannerSigma(sigma);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const isScanningCriticalLine = Math.abs(scannerSigma - 0.5) < 0.02;
  const scannerColor = isScanningCriticalLine ? '#22d3ee' : '#f43f5e';

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-hidden">
      {/* Dossier Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-2xl border-l-8 border-cyan-500 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-4 -right-4 bg-red-600/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] px-8 py-4 rotate-12 border border-red-500/30">
            Unsolved
          </div>
          <span className="text-cyan-500 font-bold text-xs uppercase tracking-widest mb-2 block">Case File: The Millenium Prize</span>
          <h2 className="text-4xl font-black text-white leading-none mb-4">The <span className="text-cyan-400">Hypothesis</span></h2>
          
          <div className="space-y-4 max-w-2xl">
            <p className="text-slate-300 text-lg leading-relaxed font-serif italic">
              "The real part of every non-trivial zero of the Riemann zeta function is exactly 1/2."
            </p>
            <div className="h-px bg-slate-800 w-full" />
            <div className="grid grid-cols-2 gap-8 py-2">
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">The Claim</h4>
                <p className="text-xs text-slate-400">All zeros of the function in the critical strip lie on a single, perfectly straight vertical line.</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">The Stakes</h4>
                <p className="text-xs text-slate-400">If true, prime numbers are distributed as predictably as mathematics allows. If false, the "Music of the Primes" contains a fatal noise.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-center">
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-tighter">Mathematical Translation</h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
             <code className="text-lg font-mono text-cyan-400">
               &zeta;(s) = 0 <br/>
               &rArr; Re(s) = 1/2
             </code>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 leading-tight">
            {/* Fix: Escaped < characters to prevent them from being parsed as JSX tags which caused errors for the capitalized Re name */}
            For all $s$ such that $0 &lt; Re(s) &lt; 1$. These are the "Non-Trivial" zeros.
          </p>
        </div>
      </div>

      {/* Animated Scanner Visual */}
      <div className="flex-1 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative">
        <div className="absolute top-6 left-8 z-10">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-colors ${isScanningCriticalLine ? 'bg-cyan-500/20 border-cyan-500' : 'bg-slate-950/50 border-slate-800'}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${isScanningCriticalLine ? 'bg-cyan-400' : 'bg-red-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              {isScanningCriticalLine ? "Match Detected: Critical Line" : `Scanning Domain: Re(s) = ${scannerSigma.toFixed(3)}`}
            </span>
          </div>
        </div>

        <Plot
          data={[
            {
              // The Critical Line (Goal)
              x: [0.5, 0.5],
              y: [-10, 50],
              type: 'scatter',
              mode: 'lines',
              name: 'Critical Line',
              line: { color: '#22d3ee', width: 2, dash: 'dash' },
              hoverinfo: 'skip'
            },
            {
              // Zeros on the line
              x: [0.5, 0.5, 0.5, 0.5],
              y: [14.13, 21.02, 25.01, 30.42],
              type: 'scatter',
              mode: 'markers',
              name: 'Known Zeros',
              marker: { color: '#22d3ee', size: 12, line: { color: '#ffffff', width: 1 } },
              hoverinfo: 'skip'
            },
            {
              // The Scanner Line
              x: [scannerSigma, scannerSigma],
              y: [-10, 50],
              type: 'scatter',
              mode: 'lines',
              name: 'Scanner',
              line: { color: scannerColor, width: 4 },
              hoverinfo: 'skip'
            }
          ]}
          layout={{
            autosize: true,
            margin: { l: 80, r: 80, b: 60, t: 80 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: {
              title: 'Real Part Re(s)',
              range: [-0.2, 1.2],
              color: '#64748b',
              gridcolor: '#1e293b',
              zeroline: false,
              dtick: 0.1
            },
            yaxis: {
              title: 'Imaginary Part Im(s)',
              range: [0, 45],
              color: '#64748b',
              gridcolor: '#1e293b',
              zeroline: false
            },
            showlegend: false,
            shapes: [
              {
                // Critical Strip
                type: 'rect',
                xref: 'x',
                yref: 'paper',
                x0: 0,
                y0: 0,
                x1: 1,
                y1: 1,
                fillcolor: 'rgba(255, 255, 255, 0.02)',
                line: { width: 0 }
              }
            ],
            annotations: [
              {
                x: 0.5,
                y: 43,
                xref: 'x',
                yref: 'y',
                text: 'CRITICAL LINE',
                showarrow: false,
                font: { color: '#22d3ee', size: 10, weight: 'bold' }
              }
            ]
          }}
          useResizeHandler={true}
          className="w-full h-full"
          config={{ responsive: true, displayModeBar: false }}
        />
        
        {/* Radar Overlay */}
        <div className="absolute inset-0 pointer-events-none border-[30px] border-slate-950/40 rounded-3xl" />
        <div className="absolute bottom-8 right-8 max-w-xs text-right">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Observation</p>
          <p className="text-xs text-slate-400 leading-tight">
            Billions of zeros have been checked using supercomputers. Every single one sits precisely on the line. But in math, a billion examples is not a proof.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HypothesisStatement;
