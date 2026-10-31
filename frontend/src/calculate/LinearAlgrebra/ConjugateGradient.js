export class ConjugateGradient {
  constructor(A, B, X, et = 0.000001) {
    this.A = A.map((row) =>
      row.map((v) => (Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v))),
    );
    this.B = (Array.isArray(B[0]) ? B.map((row) => row[0]) : [...B]).map((v) =>
      Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v),
    );
    this.X = X && X.length === A.length
      ? X.map((v) => (Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v)))
      : new Array(A.length).fill(0);
    this.et = parseFloat(et) || 0.000001;
    this.history = [];
  }

  solve() {
    const n = this.A.length;

    // Check symmetry: A[i][j] must equal A[j][i]
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(this.A[i][j] - this.A[j][i]) > 1e-6) {
          throw new Error(
            `Matrix must be symmetric (A = Aᵀ). Found A[${i + 1}][${j + 1}] (${this.A[i][j]}) ≠ A[${j + 1}][${i + 1}] (${this.A[j][i]}).`,
          );
        }
      }
    }

    let x0 = [...this.X];
    let x1 = Array(n).fill(0);
    let r0 = Array(n).fill(0);
    let r1 = Array(n).fill(0);
    let d = Array(n).fill(0);
    let error = 1.0;
    let count = 0;
    const maxIter = 500;
    this.history = [];

    // Calculate initial residual (r0 = A*x0 - B) and search direction (d0 = -r0)
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += this.A[i][j] * x0[j];
      }
      r0[i] = sum - this.B[i];
      d[i] = -1 * r0[i];
    }

    // Initial residual norm
    let init_rr = 0;
    for (let i = 0; i < n; i++) {
      init_rr += r0[i] * r0[i];
    }
    if (Math.sqrt(init_rr) < this.et) {
      return {
        solutions: x0.map((v) => Number(v.toFixed(6))),
        iterations: 0,
        history: [],
      };
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

      if (Math.abs(bot_alpha) < 1e-15) {
        throw new Error(
          "Division by zero in alpha calculation: dᵀAd is zero. The matrix must be symmetric positive-definite.",
        );
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

      count++;

      this.history.push({
        iteration: count,
        x: x1.map((v) => Number(v.toFixed(6))),
        error: Number(error.toFixed(6)),
        root: Number(x1[0].toFixed(6)),
        alpha: Number(alpha.toFixed(6)),
      });

      if (error <= this.et || count >= maxIter || Math.abs(bot_beta) < 1e-15) {
        x0 = [...x1];
        break;
      }

      const beta = top_beta / bot_beta;

      // Update search direction: d1 = -r1 + beta * d
      for (let i = 0; i < n; i++) {
        d[i] = -r1[i] + beta * d[i];
      }

      // Prepare variables for the next iteration
      x0 = [...x1];
      r0 = [...r1];
    } while (true);

    return {
      solutions: x0.map((v) => Number(v.toFixed(6))),
      iterations: count,
      history: this.history,
    };
  }
}
