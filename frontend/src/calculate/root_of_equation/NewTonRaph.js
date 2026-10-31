import { parse, derivative } from "mathjs";

export class NewtonRaphson {
  constructor(arg1, arg2, et) {
    let f, x;
    if (typeof arg1 === "string" && (typeof arg2 === "number" || !isNaN(Number(arg2)))) {
      f = arg1;
      x = arg2;
    } else {
      x = arg1;
      f = arg2;
    }

    const pf = f.replace(/(\d)([a-zA-Z])/g, "$1*$2");
    this.fString = f;
    this.fp = parse(pf);
    this.dfp = derivative(pf, "x");
    this.dfString = this.dfp.toString();
    this.x = parseFloat(x);
    this.et = parseFloat(et);
  }

  evalAt(x) {
    return this.fp.evaluate({ x });
  }

  evalDerivativeAt(x) {
    return this.dfp.evaluate({ x });
  }

  checkInputs() {
    if (Number.isNaN(this.x) || Number.isNaN(this.et)) {
      throw new Error("Invalid numeric inputs");
    }

    try {
      const fx = this.evalAt(this.x);
      const dfx = this.evalDerivativeAt(this.x);
      if (Number.isNaN(fx) || Number.isNaN(dfx)) {
        throw new Error("Invalid function format or value");
      }
    } catch {
      throw new Error("Invalid function format f(x)");
    }
  }

  solve() {
    this.checkInputs();
    let x0 = this.x;
    let x1;
    let error = 1.0;
    let iter = 0;
    let history = [];
    const maxiter = 1000;

    do {
      const fx = this.evalAt(x0);
      const dfx = this.evalDerivativeAt(x0);

      if (Math.abs(dfx) < 1e-14) {
        throw new Error("Derivative f'(x) is zero (or near zero). Newton-Raphson cannot continue.");
      }

      x1 = x0 - fx / dfx;

      if (!isFinite(x1) || Number.isNaN(x1)) {
        throw new Error("Calculation diverged. The function may not converge from this initial guess.");
      }

      error = x1 !== 0 ? Math.abs((x1 - x0) / x1) : Math.abs(x1 - x0);
      iter++;
      history.push({
        iteration: iter,
        x0,
        x1,
        root: x1,
        fx,
        dfx,
        error,
      });

      if (iter >= maxiter && error > this.et) {
        throw new Error("Exceeded maximum iterations (1000). The method may be oscillating or diverging.");
      }

      x0 = x1;
    } while (error > this.et && iter < maxiter);

    return {
      root: x1,
      error,
      iterations: iter,
      dfString: this.dfString,
      history,
    };
  }
}
