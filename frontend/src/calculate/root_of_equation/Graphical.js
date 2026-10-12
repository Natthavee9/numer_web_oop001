import { evaluate, parse } from "mathjs";

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
    } catch (err) {
      throw new Error("F(x) Wrong");
    }
  }

  solve() {
    this.checkInputs();
    let i = this.l;
    let x1, x2;
    let iter = 0;
    let history = [];
    let prevx = i;
    let error;
    let root;

    for (let i = this.l; i < this.r; i += 0.001) {
      x1 = this.evalAt(i);
      x2 = this.evalAt(i + 0.001);
      iter++;
      error = Math.abs((i - prevx) / i);
      history.push({ iteration: iter, root: i, fx: x1, error });

      if (x1 * x2 <= 0) {
        root = i;
        prevx = i;
        break;
      }

      prevx = i;
    }

    if (root === null) {
      throw new Error("No root found in the interval");
    }
    for (let i = root; i < this.r; i += 0.000001) {
      x1 = this.evalAt(i);
      x2 = this.evalAt(i + 0.000001);
      iter++;
      error = Math.abs((i - prevx) / i);
      history.push({ iteration: iter, root: i, fx: x1, error });
      if (x1 * x2 <= 0 || error < this.et) {
        root = i;
        break;
      }
      prevx = i;
    }

    return { root, error, iterations: iter, history };
  }
}