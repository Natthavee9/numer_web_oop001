import { identity, det } from "mathjs";

export class MatrixInversion {
  constructor(A, B) {
    this.A = A.map((row) => [...row]);
    this.B = Array.isArray(B[0]) ? B.map((row) => row[0]) : [...B]; // รับทั้ง vector matrix
    this.steps = [];
    this.I = identity(A.length).toArray();
    this.x = [];
    this.inverse = null;
  }

  solve() {
    const n = this.A.length;
    const d = det(this.A);
    if (Math.abs(d) < 1e-12) {
      throw new Error("Matrix is singular, cannot invert");
    }

    // Forward elimination
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(this.A[i][i]) < 1e-12) {
          // Handle potential division by zero
          continue;
        }
        const factor = this.A[j][i] / this.A[i][i];
        this.steps.push(
          `R_{${j + 1}} \\to R_{${j + 1}} - (${factor.toFixed(3)})R_{${i + 1}}`,
        );
        for (let k = 0; k < n; k++) {
          this.A[j][k] -= factor * this.A[i][k];
          this.I[j][k] -= factor * this.I[i][k];
        }
      }
    }

    // Backward elimination
    for (let i = n - 1; i >= 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (Math.abs(this.A[i][i]) < 1e-12) {
          continue;
        }
        const factor = this.A[j][i] / this.A[i][i];
        this.steps.push(
          `R_{${j + 1}} \\to R_{${j + 1}} - (${factor.toFixed(3)})R_{${i + 1}}`,
        );
        for (let k = 0; k < n; k++) {
          this.A[j][k] -= factor * this.A[i][k];
          this.I[j][k] -= factor * this.I[i][k];
        }
      }
    }

    // Normalize rows and store inverse
    // Normalize rows and store inverse
    for (let i = 0; i < n; i++) {
      const factor = this.A[i][i];
      for (let j = 0; j < n; j++) {
        this.A[i][j] /= factor;
        this.I[i][j] /= factor;
      }
    }

    // ตอนนี้ this.I คือ inverse matrix
    this.inverse = this.I.map((row) => [...row]); // copy matrix

    // Calculate x using the inverse
    this.x = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += this.inverse[i][j] * this.B[j];
      }
      this.x[i] = sum;
    }

    return { solutions: this.x, steps: this.steps, inverse: this.inverse };
  }

  matrixToLatex(mat) {
    return `\\begin{bmatrix}${mat.map((row) => row.map((val) => val.toFixed(3)).join(" & ")).join("\\\\")}\\end{bmatrix}`;
  }

  inverseToLatex() {
    if (!this.inverse) return "";
    return this.matrixToLatex(this.inverse);
  }
}
