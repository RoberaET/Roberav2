import React, { useState, useEffect, useRef } from 'react';

const INTERFACES = [
    {
        id: 'eth0',
        proto: 'SMTP / EMAIL',
        label: 'robera.contact@gmail.com',
        link: 'mailto:robera.contact@gmail.com',
        color: '#00FFA3',
        bgColor: '#051d14',
        bgHover: '#0a2e20',
        borderColor: 'rgba(0, 255, 163, 0.45)',
        iconBg: 'rgba(0, 255, 163, 0.15)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFA3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
        ),
        l7: 'SMTP  TO: robera.contact@gmail.com',
        l4: 'TCP   DST:587  SYN  SEQ:0x4FA2',
        l3: 'SRC: 10.0.0.1   DST: 74.125.28.108',
        l2: 'MAC: AA:BB:CC:11:22:33  FCS: OK',
    },
    {
        id: 'eth1',
        proto: 'HTTPS / LINKEDIN',
        label: 'linkedin.com/in/roberamekonnen',
        link: 'https://linkedin.com/in/roberamekonnen/',
        color: '#00F0FF',
        bgColor: '#041c2b',
        bgHover: '#072d45',
        borderColor: 'rgba(0, 240, 255, 0.45)',
        iconBg: 'rgba(0, 240, 255, 0.15)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
            </svg>
        ),
        l7: 'HTTPS GET /in/roberamekonnen HTTP/2',
        l4: 'TCP   DST:443  SYN  SEQ:0x9C3E',
        l3: 'SRC: 10.0.0.1   DST: 108.174.10.10',
        l2: 'MAC: AA:BB:CC:44:55:66  FCS: OK',
    },
    {
        id: 'eth2',
        proto: 'HTTPS / GITHUB',
        label: 'github.com/RoberaET',
        link: 'https://github.com/RoberaET',
        color: '#9D5CF6',
        bgColor: '#160a2e',
        bgHover: '#231047',
        borderColor: 'rgba(157, 92, 246, 0.45)',
        iconBg: 'rgba(157, 92, 246, 0.15)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9D5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
        ),
        l7: 'HTTPS GET /RoberaET HTTP/2',
        l4: 'TCP   DST:443  SYN  SEQ:0x1B7F',
        l3: 'SRC: 10.0.0.1   DST: 140.82.114.4',
        l2: 'MAC: AA:BB:CC:77:88:99  FCS: OK',
    },
    {
        id: 'eth3',
        proto: 'GSM / VOICE',
        label: '+251 941 552 458',
        link: 'tel:+251941552458',
        color: '#FF00C8',
        bgColor: '#26061d',
        bgHover: '#3d0a2f',
        borderColor: 'rgba(255, 0, 200, 0.45)',
        iconBg: 'rgba(255, 0, 200, 0.15)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF00C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
        l7: 'SIP   INVITE sip:+251941552458',
        l4: 'UDP   DST:5060  LEN:512',
        l3: 'SRC: 10.0.0.1   DST: 196.188.x.x',
        l2: 'MAC: AA:BB:CC:AA:BB:CC  FCS: OK',
    },
];

const LAYERS = [
    { id: 'l7', name: 'APPLICATION', level: 7, color: '#00FFA3' },
    { id: 'l4', name: 'TRANSPORT',   level: 4, color: '#00F0FF' },
    { id: 'l3', name: 'NETWORK',     level: 3, color: '#9D5CF6' },
    { id: 'l2', name: 'DATA LINK',   level: 2, color: '#FF00C8' },
];

function useTick(ms) {
    const [t, setT] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setT(x => x + 1), ms);
        return () => clearInterval(id);
    }, [ms]);
    return t;
}

export default function EstablishConnection() {
    const [selected, setSelected] = useState(null); // interface id
    const [hovered, setHovered] = useState(null);
    const [txPhase, setTxPhase] = useState(0); // 0=idle 1=building 2=sending 3=sent
    const [litLayer, setLitLayer] = useState(-1); // 0..3 during send animation
    const tick = useTick(1000); // drives live counters
    const [seq, setSeq] = useState(0x4FA2);

    useEffect(() => {
        setSeq(s => s + Math.floor(Math.random() * 17) + 1);
    }, [tick]);

    const active = INTERFACES.find(i => i.id === (hovered || selected)) || null;

    const handleSelect = (iface) => {
        if (txPhase === 2) return;
        setSelected(iface.id);
        setTxPhase(1);
        setLitLayer(-1);
    };

    const handleTransmit = () => {
        if (!selected || txPhase === 2) return;
        const iface = INTERFACES.find(i => i.id === selected);
        setTxPhase(2);
        // light up layers L2→L3→L4→L7
        [0, 1, 2, 3].forEach(i => {
            setTimeout(() => setLitLayer(i), (3 - i) * 280);
        });
        // open link after all layers lit
        setTimeout(() => {
            window.open(iface.link, '_blank');
            setTxPhase(3);
            setTimeout(() => {
                setTxPhase(0);
                setLitLayer(-1);
                setSelected(null);
            }, 2000);
        }, 4 * 280 + 400);
    };

    // layer text for the inspector
    const layerText = (lid) => {
        if (!active) {
            return { l7: 'IDLE — no interface selected', l4: '— — —', l3: '— — —', l2: '— — —' }[lid];
        }
        return active[lid];
    };

    const layerLit = (idx) => txPhase === 2 && litLayer >= idx;

    return (
        <section style={{ marginBottom: '0px', fontFamily: 'var(--font-mono)' }}>
            <style>{`
                @keyframes pfPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.35; transform: scale(0.85); }
                }
                @keyframes pfBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .pf-iface-card {
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .pf-iface-card:hover {
                    transform: translateY(-2px);
                }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{
                    width: '12px', height: '12px', flexShrink: 0,
                    backgroundColor: 'var(--accent-blue)',
                    boxShadow: '0 0 10px var(--accent-blue-glow)',
                }} />
                <h2 style={{ fontSize: '20px', letterSpacing: '2px', color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap' }}>
                    [ PACKET_FORGE ]
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    // CONTACT_INTERFACES
                </div>
            </div>

            {/* Two-column body */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(260px, 1.1fr) minmax(280px, 1.3fr)',
                gap: '22px',
                alignItems: 'stretch',
            }}>
                {/* ══ LEFT: Opaque Interface Selector Cards with Matching SVG Icons ══ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{
                        fontSize: '9px', color: 'var(--text-muted)',
                        letterSpacing: '3px', marginBottom: '2px',
                    }}>
                        SELECT DESTINATION INTERFACE
                    </div>

                    {INTERFACES.map((iface) => {
                        const isSel = selected === iface.id;
                        const isHov = hovered === iface.id;
                        const isTx = isSel && txPhase === 2;
                        const accent = iface.color;

                        return (
                            <div
                                key={iface.id}
                                onMouseEnter={() => setHovered(iface.id)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => handleSelect(iface)}
                                className="pf-iface-card"
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    padding: '13px 16px',
                                    backgroundColor: isSel ? iface.bgHover : isHov ? iface.bgHover : iface.bgColor,
                                    border: `1px solid ${isSel ? accent : isHov ? accent + 'cc' : iface.borderColor}`,
                                    borderLeft: `4px solid ${accent}`,
                                    borderRadius: '5px',
                                    cursor: txPhase === 2 ? 'not-allowed' : 'pointer',
                                    boxShadow: isSel
                                        ? `0 6px 24px ${accent}33, inset 0 0 20px ${accent}12`
                                        : isHov
                                            ? `0 4px 18px ${accent}22`
                                            : '0 4px 12px rgba(0, 0, 0, 0.45)',
                                }}
                            >
                                {/* Distinct Opaque SVG Icon Pod */}
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '6px',
                                    backgroundColor: iface.iconBg,
                                    border: `1px solid ${accent}66`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: isSel || isHov ? `0 0 12px ${accent}44` : 'none',
                                    transition: 'all 0.25s ease',
                                }}>
                                    {iface.icon}
                                </div>

                                {/* Content Details */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                                        <span style={{
                                            fontSize: '8px',
                                            color: accent,
                                            letterSpacing: '2px',
                                            fontWeight: 700,
                                        }}>
                                            {iface.id}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {isTx && (
                                                <span style={{
                                                    fontSize: '8px',
                                                    color: accent,
                                                    letterSpacing: '1px',
                                                    animation: 'pfBlink 0.5s step-end infinite',
                                                }}>
                                                    TRANSMITTING
                                                </span>
                                            )}
                                            <div style={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                backgroundColor: accent,
                                                boxShadow: `0 0 6px ${accent}`,
                                                animation: 'pfPulse 2s ease-in-out infinite',
                                            }} />
                                        </div>
                                    </div>

                                    {/* Protocol */}
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#E8F0FF',
                                        fontWeight: 700,
                                        letterSpacing: '1px',
                                        marginBottom: '3px',
                                    }}>
                                        {iface.proto}
                                    </div>

                                    {/* Destination Value */}
                                    <div style={{
                                        fontSize: '11px',
                                        color: isSel || isHov ? accent : 'rgba(232, 240, 255, 0.72)',
                                        wordBreak: 'break-all',
                                        transition: 'color 0.2s',
                                    }}>
                                        {iface.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ══ RIGHT: Packet Inspector + Transmit Console ══ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{
                        fontSize: '9px', color: 'var(--text-muted)',
                        letterSpacing: '3px', marginBottom: '2px',
                    }}>
                        PACKET INSPECTOR — OSI ENCAPSULATION
                    </div>

                    {/* Layer stack — rendered BOTTOM UP visually = L7 top, L2 bottom */}
                    <div style={{
                        border: '1px solid rgba(0, 240, 255, 0.25)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: '#04020f',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {LAYERS.map((layer, idx) => {
                                const lit = layerLit(3 - idx); // L2=idx3, L7=idx0 in array; lit from bottom
                                const text = layerText(layer.id);
                                const hasIface = !!active;

                                return (
                                    <div
                                        key={layer.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            borderBottom: idx < LAYERS.length - 1
                                                ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                                            backgroundColor: lit
                                                ? `${layer.color}1e`
                                                : 'transparent',
                                            transition: 'background-color 0.3s ease',
                                            boxShadow: lit
                                                ? `inset 0 0 20px ${layer.color}14`
                                                : 'none',
                                            flex: 1,
                                        }}
                                    >
                                        {/* Left label column */}
                                        <div style={{
                                            width: '120px',
                                            flexShrink: 0,
                                            padding: '12px 14px',
                                            borderRight: `2px solid ${lit ? layer.color : layer.color + '44'}`,
                                            transition: 'border-color 0.3s',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '2px',
                                        }}>
                                            <span style={{
                                                fontSize: '8px',
                                                color: lit ? layer.color : layer.color + 'aa',
                                                letterSpacing: '1.5px',
                                                fontWeight: 700,
                                                transition: 'color 0.3s',
                                            }}>
                                                L{layer.level}
                                            </span>
                                            <span style={{
                                                fontSize: '9px',
                                                color: lit ? '#E8F0FF' : 'rgba(232, 240, 255, 0.35)',
                                                letterSpacing: '1px',
                                                fontWeight: 600,
                                                transition: 'color 0.3s',
                                            }}>
                                                {layer.name}
                                            </span>
                                            {lit && (
                                                <div style={{
                                                    width: '100%', height: '1px',
                                                    background: `linear-gradient(90deg, ${layer.color}, transparent)`,
                                                    marginTop: '3px',
                                                    boxShadow: `0 0 4px ${layer.color}`,
                                                }} />
                                            )}
                                        </div>

                                        {/* Right data column */}
                                        <div style={{
                                            padding: '12px 16px',
                                            fontSize: '10px',
                                            fontFamily: 'var(--font-mono)',
                                            color: lit
                                                ? '#E8F0FF'
                                                : hasIface ? 'rgba(232, 240, 255, 0.75)' : 'rgba(255, 255, 255, 0.2)',
                                            lineHeight: '1.6',
                                            wordBreak: 'break-all',
                                            transition: 'color 0.3s',
                                            flex: 1,
                                        }}>
                                            {text || '—'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Live counters bar */}
                        <div style={{
                            padding: '8px 16px',
                            backgroundColor: '#020108',
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <span style={{ fontSize: '9px', color: 'rgba(74, 90, 138, 0.75)', letterSpacing: '1px' }}>
                                SEQ: 0x{seq.toString(16).toUpperCase().padStart(4, '0')}
                            </span>
                            <span style={{ fontSize: '9px', color: 'rgba(74, 90, 138, 0.75)', letterSpacing: '1px' }}>
                                {txPhase === 3 ? (
                                    <span style={{ color: '#00FFA3', fontWeight: 600 }}>✓ FRAME TRANSMITTED</span>
                                ) : txPhase === 2 ? (
                                    <span style={{ color: '#00F0FF', fontWeight: 600, animation: 'pfBlink 0.6s step-end infinite' }}>◈ ENCAPSULATING...</span>
                                ) : active ? (
                                    <span style={{ color: active.color, fontWeight: 600 }}>◇ READY TO FORGE</span>
                                ) : (
                                    '○ IDLE'
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Transmit button */}
                    <button
                        onClick={handleTransmit}
                        disabled={!selected || txPhase === 2}
                        style={{
                            all: 'unset',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '13px 0',
                            border: `1px solid ${selected && txPhase !== 2 ? '#00F0FF' : 'rgba(74, 90, 138, 0.25)'}`,
                            borderRadius: '4px',
                            backgroundColor: selected && txPhase !== 2 ? 'rgba(0, 240, 255, 0.12)' : 'rgba(8, 5, 26, 0.5)',
                            color: selected && txPhase !== 2 ? '#00F0FF' : 'rgba(74, 90, 138, 0.6)',
                            fontSize: '11px',
                            letterSpacing: '2px',
                            fontWeight: 700,
                            cursor: selected && txPhase !== 2 ? 'pointer' : 'not-allowed',
                            transition: 'all 0.3s ease',
                            boxShadow: selected && txPhase !== 2 ? '0 0 20px rgba(0, 240, 255, 0.2)' : 'none',
                        }}
                    >
                        {txPhase === 2 ? '◈  ENCAPSULATING & TRANSMITTING...' :
                         txPhase === 3 ? '✓  PACKET TRANSMITTED' :
                         selected      ? '>  FORGE & TRANSMIT' :
                                         'SELECT INTERFACE FIRST'}
                    </button>
                </div>
            </div>
        </section>
    );
}
