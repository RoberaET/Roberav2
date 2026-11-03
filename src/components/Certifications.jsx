import React, { useState, useEffect, useRef } from 'react';

const certs = [
    {
        block:   '0x001',
        id:      'CCNP-ADV-RT',
        name:    'CCNP Advanced Routing',
        vendor:  'CISCO',
        domain:  'Advanced Routing & Switching',
        hash:    '7a135b5f3843469382a7',
        color:   '#00F0FF',
        url:     'https://www.credly.com/badges/7a135b5f-3843-4693-82a7-b12fb4b1231c/public_url',
        tier:    'EXPERT',
        badge:   '/badges/ccnp-adv-rt.png',
    },
    {
        block:   '0x002',
        id:      'CCNP-CORE',
        name:    'CCNP Core Networking',
        vendor:  'CISCO',
        domain:  'Enterprise Core Infrastructure',
        hash:    '4f13e4f872b54180a4ba',
        color:   '#00F0FF',
        url:     'https://www.credly.com/badges/4f13e4f8-72b5-4180-a4ba-c56580ed4473/public_url',
        tier:    'EXPERT',
        badge:   '/badges/ccnp-core.png',
    },
    {
        block:   '0x003',
        id:      'CCNA',
        name:    'Cisco Certified Network Associate',
        vendor:  'CISCO',
        domain:  'Network Fundamentals',
        hash:    'cd196d1908ed4c7b91cc',
        color:   '#00F0FF',
        url:     'https://www.credly.com/badges/cd196d19-08ed-4c7b-91cc-2730c079365e/public_url',
        tier:    'ASSOCIATE',
        badge:   '/badges/ccna.png',
    },
    {
        block:   '0x004',
        id:      'NSE-1',
        name:    'Fortinet Security Expert L1',
        vendor:  'FORTINET',
        domain:  'Security Awareness',
        hash:    '6bd4c79060d8432a997b',
        color:   '#FF00C8',
        url:     'https://www.credly.com/badges/6bd4c790-60d8-432a-997b-74b7adc42251/public_url',
        tier:    'SECURITY',
        badge:   '/badges/nse-1.png',
    },
    {
        block:   '0x005',
        id:      'NSE-2',
        name:    'Fortinet Security Expert L2',
        vendor:  'FORTINET',
        domain:  'Security Solutions',
        hash:    'fd0f619083c47869983e',
        color:   '#FF00C8',
        url:     'https://www.credly.com/badges/fd0f6190-a83c-4786-9983-ec76384d3f6e/public_url',
        tier:    'SECURITY',
        badge:   '/badges/nse-2.png',
    },
    {
        block:   '0x006',
        id:      'NSE-3',
        name:    'Fortinet Security Expert L3',
        vendor:  'FORTINET',
        domain:  'Product Awareness',
        hash:    '720e2ad440964b098349',
        color:   '#FF00C8',
        url:     'https://www.credly.com/badges/720e2ad4-4096-460b-8983-dc8a47c8c28f/public_url',
        tier:    'SECURITY',
        badge:   '/badges/nse-3.png',
    },
    {
        block:   '0x007',
        id:      'ETH-HACKER',
        name:    'Ethical Hacker',
        vendor:  'CISCO',
        domain:  'Offensive Security',
        hash:    '8c60ac0ca3c6ae1b0d75',
        color:   '#00FFA3',
        url:     'https://www.credly.com/badges/8c60ac0c-c3a6-4ae1-b0d7-59a7f7920b62/public_url',
        tier:    'SECURITY',
        badge:   '/badges/eth-hacker.png',
    },
    {
        block:   '0x008',
        id:      'LINUX-ESS',
        name:    'Linux Essentials',
        vendor:  'CISCO',
        domain:  'OS Administration',
        hash:    '933d2fe6ca2e43e4a3b2',
        color:   '#00FFA3',
        url:     'https://www.credly.com/badges/933d2fe6-ca2e-43e4-a3b2-ff88418e54bb/public_url',
        tier:    'ASSOCIATE',
        badge:   '/badges/linux-ess.png',
    },
    {
        block:   '0x009',
        id:      'CMNE-F',
        name:    'Cisco Meraki Network Essentials',
        vendor:  'CISCO',
        domain:  'Cloud Networking',
        hash:    'e9883147f4ce4982b98d',
        color:   '#7B2FFF',
        url:     'https://learning.meraki.net/api/rest/v2/my-certificates/e9883147-f4ce-4982-b98d-e6c997493a5e/pdf',
        tier:    'CLOUD',
        badge:   '/badges/cisco-meraki.png',
    },
    {
        block:   '0x00A',
        id:      'JR-CYBER',
        name:    'Junior Cybersecurity Analyst',
        vendor:  'CISCO',
        domain:  'SOC Operations',
        hash:    '40224730ac814a15be9b',
        color:   '#00FFA3',
        url:     'https://www.credly.com/badges/40224730-ac81-4a15-be9b-f05634046933/public_url',
        tier:    'SECURITY',
        badge:   '/badges/jr-cyber.png',
    },
];

// Animated chain link connector between blocks
function ChainLink({ color }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '28px',
            position: 'relative',
            zIndex: 1,
        }}>
            {/* The vertical line */}
            <div style={{
                width: '1px',
                flex: 1,
                background: `linear-gradient(180deg, ${color}00, ${color}55, ${color}00)`,
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Flowing packet dot */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: '-2px',
                    width: '5px', height: '5px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    boxShadow: `0 0 6px ${color}`,
                    animation: 'chainFlow 1.6s linear infinite',
                }} />
            </div>
        </div>
    );
}

// Hex ring signature badge
function SigRing({ color, size = 44 }) {
    const r  = 17;
    const c  = size / 2;
    const circumference = 2 * Math.PI * r;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
            {/* Track */}
            <circle cx={c} cy={c} r={r} fill="none"
                stroke={`${color}20`} strokeWidth="2.5" />
            {/* Arc — full circle, rotates */}
            <circle cx={c} cy={c} r={r} fill="none"
                stroke={color} strokeWidth="2.5"
                strokeDasharray={`${circumference * 0.72} ${circumference * 0.28}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${c} ${c})`}
                style={{
                    filter: `drop-shadow(0 0 4px ${color})`,
                    animation: 'sigSpin 8s linear infinite',
                }}
            />
            {/* Centre lock icon */}
            <text x={c} y={c + 4} textAnchor="middle"
                fill={color} fontSize="11"
                fontFamily="'JetBrains Mono', monospace">
                ✓
            </text>
        </svg>
    );
}

function CertBlock({ cert, index, visible }) {
    const [open, setOpen] = useState(index === 0);
    const [verifying, setVerifying] = useState(false);

    const handleVerify = (e) => {
        e.stopPropagation();
        setVerifying(true);
        setTimeout(() => {
            window.open(cert.url, '_blank');
            setVerifying(false);
        }, 900);
    };

    return (
        <div
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            style={{
                position: 'relative',
                border: `1px solid ${open ? cert.color + '66' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '3px',
                backgroundColor: open ? `${cert.color}0a` : 'rgba(4,7,16,0.6)',
                cursor: 'default',
                transition: 'border-color 0.3s, background-color 0.3s, box-shadow 0.3s',
                boxShadow: open ? `0 0 24px ${cert.color}15` : 'none',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(16px)',
                transitionProperty: 'opacity, transform, border-color, background-color, box-shadow',
                transitionDuration: '0.4s, 0.4s, 0.3s, 0.3s, 0.3s',
                transitionDelay: `${index * 0.06}s`,
            }}
        >
            {/* Top accent line */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: open
                    ? `linear-gradient(90deg, transparent, ${cert.color}, transparent)`
                    : 'transparent',
                transition: 'background 0.4s',
            }} />

            {/* ── COLLAPSED ROW ── */}
            <div
                onClick={() => setOpen(prev => !prev)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '11px 14px',
                    cursor: 'pointer',
                }}
            >
                {/* Sig ring */}
                <SigRing color={cert.color} size={40} />

                {/* Identity */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        marginBottom: '3px',
                    }}>
                        <span style={{
                            fontSize: '12px', fontWeight: 700,
                            color: open ? cert.color : 'rgba(232,240,255,0.8)',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.5px',
                            transition: 'color 0.3s',
                        }}>
                            {cert.id}
                        </span>
                        <span style={{
                            fontSize: '8px', color: cert.color,
                            border: `1px solid ${cert.color}44`,
                            padding: '1px 6px', borderRadius: '1px',
                            letterSpacing: '1.5px', fontFamily: 'var(--font-mono)',
                            backgroundColor: `${cert.color}0d`,
                            whiteSpace: 'nowrap',
                        }}>
                            {cert.tier}
                        </span>
                    </div>
                    <div style={{
                        fontSize: '10px', color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.3px',
                    }}>
                        {cert.vendor} · {cert.domain}
                    </div>
                    {/* Hash fingerprint */}
                    <div style={{
                        fontSize: '8px', color: 'rgba(255,255,255,0.12)',
                        fontFamily: 'var(--font-mono)', marginTop: '3px',
                        letterSpacing: '0.5px',
                    }}>
                        SHA: {cert.hash.substring(0, 8)}···{cert.block}
                    </div>
                </div>

                {/* Block number + chevron */}
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-end', gap: '4px', flexShrink: 0,
                }}>
                    <span style={{
                        fontSize: '9px', color: 'rgba(255,255,255,0.2)',
                        fontFamily: 'var(--font-mono)', letterSpacing: '1px',
                    }}>
                        {cert.block}
                    </span>
                    <span style={{
                        fontSize: '9px', color: 'var(--text-muted)',
                        transform: open ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s',
                    }}>▼</span>
                </div>
            </div>

            {/* ── EXPANDED: decoded block ── */}
            <div style={{
                maxHeight: open ? '550px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}>
                <div style={{
                    borderTop: `1px solid ${cert.color}20`,
                    margin: '0 14px',
                    padding: '16px 0 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                    flexWrap: 'wrap',
                }}>
                    {/* Left: Credential details */}
                    <div style={{
                        flex: '1 1 250px',
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                    }}>
                        {/* Full cert name */}
                        <div>
                            <div style={{ fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '4px' }}>
                                CREDENTIAL_NAME
                            </div>
                            <div style={{
                                fontSize: '13px', color: 'var(--text-main)',
                                fontFamily: 'var(--font-sans)', lineHeight: 1.4, fontWeight: 600,
                            }}>
                                {cert.name}
                            </div>
                        </div>

                        {/* Hash rows */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px',
                        }}>
                            {[
                                { label: 'ISSUER', value: cert.vendor },
                                { label: 'BLOCK_ID', value: cert.block },
                                { label: 'DOMAIN', value: cert.domain },
                                { label: 'SIG_STATUS', value: 'VERIFIED ✓' },
                            ].map((row, i) => (
                                <div key={i}>
                                    <div style={{ fontSize: '7px', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '2px' }}>
                                        {row.label}
                                    </div>
                                    <div style={{
                                        fontSize: '10px',
                                        color: row.label === 'SIG_STATUS' ? cert.color : 'rgba(232,240,255,0.7)',
                                        fontFamily: 'var(--font-mono)',
                                    }}>
                                        {row.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Full hash */}
                        <div>
                            <div style={{ fontSize: '7px', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '3px' }}>
                                HASH_FINGERPRINT
                            </div>
                            <div style={{
                                fontSize: '9px', color: `${cert.color}88`,
                                fontFamily: 'var(--font-mono)', letterSpacing: '1px',
                                wordBreak: 'break-all',
                            }}>
                                {cert.hash}···
                            </div>
                        </div>

                        {/* Verify button */}
                        <button
                            onClick={handleVerify}
                            style={{
                                all: 'unset',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                border: `1px solid ${cert.color}55`,
                                borderRadius: '2px',
                                backgroundColor: `${cert.color}0e`,
                                color: cert.color,
                                fontSize: '10px',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-mono)',
                                transition: 'all 0.2s',
                                boxShadow: verifying ? `0 0 16px ${cert.color}44` : 'none',
                                alignSelf: 'flex-start',
                            }}
                        >
                            {verifying ? '◈  VERIFYING...' : '> VERIFY SIGNATURE'}
                        </button>
                    </div>

                    {/* Right: High-Res Official Badge Showcase */}
                    <div
                        onClick={handleVerify}
                        title={`View official ${cert.name} credential`}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '14px 20px',
                            borderRadius: '8px',
                            background: `radial-gradient(ellipse at center, ${cert.color}18 0%, rgba(5,8,18,0.75) 75%)`,
                            border: `1px solid ${cert.color}30`,
                            boxShadow: `0 10px 36px rgba(0,0,0,0.7), inset 0 0 24px ${cert.color}0d`,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                            e.currentTarget.style.borderColor = `${cert.color}77`;
                            e.currentTarget.style.boxShadow = `0 14px 42px ${cert.color}28, inset 0 0 30px ${cert.color}20`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.borderColor = `${cert.color}30`;
                            e.currentTarget.style.boxShadow = `0 10px 36px rgba(0,0,0,0.7), inset 0 0 24px ${cert.color}0d`;
                        }}
                    >
                        <img
                            src={cert.badge}
                            alt={`${cert.name} Official Badge`}
                            style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.7))',
                                transition: 'filter 0.3s ease',
                            }}
                            loading="lazy"
                        />
                        <div style={{
                            marginTop: '10px',
                            fontSize: '9px',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '2px',
                            color: cert.color,
                            opacity: 0.9,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                        }}>
                            <span>⬡</span>
                            <span>OFFICIAL_BADGE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Certifications() {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.08 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} style={{ fontFamily: 'var(--font-mono)', width: '100%' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
                <div style={{
                    width: '12px', height: '12px', flexShrink: 0,
                    backgroundColor: 'var(--accent-green)',
                    boxShadow: '0 0 10px var(--accent-green)',
                }} />
                <h2 style={{
                    fontSize: '18px', letterSpacing: '2px',
                    color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap',
                }}>
                    [ CRYPTO_LEDGER ]
                </h2>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    // CERTIFICATIONS
                </span>
            </div>

            {/* Chain */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {certs.map((cert, i) => (
                    <React.Fragment key={cert.block}>
                        <CertBlock cert={cert} index={i} visible={visible} />
                        {i < certs.length - 1 && <ChainLink color={cert.color} />}
                    </React.Fragment>
                ))}
            </div>

            {/* Footer summary */}
            <div style={{
                marginTop: '16px',
                padding: '10px 14px',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '3px',
                backgroundColor: 'rgba(0,255,163,0.03)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.6s ease 0.6s',
            }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        BLOCKS: <span style={{ color: '#00FFA3' }}>{certs.length}</span>
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        CHAIN_INTEGRITY: <span style={{ color: '#00FFA3' }}>INTACT</span>
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        ALL_SIGS: <span style={{ color: '#00FFA3' }}>VERIFIED ✓</span>
                    </span>
                </div>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.5px' }}>
                    hover any block to decode
                </span>
            </div>

            <style>{`
                @keyframes chainFlow {
                    0%   { top: -6px; opacity: 0; }
                    20%  { opacity: 1; }
                    80%  { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes sigSpin {
                    from { transform: rotate(-90deg); }
                    to   { transform: rotate(270deg); }
                }
            `}</style>
        </div>
    );
}
