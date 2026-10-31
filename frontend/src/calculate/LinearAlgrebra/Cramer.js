import { det } from "mathjs";

export class Cramer {
  constructor(A, b) {
    this.A = A.map((row) => row.map((v) => (Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v))));
    this.b = b.map((v) => (Number.isNaN(parseFloat(v)) ? 0 : parseFloat(v)));
  }

  solve() {
    const n = this.A.length;
    const rawDetA = det(this.A);

    if (Math.abs(rawDetA) < 1e-12) {
      throw new Error("det(A) = 0 → System has no unique solution");
    }

    const detA = Math.abs(rawDetA) < 1e-12 ? 0 : Number(rawDetA.toFixed(6));
    let solutions = [];
    let steps = [];
    let subResults = [];

    steps.push(`\\det(A) = ${detA}`);

    for (let i = 0; i < n; i++) {
      let Ai = this.A.map((row) => [...row]);
      for (let j = 0; j < n; j++) {
        Ai[j][i] = this.b[j];
      }

      const rawDetAi = det(Ai);
      const detAi = Math.abs(rawDetAi) < 1e-12 ? 0 : Number(rawDetAi.toFixed(6));
      const xi = rawDetAi / rawDetA;

      subResults.push({
        index: i + 1,
        matrix: Ai,
        detAi,
        xi,
      });

      steps.push(`\\det(A_${i + 1}) = ${detAi}`);
      steps.push(
        `x_{${i + 1}} = \\frac{\\det(A_${i + 1})}{\\det(A)} = \\frac{${detAi}}{${detA}} = ${Number(xi.toFixed(6))}`,
      );

      solutions.push(xi);
    }

    return { detA, solutions, steps, subResults };
  }
}
