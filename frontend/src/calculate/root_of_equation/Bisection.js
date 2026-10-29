import { parse } from "mathjs";

export class Bisection {
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
    let f = this.fp;
    let et = this.et;
    let fl = this.evalAt(l);
    let fr = this.evalAt(r);

    if (fl === 0) return { root: l, error: 0, iterations: 0, history: [] };
    if (fr === 0) return { root: r, error: 0, iterations: 0, history: [] };

    let m, oldm;
    let error = 1.0;
    let maxiter = 1000;
    let iter = 0;
    let fm;
    let history = [];

    m = (l + r) / 2;
    fm = this.evalAt(m);
    fr = this.evalAt(r);
    if (fm * fr > 0) {
      r = m;
    } else {
      l = m;
    }
    oldm = m;

    do {
      m = (l + r) / 2;
      fm = this.evalAt(m);

      if (fm * this.evalAt(r) > 0) {
        r = m;
      } else {
        l = m;
      }

      error = Math.abs((m - oldm) / m);
      oldm = m;
      iter++;

      history.push({ iteration: iter, root: m, error, fx: fm });
    } while (error > et && iter < maxiter);

    return { root: m, error, iterations: iter, history };
  }
}
