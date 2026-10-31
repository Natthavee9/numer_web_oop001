import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Shuffle } from "lucide-react"
import { NumericalDiff } from "@/calculate/Diff/diff.js"
import { MathView } from "@/components/ui/MathView"
import { getRandomDifferentiationProblem } from "@/lib/equationPresets"

interface DiffPoint {
  label: string
  offset: number
  x: number
  y: number
}

interface DiffResult {
  approx: number
  exact: number | null
  exactFormula: string | null
  error: number | null
  formulaLatex: string
  subLatex: string
  points: DiffPoint[]
  direction: string
  order: number
  errorOrder: string
}

interface AllComparison {
  forward: DiffResult
  backward: DiffResult
  central: DiffResult
}

export default function DifferentiationPage() {
  const location = useLocation()

  // Direction: "forward" | "backward" | "central"
  const getInitialDirection = () => {
    if (location.pathname.includes("backward")) return "backward"
    if (location.pathname.includes("central")) return "central"
    return "forward"
  }

  const [direction, setDirection] = useState<string>(getInitialDirection)
  const [order, setOrder] = useState<number>(1)
  const [errorOrder, setErrorOrder] = useState<string>("h")
  const [fx, setFx] = useState<string>("e^x")
  const [x, setX] = useState<string>("2.0")
  const [h, setH] = useState<string>("0.1")

  const [result, setResult] = useState<DiffResult | null>(null)
  const [comparison, setComparison] = useState<AllComparison | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")

  // Update direction when navigating via route
  useEffect(() => {
    if (location.pathname.includes("backward")) {
      setDirection("backward")
      setErrorOrder("h")
    } else if (location.pathname.includes("central")) {
      setDirection("central")
      setErrorOrder("h2")
    } else if (location.pathname.includes("forward")) {
      setDirection("forward")
      setErrorOrder("h")
    }
  }, [location.pathname])

  // Sync errorOrder when direction changes
  const handleDirectionChange = (newDir: string) => {
    setDirection(newDir)
    if (newDir === "central") {
      if (errorOrder !== "h2" && errorOrder !== "h4") {
        setErrorOrder("h2")
      }
    } else {
      if (errorOrder !== "h" && errorOrder !== "h2") {
        setErrorOrder("h")
      }
    }
    setResult(null)
    setComparison(null)
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setErrorMsg("")

      const parsedX = parseFloat(x)
      const parsedH = parseFloat(h)
      if (Number.isNaN(parsedX) || Number.isNaN(parsedH)) {
        throw new Error("Please enter valid numeric values for x and h")
      }
      if (parsedH === 0) {
        throw new Error("Step size h cannot be zero")
      }

      const solver = new NumericalDiff(fx, parsedX, parsedH, direction, order, errorOrder)
      const res = solver.solve()
      const allRes = solver.solveAll()

      setResult(res as unknown as DiffResult)
      setComparison(allRes as unknown as AllComparison)
    } catch (err: any) {
      setResult(null)
      setComparison(null)
      setErrorMsg(err.message || "An error occurred during calculation")
    }
  }

  const handleRandom = () => {
    const preset = getRandomDifferentiationProblem(fx)
    setFx(preset.fx)
    setX(preset.x)
    setH(preset.h)
    if (preset.order) {
      setOrder(preset.order)
    }
    setResult(null)
    setComparison(null)
    setErrorMsg("")
  }

  const orderLabel = (ord: number) => {
    switch (ord) {
      case 1:
        return "1st Derivative f'(x)"
      case 2:
        return "2nd Derivative f''(x)"
      case 3:
        return "3rd Derivative f'''(x)"
      case 4:
        return "4th Derivative f⁽⁴⁾(x)"
      default:
        return `Order ${ord}`
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      {/* Header */}
      <div className="border-b border-base-300 pb-4">
        <h1 className="text-3xl font-bold">Numerical Differentiation</h1>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="card border border-base-300 bg-base-100 p-6 shadow-sm">
        {/* Method Direction Tabs */}
        <div className="mb-6 space-y-2">
          <label className="text-sm font-semibold">Divided-Difference Type:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDirectionChange("forward")}
              className={`btn btn-sm ${
                direction === "forward" ? "btn-primary" : "btn-outline"
              }`}
            >
              Forward
            </button>
            <button
              type="button"
              onClick={() => handleDirectionChange("backward")}
              className={`btn btn-sm ${
                direction === "backward" ? "btn-primary" : "btn-outline"
              }`}
            >
              Backward
            </button>
            <button
              type="button"
              onClick={() => handleDirectionChange("central")}
              className={`btn btn-sm ${
                direction === "central" ? "btn-primary" : "btn-outline"
              }`}
            >
              Central
            </button>
          </div>
        </div>

        {/* Order and Accuracy Controls */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {/* Derivative Order */}
          <div>
            <label className="text-sm font-semibold">Derivative Order:</label>
            <select
              value={order}
              onChange={(e) => {
                setOrder(parseInt(e.target.value, 10))
                setResult(null)
                setComparison(null)
              }}
              className="select select-bordered select-sm mt-1 w-full"
            >
              <option value={1}>First Derivative f&apos;(x)</option>
              <option value={2}>Second Derivative f&apos;&apos;(x)</option>
              <option value={3}>Third Derivative f&apos;&apos;&apos;(x)</option>
              <option value={4}>Fourth Derivative f⁽⁴⁾(x)</option>
            </select>
          </div>

          {/* Error Order / Accuracy */}
          <div>
            <label className="text-sm font-semibold">Error Order / Accuracy:</label>
            <select
              value={errorOrder}
              onChange={(e) => {
                setErrorOrder(e.target.value)
                setResult(null)
                setComparison(null)
              }}
              className="select select-bordered select-sm mt-1 w-full"
            >
              {direction === "central" ? (
                <>
                  <option value="h2">O(h²) - Second-Order Error</option>
                  <option value="h4">O(h⁴) - High Accuracy / Fourth-Order</option>
                </>
              ) : (
                <>
                  <option value="h">O(h) - First-Order Error</option>
                  <option value="h2">O(h²) - High Accuracy / Second-Order</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Function and Numerical Inputs */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Function f(x) */}
          <div className="sm:col-span-3">
            <label className="text-sm font-semibold">Function f(x):</label>
            <input
              type="text"
              value={fx}
              onChange={(e) => setFx(e.target.value)}
              className="input input-bordered input-sm mt-1 w-full font-mono text-base"
              placeholder="e.g. e^x or x^4 - 2*x^3"
              required
            />
            {fx && (
              <div className="mt-2 overflow-x-auto rounded-lg bg-base-200/50 p-2.5 text-center">
                <MathView equation={`f(x) = ${fx}`} className="text-lg font-medium" />
              </div>
            )}
          </div>

          {/* Point x */}
          <div>
            <label className="text-sm font-semibold">Target Point (x):</label>
            <input
              type="number"
              step="any"
              value={x}
              onChange={(e) => setX(e.target.value)}
              className="input input-bordered input-sm mt-1 w-full font-mono"
              placeholder="2.0"
              required
            />
          </div>

          {/* Step Size h */}
          <div>
            <label className="text-sm font-semibold">Step Size (h):</label>
            <input
              type="number"
              step="any"
              value={h}
              onChange={(e) => setH(e.target.value)}
              className="input input-bordered input-sm mt-1 w-full font-mono"
              placeholder="0.1"
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
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Numerical Approximation */}
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm text-center">
              <span className="text-xs font-semibold text-base-content/60">
                Approximation {orderLabel(result.order).split(" ")[0]} ({result.errorOrder.toUpperCase()})
              </span>
              <div className="mt-2 text-2xl font-bold text-primary font-mono">
                {result.approx}
              </div>
            </div>

            {/* Exact Analytical Value */}
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm text-center">
              <span className="text-xs font-semibold text-base-content/60">
                Exact Analytical Value
              </span>
              <div className="mt-2 text-2xl font-bold text-secondary font-mono">
                {result.exact !== null ? result.exact : "N/A"}
              </div>
              {result.exactFormula && (
                <div className="mt-1 text-xs text-base-content/60 truncate font-mono">
                  {result.exactFormula}
                </div>
              )}
            </div>

            {/* True Relative Error */}
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm text-center">
              <span className="text-xs font-semibold text-base-content/60">
                True Relative Error (&epsilon;<sub>t</sub>)
              </span>
              <div className="mt-2 text-2xl font-bold text-accent font-mono">
                {result.error !== null ? `${result.error.toFixed(6)}%` : "N/A"}
              </div>
            </div>
          </div>

          {/* Formula & Step-by-Step Substitution */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-base-content/80">Calculation Formula &amp; Substitution</h2>

            {/* Formula */}
            <div className="rounded-lg bg-base-200/50 p-3">
              <div className="text-xs font-semibold text-base-content/60 mb-1">General Formula:</div>
              <div className="overflow-x-auto py-1 text-center">
                <MathView equation={result.formulaLatex} className="text-lg font-medium" />
              </div>
            </div>

            {/* Substitution */}
            <div className="rounded-lg bg-base-200/50 p-3">
              <div className="text-xs font-semibold text-base-content/60 mb-1">Value Substitution:</div>
              <div className="overflow-x-auto py-1 text-center font-mono">
                <MathView equation={result.subLatex} className="text-base" />
              </div>
            </div>
          </div>

          {/* Evaluated Grid Points Table */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-base-content/80">Evaluated Points Table</h2>
            <div className="overflow-x-auto">
              <table className="table table-sm text-center font-mono">
                <thead>
                  <tr>
                    <th>Point</th>
                    <th>Offset (i)</th>
                    <th>x_i = x + i·h</th>
                    <th>f(x_i)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.points.map((pt, idx) => (
                    <tr
                      key={`pt-${idx}`}
                      className={pt.offset === 0 ? "bg-primary/10 font-bold text-primary" : ""}
                    >
                      <td>{pt.label}</td>
                      <td>{pt.offset > 0 ? `+${pt.offset}` : pt.offset}</td>
                      <td>{pt.x}</td>
                      <td>{pt.y}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Comparison Table Across All 3 Methods */}
          {comparison && (
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-base-content/80">
                Methods Comparison ({orderLabel(result.order)})
              </h2>
              <div className="overflow-x-auto">
                <table className="table table-sm text-center">
                  <thead>
                    <tr>
                      <th className="text-left">Method</th>
                      <th>Accuracy</th>
                      <th>Approximation</th>
                      <th>Exact Value</th>
                      <th>Error (&epsilon;<sub>t</sub>)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={direction === "forward" ? "bg-base-200/60 font-semibold" : ""}>
                      <td className="text-left font-medium">Forward Divided-Differences</td>
                      <td className="badge badge-sm badge-outline mt-2">{comparison.forward.errorOrder.toUpperCase()}</td>
                      <td className="font-mono text-primary font-bold">{comparison.forward.approx}</td>
                      <td className="font-mono text-secondary">{comparison.forward.exact ?? "N/A"}</td>
                      <td className="font-mono text-accent">
                        {comparison.forward.error !== null ? `${comparison.forward.error.toFixed(6)}%` : "N/A"}
                      </td>
                    </tr>
                    <tr className={direction === "backward" ? "bg-base-200/60 font-semibold" : ""}>
                      <td className="text-left font-medium">Backward Divided-Differences</td>
                      <td className="badge badge-sm badge-outline mt-2">{comparison.backward.errorOrder.toUpperCase()}</td>
                      <td className="font-mono text-primary font-bold">{comparison.backward.approx}</td>
                      <td className="font-mono text-secondary">{comparison.backward.exact ?? "N/A"}</td>
                      <td className="font-mono text-accent">
                        {comparison.backward.error !== null ? `${comparison.backward.error.toFixed(6)}%` : "N/A"}
                      </td>
                    </tr>
                    <tr className={direction === "central" ? "bg-base-200/60 font-semibold" : ""}>
                      <td className="text-left font-medium">Central Divided-Differences</td>
                      <td className="badge badge-sm badge-outline mt-2">{comparison.central.errorOrder.toUpperCase()}</td>
                      <td className="font-mono text-primary font-bold">{comparison.central.approx}</td>
                      <td className="font-mono text-secondary">{comparison.central.exact ?? "N/A"}</td>
                      <td className="font-mono text-accent">
                        {comparison.central.error !== null ? `${comparison.central.error.toFixed(6)}%` : "N/A"}
                      </td>
                    </tr>
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

