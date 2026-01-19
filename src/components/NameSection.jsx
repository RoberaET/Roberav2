import React, { useState, useEffect } from 'react'

function NameSection() {
    const [text, setText] = useState('')
    const fullText = 'ROBERA MEKONNEN'

    useEffect(() => {
        let currentIndex = 0
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setText(fullText.slice(0, currentIndex))
                currentIndex++
            } else {
                clearInterval(interval)
            }
        }, 100) // Typing speed

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="name-section">
            <h1 className="name">
                {text}
                <span className="cursor-blink">_</span>
            </h1>
            <p className="protocol">[ PROTOCOL: PORTFOLIO.v2 ]</p>
            <a href="https://drive.google.com/file/d/1GsrziToK5DYab5E_m-4ZQNDujmC_38f3/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="cv-download-btn">
                <span className="btn-icon">📄</span>
                DOWNLOAD_CV.pdf
                <span className="download-arrow">↓</span>
            </a>
        </div>
    )
}

export default NameSection
