export class Lagrange {
  constructor(points, x) {
    this.points = [...points];
    this.x = x;
  }

  solve() {
    const n = this.points.length;
    const steps = [];
    const L_values = [];
    let ans = 0;

    // Compute each Lagrange basis polynomial L_i(x)
    for (let i = 0; i < n; i++) {
      let L_i_value = 1.0;

      let symbolic_numerator = "";
      let symbolic_denominator = "";
      let value_numerator = "";
      let value_denominator = "";

      for (let j = 0; j < n; j++) {
        if (j !== i) {
          // Symbolic terms
          symbolic_numerator += `(x - x_{${j}})`;
          symbolic_denominator += `(x_{${i}} - x_{${j}})`;

          // Substituted numeric terms
          value_numerator += `(${this.x} - ${this.points[j].x})`;
          value_denominator += `(${this.points[i].x} - ${this.points[j].x})`;

          // Evaluate L_i(x)
          L_i_value *=
            (this.x - this.points[j].x) / (this.points[i].x - this.points[j].x);
        }
      }
      L_values.push(L_i_value);

      // Format LaTeX step for L_i
      const step_string = `L_{${i}} = \\frac{${symbolic_numerator}}{${symbolic_denominator}} = \\frac{${value_numerator}}{${value_denominator}} = ${L_i_value.toFixed(7)}`;
      steps.push(step_string);
    }

    // Compute interpolated value f(x) = sum(L_i(x) * y_i)
    let symbolic_sum = L_values.map((_, i) => `L_{${i}}f(x_{${i}})`).join(
      " + ",
    );
    let value_sum = L_values.map(
      (val, i) => `(${val.toFixed(7)})(${this.points[i].y})`,
    ).join(" + ");

    ans = L_values.reduce((sum, val, i) => sum + val * this.points[i].y, 0);

    // Format final LaTeX steps
    steps.push(`f(${this.x}) = ${symbolic_sum}`);
    steps.push(`= ${value_sum}`);
    steps.push(`= ${ans.toFixed(7)}`);

    return { result: ans, steps: steps };
  }
}