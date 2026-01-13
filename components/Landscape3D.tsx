
import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { calculateZeta, Complex } from '../services/mathUtils';

interface Landscape3DProps {
  tStart: number;
  tEnd: number;
  iterations: number;
}

const Landscape3D: React.FC<Landscape3DProps> = ({ tStart, tEnd, iterations }) => {
  const data = useMemo(() => {
    const sigmaSteps = 40;
    const tSteps = 40;
    
    // Domain for Sigma: 0 to 1 (Critical Strip)
    const sigmaStart = 0;
    const sigmaEnd = 1.2;
    const sigmaVals: number[] = [];
    for (let i = 0; i <= sigmaSteps; i++) sigmaVals.push(sigmaStart + i * (sigmaEnd - sigmaStart) / sigmaSteps);

    const tVals: number[] = [];
    const rangeT = tEnd - tStart;
    for (let i = 0; i <= tSteps; i++) tVals.push(tStart + i * rangeT / tSteps);

    const zValues: number[][] = [];
    const colorValues: number[][] = [];

    for (let j = 0; j < tVals.length; j++) {
      const rowZ: number[] = [];
      const rowColor: number[] = [];
      for (let i = 0; i < sigmaVals.length; i++) {
        const s = new Complex(sigmaVals[i], tVals[j]);
        const zeta = calculateZeta(s, iterations);
        let mag = zeta.abs();
        
        // Clamp Z-axis to prevent pole at s=1 from distorting the view
        if (mag > 10) mag = 10;
        
        rowZ.push(mag);
        rowColor.push(zeta.arg()); // Use phase for domain coloring
      }
      zValues.push(rowZ);
      colorValues.push(rowColor);
    }

    return { x: sigmaVals, y: tVals, z: zValues, colors: colorValues };
  }, [tStart, tEnd, iterations]);

  return (
    <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
      <Plot
        data={[
          {
            x: data.x,
            y: data.y,
            z: data.z,
            type: 'surface',
            surfacecolor: data.colors,
            colorscale: 'Viridis',
            showscale: false,
            lighting: {
              ambient: 0.6,
              diffuse: 0.8,
              specular: 0.5,
              roughness: 0.5
            },
            hovertemplate: 'Re(s): %{x:.2f}<br>Im(s): %{y:.2f}<br>|ζ(s)|: %{z:.4f}<extra></extra>'
          }
        ]}
        layout={{
          autosize: true,
          hoverlabel: {
            bgcolor: '#1e293b',
            bordercolor: '#22d3ee',
            font: { color: '#ffffff', family: 'monospace', size: 13 }
          },
          title: {
            text: 'Complex Landscape (Color = Phase)',
            font: { color: '#f8fafc', size: 18 }
          },
          scene: {
            xaxis: { title: 'Re(s)', color: '#94a3b8', gridcolor: '#1e293b' },
            yaxis: { title: 'Im(s)', color: '#94a3b8', gridcolor: '#1e293b' },
            zaxis: { title: '|ζ(s)|', range: [0, 10], color: '#94a3b8', gridcolor: '#1e293b' },
            camera: {
              eye: { x: 1.5, y: 1.5, z: 1.2 }
            },
            aspectratio: { x: 1, y: 2, z: 1 }
          },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          margin: { l: 0, r: 0, b: 0, t: 80 }
        }}
        useResizeHandler={true}
        className="w-full h-full"
        config={{ responsive: true }}
      />
    </div>
  );
};

export default Landscape3D;
