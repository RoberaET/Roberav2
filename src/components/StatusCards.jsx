import React from 'react'
import TypeWriter from './TypeWriter'

function StatusCards() {
    return (
        <div className="status-cards">
            <div className="status-card">
                <p className="status-label">CURRENT ROLE</p>
                <div className="status-value role">
                    <span><TypeWriter text="NETWORK ENGINEER" speed={100} delay={1500} /></span>
                </div>
            </div>
            <div className="status-card">
                <p className="status-label">SYSTEM STATUS</p>
                <div className="status-value">
                    <span className="status-indicator"></span>
                    <span><TypeWriter text="OPERATIONAL" speed={150} /></span>
                </div>
            </div>
        </div>
    )
}

export default StatusCards
