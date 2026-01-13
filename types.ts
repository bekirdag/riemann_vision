
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
  ATOMIC_WAVE = 'ATOMIC_WAVE',
  MIXING_DECK = 'MIXING_DECK',
  DERIVATIVE_LINK = 'DERIVATIVE_LINK'
}

export interface PlotParams {
  tStart: number;
  tEnd: number;
  iterations: number;
  viewMode: ViewMode;
}