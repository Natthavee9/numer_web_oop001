export class GaussElimination {
  constructor(A, b) {
    if (b !== undefined) {
      this.A = A.map((row, i) => [
        ...row.map((v) => (Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v))),
        Number.isNaN(parseFloat(b[i])) ? 0 : parseFloat(b[i]),
      ]);
    } else {
      this.A = A.map((row) =>
        row.map((v) => (Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v))),
      );
    }
    this.steps = [];
    this.x = [];
  }

  solve() {
    const n = this.A.length;
    this.steps = [];

    // Forward Elimination with Partial Pivoting
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(this.A[k][i]) > Math.abs(this.A[maxRow][i])) {
          maxRow = k;
        }
      }

      if (Math.abs(this.A[maxRow][i]) < 1e-12) {
        throw new Error("Matrix is singular or has no unique solution");
      }

      if (maxRow !== i) {
        [this.A[i], this.A[maxRow]] = [this.A[maxRow], this.A[i]];
        this.steps.push(`R_{${i + 1}} \\leftrightarrow R_{${maxRow + 1}}`);
        this.steps.push(this.matrixToLatex());
      }

      for (let j = i + 1; j < n; j++) {
        if (Math.abs(this.A[j][i]) < 1e-12) continue;
        const factor = this.A[j][i] / this.A[i][i];
        this.steps.push(
          `R_{${j + 1}} \\to R_{${j + 1}} - (${Number(factor.toFixed(4))})R_{${i + 1}}`,
        );
        for (let k = i; k <= n; k++) {
          this.A[j][k] -= factor * this.A[i][k];
        }
        this.steps.push(this.matrixToLatex());
      }
    }

    // Back Substitution
    this.x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = this.A[i][n];
      for (let j = i + 1; j < n; j++) {
        sum -= this.A[i][j] * this.x[j];
      }
      this.x[i] = sum / this.A[i][i];
    }

    return {
      solutions: this.x.map((val) => Number(val.toFixed(6))),
      steps: this.steps,
      finalMatrix: this.A.map((row) => row.map((v) => Number(v.toFixed(4)))),
    };
  }

  matrixToLatex() {
    const rows = this.A.map((row) =>
      row.map((val) => Number(val.toFixed(3))).join(" & "),
    );
    return `\\begin{bmatrix}${rows.join("\\\\")}\\end{bmatrix}`;
  }
}
