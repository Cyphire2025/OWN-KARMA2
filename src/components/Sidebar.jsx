import React from 'react'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate()

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
            />

            {/* Drawer */}
            <div className={`sidebar-drawer ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-content">
                    <h2 className="sidebar-title">
                        ALL CHAPTERS
                    </h2>

                    <div className="sidebar-links">
                        {[
                            { name: 'DIVINE', img: '/backgrounds/1.png', link: '/divine' },
                            { name: "KARMA'S EYE", img: '/backgrounds/2.png', link: '/karma-eye' },
                            { name: 'DESTINY', img: '/backgrounds/3.png', link: '/destiny' },
                            { name: 'BROKEN HOURGLASS', img: '/backgrounds/4.png', link: '/broken-hourglass' }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    onClose()
                                    navigate(item.link)
                                }}
                                className="sidebar-card"
                            >
                                {/* BG Image */}
                                <div
                                    className="sidebar-card-bg"
                                    style={{ backgroundImage: `url(${item.img})` }}
                                />

                                {/* Content */}
                                <div className="sidebar-card-content">
                                    <h3>
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
                .sidebar-backdrop {
                    position: fixed; 
                    inset: 0; 
                    background: rgba(0,0,0,0.5); 
                    backdrop-filter: blur(10px); 
                    z-index: 99997; 
                    opacity: 0; 
                    pointer-events: none; 
                    transition: opacity 0.4s;
                }
                .sidebar-backdrop.open {
                    opacity: 1;
                    pointer-events: auto;
                }

                .sidebar-drawer {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    max-width: 450px;
                    height: 100vh;
                    background: #090909;
                    z-index: 99998;
                    transform: translateX(-100%);
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 10px 0 30px rgba(0,0,0,0.5);
                    border-right: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    overflow-y: auto;
                    scrollbar-width: none;
                }
                .sidebar-drawer.open {
                    transform: translateX(0);
                }
                .sidebar-drawer::-webkit-scrollbar {
                    display: none;
                }

                .sidebar-content {
                    width: 100%;
                    padding: 2rem;
                    padding-top: min(6rem, 15vh);
                    padding-bottom: min(2rem, 5vh);
                }

                .sidebar-title {
                    color: rgba(255,255,255,0.7);
                    font-size: 0.8rem;
                    letter-spacing: 0.15em;
                    margin-bottom: min(2rem, 4vh);
                    font-family: sans-serif;
                    margin-left: 5px;
                }

                .sidebar-links {
                    display: flex;
                    flex-direction: column;
                    gap: min(1.2rem, 2vh);
                }

                .sidebar-card {
                    height: min(140px, 16vh);
                    width: 100%;
                    border-radius: 12px;
                    overflow: hidden;
                    position: relative;
                    cursor: pointer;
                    border: 1px solid rgba(255,255,255,0.1);
                    transition: transform 0.3s ease;
                }
                .sidebar-card:hover {
                    transform: scale(1.02);
                }

                .sidebar-card-bg {
                    position: absolute; 
                    inset: 0;
                    background-size: cover;
                    background-position: center;
                    filter: brightness(0.6);
                    transition: transform 0.5s;
                }
                
                .sidebar-card-content {
                    position: absolute; 
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding-right: 3rem;
                }

                .sidebar-card-content h3 {
                    color: white;
                    font-size: clamp(1rem, 4vw, 1.5rem);
                    letter-spacing: 0.05em;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                @media (max-width: 768px) {
                    .sidebar-drawer {
                        max-width: 100vw !important;
                    }
                }
            `}</style>
        </>
    )
}

export default Sidebar
