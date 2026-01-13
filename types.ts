
export interface ComplexData {
  re: number;
  im: number;
}

export enum ViewMode {
  INTRO_MYSTERY = 'INTRO_MYSTERY',
  EULER_GOLDEN_KEY = 'EULER_GOLDEN_KEY',
  RIEMANN_TWIST = 'RIEMANN_TWIST',
  CONCEPT_MAP = 'CONCEPT_MAP',
  HYPOTHESIS_STATEMENT = 'HYPOTHESIS_STATEMENT',
  LANDSCAPE_3D = 'LANDSCAPE_3D',
  ZERO_HUNTER = 'ZERO_HUNTER',
  ERROR_TERM = 'ERROR_TERM',
  PRIME_STAIRCASE = 'ERROR_TERM', // Keeping alias for backwards compatibility if needed during transition
  CONCEPT_MAP_ALT = 'CONCEPT_MAP_ALT',
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
