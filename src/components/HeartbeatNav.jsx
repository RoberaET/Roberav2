import React, { useState, useEffect } from 'react';

const SECTIONS = [
    { id: 'core-router',  port: 'Gi0/1', label: 'CORE_ROUTER',  target: 'core-router',  desc: 'LAYER 3' },
    { id: 'network-ops',  port: 'Gi0/2', label: 'OPERATIONS',   target: 'network-ops',  desc: 'SYS_STACK' },
    { id: 'data-center',  port: 'Gi0/3', label: 'TOPOLOGY_LABS',target: 'data-center',  desc: 'PHYSICAL' },
    { id: 'security-ops', port: 'Gi0/4', label: 'PACKET_FORGE', target: 'security-ops', desc: 'SECURITY' },
];

export default function HeartbeatNav() {
    const [activeIdx, setActiveIdx] = useState(0);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [scrollPct, setScrollPct] = useState(0);

    // Dynamic scroll spy & scroll progress tracker
    useEffect(() => {
        let ticking = false;

        const updateScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const totalH = document.documentElement.scrollHeight - window.innerHeight;
                const currentY = window.scrollY;
                const pct = totalH > 0 ? Math.min(100, Math.max(0, Math.round((currentY / totalH) * 100))) : 0;
                setScrollPct(pct);

                // Spy on active section
                if (currentY < 180) {
                    setActiveIdx(0);
                } else {
                    for (let i = SECTIONS.length - 1; i >= 0; i--) {
                        const el = document.getElementById(SECTIONS[i].target);
                        if (el) {
                            const rect = el.getBoundingClientRect();
                            if (rect.top <= 260) {
                                setActiveIdx(i);
                                break;
                            }
                        }
                    }
                }
                ticking = false;
            });
        };

        window.addEventListener('scroll', updateScroll, { passive: true });
        updateScroll();
        return () => window.removeEventListener('scroll', updateScroll);
    }, []);

    const scrollTo = (idx) => {
        setActiveIdx(idx);
        const t = SECTIONS[idx].target;
        const el = document.getElementById(t);
        if (el) {
            const topPos = el.getBoundingClientRect().top + window.scrollY - 60;
            window.scrollTo({ top: topPos, behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const active = SECTIONS[activeIdx];

    return (
        <nav style={{
            position: 'sticky',
            top: '10px',
            zIndex: 1000,
            marginBottom: '24px',
            fontFamily: 'var(--font-mono)',
        }}>
            <style>{`
                @keyframes nav-beam-glow {
                    0%, 100% { filter: drop-shadow(0 0 4px #FFB800); }
                    50% { filter: drop-shadow(0 0 10px #00FFA3); }
                }
                @keyframes nav-pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(0.85); }
                }
                .nav-port-btn {
                    transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .nav-port-btn:hover {
                    background: rgba(255, 184, 0, 0.1) !important;
                    color: var(--text-main) !important;
                }
            `}</style>

            {/* Thin Floating Optical Rail */}
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '32px',
                background: 'rgba(8, 8, 11, 0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '0 12px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}>
                {/* ── LEFT: Router Core Status & Active Resolver ──── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    fontSize: '9px',
                    letterSpacing: '1.5px',
                    color: 'var(--text-muted)',
                    flexShrink: 0,
                }}>
                    {/* Live port LED */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                    }} onClick={scrollToTop}>
                        <div style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: '#00FFA3',
                            boxShadow: '0 0 8px #00FFA3',
                            animation: 'nav-pulse-dot 1.8s ease-in-out infinite',
                        }} />
                        <span style={{
                            color: 'var(--text-main)',
                            fontWeight: 700,
                            letterSpacing: '2px',
                        }}>
                            ROBERA<span style={{ color: 'var(--accent-blue)' }}>::</span>RTR
                        </span>
                    </div>

                    <span style={{ color: 'var(--border-color)', fontSize: '10px' }}>│</span>

                    {/* Active routing resolution */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '8px',
                        color: 'var(--accent-blue)',
                    }}>
                        <span style={{ color: 'var(--text-muted)' }}>HOP:</span>
                        <span style={{ color: '#00FFA3', fontWeight: 600 }}>{active.port}</span>
                        <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>({active.desc})</span>
                    </div>
                </div>

                {/* ── CENTER: Interconnected Port Array ────────────── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    margin: '0 10px',
                }}>
                    {SECTIONS.map((s, idx) => {
                        const isActive = idx === activeIdx;
                        const isHovered = idx === hoveredIdx;

                        return (
                            <button
                                key={s.id}
                                onClick={() => scrollTo(idx)}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                className="nav-port-btn"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '3px 9px',
                                    height: '22px',
                                    background: isActive
                                        ? 'rgba(255, 184, 0, 0.14)'
                                        : isHovered
                                            ? 'rgba(255, 184, 0, 0.06)'
                                            : 'transparent',
                                    border: isActive
                                        ? '1px solid var(--accent-blue)'
                                        : '1px solid transparent',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '9px',
                                    letterSpacing: '1.2px',
                                    color: isActive
                                        ? 'var(--accent-blue)'
                                        : isHovered
                                            ? 'var(--text-main)'
                                            : 'var(--text-muted)',
                                    whiteSpace: 'nowrap',
                                    position: 'relative',
                                }}
                            >
                                <span style={{
                                    fontSize: '7px',
                                    color: isActive ? '#00FFA3' : 'var(--text-muted)',
                                    fontWeight: 700,
                                }}>
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                <span>{s.label}</span>
                                {isActive && (
                                    <span style={{
                                        width: 3,
                                        height: 3,
                                        borderRadius: '50%',
                                        backgroundColor: '#00FFA3',
                                        boxShadow: '0 0 5px #00FFA3',
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── RIGHT: Optical Progress & Quick Action ──────── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexShrink: 0,
                    fontSize: '9px',
                }}>
                    <span style={{ color: 'var(--border-color)', fontSize: '10px' }}>│</span>

                    {/* Scroll Telemetry Percentage */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '8px',
                        letterSpacing: '1px',
                        color: 'var(--text-muted)',
                    }}>
                        <span style={{ color: 'var(--text-muted)' }}>POS:</span>
                        <span style={{
                            color: 'var(--accent-blue)',
                            fontWeight: 700,
                            minWidth: '28px',
                            textAlign: 'right',
                        }}>
                            {String(scrollPct).padStart(2, '0')}%
                        </span>
                    </div>

                    {/* Fast return to top button */}
                    <button
                        onClick={scrollToTop}
                        title="Return to Core Gateway"
                        style={{
                            background: 'rgba(16, 15, 20, 0.6)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '2px',
                            color: 'var(--text-main)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '8px',
                            letterSpacing: '1px',
                            padding: '2px 6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#00FFA3';
                            e.currentTarget.style.color = '#00FFA3';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.color = 'var(--text-main)';
                        }}
                    >
                        ▲ TOP
                    </button>
                </div>

                {/* ── BOTTOM OPTICAL FIBER PROGRESS RAIL (1.5px) ──── */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1.5px',
                    background: 'rgba(255, 184, 0, 0.12)',
                    borderRadius: '0 0 4px 4px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${scrollPct}%`,
                        background: 'linear-gradient(90deg, #D97706 0%, #FFB800 60%, #00FFA3 100%)',
                        boxShadow: '0 0 8px rgba(255, 184, 0, 0.7)',
                        transition: 'width 0.1s linear',
                    }} />
                </div>
            </div>
        </nav>
    );
}
