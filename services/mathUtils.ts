
export class Complex {
  constructor(public re: number, public im: number) {}

  static add(a: Complex, b: Complex): Complex {
    return new Complex(a.re + b.re, a.im + b.im);
  }

  static sub(a: Complex, b: Complex): Complex {
    return new Complex(a.re - b.re, a.im - b.im);
  }

  static mul(a: Complex, b: Complex): Complex {
    return new Complex(
      a.re * b.re - a.im * b.im,
      a.re * b.im + a.im * b.re
    );
  }

  static div(a: Complex, b: Complex): Complex {
    const den = b.re * b.re + b.im * b.im;
    if (den === 0) return new Complex(Infinity, Infinity);
    return new Complex(
      (a.re * b.re + a.im * b.im) / den,
      (a.im * b.re - a.re * b.im) / den
    );
  }

  abs(): number {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  }

  arg(): number {
    return Math.atan2(this.im, this.re);
  }
}

/**
 * Calculates the Riemann Zeta function using the Dirichlet Eta function approximation.
 */
export function calculateZeta(s: Complex, iterations: number): Complex {
  let etaRe = 0;
  let etaIm = 0;

  for (let n = 1; n <= iterations; n++) {
    const sigma = s.re;
    const t = s.im;
    const lnN = Math.log(n);
    const nPowMinusSigma = Math.pow(n, -sigma);
    const angle = t * lnN;
    
    const termRe = nPowMinusSigma * Math.cos(angle);
    const termIm = -nPowMinusSigma * Math.sin(angle);

    const sign = n % 2 === 0 ? -1 : 1;
    etaRe += sign * termRe;
    etaIm += sign * termIm;
  }

  const eta = new Complex(etaRe, etaIm);
  const ln2 = Math.log(2);
  const scale = Math.pow(2, 1 - s.re);
  const tLn2 = s.im * ln2;
  
  const subRe = scale * Math.cos(tLn2);
  const subIm = -scale * Math.sin(tLn2);

  const denom = new Complex(1 - subRe, -subIm);
  return Complex.div(eta, denom);
}

/**
 * Logarithmic Integral Li(x) approximation via numerical integration
 */
export function logIntegral(x: number): number {
  if (x <= 1.5) return 0;
  const steps = 500;
  const h = (x - 2) / steps;
  let sum = 0;
  for (let i = 0; i <= steps; i++) {
    const t = 2 + i * h;
    const val = 1 / Math.log(t);
    if (i === 0 || i === steps) sum += val / 2;
    else sum += val;
  }
  // Li(x) = li(x) - li(2). Offset to start from 2 like Gauss's original conjecture.
  return sum * h;
}

/**
 * Prime Number Sieve and Counting Functions
 */
export function sieveOfEratosthenes(max: number): boolean[] {
  const isPrime = new Array(max + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= max; p++) {
    if (isPrime[p]) {
      for (let i = p * p; i <= max; i += p)
        isPrime[i] = false;
    }
  }
  return isPrime;
}

export function calculatePrimeData(max: number) {
  const isPrime = sieveOfEratosthenes(max);
  const xValues: number[] = [];
  const piX: number[] = [];
  
  let count = 0;
  for (let x = 1; x <= max; x++) {
    if (isPrime[x]) count++;
    xValues.push(x);
    piX.push(count);
  }
  
  return { xValues, piX, isPrime };
}

/**
 * First 50 non-trivial zeros (imaginary parts γ)
 */
export const RIEMANN_ZEROS = [
  14.134725, 21.022040, 25.010858, 30.424876, 32.935062, 
  37.586178, 40.918719, 43.327073, 48.005151, 49.773832, 
  52.970321, 56.446248, 59.347044, 60.831779, 65.112544, 
  67.079811, 69.546402, 72.067158, 75.704691, 77.144840, 
  79.337375, 82.910381, 84.735493, 87.425275, 88.809111, 
  92.491899, 94.651344, 95.870634, 98.831194, 101.317851, 
  103.725538, 105.446623, 107.168611, 111.029536, 111.874659, 
  114.320221, 116.226680, 118.790724, 121.370125, 122.946829, 
  124.256819, 127.516483, 129.578704, 131.087688, 133.497737, 
  134.756510, 138.116042, 139.736209, 141.123707, 143.111846
];

/**
 * Calculates the actual error (pi(x) - Li(x)) and Riemann's approximation
 */
export function calculateErrorData(max: number, numZeros: number) {
  const { xValues, piX } = calculatePrimeData(max);
  const liValues: number[] = [];
  const actualError: number[] = [];
  const riemannCorrection: number[] = [];
  const boundsUpper: number[] = [];
  const boundsLower: number[] = [];

  const zeros = RIEMANN_ZEROS.slice(0, numZeros);

  for (let i = 0; i < xValues.length; i++) {
    const x = xValues[i];
    const liX = logIntegral(x);
    liValues.push(liX);
    actualError.push(piX[i] - liX);

    // Approximate Riemann Correction for pi(x) - Li(x)
    // Core term: - (2 * sqrt(x) / ln(x)) * sum( sin(gamma * ln(x)) / gamma )
    let sum = 0;
    if (x > 2) {
      const lnX = Math.log(x);
      const sqrtX = Math.sqrt(x);
      for (const gamma of zeros) {
        sum += Math.sin(gamma * lnX) / gamma;
      }
      riemannCorrection.push(- (2 * sqrtX / lnX) * sum);
    } else {
      riemannCorrection.push(0);
    }

    // Theoretical bounds: +/- sqrt(x) * ln(x) / 8*pi is a nice visual envelope
    const bound = x > 1 ? (Math.sqrt(x) * Math.log(x)) / (8 * Math.PI) : 0;
    boundsUpper.push(bound);
    boundsLower.push(-bound);
  }

  return { xValues, piX, liValues, actualError, riemannCorrection, boundsUpper, boundsLower };
}

/**
 * Primality check for small integers
 */
export function isPrimeNumber(n: number): boolean {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * Get unique prime factors of a number
 */
export function getUniquePrimeFactors(n: number): number[] {
  if (n < 2) return [];
  const factors = new Set<number>();
  let d = 2;
  let temp = n;
  while (temp >= d * d) {
    if (temp % d === 0) {
      factors.add(d);
      temp /= d;
    } else {
      d++;
    }
  }
  if (temp > 1) factors.add(temp);
  return Array.from(factors);
}

/**
 * Chebyshev Function psi(x) = sum_{p^k <= x} ln p
 */
export function calculateChebyshevPsi(x: number): number {
  if (x < 2) return 0;
  let sum = 0;
  for (let n = 2; n <= x; n++) {
    const factors = getPrimePowerFactor(n);
    if (factors) {
      sum += Math.log(factors.p);
    }
  }
  return sum;
}

function getPrimePowerFactor(n: number): { p: number; k: number } | null {
  for (let p = 2; p <= n; p++) {
    if (!isPrimeNumber(p)) continue;
    let temp = n;
    let k = 0;
    while (temp > 1 && temp % p === 0) {
      temp /= p;
      k++;
    }
    if (temp === 1 && k > 0) return { p, k };
    if (temp < 1) break;
  }
  return null;
}
