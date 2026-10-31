import { useState } from "react"
import { Shuffle, Plus, Minus } from "lucide-react"
import { CompositeTrapezoidal } from "@/calculate/Integration/CompositeTrap.js"
import { MathView } from "@/components/ui/MathView"
import { IntegrationChart } from "@/components/method/IntegrationChart"
import { getRandomIntegrationProblem } from "@/lib/equationPresets"
import { formatIntegralLatex } from "@/lib/formatIntegral"

interface IntegrationResult {
  ans: number
  steps: string[]
}

export default function CompositeTrapezoidalPage() {
  const [fx, setFx] = useState<string>("x^7 + 2*x^3 - 1")
  const [a, setA] = useState<string>("0")
  const [b, setB] = useState<string>("1")
  const [n, setN] = useState<string>("4")

  const [result, setResult] = useState<IntegrationResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const applyN = (newN: number) => {
    const clamped = Math.max(2, Math.min(newN, 100))
    setN(clamped.toString())
    setResult(null)
    setErrorMsg("")
  }

  const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setN(val)
    const parsed = parseInt(val, 10)
    if (!Number.isNaN(parsed) && parsed >= 2 && parsed <= 100) {
      applyN(parsed)
    }
  }

  const handleNBlur = () => {
    const parsed = parseInt(n, 10)
    if (Number.isNaN(parsed) || parsed < 2) {
      applyN(2)
    } else if (parsed > 100) {
      applyN(100)
    } else {
      applyN(parsed)
    }
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setErrorMsg("")

      const parsedA = parseFloat(a)
      const parsedB = parseFloat(b)
      const parsedN = parseInt(n, 10)

      if (Number.isNaN(parsedA) || Number.isNaN(parsedB)) {
        throw new Error("Please enter valid numeric integration bounds (a and b)")
      }

      if (parsedA === parsedB) {
        throw new Error("Integration limits a and b must be different")
      }

      if (Number.isNaN(parsedN) || parsedN < 2) {
        throw new Error("Number of segments n must be at least 2")
      }

      const solver = new CompositeTrapezoidal(parsedA, parsedB, fx, parsedN)
      const res = solver.solve()
      setResult(res as unknown as IntegrationResult)
    } catch (err: any) {
      setResult(null)
      setErrorMsg(err.message || "An error occurred during calculation")
    }
  }

  const handleRandom = () => {
    const preset = getRandomIntegrationProblem(fx)
    setFx(preset.fx)
    setA(preset.a)
    setB(preset.b)
    if (preset.n) setN(preset.n)
    setResult(null)
    setErrorMsg("")
  }

  const currentN = parseInt(n, 10) || 4

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      {/* Header */}
      <div className="border-b border-base-300 pb-4">
        <h1 className="text-3xl font-bold">Composite Trapezoidal Rule</h1>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="card border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Function f(x) and Integral Preview */}
          <div className="sm:col-span-3">
            <label className="text-sm font-semibold">Function f(x):</label>
            <input
              type="text"
              value={fx}
              onChange={(e) => setFx(e.target.value)}
              className="input input-bordered input-sm mt-1 w-full font-mono text-base"
              placeholder="e.g. x^7 + 2*x^3 - 1"
              required
            />
            {fx && (
              <div className="mt-2 overflow-x-auto rounded-lg bg-base-200/50 p-2.5 text-center">
                <MathView equation={formatIntegralLatex(fx, a, b)} className="text-lg font-medium" />
              </div>
            )}
          </div>

          {/* Lower limit a */}
          <div>
            <label className="text-sm font-semibold">Lower Bound (a):</label>
            <input
              type="number"
              step="any"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="input input-bordered input-sm mt-1 w-full font-mono"
              placeholder="0"
              required
            />
          </div>

          {/* Upper limit b */}
          <div>
            <label className="text-sm font-semibold">Upper Bound (b):</label>
            <input
              type="number"
              step="any"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="input input-bordered input-sm mt-1 w-full font-mono"
              placeholder="1"
              required
            />
          </div>

          {/* Segments n */}
          <div>
            <label className="text-sm font-semibold">Segments (n):</label>
            <div className="mt-1 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => applyN(currentN - 1)}
                disabled={currentN <= 2}
                className="btn btn-sm btn-outline btn-square"
                title="Decrease segments"
              >
                <Minus className="size-4" />
              </button>
              <input
                type="number"
                min="2"
                max="100"
                value={n}
                onChange={handleNChange}
                onBlur={handleNBlur}
                className="input input-bordered input-sm w-full text-center font-mono font-bold"
                required
              />
              <button
                type="button"
                onClick={() => applyN(currentN + 1)}
                disabled={currentN >= 100}
                className="btn btn-sm btn-outline btn-square"
                title="Increase segments"
              >
                <Plus className="size-4" />
              </button>
            </div>
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
          {/* Approximate Integral Value Card */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/70">
              Composite Trapezoidal Integral with n = {n}
            </h2>
            <div className="mt-2 flex justify-center overflow-x-auto py-1">
              <MathView
                equation={`${formatIntegralLatex(fx, a, b)} \\approx ${Number(result.ans.toFixed(7))}`}
                className="text-2xl font-bold text-primary font-mono"
              />
            </div>
          </div>

          {/* Integration Area Chart */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-base-content/80">Integral Area &amp; Subintervals</h2>
            <IntegrationChart
              fxString={fx}
              a={parseFloat(a)}
              b={parseFloat(b)}
              subdivisions={currentN}
              title={`Composite Trapezoidal Rule (n = ${currentN})`}
            />
          </div>

          {/* Calculation Steps */}
          {result.steps.length > 0 && (
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-base-content/80">Calculation Steps</h2>
              <div className="space-y-2.5">
                {result.steps.map((step, idx) => (
                  <div
                    key={`comp-trap-step-${idx}`}
                    className="overflow-x-auto rounded-lg bg-base-200/40 p-3 text-center"
                  >
                    <MathView equation={step} className="text-sm sm:text-base" />
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
