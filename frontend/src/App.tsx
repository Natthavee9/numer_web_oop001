import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MathJaxContext } from 'better-react-mathjax';

import { Navbar } from './components/layout/navbar';
import { HomePage } from './pages/Homepage';
import BisectionPage from './pages/BisectionPage';
import GraphicalPage from './pages/GraphicalPage';
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