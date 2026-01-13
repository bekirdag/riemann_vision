
import React, { useMemo, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { calculateZeta, Complex, RIEMANN_ZEROS } from '../services/mathUtils';
import StoryLayout, { StoryStep } from './StoryLayout';

interface ZeroHunterProps {
  tStart: number;
  tEnd: number;
  iterations: number;
}

const ZeroHunter: React.FC<ZeroHunterProps> = ({ tStart, tEnd, iterations }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [localRange, setLocalRange] = useState<[number, number]>([0, 10]);
  const [showGhost, setShowGhost] = useState(false);
  const [activeStepId, setActiveStepId] = useState('slice');

  // Use props if unlocked, otherwise use local state from story actions
  const displayStart = isUnlocked ? tStart : localRange[0];
  const displayEnd = isUnlocked ? tEnd : localRange[1];

  const data = useMemo(() => {
    const steps = 600;
    const stepSize = (displayEnd - displayStart) / steps;
    const tValues: number[] = [];
    const magnitudes: number[] = [];
    const ghostMagnitudes: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = displayStart + i * stepSize;
      tValues.push(t);
      
      // Critical Line: Re(s) = 0.5
      const zeta = calculateZeta(new Complex(0.5, t), iterations);
      magnitudes.push(zeta.abs());

      // Ghost Line: Re(s) = 0.6 (Off the critical line)
      if (showGhost) {
        const ghostZeta = calculateZeta(new Complex(0.6, t), iterations);
        ghostMagnitudes.push(ghostZeta.abs());
      }
    }

    return { tValues, magnitudes, ghostMagnitudes };
  }, [displayStart, displayEnd, iterations, showGhost]);

  const steps: StoryStep[] = [
    {
      id: 'slice',
      title: 'The Slice',
      narrative: (
        <p>
          We are taking a 2D slice of the landscape exactly at the <b>Critical Line (Re(s)=0.5)</b>. 
          The vertical axis shows the "loudness" (Magnitude) of the function. 
          In this early range [0-10], the function is wobbly, but it never quite reaches the floor.
        </p>
      ),
      action: () => {
        setLocalRange([0, 10]);
        setShowGhost(false);
        setActiveStepId('slice');
      }
    },
    {
      id: 'first-contact',
      title: 'First Contact (t ≈ 14.13)',
      narrative: (
        <p>
          Wait... look at <b>t = 14.13</b>. The graph plunges down and hits the floor. 
          This is the <b>First Non-Trivial Zero</b>. 
          At this exact frequency, the Zeta function cancels itself out perfectly.
        </p>
      ),
      action: () => {
        setLocalRange([12, 16]);
        setShowGhost(false);
        setActiveStepId('first-contact');
      }
    },
    {
      id: 'cluster',
      title: 'The Cluster',
      narrative: (
        <p>
          Let's zoom out further. Here are the next few zeros. 
          Notice that they don't follow a simple pattern like 2, 4, 6, 8. 
          Their spacing appears chaotic, yet they all sit perfectly on this line.
        </p>
      ),
      action: () => {
        setLocalRange([10, 30]);
        setShowGhost(false);
        setActiveStepId('cluster');
      }
    },
    {
      id: 'hypothesis',
      title: 'The Hypothesis Check',
      narrative: (
        <p>
          The Riemann Hypothesis claims that if we moved this slice even slightly—say to <b>Re(s)=0.6</b>—the line would <i>never</i> touch zero again.
          The <b>Ghost Line (dashed)</b> represents Re(s)=0.6. Notice how it hovers safely above the floor, avoiding the zeros.
        </p>
      ),
      action: () => {
        setLocalRange([10, 30]);
        setShowGhost(true);
        setActiveStepId('hypothesis');
      }
    }
  ];

  const annotations = useMemo(() => {
    const relevantZeros = RIEMANN_ZEROS.filter(z => z >= displayStart && z <= displayEnd);
    return relevantZeros.map((z, idx) => ({
      x: z,
      y: 0,
      xref: 'x',
      yref: 'y',
      text: `γ${idx + 1}`,
      showarrow: true,
      arrowhead: 2,
      ax: 0,
      ay: -40,
      font: { color: '#22d3ee', size: 14, family: 'monospace', weight: 'bold' },
      bgcolor: 'rgba(15, 23, 42, 0.8)',
      bordercolor: '#22d3ee',
      borderwidth: 1,
      captureevents: true
    }));
  }, [displayStart, displayEnd]);

  return (
    <StoryLayout
      steps={steps}
      isUnlocked={isUnlocked}
      onExploreFreely={() => {
        setIsUnlocked(true);
        setShowGhost(false);
      }}
    >
      <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative border border-slate-800">
        <Plot
          data={[
            {
              x: data.tValues,
              y: data.magnitudes,
              type: 'scatter',
              mode: 'lines',
              name: 'Critical Line Re(s)=0.5',
              line: { color: '#22d3ee', width: 3 },
              fill: 'tozeroy',
              fillcolor: 'rgba(34, 211, 238, 0.05)',
              hovertemplate: '<b>s = 0.5 + %{x:.4f}i</b><br>|ζ(s)|: %{y:.6f}<extra></extra>'
            },
            ...(showGhost ? [{
              x: data.tValues,
              y: data.ghostMagnitudes,
              type: 'scatter' as const,
              mode: 'lines' as const,
              name: 'Ghost Line Re(s)=0.6',
              line: { color: '#f43f5e', width: 2, dash: 'dash' as const },
              opacity: 0.6,
              hovertemplate: '<b>s = 0.6 + %{x:.4f}i</b><br>|ζ(s)|: %{y:.6f}<extra></extra>'
            }] : []),
            {
              x: [displayStart, displayEnd],
              y: [0, 0],
              type: 'scatter',
              mode: 'lines',
              name: 'Sea Level',
              line: { color: '#334155', width: 1 },
              hoverinfo: 'skip'
            }
          ]}
          layout={{
            autosize: true,
            hovermode: 'x unified',
            hoverlabel: {
              bgcolor: '#0f172a',
              bordercolor: '#22d3ee',
              font: { color: '#ffffff', family: 'monospace', size: 12 }
            },
            title: {
              text: isUnlocked ? 'Zero Hunter: Critical Line Scanner' : 'Guided Hunt: Finding the Zeros',
              font: { color: '#f8fafc', size: 18 }
            },
            xaxis: {
              title: 'Imaginary Part (t)',
              color: '#94a3b8',
              gridcolor: '#1e293b',
              zerolinecolor: '#334155',
              range: [displayStart, displayEnd],
              transition: { duration: 800, easing: 'cubic-in-out' }
            },
            yaxis: {
              title: 'Magnitude |ζ(s)|',
              color: '#94a3b8',
              gridcolor: '#1e293b',
              zerolinecolor: '#334155',
              range: [0, showGhost ? 4 : 3]
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: { l: 60, r: 40, b: 60, t: 80 },
            showlegend: isUnlocked || showGhost,
            legend: { font: { color: '#94a3b8', size: 10 }, x: 0, y: 1 },
            annotations: annotations as any
          }}
          useResizeHandler={true}
          className="w-full h-full"
          config={{ responsive: true, displayModeBar: false }}
        />

        {/* Legend/Info Overlay for Hypothesis Check */}
        {activeStepId === 'hypothesis' && !isUnlocked && (
          <div className="absolute top-20 right-8 bg-slate-950/90 p-4 rounded-xl border border-rose-500/30 animate-in fade-in slide-in-from-right-4 duration-500 max-w-[200px]">
             <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Visual Proof</h4>
             <p className="text-[11px] text-slate-400 leading-tight">
               Notice how the <span className="text-rose-400 font-bold">Red Ghost Line</span> never touches zero. Only the <span className="text-cyan-400 font-bold">Cyan Line</span> has the "permission" to hit the floor.
             </p>
          </div>
        )}
      </div>
    </StoryLayout>
  );
};

export default ZeroHunter;
