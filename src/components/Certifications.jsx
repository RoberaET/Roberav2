import React, { useState } from 'react';

const certs = [
    { seq: '010', action: 'PERMIT', protocol: 'CCNP-ADV-RT',vendor: 'CISCO',   domain: 'ADVANCED_ROUTING',       status: 'PENDING',  progress: 50 },
    { seq: '020', action: 'PERMIT', protocol: 'CCNP-CORE',  vendor: 'CISCO',   domain: 'CORE_NETWORKING',        status: 'VERIFIED', progress: 100, url: 'https://www.credly.com/badges/4f13e4f8-72b5-4180-a4ba-c56580ed4473/public_url' },
    { seq: '030', action: 'PERMIT', protocol: 'CCNA',       vendor: 'CISCO',   domain: 'NETWORK_FUNDAMENTALS',   status: 'VERIFIED', progress: 100, url: 'https://www.credly.com/badges/cd196d19-08ed-4c7b-91cc-2730c079365e/public_url' },
    { seq: '040', action: 'PERMIT', protocol: 'NSE-1',      vendor: 'FORTINET',domain: 'SECURITY_AWARENESS',     status: 'VERIFIED', progress: 100, url: 'https://www.credly.com/badges/6bd4c790-60d8-432a-997b-74b7adc42251/public_url' },
    { seq: '050', action: 'PERMIT', protocol: 'NSE-2',      vendor: 'FORTINET',domain: 'SECURITY_SOLUTIONS',     status: 'VERIFIED', progress: 100, url: 'https://www.credly.com/badges/fd0f6190-a83c-4786-9983-ec76384d3f6e/public_url' },
    { seq: '060', action: 'PERMIT', protocol: 'NSE-3',      vendor: 'FORTINET',domain: 'PRODUCT_AWARENESS',      status: 'VERIFIED', progress: 100, url: 'https://www.credly.com/badges/720e2ad4-4096-460b-8983-dc8a47c8c28f/public_url' },
    { seq: '070', action: 'PERMIT', protocol: 'ETH-HACKER', vendor: 'CISCO',   domain: 'OFFENSIVE_SECURITY',     status: 'VERIFIED', progress: 100, url: 'https://www.credly.com/badges/8c60ac0c-c3a6-4ae1-b0d7-59a7f7920b62/public_url' },
    { seq: '080', action: 'PERMIT', protocol: 'LINUX-ESS',  vendor: 'CISCO',   domain: 'OS_ADMINISTRATION',      status: 'VERIFIED', progress: 100, url: 'https://www.credly.com/badges/933d2fe6-ca2e-43e4-a3b2-ff88418e54bb/public_url' },
    { seq: '090', action: 'PERMIT', protocol: 'CMNE-F',     vendor: 'CISCO',   domain: 'CLOUD_NETWORKING',       status: 'VERIFIED', progress: 100, url: 'https://learning.meraki.net/api/rest/v2/my-certificates/e9883147-f4ce-4982-b98d-e6c997493a5e/pdf' },
    { seq: '100', action: 'PERMIT', protocol: 'JR-CYBER',   vendor: 'CISCO',   domain: 'SOC_OPERATIONS',         status: 'VERIFIED', progress: 100, url: 'https://www.credly.com/badges/40224730-ac81-4a15-be9b-f05634046933/public_url' }
];

export default function Certifications() {
    const [hovered, setHovered] = useState(null);

    return (
        <div style={{ fontFamily: 'var(--font-mono)', width: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{
                    width: '12px', height: '12px',
                    backgroundColor: 'var(--accent-green)',
                    boxShadow: '0 0 10px var(--accent-green)',
                }} />
                <h2 style={{ fontSize: '18px', letterSpacing: '2px', color: 'var(--text-main)', margin: 0 }}>
                    [ ACCESS_CONTROL_LIST ]
                </h2>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>// CERTIFICATIONS</span>
            </div>

            {/* Table */}
            <div className="scroll-x" style={{
                backgroundColor: '#03060a',
                border: '1px solid #1a2333',
                borderRadius: '4px',
            }}>
                <div style={{ minWidth: '700px' }}>
                {/* Column headers */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '45px 70px 110px 100px 1fr 85px',
                    gap: '0',
                    padding: '8px 14px',
                    backgroundColor: '#0a1120',
                    borderBottom: '1px solid #1a2333',
                    fontSize: '9px',
                    color: 'var(--text-muted)',
                    letterSpacing: '1px',
                }}>
                    <span>SEQ</span>
                    <span>ACTION</span>
                    <span>PROTOCOL</span>
                    <span>VENDOR</span>
                    <span>DOMAIN_GRANTED</span>
                    <span style={{ textAlign: 'right' }}>STATUS</span>
                </div>

                {/* Rows */}
                {certs.map((cert, idx) => {
                    const isVerified = cert.status === 'VERIFIED';
                    const isHov = hovered === cert.seq;
                    const isSpecial = idx < 6;

                    // Color theme for special certs
                    const specialColor = cert.vendor === 'CISCO' ? '#58a6ff' : '#ff7b72';
                    const hoverSpecialColor = cert.vendor === 'CISCO' ? '#79b8ff' : '#ff9b94';

                    let protocolColor = isHov ? 'var(--text-main)' : '#8ba3cc';
                    if (isSpecial) {
                        protocolColor = isHov ? hoverSpecialColor : specialColor;
                    }

                    return (
                        <div
                             key={cert.seq}
                             onMouseEnter={() => setHovered(cert.seq)}
                             onMouseLeave={() => setHovered(null)}
                             onClick={() => cert.url && window.open(cert.url, '_blank')}
                             style={{
                                 display: 'grid',
                                 gridTemplateColumns: '45px 70px 110px 100px 1fr 85px',
                                 gap: '0',
                                 padding: '10px 14px',
                                 borderBottom: '1px solid #0d1624',
                                 alignItems: 'center',
                                 backgroundColor: isHov ? '#060d1a' : 'transparent',
                                 transition: 'background 0.2s ease',
                                 cursor: cert.url ? 'pointer' : 'default',
                                 position: 'relative',
                             }}
                        >
                            {/* Left glow accent for special certs or hover state */}
                            {(isSpecial || isHov) && (
                                <div style={{
                                    position: 'absolute',
                                    left: 0, top: 0, bottom: 0,
                                    width: '3px',
                                    backgroundColor: isSpecial ? specialColor : (isVerified ? 'var(--accent-green)' : 'var(--accent-blue)'),
                                    boxShadow: isSpecial 
                                        ? `0 0 8px ${specialColor}` 
                                        : (isVerified ? '0 0 6px var(--accent-green)' : '0 0 6px var(--accent-blue)'),
                                    opacity: isSpecial ? (isHov ? 1 : 0.7) : 1,
                                    transition: 'opacity 0.2s, background-color 0.2s',
                                }} />
                            )}

                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cert.seq}</span>

                            <span style={{
                                fontSize: '10px', fontWeight: 'bold',
                                color: 'var(--accent-green)',
                                letterSpacing: '1px'
                            }}>{cert.action}</span>

                            <span style={{
                                fontSize: '11px',
                                color: protocolColor,
                                transition: 'color 0.2s',
                                fontWeight: 'bold'
                            }}>{cert.protocol}</span>

                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{cert.vendor}</span>

                            {/* Domain + progress bar */}
                            <div>
                                <span style={{ fontSize: '11px', color: isHov ? 'var(--text-main)' : 'var(--text-muted)', transition: 'color 0.2s' }}>
                                    {cert.domain}
                                </span>
                                {/* Progress bar only shows on hover or if pending */}
                                <div style={{
                                    marginTop: '5px',
                                    height: '2px',
                                    width: '100%',
                                    backgroundColor: '#111824',
                                    borderRadius: '2px',
                                    overflow: 'hidden',
                                    opacity: (isHov || !isVerified) ? 1 : 0,
                                    transition: 'opacity 0.3s ease',
                                }}>
                                    <div style={{
                                        width: `${cert.progress}%`,
                                        height: '100%',
                                        backgroundColor: isSpecial ? specialColor : (isVerified ? 'var(--accent-green)' : 'var(--accent-blue)'),
                                        boxShadow: isSpecial 
                                            ? `0 0 4px ${specialColor}` 
                                            : (isVerified ? '0 0 4px var(--accent-green)' : '0 0 4px var(--accent-blue)'),
                                        transition: 'width 0.4s ease',
                                    }} />
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    fontSize: '9px',
                                    padding: '3px 7px',
                                    borderRadius: '2px',
                                    border: `1px solid ${isSpecial ? specialColor : (isVerified ? 'var(--accent-green)' : 'var(--accent-blue)')}`,
                                    color: isSpecial ? specialColor : (isVerified ? 'var(--accent-green)' : 'var(--accent-blue)'),
                                    letterSpacing: '1px',
                                    backgroundColor: isSpecial 
                                        ? (cert.vendor === 'CISCO' ? 'rgba(88,166,255,0.06)' : 'rgba(255,123,114,0.06)') 
                                        : (isVerified ? 'rgba(46,255,122,0.06)' : 'rgba(0,150,255,0.06)'),
                                }}>
                                    {cert.status}
                                </span>
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
        </div>
    );
}

