// src/lib/methods.ts
export interface MethodItem {
  title: string
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
      { title: "Graphical Method" },
      { title: "Bisection Method" },
      { title: "False Position Method" },
      { title: "One-Point Iteration" },
      { title: "Newton-Raphson Method" },
      { title: "Secant Method" },
    ],
  },
  {
    category: "linear-algebra",
    label: "Linear Algebra",
    methods: [
      { title: "Cramer's Rule" },
      { title: "Gauss Elimination" },
      { title: "Gauss-Jordan" },
      { title: "Matrix Inversion" },
      { title: "LU Decomposition" },
      { title: "Jacobi Iteration" },
      { title: "Conjugate Gradient" },
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