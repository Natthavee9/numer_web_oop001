export class GaussElimination {
  constructor(A) {
    this.A = A.map((row) => [...row]);
    this.steps = [];
    this.x = [];
  }

  solve() {
    const n = this.A.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const factor = this.A[j][i] / this.A[i][i];
        this.steps.push(
          `R_{${j + 1}} \\to R_{${j + 1}} - (${factor.toFixed(3)})R_{${i + 1}}`,
        );
        for (let k = i; k <= n; k++) {
          this.A[j][k] -= factor * this.A[i][k];
        }
      }
      this.steps.push(this.matrixToLatex());
    }

    this.steps.push("\\text{Back Substitution}");

    this.x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = this.A[i][n];
      for (let j = i + 1; j < n; j++) {
        sum -= this.A[i][j] * this.x[j];
      }
      this.x[i] = sum / this.A[i][i];
      this.steps.push(
        `x_{${i + 1}} = \\frac{${sum.toFixed(3)}}{${this.A[i][i].toFixed(
          3,
        )}} = ${this.x[i].toFixed(3)}`,
      );
    }

    return { solutions: this.x, steps: this.steps };
  }

  matrixToLatex() {
    let rows = this.A.map((row) =>
      row.map((val) => val.toFixed(3)).join(" & "),
    );
    return `\\begin{bmatrix}${rows.join("\\\\")}\\end{bmatrix}`;
  }
}
