export class Cholesky {
  constructor(A, B) {
    this.origA = A.map((row) =>
      row.map((v) => (Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v))),
    );
    this.origB = (Array.isArray(B[0]) ? B.map((row) => row[0]) : [...B]).map(
      (v) => (Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v)),
    );
    this.n = this.origA.length;

    this.At = Array.from({ length: this.n }, () => Array(this.n).fill(0)); // A^T
    this.NA = Array.from({ length: this.n }, () => Array(this.n).fill(0)); // A^T * A
    this.Nb = Array(this.n).fill(0); // A^T * B
    this.L = Array.from({ length: this.n }, () => Array(this.n).fill(0));
    this.LT = Array.from({ length: this.n }, () => Array(this.n).fill(0));
    this.x = Array(this.n).fill(0);
    this.y = Array(this.n).fill(0);
    this.yback = [];
    this.xback = [];
  }

  solve() {
    const n = this.n;
    this.yback = [];
    this.xback = [];

    // --- Step 1: Calculate A^T ---
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        this.At[j][i] = this.origA[i][j];
      }
    }

    // --- Step 2: Calculate NA = A^T * A ---
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += this.At[i][k] * this.origA[k][j];
        }
        this.NA[i][j] = sum;
      }
    }

    // --- Step 3: Calculate Nb = A^T * B ---
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += this.At[i][j] * this.origB[j];
      }
      this.Nb[i] = sum;
    }

    // --- Step 4: Cholesky Decomposition (NA = L * L^T) ---
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;
        for (let k = 0; k < j; k++) {
          sum += this.L[i][k] * this.L[j][k];
        }
        if (i === j) {
          const numSqrt = this.NA[i][i] - sum;
          if (numSqrt <= 0) {
            throw new Error("Matrix is singular or not positive-definite.");
          }
          this.L[i][j] = Math.sqrt(numSqrt);
        } else {
          this.L[i][j] = (this.NA[i][j] - sum) / this.L[j][j];
        }
      }
    }

    // Build L^T (LT)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        this.LT[i][j] = this.L[j][i];
      }
    }

    // --- Step 5: Forward substitution (L y = Nb) ---
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += this.L[i][j] * this.y[j];
      }
      this.y[i] = (this.Nb[i] - sum) / this.L[i][i];
      this.yback.push(
        `y_{${i + 1}} = \\frac{${this.Nb[i].toFixed(3)} - ${sum.toFixed(3)}}{${this.L[i][i].toFixed(3)}} = ${this.y[i].toFixed(3)}`,
      );
    }

    // --- Step 6: Backward substitution (L^T x = y) ---
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += this.LT[i][j] * this.x[j];
      }
      this.x[i] = (this.y[i] - sum) / this.LT[i][i];
      this.xback.push(
        `x_{${i + 1}} = \\frac{${this.y[i].toFixed(3)} - ${sum.toFixed(3)}}{${this.LT[i][i].toFixed(3)}} = ${this.x[i].toFixed(3)}`,
      );
    }

    return {
      solutions: this.x.map((v) => Number(v.toFixed(6))),
      x: this.x.map((v) => Number(v.toFixed(6))),
      y: this.y.map((v) => Number(v.toFixed(6))),
      L: this.L,
      LT: this.LT,
      At: this.At,
      NA: this.NA,
      Nb: this.Nb,
      yback: this.yback,
      xback: this.xback,
    };
  }

  static matrixToLatex(mat) {
    if (!mat || mat.length === 0) return "";
    return `\\begin{bmatrix}${mat
      .map((row) =>
        row
          .map((val) =>
            typeof val === "number" ? Number(val.toFixed(3)) : val,
          )
          .join(" & "),
      )
      .join("\\\\")}\\end{bmatrix}`;
  }
}
