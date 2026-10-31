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
