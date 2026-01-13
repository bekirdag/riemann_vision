
export interface ComplexData {
  re: number;
  im: number;
}

export enum ViewMode {
  ZERO_HUNTER = 'ZERO_HUNTER',
  LANDSCAPE_3D = 'LANDSCAPE_3D',
  PRIME_STAIRCASE = 'PRIME_STAIRCASE',
  CONCEPT_MAP = 'CONCEPT_MAP'
}

export interface PlotParams {
  tStart: number;
  tEnd: number;
  iterations: number;
  viewMode: ViewMode;
}
