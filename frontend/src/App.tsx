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
import JacobiPage from './pages/JacobiPage';
import ConjugateGradientPage from './pages/ConjugateGradientPage';

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
              <Route path="/jacobi" element={<JacobiPage />} />
              <Route path="/conjugate-gradient" element={<ConjugateGradientPage />} />

            
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </MathJaxContext>
  );
}
