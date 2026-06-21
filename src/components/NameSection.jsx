import React from 'react'
import Shuffle from './Shuffle'

function NameSection() {
    return (
        <div className="name-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '16px' }}>
                <Shuffle
                  text="ROBERA MEKONNEN"
                  tag="h1"
                  className="name"
                  shuffleDirection="right"
                  duration={0.4}
                  animationMode="evenodd"
                  shuffleTimes={3}
                  ease="power3.out"
                  stagger={0.05}
                  threshold={0.1}
                  triggerOnce={true}
                  triggerOnHover={true}
                  style={{
                      fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                      color: '#3b9eff',
                      textShadow: '0 0 20px rgba(59, 158, 255, 0.4)'
                  }}
                />
            </div>
            <p className="protocol" style={{ marginTop: '0' }}>[ PROTOCOL: PORTFOLIO.v2 ]</p>
            <a href="https://drive.google.com/file/d/1GsrziToK5DYab5E_m-4ZQNDujmC_38f3/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="cv-download-btn">
                <span className="btn-icon">📄</span>
                DOWNLOAD_CV.pdf
                <span className="download-arrow">↓</span>
            </a>
        </div>
    )
}

export default NameSection
