import { evaluate, parse, derivative } from "mathjs";

export class NewtonRaphson {
  constructor(x, f, et) {
    const pf = f.replace(/(\d)([a-zA-Z])/g, "$1*$2");
    this.fp = parse(pf);
    this.dfp = derivative(pf, "x");
    this.x = parseFloat(x);
    this.et = parseFloat(et);
  }

  evalAt(x) {
    return this.fp.evaluate({ x });
  }

  checkInputs() {
    if (Number.isNaN(this.x) || Number.isNaN(this.et)) {
      throw new Error("Invalid numeric inputs");
    }

    try {
      const fx = this.evalAt(this.x);
      if (Number.isNaN(fx)) {
        throw new Error("Invalid function format or value");
      }
    } catch (err) {
      throw new Error("F(x) Wrong");
    }
  }

  solve() {
    this.checkInputs();
    let x0 = this.x;
    let x1;
    let error;
    let iter = 0;
    let history = [];
    let fx, dfx;
    let maxiter = 1000;
    do {
      fx = this.fp.evaluate({ x: x0 });
      dfx = this.dfp.evaluate({ x: x0 });

      if (dfx === 0) throw new Error("Derivative is zero. Cannot continue.");

      x1 = x0 - fx / dfx;
      error = Math.abs((x1 - x0) / x1);
      history.push({ iteration: iter, root: x0, x1, error, fx });
      iter++;

      x0 = x1;
    } while (error > this.et && iter < maxiter);

    return { root: x1, error, iterations: iter, history };
  }
}
