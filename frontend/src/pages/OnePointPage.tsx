import { useState } from "react"
import { Shuffle } from "lucide-react"
import { Onepoint } from "@/calculate/root_of_equation/OnePointIter.js"
import { MathView } from "@/components/ui/MathView"
import { Chart1 } from "@/components/method/chart1"
import { getRandomOnePointProblem } from "@/lib/equationPresets"

interface HistoryRow {
  iteration: number
  x: number
  xNext: number
  root: number
  fx: number
  error: number
}

interface OnePointResult {
  root: number
  error: number
  iterations: number
  history?: HistoryRow[]
}

export default function OnePointPage() {
  const [gx, setGx] = useState<string>("cos(x)")
  const [x0, setX0] = useState<string>("0.5")
  const [err, setErr] = useState<string>("0.000001")

  const [result, setResult] = useState<OnePointResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const handleCalculate = (x0Val: number, gxVal: string, errVal: number) => {
    try {
      setErrorMsg("")
      const solver = new Onepoint(x0Val, gxVal, errVal)
      const res = solver.solve()
      setResult(res as unknown as OnePointResult)
    } catch (e: any) {
      setResult(null)
      setErrorMsg(e.message || "An error occurred during calculation")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const x0Num = parseFloat(x0)
    const errNum = parseFloat(err)

    if (isNaN(x0Num) || isNaN(errNum)) {
      setErrorMsg("Please enter valid numeric values for X_0 and Error Threshold")
      return
    }

    handleCalculate(x0Num, gx, errNum)
  }

  const handleRandom = () => {
    const preset = getRandomOnePointProblem(gx)
    setGx(preset.gx)
    setX0(preset.x0)
    if (preset.err) setErr(preset.err)
    setErrorMsg("")
    setResult(null)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="border-b border-base-300 pb-4">
        <h1 className="text-3xl font-bold">One-Point Iteration Method</h1>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="card border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label text-sm font-semibold">g(x) [Iteration Function where x = g(x)]</label>
            <input
              type="text"
              value={gx}
              onChange={(e) => setGx(e.target.value)}
              placeholder="e.g. cos(x) or (x + 2)^(1/3)"
              className="input input-bordered w-full"
              required
            />
            {/* Real-time MathJax equation preview */}
            {gx && (
              <div className="mt-2 rounded-lg bg-base-200/50 p-2 text-center">
                <MathView equation={gx} label="x = g(x) = " className="text-lg font-medium" />
              </div>
            )}
          </div>

          <div>
            <label className="label text-sm font-semibold">X_0 (Initial Guess)</label>
            <input
              type="number"
              step="any"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              placeholder="0.5"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label text-sm font-semibold">Error Threshold</label>
            <input
              type="number"
              step="any"
              value={err}
              onChange={(e) => setErr(e.target.value)}
              placeholder="0.000001"
              className="input input-bordered w-full"
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
            Random โจทย์
          </button>
          <button type="submit" className="btn btn-primary px-6">
            Calculate
          </button>
        </div>
      </form>

      {/* Result Section */}
      {result && (
        <div className="space-y-6">
          <div className="rounded-xl border border-base-300 bg-base-100 p-4 text-center shadow-sm">
            <span className="text-xs text-base-content/60">Equation Solved</span>
            <MathView equation={gx} label="x = g(x) = " className="text-xl font-bold text-primary" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card border border-base-300 bg-base-100 p-4 shadow-sm">
              <span className="text-xs text-base-content/60">Estimated Root (x)</span>
              <span className="text-2xl font-bold text-primary">{result.root.toFixed(6)}</span>
            </div>
            <div className="card border border-base-300 bg-base-100 p-4 shadow-sm">
              <span className="text-xs text-base-content/60">Iterations</span>
              <span className="text-2xl font-bold">{result.iterations}</span>
            </div>
            <div className="card border border-base-300 bg-base-100 p-4 shadow-sm">
              <span className="text-xs text-base-content/60">Final Error</span>
              <span className="text-2xl font-bold">{result.error.toFixed(6)}</span>
            </div>
          </div>

          {/* Plotly Error Chart */}
          {result.history && result.history.length > 0 && (
            <Chart1
              fxString={gx}
              history={result.history}
              finalRoot={result.root}
              title="One-Point Iteration Error Plot"
            />
          )}

          {/* Iteration Table */}
          {result.history && result.history.length > 0 && (
            <div className="card border border-base-300 bg-base-100 p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-bold">Iteration History</h2>
              <div className="overflow-x-auto max-h-96">
                <table className="table table-zebra table-sm w-full">
                  <thead className="sticky top-0 bg-base-200">
                    <tr>
                      <th>Iteration</th>
                      <th>X_i</th>
                      <th>X_(i+1) = g(X_i)</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.history.map((row) => (
                      <tr key={row.iteration}>
                        <td>{row.iteration}</td>
                        <td className="font-mono">{row.x.toFixed(6)}</td>
                        <td className="font-mono">{(row.xNext ?? row.fx).toFixed(6)}</td>
                        <td className="font-mono">{row.error.toFixed(6)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

