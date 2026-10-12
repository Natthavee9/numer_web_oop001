import { evaluate, parse } from "mathjs";

export class Secant {
  constructor(x1, x2, f, et) {
    const pf = f.replace(/(\d)([a-zA-Z])/g, "$1*$2");
    this.fp = parse(pf);
    this.x1 = parseFloat(x1);
    this.x2 = parseFloat(x2);
    this.et = parseFloat(et);
  }

  evalAt(x) {
    return this.fp.evaluate({ x });
  }

  checkInputs() {
    if (
      Number.isNaN(this.x1) ||
      Number.isNaN(this.x2) ||
      Number.isNaN(this.et)
    ) {
      throw new Error("Invalid numeric inputs");
    }

    try {
      const fx1 = this.evalAt(this.x1);
      if (Number.isNaN(fx1)) {
        throw new Error("Invalid function format or value");
      }
      const fx2 = this.evalAt(this.x2);
      if (Number.isNaN(fx2)) {
        throw new Error("Invalid function format or value");
      }
    } catch (err) {
      throw new Error("F(x) Wrong");
    }
  }

  solve() {
    this.checkInputs();
    let x0 = this.x1;
    let x1 = this.x2;
    let error, x2;
    let iter = 0;
    let history = [];
    let fx1, fx0;
    let maxiter = 1000;
    do {
      fx0 = this.evalAt(x0);
      fx1 = this.evalAt(x1);

      if (fx0 - fx1 === 0) {
        throw new Error("Division by zero in Secant formula");
      }

      x2 = x1 - (fx1 * (x0 - x1)) / (fx0 - fx1);
      error = Math.abs((x2 - x1) / (x2 || 1e-10));
      history.push({ iteration: iter, root: x2, error, fx: this.evalAt(x2) });
      if (iter > maxiter) break;
      iter++;
      x0 = x1;
      x1 = x2;
    } while (error > this.et);

    return { root: x2, error, iterations: iter, history };
  }
}
