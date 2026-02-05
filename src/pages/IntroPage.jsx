import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import '../styles/divine.css'
import '../styles/IntroPage.css' // New CSS file
import Sidebar from '../components/Sidebar'
import GlobalAudioController from '../components/GlobalAudioController'

const STAGES = [
    {
        id: 0,
        video: '/video/intro.webm',
        text1: "LIVING CONSCIOUSLY",
        text2: "BUILDING OWN KARMA",
        baseSpeed: 2.0,
        framesPerScroll: 60,
        loop: false
    },
    {
        id: 1,
        video: '/video/dvine-main.webm',
        text1: "We do not stand above creation",
        text2: "We live inside it",
        baseSpeed: 1.0,
        framesPerScroll: 24,
        loop: false
    },
    {
        id: 2,
        video: '/video/Karmaeye.webm',
        text1: "Awareness is not given",
        text2: "It is built",
        baseSpeed: 1.0,
        framesPerScroll: 24,
        loop: false
    },
    {
        id: 3,
        video: '/video/Destiny.webm',
        text1: "Walls are built by fear",
        text2: "Freedom begins with action",
        baseSpeed: 1.0,
        framesPerScroll: 24,
        loop: false
    },
    {
        id: 4,
        video: '/video/anime.webm',
        text1: "Life is not linear",
        text2: "It is lived in phases",
        baseSpeed: 2.0,
        framesPerScroll: 60,
        loop: false
    }
]

function IntroPage() {
    const navigate = useNavigate()
    const progressRef = useRef(null)
    const [stage, setStage] = useState(0)

    // UI State
    const [isLoading, setIsLoading] = useState(true)
    const [loadedCount, setLoadedCount] = useState(0)
    const [showButton, setShowButton] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [loadedVideos, setLoadedVideos] = useState({}) // Track which videos are ready

    // References
    const videoRefs = useRef([])

    // --- SMART LOADING (JIT) ---
    useEffect(() => {
        const checkLoadStatus = () => {
            // 1. Check if first video is ready to start experience
            const v0 = videoRefs.current[0]
            if (v0 && v0.readyState >= 3) {
                setIsLoading(false)
            }

            // 2. Update individual loaded states
            const newLoadedState = {}
            let validCount = 0
            videoRefs.current.forEach((v, idx) => {
                // Mark as loaded if readyState is sufficient. 
                // We accumulate state so we don't toggle back to false (prevent flickering)
                if (v && v.readyState >= 3) {
                    newLoadedState[idx] = true
                    validCount++
                }
            })

            setLoadedVideos(prev => ({ ...prev, ...newLoadedState }))
            setLoadedCount(validCount)
        }

        const checkInterval = setInterval(checkLoadStatus, 500)

        // Event listeners for fast reaction
        const handlers = []
        videoRefs.current.forEach((video, idx) => {
            if (!video) return
            const handler = () => {
                setLoadedVideos(prev => ({ ...prev, [idx]: true }))
                checkLoadStatus()
            }
            // Listen for ready/canplay events
            video.addEventListener('canplaythrough', handler)
            video.addEventListener('loadeddata', handler)
            handlers[idx] = handler
        })

        const timeout = setTimeout(() => setIsLoading(false), 8000)

        return () => {
            clearInterval(checkInterval)
            clearTimeout(timeout)
            videoRefs.current.forEach((video, idx) => {
                if (video && handlers[idx]) {
                    video.removeEventListener('canplaythrough', handlers[idx])
                    video.removeEventListener('loadeddata', handlers[idx])
                }
            })
        }
    }, [])

    // --- HYBRID ENGINE & LOGIC RESTORED ---
    const isScrubbing = useRef(false)
    const scrubTimeout = useRef(null)
    const targetTime = useRef(0)

    // Manage Video State on Stage Change
    useEffect(() => {
        const v = videoRefs.current[stage]
        if (!v) return

        videoRefs.current.forEach((video, idx) => {
            if (!video) return
            if (idx === stage) {
                // Active Video
                video.classList.add('active')
                video.currentTime = 0
                video.playbackRate = STAGES[stage].baseSpeed
                // Only play if not loading - OR if we are in "Smart Load" mode and this specific video is ready
                if (!isLoading) video.play().catch(() => { })
            } else {
                // Inactive Video
                video.classList.remove('active')
                video.pause()
                video.currentTime = 0
            }
        })
        setShowButton(false)
        targetTime.current = 0
        isScrubbing.current = false
    }, [stage, isLoading])

    // Logic Loop
    useEffect(() => {
        gsap.ticker.lagSmoothing(0)

        const tick = () => {
            if (isLoading) return
            const v = videoRefs.current[stage]
            if (!v || isNaN(v.duration)) return

            // --- MODE SWITCHING ---

            if (isScrubbing.current) {
                // SCRUB MODE: Manual Seek
                const diff = targetTime.current - v.currentTime
                if (Math.abs(diff) > 0.01) {
                    v.currentTime += diff * 0.2 // Lerp factor
                } else {
                    v.currentTime = targetTime.current
                }
            } else {
                // AUTO PLAY MODE: Native
                if (Math.abs(v.playbackRate - STAGES[stage].baseSpeed) > 0.01) {
                    v.playbackRate = STAGES[stage].baseSpeed
                }
                targetTime.current = v.currentTime
            }

            // --- BOUNDS & UI ---
            if (v.currentTime >= v.duration - 0.1) {
                if (!STAGES[stage].loop) {
                    v.pause()
                    if (isScrubbing.current && targetTime.current > v.duration) targetTime.current = v.duration
                } else {
                    v.currentTime = 0
                }
            }

            // UI Updates
            if (v.duration) {
                const progress = v.currentTime / v.duration
                if (progress > 0.85) setShowButton(true)
                if (progressRef.current) progressRef.current.style.height = `${progress * 100}%`
                syncText(progress)
            }
        }

        gsap.ticker.add(tick)

        const handleWheel = (e) => {
            if (isLoading) return
            const v = videoRefs.current[stage]
            if (!v) return
            e.preventDefault()

            isScrubbing.current = true
            v.pause()

            if (scrubTimeout.current) clearTimeout(scrubTimeout.current)

            const frameDuration = 0.0333
            const config = STAGES[stage]
            const framesToAdd = config.framesPerScroll || 10
            const direction = e.deltaY > 0 ? 1 : -1
            const timeDelta = direction * framesToAdd * frameDuration

            targetTime.current += timeDelta

            if (targetTime.current < 0) targetTime.current = 0
            if (targetTime.current > v.duration) targetTime.current = v.duration

            scrubTimeout.current = setTimeout(() => {
                isScrubbing.current = false
                if (targetTime.current < v.duration - 0.1) {
                    v.play().catch(() => { })
                }
            }, 100)

            // --- TRANSITIONS ---
            if (stage < STAGES.length - 1 && targetTime.current >= v.duration - 0.1 && e.deltaY > 20) {
                clearTimeout(scrubTimeout.current)
                if (stage === 0) return
                transitionToStage(stage + 1)
            }
            if (stage > 0 && targetTime.current <= 0.1 && e.deltaY < -20) {
                clearTimeout(scrubTimeout.current)
                transitionToStage(stage - 1)
            }
        }

        window.addEventListener('wheel', handleWheel, { passive: false })

        return () => {
            gsap.ticker.remove(tick)
            window.removeEventListener('wheel', handleWheel)
            if (scrubTimeout.current) clearTimeout(scrubTimeout.current)
            if (scrubTimeout.current) clearTimeout(scrubTimeout.current)
        }
    }, [stage, isLoading])


    const transitionToStage = (nextStage) => {
        setStage(nextStage)
    }

    const syncText = (progress) => {
        const t1 = document.getElementById('stage-text-1')
        const t2 = document.getElementById('stage-text-2')
        if (t1) t1.style.opacity = (progress > 0.15 && progress < 0.45) ? 1 : 0
        if (t2) t2.style.opacity = (progress > 0.55 && progress < 0.85) ? 1 : 0
    }

    const handleExploreProducts = () => {
        const overlay = document.createElement('div')
        overlay.className = 'transition-overlay'
        document.body.appendChild(overlay)
        setTimeout(() => overlay.style.opacity = '1', 10)
        setTimeout(() => {
            navigate('/products')
            setTimeout(() => {
                overlay.style.opacity = '0'
                setTimeout(() => overlay.remove(), 600)
            }, 100)
        }, 600)
    }

    return (
        <>
            {/* --- LOADING SCREEN (Global) --- */}
            <div className="loading-screen" style={{ opacity: isLoading ? 1 : 0, pointerEvents: isLoading ? 'auto' : 'none' }}>
                <div className="loading-text">
                    Initializing Journey
                </div>
                <div className="loading-bar-track">
                    <div className="loading-bar-fill" style={{ width: isLoading ? '30%' : '100%' }} />
                </div>
            </div>

            <div className="intro-page-container" style={{
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 1s ease 0.5s' // 0.5s delay to let loader finish
            }}>

                {/* --- VIDEO CONTAINER --- */}
                <div className="video-container">
                    {STAGES.map((s, idx) => {
                        const isActive = idx === stage
                        // Use a generic poster if specific one not defined
                        const posterImage = s.poster || `/backgrounds/${idx + 1}.png`
                        const isLoaded = loadedVideos[idx] // Check persistent React state

                        return (
                            <div key={s.id} className={`stage-video-wrapper ${isActive ? 'active' : ''}`} style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                opacity: isActive ? 1 : 0,
                                zIndex: isActive ? 10 : 0,
                                transition: 'opacity 0.6s ease'
                            }}>
                                {/* Placeholder / Visual Buffer */}
                                {/* Only show if NOT loaded. Once loaded, it's gone forever. */}
                                <div
                                    className="video-placeholder"
                                    style={{
                                        background: 'black', // Solid black buffer instead of image
                                        position: 'absolute', inset: 0,
                                        zIndex: 2, transition: 'opacity 0.8s ease',
                                        opacity: isLoaded ? 0 : 1,
                                        pointerEvents: 'none'
                                    }}
                                />

                                <video
                                    ref={el => videoRefs.current[idx] = el}
                                    preload={idx <= 1 ? "auto" : "metadata"}
                                    muted
                                    playsInline
                                    loop={s.loop}
                                    style={{
                                        objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1
                                    }}
                                >
                                    {/* Pioritize WebM (Default) */}
                                    <source src={s.video} type="video/webm" />
                                    {/* Fallback to MP4 */}
                                    <source src={s.video.replace('.webm', '.mp4')} type="video/mp4" />
                                </video>
                            </div>
                        )
                    })}
                </div>

                {/* Overlays */}
                <>
                    <div id="stage-text-1" className="stage-text-overlay">
                        <h2>{STAGES[stage].text1}</h2>
                    </div>
                    <div id="stage-text-2" className="stage-text-overlay">
                        <h2>{STAGES[stage].text2}</h2>
                    </div>

                    <div className={`explore-button-wrapper ${showButton ? 'visible' : ''}`}>
                        <button
                            onClick={() => {
                                if (stage === 4) handleExploreProducts()
                                else transitionToStage(stage + 1)
                            }}
                            className="explore-button"
                        >
                            {stage === 0 && "Explore Chapter 1"}
                            {stage === 1 && "Explore Chapter 2"}
                            {stage === 2 && "Explore Chapter 3"}
                            {stage === 3 && "Explore Chapter 4"}
                            {stage === 4 && "Explore All Chapters"}
                        </button>
                    </div>
                </>

                {/* Progress Dots */}
                <div className="progress-dots">
                    {STAGES.map((s, idx) => {
                        const isActive = stage === idx;
                        return (
                            <div key={idx} onClick={() => setStage(idx)} className="dot-item">
                                {isActive ? (
                                    <div className="dot-active">
                                        <div ref={progressRef} className="dot-fill" />
                                    </div>
                                ) : (
                                    <div className="dot-inactive" />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Components */}
                <GlobalAudioController />

                <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

                <div onClick={() => setMenuOpen(!menuOpen)} className="menu-burger">
                    <div className="menu-line"></div>
                    <div className="menu-line"></div>
                </div>

                {/* Transition Overlay CSS */}
                <style>{`
                .transition-overlay { position: fixed; inset:0; background:black; z-index:100000; opacity:0; transition:opacity 0.6s ease; pointer-events:none; }
            `}</style>
            </div>
        </>
    )
}

export default IntroPage
