import { useState } from "react"
import { Shuffle } from "lucide-react"
import { Trapezoidal } from "@/calculate/Integration/Trapzoidal.js"
import { MathView } from "@/components/ui/MathView"
import { IntegrationChart } from "@/components/method/IntegrationChart"
import { getRandomIntegrationProblem } from "@/lib/equationPresets"
import { formatIntegralLatex } from "@/lib/formatIntegral"

interface IntegrationResult {
  ans: number
  steps: string[]
}

export default function TrapezoidalPage() {
  const [fx, setFx] = useState<string>("x^7 + 2*x^3 - 1")
  const [a, setA] = useState<string>("0")
  const [b, setB] = useState<string>("1")

  const [result, setResult] = useState<IntegrationResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setErrorMsg("")

      const parsedA = parseFloat(a)
      const parsedB = parseFloat(b)
      if (Number.isNaN(parsedA) || Number.isNaN(parsedB)) {
        throw new Error("Please enter valid numeric integration bounds (a and b)")
      }

      if (parsedA === parsedB) {
        throw new Error("Integration limits a and b must be different")
      }

      const solver = new Trapezoidal(parsedA, parsedB, fx)
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
    setResult(null)
    setErrorMsg("")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      {/* Header */}
      <div className="border-b border-base-300 pb-4">
        <h1 className="text-3xl font-bold">Trapezoidal Rule</h1>
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
              Approximate Integral (I)
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
            <h2 className="mb-4 text-base font-bold text-base-content/80">Integral Area &amp; Trapezoid</h2>
            <IntegrationChart
              fxString={fx}
              a={parseFloat(a)}
              b={parseFloat(b)}
              subdivisions={1}
              title="Single-Segment Trapezoidal Rule"
            />
          </div>

          {/* Calculation Steps */}
          {result.steps.length > 0 && (
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-base-content/80">Calculation Steps</h2>
              <div className="space-y-2.5">
                {result.steps.map((step, idx) => (
                  <div
                    key={`trap-step-${idx}`}
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
