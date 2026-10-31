export class PolynomialRegression {
  /**
   * Constructs a PolynomialRegression solver instance.
   *
   * @param {Array<{x: number, y: number}>} points - Data points used for regression fitting.
   * @param {number} x - Target x value to evaluate/predict after fitting.
   * @param {number} order - Degree of the polynomial (e.g. 1 for linear, 2 for quadratic, etc.).
   */
  constructor(points, x, order) {
    this.points = [...points];
    this.x = x;
    this.order = order;
    this.n = points.length;
  }

  /**
   * Formats a 2D numerical matrix into a LaTeX bmatrix string for display.
   *
   * @param {number[][]} mat - 2D matrix of numbers.
   * @returns {string} LaTeX matrix string.
   */
  matrixToLatex(mat) {
    return `\\begin{bmatrix}${mat
      .map((row) => row.map((val) => val.toFixed(2)).join(" & "))
      .join("\\\\")}\\end{bmatrix}`;
  }

  /**
   * Fits a polynomial of degree `m` to the data points and evaluates at target `x`.
   *
   * Mathematical Model:
   *   f(x) = a₀ + a₁x + a₂x² + ... + aₘxᵐ
   *
   * Normal Equations System:
   *   [ n       ∑x      ∑x²    ...  ∑xᵐ   ] [ a₀ ]   [ ∑y     ]
   *   [ ∑x      ∑x²     ∑x³    ...  ∑xᵐ⁺¹ ] [ a₁ ] = [ ∑yx    ]
   *   [ ...     ...     ...    ...  ...   ] [ .. ]   [ ...    ]
   *   [ ∑xᵐ     ∑xᵐ⁺¹   ∑xᵐ⁺²  ...  ∑x²ᵐ  ] [ aₘ ]   [ ∑yxᵐ   ]
   *
   * Solves the (m + 1) × (m + 2) augmented system via Gauss-Jordan elimination with partial pivoting.
   *
   * @returns {{ result: number, steps: string[], coefficients: number[] }}
   *   - result: Evaluated value f(x)
   *   - steps: Array of LaTeX step-by-step strings for display
   *   - coefficients: Solved polynomial coefficients [a₀, a₁, ..., aₘ]
   */
  solve() {
    if (this.n <= this.order) {
      throw new Error(
        "Number of points must be greater than the polynomial order.",
      );
    }

    const steps = [];
    const m = this.order + 1; // Dimension of the square coefficient matrix

    // --- Step 1: Accumulate Power Sums of X and Y ---
    // sumX stores ∑ xᵏ for k = 0, 1, ..., 2m
    // sumY stores ∑ (y * xᵏ) for k = 0, 1, ..., m
    const sumX = new Array(2 * this.order + 1).fill(0);
    const sumY = new Array(this.order + 1).fill(0);

    for (const p of this.points) {
      for (let i = 0; i < sumX.length; i++) {
        sumX[i] += Math.pow(p.x, i);
      }
      for (let i = 0; i < sumY.length; i++) {
        sumY[i] += p.y * Math.pow(p.x, i);
      }
    }
    steps.push(`\\text{Calculated Sums: } \\sum x^k, \\sum yx^k`);
    steps.push(`\\text{---}`);

    // --- Step 2: Build the Normal Equations Augmented Matrix [A | B] ---
    // Entry A[i][j] = ∑ x^(i + j), and RHS vector B[i] = ∑ (y * x^i)
    let augMatrix = Array.from({ length: m }, () => new Array(m + 1).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        augMatrix[i][j] = sumX[i + j];
      }
      augMatrix[i][m] = sumY[i];
    }

    steps.push(`\\text{Augmented Matrix [A|B]:}`);
    steps.push(this.matrixToLatex(augMatrix));

    // --- Step 3: Solve via Gauss-Jordan Elimination with Partial Pivoting ---
    for (let i = 0; i < m; i++) {
      // Find pivot row with maximum absolute value in current column
      let pivotRow = i;
      for (let k = i + 1; k < m; k++) {
        if (Math.abs(augMatrix[k][i]) > Math.abs(augMatrix[pivotRow][i])) {
          pivotRow = k;
        }
      }
      [augMatrix[i], augMatrix[pivotRow]] = [augMatrix[pivotRow], augMatrix[i]];

      // Check for singularity
      const pivot = augMatrix[i][i];
      if (Math.abs(pivot) < 1e-9) throw new Error("Matrix is singular.");

      // Normalize current pivot row so diagonal element equals 1
      for (let j = i; j <= m; j++) {
        augMatrix[i][j] /= pivot;
      }

      // Eliminate all other rows in this column
      for (let k = 0; k < m; k++) {
        if (k !== i) {
          const factor = augMatrix[k][i];
          for (let j = i; j <= m; j++) {
            augMatrix[k][j] -= factor * augMatrix[i][j];
          }
        }
      }
    }
    steps.push(`\\text{After Gauss-Jordan Elimination:}`);
    steps.push(this.matrixToLatex(augMatrix));
    steps.push(`\\text{---}`);

    // --- Step 4: Extract Coefficients and Format Polynomial Equation ---
    const coefficients = augMatrix.map((row) => row[m]);

    let equationStr = "f(x) = ";
    for (let i = 0; i < coefficients.length; i++) {
      const coeff = coefficients[i];
      if (Math.abs(coeff) < 1e-9) continue;

      const sign = coeff > 0 && i > 0 ? " + " : coeff < 0 ? " - " : "";
      const val = Math.abs(coeff).toFixed(4);

      if (i === 0) {
        equationStr += `${coeff.toFixed(4)}`;
      } else if (i === 1) {
        equationStr += `${sign}${val}x`;
      } else {
        equationStr += `${sign}${val}x^${i}`;
      }
    }
    steps.push(equationStr);

    // --- Step 5: Evaluate Polynomial at Target x: f(x) = ∑ aᵢ * xⁱ ---
    let result = 0;
    for (let i = 0; i < coefficients.length; i++) {
      result += coefficients[i] * Math.pow(this.x, i);
    }

    return { result, steps, coefficients };
  }
}
