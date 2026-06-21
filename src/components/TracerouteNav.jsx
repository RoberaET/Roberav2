import React, { useState, useEffect, useRef } from 'react';

const hops = [
    { id: 'top',              hop: 1,  ip: '10.0.0.1',   label: 'GATEWAY',   ms: '0.8ms',  target: 'top'             },
    { id: 'core-router',      hop: 2,  ip: '10.10.0.1',  label: 'CORE_RTR',  ms: '1.2ms',  target: 'core-router'     },
    { id: 'network-ops',      hop: 3,  ip: '172.16.0.1', label: 'NET_OPS',   ms: '2.4ms',  target: 'network-ops'     },
    { id: 'data-center',      hop: 4,  ip: '172.31.0.1', label: 'DATA_CTR',  ms: '3.1ms',  target: 'data-center'     },
    { id: 'security-ops',     hop: 5,  ip: '192.168.1.1',label: 'SEC_OPS',   ms: '4.7ms',  target: 'security-ops'    },
    { id: 'command-terminal', hop: 6,  ip: '0.0.0.0',    label: 'TERMINAL',  ms: '5.9ms',  target: 'command-terminal'},
];

export default function TracerouteNav() {
    const [activeHop, setActiveHop] = useState('top');
    const [hoveredHop, setHoveredHop] = useState(null);
    const [packetPos, setPacketPos] = useState(0);   // 0–100 progress along line
    const [packetTarget, setPacketTarget] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const animRef = useRef(null);
    const lineRef = useRef(null);

    // Scroll spy
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 200) { setActiveHop('top'); return; }
            for (let i = hops.length - 1; i >= 0; i--) {
                if (hops[i].target === 'top') continue;
                const el = document.getElementById(hops[i].target);
                if (el && el.getBoundingClientRect().top <= 200) {
                    setActiveHop(hops[i].id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animate packet toward activeHop index
    useEffect(() => {
        const idx = hops.findIndex(h => h.id === activeHop);
        const target = (idx / (hops.length - 1)) * 100;
        setPacketTarget(target);
    }, [activeHop]);

    // Smooth packet travel
    useEffect(() => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        const animate = () => {
            setPacketPos(prev => {
                const diff = packetTarget - prev;
                if (Math.abs(diff) < 0.1) return packetTarget;
                animRef.current = requestAnimationFrame(animate);
                return prev + diff * 0.06;
            });
        };
        animRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animRef.current);
    }, [packetTarget]);

    const scrollTo = (target) => {
        if (target === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        const el = document.getElementById(target);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const activeIdx = hops.findIndex(h => h.id === activeHop);

    return (
        <nav style={{
            position: 'sticky',
            top: '16px',
            zIndex: 1000,
            marginBottom: '60px',
            padding: '0 4px',
        }}>
            {/* Outer shell — thin, glass-dark */}
            <div style={{
                backgroundColor: 'rgba(3, 6, 10, 0.92)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(59,157,255,0.15)',
                borderRadius: '6px',
                padding: '14px 24px',
                boxShadow: '0 4px 30px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,157,255,0.05)',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}>

                {/* Top row: traceroute label + live stats */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            backgroundColor: 'var(--accent-green)',
                            boxShadow: '0 0 8px var(--accent-green)',
                            animation: 'blink 2s infinite'
                        }} />
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '2px' }}>
                            traceroute robera.net
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                            HOP <span style={{ color: 'var(--accent-blue)' }}>{activeIdx + 1}/{hops.length}</span>
                        </span>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                            TTL <span style={{ color: 'var(--accent-green)' }}>64</span>
                        </span>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                            PROTO <span style={{ color: 'var(--accent-blue)' }}>ICMP</span>
                        </span>
                    </div>
                </div>

                {/* Main hop line */}
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    {hops.map((hop, index) => {
                        const isActive = activeHop === hop.id;
                        const isHovered = hoveredHop === hop.id;
                        const isPassed = index <= activeIdx;
                        const isLast = index === hops.length - 1;

                        return (
                            <React.Fragment key={hop.id}>
                                {/* Hop node */}
                                <div
                                    onMouseEnter={() => setHoveredHop(hop.id)}
                                    onMouseLeave={() => setHoveredHop(null)}
                                    onClick={() => scrollTo(hop.target)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '5px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        zIndex: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    {/* Tooltip on hover */}
                                    {isHovered && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 'calc(100% + 10px)',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            backgroundColor: '#060d1a',
                                            border: '1px solid rgba(59,157,255,0.3)',
                                            borderRadius: '4px',
                                            padding: '8px 12px',
                                            whiteSpace: 'nowrap',
                                            fontSize: '10px',
                                            zIndex: 10,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
                                            pointerEvents: 'none',
                                        }}>
                                            <div style={{ color: 'var(--accent-green)', marginBottom: '3px' }}>
                                                {hop.hop}  {hop.ip}  {hop.ms}
                                            </div>
                                            <div style={{ color: 'var(--text-muted)' }}>{hop.label}</div>
                                            {/* Arrow */}
                                            <div style={{
                                                position: 'absolute', bottom: '-5px', left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '8px', height: '8px',
                                                backgroundColor: '#060d1a',
                                                border: '1px solid rgba(59,157,255,0.3)',
                                                borderTop: 'none', borderLeft: 'none',
                                                rotate: '45deg'
                                            }} />
                                        </div>
                                    )}

                                    {/* The node dot */}
                                    <div style={{
                                        width: isActive ? '12px' : '8px',
                                        height: isActive ? '12px' : '8px',
                                        borderRadius: '50%',
                                        backgroundColor: isActive
                                            ? 'var(--accent-green)'
                                            : isPassed
                                                ? 'var(--accent-blue)'
                                                : '#1a2333',
                                        border: `1px solid ${isActive ? 'var(--accent-green)' : isPassed ? 'var(--accent-blue)' : '#2a3548'}`,
                                        boxShadow: isActive
                                            ? '0 0 12px var(--accent-green), 0 0 24px rgba(46,255,122,0.3)'
                                            : isPassed ? '0 0 6px rgba(59,157,255,0.5)' : 'none',
                                        transition: 'all 0.4s ease',
                                        animation: isActive ? 'pulseGlow 2s infinite' : 'none',
                                    }} />

                                    {/* Label */}
                                    <div style={{
                                        fontSize: '9px',
                                        letterSpacing: '1px',
                                        color: isActive ? 'var(--text-main)'
                                            : isHovered ? 'var(--accent-blue)'
                                                : isPassed ? 'var(--text-muted)'
                                                    : '#2a3548',
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        transition: 'color 0.3s ease',
                                        textShadow: isActive ? '0 0 8px rgba(46,255,122,0.5)' : 'none',
                                    }}>
                                        {hop.label}
                                    </div>
                                </div>

                                {/* Connecting line between hops */}
                                {!isLast && (
                                    <div style={{
                                        flex: 1,
                                        height: '1px',
                                        position: 'relative',
                                        overflow: 'visible',
                                        marginBottom: '14px', // aligns with dot center
                                    }}>
                                        {/* Base line */}
                                        <div style={{
                                            width: '100%',
                                            height: '1px',
                                            backgroundColor: index < activeIdx ? 'rgba(59,157,255,0.4)' : '#1a2333',
                                            transition: 'background-color 0.5s ease',
                                        }} />
                                        {/* Glow overlay on passed segments */}
                                        {index < activeIdx && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0, left: 0, right: 0,
                                                height: '1px',
                                                background: 'linear-gradient(90deg, var(--accent-blue), rgba(59,157,255,0.2))',
                                                boxShadow: '0 0 4px var(--accent-blue)',
                                            }} />
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {/* Traveling packet — absolutely positioned along the full line */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${packetPos}%`,
                        transform: 'translate(-50%, -70%)',
                        zIndex: 5,
                        pointerEvents: 'none',
                        transition: 'none',
                    }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-green)',
                            boxShadow: '0 0 10px var(--accent-green), 0 0 20px rgba(46,255,122,0.6), -8px 0 10px rgba(46,255,122,0.3)',
                        }} />
                    </div>
                </div>
            </div>
        </nav>
    );
}

