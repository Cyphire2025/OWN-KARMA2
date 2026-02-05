import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/divine.css'

function DestinyPage() {
    const navigate = useNavigate()
    const containerRef = useRef(null)

    const handleBack = () => {
        navigate('/')
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
                    src="/video/Destiny.mp4"
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

                {/* Header Overlay */}
                <header className="divine-header">
                    <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>DESTINY</h1>
                    <p>Written In The Stars</p>
                </header>

                {/* Cloud Transition Effect */}
                <div className="cloud-transition"></div>
            </section>

            {/* Content Sections */}
            <section className="content-section ideation-section">
                <div className="content-container">
                    <div className="content-text">
                        <span className="section-label">VISION</span>
                        <h2>The path is not found, it is forged by the choices we make.</h2>
                        <p>
                            <strong>Destiny</strong> is not a predetermined conclusion, but a canvas
                            waiting for your brushstroke. It embodies the courage to embrace the unknown
                            and the wisdom to trust the journey.
                        </p>
                    </div>
                    <div className="content-image">
                        <div className="image-placeholder">
                            {/* Placeholder or specific image */}
                            <img src="/backgrounds/3.png" alt="Destiny Concept" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section engineering-section">
                <div className="content-container reverse">
                    <div className="content-image">
                        <div className="image-placeholder">
                            {/* Placeholder or specific image */}
                            <img src="/backgrounds/4.png" alt="Destiny Detail" />
                        </div>
                    </div>
                    <div className="content-text">
                        <span className="section-label">REFLECTION</span>
                        <h2>A constellation of moments, aligning to form your truth.</h2>
                        <p>
                            Every thread woven with intention. <strong>Destiny</strong> reminds us that
                            while we may not control the stars, we can steer the ship. It is an
                            ode to those who dare to write their own story.
                        </p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <h2>Shape Your Future</h2>
                <p>The stars align for those who act. Claim your path.</p>
                <button className="cta-button">Explore Collection</button>
            </section>

        </div>
    )
}

export default DestinyPage
