import React from 'react'

function BottomNav() {
    return (
        <nav className="bottom-nav">
            <button className="nav-btn active">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="4" width="7" height="7" rx="1" fill="currentColor" />
                    <rect x="13" y="4" width="7" height="7" rx="1" fill="currentColor" />
                    <rect x="4" y="13" width="7" height="7" rx="1" fill="currentColor" />
                    <rect x="13" y="13" width="7" height="7" rx="1" fill="currentColor" />
                </svg>
            </button>
            <button className="nav-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <circle cx="6" cy="12" r="2" fill="currentColor" />
                    <circle cx="18" cy="12" r="2" fill="currentColor" />
                    <circle cx="12" cy="6" r="2" fill="currentColor" />
                    <circle cx="12" cy="18" r="2" fill="currentColor" />
                    <circle cx="6" cy="6" r="2" fill="currentColor" />
                    <circle cx="18" cy="18" r="2" fill="currentColor" />
                    <circle cx="6" cy="18" r="2" fill="currentColor" />
                    <circle cx="18" cy="6" r="2" fill="currentColor" />
                </svg>
            </button>
            <button className="nav-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                    <circle cx="7" cy="7" r="0.5" fill="currentColor" />
                </svg>
            </button>
            <button className="nav-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 7V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V7L12 2Z" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            </button>
        </nav>
    )
}

export default BottomNav
