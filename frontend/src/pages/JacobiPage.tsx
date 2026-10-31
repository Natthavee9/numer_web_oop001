import { useState } from "react"
import { Shuffle, Plus, Minus } from "lucide-react"
import { Jacobi } from "@/calculate/LinearAlgrebra/Jacobi.js"
import { Chart1 } from "@/components/method/chart1"
import { getRandomJacobiProblem } from "@/lib/equationPresets"

interface JacobiHistoryRow {
  iteration: number
  x: number[]
  error: number[]
  maxError: number
  root: number
}

interface JacobiResult {
  solutions: number[]
  iterations: number
  history: JacobiHistoryRow[]
}

export default function JacobiPage() {
  const [size, setSize] = useState<number>(3)
  const [sizeInput, setSizeInput] = useState<string>("3")
  const [matrixA, setMatrixA] = useState<string[][]>([
    ["5", "-2", "1"],
    ["-1", "-7", "2"],
    ["2", "2", "8"],
  ])
  const [vectorB, setVectorB] = useState<string[]>(["-4", "-17", "8"])
  const [initialX, setInitialX] = useState<string[]>(["0", "0", "0"])
  const [tolerance, setTolerance] = useState<string>("0.000001")

  const [result, setResult] = useState<JacobiResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const applySize = (newSize: number) => {
    const clamped = Math.max(2, Math.min(newSize, 10))
    setSize(clamped)
    setSizeInput(clamped.toString())

    const newA: string[][] = Array.from({ length: clamped }, (_, r) =>
      Array.from({ length: clamped }, (_, c) => (matrixA[r]?.[c] !== undefined ? matrixA[r][c] : "0")),
    )
    setMatrixA(newA)

    const newB: string[] = Array.from({ length: clamped }, (_, r) =>
      vectorB[r] !== undefined ? vectorB[r] : "0",
    )
    setVectorB(newB)

    const newInit: string[] = Array.from({ length: clamped }, (_, r) =>
      initialX[r] !== undefined ? initialX[r] : "0",
    )
    setInitialX(newInit)

    setResult(null)
    setErrorMsg("")
  }

  const handleSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSizeInput(val)
    const parsed = parseInt(val, 10)
    if (!Number.isNaN(parsed) && parsed >= 2 && parsed <= 10) {
      applySize(parsed)
    }
  }

  const handleSizeInputBlur = () => {
    const parsed = parseInt(sizeInput, 10)
    if (Number.isNaN(parsed) || parsed < 2) {
      applySize(2)
    } else if (parsed > 10) {
      applySize(10)
    } else {
      applySize(parsed)
    }
  }

  const handleCellChange = (r: number, c: number, val: string) => {
    const updated = matrixA.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell)),
    )
    setMatrixA(updated)
  }

  const handleBChange = (r: number, val: string) => {
    const updated = vectorB.map((cell, ri) => (ri === r ? val : cell))
    setVectorB(updated)
  }

  const handleInitXChange = (idx: number, val: string) => {
    const updated = initialX.map((cell, i) => (i === idx ? val : cell))
    setInitialX(updated)
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setErrorMsg("")

      const numA = matrixA.map((row) =>
        row.map((v) => {
          const num = parseFloat(v)
          if (Number.isNaN(num)) throw new Error("Please enter valid numbers in all matrix cells")
          return num
        }),
      )

      const numB = vectorB.map((v) => {
        const num = parseFloat(v)
        if (Number.isNaN(num)) throw new Error("Please enter valid numbers in vector B")
        return num
      })

      const numX = initialX.map((v) => {
        const num = parseFloat(v)
        return Number.isNaN(num) ? 0 : num
      })

      const tol = parseFloat(tolerance)
      if (Number.isNaN(tol) || tol <= 0) {
        throw new Error("Tolerance must be a positive number")
      }

      const solver = new Jacobi(numA, numB, numX, tol)
      const res = solver.solve()
      setResult(res as unknown as JacobiResult)
    } catch (err: any) {
      setResult(null)
      setErrorMsg(err.message || "An error occurred during calculation")
    }
  }

  const handleRandom = () => {
    const problem = getRandomJacobiProblem(size)
    setSize(problem.size)
    setSizeInput(problem.size.toString())
    const strA = problem.A.map((row) => row.map((v) => v.toString()))
    const strB = problem.b.map((v) => v.toString())
    setMatrixA(strA)
    setVectorB(strB)
    setInitialX(Array(problem.size).fill("0"))
    setResult(null)
    setErrorMsg("")
  }

  // Format chart history for Chart1 component
  const chartHistory = (result?.history || []).map((h) => ({
    iteration: h.iteration,
    root: h.root,
    error: h.maxError,
    fx: 0,
  }))

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      {/* Header */}
      <div className="border-b border-base-300 pb-4">
        <h1 className="text-3xl font-bold">Jacobi Iteration</h1>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="card border border-base-300 bg-base-100 p-6 shadow-sm">
        {/* Controls: Matrix Size */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-base-300 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold">Matrix Size (N × N):</label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => applySize(size - 1)}
                disabled={size <= 2}
                className="btn btn-sm btn-outline btn-square"
                title="Decrease size"
              >
                <Minus className="size-4" />
              </button>
              <input
                type="number"
                min="2"
                max="10"
                value={sizeInput}
                onChange={handleSizeInputChange}
                onBlur={handleSizeInputBlur}
                className="input input-bordered input-sm w-16 text-center font-mono font-bold"
              />
              <button
                type="button"
                onClick={() => applySize(size + 1)}
                disabled={size >= 10}
                className="btn btn-sm btn-outline btn-square"
                title="Increase size"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Matrix Grid: [ A | B ] */}
        <div className="overflow-x-auto">
          <table className="table table-sm text-center">
            <thead>
              <tr>
                <th className="w-10">Row</th>
                {Array.from({ length: size }, (_, i) => (
                  <th key={`col-${i}`} className="min-w-20">
                    x_{i + 1}
                  </th>
                ))}
                <th className="w-4 border-l border-base-300 text-center font-bold">|</th>
                <th className="min-w-20">Constant (B)</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: size }, (_, r) => (
                <tr key={`row-${r}`}>
                  <td className="font-mono text-xs text-base-content/60">R{r + 1}</td>
                  {Array.from({ length: size }, (_, c) => (
                    <td key={`cell-${r}-${c}`}>
                      <input
                        type="number"
                        step="any"
                        value={matrixA[r]?.[c] ?? ""}
                        onChange={(e) => handleCellChange(r, c, e.target.value)}
                        className={`input input-bordered input-sm w-full text-center font-mono ${
                          r === c ? "font-bold text-primary border-primary/40 bg-primary/5" : ""
                        }`}
                        required
                      />
                    </td>
                  ))}
                  <td className="border-l border-base-300 text-center font-bold">|</td>
                  <td>
                    <input
                      type="number"
                      step="any"
                      value={vectorB[r] ?? ""}
                      onChange={(e) => handleBChange(r, e.target.value)}
                      className="input input-bordered input-sm w-full text-center font-mono font-semibold text-primary"
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Iteration Parameters: Initial Guess and Error Threshold */}
        <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg border border-base-200 bg-base-200/30 p-4 sm:grid-cols-2">
          {/* Initial Guess */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-base-content/70">
              Initial Guess (X₀)
            </label>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: size }, (_, i) => (
                <div key={`init-x-${i}`} className="flex items-center gap-1">
                  <span className="text-xs text-base-content/60">x_{i + 1}:</span>
                  <input
                    type="number"
                    step="any"
                    value={initialX[i] ?? "0"}
                    onChange={(e) => handleInitXChange(i, e.target.value)}
                    className="input input-bordered input-xs w-16 text-center font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Error Tolerance */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-base-content/70">
              Error Threshold (&epsilon;)
            </label>
            <input
              type="number"
              step="any"
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value)}
              className="input input-bordered input-sm w-full font-mono max-w-xs"
              placeholder="0.000001"
              required
            />
          </div>
        </div>

        {errorMsg && (
          <div className="alert alert-error mt-4 py-2 text-sm">
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleRandom}
            className="btn btn-outline gap-2"
          >
            <Shuffle className="size-4" />
            Random
          </button>
          <button type="submit" className="btn btn-primary px-6">
            Calculate
          </button>
        </div>
      </form>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Final Solutions Card */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-base-content/80">Final Solutions</h2>
                <p className="mt-1 text-xs text-base-content/70">
                  Converged in <span className="font-semibold text-primary">{result.iterations}</span> iterations
                  (Final Max Error: <span className="font-semibold font-mono">{result.history[result.history.length - 1]?.maxError ?? 0}</span>)
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {result.solutions.map((val, idx) => (
                <div
                  key={`sol-${idx}`}
                  className="rounded-xl border border-base-300 bg-base-200/40 p-4 text-center"
                >
                  <div className="text-xs font-semibold text-base-content/60">
                    x_{idx + 1}
                  </div>
                  <div className="mt-1 font-mono text-lg font-bold text-primary">
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Convergence Chart */}
          {chartHistory.length > 0 && (
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-base-content/80">Error Convergence Plot</h2>
              <Chart1 history={chartHistory} title="Jacobi Error Convergence" />
            </div>
          )}

          {/* Iteration Table */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-base-content/80">Iteration History</h2>
            <div className="overflow-x-auto">
              <table className="table table-sm table-zebra">
                <thead>
                  <tr className="bg-base-200">
                    <th className="w-16 text-center">Iter</th>
                    {Array.from({ length: size }, (_, i) => (
                      <th key={`th-x-${i}`} className="text-right">
                        x_{i + 1}
                      </th>
                    ))}
                    <th className="text-right">Max Error</th>
                  </tr>
                </thead>
                <tbody>
                  {result.history.map((row) => (
                    <tr key={`iter-${row.iteration}`}>
                      <td className="text-center font-mono font-medium">{row.iteration}</td>
                      {row.x.map((val, xi) => (
                        <td key={`val-${row.iteration}-${xi}`} className="text-right font-mono">
                          {val}
                        </td>
                      ))}
                      <td className="text-right font-mono text-xs text-base-content/80">
                        {row.maxError.toExponential(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

