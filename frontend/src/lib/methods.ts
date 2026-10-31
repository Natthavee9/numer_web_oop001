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
      { title: "Jacobi Iteration", path: "/jacobi" },
      { title: "Conjugate Gradient", path: "/conjugate-gradient" },
    ],
  },
  {
    category: "interpolation",
    label: "Interpolation",
    methods: [
      { title: "Newton's Divided-Differences" },
      { title: "Lagrange Interpolation" },
      { title: "Spline Interpolation" },
    ],
  },
  {
    category: "integration",
    label: "Integration",
    methods: [
      { title: "Trapezoidal Rule" },
      { title: "Composite Trapezoidal Rule" },
      { title: "Simpson's Rule" },
      { title: "Composite Simpson's Rule" },
    ],
  },
]
