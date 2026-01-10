import React, { useState } from 'react'
import GlareHover from './GlareHover/GlareHover'

function SecureUplink() {
    const [formState, setFormState] = useState({
        identity: '',
        frequency: '', // Email
        message: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        // Simulate transmission
        alert('TRANSMISSION ENCRYPTED AND SENT.')
    }

    return (
        <section className="uplink-section" id="contact">
            <div className="section-header-large">
                <span className="section-icon-large">📡</span>
                <h2>SECURE_UPLINK // CONTACT</h2>
            </div>

            <div className="uplink-grid">
                {/* Left Column: Social Nodes */}
                <div className="uplink-nodes">
                    <div className="cyber-card">
                        <div className="cyber-card-header">
                            <span className="cyber-title">ACTIVE_CHANNELS</span>
                        </div>
                        <div className="nodes-list">
                            <a href="mailto:robera@example.com" className="node-link">
                                <span className="node-icon">✉️</span>
                                <div className="node-info">
                                    <span className="node-label">DIRECT_FEED</span>
                                    <span className="node-value">robera.worku@example.com</span>
                                </div>
                                <span className="node-status">OPEN</span>
                            </a>
                            <a href="https://github.com/robera" target="_blank" rel="noopener noreferrer" className="node-link">
                                <span className="node-icon">🐙</span>
                                <div className="node-info">
                                    <span className="node-label">CODE_REPOSITORY</span>
                                    <span className="node-value">github.com/robera</span>
                                </div>
                                <span className="node-status">PUBLIC</span>
                            </a>
                            <a href="https://linkedin.com/in/robera" target="_blank" rel="noopener noreferrer" className="node-link">
                                <span className="node-icon">💼</span>
                                <div className="node-info">
                                    <span className="node-label">PROFESSIONAL_NET</span>
                                    <span className="node-value">linkedin.com/in/robera</span>
                                </div>
                                <span className="node-status">CONNECTED</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Column: Transmission Form */}
                <div className="uplink-form-container">
                    <GlareHover
                        className="form-card"
                        width="100%"
                        height="auto"
                        background="rgba(13, 17, 23, 0.6)"
                        borderRadius="12px"
                        borderColor="rgba(63, 185, 80, 0.3)"
                        transitionDuration={1500}
                    >
                        <div className="form-content">
                            <div className="cyber-card-header" style={{ marginBottom: '20px' }}>
                                <span className="cyber-title" style={{ color: '#3fb950' }}>TRANSMISSION_CONSOLE</span>
                            </div>

                            <form className="transmission-form" onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>UNKNOWN_IDENTITY // NAME</label>
                                    <input
                                        type="text"
                                        placeholder="Enter callsign..."
                                        value={formState.identity}
                                        onChange={(e) => setFormState({ ...formState, identity: e.target.value })}
                                    />
                                    <div className="scan-line"></div>
                                </div>

                                <div className="input-group">
                                    <label>RETURN_FREQUENCY // EMAIL</label>
                                    <input
                                        type="email"
                                        placeholder="Enter frequency..."
                                        value={formState.frequency}
                                        onChange={(e) => setFormState({ ...formState, frequency: e.target.value })}
                                    />
                                    <div className="scan-line"></div>
                                </div>

                                <div className="input-group">
                                    <label>DATA_PACKET // MESSAGE</label>
                                    <textarea
                                        placeholder="Input transmission data..."
                                        rows="4"
                                        value={formState.message}
                                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    ></textarea>
                                    <div className="scan-line"></div>
                                </div>

                                <button type="submit" className="cyber-button">
                                    <span className="btn-content">
                                        <span className="icon">🔒</span>
                                        ENCRYPT & SEND
                                    </span>
                                    <div className="btn-glitch"></div>
                                </button>
                            </form>
                        </div>
                    </GlareHover>
                </div>
            </div>
        </section>
    )
}

export default SecureUplink
