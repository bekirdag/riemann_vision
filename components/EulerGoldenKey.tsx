
import React, { useState, useMemo } from 'react';
import { sieveOfEratosthenes, getUniquePrimeFactors, isPrimeNumber } from '../services/mathUtils';

const PRIMES = (() => {
  const isPrime = sieveOfEratosthenes(500);
  const result: number[] = [];
  for (let i = 2; i <= 500; i++) if (isPrime[i]) result.push(i);
  return result;
})();

const EulerGoldenKey: React.FC = () => {
  const [s, setS] = useState<number>(2.0);
  const [numTerms, setNumTerms] = useState<number>(100);
  const [hoveredN, setHoveredN] = useState<number | null>(null);

  const results = useMemo(() => {
    // 1. Partial Sum of Integers (1/n^s)
    let sum = 0;
    const sumTerms: { n: number; val: number }[] = [];
    for (let n = 1; n <= numTerms; n++) {
      const term = Math.pow(n, -s);
      sum += term;
      if (n <= 50) sumTerms.push({ n, val: term });
    }

    // 2. Partial Product of Primes 1 / (1 - p^-s)
    let product = 1;
    const productTerms: { p: number; val: number }[] = [];
    const activePrimesCount = Math.floor(numTerms / 1.5);
    const activePrimes = PRIMES.slice(0, activePrimesCount);
    for (let i = 0; i < activePrimes.length; i++) {
      const p = activePrimes[i];
      const factor = 1 / (1 - Math.pow(p, -s));
      product *= factor;
      if (i <= 50) productTerms.push({ p, val: factor });
    }

    const benchmark = s === 2 ? (Math.PI * Math.PI) / 6 : null;

    return { sum, product, sumTerms, productTerms, benchmark };
  }, [s, numTerms]);

  const diff = Math.abs(results.sum - results.product);
  const tilt = Math.min(30, Math.max(-30, (results.sum - results.product) * 20));

  const hoveredPrimeFactors = useMemo(() => {
    if (hoveredN === null) return [];
    return getUniquePrimeFactors(hoveredN);
  }, [hoveredN]);

  // Determine if convergence is "good" enough for coloring
  const isConverged = numTerms >= 450 || diff < 0.0001;

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6 shrink-0">
        <div className="flex-1 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-amber-500 font-bold text-[10px] uppercase tracking-widest">Educational Focus</span>
            <h2 className="text-2xl font-bold text-white mt-1">Euler's <span className="text-amber-500">Golden Key</span></h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              In 1737, Leonhard Euler discovered a mathematical bridge. He showed that the world of <b>Integers</b> and the world of <b>Primes</b> are two sides of the same equation.
            </p>
          </div>
          
          <div className="mt-6 p-6 bg-slate-950 rounded-xl border border-slate-800 flex justify-center shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <code 
              className="text-xl md:text-3xl select-none"
              style={{ fontFamily: "'Times New Roman', serif", fontStyle: "italic", color: '#fbbf24' }}
            >
              &sum; n<sup>-s</sup> = &prod; (1 - p<sup>-s</sup>)<sup>-1</sup>
            </code>
          </div>
        </div>

        <div className="w-full md:w-80 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <section>
             <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Variable (s)</label>
                <span className="text-amber-400 font-mono text-sm">{s.toFixed(2)}</span>
             </div>
             <input 
               type="range" min="1.1" max="5.0" step="0.01" value={s} 
               onChange={(e) => setS(parseFloat(e.target.value))}
               className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
             />
             <p className="text-[10px] text-slate-500 mt-2 italic">Euler worked with Real numbers where s &gt; 1.</p>
          </section>

          <section>
             <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Iterations (N)</label>
                <span className="text-amber-400 font-mono text-sm">{numTerms}</span>
             </div>
             <input 
               type="range" min="10" max="500" step="10" value={numTerms} 
               onChange={(e) => setNumTerms(parseInt(e.target.value))}
               className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
             />
          </section>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* The Balance Visual */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 relative flex flex-col items-center justify-center p-8 overflow-hidden shadow-2xl">
           <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
              <span className="text-[20rem] font-bold text-white">s</span>
           </div>

           {/* The Scale Beam */}
           <div 
             className="w-full h-4 bg-slate-800 rounded-full relative transition-transform duration-700 ease-out"
             style={{ transform: `rotate(${tilt}deg)` }}
           >
              {/* Left Pan */}
              <div className="absolute -left-4 -top-12 w-32 flex flex-col items-center">
                 <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 shadow-2xl w-full">
                    <p className="text-[10px] text-slate-500 font-bold uppercase text-center mb-1">Summation</p>
                    <p className="text-xl font-mono text-white text-center">{results.sum.toFixed(8)}</p>
                 </div>
                 <div className="w-1 h-12 bg-slate-700" />
              </div>

              {/* Right Pan */}
              <div className="absolute -right-4 -top-12 w-32 flex flex-col items-center">
                 <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 shadow-2xl w-full">
                    <p className="text-[10px] text-slate-500 font-bold uppercase text-center mb-1">Product</p>
                    <p className="text-xl font-mono text-white text-center">{results.product.toFixed(8)}</p>
                 </div>
                 <div className="w-1 h-12 bg-slate-700" />
              </div>
           </div>

           {/* Fulcrum */}
           <div className="w-12 h-12 bg-amber-600 rounded-lg transform rotate-45 -mt-6 z-10 border-4 border-slate-900 shadow-xl" />
           
           <div className="mt-20 text-center">
              <h3 className={`text-sm font-bold uppercase tracking-widest transition-colors duration-500 ${isConverged ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isConverged ? "Convergence Achieved" : diff < 0.01 ? "Converging..." : "Out of Sync"}
              </h3>
              <p className={`text-[10px] mt-1 font-mono transition-colors ${isConverged ? 'text-emerald-500/70' : 'text-slate-500'}`}>
                Difference: {diff.toExponential(4)}
              </p>
           </div>

           {results.benchmark && (
             <div className="absolute bottom-6 right-6 bg-emerald-900/20 border border-emerald-500/20 p-3 rounded-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
                <p className="text-[10px] font-bold text-emerald-500 uppercase">Basel Problem Result</p>
                <p className="text-xs text-emerald-200 font-mono">&zeta;(2) = &pi;&sup2;/6 &approx; 1.644934</p>
             </div>
           )}
        </div>

        {/* Breakdown Panel Column */}
        <div className="grid grid-rows-[1fr,1fr] gap-4 min-h-0">
           {/* Summation Logic */}
           <div className="bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col overflow-hidden relative group">
              <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center shrink-0">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Integers Side (The Series)</h4>
                 <span className="text-[10px] font-mono text-slate-500">n = 1 &rarr; {numTerms}</span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar p-6">
                 {results.sumTerms.slice(0, 10).map(t => (
                    <div 
                      key={t.n} 
                      onMouseEnter={() => setHoveredN(t.n)}
                      onMouseLeave={() => setHoveredN(null)}
                      className={`flex justify-between items-center bg-slate-950 px-3 py-2 rounded border transition-all duration-200 cursor-help ${
                        hoveredN === t.n ? 'border-amber-500/50 bg-slate-900 ring-2 ring-amber-500/10' : 'border-slate-800/50'
                      }`}
                    >
                       <div className="flex items-center gap-2">
                         <span className="text-[11px] font-mono text-slate-400">1 / {t.n}<sup>{s.toFixed(1)}</sup></span>
                         {hoveredN === t.n && !isPrimeNumber(t.n) && t.n > 1 && (
                           <span className="text-[9px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter animate-in fade-in zoom-in-95">
                             {t.n} = {getUniquePrimeFactors(t.n).join(' × ')}
                           </span>
                         )}
                       </div>
                       <span className={`text-[11px] font-mono ${hoveredN === t.n ? 'text-amber-400' : 'text-white'}`}>+{t.val.toFixed(6)}</span>
                    </div>
                 ))}
                 <div className="text-center py-4 text-slate-700 font-bold text-[10px] uppercase tracking-widest">
                    {numTerms > 10 ? `... + ${numTerms - 10} remaining terms` : 'End of series'}
                 </div>
              </div>
           </div>

           {/* Product Logic Panel with Footer */}
           <div className="bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col overflow-hidden relative">
              <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center shrink-0">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primes Side (The Product)</h4>
                 <span className="text-[10px] font-mono text-slate-500">First {results.productTerms.length} Primes</span>
              </div>
              
              <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar p-6">
                 {results.productTerms.slice(0, 10).map(t => {
                    const isActiveFactor = hoveredPrimeFactors.includes(t.p);
                    return (
                      <div 
                        key={t.p} 
                        className={`flex justify-between items-center px-3 py-2 rounded border transition-all duration-300 ${
                          isActiveFactor 
                            ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_10px_rgba(251,191,36,0.1)] scale-[1.02]' 
                            : 'bg-slate-950 border-slate-800/50'
                        }`}
                      >
                         <div className="flex items-center gap-3">
                           <span className={`text-[11px] font-mono transition-colors ${isActiveFactor ? 'text-amber-400' : 'text-slate-400'}`}>
                             1 / (1 - {t.p}<sup>-{s.toFixed(1)}</sup>)
                           </span>
                           {isActiveFactor && (
                             <div className="flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-[9px] text-amber-500 font-black uppercase">Factor of {hoveredN}</span>
                             </div>
                           )}
                         </div>
                         <span className={`text-[11px] font-mono transition-colors ${isActiveFactor ? 'text-amber-300 font-bold' : 'text-amber-500'}`}>
                            &times; {t.val.toFixed(6)}
                         </span>
                      </div>
                    );
                 })}
                 <div className="text-center py-4 text-slate-700 font-bold text-[10px] uppercase tracking-widest">
                    ... multiplied by remaining primes
                 </div>
              </div>

              {/* Fixed Footer for the Breakdown Panel */}
              <div className="shrink-0 bg-slate-950 p-4 border-t border-slate-800 relative z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                 <p className="text-[10px] text-slate-500 text-center leading-relaxed italic">
                   "Before Riemann moved into the complex plane, Euler used this formula to show that the <b>Zeta Function</b> is essentially a portrait of the prime numbers themselves."
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="bg-amber-900/10 border border-amber-500/10 p-4 rounded-xl flex items-center justify-center gap-3">
         <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         </div>
         <p className="text-xs text-slate-400">
           <b>Discovery:</b> Every number on the left is built from the prime factors on the right. Hover over <b>4</b> or <b>6</b> in the left list to see their components light up!
         </p>
      </div>
    </div>
  );
};

export default EulerGoldenKey;
