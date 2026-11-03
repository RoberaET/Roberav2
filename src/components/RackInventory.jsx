import React, { useState, useEffect, useRef } from 'react';

const experiences = [
    {
        id: 'SIG-01',
        callsign: 'BESYS-TECH',
        name: 'BESYS Technologies',
        role: 'Network Engineer',
        duration: 'Current',
        freq: '2.4 GHz',
        signal: 97,
        status: 'LIVE',
        statusColor: '#00FFA3',
        pulseColor: 'rgba(0,255,163,0.25)',
        logs: [
            "Deployed and maintained enterprise LAN/WAN infrastructure",
            "Configured VLAN segmentation and inter-VLAN routing",
            "Supported IP-based CCTV camera installation and configuration",
            "Performed daily network monitoring and troubleshooting",
            "Supported branch connectivity and uptime stability"
        ]
    },
    {
        id: 'SIG-02',
        callsign: 'IE-NETSOL',
        name: 'IE Network Solutions',
        role: 'Modern Data Center & Cloud Engineer',
        duration: 'Previous',
        freq: '5.8 GHz',
        signal: 74,
        status: 'ARCHIVED',
        statusColor: '#7A8AAA',
        pulseColor: 'rgba(100,120,160,0.15)',
        logs: [
            "Managed Active Directory (AD) user and group administration",
            "Supported Windows Server environment — DNS, DHCP, file services",
            "Assisted Exchange Server configuration and mailbox management",
            "Performed data migration between on-prem systems and servers",
            "Supported virtualization infrastructure (VMware / Hyper-V)",
            "Assisted in backup and system recovery operations"
        ]
    },
    {
        id: 'SIG-03',
        callsign: 'PERSONAL-LAB',
        name: 'Personal Projects',
        role: 'Network Engineering Labs',
        duration: 'Ongoing',
        freq: '900 MHz',
        signal: 55,
        status: 'STANDBY',
        statusColor: '#00F0FF',
        pulseColor: 'rgba(0,240,255,0.15)',
        logs: [
            "Built campus network topologies using Cisco Packet Tracer / GNS3",
            "Designed redundant campus network architectures — STP, link redundancy",
            "Simulated multi-branch enterprise network connectivity via VPN / routing",
            "Implementing scalable enterprise-style network designs"
        ]
    }
];

function buildWavePoints(seed, count) {
    const pts = [];
    for (let i = 0; i < count; i++) {
        const noise = Math.sin(i * 0.7 + seed) * 10 + Math.sin(i * 1.3 + seed * 2) * 6;
        const y = 30 + noise;
        pts.push(`${((i / (count - 1)) * 100).toFixed(2)}% ${y.toFixed(1)}`);
    }
    return pts;
}

function SignalBars({ value, color }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {[20, 40, 60, 80, 100].map((threshold, i) => (
                <div key={i} style={{
                    width: '5px',
                    height: `${(i + 1) * 4 + 2}px`,
                    borderRadius: '1px',
                    backgroundColor: value >= threshold ? color : 'rgba(255,255,255,0.1)',
                    boxShadow: value >= threshold ? `0 0 5px ${color}` : 'none',
                    flexShrink: 0,
                }} />
            ))}
        </div>
    );
}

function ScanLine({ color }) {
    const [pos, setPos] = useState(0);
    const rafRef = useRef(null);
    const startRef = useRef(null);

    useEffect(() => {
        const duration = 2000;
        const step = (ts) => {
            if (!startRef.current) startRef.current = ts;
            setPos(((ts - startRef.current) % duration) / duration);
            rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <line
            x1={`${pos * 100}%`} y1="0"
            x2={`${pos * 100}%`} y2="60"
            stroke={color}
            strokeWidth="1"
            opacity="0.5"
        />
    );
}

function ExperienceCard({ exp, index }) {
    const [hovered, setHovered] = useState(false);
    const [decoded, setDecoded] = useState(false);
    const timerRef = useRef(null);
    const wavePoints = buildWavePoints(index * 3.7, 80);
    const isLive = exp.status === 'LIVE';

    const handleEnter = () => {
        setHovered(true);
        timerRef.current = setTimeout(() => setDecoded(true), 250);
    };
    const handleLeave = () => {
        setHovered(false);
        setDecoded(false);
        clearTimeout(timerRef.current);
    };

    return (
        <div
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            style={{
                position: 'relative',
                border: `1px solid ${hovered ? exp.statusColor + '88' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '3px',
                backgroundColor: hovered ? 'rgba(4,9,18,0.98)' : 'rgba(4,7,16,0.85)',
                transition: 'border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                boxShadow: hovered ? `0 0 32px ${exp.pulseColor}` : 'none',
                overflow: 'hidden',
                cursor: 'default',
            }}
        >
            {/* Left accent stripe */}
            <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                backgroundColor: exp.statusColor,
                boxShadow: hovered ? `0 0 12px ${exp.statusColor}` : 'none',
                opacity: hovered ? 1 : 0.3,
                transition: 'opacity 0.3s, box-shadow 0.3s',
            }} />

            {/* ── TOP ROW: Identity + Status ── */}
            <div style={{
                padding: '14px 18px 0 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px',
            }}>
                {/* Left: identity block */}
                <div style={{ minWidth: 0, flex: 1 }}>
                    {/* ID badge row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            backgroundColor: exp.statusColor,
                            flexShrink: 0,
                            animation: isLive ? 'interceptPulse 1.8s ease-in-out infinite' : 'none',
                        }} />
                        <span style={{
                            fontSize: '9px', color: 'var(--text-muted)',
                            letterSpacing: '3px', fontFamily: 'var(--font-mono)'
                        }}>
                            {exp.id}
                        </span>
                    </div>

                    {/* Company name */}
                    <div style={{
                        fontSize: '16px', fontWeight: 700,
                        color: hovered ? 'var(--text-main)' : 'rgba(232,240,255,0.8)',
                        letterSpacing: '0.5px',
                        lineHeight: 1.3,
                        transition: 'color 0.3s',
                        marginBottom: '4px',
                    }}>
                        {exp.name}
                    </div>

                    {/* Role */}
                    <div style={{
                        fontSize: '12px',
                        color: exp.statusColor,
                        letterSpacing: '0.3px',
                        opacity: 0.9,
                        marginBottom: '10px',
                    }}>
                        {exp.role}
                    </div>

                    {/* Signal bars + meta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <SignalBars value={exp.signal} color={exp.statusColor} />
                        <span style={{
                            fontSize: '10px', color: 'var(--text-muted)',
                            letterSpacing: '0.5px', fontFamily: 'var(--font-mono)',
                            whiteSpace: 'nowrap',
                        }}>
                            {exp.signal}% · {exp.freq}
                        </span>
                    </div>
                </div>

                {/* Right: status + duration */}
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-end', gap: '6px',
                    flexShrink: 0, paddingTop: '2px',
                }}>
                    <div style={{
                        border: `1px solid ${exp.statusColor}55`,
                        backgroundColor: `${exp.statusColor}12`,
                        padding: '3px 10px',
                        borderRadius: '2px',
                    }}>
                        <span style={{
                            fontSize: '10px', color: exp.statusColor,
                            letterSpacing: '2px', fontFamily: 'var(--font-mono)',
                            whiteSpace: 'nowrap',
                        }}>
                            {exp.status}
                        </span>
                    </div>
                    <span style={{
                        fontSize: '10px', color: 'var(--text-muted)',
                        letterSpacing: '1px', fontFamily: 'var(--font-mono)',
                        whiteSpace: 'nowrap',
                    }}>
                        {exp.duration}
                    </span>
                    <span style={{
                        fontSize: '9px', color: 'rgba(255,255,255,0.15)',
                        letterSpacing: '0.5px', fontFamily: 'var(--font-mono)',
                        whiteSpace: 'nowrap',
                    }}>
                        {hovered ? '▼ DECODING...' : 'HOVER TO INTERCEPT'}
                    </span>
                </div>
            </div>

            {/* ── OSCILLOSCOPE: Full width ── */}
            <div style={{ padding: '0 20px 14px 20px' }}>
                <div style={{
                    position: 'relative',
                    height: '54px',
                    backgroundColor: '#020508',
                    borderRadius: '2px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    overflow: 'hidden',
                }}>
                    <svg
                        width="100%" height="54"
                        viewBox="0 0 100 60"
                        preserveAspectRatio="none"
                        style={{ display: 'block' }}
                    >
                        {/* Grid */}
                        {[15, 30, 45].map(y => (
                            <line key={y} x1="0" y1={y} x2="100" y2={y}
                                stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                        ))}
                        {[25, 50, 75].map(x => (
                            <line key={x} x1={x} y1="0" x2={x} y2="60"
                                stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                        ))}

                        {/* Waveform using percentage-based polyline */}
                        <polyline
                            points={wavePoints.map((p, i) => {
                                const t = i / (wavePoints.length - 1);
                                const y = parseFloat(p.split(' ')[1]);
                                return `${(t * 100).toFixed(2)},${y.toFixed(1)}`;
                            }).join(' ')}
                            fill="none"
                            stroke={exp.statusColor}
                            strokeWidth={hovered ? "0.8" : "0.5"}
                            vectorEffect="non-scaling-stroke"
                            opacity={hovered ? 1 : 0.4}
                            style={{
                                transition: 'opacity 0.3s, stroke-width 0.3s',
                                filter: hovered ? `drop-shadow(0 0 2px ${exp.statusColor})` : 'none',
                            }}
                        />

                        {hovered && <ScanLine color={exp.statusColor} />}
                    </svg>

                    {/* Scope labels */}
                    <div style={{
                        position: 'absolute', top: '3px', left: '7px',
                        fontSize: '8px', color: 'rgba(255,255,255,0.22)',
                        letterSpacing: '1.5px', fontFamily: 'var(--font-mono)',
                        pointerEvents: 'none',
                    }}>
                        CH1 · {exp.callsign}
                    </div>
                    <div style={{
                        position: 'absolute', bottom: '3px', right: '7px',
                        fontSize: '8px', color: 'rgba(255,255,255,0.18)',
                        letterSpacing: '1px', fontFamily: 'var(--font-mono)',
                        pointerEvents: 'none',
                    }}>
                        {exp.freq}
                    </div>
                </div>
            </div>

            {/* ── EXPANDED: Decoded payload ── */}
            <div style={{
                maxHeight: hovered ? '400px' : '0',
                opacity: hovered ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
            }}>
                <div style={{
                    borderTop: `1px solid ${exp.statusColor}20`,
                    margin: '0 20px',
                    paddingTop: '14px',
                    paddingBottom: '18px',
                }}>
                    <div style={{
                        fontSize: '9px', color: exp.statusColor,
                        letterSpacing: '2.5px', marginBottom: '12px',
                        opacity: 0.65, fontFamily: 'var(--font-mono)',
                    }}>
                        ── INTERCEPTED PAYLOAD · {exp.callsign} ──
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {exp.logs.map((log, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'flex-start', gap: '10px',
                                opacity: decoded ? 1 : 0,
                                transform: decoded ? 'translateX(0)' : 'translateX(-8px)',
                                transition: `opacity 0.3s ease ${i * 0.06}s, transform 0.3s ease ${i * 0.06}s`,
                            }}>
                                <span style={{
                                    color: exp.statusColor, opacity: 0.55,
                                    fontSize: '9px', marginTop: '3px', flexShrink: 0,
                                    fontFamily: 'var(--font-mono)',
                                }}>▸</span>
                                <span style={{
                                    color: 'rgba(232,240,255,0.82)',
                                    fontSize: '13px', lineHeight: '1.6',
                                    fontFamily: 'var(--font-sans)',
                                }}>
                                    {log}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RackInventory() {
    return (
        <section style={{ marginBottom: '80px' }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center',
                gap: '12px', marginBottom: '24px',
                flexWrap: 'wrap',
            }}>
                <div style={{
                    width: '12px', height: '12px', flexShrink: 0,
                    backgroundColor: 'var(--accent-blue)',
                    boxShadow: '0 0 10px var(--accent-blue-glow)',
                }} />
                <h2 style={{
                    fontSize: '20px', letterSpacing: '2px',
                    color: 'var(--text-main)', margin: 0,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                }}>
                    [ SIGNAL_INTERCEPT ]
                </h2>
                <div style={{
                    fontSize: '12px', color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                }}>
                    // PROFESSIONAL_EXPERIENCE
                </div>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {experiences.map((exp, i) => (
                    <ExperienceCard key={exp.id} exp={exp} index={i} />
                ))}
            </div>

            <style>{`
                @keyframes interceptPulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.2; }
                }
            `}</style>
        </section>
    );
}
