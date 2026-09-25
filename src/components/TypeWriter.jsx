import React, { useState, useEffect } from 'react';

const TypeWriter = ({ text, speed = 100, delay = 0, infinite = false }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout;

        if (currentIndex === 0 && !isDeleting) {
            // Initial delay before start typing
            if (displayText === '') {
                timeout = setTimeout(() => {
                    setDisplayText(prev => prev + text[0]);
                    setCurrentIndex(1);
                }, delay + speed);
                return () => clearTimeout(timeout);
            }
        }

        if (currentIndex < text.length && !isDeleting) {
            timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);
        } else if (isDeleting && currentIndex > 0) {
            // ... deleting logic
        } else if (infinite && currentIndex === text.length) {
            timeout = setTimeout(() => {
                setDisplayText('');
                setCurrentIndex(0);
            }, 3000);
        }

        return () => clearTimeout(timeout);
    }, [currentIndex, isDeleting, text, speed, infinite, delay]);

    return <span>{displayText}</span>;
};

export default TypeWriter;
