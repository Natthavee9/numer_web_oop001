import { parse } from "mathjs";

export class CompositeTrapezoidal {
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
      `I \\approx \\frac{h}{2} (f(x_0) + f(x_n) + 2\\displaystyle\\sum_{i=1}^{n-1} f(x_i))`,
    );

    const formatEquation = (x) => {
      return this.rawF.replace(/x/g, `(${x})`);
    };

    // Compute subinterval width h = (b - a) / n
    let h = (this.B - this.A) / this.n;
    this.steps.push(
      `h = \\frac{b - a}{n} = \\frac{${this.B} - ${this.A}}{${this.n}} = ${h}`,
    );
    let x = [];
    let fx = [];

    // Generate equally spaced grid points x_i
    for (let i = 0; i < this.n + 1; i++) {
      x[i] = this.A + i * h;
    }

    // Evaluate f(x_i) at each grid point
    for (let i = 0; i < this.n + 1; i++) {
      fx[i] = this.evalAt(x[i]);
      this.steps.push(
        `f(x_${i} = ${x[i]}) = ${formatEquation(x[i])}  = ${fx[i].toFixed(4)}`,
      );
    }

    // Sum interior function values for i = 1 to n - 1
    let sum = 0;
    let sum_string_parts = [];

    for (let i = 1; i < this.n; i++) {
      sum += fx[i];
      sum_string_parts.push(fx[i].toFixed(4));
    }
    const sum_string = sum_string_parts.join(" + ");

    this.steps.push(
      `\\displaystyle\\sum_{i=1}^{n-1} f(x_i) = ${sum_string} = ${sum.toFixed(7)}`,
    );

    // Apply Composite Trapezoidal formula
    const ans = (h / 2) * (fx[0] + fx[this.n] + 2 * sum);
    this.steps.push(
      `I \\approx \\frac{${h.toFixed(4)}}{2} [${fx[0].toFixed(7)} + ${fx[this.n].toFixed(7)} + 2(${sum.toFixed(7)})] = ${ans.toFixed(7)}`,
    );

    // Return the approximated integral and LaTeX steps
    return { ans, steps: this.steps };
  }
}
