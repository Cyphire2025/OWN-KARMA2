import React, { useEffect, useRef, useState } from 'react'

const GlobalAudioController = () => {
    const [isMuted, setIsMuted] = useState(true)
    const audioRef = useRef(null)
    const [hasInteracted, setHasInteracted] = useState(false)

    useEffect(() => {
        const audio = document.createElement('audio')
        audio.src = '/audio/background1.mp3' // Ensure this path is correct
        audio.loop = true
        audio.volume = 0.5
        audio.preload = 'auto'
        audio.muted = true // Start muted for autoplay policy

        // Append to body or keep in ref (appending is safer for persistence)
        document.body.appendChild(audio)
        audioRef.current = audio

        // Attempt autoplay
        const playPromise = audio.play()
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Auto-play was prevented
                // console.log("Autoplay prevented")
            })
        }

        return () => {
            if (document.body.contains(audio)) document.body.removeChild(audio)
        }
    }, [])

    const toggleAudio = () => {
        if (!audioRef.current) return

        if (!hasInteracted) {
            // First interaction often unlocks audio context accurately
            setHasInteracted(true)
        }

        const newMutedState = !isMuted
        setIsMuted(newMutedState)
        audioRef.current.muted = newMutedState

        if (!newMutedState) {
            audioRef.current.play().catch(e => console.error("Audio play failed", e))
        }
    }

    return (
        <div
            onClick={toggleAudio}
            style={{
                position: 'fixed',
                top: '2.5rem',
                right: '2.5rem',
                zIndex: 99999,
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                opacity: 0.8,
                transition: 'opacity 0.3s'
            }}
            className="audio-controller"
        >
            {isMuted ? <MutedIcon /> : <SpeakerIcon />}
        </div>
    )
}

const MutedIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 5L6 9H2V15H6L11 19V5Z" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
)

const SpeakerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 5L6 9H2V15H6L11 19V5Z" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
)

export default GlobalAudioController
