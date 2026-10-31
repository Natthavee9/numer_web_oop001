import { useState } from "react"
import { Shuffle, Plus, Minus } from "lucide-react"
import { Cholesky } from "@/calculate/LinearAlgrebra/Cholesky.js"
import { MathView } from "@/components/ui/MathView"
import { getRandomCramerProblem } from "@/lib/equationPresets"

interface CholeskyResult {
  solutions: number[]
  x: number[]
  y: number[]
  L: number[][]
  LT: number[][]
  At: number[][]
  NA: number[][]
  Nb: number[]
  yback: string[]
  xback: string[]
}

export default function CholeskyPage() {
  const [size, setSize] = useState<number>(3)
  const [sizeInput, setSizeInput] = useState<string>("3")
  const [matrixA, setMatrixA] = useState<string[][]>([
    ["4", "-2", "1"],
    ["-2", "4", "-2"],
    ["1", "-2", "4"],
  ])
  const [vectorB, setVectorB] = useState<string[]>(["11", "-16", "17"])

  const [result, setResult] = useState<CholeskyResult | null>(null)
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

      const solver = new Cholesky(numA, numB)
      const res = solver.solve()
      setResult(res as unknown as CholeskyResult)
    } catch (err: any) {
      setResult(null)
      setErrorMsg(err.message || "An error occurred during calculation")
    }
  }

  const handleRandom = () => {
    const currentNumA = matrixA.map((r) => r.map((c) => parseFloat(c) || 0))
    const preset = getRandomCramerProblem(size, currentNumA)
    setSize(preset.size)
    setSizeInput(preset.size.toString())
    setMatrixA(preset.A.map((r) => r.map((c) => c.toString())))
    setVectorB(preset.b.map((c) => c.toString()))
    setResult(null)
    setErrorMsg("")
  }

  const formatMatrixToLatex = (mat: number[][]) => {
    if (!mat || mat.length === 0) return ""
    return `\\begin{bmatrix}${mat
      .map((row) =>
        row.map((v) => Number(Number(v).toFixed(4))).join(" & "),
      )
      .join("\\\\")}\\end{bmatrix}`
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      {/* Header */}
      <div className="border-b border-base-300 pb-4">
        <h1 className="text-3xl font-bold">Cholesky Decomposition</h1>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="card border border-base-300 bg-base-100 p-6 shadow-sm">
        {/* Flexible Dimension Controller */}
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
                        className="input input-bordered input-sm w-full text-center font-mono"
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
          {/* Solutions Card */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-base-content/80">Final Solutions</h2>
            <div className="grid gap-3 sm:grid-cols-3">
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

          {/* L and L^T Decomposition Matrices */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Lower Triangular Matrix L */}
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-base-content/80">Lower Triangular Matrix (L)</h2>
              <div className="flex justify-center overflow-x-auto py-2">
                <MathView equation={`L = ${formatMatrixToLatex(result.L)}`} />
              </div>
            </div>

            {/* Transpose Matrix L^T */}
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-base-content/80">Transpose Matrix (L^T)</h2>
              <div className="flex justify-center overflow-x-auto py-2">
                <MathView equation={`L^T = ${formatMatrixToLatex(result.LT)}`} />
              </div>
            </div>
          </div>

          {/* Intermediate Vector y: L y = Nb */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-base-content/80">Intermediate Vector (y from L y = A^T b)</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {result.y.map((val, idx) => (
                <div
                  key={`y-${idx}`}
                  className="rounded-xl border border-base-300 bg-base-200/40 p-3 text-center"
                >
                  <div className="text-xs font-semibold text-base-content/60">
                    y_{idx + 1}
                  </div>
                  <div className="mt-1 font-mono text-base font-bold text-secondary">
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forward Substitution Steps */}
          {result.yback && result.yback.length > 0 && (
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-base-content/80">Forward Substitution Steps (L y = A^T b)</h2>
              <div className="space-y-2">
                {result.yback.map((step, idx) => (
                  <div key={`yback-${idx}`} className="rounded-lg bg-base-200/40 p-3">
                    <MathView equation={step} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Backward Substitution Steps */}
          {result.xback && result.xback.length > 0 && (
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-base-content/80">Backward Substitution Steps (L^T x = y)</h2>
              <div className="space-y-2">
                {result.xback.map((step, idx) => (
                  <div key={`xback-${idx}`} className="rounded-lg bg-base-200/40 p-3">
                    <MathView equation={step} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

