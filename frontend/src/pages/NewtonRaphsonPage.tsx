import { useState, useMemo } from "react"
import { Shuffle } from "lucide-react"
import { derivative } from "mathjs"
import { NewtonRaphson } from "@/calculate/root_of_equation/NewTonRaph.js"
import { MathView } from "@/components/ui/MathView"
import { Chart1 } from "@/components/method/chart1"
import { getRandomNewtonProblem } from "@/lib/equationPresets"

interface HistoryRow {
  iteration: number
  x0: number
  x1: number
  root: number
  fx: number
  dfx: number
  error: number
}

interface NewtonRaphsonResult {
  root: number
  error: number
  iterations: number
  dfString: string
  history?: HistoryRow[]
}

export default function NewtonRaphsonPage() {
  const [fx, setFx] = useState<string>("x^4 - 13")
  const [x0, setX0] = useState<string>("2.0")
  const [err, setErr] = useState<string>("0.000001")

  const [result, setResult] = useState<NewtonRaphsonResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")

  // Compute derivative string for real-time preview
  const dfxPreview = useMemo(() => {
    if (!fx || !fx.trim()) return ""
    try {
      const clean = fx.replace(/(\d)([a-zA-Z])/g, "$1*$2")
      const d = derivative(clean, "x")
      return d.toString()
    } catch {
      return ""
    }
  }, [fx])

  const handleCalculate = (x0Val: number, fxVal: string, errVal: number) => {
    try {
      setErrorMsg("")
      const solver = new NewtonRaphson(fxVal, x0Val, errVal)
      const res = solver.solve()
      setResult(res as unknown as NewtonRaphsonResult)
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

    handleCalculate(x0Num, fx, errNum)
  }

  const handleRandom = () => {
    const preset = getRandomNewtonProblem(fx)
    setFx(preset.fx)
    setX0(preset.x0)
    if (preset.err) setErr(preset.err)
    setErrorMsg("")
    setResult(null)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="border-b border-base-300 pb-4">
        <h1 className="text-3xl font-bold">Newton-Raphson Method</h1>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="card border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label text-sm font-semibold">f(x)</label>
            <input
              type="text"
              value={fx}
              onChange={(e) => setFx(e.target.value)}
              placeholder="e.g. x^4 - 13"
              className="input input-bordered w-full"
              required
            />
            {/* Real-time MathJax equation preview for f(x) and f'(x) */}
            {fx && (
              <div className="mt-2 flex flex-col gap-1 rounded-lg bg-base-200/50 p-3 text-center sm:flex-row sm:justify-around">
                <div>
                  <span className="text-xs text-base-content/60">Original Function:</span>
                  <MathView equation={fx} label="f(x) = " className="text-base font-medium" />
                </div>
                {dfxPreview && (
                  <div className="border-t border-base-300 pt-1 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0">
                    <span className="text-xs text-base-content/60">Auto Derivative f&apos;(x):</span>
                    <MathView equation={dfxPreview} label="f'(x) = " className="text-base font-medium text-secondary" />
                  </div>
                )}
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
              placeholder="2.0"
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
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm sm:flex-row sm:gap-8">
            <div className="text-center">
              <span className="text-xs text-base-content/60">Function</span>
              <MathView equation={fx} label="f(x) = " className="text-lg font-bold text-primary" />
            </div>
            {result.dfString && (
              <div className="text-center">
                <span className="text-xs text-base-content/60">Derivative</span>
                <MathView equation={result.dfString} label="f'(x) = " className="text-lg font-bold text-secondary" />
              </div>
            )}
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
              fxString={fx}
              history={result.history}
              finalRoot={result.root}
              title="Newton-Raphson Error Plot"
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
                      <th>f(X_i)</th>
                      <th>f&apos;(X_i)</th>
                      <th>X_(i+1)</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.history.map((row) => (
                      <tr key={row.iteration}>
                        <td>{row.iteration}</td>
                        <td className="font-mono">{row.x0.toFixed(6)}</td>
                        <td className="font-mono">{row.fx.toFixed(6)}</td>
                        <td className="font-mono">{row.dfx.toFixed(6)}</td>
                        <td className="font-mono">{row.x1.toFixed(6)}</td>
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

