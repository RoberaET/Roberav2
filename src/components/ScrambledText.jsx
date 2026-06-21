import React, { useEffect, useRef, useState } from 'react'
import '../styles/ScrambledText.css'

function ScrambledText({
    children,
    className = '',
    radius = 100,
    duration = 1.2,
    speed = 0.5,
    scrambleChars = '.:'
}) {
    const containerRef = useRef(null)
    const [chars, setChars] = useState([])
    const [isHovering, setIsHovering] = useState(false)
    const animationFrameRef = useRef(null)
    const timeRef = useRef(0)

    // Initialize characters
    useEffect(() => {
        if (!containerRef.current) return

        const text = children.toString()
        const charElements = text.split('').map((char, index) => ({
            char,
            index,
            finalChar: char,
            currentChar: char,
            isScrambling: false,
            progress: 1 // Start fully visible
        }))

        setChars(charElements)
    }, [children])

    // Handle animation when hovering
    useEffect(() => {
        if (!isHovering) {
            // Reset when not hovering
            timeRef.current = 0
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
                animationFrameRef.current = null
            }

            setChars(prevChars =>
                prevChars.map(charData => ({
                    ...charData,
                    currentChar: charData.finalChar,
                    isScrambling: false,
                    progress: 1
                }))
            )
            return
        }

        // Start scramble animation
        timeRef.current = 0

        const animate = () => {
            timeRef.current += 0.016 // ~60fps

            setChars(prevChars =>
                prevChars.map((charData, idx) => {
                    const { char, index, finalChar } = charData

                    // Calculate if this character should be scrambling
                    const shouldScramble = timeRef.current * speed < duration

                    if (shouldScramble && char !== ' ') {
                        // Pick random scramble character
                        const scrambleChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)]

                        // Calculate progress (0 to 1)
                        const progress = Math.min(1, (timeRef.current * speed) / duration)
                        const charProgress = Math.max(0, progress - (index * 0.02))

                        if (charProgress < 1) {
                            return {
                                ...charData,
                                currentChar: scrambleChar,
                                isScrambling: true,
                                progress: 1 // Keep full opacity during scramble
                            }
                        }
                    }

                    return {
                        ...charData,
                        currentChar: finalChar,
                        isScrambling: false,
                        progress: 1
                    }
                })
            )

            if (timeRef.current * speed < duration + 0.5) {
                animationFrameRef.current = requestAnimationFrame(animate)
            }
        }

        // Start animation
        animationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [isHovering, duration, speed, scrambleChars])

    const handleMouseEnter = () => {
        setIsHovering(true)
    }

    const handleMouseLeave = () => {
        setIsHovering(false)
    }

    return (
        <div
            ref={containerRef}
            className={`text-block ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {chars.map((charData, idx) => (
                <span
                    key={idx}
                    className="char"
                    style={{
                        opacity: charData.progress
                    }}
                >
                    {charData.currentChar === ' ' ? '\u00A0' : charData.currentChar}
                </span>
            ))}
        </div>
    )
}

export default ScrambledText
