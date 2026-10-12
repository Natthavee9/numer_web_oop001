import { evaluate, parse } from "mathjs";

export class Onepoint {
  constructor(x, f, et) {
    const pf = f.replace(/(\d)([a-zA-Z])/g, "$1*$2");
    this.fp = parse(pf);
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
    let x = this.x;
    let fx;
    let error;
    let iter = 0;
    let nx = x;
    let history = [];
    let maxiter = 1000;
    do {
      fx = this.evalAt(x);
      error = Math.abs((fx - x) / fx);
      history.push({ iteration: iter + 1, x, fx, error });
      x = fx;
      iter++;
    } while (error > this.et && iter < maxiter);

    return { root: x, error, iterations: iter, history };
  }
}
