export class Spline {
  constructor(points) {
    
    this.points = [...points].sort((a, b) => a.x - b.x);
    this.n = this.points.length;
  }

  // Dispatch interpolation based on the selected spline degree
  solve(xValue, type) {
    switch (type) {
      case "linear":
        return this._solveLinear(xValue);
      case "quadratic":
        return this._solveQuadratic(xValue);
      case "cubic":
        return this._solveCubic(xValue);
      default:
        throw new Error("Invalid spline type specified.");
    }
  }

  // Linear Spline: Connect adjacent points with straight line segments
  _solveLinear(xValue) {
    if (this.n < 2) {
      throw new Error("Linear Spline requires at least 2 points.");
    }
    const steps = [];

    // Build linear equation S_i(x) for each interval
    for (let i = 0; i < this.n - 1; i++) {
      const p0 = this.points[i];
      const p1 = this.points[i + 1];
      const slope = (p1.y - p0.y) / (p1.x - p0.x);
      const intercept = p0.y - slope * p0.x;
      const sign = intercept >= 0 ? "+" : "-";
      const slopeInterceptForm = `${slope.toFixed(4)}x ${sign} ${Math.abs(intercept).toFixed(4)}`;
      const equation = `S_{${i}}(x) = ${p0.y.toFixed(4)} + ${slope.toFixed(4)}(x - ${p0.x}) = ${slopeInterceptForm}`;
      steps.push(equation);
    }

    // Locate target interval and evaluate S_i(xValue)
    const i = this._findInterval(xValue);
    const p0 = this.points[i];
    const p1 = this.points[i + 1];

    const result = p0.y + ((p1.y - p0.y) / (p1.x - p0.x)) * (xValue - p0.x);

    const finalCalcStep = `f(${xValue}) \\approx S_{${i}}(${xValue}) = ${p0.y.toFixed(4)} + \\frac{${p1.y.toFixed(4)} - ${p0.y.toFixed(4)}}{${p1.x} - ${p0.x}}(${xValue} - ${p0.x})`;
    steps.push(finalCalcStep);

    return { result, steps };
  }

  // Quadratic Spline: Piecewise 2nd-degree polynomials S_i(x) = a_i + b_i(x - x_i) + c_i(x - x_i)^2
  _solveQuadratic(xValue) {
    if (this.n < 3) {
      throw new Error("Quadratic Spline requires at least 3 points.");
    }

    const steps = [];
    const n = this.n;

    const points = this.points;
    const a = new Array(n - 1);
    const b = new Array(n - 1);
    const c = new Array(n - 1);
    const z = new Array(n);
    const h = new Array(n - 1);

    // Compute interval widths h_i = x_{i+1} - x_i
    for (let i = 0; i < n - 1; i++) {
      h[i] = points[i + 1].x - points[i].x;
    }

    // Assume zero initial slope condition (z_0 = 0) and solve for first derivatives z_i
    z[0] = 0;
    steps.push(`z_0 = 0`);

    for (let i = 0; i < n - 1; i++) {
      z[i + 1] = -z[i] + (2 * (points[i + 1].y - points[i].y)) / h[i];
      steps.push(
        `z_{${i + 1}} = -z_{${i}} + \\frac{2(${points[i + 1].y} - ${points[i].y})}{${h[i].toFixed(4)}} = ${z[i + 1].toFixed(7)}`,
      );
    }

    // Compute quadratic coefficients a_i, b_i, c_i for each interval
    for (let i = 0; i < n - 1; i++) {
      a[i] = points[i].y;
      b[i] = z[i];
      c[i] = (z[i + 1] - z[i]) / (2 * h[i]);
      let subbedEquation = `S_{${i}}(x) = ${a[i].toFixed(4)} ${b[i] >= 0 ? "+" : ""} ${b[i].toFixed(4)}(x - ${points[i].x}) ${c[i] >= 0 ? "+" : ""} ${c[i].toFixed(4)}(x - ${points[i].x})^2`;
      steps.push(subbedEquation);
    }

    // Locate target interval and evaluate S_i(xValue)
    const i = this._findInterval(xValue);
    const dx = xValue - points[i].x;
    const result = a[i] + b[i] * dx + c[i] * dx * dx;

    let finalCalc = `f(${xValue}) \\approx S_{${i}}(${xValue}) = ${a[i].toFixed(4)} ${b[i] >= 0 ? "+" : ""} ${b[i].toFixed(4)}(${xValue} - ${points[i].x}) ${c[i] >= 0 ? "+" : ""} ${c[i].toFixed(4)}(${xValue} - ${points[i].x})^2`;
    steps.push(finalCalc);

    return { result, steps };
  }

  // Natural Cubic Spline: Piecewise 3rd-degree polynomials S_i(x) = a_i + b_i(dx) + c_i(dx)^2 + d_i(dx)^3
  _solveCubic(xValue) {
    if (this.n < 2) {
      throw new Error("Cubic Spline requires at least 2 points.");
    }
    const steps = [];
    const n = this.n;
    const a = this.points.map((p) => p.y);
    const h = new Array(n - 1);

    // Compute interval widths h_i = x_{i+1} - x_i
    for (let i = 0; i < n - 1; i++)
      h[i] = this.points[i + 1].x - this.points[i].x;

    // Set up right-hand side vector alpha for the tridiagonal system
    const alpha = new Array(n - 1);
    for (let i = 1; i < n - 1; i++) {
      alpha[i] =
        (3 / h[i]) * (a[i + 1] - a[i]) - (3 / h[i - 1]) * (a[i] - a[i - 1]);
    }

    const l = new Array(n).fill(1);
    const mu = new Array(n).fill(0);
    const z = new Array(n).fill(0);
    const c = new Array(n).fill(0);
    const b = new Array(n - 1).fill(0);
    const d = new Array(n - 1).fill(0);

    // Apply natural boundary condition at the left endpoint
    l[0] = 1;
    mu[0] = 0;
    z[0] = 0;

    // Forward sweep of the tridiagonal matrix algorithm (Thomas algorithm)
    for (let i = 1; i < n - 1; i++) {
      l[i] =
        2 * (this.points[i + 1].x - this.points[i - 1].x) -
        h[i - 1] * mu[i - 1];
      mu[i] = h[i] / l[i];
      z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
    }

    // Apply natural boundary condition at the right endpoint
    l[n - 1] = 1;
    z[n - 1] = 0;
    c[n - 1] = 0;

    // Back substitution to find coefficients c_j, b_j, and d_j
    for (let j = n - 2; j >= 0; j--) {
      c[j] = z[j] - mu[j] * c[j + 1];
      b[j] = (a[j + 1] - a[j]) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3;
      d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
    }

    // Format cubic polynomial equations for each interval
    for (let i = 0; i < n - 1; i++) {
      steps.push(
        `S_{${i}}(x) = ${a[i].toFixed(4)} ${b[i] >= 0 ? "+" : ""} ${b[i].toFixed(4)}
        (x - ${this.points[i].x}) ${c[i] >= 0 ? "+" : ""} ${c[i].toFixed(4)}(x - ${this.points[i].x})^2 ${d[i] >= 0 ? "+" : ""} ${d[i].toFixed(4)}(x - ${this.points[i].x})^3`,
      );
    }

    // Locate target interval and evaluate S_i(xValue)
    const i = this._findInterval(xValue);
    const dx = xValue - this.points[i].x;
    const result =
      a[i] + b[i] * dx + c[i] * Math.pow(dx, 2) + d[i] * Math.pow(dx, 3);

    steps.push(`f(${xValue}) \\approx S_{${i}}(${xValue})`);

    return { result, steps };
  }

  // Find the index i of the interval [x_i, x_{i+1}] containing xValue
  _findInterval(xValue) {
    if (xValue < this.points[0].x) {
      return 0;
    }
    if (xValue >= this.points[this.n - 1].x) {
      return this.n - 2;
    }

    let i = 0;
    while (i < this.n - 2 && xValue > this.points[i + 1].x) {
      i++;
    }
    return i;
  }
}
