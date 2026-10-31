import { identity, det } from "mathjs";

export class MatrixInversion {
  constructor(A, B) {
    this.A = A.map((row) =>
      row.map((v) => (Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v))),
    );
    this.B = B
      ? (Array.isArray(B[0]) ? B.map((row) => row[0]) : [...B]).map((v) =>
          Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v),
        )
      : [];
    this.steps = [];
    this.I = identity(this.A.length).toArray();
    this.x = [];
    this.inverse = null;
  }

  solve() {
    const n = this.A.length;
    const d = det(this.A);
    if (Math.abs(d) < 1e-12) {
      throw new Error("Matrix is singular (det = 0), cannot invert");
    }

    this.steps = [];

    // Gauss-Jordan elimination on [A | I]
    for (let i = 0; i < n; i++) {
      // Partial pivoting
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(this.A[k][i]) > Math.abs(this.A[maxRow][i])) {
          maxRow = k;
        }
      }

      if (maxRow !== i) {
        [this.A[i], this.A[maxRow]] = [this.A[maxRow], this.A[i]];
        [this.I[i], this.I[maxRow]] = [this.I[maxRow], this.I[i]];
        this.steps.push(`R_{${i + 1}} \\leftrightarrow R_{${maxRow + 1}}`);
      }

      const pivot = this.A[i][i];
      if (Math.abs(pivot - 1) > 1e-12) {
        this.steps.push(`R_{${i + 1}} \\to R_{${i + 1}} / (${Number(pivot.toFixed(4))})`);
        for (let j = 0; j < n; j++) {
          this.A[i][j] /= pivot;
          this.I[i][j] /= pivot;
        }
      }

      for (let j = 0; j < n; j++) {
        if (j !== i && Math.abs(this.A[j][i]) > 1e-12) {
          const factor = this.A[j][i];
          this.steps.push(
            `R_{${j + 1}} \\to R_{${j + 1}} - (${Number(factor.toFixed(4))})R_{${i + 1}}`,
          );
          for (let k = 0; k < n; k++) {
            this.A[j][k] -= factor * this.A[i][k];
            this.I[j][k] -= factor * this.I[i][k];
          }
        }
      }
    }

    // this.I is now the inverse matrix
    this.inverse = this.I.map((row) => row.map((v) => Number(v.toFixed(6))));

    // Calculate x = A^(-1) * B
    this.x = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += this.inverse[i][j] * (this.B[j] || 0);
      }
      this.x[i] = Number(sum.toFixed(6));
    }

    return {
      solutions: this.x,
      inverse: this.inverse,
      steps: this.steps,
    };
  }
}
