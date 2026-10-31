import { lup, lusolve, lsolve, det } from "mathjs";

export class LUDecomposition {
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
    this.L = [];
    this.U = [];
    this.y = [];
    this.x = [];
  }

  solve() {
    const d = det(this.A);
    if (Math.abs(d) < 1e-12) {
      throw new Error("Matrix is singular (det = 0), cannot solve using LU");
    }

    this.steps = [];

    // 1. Decompose A into L and U (with permutation vector p)
    const { L, U, p } = lup(this.A);
    this.L = (Array.isArray(L) ? L : L.toArray()).map((row) =>
      row.map((v) => Number(v.toFixed(4))),
    );
    this.U = (Array.isArray(U) ? U : U.toArray()).map((row) =>
      row.map((v) => Number(v.toFixed(4))),
    );

    // 2. Forward substitution: Solve Ly = PB
    const pb = p.map((idx) => this.B[idx]);
    const rawY = lsolve(this.L, pb);
    const yArr = Array.isArray(rawY) ? rawY : rawY.toArray();
    this.y = yArr.map((row) =>
      Number((Array.isArray(row) ? row[0] : row).toFixed(6)),
    );

    // 3. Backward substitution: Solve Ux = y
    const rawX = lusolve({ L, U, p }, this.B);
    const xArr = Array.isArray(rawX) ? rawX : rawX.toArray();
    this.x = xArr.map((row) =>
      Number((Array.isArray(row) ? row[0] : row).toFixed(6)),
    );

    return {
      solutions: this.x,
      L: this.L,
      U: this.U,
      y: this.y,
      steps: this.steps,
    };
  }

  matrixToLatex(mat) {
    return `\\begin{bmatrix}${mat.map((row) => row.map((val) => Number(val.toFixed(3))).join(" & ")).join("\\\\")}\\end{bmatrix}`;
  }
}
