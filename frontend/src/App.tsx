import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MathJaxContext } from 'better-react-mathjax';
import { Navbar } from './components/layout/navbar';
import { HomePage } from './pages/Homepage';
import GraphicalPage from './pages/GraphicalPage';
import BisectionPage from './pages/BisectionPage';
import FalsePositionPage from './pages/FalsePositionPage';
import OnePointPage from './pages/OnePointPage';
import NewtonRaphsonPage from './pages/NewtonRaphsonPage';
import SecantPage from './pages/SecantPage';
import CramerPage from './pages/CramerPage';
import GaussEliminationPage from './pages/GaussEliminationPage';
import GaussJordanPage from './pages/GaussJordanPage';
import MatrixInversionPage from './pages/MatrixInversionPage';
import LUDecompositionPage from './pages/LUDecompositionPage';
import CholeskyPage from './pages/CholeskyPage';
import JacobiPage from './pages/JacobiPage';
import ConjugateGradientPage from './pages/ConjugateGradientPage';
import NewtonDividedPage from './pages/NewtonDividedPage';
import LagrangePage from './pages/LagrangePage';
import SplinePage from './pages/SplinePage';
import RegressionPage from './pages/RegressionPage';
import PolynomialRegressionPage from './pages/PolynomialRegressionPage';
import TrapezoidalPage from './pages/TrapezoidalPage';
import CompositeTrapezoidalPage from './pages/CompositeTrapezoidalPage';
import SimpsonPage from './pages/SimpsonPage';
import CompositeSimpsonPage from './pages/CompositeSimpsonPage';
import DifferentiationPage from './pages/DifferentiationPage';

export default function App() {
  return (
    <MathJaxContext>
      <BrowserRouter>
        <div className="flex min-h-svh flex-col">
          <Navbar />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* Root of Equation */}
              <Route path="/graphical" element={<GraphicalPage />} />
              <Route path="/bisection" element={<BisectionPage />} />
              <Route path="/false-position" element={<FalsePositionPage />} />
              <Route path="/one-point-iteration" element={<OnePointPage />} />
              <Route path="/newton-raphson" element={<NewtonRaphsonPage />} />
              <Route path="/secant" element={<SecantPage />} />

              {/* Linear Algebra */}
              <Route path="/cramer" element={<CramerPage />} />
              <Route path="/gauss-elimination" element={<GaussEliminationPage />} />
              <Route path="/gauss-jordan" element={<GaussJordanPage />} />
              <Route path="/matrix-inversion" element={<MatrixInversionPage />} />
              <Route path="/lu-decomposition" element={<LUDecompositionPage />} />
              <Route path="/cholesky" element={<CholeskyPage />} />
              <Route path="/cholesky-decomposition" element={<CholeskyPage />} />
              <Route path="/jacobi" element={<JacobiPage />} />
              <Route path="/conjugate-gradient" element={<ConjugateGradientPage />} />

              {/* Interpolation */}
              <Route path="/newton-divided" element={<NewtonDividedPage />} />
              <Route path="/lagrange" element={<LagrangePage />} />
              <Route path="/spline" element={<SplinePage />} />

              {/* Extrapolation */}
              <Route path="/regression" element={<RegressionPage />} />
              <Route path="/polynomial-regression" element={<PolynomialRegressionPage />} />

              {/* Differentiation */}
              <Route path="/differentiation" element={<DifferentiationPage />} />
              <Route path="/diff" element={<DifferentiationPage />} />
              <Route path="/diff-forward" element={<DifferentiationPage />} />
              <Route path="/diff-backward" element={<DifferentiationPage />} />
              <Route path="/diff-central" element={<DifferentiationPage />} />

              {/* Integration */}
              <Route path="/trapezoidal" element={<TrapezoidalPage />} />
              <Route path="/composite-trapezoidal" element={<CompositeTrapezoidalPage />} />
              <Route path="/simpson" element={<SimpsonPage />} />
              <Route path="/composite-simpson" element={<CompositeSimpsonPage />} />

              {/* 404 Fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </MathJaxContext>
  );
}
