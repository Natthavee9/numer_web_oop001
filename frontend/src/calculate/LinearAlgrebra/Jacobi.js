export class Jacobi {
  constructor(A, B, X, et) {
    this.A = A;
    this.B = B;
    this.X = X;
    this.et = et;
    this.history = [];
  }

  solve() {
    const n = this.A.length;
    let x0 = [...this.X];
    let x1 = Array(n).fill(0);
    let error = Array(n).fill(1);
    let iter = 1;
    const maxIter = 500;

    do {
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
          if (i != j) {
            sum += this.A[i][j] * x0[j];
          }
        }
        x1[i] = (this.B[i] - sum) / this.A[i][i];
      }

      for (let i = 0; i < n; i++) {
        error[i] = Math.abs((x1[i] - x0[i]) / (x1[i] || 1));
      }

      x0 = [...x1];

      this.history.push({
        iteration: iter,
        x: [...x0],
        error: [...error],
      });
      const maxError = Math.max(...error);
      if (maxError < this.et || iter >= maxIter) {
        break;
      }

      iter++;
    } while (true);

    return { solutions: x0, steps: this.history };
  }
}
