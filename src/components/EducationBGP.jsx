import React, { useState, useEffect, useRef } from 'react';


const sessions = [
    {
        id: 'peer-01',
        asn: 'AS-64510',
        peer: 'MICROLINK INFO TECH COLLEGE',
        degree: 'B.Sc. Computer Engineering',
        period: 'Oct 2019 – Aug 2024',
        localIP: '10.0.0.1',
        remoteIP: '172.16.0.254',
        color: '#FFB800',
        holdTime: 180,
        msgSent: 18204,
        msgRecv: 17881,
        prefixes: [
            { net: '10.0.0.0/8',     label: 'Information & Computer Security' },
            { net: '172.16.0.0/12',  label: 'Software Engineering' },
            { net: '192.168.1.0/24', label: 'Object Oriented Programming' },
            { net: '0.0.0.0/0',      label: 'Microcomputer & Interfacing' },
        ],
    },
    {
        id: 'peer-02',
        asn: 'AS-64511',
        peer: 'ADDIS ABABA UNIVERSITY',
        degree: 'B.A. in Management',
        period: 'Oct 2020 – Jun 2025',
        localIP: '10.0.0.1',
        remoteIP: '192.168.100.1',
        color: '#00FFA3',
        holdTime: 180,
        msgSent: 21336,
        msgRecv: 20948,
        prefixes: [
            { net: '10.100.0.0/16',  label: 'Business Strategy' },
            { net: '172.31.0.0/16',  label: 'Project Management' },
            { net: '192.168.10.0/24',label: 'Organizational Behavior' },
            { net: '0.0.0.0/0',      label: 'Operations Management' },
        ],
    },
];

// Animated keepalive bar sweeping across the top of a card
function KeepaliveBar({ active, color }) {
    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '2px', overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.03)',
        }}>
            <div style={{
                height: '100%', width: '80px',
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                boxShadow: `0 0 8px ${color}`,
                animation: `keepalive ${active ? '1.4s' : '4s'} linear infinite`,
            }} />
        </div>
    );
}

// Animated link quality monitor — replaces FSM strip
function LinkQuality({ color, seed }) {
    const metrics = [
        { label: 'THROUGHPUT', base: 88 + (seed % 7) },
        { label: 'STABILITY',  base: 94 + (seed % 4) },
        { label: 'COVERAGE',   base: 91 + (seed % 5) },
    ];
    const [vals, setVals] = useState(metrics.map(m => m.base));

    useEffect(() => {
        const id = setInterval(() => {
            setVals(metrics.map(m => Math.max(80, Math.min(99, m.base + (Math.random() * 6 - 3)))));
        }, 1800);
        return () => clearInterval(id);
    }, []);

    return (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {metrics.map((m, i) => (
                <div key={m.label} style={{ flex: 1, minWidth: '70px' }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        marginBottom: '4px',
                    }}>
                        <span style={{
                            fontSize: '7px', color: 'var(--text-muted)',
                            letterSpacing: '1.5px', fontFamily: 'var(--font-mono)',
                        }}>
                            {m.label}
                        </span>
                        <span style={{
                            fontSize: '7px', color: color,
                            fontFamily: 'var(--font-mono)',
                        }}>
                            {Math.round(vals[i])}%
                        </span>
                    </div>
                    <div style={{
                        height: '4px',
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${vals[i]}%`,
                            background: `linear-gradient(90deg, ${color}99, ${color})`,
                            boxShadow: `0 0 6px ${color}`,
                            borderRadius: '2px',
                            transition: 'width 1.6s ease',
                        }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Animated counter that counts up to a target value
function Counter({ target, color }) {
    const [val, setVal] = useState(0);
    const started = useRef(false);
    useEffect(() => {
        if (started.current) return;
        started.current = true;
        const steps = 40;
        let i = 0;
        const inc = Math.ceil(target / steps);
        const id = setInterval(() => {
            i++;
            setVal(prev => Math.min(prev + inc, target));
            if (i >= steps) clearInterval(id);
        }, 30);
        return () => clearInterval(id);
    }, [target]);
    return (
        <span style={{ color, fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
            {val.toLocaleString()}
        </span>
    );
}

function SessionCard({ session, index, visible }) {
    const [hovered, setHovered] = useState(false);
    const [counted, setCounted] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setCounted(true); },
            { threshold: 0.3 }
        );
        if (cardRef.current) obs.observe(cardRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative',
                border: `1px solid ${hovered ? session.color + '77' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '3px',
                backgroundColor: hovered ? `${session.color}09` : 'rgba(3,6,16,0.7)',
                overflow: 'hidden',
                transition: 'border-color 0.3s, background-color 0.3s, box-shadow 0.3s',
                boxShadow: hovered ? `0 0 28px ${session.color}14` : 'none',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transitionProperty: 'opacity, transform, border-color, background-color, box-shadow',
                transitionDuration: '0.45s, 0.45s, 0.3s, 0.3s, 0.3s',
                transitionDelay: `${index * 0.12}s`,
            }}
        >
            <KeepaliveBar active={hovered} color={session.color} />

            {/* ── TOP: ASN + PEER NAME ── */}
            <div style={{
                padding: '14px 16px 10px',
                borderBottom: `1px solid rgba(255,255,255,0.05)`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px',
            }}>
                <div style={{ minWidth: 0 }}>
                    {/* ASN badge + status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{
                            fontSize: '11px', color: session.color,
                            fontFamily: 'var(--font-mono)', fontWeight: 700,
                            letterSpacing: '1px',
                        }}>
                            {session.asn}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                backgroundColor: session.color,
                                boxShadow: `0 0 6px ${session.color}`,
                                animation: 'bgsessionPulse 2s ease-in-out infinite',
                            }} />
                            <span style={{
                                fontSize: '8px', color: session.color,
                                letterSpacing: '2px', fontFamily: 'var(--font-mono)',
                            }}>
                                ESTABLISHED
                            </span>
                        </div>
                    </div>
                    {/* Institution name */}
                    <div style={{
                        fontSize: '13px', fontWeight: 700,
                        color: hovered ? 'var(--text-main)' : 'rgba(232,240,255,0.75)',
                        letterSpacing: '0.3px',
                        lineHeight: 1.3,
                        transition: 'color 0.3s',
                        marginBottom: '3px',
                    }}>
                        {session.peer}
                    </div>
                    {/* Degree */}
                    <div style={{
                        fontSize: '11px', color: session.color,
                        fontFamily: 'var(--font-mono)', opacity: 0.8,
                    }}>
                        {session.degree}
                    </div>
                </div>

                {/* Period badge */}
                <div style={{
                    flexShrink: 0,
                    border: `1px solid ${session.color}33`,
                    backgroundColor: `${session.color}0a`,
                    padding: '4px 10px',
                    borderRadius: '2px',
                    textAlign: 'right',
                }}>
                    <div style={{ fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '2px' }}>
                        SESSION_UPTIME
                    </div>
                    <div style={{
                        fontSize: '10px', color: session.color,
                        fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
                    }}>
                        {session.period}
                    </div>
                </div>
            </div>

            {/* ── MIDDLE: Link Quality Monitor ── */}
            <div style={{
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
                <div style={{ fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '8px' }}>
                    LINK_QUALITY_MONITOR
                </div>
                <LinkQuality color={session.color} seed={index * 17} />
            </div>

            {/* ── STATS ROW ── */}
            <div style={{
                padding: '10px 16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gap: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
                {[
                    { label: 'LOCAL_AS',   value: '65000',           raw: false },
                    { label: 'REMOTE_AS',  value: session.asn,       raw: false },
                    { label: 'MSG_SENT',   value: session.msgSent,   raw: true  },
                    { label: 'MSG_RECV',   value: session.msgRecv,   raw: true  },
                ].map(({ label, value, raw }) => (
                    <div key={label}>
                        <div style={{
                            fontSize: '7px', color: 'var(--text-muted)',
                            letterSpacing: '1.5px', marginBottom: '3px',
                        }}>
                            {label}
                        </div>
                        {raw && counted
                            ? <Counter target={value} color={session.color} />
                            : <span style={{
                                fontSize: '12px', fontFamily: 'var(--font-mono)',
                                color: hovered ? 'var(--text-main)' : 'rgba(232,240,255,0.6)',
                                fontWeight: 700,
                                transition: 'color 0.3s',
                              }}>
                                {value}
                              </span>
                        }
                    </div>
                ))}
            </div>

            {/* ── ROUTING TABLE: show on hover ── */}
            <div style={{
                maxHeight: hovered ? '220px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1)',
            }}>
                <div style={{ padding: '12px 16px 14px' }}>
                    {/* CLI prompt line */}
                    <div style={{
                        fontSize: '9px',
                        color: `${session.color}77`,
                        fontFamily: 'var(--font-mono)',
                        marginBottom: '10px',
                        letterSpacing: '0.5px',
                    }}>
                        {'>'} show ip bgp neighbors {session.asn} routes
                    </div>

                    {/* Route table header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '16px 130px 1fr',
                        gap: '8px',
                        padding: '3px 0',
                        borderBottom: `1px solid rgba(255,255,255,0.05)`,
                        marginBottom: '6px',
                    }}>
                        {['', 'NETWORK', 'SUBJECT'].map((h, i) => (
                            <span key={i} style={{
                                fontSize: '7px', color: 'var(--text-muted)',
                                letterSpacing: '2px', fontFamily: 'var(--font-mono)',
                            }}>{h}</span>
                        ))}
                    </div>

                    {/* Route rows */}
                    {session.prefixes.map((prefix, i) => (
                        <div key={i} style={{
                            display: 'grid',
                            gridTemplateColumns: '16px 130px 1fr',
                            gap: '8px',
                            padding: '4px 0',
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
                            transition: `opacity 0.3s ease ${i * 0.07}s, transform 0.3s ease ${i * 0.07}s`,
                        }}>
                            <span style={{
                                fontSize: '10px',
                                color: session.color,
                                fontFamily: 'var(--font-mono)',
                            }}>*{'>'}</span>
                            <span style={{
                                fontSize: '10px',
                                color: `${session.color}cc`,
                                fontFamily: 'var(--font-mono)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>{prefix.net}</span>
                            <span style={{
                                fontSize: '11px',
                                color: 'rgba(232,240,255,0.7)',
                                fontFamily: 'var(--font-sans)',
                            }}>{prefix.label}</span>
                        </div>
                    ))}

                    {/* Connection metadata */}
                    <div style={{
                        marginTop: '10px',
                        display: 'flex', gap: '16px', flexWrap: 'wrap',
                        opacity: hovered ? 1 : 0,
                        transition: 'opacity 0.4s ease 0.28s',
                    }}>
                        {[
                            { k: 'LOCAL_ADDR',  v: session.localIP  },
                            { k: 'REMOTE_ADDR', v: session.remoteIP },
                            { k: 'HOLD_TIME',   v: `${session.holdTime}s` },
                        ].map(({ k, v }) => (
                            <span key={k} style={{ fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
                                <span style={{ color: 'var(--text-muted)', letterSpacing: '1px' }}>{k}: </span>
                                <span style={{ color: `${session.color}bb` }}>{v}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EducationBGP() {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <section ref={ref} style={{ marginBottom: '80px', fontFamily: 'var(--font-mono)' }}>

            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                marginBottom: '22px', flexWrap: 'wrap',
            }}>
                <div style={{
                    width: '12px', height: '12px', flexShrink: 0,
                    backgroundColor: 'var(--accent-blue)',
                    boxShadow: '0 0 10px var(--accent-blue-glow)',
                }} />
                <h2 style={{
                    fontSize: '20px', letterSpacing: '2px',
                    color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap',
                }}>
                    [ BGP_PEER_SESSIONS ]
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    // ACADEMIC_ROUTING_TABLE
                </div>
            </div>

            {/* Summary line */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '20px',
                marginBottom: '16px', flexWrap: 'wrap',
            }}>
                {[
                    { label: 'TOTAL_PEERS', value: sessions.length, color: '#00F0FF' },
                    { label: 'ESTABLISHED', value: sessions.length, color: '#00FFA3' },
                    { label: 'PREFIXES_RX', value: sessions.reduce((s, p) => s + p.prefixes.length, 0), color: '#7B2FFF' },
                ].map(({ label, value, color }) => (
                    <div key={label} style={{
                        display: 'flex', gap: '6px', alignItems: 'center',
                        fontSize: '10px', fontFamily: 'var(--font-mono)',
                    }}>
                        <span style={{ color: 'var(--text-muted)', letterSpacing: '1px' }}>{label}:</span>
                        <span style={{
                            color, fontWeight: 700,
                            textShadow: `0 0 8px ${color}`,
                        }}>{value}</span>
                    </div>
                ))}
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sessions.map((session, i) => (
                    <SessionCard key={session.id} session={session} index={i} visible={visible} />
                ))}
            </div>

            <style>{`
                @keyframes keepalive {
                    0%   { transform: translateX(-100px); }
                    100% { transform: translateX(calc(100vw + 100px)); }
                }
                @keyframes bgsessionPulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.25; }
                }
            `}</style>
        </section>
    );
}
