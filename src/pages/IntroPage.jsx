import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import '../styles/divine.css'

const STAGES = [
    {
        id: 0,
        video: '/video/intro.mp4',
        text1: "LIVING CONSCIOUSLY",
        text2: "BUILDING OWN KARMA",
        baseSpeed: 2.0,
        framesPerScroll: 60,
        loop: false
    },
    {
        id: 1,
        video: '/video/dvine-main.mp4',
        text1: "We do not stand above creation",
        text2: "We live inside it",
        baseSpeed: 1.0,
        framesPerScroll: 24,
        loop: false
    },
    {
        id: 2,
        video: '/video/Karmaeye.mp4',
        text1: "Awareness is not given",
        text2: "It is built",
        baseSpeed: 1.0,
        framesPerScroll: 24,
        loop: false
    },
    {
        id: 3,
        video: '/video/Destiny.mp4',
        text1: "Walls are built by fear",
        text2: "Freedom begins with action",
        baseSpeed: 1.0,
        framesPerScroll: 24,
        loop: false
    },
    {
        id: 4,
        video: '/video/anime.mp4',
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
    const [isMuted, setIsMuted] = useState(true)

    // References
    const videoRefs = useRef([])
    const toggleRef = useRef(null)

    // --- AUDIO SYSTEM ---
    const audioRef = useRef(null)
    useEffect(() => {
        const audio = document.createElement('audio')
        audio.src = '/audio/background1.mp3'
        audio.loop = true
        audio.volume = 0.5
        audio.preload = 'auto'
        audio.style.display = 'none'
        audio.muted = true
        document.body.appendChild(audio)
        audioRef.current = audio

        audio.play().catch(() => { })

        return () => {
            if (document.body.contains(audio)) document.body.removeChild(audio)
        }
    }, [])

    const toggleAudio = () => {
        if (!audioRef.current) return
        const newMutedState = !isMuted
        setIsMuted(newMutedState)
        audioRef.current.muted = newMutedState
        if (!newMutedState) audioRef.current.play().catch(() => { })
    }

    // --- LOADING ---
    useEffect(() => {
        let loaded = 0
        const total = STAGES.length
        setLoadedCount(0)

        const handleLoad = () => {
            loaded++
            setLoadedCount(prev => Math.min(prev + 1, total))
            if (loaded >= total) setTimeout(() => setIsLoading(false), 500)
        }

        videoRefs.current.forEach(video => {
            if (!video) return
            if (video.readyState >= 3) {
                handleLoad()
            } else {
                video.addEventListener('canplaythrough', handleLoad, { once: true })
                video.addEventListener('error', handleLoad, { once: true })
            }
        })

        const timeout = setTimeout(() => setIsLoading(false), 20000)
        return () => clearTimeout(timeout)
    }, [])


    // --- HYBRID ENGINE ---
    const isScrubbing = useRef(false)
    const scrubTimeout = useRef(null)
    const targetTime = useRef(0)

    // Manage Video State on Stage Change
    useEffect(() => {
        const v = videoRefs.current[stage]

        videoRefs.current.forEach((video, idx) => {
            if (!video) return
            if (idx === stage) {
                video.style.opacity = 1
                video.style.zIndex = 10
                video.currentTime = 0
                video.playbackRate = STAGES[stage].baseSpeed
                if (!isLoading) video.play().catch(() => { })
            } else {
                video.style.opacity = 0
                video.style.zIndex = 0
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
                // We lerp current time to target time for smoothness
                const diff = targetTime.current - v.currentTime
                if (Math.abs(diff) > 0.01) {
                    v.currentTime += diff * 0.2 // Lerp factor
                } else {
                    v.currentTime = targetTime.current
                }
            } else {
                // AUTO PLAY MODE: Native
                // Reset playback rate if needed (browsers sometimes reset it)
                if (Math.abs(v.playbackRate - STAGES[stage].baseSpeed) > 0.01) {
                    v.playbackRate = STAGES[stage].baseSpeed
                }

                // Sync targetTime to actual time so next scroll is seamless
                targetTime.current = v.currentTime
            }

            // --- BOUNDS & UI ---

            // End Detection
            if (v.currentTime >= v.duration - 0.1) {
                if (!STAGES[stage].loop) {
                    v.pause()
                    // If scrubbing, we might be forcing it past end, clamp it
                    if (isScrubbing.current && targetTime.current > v.duration) targetTime.current = v.duration
                } else {
                    // Loop logic if we ever enabled it
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

            // 1. Enter Scrub Mode
            isScrubbing.current = true
            v.pause()

            // Clear existing resume timer
            if (scrubTimeout.current) clearTimeout(scrubTimeout.current)

            // 2. Calculate New Target
            // 30fps = 0.033s
            const frameDuration = 0.0333
            const config = STAGES[stage]
            const framesToAdd = config.framesPerScroll || 10

            // Delta calculation
            const direction = e.deltaY > 0 ? 1 : -1
            const timeDelta = direction * framesToAdd * frameDuration

            // Apply to Target
            targetTime.current += timeDelta

            // Clamp Target
            if (targetTime.current < 0) targetTime.current = 0
            if (targetTime.current > v.duration) targetTime.current = v.duration

            // 3. Set Resume Timer
            // If no scroll for 100ms, resume auto-play
            scrubTimeout.current = setTimeout(() => {
                isScrubbing.current = false
                // Only resume if not at end
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

    // Styles
    const wrapperStyle = {
        position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
        zIndex: 50, textAlign: 'center', opacity: 0, transition: 'opacity 1s ease', pointerEvents: 'none'
    }

    const buttonStyle = {
        background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.3)',
        color: 'white', padding: '1rem 2rem', textTransform: 'uppercase', letterSpacing: '0.2em',
        cursor: 'pointer', backdropFilter: 'blur(5px)', transition: 'all 0.3s ease',
        fontSize: '0.8rem', borderRadius: '9999px'
    }

    return (
        <div style={{ width: '100vw', height: '100vh', background: 'black', overflow: 'hidden', position: 'relative' }}>

            {/* --- LOADING SCREEN --- */}
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'black', zIndex: 100000,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                opacity: isLoading ? 1 : 0,
                pointerEvents: isLoading ? 'auto' : 'none',
                transition: 'opacity 0.8s ease'
            }}>
                <div style={{ color: 'white', letterSpacing: '0.3em', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Loading  Experience
                </div>
                <div style={{ width: '200px', height: '2px', background: '#222', position: 'relative' }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, height: '100%', background: 'white', transition: 'width 0.3s ease',
                        width: `${(loadedCount / STAGES.length) * 100}%`
                    }} />
                </div>
            </div>

            {/* --- VIDEO CONTAINER --- */}
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                {STAGES.map((s, idx) => (
                    <video
                        key={s.id}
                        ref={el => videoRefs.current[idx] = el}
                        src={s.video}
                        preload="auto" // We force preload all since we explicitly wait for them
                        muted
                        playsInline
                        style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            objectFit: 'cover',
                            opacity: idx === stage ? 1 : 0,
                            // Quick fade to avoid 'persistence of vision' overlap artifacts with videos
                            transition: 'opacity 0.5s ease',
                            pointerEvents: 'none'
                        }}
                    />
                ))}
            </div>

            {/* Overlays */}
            <>
                <div id="stage-text-1" className="stage-text" style={textStyle}>
                    <h2 style={h2Style}>{STAGES[stage].text1}</h2>
                </div>
                <div id="stage-text-2" className="stage-text" style={textStyle}>
                    <h2 style={h2Style}>{STAGES[stage].text2}</h2>
                </div>

                <div style={{ ...wrapperStyle, opacity: showButton ? 1 : 0, pointerEvents: showButton ? 'auto' : 'none' }}>
                    <button
                        onClick={() => {
                            if (stage === 4) handleExploreProducts()
                            else transitionToStage(stage + 1, 'next')
                        }}
                        style={buttonStyle}
                        onMouseEnter={(e) => { e.target.style.background = 'white'; e.target.style.color = 'black' }}
                        onMouseLeave={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.3)'; e.target.style.color = 'white' }}
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
            <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 9999 }}>
                {STAGES.map((s, idx) => {
                    const isActive = stage === idx;
                    return (
                        <div key={idx} onClick={() => setStage(idx)} style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', padding: '4px' }}>
                            {isActive ? (
                                <div style={{ width: '6px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '99px', position: 'relative' }}>
                                    <div ref={progressRef} style={{ width: '100%', background: '#fff', borderRadius: '99px', position: 'absolute', top: 0, height: '0%' }} />
                                </div>
                            ) : (
                                <div style={{ width: '6px', height: '6px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }} />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Icons */}
            <div onClick={toggleAudio} ref={toggleRef} style={iconStyle}>
                {isMuted ? <MutedIcon /> : <SpeakerIcon />}
            </div>
            <div onClick={() => setMenuOpen(!menuOpen)} style={{ ...iconStyle, left: '2.5rem', right: 'auto' }}>
                <div style={{ width: '100%', height: '1px', background: 'white', marginBottom: '6px' }} />
                <div style={{ width: '100%', height: '1px', background: 'white' }} />
            </div>

            {/* Menu */}
            <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', zIndex: 99997, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none', transition: 'opacity 0.4s' }} />

            {/* --- SIDEBAR MENU DRAWER --- */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                maxWidth: '450px', // Sidebar Width
                height: '100vh',
                background: '#090909',
                zIndex: 99998,
                transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)', // Slide Effect
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)', // Smooth Easing
                boxShadow: '10px 0 30px rgba(0,0,0,0.5)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                overflowY: 'auto'
            }}>
                <div style={{ width: '100%', padding: '2rem', paddingTop: '6rem' }}>
                    <h2 style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.15em',
                        marginBottom: '2rem',
                        fontFamily: 'sans-serif',
                        marginLeft: '5px' // Align with cards
                    }}>
                        ALL TIMEPIECES
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {[
                            { name: 'DIVINE', img: '/backgrounds/1.png', link: '/divine' },
                            { name: "KARMA'S EYE", img: '/backgrounds/2.png', link: '/karma-eye' },
                            { name: 'DESTINY', img: '/backgrounds/3.png', link: '/destiny' },
                            { name: 'BROKEN HOURGLASS', img: '/backgrounds/4.png', link: '/broken-hourglass' }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    setMenuOpen(false)
                                    // Navigate Logic
                                    navigate(item.link)
                                }}
                                style={{
                                    height: '140px',
                                    width: '100%',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {/* BG Image */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundImage: `url(${item.img})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    filter: 'brightness(0.6)',
                                    transition: 'transform 0.5s'
                                }} />

                                {/* Content */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    paddingRight: '3rem'
                                }}>
                                    <h3 style={{
                                        color: 'white',
                                        fontSize: '1.5rem',
                                        letterSpacing: '0.05em',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        {item.name}
                                        {/* Chevron Icon */}
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .transition-overlay { position: fixed; inset:0; background:black; z-index:100000; opacity:0; transition:opacity 0.6s ease; pointer-events:none; }
                .intro-text-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    text-align: center;
                    transition: opacity 0.5s ease;
                    pointer-events: none;
                    width: 100%;
                }
                .intro-text-overlay h2 {
                    font-size: clamp(1.5rem, 4vw, 3rem);
                    font-weight: 300;
                    letter-spacing: 0.5em;
                     text-shadow: 0 0 20px rgba(255,255,255,0.3);
                }
                .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
                .animate-bounce { animation: bounce 2s infinite; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes bounce { 
                    0%, 100% { transform: translateY(0); } 
                    50% { transform: translateY(10px); } 
                }
            `}</style>
        </div>
    )
}

const textStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none', transition: 'opacity 0.5s', opacity: 0, width: '100%', zIndex: 40 }
const h2Style = { fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontWeight: '300', letterSpacing: '0.4em', textTransform: 'uppercase', textShadow: '0 0 40px rgba(0,0,0,0.9)' }
const iconStyle = { position: 'absolute', top: '2.5rem', right: '2.5rem', zIndex: 99, cursor: 'pointer', width: '30px', display: 'flex', flexDirection: 'column', color: 'white', alignItems: 'center' }

const MutedIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 5L6 9H2V15H6L11 19V5Z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
const SpeakerIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 5L6 9H2V15H6L11 19V5Z" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>

export default IntroPage
