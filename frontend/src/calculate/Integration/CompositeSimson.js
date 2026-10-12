import { parse } from "mathjs";

export class CompositeSimpson {
  constructor(a, b, f, n) {
    this.A = parseFloat(a);
    this.B = parseFloat(b);
    const pf = f.replace(/(\d)([a-zA-Z])/g, "$1*$2");
    this.rawF = f;
    this.fp = parse(pf);
    this.steps = [];
    this.n = parseFloat(n);
  }

  // Evaluate the parsed function at a given x
  evalAt(x) {
    return this.fp.evaluate({ x: x });
  }

  solve() {
    this.steps.push(
      `I \\approx \\frac{h}{3} (f(x_0) + f(x_n) + 4\\displaystyle\\sum_{i=1,3}^{n-1} f(x_i)) + 2\\displaystyle\\sum_{i=2,4}^{n-2} f(x_i))`,
    );

    const formatEquation = (x) => {
      return this.rawF.replace(/x/g, `(${x})`);
    };

    // Compute subinterval width h = (b - a) / (2n)
    let h = (this.B - this.A) / (2 * this.n);
    this.steps.push(
      `h = \\frac{b - a}{n} = \\frac{${this.B} - ${this.A}}{2(${this.n})} = ${h}`,
    );
    let x = [];
    let fx = [];

    // Generate 2n + 1 equally spaced grid points x_i
    for (let i = 0; i < this.n * 2 + 1; i++) {
      x[i] = this.A + i * h;
    }

    // Evaluate f(x_i) at each grid point
    for (let i = 0; i < this.n * 2 + 1; i++) {
      fx[i] = this.evalAt(x[i]);
      this.steps.push(
        `f(x_${i} = ${x[i]}) = ${formatEquation(x[i])}  = ${fx[i].toFixed(4)}`,
      );
    }

    // Separate interior points into odd-indexed (sum4) and even-indexed (sum2) terms
    let sum4 = 0,
      sum2 = 0;
    let sum_string2 = [];
    let sum_string4 = [];

    for (let i = 1; i < this.n * 2; i++) {
      if (i % 2 == 0) {
        sum2 += fx[i];
        sum_string2.push(fx[i].toFixed(4));
      } else {
        sum4 += fx[i];
        sum_string4.push(fx[i].toFixed(4));
      }
    }
    let sum_string = sum_string2.join(" + ");
    this.steps.push(
      `\\displaystyle\\sum_{i=1}^{n-1} f(x_i) = ${sum_string} = ${sum4.toFixed(7)}`,
    );
    sum_string = sum_string4.join(" + ");
    this.steps.push(
      `\\displaystyle\\sum_{i=2}^{n-2} f(x_i) = ${sum_string} = ${sum2.toFixed(7)}`,
    );

    // Apply Composite Simpson's 1/3 formula
    const ans = (h / 3) * (fx[0] + fx[this.n * 2] + 4 * sum4 + 2 * sum2);
    this.steps.push(
      `I \\approx \\frac{${h.toFixed(4)}}{3} [${fx[0].toFixed(7)} + ${fx[this.n].toFixed(7)} + 4(${sum4.toFixed(7)}) + 2(${sum2.toFixed(7)})] = ${ans.toFixed(7)}`,
    );

    // Return the approximated integral and LaTeX steps
    return { ans, steps: this.steps };
  }
}
