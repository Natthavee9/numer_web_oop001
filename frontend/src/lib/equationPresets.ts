import { det } from "mathjs"

export interface RootEquationPreset {
  fx: string
  xl: string
  xr: string
  err?: string
}

export interface OnePointPreset {
  gx: string
  x0: string
  err?: string
}

export interface NewtonRaphsonPreset {
  fx: string
  x0: string
  err?: string
}

export interface LinearSystemPreset {
  size: number
  A: number[][]
  b: number[]
}

export const rootEquationPresets: RootEquationPreset[] = [
  { fx: "x^4 - 13", xl: "1.5", xr: "2.0", err: "0.000001" },
  { fx: "43*x - 180", xl: "0", xr: "10", err: "0.000001" },
  { fx: "x^3 - x - 2", xl: "1", xr: "2", err: "0.000001" },
  { fx: "2*x^3 - 4*x - 13", xl: "2.0", xr: "3.0", err: "0.000001" },
  { fx: "x^2 - 7", xl: "2.0", xr: "3.0", err: "0.000001" },
  { fx: "e^x - 3*x", xl: "0", xr: "1.0", err: "0.000001" },
  { fx: "x^3 - 2*x^2 - 5", xl: "2.0", xr: "3.0", err: "0.000001" },
  { fx: "x^3 - 9*x + 1", xl: "2.5", xr: "3.0", err: "0.000001" },
  { fx: "cos(x) - x", xl: "0", xr: "1.0", err: "0.000001" },
  { fx: "x^2 - 4*x + 1", xl: "0", xr: "1.0", err: "0.000001" },
  { fx: "3*x + sin(x) - e^x", xl: "0", xr: "1.0", err: "0.000001" },
  { fx: "x^3 + 4*x^2 - 10", xl: "1.0", xr: "2.0", err: "0.000001" },
  { fx: "e^(-x) - x", xl: "0", xr: "1.0", err: "0.000001" },
  { fx: "x^2 - 2*x - 3", xl: "2.0", xr: "4.0", err: "0.000001" },
  { fx: "x^4 - x - 10", xl: "1.5", xr: "2.0", err: "0.000001" },
]

export const onePointPresets: OnePointPreset[] = [
  { gx: "cos(x)", x0: "0.5", err: "0.000001" },
  { gx: "e^(-x)", x0: "0.5", err: "0.000001" },
  { gx: "e^x / 3", x0: "0", err: "0.000001" },
  { gx: "sqrt(2*x + 3)", x0: "1.0", err: "0.000001" },
  { gx: "(x + 2)^(1/3)", x0: "1.0", err: "0.000001" },
  { gx: "((4*x + 13)/2)^(1/3)", x0: "2.0", err: "0.000001" },
  { gx: "sqrt((10 - x^3)/4)", x0: "1.5", err: "0.000001" },
  { gx: "1 / (x + 1)", x0: "0.5", err: "0.000001" },
  { gx: "0.5 * cos(x)", x0: "0.5", err: "0.000001" },
  { gx: "(x^2 + 7) / (2*x)", x0: "2.5", err: "0.000001" },
]

export const newtonRaphsonPresets: NewtonRaphsonPreset[] = [
  { fx: "x^4 - 13", x0: "2.0", err: "0.000001" },
  { fx: "43*x - 180", x0: "4.0", err: "0.000001" },
  { fx: "x^3 - x - 2", x0: "1.5", err: "0.000001" },
  { fx: "2*x^3 - 4*x - 13", x0: "2.5", err: "0.000001" },
  { fx: "x^2 - 7", x0: "2.0", err: "0.000001" },
  { fx: "e^x - 3*x", x0: "0.5", err: "0.000001" },
  { fx: "x^3 - 2*x^2 - 5", x0: "2.5", err: "0.000001" },
  { fx: "x^3 - 9*x + 1", x0: "2.5", err: "0.000001" },
  { fx: "cos(x) - x", x0: "0.5", err: "0.000001" },
  { fx: "x^2 - 4*x + 1", x0: "0.5", err: "0.000001" },
  { fx: "3*x + sin(x) - e^x", x0: "0.5", err: "0.000001" },
  { fx: "x^3 + 4*x^2 - 10", x0: "1.5", err: "0.000001" },
  { fx: "e^(-x) - x", x0: "0.5", err: "0.000001" },
  { fx: "x^2 - 2*x - 3", x0: "2.5", err: "0.000001" },
  { fx: "x^4 - x - 10", x0: "1.8", err: "0.000001" },
]

/**
 * Returns a random root of equation problem different from the current formula
 */
export function getRandomRootProblem(currentFx?: string): RootEquationPreset {
  const filtered = rootEquationPresets.filter((p) => p.fx !== currentFx)
  const pool = filtered.length > 0 ? filtered : rootEquationPresets
  const index = Math.floor(Math.random() * pool.length)
  return pool[index]
}

/**
 * Returns a random one-point iteration problem different from the current formula
 */
export function getRandomOnePointProblem(currentGx?: string): OnePointPreset {
  const filtered = onePointPresets.filter((p) => p.gx !== currentGx)
  const pool = filtered.length > 0 ? filtered : onePointPresets
  const index = Math.floor(Math.random() * pool.length)
  return pool[index]
}

/**
 * Returns a random Newton-Raphson problem different from the current formula
 */
export function getRandomNewtonProblem(currentFx?: string): NewtonRaphsonPreset {
  const filtered = newtonRaphsonPresets.filter((p) => p.fx !== currentFx)
  const pool = filtered.length > 0 ? filtered : newtonRaphsonPresets
  const index = Math.floor(Math.random() * pool.length)
  return pool[index]
}

/**
 * Returns a random Secant problem different from the current formula
 */
export function getRandomSecantProblem(currentFx?: string): RootEquationPreset {
  return getRandomRootProblem(currentFx)
}

export const jacobiPresets: LinearSystemPreset[] = [
  {
    size: 3,
    A: [
      [5, -2, 1],
      [-1, -7, 2],
      [2, 2, 8],
    ],
    b: [-4, -17, 8],
  },
  {
    size: 3,
    A: [
      [4, -1, 1],
      [4, -8, 1],
      [-2, 1, 5],
    ],
    b: [7, -21, 15],
  },
  {
    size: 4,
    A: [
      [10, -1, 2, 0],
      [-1, 11, -1, 3],
      [2, -1, 10, -1],
      [0, 3, -1, 8],
    ],
    b: [6, 25, -11, 15],
  },
  {
    size: 2,
    A: [
      [5, 1],
      [2, 4],
    ],
    b: [11, 14],
  },
]

/**
 * Returns a random Jacobi problem (guaranteed diagonally dominant)
 */
export function getRandomJacobiProblem(size: number = 3): LinearSystemPreset {
  const matching = jacobiPresets.filter((p) => p.size === size)
  if (matching.length > 0 && Math.random() < 0.6) {
    const idx = Math.floor(Math.random() * matching.length)
    return matching[idx]
  }

  // Generate diagonally dominant system
  const A: number[][] = []
  for (let i = 0; i < size; i++) {
    const row: number[] = []
    let offDiagSum = 0
    for (let j = 0; j < size; j++) {
      if (i === j) {
        row.push(0) // placeholder
      } else {
        const val = Math.floor(Math.random() * 5) - 2
        row.push(val)
        offDiagSum += Math.abs(val)
      }
    }
    // Set diagonal to strictly greater than sum of off-diagonal
    const diag = offDiagSum + Math.floor(Math.random() * 4) + 2
    row[i] = Math.random() < 0.5 ? diag : -diag
    A.push(row)
  }
  const x = Array.from({ length: size }, () => Math.floor(Math.random() * 7) - 3)
  const b = A.map((row) => row.reduce((sum, val, idx) => sum + val * x[idx], 0))
  return { size, A, b }
}

export const conjugateGradientPresets: LinearSystemPreset[] = [
  {
    size: 3,
    A: [
      [5, -2, 1],
      [-2, 6, -1],
      [1, -1, 4],
    ],
    b: [4, 3, 4],
  },
  {
    size: 3,
    A: [
      [4, 1, 1],
      [1, 4, 1],
      [1, 1, 4],
    ],
    b: [6, 6, 6],
  },
  {
    size: 2,
    A: [
      [5, 2],
      [2, 4],
    ],
    b: [9, 8],
  },
  {
    size: 4,
    A: [
      [6, 1, -1, 0],
      [1, 5, 1, -1],
      [-1, 1, 6, 1],
      [0, -1, 1, 5],
    ],
    b: [6, 6, 7, 5],
  },
]

/**
 * Returns a random Conjugate Gradient problem (symmetric positive-definite)
 */
export function getRandomConjugateGradientProblem(size: number = 3): LinearSystemPreset {
  const matching = conjugateGradientPresets.filter((p) => p.size === size)
  if (matching.length > 0 && Math.random() < 0.6) {
    const idx = Math.floor(Math.random() * matching.length)
    return matching[idx]
  }

  // Generate symmetric strictly diagonally dominant system (guaranteed positive-definite)
  const A: number[][] = Array.from({ length: size }, () => Array(size).fill(0))
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      const val = Math.floor(Math.random() * 5) - 2
      A[i][j] = val
      A[j][i] = val
    }
  }

  for (let i = 0; i < size; i++) {
    let offDiagSum = 0
    for (let j = 0; j < size; j++) {
      if (i !== j) offDiagSum += Math.abs(A[i][j])
    }
    A[i][i] = offDiagSum + Math.floor(Math.random() * 3) + 2
  }

  const x = Array.from({ length: size }, () => Math.floor(Math.random() * 5) - 2)
  const b = A.map((row) => row.reduce((sum, val, idx) => sum + val * x[idx], 0))
  return { size, A, b }
}

export const cramerPresets: LinearSystemPreset[] = [
  {
    size: 3,
    A: [
      [-2, 3, 1],
      [3, 4, -5],
      [1, -2, 1],
    ],
    b: [9, 0, -4],
  },
  {
    size: 3,
    A: [
      [2, -1, 3],
      [1, 1, 1],
      [1, -1, 1],
    ],
    b: [5, 6, 2],
  },
  {
    size: 3,
    A: [
      [4, -2, 1],
      [-2, 4, -2],
      [1, -2, 4],
    ],
    b: [11, -16, 17],
  },
  {
    size: 2,
    A: [
      [3, 2],
      [1, -1],
    ],
    b: [18, 1],
  },
  {
    size: 2,
    A: [
      [4, 3],
      [2, -5],
    ],
    b: [10, 18],
  },
  {
    size: 4,
    A: [
      [1, 1, 0, 1],
      [2, 1, -1, 1],
      [4, -1, 5, -2],
      [1, -1, -1, 2],
    ],
    b: [2, 1, 0, -3],
  },
]

/**
 * Generates or picks a solvable linear system for any given matrix dimension N
 */
export function getRandomCramerProblem(size: number = 3, currentA?: number[][]): LinearSystemPreset {
  // Check if we have matching presets of the same size
  const matching = cramerPresets.filter(
    (p) => p.size === size && JSON.stringify(p.A) !== JSON.stringify(currentA),
  )

  if (matching.length > 0 && Math.random() < 0.6) {
    const idx = Math.floor(Math.random() * matching.length)
    return matching[idx]
  }

  // Dynamically generate an invertible matrix with integer solutions
  for (let attempt = 0; attempt < 80; attempt++) {
    const A = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Math.floor(Math.random() * 9) - 4),
    )
    const d = det(A)
    if (Math.abs(d) > 0.5) {
      const x = Array.from({ length: size }, () => Math.floor(Math.random() * 7) - 3)
      const b = A.map((row) => row.reduce((sum, val, idx) => sum + val * x[idx], 0))
      return { size, A, b }
    }
  }

  // Fallback preset
  return cramerPresets[0]
}

export interface InterpolationPoint {
  x: string
  y: string
}

export interface InterpolationPreset {
  points: InterpolationPoint[]
  targetX: string
}

export const interpolationPresets: InterpolationPreset[] = [
  {
    points: [
      { x: "10", y: "2.3026" },
      { x: "15", y: "2.7081" },
      { x: "20", y: "2.9957" },
    ],
    targetX: "16",
  },
  {
    points: [
      { x: "0", y: "0" },
      { x: "10", y: "227.04" },
      { x: "15", y: "362.78" },
      { x: "20", y: "517.35" },
      { x: "22.5", y: "602.97" },
      { x: "30", y: "901.67" },
    ],
    targetX: "16",
  },
  {
    points: [
      { x: "2", y: "9.5" },
      { x: "4", y: "8.0" },
      { x: "6", y: "10.5" },
      { x: "8", y: "39.5" },
      { x: "10", y: "72.5" },
    ],
    targetX: "4.5",
  },
  {
    points: [
      { x: "1", y: "1.0" },
      { x: "2", y: "8.0" },
      { x: "3", y: "27.0" },
      { x: "4", y: "64.0" },
      { x: "5", y: "125.0" },
    ],
    targetX: "2.5",
  },
  {
    points: [
      { x: "0", y: "1.0" },
      { x: "1", y: "2.7183" },
      { x: "2", y: "7.3891" },
      { x: "3", y: "20.0855" },
    ],
    targetX: "1.5",
  },
]

export function getRandomInterpolationProblem(): InterpolationPreset {
  const index = Math.floor(Math.random() * interpolationPresets.length)
  return interpolationPresets[index]
}

export interface IntegrationPreset {
  fx: string
  a: string
  b: string
  n?: string
}

export const integrationPresets: IntegrationPreset[] = [
  { fx: "x^7 + 2*x^3 - 1", a: "0", b: "1", n: "4" },
  { fx: "4*x^5 - 3*x^4 + x^3 - 6*x + 2", a: "1", b: "2", n: "4" },
  { fx: "1 / (1 + x^2)", a: "0", b: "1", n: "6" },
  { fx: "e^x", a: "0", b: "1", n: "4" },
  { fx: "sin(x)", a: "0", b: "3.14159", n: "6" },
  { fx: "x^2 + 2*x + 1", a: "0", b: "2", n: "4" },
  { fx: "sqrt(1 + x^2)", a: "0", b: "2", n: "4" },
  { fx: "x * e^x", a: "0", b: "1", n: "4" },
  { fx: "cos(x)", a: "0", b: "1.5708", n: "4" },
]

export function getRandomIntegrationProblem(currentFx?: string): IntegrationPreset {
  const filtered = integrationPresets.filter((p) => p.fx !== currentFx)
  const pool = filtered.length > 0 ? filtered : integrationPresets
  const index = Math.floor(Math.random() * pool.length)
  return pool[index]
}

export interface RegressionPreset {
  points: { x: string; y: string }[]
  targetX: string
  order?: string
}

export const regressionPresets: RegressionPreset[] = [
  {
    points: [
      { x: "10", y: "106" },
      { x: "15", y: "159" },
      { x: "20", y: "212" },
      { x: "25", y: "265" },
      { x: "30", y: "318" },
    ],
    targetX: "16",
    order: "1",
  },
  {
    points: [
      { x: "1", y: "2.1" },
      { x: "2", y: "7.9" },
      { x: "3", y: "18.2" },
      { x: "4", y: "31.9" },
      { x: "5", y: "50.1" },
    ],
    targetX: "2.5",
    order: "2",
  },
  {
    points: [
      { x: "10", y: "25" },
      { x: "20", y: "70" },
      { x: "30", y: "380" },
      { x: "40", y: "550" },
      { x: "50", y: "610" },
      { x: "60", y: "1220" },
      { x: "70", y: "830" },
      { x: "80", y: "1450" },
    ],
    targetX: "45",
    order: "2",
  },
  {
    points: [
      { x: "1", y: "1" },
      { x: "2", y: "1.5" },
      { x: "3", y: "2" },
      { x: "4", y: "3" },
      { x: "5", y: "4" },
      { x: "6", y: "5" },
      { x: "7", y: "8" },
      { x: "8", y: "10" },
      { x: "9", y: "13" },
    ],
    targetX: "6.5",
    order: "2",
  },
]

export function getRandomRegressionProblem(): RegressionPreset {
  const index = Math.floor(Math.random() * regressionPresets.length)
  return regressionPresets[index]
}

