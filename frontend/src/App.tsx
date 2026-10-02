import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MathJaxContext } from 'better-react-mathjax';

// TODO: คุณต้องสร้างไฟล์ component เหล่านี้และแก้ไข path ให้ถูกต้อง
// import { Navbar } from './components/layout/navbar';
// import HomePage from './pages/HomePage';
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
              {methodRegistry.all().flatMap((category) =>
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
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <footer className="border-t py-4">
            <p className="mx-auto max-w-7xl px-4 text-xs text-muted-foreground">
              React + Tailwind CSS + daisyUI frontend · FastAPI backend · Supabase-ready storage.
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </MathJaxContext>
  )
}