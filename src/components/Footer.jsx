import React, { useState, useEffect } from 'react';

const BESYS_START_DATE = new Date('2025-07-30T00:00:00');

function getBesysUptime() {
    const now = new Date();
    const diff = Math.max(0, now - BESYS_START_DATE);
    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, mins, secs };
}

export default function Footer() {
    const [besysUptime, setBesysUptime] = useState(getBesysUptime());
    const [sessionSeconds, setSessionSeconds] = useState(0);
    const [viewport, setViewport] = useState({
        w: typeof window !== 'undefined' ? window.innerWidth : 1920,
        h: typeof window !== 'undefined' ? window.innerHeight : 1080,
    });
    const [connectionType, setConnectionType] = useState('ONLINE');

    // Real-time ticking for BESYS tenure & visitor session
    useEffect(() => {
        const start = Date.now();
        const timer = setInterval(() => {
            setBesysUptime(getBesysUptime());
            setSessionSeconds(Math.floor((Date.now() - start) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Real live viewport listener
    useEffect(() => {
        const handleResize = () => {
            setViewport({ w: window.innerWidth, h: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Real client network connection telemetry
    useEffect(() => {
        const updateConn = () => {
            if (typeof navigator !== 'undefined' && 'connection' in navigator) {
                const conn = navigator.connection;
                if (conn && conn.effectiveType) {
                    setConnectionType(conn.effectiveType.toUpperCase());
                    return;
                }
            }
            setConnectionType(navigator.onLine ? 'ONLINE' : 'OFFLINE');
        };
        updateConn();
        window.addEventListener('online', updateConn);
        window.addEventListener('offline', updateConn);
        return () => {
            window.removeEventListener('online', updateConn);
            window.removeEventListener('offline', updateConn);
        };
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatSession = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const clientPlatform = typeof navigator !== 'undefined'
        ? (navigator.userAgentData?.platform || navigator.platform || 'UNKNOWN')
        : 'UNKNOWN';

    const clientProtocol = typeof window !== 'undefined' && window.location.protocol
        ? window.location.protocol.replace(':', '').toUpperCase()
        : 'HTTPS';

    const routes = [
        { num: '01', id: 'core-router', label: 'CORE_ROUTER', desc: 'System Gateway & Hero' },
        { num: '02', id: 'network-ops', label: 'OPERATIONS_STACK', desc: 'Processes, BGP & Experience' },
        { num: '03', id: 'data-center', label: 'TOPOLOGY_LABS', desc: 'Packet Tracer Architectures' },
        { num: '04', id: 'security-ops', label: 'PACKET_FORGE', desc: 'Contact & Interfaces' },
    ];

    return (
        <footer style={{
            position: 'relative',
            marginTop: '30px',
            fontFamily: 'var(--font-mono)',
            backgroundColor: '#03010d',
            borderTop: '1px solid rgba(0, 240, 255, 0.2)',
        }}>
            <style>{`
                .ft-nav-btn {
                    transition: all 0.25s ease;
                }
                .ft-nav-btn:hover {
                    background: rgba(0, 240, 255, 0.08) !important;
                    border-color: #00F0FF !important;
                    transform: translateX(4px);
                }
                .ft-top-btn {
                    transition: all 0.25s ease;
                }
                .ft-top-btn:hover {
                    background: rgba(0, 255, 163, 0.15) !important;
                    border-color: #00FFA3 !important;
                    color: #00FFA3 !important;
                }
                @keyframes ft-status-blink {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.35; transform: scale(0.9); }
                }
            `}</style>

            {/* Subtle top indicator bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 30px',
                background: 'rgba(8, 5, 26, 0.6)',
                borderBottom: '1px solid rgba(74, 90, 138, 0.15)',
                fontSize: '9px',
                letterSpacing: '1.5px',
                color: 'rgba(74, 90, 138, 0.8)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#00F0FF' }}>SYS::TERMINUS</span>
                    <span>│</span>
                    <span>ROBERA-CORE-ROUTER</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#00FFA3',
                        boxShadow: '0 0 6px #00FFA3',
                        animation: 'ft-status-blink 2s ease-in-out infinite'
                    }} />
                    <span style={{ color: '#00FFA3' }}>SYSTEM NOMINAL</span>
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{
                padding: '48px 40px 36px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '40px',
                alignItems: 'start',
            }}>
                {/* ── COL 1: Real Profile & Scope ───────────────── */}
                <div>
                    <div style={{
                        fontSize: '9px',
                        color: 'rgba(74, 90, 138, 0.8)',
                        letterSpacing: '3px',
                        marginBottom: '14px',
                    }}>
                        // PROFILE_IDENTITY
                    </div>

                    <div style={{
                        fontSize: '22px',
                        fontWeight: 700,
                        color: '#E8F0FF',
                        letterSpacing: '2px',
                        marginBottom: '4px',
                    }}>
                        ROBERA MEKONNEN
                    </div>

                    <div style={{
                        fontSize: '12px',
                        color: '#00F0FF',
                        letterSpacing: '1px',
                        marginBottom: '14px',
                    }}>
                        Network and Security Engineer
                    </div>

                    <p style={{
                        fontSize: '11px',
                        lineHeight: '1.7',
                        color: 'rgba(232, 240, 255, 0.65)',
                        margin: '0 0 18px 0',
                    }}>
                        Specialized in resilient enterprise routing &amp; switching, network infrastructure hardening, virtualization systems, and active directory infrastructure.
                    </p>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        fontSize: '10px',
                        color: 'rgba(74, 90, 138, 0.9)',
                    }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ color: 'rgba(74, 90, 138, 0.5)', width: '70px' }}>LOCATION:</span>
                            <span style={{ color: '#E8F0FF' }}>Addis Ababa, Ethiopia (UTC+3)</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ color: 'rgba(74, 90, 138, 0.5)', width: '70px' }}>STATUS:</span>
                            <span style={{ color: '#00FFA3' }}>Open to Opportunities &amp; Engagements</span>
                        </div>
                    </div>
                </div>

                {/* ── COL 2: BESYS Technologies Uptime & Live Telemetry ── */}
                <div>
                    <div style={{
                        fontSize: '9px',
                        color: 'rgba(74, 90, 138, 0.8)',
                        letterSpacing: '3px',
                        marginBottom: '14px',
                    }}>
                        // BESYS_TENURE_UPTIME
                    </div>

                    {/* BESYS Technologies Live Uptime Counter */}
                    <div style={{
                        background: 'rgba(8, 5, 26, 0.85)',
                        border: '1px solid rgba(0, 255, 163, 0.25)',
                        borderLeft: '3px solid #00FFA3',
                        borderRadius: '3px',
                        padding: '16px 18px',
                        marginBottom: '14px',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px',
                        }}>
                            <div style={{ fontSize: '9px', color: 'rgba(232, 240, 255, 0.85)', letterSpacing: '1px' }}>
                                <span style={{ color: '#00FFA3', fontWeight: 600 }}>BESYS TECHNOLOGIES</span> · UPTIME
                            </div>
                            <div style={{
                                fontSize: '8px',
                                color: '#00FFA3',
                                background: 'rgba(0, 255, 163, 0.1)',
                                border: '1px solid rgba(0, 255, 163, 0.3)',
                                padding: '1px 6px',
                                borderRadius: '2px',
                                letterSpacing: '1px',
                            }}>
                                ACTIVE
                            </div>
                        </div>

                        {/* 4 Counter Cells: DAYS, HRS, MIN, SEC */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '8px',
                            textAlign: 'center',
                        }}>
                            {[
                                { val: besysUptime.days, label: 'DAYS' },
                                { val: String(besysUptime.hours).padStart(2, '0'), label: 'HRS' },
                                { val: String(besysUptime.mins).padStart(2, '0'), label: 'MIN' },
                                { val: String(besysUptime.secs).padStart(2, '0'), label: 'SEC' },
                            ].map(({ val, label }) => (
                                <div key={label} style={{
                                    background: 'rgba(0, 255, 163, 0.04)',
                                    border: '1px solid rgba(0, 255, 163, 0.15)',
                                    borderRadius: '2px',
                                    padding: '8px 4px',
                                }}>
                                    <div style={{
                                        fontSize: '20px',
                                        fontWeight: 700,
                                        color: '#00FFA3',
                                        textShadow: '0 0 10px rgba(0, 255, 163, 0.4)',
                                        lineHeight: 1,
                                        fontFamily: 'var(--font-mono)',
                                    }}>
                                        {val}
                                    </div>
                                    <div style={{
                                        fontSize: '7px',
                                        color: 'rgba(74, 90, 138, 0.85)',
                                        marginTop: '4px',
                                        letterSpacing: '1px',
                                    }}>
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            marginTop: '12px',
                            paddingTop: '8px',
                            borderTop: '1px solid rgba(74, 90, 138, 0.15)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '8px',
                            color: 'rgba(74, 90, 138, 0.7)',
                            letterSpacing: '1px',
                        }}>
                            <span>ROLE: NETWORK ENGINEER</span>
                            <span style={{ color: '#00FFA3' }}>SINCE JUL 30, 2025</span>
                        </div>
                    </div>

                    {/* Real Client Session Info */}
                    <div style={{
                        background: 'rgba(8, 5, 26, 0.5)',
                        border: '1px solid rgba(74, 90, 138, 0.2)',
                        borderRadius: '3px',
                        padding: '10px 14px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        fontSize: '9px',
                    }}>
                        <div>
                            <span style={{ color: 'rgba(74, 90, 138, 0.6)' }}>VIEWPORT: </span>
                            <span style={{ color: '#E8F0FF' }}>{viewport.w}×{viewport.h}px</span>
                        </div>
                        <div>
                            <span style={{ color: 'rgba(74, 90, 138, 0.6)' }}>CONN: </span>
                            <span style={{ color: '#FFB800' }}>{connectionType}</span>
                        </div>
                        <div>
                            <span style={{ color: 'rgba(74, 90, 138, 0.6)' }}>PROTOCOL: </span>
                            <span style={{ color: '#00F0FF' }}>{clientProtocol}</span>
                        </div>
                        <div>
                            <span style={{ color: 'rgba(74, 90, 138, 0.6)' }}>SESSION: </span>
                            <span style={{ color: '#a78bfa' }}>{formatSession(sessionSeconds)}</span>
                        </div>
                    </div>
                </div>

                {/* ── COL 3: Real Working Site Navigation ────────── */}
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '14px',
                    }}>
                        <div style={{
                            fontSize: '9px',
                            color: 'rgba(74, 90, 138, 0.8)',
                            letterSpacing: '3px',
                        }}>
                            // QUICK_ROUTING
                        </div>

                        <button
                            onClick={scrollToTop}
                            className="ft-top-btn"
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(74, 90, 138, 0.3)',
                                borderRadius: '2px',
                                color: 'rgba(232, 240, 255, 0.7)',
                                fontSize: '8px',
                                letterSpacing: '1.5px',
                                padding: '3px 8px',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-mono)',
                            }}
                        >
                            ▲ TOP
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                    }}>
                        {routes.map(r => (
                            <button
                                key={r.id}
                                onClick={() => scrollTo(r.id)}
                                className="ft-nav-btn"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '8px 12px',
                                    background: 'rgba(8, 5, 26, 0.5)',
                                    border: '1px solid rgba(74, 90, 138, 0.2)',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontFamily: 'var(--font-mono)',
                                }}
                            >
                                <span style={{
                                    fontSize: '9px',
                                    color: '#00F0FF',
                                    letterSpacing: '1px',
                                    opacity: 0.8,
                                }}>
                                    {r.num}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#E8F0FF',
                                        letterSpacing: '1px',
                                        fontWeight: 600,
                                    }}>
                                        {r.label}
                                    </div>
                                    <div style={{
                                        fontSize: '8px',
                                        color: 'rgba(74, 90, 138, 0.8)',
                                        letterSpacing: '0.5px',
                                    }}>
                                        {r.desc}
                                    </div>
                                </div>
                                <span style={{ color: 'rgba(74, 90, 138, 0.5)', fontSize: '10px' }}>
                                    →
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{
                borderTop: '1px solid rgba(74, 90, 138, 0.15)',
                padding: '16px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: '9px',
                color: 'rgba(74, 90, 138, 0.7)',
                letterSpacing: '1px',
            }}>
                <div>
                    © {new Date().getFullYear()} ROBERA MEKONNEN · ALL RIGHTS RESERVED
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span>ENGINEERING STACK: <span style={{ color: '#00F0FF' }}>REACT</span> + <span style={{ color: '#FFB800' }}>VITE</span></span>
                    <span>│</span>
                    <span>ROUTING: <span style={{ color: '#00FFA3' }}>OPERATIONAL</span></span>
                </div>
            </div>
        </footer>
    );
}
