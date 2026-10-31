import { parse } from "mathjs";

export class Secant {
  constructor(arg1, arg2, arg3, arg4) {
    let f, x0, x1, et;
    if (typeof arg1 === "string") {
      f = arg1;
      x0 = arg2;
      x1 = arg3;
      et = arg4;
    } else {
      x0 = arg1;
      x1 = arg2;
      f = arg3;
      et = arg4;
    }

    const pf = f.replace(/(\d)([a-zA-Z])/g, "$1*$2");
    this.fString = f;
    this.fp = parse(pf);
    this.x0 = parseFloat(x0);
    this.x1 = parseFloat(x1);
    this.et = parseFloat(et);
  }

  evalAt(x) {
    return this.fp.evaluate({ x });
  }

  checkInputs() {
    if (Number.isNaN(this.x0) || Number.isNaN(this.x1) || Number.isNaN(this.et)) {
      throw new Error("Invalid numeric inputs");
    }

    try {
      const fx0 = this.evalAt(this.x0);
      const fx1 = this.evalAt(this.x1);
      if (Number.isNaN(fx0) || Number.isNaN(fx1)) {
        throw new Error("Invalid function format or value");
      }
    } catch {
      throw new Error("Invalid function format f(x)");
    }
  }

  solve() {
    this.checkInputs();
    let x0 = this.x0;
    let x1 = this.x1;
    let x2;
    let error = 1.0;
    let iter = 0;
    let history = [];
    const maxiter = 1000;

    // Check if initial points are already roots
    const initFx0 = this.evalAt(x0);
    if (initFx0 === 0) {
      return { root: x0, error: 0, iterations: 0, history: [] };
    }
    const initFx1 = this.evalAt(x1);
    if (initFx1 === 0) {
      return { root: x1, error: 0, iterations: 0, history: [] };
    }

    do {
      const fx0 = this.evalAt(x0);
      const fx1 = this.evalAt(x1);

      if (Math.abs(fx1 - fx0) < 1e-14) {
        throw new Error("f(X_i) - f(X_(i-1)) is zero. Division by zero in Secant formula.");
      }

      x2 = x1 - (fx1 * (x1 - x0)) / (fx1 - fx0);

      if (!isFinite(x2) || Number.isNaN(x2)) {
        throw new Error("Calculation diverged. The function may not converge from these initial values.");
      }

      error = x2 !== 0 ? Math.abs((x2 - x1) / x2) : Math.abs(x2 - x1);
      iter++;
      const fx2 = this.evalAt(x2);

      history.push({
        iteration: iter,
        x0,
        x1,
        x2,
        root: x2,
        fx0,
        fx1,
        fx2,
        fx: fx2,
        error,
      });

      if (iter >= maxiter && error > this.et) {
        throw new Error("Exceeded maximum iterations (1000). The method may be oscillating or diverging.");
      }

      x0 = x1;
      x1 = x2;
    } while (error > this.et && iter < maxiter);

    return { root: x2, error, iterations: iter, history };
  }
}
