
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
  const gaussApprox: number[] = [];
  
  let count = 0;
  for (let x = 1; x <= max; x++) {
    if (isPrime[x]) count++;
    xValues.push(x);
    piX.push(count);
    
    const approx = x > 1 ? x / Math.log(x) : 0;
    gaussApprox.push(approx);
  }
  
  return { xValues, piX, gaussApprox, isPrime };
}
