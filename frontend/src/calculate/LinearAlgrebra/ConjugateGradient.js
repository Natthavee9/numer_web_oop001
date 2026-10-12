export class ConjugateGradient {
  constructor(A, B, X, et = 0.0001) {
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
    let r0 = Array(n).fill(0);
    let r1 = Array(n).fill(0);
    let d = Array(n).fill(0);
    let error = 1.0;
    let count = 0;
    const maxIter = 500;

    // Calculate initial residual (r0 = A*x0 - B) and search direction (d0 = -r0)
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += this.A[i][j] * x0[j];
      }
      r0[i] = sum - this.B[i];
      d[i] = -1 * r0[i];
    }

    do {
      // Calculate step size alpha = -(d^T * r0) / (d^T * A * d)
      let top_alpha = 0;
      for (let i = 0; i < n; i++) {
        top_alpha += d[i] * r0[i];
      }

      let Ad = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += this.A[i][k] * d[k];
        }
        Ad[i] = sum;
      }

      let bot_alpha = 0;
      for (let i = 0; i < n; i++) {
        bot_alpha += d[i] * Ad[i];
      }

      const alpha = -1 * (top_alpha / bot_alpha);

      // Update solution vector: x1 = x0 + alpha * d
      for (let i = 0; i < n; i++) {
        x1[i] = x0[i] + alpha * d[i];
      }

      // Update residual vector: r1 = r0 + alpha * A * d
      for (let i = 0; i < n; i++) {
        r1[i] = r0[i] + alpha * Ad[i];
      }

      // Calculate L2 norm of the residual for error check
      let rr_sum = 0;
      for (let i = 0; i < n; i++) {
        rr_sum += r1[i] * r1[i];
      }
      error = Math.sqrt(rr_sum);

      // Calculate conjugate factor: beta = (r1^T * r1) / (r0^T * r0)
      let top_beta = 0;
      for (let i = 0; i < n; i++) {
        top_beta += r1[i] * r1[i];
      }

      let bot_beta = 0;
      for (let i = 0; i < n; i++) {
        bot_beta += r0[i] * r0[i];
      }

      const beta = top_beta / bot_beta;

      // Update search direction: d1 = -r1 + beta * d
      for (let i = 0; i < n; i++) {
        d[i] = -r1[i] + beta * d[i];
      }

      // Prepare variables for the next iteration
      x0 = [...x1];
      r0 = [...r1];
      count++;

      this.history.push({
        iteration: count,
        x: [...x0],
        error: error,
      });
    } while (error > this.et && count < maxIter);

    const tableSteps = this.history.map((step) => ({
      iteration: step.iteration,
      x: step.x,
      // Format error as an array to match MatrixTable structure
      error: Array(n).fill(step.error),
    }));

    return { solutions: x0, steps: tableSteps };
  }
}
