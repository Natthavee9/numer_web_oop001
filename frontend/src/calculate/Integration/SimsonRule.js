import { parse } from "mathjs";

export class Simpson {
  constructor(a, b, f) {
    this.A = parseFloat(a);
    this.B = parseFloat(b);
    const pf = f.replace(/(\d)([a-zA-Z])/g, "$1*$2");
    this.rawF = f;
    this.fp = parse(pf);
    this.steps = [];
  }

  evalAt(x) {
    return this.fp.evaluate({ x: x });
  }

  solve() {
    this.steps.push(`I \\approx \\frac{h}{3} (f(x_0) + 4f(x_1) + f(x_2))`);

    const formatEquation = (x) => {
      return this.rawF.replace(/x/g, `(${x})`);
    };

    let h = (this.B - this.A) / 2;
    this.steps.push(
      `h = \\frac{b - a}{2} = \\frac{${this.B} - ${this.A}}{2} = ${h}`,
    );

    let x = [];
    let fx = [];

    for (let i = 0; i < 3; i++) {
      x[i] = this.A + i * h;
    }

    for (let i = 0; i < 3; i++) {
      fx[i] = this.evalAt(x[i]);
      this.steps.push(
        `f(x_${i} = ${x[i]}) = ${formatEquation(x[i])}  = ${fx[i].toFixed(4)}`,
      );
    }

    let ans = (h / 3) * (fx[0] + 4 * fx[1] + fx[2]);
    this.steps.push(
      `I \\approx \\frac{${h}}{3} (${fx[0].toFixed(4)} + 4 (${fx[1].toFixed(4)}) + ${fx[2].toFixed(4)} ) = ${ans.toFixed(4)}`,
    );

    return { ans, steps: this.steps };
  }
}
