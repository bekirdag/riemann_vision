
import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import StoryLayout, { StoryStep } from './StoryLayout';

const ConceptMap: React.FC = () => {
  const [rangeX, setRangeX] = useState<[number, number]>([-5, 2]);
  const [rangeY, setRangeY] = useState<[number, number]>([-10, 40]);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const steps: StoryStep[] = [
    {
      id: 'strip',
      title: 'The Critical Strip',
      narrative: (
        <p>
          The shaded area between Re(s)=0 and Re(s)=1 is the <b>Critical Strip</b>. 
          Mathematics dictates that all interesting behavior of the Zeta function—specifically its "non-trivial" zeros—must happen inside this boundary.
        </p>
      ),
      action: () => {
        setRangeX([-0.5, 1.5]);
        setRangeY([-5, 45]);
      }
    },
    {
      id: 'trivial',
      title: 'The Trivial Zeros',
      narrative: (
        <p>
          Moving to the left, we find zeros at every negative even integer (-2, -4, -6...). 
          These are called <b>Trivial Zeros</b> because they were discovered early and are mathematically straightforward. They don't affect the prime distribution.
        </p>
      ),
      action: () => {
        setRangeX([-10, 1]);
        setRangeY([-5, 5]);
      }
    },
    {
      id: 'prize',
      title: 'The Golden Prize',
      narrative: (
        <p>
          The blue dots on the dashed line are the <b>Non-Trivial Zeros</b>. 
          The Riemann Hypothesis claims every single one of these infinite points lies exactly on this line (Re=0.5). 
          Notice how perfectly they align.
        </p>
      ),
      action: () => {
        setRangeX([0.2, 0.8]);
        setRangeY([10, 35]);
      }
    }
  ];

  return (
    <StoryLayout 
      steps={steps} 
      onExploreFreely={() => {
        setIsUnlocked(true);
        setRangeX([-5, 2]);
        setRangeY([-10, 40]);
      }}
      isUnlocked={isUnlocked}
    >
      <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800">
        <Plot
          data={[
            {
              // Critical Line
              x: [0.5, 0.5],
              y: [-50, 150],
              type: 'scatter',
              mode: 'lines',
              name: 'Critical Line',
              line: { color: '#22d3ee', dash: 'dash', width: 3 },
              hoverinfo: 'text',
              text: 'Critical Line: Re(s) = 1/2'
            },
            {
              // Non-Trivial Zeros
              x: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
              y: [14.13, 21.02, 25.01, 30.42, 32.93, 37.58, 40.91, 43.32],
              type: 'scatter',
              mode: 'markers',
              name: 'Non-Trivial Zeros',
              marker: { color: '#22d3ee', size: 12, symbol: 'circle', line: { color: '#ffffff', width: 1 } },
              hovertemplate: 'Non-Trivial Zero<br>s = 0.5 + %{y}i<extra></extra>'
            },
            {
              // Trivial Zeros
              x: [-2, -4, -6, -8],
              y: [0, 0, 0, 0],
              type: 'scatter',
              mode: 'markers',
              name: 'Trivial Zeros',
              marker: { color: '#475569', size: 10, symbol: 'circle' },
              hovertemplate: 'Trivial Zero<br>s = %{x}<extra></extra>'
            },
            {
              // The Pole
              x: [1],
              y: [0],
              type: 'scatter',
              mode: 'markers',
              name: 'Pole',
              marker: { 
                color: 'rgba(0,0,0,0)', 
                size: 14, 
                line: { color: '#ffffff', width: 2 },
                symbol: 'circle' 
              },
              hovertemplate: 'The Pole at s = 1<extra></extra>'
            }
          ]}
          layout={{
            autosize: true,
            hovermode: 'closest',
            title: {
              text: 'The Landscape of the Hypothesis',
              font: { color: '#f8fafc', size: 18 }
            },
            xaxis: {
              title: 'Real Part (σ)',
              range: rangeX,
              color: '#94a3b8',
              gridcolor: '#1e293b',
              zerolinecolor: '#334155',
              transition: { duration: 1000, easing: 'cubic-in-out' }
            },
            yaxis: {
              title: 'Imaginary Part (t)',
              range: rangeY,
              color: '#94a3b8',
              gridcolor: '#1e293b',
              zerolinecolor: '#334155',
              transition: { duration: 1000, easing: 'cubic-in-out' }
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: { l: 60, r: 40, b: 60, t: 80 },
            legend: { visible: false },
            shapes: [
              {
                // Critical Strip Shading
                type: 'rect',
                xref: 'x',
                yref: 'paper',
                x0: 0,
                y0: 0,
                x1: 1,
                y1: 1,
                fillcolor: 'rgba(34, 211, 238, 0.05)',
                line: { width: 0 }
              }
            ],
            annotations: [
              {
                x: 0.5,
                y: rangeY[1] * 0.9,
                xref: 'x',
                yref: 'y',
                text: 'Critical Line',
                showarrow: false,
                font: { color: '#22d3ee', size: 12, weight: 'bold' },
                visible: rangeX[1] - rangeX[0] < 2
              }
            ]
          }}
          useResizeHandler={true}
          className="w-full h-full"
          config={{ responsive: true }}
        />
        
        {!isUnlocked && (
          <div className="absolute top-4 right-4 pointer-events-none">
            <div className="bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              Guided View Active
            </div>
          </div>
        )}
      </div>
    </StoryLayout>
  );
};

export default ConceptMap;
