import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';

const RiemannTwist: React.FC = () => {
  const [n, setN] = useState<number>(2);
  const [t, setT] = useState<number>(2.0); // Initial state set to 2.0 as requested
  const [sigma, setSigma] = useState<number>(1);
  const [showTrace, setShowTrace] = useState<boolean>(true);

  const data = useMemo(() => {
    // z = n^s = n^(sigma + it) = n^sigma * n^it = n^sigma * e^(i * t * ln(n))
    const lnN = Math.log(n);
    const magnitude = Math.pow(n, sigma);
    const angle = t * lnN;

    const currentX = magnitude * Math.cos(angle);
    const currentY = magnitude * Math.sin(angle);

    // Trace path: from the real axis (t=0) to the current point
    const traceX: number[] = [];
    const traceY: number[] = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const stepT = (i / steps) * t;
      const stepAngle = stepT * lnN;
      traceX.push(magnitude * Math.cos(stepAngle));
      traceY.push(magnitude * Math.sin(stepAngle));
    }

    return { currentX, currentY, traceX, traceY, magnitude };
  }, [n, t, sigma]);

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-hidden">
      {/* Narrative Header */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="max-w-xl">
          <span className="inline-block px-2 py-1 bg-indigo-900/30 text-indigo-400 text-[10px] font-bold uppercase tracking-tighter rounded border border-indigo-500/20 mb-2">
            Step 2: Riemann's Extension
          </span>
          <h2 className="text-3xl font-bold text-white leading-tight">
            Riemann's <span className="text-indigo-400">Twist</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            Euler only looked at the real line ($s > 1$). Riemann asked: <i>What happens if we look at the whole map?</i>
          </p>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            When we use imaginary exponents, numbers don't just get bigger or smaller—they <b>rotate</b>. This rotation is the "frequency" that eventually creates the waves that find the primes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 shrink-0 w-full md:w-64">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
             <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Base Number (n)</label>
             <div className="flex items-center gap-3">
               <input 
                 type="range" min="1.1" max="10" step="0.1" value={n} 
                 onChange={(e) => setN(parseFloat(e.target.value))}
                 className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
               />
               <span className="text-xs font-mono text-indigo-400 w-8">{n.toFixed(1)}</span>
             </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
             <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Real Part (&sigma;)</label>
             <div className="flex items-center gap-3">
               <input 
                 type="range" min="-1" max="2" step="0.1" value={sigma} 
                 onChange={(e) => setSigma(parseFloat(e.target.value))}
                 className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
               />
               <span className="text-xs font-mono text-indigo-400 w-8">{sigma.toFixed(1)}</span>
             </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
             <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Imaginary Power (t)</label>
             <div className="flex items-center gap-3">
               <input 
                 type="range" min="0" max="20" step="0.1" value={t} 
                 onChange={(e) => setT(parseFloat(e.target.value))}
                 className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
               />
               <span className="text-xs font-mono text-indigo-400 w-8">{t.toFixed(1)}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
          <Plot
            data={[
              // Dash arc trace connecting point back to real axis
              {
                x: data.traceX,
                y: data.traceY,
                type: 'scatter',
                mode: 'lines',
                name: 'Rotation Trace',
                line: { color: 'rgba(99, 102, 241, 0.4)', width: 2, dash: 'dash' },
                visible: showTrace
              },
              // Origin to Point Vector
              {
                x: [0, data.currentX],
                y: [0, data.currentY],
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Current Position',
                line: { color: '#6366f1', width: 4 },
                marker: { size: 10, color: '#6366f1' },
                hovertemplate: 'z = %{x:.2f} + %{y:.2f}i<extra></extra>'
              }
            ]}
            layout={{
              autosize: true,
              margin: { l: 40, r: 40, b: 40, t: 60 },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              title: {
                text: `Complex Plane: ${n}^(${sigma.toFixed(1)} + ${t.toFixed(1)}i)`,
                font: { color: '#f8fafc', size: 16 }
              },
              xaxis: {
                title: 'Real Axis',
                range: [-Math.max(data.magnitude * 1.2, 5), Math.max(data.magnitude * 1.2, 5)],
                color: '#64748b',
                gridcolor: '#1e293b',
                zerolinecolor: '#334155'
              },
              yaxis: {
                title: 'Imaginary Axis',
                range: [-Math.max(data.magnitude * 1.2, 5), Math.max(data.magnitude * 1.2, 5)],
                scaleanchor: 'x',
                scaleratio: 1,
                color: '#64748b',
                gridcolor: '#1e293b',
                zerolinecolor: '#334155'
              },
              showlegend: false
            }}
            useResizeHandler={true}
            className="w-full h-full"
            config={{ responsive: true, displayModeBar: false }}
          />
          
          <div className="absolute bottom-4 right-4 bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
             <span className="text-[10px] text-slate-500 uppercase font-bold">Show Rotation Trace</span>
             <button 
               onClick={() => setShowTrace(!showTrace)}
               className={`w-10 h-5 rounded-full relative transition-colors ${showTrace ? 'bg-indigo-600' : 'bg-slate-700'}`}
             >
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${showTrace ? 'translate-x-5' : 'translate-x-0'}`} />
             </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-center shadow-xl">
             <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">The Logic</h3>
             <div className="space-y-4 font-mono text-sm">
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <p className="text-slate-500 text-[10px] mb-1">REAL SCALE</p>
                  <p className="text-white">|z| = {n}<sup>{sigma.toFixed(1)}</sup> = {data.magnitude.toFixed(3)}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <p className="text-slate-500 text-[10px] mb-1">ROTATION ANGLE</p>
                  <p className="text-white">&theta; = {t.toFixed(1)} &times; ln({n}) = {(t * Math.log(n)).toFixed(3)} rad</p>
                </div>
                <div className="p-3 bg-indigo-950/20 rounded border border-indigo-500/20">
                   <p className="text-indigo-400 text-[10px] mb-1">RESULT</p>
                   <p className="text-indigo-200 text-base">z = {data.currentX.toFixed(3)} + {data.currentY.toFixed(3)}i</p>
                </div>
             </div>
          </div>

          <div className="bg-indigo-900/10 border border-indigo-500/20 p-5 rounded-2xl">
            <h4 className="text-xs font-bold text-indigo-300 uppercase mb-2">Visual Insight</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              "Moving from 1D to 2D is like going from a single note to a symphony. Riemann realized that by allowing the variable 's' to be complex, the Zeta function could represent not just sizes, but also cycles and rhythms."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiemannTwist;