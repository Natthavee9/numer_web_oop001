import { useMemo } from "react"
import { MathJax } from "better-react-mathjax"
import { parse } from "mathjs"

interface MathViewProps {
  equation: string
  label?: string
  inline?: boolean
  className?: string
}

export function MathView({
  equation,
  label = "",
  inline = false,
  className = "",
}: MathViewProps) {
  const latex = useMemo(() => {
    if (!equation || !equation.trim()) return ""
    try {
      // Replace implicit multiplication like 4x -> 4*x
      const clean = equation.replace(/(\d)([a-zA-Z])/g, "$1*$2")
      const node = parse(clean)
      let tex = node.toTex({
        parenthesis: "keep",
        handler: (node: any, options: any) => {
          if (node.isOperatorNode && node.isBinary && node.isBinary() && node.op === "*") {
            const leftNode = node.args[0]
            const rightNode = node.args[1]
            const leftTex: string = leftNode.toTex(options)
            const rightTex: string = rightNode.toTex(options)

            // If both sides are pure numbers, use \times
            if (leftNode.isConstantNode && rightNode.isConstantNode) {
              return `${leftTex} \\times ${rightTex}`
            }

            // If left ends with a TeX command (e.g. \pi) and right starts with a letter, preserve a space
            if (/\\\w+$/.test(leftTex.trim()) && /^[a-zA-Z]/.test(rightTex.trim())) {
              return `${leftTex} ${rightTex.trim()}`
            }

            // Otherwise, attach directly to the variable without multiplication dot
            return `${leftTex.trim()}${rightTex.trim()}`
          }
        },
      })

      // Clean up any remaining \cdot and remove leading spaces in bracketed symbols
      tex = tex
        .replace(/(\d)\s*\\cdot\s*(\d)/g, "$1 \\times $2")
        .replace(/\\cdot\s*/g, "")
        .replace(/\{\s+([a-zA-Z])/g, "{$1")

      return tex
    } catch {
      // If formula is incomplete while typing, return raw text
      return equation
    }
  }, [equation])

  if (!latex) return null

  const formatted = inline ? `\\(${label}${latex}\\)` : `\\[${label}${latex}\\]`

  return (
    <span className={className}>
      <MathJax dynamic>{formatted}</MathJax>
    </span>
  )
}

export default MathView
