import { useState } from "react"
import { Shuffle } from "lucide-react"
import { Bisection } from "@/calculate/root_of_equation/Bisection.js"
import { MathView } from "@/components/ui/MathView"
import { Chart1 } from "@/components/method/chart1"
import { getRandomRootProblem } from "@/lib/equationPresets"

interface HistoryRow {
  iteration: number
  root: number
  error: number
  fx: number
}

interface BisectionResult {
  root: number
  error: number
  iterations: number
  history?: HistoryRow[]
}

export default function BisectionPage() {
  const [fx, setFx] = useState<string>("x^4 - 13")
  const [xl, setXl] = useState<string>("1.5")
  const [xr, setXr] = useState<string>("2.0")
  const [err, setErr] = useState<string>("0.000001")

  const [result, setResult] = useState<BisectionResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const BisectionCal = (xlVal: number, xrVal: number, fxVal: string, errVal: number) => {
    try {
      setErrorMsg("")
      const solver = new Bisection(fxVal, xlVal, xrVal, errVal)
      const res = solver.solve()
      setResult(res as unknown as BisectionResult)
    } catch (e: any) {
      setResult(null)
      setErrorMsg(e.message || "An error occurred during calculation")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const xlNum = parseFloat(xl)
    const xrNum = parseFloat(xr)
    const errNum = parseFloat(err)

    if (isNaN(xlNum) || isNaN(xrNum) || isNaN(errNum)) {
      setErrorMsg("Please enter valid numbers for XL, XR, and Error")
      return
    }
    BisectionCal(xlNum, xrNum, fx, errNum)
  }

  const handleRandom = () => {
    const preset = getRandomRootProblem(fx)
    setFx(preset.fx)
    setXl(preset.xl)
    setXr(preset.xr)
    if (preset.err) setErr(preset.err)
    setErrorMsg("")
    setResult(null)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="border-b border-base-300 pb-4">
        <h1 className="text-3xl font-bold">Bisection Method</h1>
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
            {/* Real-time MathJax equation preview */}
            {fx && (
              <div className="mt-2 rounded-lg bg-base-200/50 p-2 text-center">
                <MathView equation={fx} label="f(x) = " className="text-lg font-medium" />
              </div>
            )}
          </div>

          <div>
            <label className="label text-sm font-semibold">XL</label>
            <input
              type="number"
              step="any"
              value={xl}
              onChange={(e) => setXl(e.target.value)}
              placeholder="1.5"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label text-sm font-semibold">XR</label>
            <input
              type="number"
              step="any"
              value={xr}
              onChange={(e) => setXr(e.target.value)}
              placeholder="2.0"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="sm:col-span-2">
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
            <MathView equation={fx} label="f(x) = " className="text-xl font-bold text-primary" />
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

          {/* Chart Plotting Every Calculated Point */}
          {result.history && result.history.length > 0 && (
            <Chart1
              fxString={fx}
              xl={parseFloat(xl)}
              xr={parseFloat(xr)}
              history={result.history}
              finalRoot={result.root}
            />
          )}

          {/* Iteration Table */}
          {result.history && result.history.length > 0 && (
            <div className="card border border-base-300 bg-base-100 p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-bold">Iteration History</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra table-sm w-full">
                  <thead>
                    <tr>
                      <th>Iteration</th>
                      <th>Root (X_m)</th>
                      <th>f(X_m)</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.history.map((row) => (
                      <tr key={row.iteration}>
                        <td>{row.iteration}</td>
                        <td className="font-mono">{row.root.toFixed(6)}</td>
                        <td className="font-mono">{row.fx.toFixed(6)}</td>
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