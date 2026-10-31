// src/lib/methods.ts
export interface MethodItem {
  title: string
  path?: string
}

export interface MethodGroup {
  category: string
  label: string
  methods: MethodItem[]
}

export const methodGroups: MethodGroup[] = [
  {
    category: "root-of-equation",
    label: "Root of Equation",
    methods: [
      { title: "Graphical Method", path: "/graphical" },
      { title: "Bisection Method", path: "/bisection" },
      { title: "False Position Method", path: "/false-position" },
      { title: "One-Point Iteration", path: "/one-point-iteration" },
      { title: "Newton-Raphson Method", path: "/newton-raphson" },
      { title: "Secant Method", path: "/secant" },
    ],
  },
  {
    category: "linear-algebra",
    label: "Linear Algebra",
    methods: [
      { title: "Cramer's Rule", path: "/cramer" },
      { title: "Gauss Elimination", path: "/gauss-elimination" },
      { title: "Gauss-Jordan", path: "/gauss-jordan" },
      { title: "Matrix Inversion", path: "/matrix-inversion" },
      { title: "LU Decomposition", path: "/lu-decomposition" },
      { title: "Cholesky Decomposition", path: "/cholesky" },
      { title: "Jacobi Iteration", path: "/jacobi" },
      { title: "Conjugate Gradient", path: "/conjugate-gradient" },
    ],
  },
  {
    category: "interpolation",
    label: "Interpolation",
    methods: [
      { title: "Newton's Divided-Differences", path: "/newton-divided" },
      { title: "Lagrange Interpolation", path: "/lagrange" },
      { title: "Spline Interpolation", path: "/spline" },
    ],
  },
  {
    category: "extrapolation",
    label: "Extrapolation",
    methods: [
      { title: "Regression", path: "/regression" },
      { title: "Polynomial Regression", path: "/polynomial-regression" },
    ],
  },
  {
    category: "differentiation",
    label: "Differentiation",
    methods: [
      { title: "Forward Divided-Differences", path: "/diff-forward" },
      { title: "Backward Divided-Differences", path: "/diff-backward" },
      { title: "Central Divided-Differences", path: "/diff-central" },
    ],
  },
  {
    category: "integration",
    label: "Integration",
    methods: [
      { title: "Trapezoidal Rule", path: "/trapezoidal" },
      { title: "Composite Trapezoidal Rule", path: "/composite-trapezoidal" },
      { title: "Simpson's Rule", path: "/simpson" },
      { title: "Composite Simpson's Rule", path: "/composite-simpson" },
    ],
  },
]
