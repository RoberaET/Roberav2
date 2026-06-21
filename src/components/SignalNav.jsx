import React, { useState, useEffect, useRef } from 'react';

const SECTIONS = [
    { id: 'top',              label: 'GATEWAY',  target: 'top'             },
    { id: 'core-router',      label: 'HERO',     target: 'core-router'     },
    { id: 'network-ops',      label: 'OPS',      target: 'network-ops'     },
    { id: 'data-center',      label: 'DATA',     target: 'data-center'     },
    { id: 'security-ops',     label: 'SEC',      target: 'security-ops'    },
    { id: 'command-terminal', label: 'CLI',      target: 'command-terminal'},
];

export default function SignalNav() {
    const [activeIdx, setActiveIdx]   = useState(0);
    const [displayed, setDisplayed]   = useState('GATEWAY');
    const [isTyping, setIsTyping]     = useState(false);
    const [ping, setPing]             = useState(1);
    const typingRef                   = useRef(null);

    // Scroll spy
    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY < 200) { setActiveIdx(0); return; }
            for (let i = SECTIONS.length - 1; i >= 0; i--) {
                if (SECTIONS[i].target === 'top') continue;
                const el = document.getElementById(SECTIONS[i].target);
                if (el && el.getBoundingClientRect().top <= 220) {
                    setActiveIdx(i); return;
                }
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Typewriter on section change
    useEffect(() => {
        const target = SECTIONS[activeIdx].label;
        if (typingRef.current) clearTimeout(typingRef.current);
        setIsTyping(true);
        setDisplayed('');
        let i = 0;
        const type = () => {
            if (i <= target.length) {
                setDisplayed(target.slice(0, i));
                i++;
                typingRef.current = setTimeout(type, 55);
            } else {
                setIsTyping(false);
                // Fake ping update
                setPing(Math.floor(Math.random() * 4) + 1);
            }
        };
        typingRef.current = setTimeout(type, 80);
        return () => clearTimeout(typingRef.current);
    }, [activeIdx]);

    const scrollTo = (idx) => {
        const target = SECTIONS[idx].target;
        if (target === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        const el = document.getElementById(target);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
    };

    return (
        <nav style={{
            position: 'sticky',
            top: '20px',
            zIndex: 1000,
            marginBottom: '60px',
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
        }}>
            <div style={{
                pointerEvents: 'all',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0',
                backgroundColor: 'rgba(3, 7, 14, 0.88)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(59,157,255,0.18)',
                borderRadius: '100px',
                padding: '0',
                boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,157,255,0.05), inset 0 1px 0 rgba(255,255,255,0.03)',
                fontFamily: 'var(--font-mono)',
                overflow: 'hidden',
            }}>

                {/* Left: live indicator */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '10px 16px',
                    borderRight: '1px solid rgba(59,157,255,0.1)',
                }}>
                    <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: 'var(--accent-green)',
                        boxShadow: '0 0 6px var(--accent-green)',
                        animation: 'blink 2s infinite',
                        flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1.5px' }}>LIVE</span>
                </div>

                {/* Center dot nav */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', gap: '12px' }}>
                    {SECTIONS.map((s, i) => {
                        const isActive = i === activeIdx;
                        const isPast   = i < activeIdx;
                        return (
                            <button
                                key={s.id}
                                onClick={() => scrollTo(i)}
                                title={s.label}
                                style={{
                                    width: isActive ? '28px' : '6px',
                                    height: '6px',
                                    borderRadius: '100px',
                                    backgroundColor: isActive
                                        ? 'var(--accent-green)'
                                        : isPast ? 'var(--accent-blue)' : '#1e2d45',
                                    boxShadow: isActive ? '0 0 10px var(--accent-green)' : 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                                    flexShrink: 0,
                                }}
                            />
                        );
                    })}
                </div>

                {/* Right: current section name + ping */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 18px',
                    borderLeft: '1px solid rgba(59,157,255,0.1)',
                    minWidth: '120px',
                }}>
                    <span style={{
                        fontSize: '11px',
                        color: 'var(--text-main)',
                        letterSpacing: '2px',
                        fontWeight: 'bold',
                        minWidth: '60px',
                    }}>
                        {displayed}
                        {isTyping && <span style={{ color: 'var(--accent-green)', animation: 'blink 0.6s infinite' }}>▌</span>}
                    </span>
                    <span style={{
                        fontSize: '9px',
                        color: 'var(--accent-green)',
                        letterSpacing: '1px',
                        opacity: 0.7,
                    }}>{ping}ms</span>
                </div>
            </div>
        </nav>
    );
}

