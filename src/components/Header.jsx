import React, { useState } from 'react'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)



    return (
        <header className="header">
            <div className="header-left">
                <div className="dots">
                    <span className="terminal-dot red"></span>
                    <span className="terminal-dot yellow"></span>
                    <span className="terminal-dot green"></span>
                </div>
                <span className="node-id">HEX_GHOST_01</span>
            </div>
            <div
                className="header-right"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
            >
                <button className={`menu-btn ${isMenuOpen ? 'active' : ''}`} aria-label="Toggle Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="8" y="4" width="3" height="16" rx="1.5" fill={isMenuOpen ? "#ffffff" : "#3b9eff"} />
                        <rect x="13" y="4" width="3" height="16" rx="1.5" fill={isMenuOpen ? "#ffffff" : "#3b9eff"} />
                        <rect x="18" y="4" width="3" height="16" rx="1.5" fill={isMenuOpen ? "#ffffff" : "#3b9eff"} />
                    </svg>
                </button>

                {isMenuOpen && (
                    <div className="cyber-menu">
                        <a href="#" className="cyber-menu-item">
                            <span className="cyber-prefix">//</span> SYSTEM_ROOT
                            <span className="cyber-desc">HOME DASHBOARD</span>
                        </a>
                        <a href="#about" className="cyber-menu-item">
                            <span className="cyber-prefix">//</span> IDENTITY_PROTOCOL
                            <span className="cyber-desc">ABOUT ME</span>
                        </a>
                        <a href="#projects" className="cyber-menu-item">
                            <span className="cyber-prefix">//</span> NETWORK_GRID
                            <span className="cyber-desc">PROJECTS & LABS</span>
                        </a>
                        <a href="#contact" className="cyber-menu-item">
                            <span className="cyber-prefix">//</span> SECURE_UPLINK
                            <span className="cyber-desc">ESTABLISH CONTACT</span>
                        </a>
                        <a href="#resume" className="cyber-menu-item">
                            <span className="cyber-prefix">//</span> SYSTEM_LOGS
                            <span className="cyber-desc">RESUME / CV</span>
                        </a>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header
