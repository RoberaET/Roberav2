import React from 'react'

function SecureBadge() {
    return (
        <div className="secure-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L3 3.5V7C3 10.5 5.5 13.5 8 14.5C10.5 13.5 13 10.5 13 7V3.5L8 1Z" stroke="#3fb950" strokeWidth="1.5" fill="none" />
                <path d="M6 8L7.5 9.5L10 6.5" stroke="#3fb950" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>SECURE CONNECTION ESTABLISHED</span>
        </div>
    )
}

export default SecureBadge
