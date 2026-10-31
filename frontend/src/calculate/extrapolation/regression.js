/**
 * @file regression.js
 * Least Squares Regression Solver (Linear, Polynomial, and Multiple Linear Regression).
 */

export class Regression {
  /**
   * Converts a 2D numerical matrix into a formatted LaTeX bmatrix string.
   * @param {number[][]} mat - 2D numerical matrix to format.
   * @returns {string} LaTeX matrix string.
   */
  matrixToLatex(mat) {
    return `\\begin{bmatrix}${mat
      .map((row) => row.map((val) => val.toFixed(2)).join(" & "))
      .join("\\\\")}\\end{bmatrix}`;
  }

  /**
   * Solves linear, polynomial, or multiple linear regression using the Normal Equations:
   *   (XᵀX) a = Xᵀy
   *
   * Constructs the augmented system [XᵀX | Xᵀy] and applies Gauss-Jordan elimination
   * with partial pivoting to determine regression coefficients a = [a₀, a₁, ..., aₘ]ᵀ.
   *
   * @param {Array<{x: number[], y: number}>} points - Training data points.
   * @param {number[]} xToPredict - Values of independent variables to evaluate.
   * @param {"linear" | "polynomial" | "multilinear"} type - Type of regression model.
   * @param {number} [order=1] - Degree of the polynomial (when type is "polynomial").
   * @returns {{ result: number, steps: string[], coefficients: number[] }}
   *   - result: Predicted y value at xToPredict
   *   - steps: Array of LaTeX step-by-step strings for display
   *   - coefficients: Computed regression parameters [a₀, a₁, ...]
   */
  solve(points, xToPredict, type, order = 1) {
    let processedPoints = points;
    let processedXToPredict = xToPredict;
    let numVars = xToPredict.length;

    // --- 1. Data Feature Transformation & Preparation ---
    if (type === "polynomial") {
      numVars = order;
      // Transform scalar input x into polynomial feature basis [x, x², ..., x^order]
      processedPoints = points.map((p) => {
        const multiX = [];
        for (let i = 1; i <= order; i++) {
          multiX.push(Math.pow(p.x[0], i));
        }
        return { x: multiX, y: p.y };
      });
      // Transform target prediction point into polynomial powers
      processedXToPredict = [];
      for (let i = 1; i <= order; i++) {
        processedXToPredict.push(Math.pow(xToPredict[0], i));
      }
    }

    const n = processedPoints.length;
    if (n <= numVars) {
      throw new Error(
        "Number of data points must be greater than the number of variables/order.",
      );
    }

    const steps = [];
    const matrixSize = numVars + 1; // Size includes intercept a₀

    // --- 2. Build Normal Equations Augmented Matrix [XᵀX | XᵀY] ---
    let augMatrix = Array.from({ length: matrixSize }, () =>
      new Array(matrixSize + 1).fill(0),
    );
    for (let i = 0; i < n; i++) {
      const point = processedPoints[i];
      const x_values = [1, ...point.x]; // Augmented feature vector with intercept 1: [1, x₁, x₂, ...]
      const y_val = point.y;

      for (let row = 0; row < matrixSize; row++) {
        for (let col = 0; col < matrixSize; col++) {
          augMatrix[row][col] += x_values[row] * x_values[col];
        }
        augMatrix[row][matrixSize] += x_values[row] * y_val;
      }
    }
    steps.push(`\\text{Augmented Matrix [A|B]:}`);
    steps.push(this.matrixToLatex(augMatrix));

    // --- 3. Gauss-Jordan Elimination with Partial Pivoting ---
    for (let i = 0; i < matrixSize; i++) {
      // Find pivot row with maximum absolute value in current column
      let pivotRow = i;
      for (let k = i + 1; k < matrixSize; k++) {
        if (Math.abs(augMatrix[k][i]) > Math.abs(augMatrix[pivotRow][i]))
          pivotRow = k;
      }
      [augMatrix[i], augMatrix[pivotRow]] = [augMatrix[pivotRow], augMatrix[i]];

      const pivot = augMatrix[i][i];
      if (Math.abs(pivot) < 1e-9)
        throw new Error("Matrix is singular. Data may be linearly dependent.");

      // Normalize pivot row to make diagonal element 1
      for (let j = i; j <= matrixSize; j++) augMatrix[i][j] /= pivot;

      // Eliminate all other rows in the column to achieve reduced row echelon form (RREF)
      for (let k = 0; k < matrixSize; k++) {
        if (k !== i) {
          const factor = augMatrix[k][i];
          for (let j = i; j <= matrixSize; j++)
            augMatrix[k][j] -= factor * augMatrix[i][j];
        }
      }
    }
    steps.push(`\\text{After Gauss-Jordan Elimination:}`);
    steps.push(this.matrixToLatex(augMatrix));
    steps.push(`\\text{---}`);

    // --- 4. Extract Solution Coefficients and Format Regression Equation ---
    const coefficients = augMatrix.map((row) => row[matrixSize]);

    let equationStr = "f(x) = " + coefficients[0].toFixed(4);
    for (let i = 1; i < coefficients.length; i++) {
      const coeff = coefficients[i];
      const sign = coeff >= 0 ? " + " : " - ";
      const power = type === "polynomial" && i > 1 ? `^${i}` : "";
      const variable = type === "polynomial" ? "x" : `x_{${i}}`;
      equationStr += `${sign}${Math.abs(coeff).toFixed(4)}${variable}${power}`;
    }
    steps.push(equationStr);

    // --- 5. Evaluate and Predict Value: y_pred = a₀ + ∑(aᵢ * xᵢ) ---
    let result = coefficients[0];
    for (let i = 0; i < processedXToPredict.length; i++) {
      result += coefficients[i + 1] * processedXToPredict[i];
    }

    return { result, steps, coefficients };
  }
}
