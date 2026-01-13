
export interface ComplexData {
  re: number;
  im: number;
}

export enum ViewMode {
  ZERO_HUNTER = 'ZERO_HUNTER',
  LANDSCAPE_3D = 'LANDSCAPE_3D',
  PRIME_STAIRCASE = 'PRIME_STAIRCASE',
  CONCEPT_MAP = 'CONCEPT_MAP',
  HARMONIC_SYNTHESIS = 'HARMONIC_SYNTHESIS',
  ATOMIC_WAVE = 'ATOMIC_WAVE'
}

export interface PlotParams {
  tStart: number;
  tEnd: number;
  iterations: number;
  viewMode: ViewMode;
}
