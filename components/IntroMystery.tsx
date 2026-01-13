
import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

const IntroMystery: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(0);
  const zoomConfigs = [
    { limit: 100, size: 10, label: "The First 100" },
    { limit: 400, size: 20, label: "First 400" },
    { limit: 1600, size: 40, label: "1,600 Numbers" },
    { limit: 10000, size: 100, label: "10,000 Numbers" },
  ];

  const currentConfig = zoomConfigs[zoomLevel];

  const plotData = useMemo(() => {
    const primesX: number[] = [];
    const primesY: number[] = [];
    const compositesX: number[] = [];
    const compositesY: number[] = [];

    const size = Math.sqrt(currentConfig.limit);
    
    for (let n = 1; n <= currentConfig.limit; n++) {
      // Simple grid visualization: wrapping numbers
      const x = (n - 1) % size;
      const y = Math.floor((n - 1) / size);

      if (isPrime(n)) {
        primesX.push(x);
        primesY.push(y);
      } else {
        compositesX.push(x);
        compositesY.push(y);
      }
    }

    return { primesX, primesY, compositesX, compositesY };
  }, [currentConfig]);

  const handleZoom = () => {
    setZoomLevel((prev) => (prev + 1) % zoomConfigs.length);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 overflow-hidden">
      {/* Left Panel: Scrollytelling Narrative */}
      <div className="md:w-1/3 flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar">
        <div className="space-y-4">
          <span className="inline-block px-2 py-1 bg-cyan-900/30 text-cyan-400 text-[10px] font-bold uppercase tracking-tighter rounded border border-cyan-500/20">
            Step 0: The Context
          </span>
          <h2 className="text-3xl font-bold text-white leading-tight">
            The Great <span className="text-cyan-400">Mystery</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Prime numbers are the <span className="text-slate-200 font-bold">Atoms of Arithmetic</span>. Every whole number can be built by multiplying them together.
          </p>
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-300 italic">
              "The problem is they seem to occur randomly, like weeds in a garden. There is no simple formula that tells us when the next one will appear."
            </p>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Look at the grid on the right. <span className="text-cyan-400 font-bold">Cyan</span> dots are primes. <span className="text-slate-700 font-bold">Dim</span> dots are composite.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Does it look like a pattern? Or just noise? Riemann suspected that a hidden harmonic structure governed this chaos.
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <button
            onClick={handleZoom}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-cyan-900/40 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Zoom Out ({currentConfig.label})
          </button>
          <p className="text-[10px] text-center text-slate-500 uppercase font-black tracking-widest">
            Click to see larger prime distributions
          </p>
        </div>
      </div>

      {/* Right Panel: Interactive Visualization */}
      <div className="flex-1 bg-slate-900 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-2xl relative flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Number Field Density</h3>
          <span className="text-[10px] font-mono text-cyan-500 bg-cyan-950/30 px-2 py-0.5 rounded">Range: 1 to {currentConfig.limit}</span>
        </div>
        
        <div className="flex-1 relative">
          <Plot
            data={[
              {
                x: plotData.compositesX,
                y: plotData.compositesY,
                mode: 'markers',
                type: 'scatter',
                marker: { color: '#1e293b', size: zoomLevel > 2 ? 2 : 4 },
                name: 'Composite',
                hoverinfo: 'none'
              },
              {
                x: plotData.primesX,
                y: plotData.primesY,
                mode: 'markers',
                type: 'scatter',
                marker: { 
                  color: '#22d3ee', 
                  size: zoomLevel > 2 ? 3 : 6,
                  line: { color: '#0891b2', width: zoomLevel > 2 ? 0 : 1 }
                },
                name: 'Prime',
                hovertemplate: 'Prime Number Found!<extra></extra>'
              }
            ]}
            layout={{
              autosize: true,
              margin: { l: 20, r: 20, b: 20, t: 20 },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              xaxis: { visible: false, fixedrange: true },
              yaxis: { visible: false, scaleanchor: 'x', scaleratio: 1, fixedrange: true },
              showlegend: false,
              hovermode: 'closest'
            }}
            useResizeHandler={true}
            className="w-full h-full"
            config={{ responsive: true, displayModeBar: false }}
          />
          
          <div className="absolute bottom-6 left-6 max-w-xs pointer-events-none">
            <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 shadow-2xl">
               <p className="text-xs text-slate-400 leading-tight">
                 {zoomLevel === 0 && "In small numbers, primes appear frequently but irregularly."}
                 {zoomLevel === 1 && "Patterns like 'Twin Primes' (cyan dots next to each other) emerge."}
                 {zoomLevel === 2 && "The density starts to decrease, but the distribution remains stubbornly complex."}
                 {zoomLevel === 3 && "At this scale, you can see how the primes 'thin out' as numbers grow larger."}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroMystery;
