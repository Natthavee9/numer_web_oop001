import { parse } from "mathjs";

export class Trapezoidal {
  constructor(a, b, f) {
    this.A = parseFloat(a);
    this.B = parseFloat(b);
    const pf = f.replace(/(\d)([a-zA-Z])/g, "$1*$2");
    this.rawF = f;
    this.fp = parse(pf);
    this.steps = [];
  }

  // Evaluate the parsed function at a given x
  evalAt(x) {
    return this.fp.evaluate({ x: x });
  }

  solve() {
    this.steps.push(`I \\approx \\frac{h}{2} (f(x_0) + f(x_1))`);

    const formatEquation = (x) => {
      return this.rawF.replace(/x/g, `(${x})`);
    };

    // Compute interval width h = b - a
    let h = this.B - this.A;
    this.steps.push(`h = b - a = ${this.B} - ${this.A} = ${h}`);

    let fx = [];

    // Evaluate f(x) at endpoints x0 = a and x1 = b
    fx[0] = this.evalAt(this.A);
    this.steps.push(
      `f(x_0 = ${this.A}) = ${formatEquation(this.A)}  = ${fx[0].toFixed(4)}`,
    );
    fx[1] = this.evalAt(this.B);
    this.steps.push(
      `f(x_1 = ${this.B}) = ${formatEquation(this.B)}  = ${fx[1].toFixed(4)}`,
    );

    // Apply single-segment Trapezoidal rule
    let ans = (h / 2) * (fx[0] + fx[1]);
    this.steps.push(
      `I \\approx \\frac{${h}}{2} (${fx[0].toFixed(4)} + ${fx[1].toFixed(4)}) = ${ans.toFixed(4)}`,
    );

    // Return the approximated integral and LaTeX steps
    return { ans, steps: this.steps };
  }
}
