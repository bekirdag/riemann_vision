
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
 * zeta(s) = eta(s) / (1 - 2^(1-s))
 * eta(s) = sum_{n=1}^N (-1)^(n-1) / n^s
 */
export function calculateZeta(s: Complex, iterations: number): Complex {
  // Calculate eta(s)
  let etaRe = 0;
  let etaIm = 0;

  for (let n = 1; n <= iterations; n++) {
    // n^-s = n^-(sigma + it) = n^-sigma * n^-it = n^-sigma * exp(-it * ln(n))
    // exp(-it * ln(n)) = cos(-t * ln(n)) + i * sin(-t * ln(n))
    //                = cos(t * ln(n)) - i * sin(t * ln(n))
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

  // Calculate denominator: 1 - 2^(1-s)
  // 2^(1-s) = exp((1-s) * ln(2)) = exp((1-sigma - it) * ln(2))
  //         = 2^(1-sigma) * exp(-it * ln(2))
  //         = 2^(1-sigma) * (cos(t * ln(2)) - i * sin(t * ln(2)))
  const ln2 = Math.log(2);
  const scale = Math.pow(2, 1 - s.re);
  const tLn2 = s.im * ln2;
  
  const subRe = scale * Math.cos(tLn2);
  const subIm = -scale * Math.sin(tLn2);

  const denom = new Complex(1 - subRe, -subIm);

  return Complex.div(eta, denom);
}
