export class GaussJordan {
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
    const totalCols = this.A[0].length;
    this.steps = [];

    // Forward and Backward Elimination (Gauss-Jordan)
    for (let i = 0; i < n; i++) {
      // Partial pivoting
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

      // Normalize pivot row to 1
      const pivot = this.A[i][i];
      if (Math.abs(pivot - 1) > 1e-12) {
        this.steps.push(`R_{${i + 1}} \\to R_{${i + 1}} / (${Number(pivot.toFixed(4))})`);
        for (let j = 0; j < totalCols; j++) {
          this.A[i][j] /= pivot;
        }
        this.steps.push(this.matrixToLatex());
      }

      // Eliminate all other rows in this column
      for (let j = 0; j < n; j++) {
        if (j !== i && Math.abs(this.A[j][i]) > 1e-12) {
          const factor = this.A[j][i];
          this.steps.push(
            `R_{${j + 1}} \\to R_{${j + 1}} - (${Number(factor.toFixed(4))})R_{${i + 1}}`,
          );
          for (let k = 0; k < totalCols; k++) {
            this.A[j][k] -= factor * this.A[i][k];
          }
          this.steps.push(this.matrixToLatex());
        }
      }
    }

    // Extract solution from the last column
    this.x = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      this.x[i] = Number(this.A[i][totalCols - 1].toFixed(6));
    }

    return {
      solutions: this.x,
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

// Alias export for backward compatibility
export const GausJordan = GaussJordan;
