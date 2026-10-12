export class GausJordan {
  constructor(A) {
    this.A = A.map((row) => [...row]); // augmented matrix
    this.steps = [];
    this.x = [];
  }

  solve() {
    const n = this.A.length;

    // Forward elimination
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const factor = this.A[j][i] / this.A[i][i];
        this.steps.push(
          `R_{${j + 1}} \\to R_{${j + 1}} - (${factor.toFixed(3)})R_{${i + 1}}`,
        );
        for (let k = i; k < this.A[0].length; k++) {
          this.A[j][k] -= factor * this.A[i][k];
        }
      }
      this.steps.push(this.matrixToLatex());
    }

    // Backward elimination
    for (let i = n - 1; i >= 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        const factor = this.A[j][i] / this.A[i][i];
        this.steps.push(
          `R_{${j + 1}} \\to R_{${j + 1}} - (${factor.toFixed(3)})R_{${i + 1}}`,
        );
        for (let k = i; k < this.A[0].length; k++) {
          this.A[j][k] -= factor * this.A[i][k];
        }
      }
      this.steps.push(this.matrixToLatex());
    }

    // Normalize rows
    for (let i = 0; i < n; i++) {
      const factor = this.A[i][i];
      this.steps.push(
        `R_{${i + 1}} \\to R_{${i + 1}} / (${factor.toFixed(3)})`,
      );
      for (let j = 0; j < this.A[0].length; j++) {
        this.A[i][j] /= factor;
      }
      this.steps.push(this.matrixToLatex());
    }

    // Extract solution
    this.x = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      this.x[i] = this.A[i][this.A[0].length - 1];
    }

    return { solutions: this.x, steps: this.steps };
  }

  matrixToLatex() {
    return `\\begin{bmatrix}${this.A.map((row) => row.map((val) => val.toFixed(3)).join(" & ")).join("\\\\")}\\end{bmatrix}`;
  }
}
