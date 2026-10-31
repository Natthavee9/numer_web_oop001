import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MathJaxContext } from 'better-react-mathjax';

import { Navbar } from './components/layout/navbar';
import { HomePage } from './pages/Homepage';
import BisectionPage from './pages/BisectionPage';
import GraphicalPage from './pages/GraphicalPage';
import FalsePositionPage from './pages/FalsePositionPage';
import OnePointPage from './pages/OnePointPage';
import NewtonRaphsonPage from './pages/NewtonRaphsonPage';
import SecantPage from './pages/SecantPage';
import NewtonRaphsonPage from './pages/NewtonRaphsonPage';
import SecantPage from './pages/SecantPage';
// import NotFoundPage from './pages/NotFoundPage';
// import { methodRegistry } from './registry'; // หรือ path ที่เก็บ methodRegistry

export default function App() {
  return (
    <MathJaxContext>
      <BrowserRouter>
        <div className="flex min-h-svh flex-col">
          <Navbar />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/graphical" element={<GraphicalPage />} />
              <Route path="/bisection" element={<BisectionPage />} />
              <Route path="/false-position" element={<FalsePositionPage />} />
              <Route path="/false-positive" element={<FalsePositionPage />} />
              <Route path="/root-of-equation/false-position" element={<FalsePositionPage />} />
              <Route path="/root-of-equation/false-positive" element={<FalsePositionPage />} />
              <Route path="/one-point-iteration" element={<OnePointPage />} />
              <Route path="/one-point" element={<OnePointPage />} />
              <Route path="/root-of-equation/one-point-iteration" element={<OnePointPage />} />
              <Route path="/root-of-equation/one-point" element={<OnePointPage />} />
              <Route path="/newton-raphson" element={<NewtonRaphsonPage />} />
              <Route path="/newtonraphson" element={<NewtonRaphsonPage />} />
              <Route path="/newton" element={<NewtonRaphsonPage />} />
              <Route path="/root-of-equation/newton-raphson" element={<NewtonRaphsonPage />} />
              <Route path="/root-of-equation/newtonraphson" element={<NewtonRaphsonPage />} />
              <Route path="/root-of-equation/newton" element={<NewtonRaphsonPage />} />
              <Route path="/secant" element={<SecantPage />} />
              <Route path="/root-of-equation/secant" element={<SecantPage />} />
              <Route path="/newton-raphson" element={<NewtonRaphsonPage />} />
              <Route path="/newtonraphson" element={<NewtonRaphsonPage />} />
              <Route path="/newton" element={<NewtonRaphsonPage />} />
              <Route path="/root-of-equation/newton-raphson" element={<NewtonRaphsonPage />} />
              <Route path="/root-of-equation/newtonraphson" element={<NewtonRaphsonPage />} />
              <Route path="/root-of-equation/newton" element={<NewtonRaphsonPage />} />
              <Route path="/secant" element={<SecantPage />} />
              <Route path="/root-of-equation/secant" element={<SecantPage />} />
              
              
              {/* {methodRegistry.all().flatMap((category) =>
                category.methods.map((method) => {
                  const Component = method.component
                  return (
                    <Route
                      key={`${category.slug}/${method.slug}`}
                      path={category.pathOf(method)}
                      element={<Component meta={method} />}
                    />
                  )
                }),
              )}
              <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </main>
         
        </div>
      </BrowserRouter>
    </MathJaxContext>
  )
}