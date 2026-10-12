import { det } from "mathjs";

export class Cramer {
  constructor(A, b) {
    this.A = A;
    this.b = b;
  }

  solve() {
    const n = this.A.length;
    const detA = det(this.A);

    if (detA === 0) {
      throw new Error("det(A) = 0 → No unique solution");
    }

    let solutions = [];
    let steps = [];

    steps.push(`\\det(A) = ${detA}`);

    for (let i = 0; i < n; i++) {
      let Ai = this.A.map((row, j) => [...row]);
      for (let j = 0; j < n; j++) {
        Ai[j][i] = this.b[j];
      }

      const detAi = det(Ai);

      steps.push(`\\det(A_${i + 1}) = ${detAi}`);
      steps.push(
        `x_{${i + 1}} = \\frac{\\det(A_${i + 1})}{\\det(A)} = \\frac{${detAi}}{${detA}} = ${detAi / detA}`,
      );

      solutions.push(detAi / detA);
    }

    return { solutions, steps };
  }
}
