
import React, { useState, useMemo } from 'react';
import { sieveOfEratosthenes } from '../services/mathUtils';

const PRIMES = (() => {
  const isPrime = sieveOfEratosthenes(500);
  const result: number[] = [];
  for (let i = 2; i <= 500; i++) if (isPrime[i]) result.push(i);
  return result;
})();

const EulerGoldenKey: React.FC = () => {
  const [s, setS] = useState<number>(2.0);
  const [numTerms, setNumTerms] = useState<number>(100);

  const results = useMemo(() => {
    // 1. Partial Sum of Integers (1/n^s)
    let sum = 0;
    const sumTerms: { n: number; val: number }[] = [];
    for (let n = 1; n <= numTerms; n++) {
      const term = Math.pow(n, -s);
      sum += term;
      if (n <= 5) sumTerms.push({ n, val: term });
    }

    // 2. Partial Product of Primes 1 / (1 - p^-s)
    let product = 1;
    const productTerms: { p: number; val: number }[] = [];
    // Use enough primes to match the precision of numTerms roughly
    const activePrimes = PRIMES.slice(0, Math.floor(numTerms / 2));
    for (let i = 0; i < activePrimes.length; i++) {
      const p = activePrimes[i];
      const factor = 1 / (1 - Math.pow(p, -s));
      product *= factor;
      if (i <= 4) productTerms.push({ p, val: factor });
    }

    // Theoretical Limit (Only for special cases or if we want to show a benchmark)
    // zeta(2) = pi^2 / 6
    const benchmark = s === 2 ? (Math.PI * Math.PI) / 6 : null;

    return { sum, product, sumTerms, productTerms, benchmark };
  }, [s, numTerms]);

  const diff = Math.abs(results.sum - results.product);
  const tilt = Math.min(30, Math.max(-30, (results.sum - results.product) * 20));

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
          
          <div className="mt-6 p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-center">
            <code className="text-lg md:text-xl font-mono text-amber-200">
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
        <div className="bg-slate-900 rounded-2xl border border-slate-800 relative flex flex-col items-center justify-center p-8 overflow-hidden">
           <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
              <span className="text-[20rem] font-bold text-white">s</span>
           </div>

           {/* The Scale Beam */}
           <div 
             className="w-full h-4 bg-slate-800 rounded-full relative transition-transform duration-500 ease-out"
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
           <div className="w-12 h-12 bg-amber-600 rounded-lg transform rotate-45 -mt-6 z-10 border-4 border-slate-900" />
           
           <div className="mt-20 text-center">
              <h3 className={`text-sm font-bold uppercase tracking-widest transition-colors ${diff < 0.001 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {diff < 0.00001 ? "Perfectly Balanced" : diff < 0.01 ? "Converging..." : "Out of Sync"}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Difference: {diff.toExponential(4)}</p>
           </div>

           {results.benchmark && (
             <div className="absolute bottom-6 right-6 bg-emerald-900/20 border border-emerald-500/20 p-3 rounded-lg">
                <p className="text-[10px] font-bold text-emerald-500 uppercase">Basel Problem Result</p>
                <p className="text-xs text-emerald-200 font-mono">&zeta;(2) = &pi;&sup2;/6 &approx; 1.644934</p>
             </div>
           )}
        </div>

        {/* Breakdown Panel */}
        <div className="grid grid-rows-2 gap-4">
           {/* Summation Logic */}
           <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-xs font-bold text-slate-400 uppercase">Integers Side (The Series)</h4>
                 <span className="text-[10px] font-mono text-slate-500">n = 1 &rarr; {numTerms}</span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                 {results.sumTerms.map(t => (
                    <div key={t.n} className="flex justify-between items-center bg-slate-950 px-3 py-2 rounded border border-slate-800/50">
                       <span className="text-[11px] font-mono text-slate-400">1 / {t.n}<sup>{s.toFixed(1)}</sup></span>
                       <span className="text-[11px] font-mono text-white">+{t.val.toFixed(6)}</span>
                    </div>
                 ))}
                 <div className="text-center py-2 text-slate-700 font-bold">... + {numTerms - 5} more terms</div>
              </div>
           </div>

           {/* Product Logic */}
           <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-xs font-bold text-slate-400 uppercase">Primes Side (The Product)</h4>
                 <span className="text-[10px] font-mono text-slate-500">{Math.floor(numTerms/2)} Primes</span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                 {results.productTerms.map(t => (
                    <div key={t.p} className="flex justify-between items-center bg-slate-950 px-3 py-2 rounded border border-slate-800/50">
                       <span className="text-[11px] font-mono text-slate-400">1 / (1 - {t.p}<sup>-{s.toFixed(1)}</sup>)</span>
                       <span className="text-[11px] font-mono text-amber-500">&times; {t.val.toFixed(6)}</span>
                    </div>
                 ))}
                 <div className="text-center py-2 text-slate-700 font-bold">... multiplied by remaining primes</div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-amber-900/10 border border-amber-500/10 p-4 rounded-xl">
         <p className="text-xs text-slate-500 text-center leading-relaxed">
           "Before Riemann moved into the complex plane, Euler used this formula to show that the <b>Zeta Function</b> is essentially a portrait of the prime numbers themselves. If you want to understand the distribution of primes, you must master this function."
         </p>
      </div>
    </div>
  );
};

export default EulerGoldenKey;
