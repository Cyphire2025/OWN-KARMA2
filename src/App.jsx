import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Lazy Load Pages for Performance
const IntroPage = lazy(() => import('./pages/IntroPage.jsx'))
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'))
const DivinePage = lazy(() => import('./pages/DivinePage.jsx'))
const KarmaPage = lazy(() => import('./pages/KarmaPage.jsx'))
const DestinyPage = lazy(() => import('./pages/DestinyPage.jsx'))
const BrokenHourglassPage = lazy(() => import('./pages/BrokenHourglassPage.jsx'))

// Simple Loading Fallback (can be upgraded to a luxury loader)
const LoadingFallback = () => (
    <div style={{
        height: '100vh',
        width: '100vw',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontSize: '0.8rem'
    }}>
        Loading The Journey...
    </div>
)

function App() {
    return (
        <BrowserRouter>
            {/* GLOBAL LOGO */}
            <a href="/" className="global-logo-link" style={{
                position: 'fixed',
                top: '1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 99999,
                display: 'block',
                cursor: 'pointer',
                opacity: 0.9,
                mixBlendMode: 'difference' // Ensures visibility on light/dark backgrounds
            }}>
                <img
                    src="/backgrounds/website-logo.png"
                    alt="OWN KARMA"
                    style={{
                        height: '40px',
                        width: 'auto',
                        objectFit: 'contain'
                    }}
                />
            </a>

            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/" element={<IntroPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/divine" element={<DivinePage />} />
                    <Route path="/karma-eye" element={<KarmaPage />} />
                    <Route path="/destiny" element={<DestinyPage />} />
                    <Route path="/broken-hourglass" element={<BrokenHourglassPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App
