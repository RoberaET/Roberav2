import React, { useState, useEffect } from 'react';

export default function FloatingMuteButton({ audioRef }) {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume]   = useState(0.35);
    const [ripple, setRipple]   = useState(false);

    const toggle = () => {
        if (!audioRef.current) return;
        const next = !isMuted;
        audioRef.current.muted = next;
        setIsMuted(next);
        // trigger ripple
        setRipple(true);
        setTimeout(() => setRipple(false), 600);
    };

    // Sync if audio element changes externally
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const sync = () => setIsMuted(audio.muted);
        audio.addEventListener('volumechange', sync);
        return () => audio.removeEventListener('volumechange', sync);
    }, [audioRef]);

    return (
        <div
            className="floating-mute"
            onClick={toggle}
            title={isMuted ? 'Unmute' : 'Mute'}
            style={{
                position: 'fixed',
                bottom: '36px',
                right: '36px',
                zIndex: 9999,
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(5, 11, 20, 0.85)',
                border: `1.5px solid ${isMuted ? 'rgba(255,68,68,0.6)' : 'rgba(59,157,255,0.5)'}`,
                boxShadow: isMuted
                    ? '0 0 18px rgba(255,68,68,0.3), inset 0 0 8px rgba(255,68,68,0.05)'
                    : '0 0 18px rgba(59,157,255,0.25), inset 0 0 8px rgba(59,157,255,0.05)',
                backdropFilter: 'blur(12px)',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.15s ease',
                userSelect: 'none',
                overflow: 'hidden',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            {/* Ripple */}
            {ripple && (
                <span style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: isMuted
                        ? 'rgba(255,68,68,0.25)'
                        : 'rgba(59,157,255,0.25)',
                    animation: 'muteRipple 0.6s ease-out forwards',
                    pointerEvents: 'none',
                }} />
            )}

            {/* Icon — SVG speaker */}
            <svg
                width="22" height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isMuted ? '#ff4444' : '#3B9DFF'}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'stroke 0.3s ease', position: 'relative', zIndex: 1 }}
            >
                {/* Speaker body */}
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />

                {isMuted ? (
                    /* X lines when muted */
                    <>
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                    </>
                ) : (
                    /* Sound waves when active */
                    <>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </>
                )}
            </svg>

            {/* Subtle pulse ring when unmuted */}
            {!isMuted && (
                <span style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '1px solid rgba(59,157,255,0.3)',
                    animation: 'mutePulse 2s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />
            )}
        </div>
    );
}
