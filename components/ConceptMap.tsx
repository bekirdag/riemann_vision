
import React from 'react';
import Plot from 'react-plotly.js';

const ConceptMap: React.FC = () => {
  return (
    <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
      <Plot
        data={[
          {
            // Critical Line
            x: [0.5, 0.5],
            y: [-10, 40],
            type: 'scatter',
            mode: 'lines',
            name: 'Critical Line (Re = 0.5)',
            line: { color: '#22d3ee', dash: 'dash', width: 3 },
            hoverinfo: 'text',
            text: 'Critical Line: Re(s) = 1/2'
          },
          {
            // Non-Trivial Zeros
            x: [0.5, 0.5, 0.5, 0.5, 0.5],
            y: [14.13, 21.02, 25.01, 30.42, 32.93],
            type: 'scatter',
            mode: 'markers',
            name: 'Non-Trivial Zeros',
            marker: { color: '#22d3ee', size: 10, symbol: 'circle' },
            hovertemplate: 'Non-Trivial Zero<br>s = 0.5 + %{y}i<br>Hypothesis Holds<extra></extra>'
          },
          {
            // Trivial Zeros
            x: [-2, -4],
            y: [0, 0],
            type: 'scatter',
            mode: 'markers',
            name: 'Trivial Zeros',
            marker: { color: '#94a3b8', size: 10, symbol: 'circle' },
            hovertemplate: 'Trivial Zero<br>s = %{x}<extra></extra>'
          },
          {
            // The Pole
            x: [1],
            y: [0],
            type: 'scatter',
            mode: 'markers',
            name: 'Pole (Singularity)',
            marker: { 
              color: 'rgba(0,0,0,0)', 
              size: 12, 
              line: { color: '#ffffff', width: 2 },
              symbol: 'circle' 
            },
            hovertemplate: 'The Pole at s = 1<br>Function is undefined here<extra></extra>'
          }
        ]}
        layout={{
          autosize: true,
          hovermode: 'closest',
          title: {
            text: 'Conceptual Map of the Complex Plane',
            font: { color: '#f8fafc', size: 18 }
          },
          xaxis: {
            title: 'Real Part (σ)',
            range: [-5, 2],
            color: '#94a3b8',
            gridcolor: '#1e293b',
            zerolinecolor: '#334155',
            dtick: 1
          },
          yaxis: {
            title: 'Imaginary Part (t)',
            range: [-10, 40],
            color: '#94a3b8',
            gridcolor: '#1e293b',
            zerolinecolor: '#334155'
          },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          margin: { l: 60, r: 40, b: 60, t: 80 },
          legend: {
            font: { color: '#f8fafc', size: 11 },
            bgcolor: 'rgba(15, 23, 42, 0.8)',
            bordercolor: '#334155',
            borderwidth: 1
          },
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
              fillcolor: 'rgba(255, 255, 255, 0.05)',
              line: { width: 0 }
            }
          ],
          annotations: [
            {
              x: 0.5,
              y: 38,
              xref: 'x',
              yref: 'y',
              text: 'Critical Strip',
              showarrow: false,
              font: { color: '#ffffff', size: 14, weight: 'bold' }
            },
            {
              x: -4,
              y: 0,
              xref: 'x',
              yref: 'y',
              text: 'Trivial Zeros',
              showarrow: true,
              arrowhead: 2,
              ax: -40,
              ay: -30,
              font: { color: '#94a3b8', size: 12 }
            },
            {
              x: 1,
              y: 0,
              xref: 'x',
              yref: 'y',
              text: 'Pole (s=1)',
              showarrow: true,
              arrowhead: 2,
              ax: 40,
              ay: -30,
              font: { color: '#ffffff', size: 12 }
            },
            {
              x: 0.5,
              y: 5,
              xref: 'x',
              yref: 'y',
              text: 'Critical Line (Re=0.5)',
              showarrow: true,
              arrowhead: 2,
              ax: 60,
              ay: 0,
              font: { color: '#22d3ee', size: 12 }
            }
          ]
        }}
        useResizeHandler={true}
        className="w-full h-full"
        config={{ responsive: true }}
      />
    </div>
  );
};

export default ConceptMap;
