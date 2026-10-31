import { parse } from "mathjs"

/**
 * Formats f(x) and bounds a, b into LaTeX integral notation: \int_{a}^{b} f(x) \, dx
 */
export function formatIntegralLatex(fx: string, a?: string, b?: string): string {
  if (!fx || !fx.trim()) return ""

  let exprTex = fx.trim()
  try {
    const clean = fx.replace(/(\d)([a-zA-Z])/g, "$1*$2")
    const node = parse(clean)
    const tex = node.toTex({
      parenthesis: "keep",
      handler: (node: any, options: any) => {
        if (node.isOperatorNode && node.isBinary && node.isBinary() && node.op === "*") {
          const leftNode = node.args[0]
          const rightNode = node.args[1]
          const leftTex: string = leftNode.toTex(options)
          const rightTex: string = rightNode.toTex(options)

          if (leftNode.isConstantNode && rightNode.isConstantNode) {
            return `${leftTex} \\times ${rightTex}`
          }

          if (/\\\w+$/.test(leftTex.trim()) && /^[a-zA-Z]/.test(rightTex.trim())) {
            return `${leftTex} ${rightTex.trim()}`
          }

          return `${leftTex.trim()}${rightTex.trim()}`
        }
      },
    })

    exprTex = tex
      .replace(/(\d)\s*\\cdot\s*(\d)/g, "$1 \\times $2")
      .replace(/\\cdot\s*/g, "")
      .replace(/\{\s+([a-zA-Z])/g, "{$1")
  } catch {
    exprTex = fx
  }

  const lower = a !== undefined && a !== "" ? a : "a"
  const upper = b !== undefined && b !== "" ? b : "b"

  // Only wrap in parentheses if the expression contains top-level additions/subtractions
  const hasAddSub = /[\+\-]/.test(exprTex)
  const wrappedExpr = hasAddSub ? `\\left( ${exprTex} \\right)` : exprTex

  return `\\int_{${lower}}^{${upper}} ${wrappedExpr} \\, dx`
}

