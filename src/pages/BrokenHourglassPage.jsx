import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { medusa } from '../lib/medusa'
import '../styles/divine.css'

function BrokenHourglassPage() {
    const navigate = useNavigate()
    const containerRef = useRef(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Fetch products from Medusa
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const collectionsResponse = await medusa.collections.list()
            // Look for "Broken Hourglass" collection (adjust search term if needed)
            const brokenCollection = collectionsResponse.collections.find(
                col => col.title.toLowerCase().includes('broken')
            )

            if (!brokenCollection) {
                setProducts([])
                setLoading(false)
                return
            }

            const response = await medusa.products.list({
                collection_id: [brokenCollection.id]
            })

            setProducts(response.products || [])
            setLoading(false)
        } catch (error) {
            console.error('Error fetching products:', error)
            setError(error.message)
            setLoading(false)
        }
    }

    const handleBack = () => {
        navigate('/')
    }

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`)
    }

    return (
        <div className="divine-page-scroll" ref={containerRef}>
            {/* Back Button */}
            <button className="back-button" onClick={handleBack}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>

            {/* Video Section */}
            <section className="video-section">
                <video
                    src="/video/dvine-main.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0
                    }}
                />

                {/* Header */}
                <header className="divine-header">
                    <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>BROKEN HOURGLASS</h1>
                    <p>Time's Final Surrender</p>
                </header>

                {/* Cloud Transition Effect */}
                <div className="cloud-transition"></div>
            </section>

            {/* Content Sections */}
            <section className="content-section ideation-section">
                <div className="content-container">
                    <div className="content-text">
                        <span className="section-label">PHILOSOPHY</span>
                        <h2>Embracing the beauty of the finite.</h2>
                        <p>
                            <strong>Broken Hourglass</strong> challenges our perception of time.
                            It is not about counting the seconds, but making the seconds count.
                            A tribute to impermanence and the urgency of now.
                        </p>
                    </div>
                    <div className="content-image">
                        <div className="image-placeholder">
                            {/* Placeholder image for Broken Hourglass */}
                            <img src="/backgrounds/4.png" alt="Broken Hourglass Concept" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section engineering-section">
                <div className="content-container reverse">
                    <div className="content-image">
                        <div className="image-placeholder">
                            {/* Placeholder image for Broken Hourglass Detail */}
                            <img src="/backgrounds/2.png" alt="Broken Hourglass Detail" />
                        </div>
                    </div>
                    <div className="content-text">
                        <span className="section-label">EXPERIENCE</span>
                        <h2>Timeless design for the modern age.</h2>
                        <p>
                            Shattering conventions to reveal the essence of elegance.
                            The <strong>Broken Hourglass</strong> collection is built for those
                            who live beyond the constraints of the clock.
                        </p>
                    </div>
                </div>
            </section>

            {/* Products Section - Connected to Backend */}
            <section className="products-section">
                <div className="products-container">
                    <div className="products-header">
                        <h2>Broken Hourglass Collection</h2>
                        <p>Limited editions for the bold</p>
                    </div>

                    {loading ? (
                        <div className="products-loading">
                            <p>Loading products...</p>
                        </div>
                    ) : error ? (
                        <div className="products-loading">
                            <p style={{ color: '#ff6b6b' }}>Error: {error}</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '1rem' }}>
                                Check browser console for details
                            </p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products && products.length > 0 ? (
                                products.map((product) => {
                                    const image = product.thumbnail || product.images?.[0]?.url
                                    const price = product.variants?.[0]?.prices?.[0]

                                    return (
                                        <div
                                            key={product.id}
                                            className="product-card"
                                            onClick={() => handleProductClick(product.id)}
                                        >
                                            <div className="product-image">
                                                {image ? (
                                                    <img src={image} alt={product.title} />
                                                ) : (
                                                    <div className="product-image-placeholder">
                                                        <span>No Image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="product-info">

                                                {product.subtitle && (
                                                    <p className="product-subtitle">{product.subtitle}</p>
                                                )}
                                                {price && (
                                                    <p className="product-price">
                                                        {new Intl.NumberFormat('en-US', {
                                                            style: 'currency',
                                                            currency: price.currency_code.toUpperCase()
                                                        }).format(price.amount / 100)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="products-loading">
                                    <p>No products found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default BrokenHourglassPage
