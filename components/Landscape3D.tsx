
import React, { useMemo, useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { calculateZeta, Complex } from '../services/mathUtils';
import StoryLayout, { StoryStep } from './StoryLayout';

interface Landscape3DProps {
  tStart: number;
  tEnd: number;
  iterations: number;
}

interface Camera {
  eye: { x: number; y: number; z: number };
  center: { x: number; y: number; z: number };
  up: { x: number; y: number; z: number };
}

const Landscape3D: React.FC<Landscape3DProps> = ({ tStart, tEnd, iterations }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentStepId, setCurrentStepId] = useState('terrain');
  
  // Plotly camera state using relative coordinates to prevent black screen bugs
  const [camera, setCamera] = useState<Camera>({
    eye: { x: 1.6, y: 1.6, z: 1.6 },
    center: { x: 0, y: 0, z: 0 },
    up: { x: 0, y: 0, z: 1 }
  });

  // Calculate high-resolution data for the tour and sandbox
  const activeTStart = isUnlocked ? tStart : 0;
  const activeTEnd = isUnlocked ? tEnd : 30;

  const data = useMemo(() => {
    const sigmaSteps = isUnlocked ? 40 : 50;
    const tSteps = isUnlocked ? 40 : 100;
    
    const sigmaStart = -0.5;
    const sigmaEnd = 1.5;
    const sigmaVals: number[] = [];
    for (let i = 0; i <= sigmaSteps; i++) sigmaVals.push(sigmaStart + i * (sigmaEnd - sigmaStart) / sigmaSteps);

    const tVals: number[] = [];
    const rangeT = activeTEnd - activeTStart;
    for (let i = 0; i <= tSteps; i++) tVals.push(activeTStart + i * rangeT / tSteps);

    const zValues: number[][] = [];
    const colorValues: number[][] = [];

    for (let j = 0; j < tVals.length; j++) {
      const rowZ: number[] = [];
      const rowColor: number[] = [];
      for (let i = 0; i < sigmaVals.length; i++) {
        const s = new Complex(sigmaVals[i], tVals[j]);
        const zeta = calculateZeta(s, iterations);
        let mag = zeta.abs();
        
        // Clamp Z-axis to prevent pole at s=1 from flattening everything
        if (mag > 10) mag = 10;
        
        rowZ.push(mag);
        rowColor.push(zeta.arg());
      }
      zValues.push(rowZ);
      colorValues.push(rowColor);
    }

    return { x: sigmaVals, y: tVals, z: zValues, colors: colorValues };
  }, [activeTStart, activeTEnd, iterations, isUnlocked]);

  const steps: StoryStep[] = [
    {
      id: 'terrain',
      title: 'The Complex Terrain',
      narrative: (
        <p>
          Welcome to the <b>Riemann Zeta Function</b>. 
          The height of this landscape represents the Magnitude $|ζ(s)|$. 
          Notice how it creates rolling hills and deep valleys in the complex plane.
        </p>
      ),
      action: () => {
        setCurrentStepId('terrain');
        setCamera({
          eye: { x: 1.6, y: 1.6, z: 1.6 },
          center: { x: 0, y: 0, z: 0 },
          up: { x: 0, y: 0, z: 1 }
        });
      }
    },
    {
      id: 'pole',
      title: 'The Infinite Mountain',
      narrative: (
        <p>
          See that massive spike at $s=1$? That is the <b>Pole</b>. 
          The function approaches infinity here as the harmonic series diverges. 
          It is the unique place where the mathematics "breaks".
        </p>
      ),
      action: () => {
        setCurrentStepId('pole');
        setCamera({
          eye: { x: 1.5, y: -1.5, z: 0.5 },
          center: { x: 0, y: -0.5, z: -0.2 },
          up: { x: 0, y: 0, z: 1 }
        });
      }
    },
    {
      id: 'valley',
      title: 'The Critical Strip',
      narrative: (
        <p>
          Between Re(s)=0 and Re(s)=1 lies the <b>Critical Strip</b>. 
          This is the "Magic Valley" where behavior becomes chaotic and interesting. 
          All secrets of prime numbers are hidden in this narrow trench.
        </p>
      ),
      action: () => {
        setCurrentStepId('valley');
        setCamera({
          eye: { x: 0, y: -2.8, z: 2.0 },
          center: { x: 0, y: 0, z: -0.5 },
          up: { x: 0, y: 0, z: 1 }
        });
      }
    },
    {
      id: 'zeros',
      title: 'Sea Level (The Zeros)',
      narrative: (
        <p>
          We are hunting for points where the landscape touches the floor (Magnitude = 0). 
          These are the <b>Non-Trivial Zeros</b>. 
          Riemann predicted they all lie perfectly in the center of this valley at Re(s)=0.5.
        </p>
      ),
      action: () => {
        setCurrentStepId('zeros');
        setCamera({
          eye: { x: 0.5, y: 0.5, z: 2.5 },
          center: { x: 0, y: 0, z: -0.5 },
          up: { x: 0, y: 0, z: 1 }
        });
      }
    }
  ];

  const stripHighlight = useMemo(() => {
    if (currentStepId !== 'valley') return [];
    
    const stripX = [0, 1];
    const stripY = [activeTStart, activeTEnd];
    const stripZ = [[0, 0], [0, 0]];
    
    return [{
      x: stripX,
      y: stripY,
      z: stripZ,
      type: 'surface',
      opacity: 0.3,
      showscale: false,
      colorscale: [[0, '#22d3ee'], [1, '#22d3ee']],
      name: 'Critical Strip Highlight',
      hoverinfo: 'skip'
    }];
  }, [currentStepId, activeTStart, activeTEnd]);

  return (
    <StoryLayout
      steps={steps}
      isUnlocked={isUnlocked}
      onExploreFreely={() => setIsUnlocked(true)}
    >
      <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
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
            },
            ...(stripHighlight as any)
          ]}
          layout={{
            autosize: true,
            hoverlabel: {
              bgcolor: '#1e293b',
              bordercolor: '#22d3ee',
              font: { color: '#ffffff', family: 'monospace', size: 13 }
            },
            title: {
              text: isUnlocked ? 'Sandbox Mode: Complex Landscape' : 'Guided Tour: The Zeta Terrain',
              font: { color: '#f8fafc', size: 18 }
            },
            scene: {
              xaxis: { title: 'Re(s)', color: '#94a3b8', gridcolor: '#1e293b', range: [-0.5, 1.5] },
              yaxis: { title: 'Im(s)', color: '#94a3b8', gridcolor: '#1e293b', range: [activeTStart, activeTEnd] },
              zaxis: { title: '|ζ(s)|', range: [0, 10], color: '#94a3b8', gridcolor: '#1e293b' },
              camera: camera,
              aspectmode: 'manual',
              aspectratio: { x: 2, y: 4, z: 2 }
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: { l: 0, r: 0, b: 0, t: 80 }
          }}
          useResizeHandler={true}
          className="w-full h-full"
          config={{ responsive: true }}
          onRelayout={(layout) => {
            if (isUnlocked && layout['scene.camera']) {
              setCamera(layout['scene.camera']);
            }
          }}
        />
        
        {isUnlocked && (
           <div className="absolute top-4 right-4 bg-slate-950/80 p-3 rounded-lg border border-slate-800 animate-in fade-in duration-500">
             <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">Navigation</h4>
             <p className="text-[9px] text-slate-400">Drag to Rotate • Scroll to Zoom • Use Sidebar for Range</p>
           </div>
        )}
      </div>
    </StoryLayout>
  );
};

export default Landscape3D;
