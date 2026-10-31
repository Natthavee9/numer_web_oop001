export class Jacobi {
  constructor(A, B, X, et = 0.000001) {
    this.A = A.map((row) =>
      row.map((v) => (Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v))),
    );
    this.B = B.map((v) => (Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v)));
    this.X = X && X.length === A.length
      ? X.map((v) => (Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v)))
      : new Array(A.length).fill(0);
    this.et = parseFloat(et) || 0.000001;
    this.history = [];
  }

  solve() {
    const n = this.A.length;

    // Check diagonal elements
    for (let i = 0; i < n; i++) {
      if (Math.abs(this.A[i][i]) < 1e-12) {
        throw new Error(
          `Diagonal element A[${i + 1}][${i + 1}] is zero. Jacobi method requires non-zero diagonal entries.`,
        );
      }
    }

    let x0 = [...this.X];
    let x1 = Array(n).fill(0);
    let error = Array(n).fill(1);
    let iter = 1;
    const maxIter = 500;
    this.history = [];

    do {
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            sum += this.A[i][j] * x0[j];
          }
        }
        x1[i] = (this.B[i] - sum) / this.A[i][i];
      }

      for (let i = 0; i < n; i++) {
        error[i] =
          Math.abs(x1[i]) > 1e-12
            ? Math.abs((x1[i] - x0[i]) / x1[i])
            : Math.abs(x1[i] - x0[i]);
      }

      const maxError = Math.max(...error);

      if (!isFinite(maxError) || Number.isNaN(maxError)) {
        throw new Error(
          "Jacobi iteration diverged. The matrix may not be diagonally dominant.",
        );
      }

      this.history.push({
        iteration: iter,
        x: x1.map((v) => Number(v.toFixed(6))),
        error: error.map((v) => Number(v.toFixed(6))),
        maxError: Number(maxError.toFixed(6)),
        root: Number(x1[0].toFixed(6)),
      });

      if (maxError < this.et || iter >= maxIter) {
        break;
      }

      x0 = [...x1];
      iter++;
    } while (true);

    return {
      solutions: x1.map((v) => Number(v.toFixed(6))),
      iterations: iter,
      history: this.history,
    };
  }
}
