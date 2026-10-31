import { useState } from "react"
import { Shuffle } from "lucide-react"
import { Graphical } from "@/calculate/root_of_equation/Graphical.js"
import { MathView } from "@/components/ui/MathView"
import { Chart1, type HistoryRow } from "@/components/method/chart1"
import { getRandomRootProblem } from "@/lib/equationPresets"

interface GraphicalResult {
  root: number
  error: number
  iterations: number
  history?: HistoryRow[]
}

export default function GraphicalPage() {
  const [fx, setFx] = useState<string>("43*x - 180")
  const [xl, setXl] = useState<string>("0")
  const [xr, setXr] = useState<string>("10")
  const [err, setErr] = useState<string>("0.000001")

  const [result, setResult] = useState<GraphicalResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")
  const [showAllRows, setShowAllRows] = useState<boolean>(false)

  const handleCalculate = (xlVal: number, xrVal: number, fxVal: string, errVal: number) => {
    try {
      setErrorMsg("")
      const solver = new Graphical(fxVal, xlVal, xrVal, errVal)
      const res = solver.solve()
      setResult(res as unknown as GraphicalResult)
      setShowAllRows(false)
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
      setErrorMsg("Please enter valid numeric values for XL, XR, and Error")
      return
    }

    if (xlNum >= xrNum) {
      setErrorMsg("XL must be strictly less than XR")
      return
    }

    handleCalculate(xlNum, xrNum, fx, errNum)
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

  // Optimize table display if many iterations
  const visibleHistory = result?.history
    ? showAllRows || result.history.length <= 100
      ? result.history
      : [...result.history.slice(0, 50), ...result.history.slice(-50)]
    : []

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      {/* Title */}
      <div className="border-b border-base-300 pb-4">
        <h1 className="text-3xl font-bold">Graphical Method</h1>
        
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
              placeholder="e.g. 43*x - 180"
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
              placeholder="0"
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
              placeholder="10"
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
          {/* Solved Equation Banner */}
          <div className="rounded-xl border border-base-300 bg-base-100 p-4 text-center shadow-sm">
            <span className="text-xs text-base-content/60">Equation Solved</span>
            <MathView equation={fx} label="f(x) = " className="text-xl font-bold text-primary" />
          </div>

          {/* Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card border border-base-300 bg-base-100 p-4 shadow-sm">
              <span className="text-xs text-base-content/60">Estimated Root (x)</span>
              <span className="text-2xl font-bold text-primary">{result.root.toFixed(6)}</span>
            </div>
            <div className="card border border-base-300 bg-base-100 p-4 shadow-sm">
              <span className="text-xs text-base-content/60">Total Iterations</span>
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
              finalRoot={result.root}
              history={result.history}
            />
          )}

          {/* Iteration Table */}
          {result.history && result.history.length > 0 && (
            <div className="card border border-base-300 bg-base-100 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Iteration History</h2>
                  <p className="text-xs text-base-content/60">
                    Showing {visibleHistory.length} of {result.history.length} evaluation points
                  </p>
                </div>
                {result.history.length > 100 && (
                  <button
                    type="button"
                    className="btn btn-xs btn-outline"
                    onClick={() => setShowAllRows(!showAllRows)}
                  >
                    {showAllRows ? "Show Summary (First/Last 50)" : "Show All Rows"}
                  </button>
                )}
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="table table-zebra table-sm w-full">
                  <thead className="sticky top-0 bg-base-200">
                    <tr>
                      <th>Iteration</th>
                      <th>x</th>
                      <th>f(x)</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleHistory.map((row, idx) => {
                      const isBreak =
                        !showAllRows &&
                        result.history &&
                        result.history.length > 100 &&
                        idx === 50
                      return (
                        <tr key={`row-${row.iteration}`}>
                          <td>
                            {isBreak && (
                              <span className="badge badge-sm badge-ghost mr-2">...</span>
                            )}
                            {row.iteration}
                          </td>
                          <td className="font-mono">{row.root.toFixed(6)}</td>
                          <td className="font-mono">{row.fx.toFixed(6)}</td>
                          <td className="font-mono">{row.error.toFixed(6)}</td>
                        </tr>
                      )
                    })}
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

