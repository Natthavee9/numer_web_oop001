import { parse } from "mathjs";

export class Graphical {
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
    } catch {
      throw new Error("Invalid function format f(x)");
    }
  }

  solve() {
    this.checkInputs();
    let iter = 0;
    let history = [];
    let root = null;
    let coarseStep = Math.max((this.r - this.l) / 5000, 0.001);
    let prevx = this.l;

    
    const fl = this.evalAt(this.l);
    if (fl === 0) {
      return { root: this.l, error: 0, iterations: 1, history: [{ iteration: 1, root: this.l, fx: 0, error: 0 }] };
    }

    
    for (let i = this.l; i <= this.r; i += coarseStep) {
      const x1 = this.evalAt(i);
      const nextI = i + coarseStep;
      const x2 = this.evalAt(nextI);
      iter++;
      const err = (i !== 0 && prevx !== i) ? Math.abs((i - prevx) / i) : 1;
      history.push({ iteration: iter, root: i, fx: x1, error: iter === 1 ? 1 : err });

      if (x1 === 0) {
        root = i;
        return { root, error: 0, iterations: iter, history };
      }

      if (x1 * x2 <= 0) {
        root = i;
        break;
      }
      prevx = i;
    }

    if (root === null) {
      throw new Error("No root found in the interval [XL, XR]");
    }

    
    const fineStep = 0.000001;
    const fineEnd = Math.min(root + coarseStep, this.r);
    let finePrev = root;

    for (let i = root; i <= fineEnd + fineStep / 2; i += fineStep) {
      const x1 = this.evalAt(i);
      const x2 = this.evalAt(i + fineStep);
      iter++;
      const err = (i !== 0 && finePrev !== i) ? Math.abs((i - finePrev) / i) : coarseStep / (Math.abs(i) || 1);
      history.push({ iteration: iter, root: i, fx: x1, error: err });

      if (x1 === 0 || Math.abs(x1) < 1e-12) {
        root = i;
        return { root, error: 0, iterations: iter, history };
      }

      if (x1 * x2 <= 0 || (err < this.et && finePrev !== i)) {
        root = Math.abs(x1) <= Math.abs(x2) ? i : i + fineStep;
        return { root, error: err, iterations: iter, history };
      }

      finePrev = i;
    }

    return { root, error: Math.abs(this.evalAt(root)), iterations: iter, history };
  }
}
