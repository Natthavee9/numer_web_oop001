import { useState } from "react"
import { Shuffle, Plus, Minus } from "lucide-react"
import { CompositeSimpson } from "@/calculate/Integration/CompositeSimson.js"
import { MathView } from "@/components/ui/MathView"
import { IntegrationChart } from "@/components/method/IntegrationChart"
import { getRandomIntegrationProblem } from "@/lib/equationPresets"
import { formatIntegralLatex } from "@/lib/formatIntegral"

interface IntegrationResult {
  ans: number
  steps: string[]
}

export default function CompositeSimpsonPage() {
  const [fx, setFx] = useState<string>("x^7 + 2*x^3 - 1")
  const [a, setA] = useState<string>("0")
  const [b, setB] = useState<string>("1")
  const [n, setN] = useState<string>("2")

  const [result, setResult] = useState<IntegrationResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const applyN = (newN: number) => {
    const clamped = Math.max(1, Math.min(newN, 50))
    setN(clamped.toString())
    setResult(null)
    setErrorMsg("")
  }

  const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setN(val)
    const parsed = parseInt(val, 10)
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 50) {
      applyN(parsed)
    }
  }

  const handleNBlur = () => {
    const parsed = parseInt(n, 10)
    if (Number.isNaN(parsed) || parsed < 1) {
      applyN(1)
    } else if (parsed > 50) {
      applyN(50)
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

      if (Number.isNaN(parsedN) || parsedN < 1) {
        throw new Error("n (number of interval pairs) must be at least 1")
      }

      const solver = new CompositeSimpson(parsedA, parsedB, fx, parsedN)
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
    if (preset.n) {
      const pairs = Math.max(1, Math.floor((parseInt(preset.n, 10) || 4) / 2))
      setN(pairs.toString())
    }
    setResult(null)
    setErrorMsg("")
  }

  const currentN = parseInt(n, 10) || 2
  const totalSubdivisions = currentN * 2

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      {/* Header */}
      <div className="border-b border-base-300 pb-4">
        <h1 className="text-3xl font-bold">Composite Simpson&apos;s Rule</h1>
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

          {/* Pair parameter n (2n segments) */}
          <div>
            <label className="text-sm font-semibold">
              Interval Pairs (n &rarr; {totalSubdivisions} segments):
            </label>
            <div className="mt-1 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => applyN(currentN - 1)}
                disabled={currentN <= 1}
                className="btn btn-sm btn-outline btn-square"
                title="Decrease n"
              >
                <Minus className="size-4" />
              </button>
              <input
                type="number"
                min="1"
                max="50"
                value={n}
                onChange={handleNChange}
                onBlur={handleNBlur}
                className="input input-bordered input-sm w-full text-center font-mono font-bold"
                required
              />
              <button
                type="button"
                onClick={() => applyN(currentN + 1)}
                disabled={currentN >= 50}
                className="btn btn-sm btn-outline btn-square"
                title="Increase n"
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
            Random โจทย์
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
              Composite Simpson Integral with 2n = {totalSubdivisions} segments
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
              subdivisions={totalSubdivisions}
              title={`Composite Simpson's Rule (${totalSubdivisions} Segments)`}
            />
          </div>

          {/* Calculation Steps */}
          {result.steps.length > 0 && (
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-base-content/80">Calculation Steps</h2>
              <div className="space-y-2.5">
                {result.steps.map((step, idx) => (
                  <div
                    key={`comp-simp-step-${idx}`}
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
