import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/karma.css'

function KarmaPage() {
    const navigate = useNavigate()
    const containerRef = useRef(null)

    const handleBack = () => {
        navigate('/')
    }

    return (
        <div className="karma-page-scroll" ref={containerRef}>
            {/* Back Button */}
            <button className="back-button" onClick={handleBack}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>

            {/* Video Section */}
            <section className="video-section">
                <video
                    src="/video/Karmaeye.mp4"
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
                <header className="karma-header">
                    <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>KARMA'S EYE</h1>
                    <p>Witness To Every Action</p>
                </header>

                {/* Cloud Transition Effect */}
                <div className="cloud-transition"></div>
            </section>

            {/* Content Sections */}
            <section className="content-section ideation-section">
                <div className="content-container">
                    <div className="content-text">
                        <span className="section-label">OBSERVATION</span>
                        <h2>The universe is not blind; it is watching.</h2>
                        <p>
                            <strong>Karma's Eye</strong> symbolizes the eternal witness. It reminds us
                            that every action, no matter how small, leaves a ripple in the fabric
                            of existence.
                        </p>
                    </div>
                </div>
            </section>

            <section className="content-section engineering-section">
                <div className="content-container reverse">
                    <div className="content-text">
                        <span className="section-label">REFLECTION</span>
                        <h2>What you put out is what returns.</h2>
                        <p>
                            A design that captures the cyclic nature of our reality.
                            Wear it as a reminder of your power to shape your own destiny through intentional action.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default KarmaPage
