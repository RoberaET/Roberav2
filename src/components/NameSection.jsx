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
        </div>
    )
}

export default NameSection
