import React from 'react'

function StatusCards() {
    return (
        <div className="status-cards">
            <div className="status-card">
                <p className="status-label">SYSTEM STATUS</p>
                <div className="status-value">
                    <span className="status-indicator"></span>
                    <span>OPERATIONAL</span>
                </div>
            </div>
            <div className="status-card">
                <p className="status-label">CURRENT ROLE</p>
                <div className="status-value role">
                    <span>NETWORK ENGINEER</span>
                </div>
            </div>
        </div>
    )
}

export default StatusCards
