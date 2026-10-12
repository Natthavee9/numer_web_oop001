import { evaluate, parse } from "mathjs";

export class FalsePosition {
  constructor(f, a, b, et) {
    const pf = f.replace(/(\d)([a-zA-Z])/g, "$1*$2");
    this.fp = parse(pf);
    this.l = parseFloat(a);
    this.r = parseFloat(b);
    this.et = parseFloat(et);
  }

  evalAt(x) {
    return this.fp.evaluate({ x });
  }

  checkInputs() {
    if (Number.isNaN(this.l) || Number.isNaN(this.r) || Number.isNaN(this.et)) {
      throw new Error("Invalid numeric inputs");
    }

    try {
      const fl = this.evalAt(this.l);
      const fr = this.evalAt(this.r);
      if (Number.isNaN(fl) || Number.isNaN(fr)) {
        throw new Error("Invalid function format or value");
      }
    } catch (err) {
      throw new Error("F(x) Wrong");
    }
  }

  solve() {
    this.checkInputs();
    let l = this.l;
    let r = this.r;
    let et = this.et;
    let fl = this.evalAt(l);
    let fr = this.evalAt(r);

    if (fl === 0) return { root: l, error: 0, iterations: 0 };
    if (fr === 0) return { root: r, error: 0, iterations: 0 };

    let error = 1.0;
    let maxiter = 1000;
    let iter = 0;
    let fx1, oldx1;
    let history = [];

    let x1 = (fr * l - fl * r) / (fr - fl);
    fx1 = this.evalAt(x1);
    fr = this.evalAt(r);
    if (fx1 * fr < 0) {
      l = x1;
    } else {
      r = x1;
    }
    oldx1 = x1;

    do {
      fl = this.evalAt(l);
      fr = this.evalAt(r);
      x1 = (fr * l - fl * r) / (fr - fl);
      fx1 = this.evalAt(x1);

      if (fx1 * fr < 0) {
        l = x1;
      } else {
        r = x1;
      }

      error = Math.abs((x1 - oldx1) / x1);
      oldx1 = x1;
      iter++;

      history.push({ iteration: iter, root: x1, error, fx: fx1 });
    } while (error > et && iter < maxiter);

    return { root: x1, error, iterations: iter, history };
  }
}
