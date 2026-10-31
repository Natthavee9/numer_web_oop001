import { parse, derivative } from "mathjs";

/**
 * Numerical Differentiation Solver
 * Supports Forward, Backward, and Central Divided-Differences
 * for 1st, 2nd, 3rd, and 4th order derivatives with O(h), O(h^2), and O(h^4) error approximations.
 */
export class NumericalDiff {
  constructor(fx, x, h, direction = "forward", order = 1, errorOrder = "h") {
    this.rawF = fx;
    const pf = fx.replace(/(\d)([a-zA-Z])/g, "$1*$2");
    this.fp = parse(pf);
    this.x = parseFloat(x);
    this.h = parseFloat(h);
    this.direction = (direction || "forward").toLowerCase();
    this.order = parseInt(order, 10) || 1;
    this.errorOrder = (errorOrder || "h").toLowerCase();
  }

  evalAt(xVal) {
    return this.fp.evaluate({ x: xVal });
  }

  getExactDerivative() {
    try {
      const pf = this.rawF.replace(/(\d)([a-zA-Z])/g, "$1*$2");
      let d = derivative(pf, "x");
      for (let i = 2; i <= this.order; i++) {
        d = derivative(d, "x");
      }
      const val = d.evaluate({ x: this.x });
      return {
        formula: d.toString(),
        value: Number(val),
      };
    } catch {
      return null;
    }
  }

  solve() {
    if (Number.isNaN(this.x) || Number.isNaN(this.h)) {
      throw new Error("Invalid x or h values");
    }
    if (this.h === 0) {
      throw new Error("Step size h cannot be zero");
    }

    const x = this.x;
    const h = this.h;
    const f = (xVal) => this.evalAt(xVal);

    // Order label helper
    const orderNotation =
      this.order === 1
        ? "f'(x)"
        : this.order === 2
        ? "f''(x)"
        : this.order === 3
        ? "f'''(x)"
        : `f^{(${this.order})}(x)`;

    let formulaLatex = "";
    let subLatex = "";
    let approx = 0;
    const pointsUsed = [];

    const getPt = (offset, label) => {
      const ptX = x + offset * h;
      const ptY = f(ptX);
      pointsUsed.push({
        label,
        offset,
        x: Number(ptX.toFixed(6)),
        y: Number(ptY.toFixed(6)),
      });
      return ptY;
    };

    if (this.direction === "forward") {
      const isH2 = this.errorOrder === "h2";
      if (this.order === 1) {
        if (!isH2) {
          // Forward 1st O(h): (f(x+h) - f(x)) / h
          const f0 = getPt(0, "f(x)");
          const f1 = getPt(1, "f(x+h)");
          approx = (f1 - f0) / h;
          formulaLatex = `${orderNotation} \\approx \\frac{f(x+h) - f(x)}{h}`;
          subLatex = `\\frac{${f1.toFixed(6)} - ${f0.toFixed(6)}}{${h}} = ${approx.toFixed(6)}`;
        } else {
          // Forward 1st O(h^2): (-f(x+2h) + 4f(x+h) - 3f(x)) / (2h)
          const f0 = getPt(0, "f(x)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          approx = (-f2 + 4 * f1 - 3 * f0) / (2 * h);
          formulaLatex = `${orderNotation} \\approx \\frac{-f(x+2h) + 4f(x+h) - 3f(x)}{2h}`;
          subLatex = `\\frac{-${f2.toFixed(6)} + 4(${f1.toFixed(6)}) - 3(${f0.toFixed(6)})}{2(${h})} = ${approx.toFixed(6)}`;
        }
      } else if (this.order === 2) {
        if (!isH2) {
          // Forward 2nd O(h): (f(x+2h) - 2f(x+h) + f(x)) / h^2
          const f0 = getPt(0, "f(x)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          approx = (f2 - 2 * f1 + f0) / (h * h);
          formulaLatex = `${orderNotation} \\approx \\frac{f(x+2h) - 2f(x+h) + f(x)}{h^2}`;
          subLatex = `\\frac{${f2.toFixed(6)} - 2(${f1.toFixed(6)}) + ${f0.toFixed(6)}}{${h}^2} = ${approx.toFixed(6)}`;
        } else {
          // Forward 2nd O(h^2): (-f(x+3h) + 4f(x+2h) - 5f(x+h) + 2f(x)) / h^2
          const f0 = getPt(0, "f(x)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          const f3 = getPt(3, "f(x+3h)");
          approx = (-f3 + 4 * f2 - 5 * f1 + 2 * f0) / (h * h);
          formulaLatex = `${orderNotation} \\approx \\frac{-f(x+3h) + 4f(x+2h) - 5f(x+h) + 2f(x)}{h^2}`;
          subLatex = `\\frac{-${f3.toFixed(6)} + 4(${f2.toFixed(6)}) - 5(${f1.toFixed(6)}) + 2(${f0.toFixed(6)})}{${h}^2} = ${approx.toFixed(6)}`;
        }
      } else if (this.order === 3) {
        if (!isH2) {
          // Forward 3rd O(h): (f(x+3h) - 3f(x+2h) + 3f(x+h) - f(x)) / h^3
          const f0 = getPt(0, "f(x)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          const f3 = getPt(3, "f(x+3h)");
          approx = (f3 - 3 * f2 + 3 * f1 - f0) / Math.pow(h, 3);
          formulaLatex = `${orderNotation} \\approx \\frac{f(x+3h) - 3f(x+2h) + 3f(x+h) - f(x)}{h^3}`;
          subLatex = `\\frac{${f3.toFixed(6)} - 3(${f2.toFixed(6)}) + 3(${f1.toFixed(6)}) - ${f0.toFixed(6)}}{${h}^3} = ${approx.toFixed(6)}`;
        } else {
          // Forward 3rd O(h^2): (-3f(x+4h) + 14f(x+3h) - 24f(x+2h) + 18f(x+h) - 5f(x)) / (2h^3)
          const f0 = getPt(0, "f(x)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          const f3 = getPt(3, "f(x+3h)");
          const f4 = getPt(4, "f(x+4h)");
          approx =
            (-3 * f4 + 14 * f3 - 24 * f2 + 18 * f1 - 5 * f0) /
            (2 * Math.pow(h, 3));
          formulaLatex = `${orderNotation} \\approx \\frac{-3f(x+4h) + 14f(x+3h) - 24f(x+2h) + 18f(x+h) - 5f(x)}{2h^3}`;
          subLatex = `\\frac{-3(${f4.toFixed(6)}) + 14(${f3.toFixed(6)}) - 24(${f2.toFixed(6)}) + 18(${f1.toFixed(6)}) - 5(${f0.toFixed(6)})}{2(${h}^3)} = ${approx.toFixed(6)}`;
        }
      } else if (this.order === 4) {
        if (!isH2) {
          // Forward 4th O(h): (f(x+4h) - 4f(x+3h) + 6f(x+2h) - 4f(x+h) + f(x)) / h^4
          const f0 = getPt(0, "f(x)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          const f3 = getPt(3, "f(x+3h)");
          const f4 = getPt(4, "f(x+4h)");
          approx =
            (f4 - 4 * f3 + 6 * f2 - 4 * f1 + f0) / Math.pow(h, 4);
          formulaLatex = `${orderNotation} \\approx \\frac{f(x+4h) - 4f(x+3h) + 6f(x+2h) - 4f(x+h) + f(x)}{h^4}`;
          subLatex = `\\frac{${f4.toFixed(6)} - 4(${f3.toFixed(6)}) + 6(${f2.toFixed(6)}) - 4(${f1.toFixed(6)}) + ${f0.toFixed(6)}}{${h}^4} = ${approx.toFixed(6)}`;
        } else {
          // Forward 4th O(h^2): (-2f(x+5h) + 11f(x+4h) - 24f(x+3h) + 26f(x+2h) - 14f(x+h) + 3f(x)) / h^4
          const f0 = getPt(0, "f(x)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          const f3 = getPt(3, "f(x+3h)");
          const f4 = getPt(4, "f(x+4h)");
          const f5 = getPt(5, "f(x+5h)");
          approx =
            (-2 * f5 + 11 * f4 - 24 * f3 + 26 * f2 - 14 * f1 + 3 * f0) /
            Math.pow(h, 4);
          formulaLatex = `${orderNotation} \\approx \\frac{-2f(x+5h) + 11f(x+4h) - 24f(x+3h) + 26f(x+2h) - 14f(x+h) + 3f(x)}{h^4}`;
          subLatex = `\\frac{-2(${f5.toFixed(6)}) + 11(${f4.toFixed(6)}) - 24(${f3.toFixed(6)}) + 26(${f2.toFixed(6)}) - 14(${f1.toFixed(6)}) + 3(${f0.toFixed(6)})}{${h}^4} = ${approx.toFixed(6)}`;
        }
      }
    } else if (this.direction === "backward") {
      const isH2 = this.errorOrder === "h2";
      if (this.order === 1) {
        if (!isH2) {
          // Backward 1st O(h): (f(x) - f(x-h)) / h
          const f0 = getPt(0, "f(x)");
          const fm1 = getPt(-1, "f(x-h)");
          approx = (f0 - fm1) / h;
          formulaLatex = `${orderNotation} \\approx \\frac{f(x) - f(x-h)}{h}`;
          subLatex = `\\frac{${f0.toFixed(6)} - ${fm1.toFixed(6)}}{${h}} = ${approx.toFixed(6)}`;
        } else {
          // Backward 1st O(h^2): (3f(x) - 4f(x-h) + f(x-2h)) / (2h)
          const f0 = getPt(0, "f(x)");
          const fm1 = getPt(-1, "f(x-h)");
          const fm2 = getPt(-2, "f(x-2h)");
          approx = (3 * f0 - 4 * fm1 + fm2) / (2 * h);
          formulaLatex = `${orderNotation} \\approx \\frac{3f(x) - 4f(x-h) + f(x-2h)}{2h}`;
          subLatex = `\\frac{3(${f0.toFixed(6)}) - 4(${fm1.toFixed(6)}) + ${fm2.toFixed(6)}}{2(${h})} = ${approx.toFixed(6)}`;
        }
      } else if (this.order === 2) {
        if (!isH2) {
          // Backward 2nd O(h): (f(x) - 2f(x-h) + f(x-2h)) / h^2
          const f0 = getPt(0, "f(x)");
          const fm1 = getPt(-1, "f(x-h)");
          const fm2 = getPt(-2, "f(x-2h)");
          approx = (f0 - 2 * fm1 + fm2) / (h * h);
          formulaLatex = `${orderNotation} \\approx \\frac{f(x) - 2f(x-h) + f(x-2h)}{h^2}`;
          subLatex = `\\frac{${f0.toFixed(6)} - 2(${fm1.toFixed(6)}) + ${fm2.toFixed(6)}}{${h}^2} = ${approx.toFixed(6)}`;
        } else {
          // Backward 2nd O(h^2): (2f(x) - 5f(x-h) + 4f(x-2h) - f(x-3h)) / h^2
          const f0 = getPt(0, "f(x)");
          const fm1 = getPt(-1, "f(x-h)");
          const fm2 = getPt(-2, "f(x-2h)");
          const fm3 = getPt(-3, "f(x-3h)");
          approx = (2 * f0 - 5 * fm1 + 4 * fm2 - fm3) / (h * h);
          formulaLatex = `${orderNotation} \\approx \\frac{2f(x) - 5f(x-h) + 4f(x-2h) - f(x-3h)}{h^2}`;
          subLatex = `\\frac{2(${f0.toFixed(6)}) - 5(${fm1.toFixed(6)}) + 4(${fm2.toFixed(6)}) - ${fm3.toFixed(6)}}{${h}^2} = ${approx.toFixed(6)}`;
        }
      } else if (this.order === 3) {
        if (!isH2) {
          // Backward 3rd O(h): (f(x) - 3f(x-h) + 3f(x-2h) - f(x-3h)) / h^3
          const f0 = getPt(0, "f(x)");
          const fm1 = getPt(-1, "f(x-h)");
          const fm2 = getPt(-2, "f(x-2h)");
          const fm3 = getPt(-3, "f(x-3h)");
          approx = (f0 - 3 * fm1 + 3 * fm2 - fm3) / Math.pow(h, 3);
          formulaLatex = `${orderNotation} \\approx \\frac{f(x) - 3f(x-h) + 3f(x-2h) - f(x-3h)}{h^3}`;
          subLatex = `\\frac{${f0.toFixed(6)} - 3(${fm1.toFixed(6)}) + 3(${fm2.toFixed(6)}) - ${fm3.toFixed(6)}}{${h}^3} = ${approx.toFixed(6)}`;
        } else {
          // Backward 3rd O(h^2): (5f(x) - 18f(x-h) + 24f(x-2h) - 14f(x-3h) + 3f(x-4h)) / (2h^3)
          const f0 = getPt(0, "f(x)");
          const fm1 = getPt(-1, "f(x-h)");
          const fm2 = getPt(-2, "f(x-2h)");
          const fm3 = getPt(-3, "f(x-3h)");
          const fm4 = getPt(-4, "f(x-4h)");
          approx =
            (5 * f0 - 18 * fm1 + 24 * fm2 - 14 * fm3 + 3 * fm4) /
            (2 * Math.pow(h, 3));
          formulaLatex = `${orderNotation} \\approx \\frac{5f(x) - 18f(x-h) + 24f(x-2h) - 14f(x-3h) + 3f(x-4h)}{2h^3}`;
          subLatex = `\\frac{5(${f0.toFixed(6)}) - 18(${fm1.toFixed(6)}) + 24(${fm2.toFixed(6)}) - 14(${fm3.toFixed(6)}) + 3(${fm4.toFixed(6)})}{2(${h}^3)} = ${approx.toFixed(6)}`;
        }
      } else if (this.order === 4) {
        if (!isH2) {
          // Backward 4th O(h): (f(x) - 4f(x-h) + 6f(x-2h) - 4f(x-3h) + f(x-4h)) / h^4
          const f0 = getPt(0, "f(x)");
          const fm1 = getPt(-1, "f(x-h)");
          const fm2 = getPt(-2, "f(x-2h)");
          const fm3 = getPt(-3, "f(x-3h)");
          const fm4 = getPt(-4, "f(x-4h)");
          approx =
            (f0 - 4 * fm1 + 6 * fm2 - 4 * fm3 + fm4) / Math.pow(h, 4);
          formulaLatex = `${orderNotation} \\approx \\frac{f(x) - 4f(x-h) + 6f(x-2h) - 4f(x-3h) + f(x-4h)}{h^4}`;
          subLatex = `\\frac{${f0.toFixed(6)} - 4(${fm1.toFixed(6)}) + 6(${fm2.toFixed(6)}) - 4(${fm3.toFixed(6)}) + ${fm4.toFixed(6)}}{${h}^4} = ${approx.toFixed(6)}`;
        } else {
          // Backward 4th O(h^2): (3f(x) - 14f(x-h) + 26f(x-2h) - 24f(x-3h) + 11f(x-4h) - 2f(x-5h)) / h^4
          const f0 = getPt(0, "f(x)");
          const fm1 = getPt(-1, "f(x-h)");
          const fm2 = getPt(-2, "f(x-2h)");
          const fm3 = getPt(-3, "f(x-3h)");
          const fm4 = getPt(-4, "f(x-4h)");
          const fm5 = getPt(-5, "f(x-5h)");
          approx =
            (3 * f0 - 14 * fm1 + 26 * fm2 - 24 * fm3 + 11 * fm4 - 2 * fm5) /
            Math.pow(h, 4);
          formulaLatex = `${orderNotation} \\approx \\frac{3f(x) - 14f(x-h) + 26f(x-2h) - 24f(x-3h) + 11f(x-4h) - 2f(x-5h)}{h^4}`;
          subLatex = `\\frac{3(${f0.toFixed(6)}) - 14(${fm1.toFixed(6)}) + 26(${fm2.toFixed(6)}) - 24(${fm3.toFixed(6)}) + 11(${fm4.toFixed(6)}) - 2(${fm5.toFixed(6)})}{${h}^4} = ${approx.toFixed(6)}`;
        }
      }
    } else if (this.direction === "central") {
      const isH4 = this.errorOrder === "h4";
      if (this.order === 1) {
        if (!isH4) {
          // Central 1st O(h^2): (f(x+h) - f(x-h)) / (2h)
          const fm1 = getPt(-1, "f(x-h)");
          const f1 = getPt(1, "f(x+h)");
          approx = (f1 - fm1) / (2 * h);
          formulaLatex = `${orderNotation} \\approx \\frac{f(x+h) - f(x-h)}{2h}`;
          subLatex = `\\frac{${f1.toFixed(6)} - ${fm1.toFixed(6)}}{2(${h})} = ${approx.toFixed(6)}`;
        } else {
          // Central 1st O(h^4): (-f(x+2h) + 8f(x+h) - 8f(x-h) + f(x-2h)) / (12h)
          const fm2 = getPt(-2, "f(x-2h)");
          const fm1 = getPt(-1, "f(x-h)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          approx = (-f2 + 8 * f1 - 8 * fm1 + fm2) / (12 * h);
          formulaLatex = `${orderNotation} \\approx \\frac{-f(x+2h) + 8f(x+h) - 8f(x-h) + f(x-2h)}{12h}`;
          subLatex = `\\frac{-${f2.toFixed(6)} + 8(${f1.toFixed(6)}) - 8(${fm1.toFixed(6)}) + ${fm2.toFixed(6)}}{12(${h})} = ${approx.toFixed(6)}`;
        }
      } else if (this.order === 2) {
        if (!isH4) {
          // Central 2nd O(h^2): (f(x+h) - 2f(x) + f(x-h)) / h^2
          const fm1 = getPt(-1, "f(x-h)");
          const f0 = getPt(0, "f(x)");
          const f1 = getPt(1, "f(x+h)");
          approx = (f1 - 2 * f0 + fm1) / (h * h);
          formulaLatex = `${orderNotation} \\approx \\frac{f(x+h) - 2f(x) + f(x-h)}{h^2}`;
          subLatex = `\\frac{${f1.toFixed(6)} - 2(${f0.toFixed(6)}) + ${fm1.toFixed(6)}}{${h}^2} = ${approx.toFixed(6)}`;
        } else {
          // Central 2nd O(h^4): (-f(x+2h) + 16f(x+h) - 30f(x) + 16f(x-h) - f(x-2h)) / (12h^2)
          const fm2 = getPt(-2, "f(x-2h)");
          const fm1 = getPt(-1, "f(x-h)");
          const f0 = getPt(0, "f(x)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          approx =
            (-f2 + 16 * f1 - 30 * f0 + 16 * fm1 - fm2) / (12 * h * h);
          formulaLatex = `${orderNotation} \\approx \\frac{-f(x+2h) + 16f(x+h) - 30f(x) + 16f(x-h) - f(x-2h)}{12h^2}`;
          subLatex = `\\frac{-${f2.toFixed(6)} + 16(${f1.toFixed(6)}) - 30(${f0.toFixed(6)}) + 16(${fm1.toFixed(6)}) - ${fm2.toFixed(6)}}{12(${h}^2)} = ${approx.toFixed(6)}`;
        }
      } else if (this.order === 3) {
        if (!isH4) {
          // Central 3rd O(h^2): (f(x+2h) - 2f(x+h) + 2f(x-h) - f(x-2h)) / (2h^3)
          const fm2 = getPt(-2, "f(x-2h)");
          const fm1 = getPt(-1, "f(x-h)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          approx =
            (f2 - 2 * f1 + 2 * fm1 - fm2) / (2 * Math.pow(h, 3));
          formulaLatex = `${orderNotation} \\approx \\frac{f(x+2h) - 2f(x+h) + 2f(x-h) - f(x-2h)}{2h^3}`;
          subLatex = `\\frac{${f2.toFixed(6)} - 2(${f1.toFixed(6)}) + 2(${fm1.toFixed(6)}) - ${fm2.toFixed(6)}}{2(${h}^3)} = ${approx.toFixed(6)}`;
        } else {
          // Central 3rd O(h^4): (-f(x+3h) + 8f(x+2h) - 13f(x+h) + 13f(x-h) - 8f(x-2h) + f(x-3h)) / (8h^3)
          const fm3 = getPt(-3, "f(x-3h)");
          const fm2 = getPt(-2, "f(x-2h)");
          const fm1 = getPt(-1, "f(x-h)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          const f3 = getPt(3, "f(x+3h)");
          approx =
            (-f3 + 8 * f2 - 13 * f1 + 13 * fm1 - 8 * fm2 + fm3) /
            (8 * Math.pow(h, 3));
          formulaLatex = `${orderNotation} \\approx \\frac{-f(x+3h) + 8f(x+2h) - 13f(x+h) + 13f(x-h) - 8f(x-2h) + f(x-3h)}{8h^3}`;
          subLatex = `\\frac{-${f3.toFixed(6)} + 8(${f2.toFixed(6)}) - 13(${f1.toFixed(6)}) + 13(${fm1.toFixed(6)}) - 8(${fm2.toFixed(6)}) + ${fm3.toFixed(6)}}{8(${h}^3)} = ${approx.toFixed(6)}`;
        }
      } else if (this.order === 4) {
        if (!isH4) {
          // Central 4th O(h^2): (f(x+2h) - 4f(x+h) + 6f(x) - 4f(x-h) + f(x-2h)) / h^4
          const fm2 = getPt(-2, "f(x-2h)");
          const fm1 = getPt(-1, "f(x-h)");
          const f0 = getPt(0, "f(x)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          approx =
            (f2 - 4 * f1 + 6 * f0 - 4 * fm1 + fm2) / Math.pow(h, 4);
          formulaLatex = `${orderNotation} \\approx \\frac{f(x+2h) - 4f(x+h) + 6f(x) - 4f(x-h) + f(x-2h)}{h^4}`;
          subLatex = `\\frac{${f2.toFixed(6)} - 4(${f1.toFixed(6)}) + 6(${f0.toFixed(6)}) - 4(${fm1.toFixed(6)}) + ${fm2.toFixed(6)}}{${h}^4} = ${approx.toFixed(6)}`;
        } else {
          // Central 4th O(h^4): (-f(x+3h) + 12f(x+2h) - 39f(x+h) + 56f(x) - 39f(x-h) + 12f(x-2h) - f(x-3h)) / (6h^4)
          const fm3 = getPt(-3, "f(x-3h)");
          const fm2 = getPt(-2, "f(x-2h)");
          const fm1 = getPt(-1, "f(x-h)");
          const f0 = getPt(0, "f(x)");
          const f1 = getPt(1, "f(x+h)");
          const f2 = getPt(2, "f(x+2h)");
          const f3 = getPt(3, "f(x+3h)");
          approx =
            (-f3 + 12 * f2 - 39 * f1 + 56 * f0 - 39 * fm1 + 12 * fm2 - fm3) /
            (6 * Math.pow(h, 4));
          formulaLatex = `${orderNotation} \\approx \\frac{-f(x+3h) + 12f(x+2h) - 39f(x+h) + 56f(x) - 39f(x-h) + 12f(x-2h) - f(x-3h)}{6h^4}`;
          subLatex = `\\frac{-${f3.toFixed(6)} + 12(${f2.toFixed(6)}) - 39(${f1.toFixed(6)}) + 56(${f0.toFixed(6)}) - 39(${fm1.toFixed(6)}) + 12(${fm2.toFixed(6)}) - ${fm3.toFixed(6)}}{6(${h}^4)} = ${approx.toFixed(6)}`;
        }
      }
    }

    // Exact derivative calculation
    const exactObj = this.getExactDerivative();
    let exactVal = null;
    let exactFormula = null;
    let errorPct = null;

    if (exactObj) {
      exactVal = exactObj.value;
      exactFormula = exactObj.formula;
      if (Math.abs(exactVal) > 1e-12) {
        errorPct = Math.abs((exactVal - approx) / exactVal) * 100;
      } else {
        errorPct = Math.abs(exactVal - approx);
      }
    }

    // Sort points by x ascending for clean display in table
    pointsUsed.sort((a, b) => a.x - b.x);

    return {
      approx: Number(approx.toFixed(6)),
      exact: exactVal !== null ? Number(exactVal.toFixed(6)) : null,
      exactFormula,
      error: errorPct !== null ? Number(errorPct.toFixed(6)) : null,
      formulaLatex,
      subLatex,
      points: pointsUsed,
      direction: this.direction,
      order: this.order,
      errorOrder: this.errorOrder,
    };
  }

  /**
   * Helper to solve for all 3 directions (Forward, Backward, Central) for comparison
   */
  solveAll() {
    const directions = ["forward", "backward", "central"];
    const results = {};
    for (const dir of directions) {
      const errOrder =
        dir === "central"
          ? this.errorOrder === "h4" ? "h4" : "h2"
          : this.errorOrder === "h2" ? "h2" : "h";
      const solver = new NumericalDiff(
        this.rawF,
        this.x,
        this.h,
        dir,
        this.order,
        errOrder,
      );
      results[dir] = solver.solve();
    }
    return results;
  }
}

// Alias export
export const Diff = NumericalDiff;

