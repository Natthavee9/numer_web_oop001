import { lup, lusolve, lsolve, det } from "mathjs";

export class LUDecomposition {
  constructor(A, B) {
    this.A = A.map((row) => [...row]);
    this.B = Array.isArray(B[0]) ? B.map((row) => row[0]) : [...B];
    this.steps = [];
    this.L = [];
    this.U = [];
    this.y = [];
    this.x = [];
  }

  solve() {
    const d = det(this.A);
    if (Math.abs(d) < 1e-12) {
      throw new Error("Matrix is singular, cannot solve");
    }

    // 1. Decompose A into L and U (including permutation vector p)
    const { L, U, p } = lup(this.A);
    this.L = Array.isArray(L) ? L : L.toArray();
    this.U = Array.isArray(U) ? U : U.toArray();

    this.steps.push(
      `L = ${this.matrixToLatex(this.L)}, \\quad U = ${this.matrixToLatex(this.U)}`,
    );

    // 2. Forward substitution: Solve Ly = PB
    const pb = p.map((idx) => this.B[idx]);
    const rawY = lsolve(this.L, pb);
    const yArr = Array.isArray(rawY) ? rawY : rawY.toArray();
    this.y = yArr.map((row) => (Array.isArray(row) ? row[0] : row));

    this.steps.push("\\text{Forward Substitution } (Ly = B):");
    this.y.forEach((val, i) => {
      this.steps.push(`y_{${i + 1}} = ${val.toFixed(3)}`);
    });

    // 3. Backward substitution: Solve for x in Ax = B using LU
    const rawX = lusolve({ L, U, p }, this.B);
    const xArr = Array.isArray(rawX) ? rawX : rawX.toArray();
    this.x = xArr.map((row) => (Array.isArray(row) ? row[0] : row));

    this.steps.push("\\text{Backward Substitution } (Ux = y):");
    this.x.forEach((val, i) => {
      this.steps.push(`x_{${i + 1}} = ${val.toFixed(3)}`);
    });

    return {
      solutions: this.x,
      steps: this.steps,
      L: this.L,
      U: this.U,
      y: this.y,
    };
  }

  matrixToLatex(mat) {
    return `\\begin{bmatrix}${mat.map((row) => row.map((val) => val.toFixed(3)).join(" & ")).join("\\\\")}\\end{bmatrix}`;
  }
}

