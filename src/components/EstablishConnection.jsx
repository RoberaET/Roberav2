import React, { useState } from 'react';

export default function EstablishConnection() {
    const [hoveredNode, setHoveredNode] = useState(null);
    const [connectingTo, setConnectingTo] = useState(null);

    const endpoints = [
        { id: 'email', label: 'MAIL_EXCHANGE', value: 'Robera4553@gmail.com', link: 'mailto:Robera4553@gmail.com', icon: '✉' },
        { id: 'linkedin', label: 'PROFESSIONAL_NETWORK', value: 'linkedin.com/in/roberamekonnen', link: 'https://linkedin.com/in/roberamekonnen/', icon: 'in' },
        { id: 'github', label: 'CODE_REPOSITORY', value: 'github.com/RoberaET', link: 'https://github.com/RoberaET', icon: '</>' },
        { id: 'resume', label: 'ENCRYPTED_CV', value: 'Download PDF', link: '#', icon: '📄' }
    ];

    const handleConnect = (ep) => {
        setConnectingTo(ep.id);
        setTimeout(() => {
            window.open(ep.link, '_blank');
            setConnectingTo(null);
        }, 3000);
    };

    return (
        <section style={{ marginBottom: '80px', fontFamily: 'var(--font-mono)' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'
            }}>
                <div style={{
                    width: '12px', height: '12px',
                    backgroundColor: 'var(--accent-blue)',
                    boxShadow: '0 0 10px var(--accent-blue-glow)'
                }} />
                <h2 style={{ fontSize: '20px', letterSpacing: '2px', color: 'var(--text-main)', margin: 0 }}>
                    [ ESTABLISH_CONNECTION ]
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                    // CONTACT_ME_OR_FIND_ME_ONLINE
                </div>
            </div>

            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '40px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-muted)', fontSize: '12px', letterSpacing: '2px' }}>
                    SELECT ENDPOINT TO INITIATE IKEv2 / IPSEC TUNNEL
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                    
                    {/* Source Node (Visitor) */}
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', border: '2px dashed var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                        backgroundColor: 'var(--bg-primary)', zIndex: 2
                    }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SOURCE</span>
                        <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 'bold' }}>YOU</span>
                    </div>

                    {/* Tunnel Animation Area */}
                    <div style={{ flex: 1, height: '2px', backgroundColor: 'rgba(255,255,255,0.05)', position: 'relative', margin: '0 20px', zIndex: 1 }}>
                        {connectingTo && (
                            <div style={{
                                position: 'absolute', top: '-1px', left: 0, height: '4px', width: '30px',
                                backgroundColor: 'var(--accent-green)', boxShadow: '0 0 15px var(--accent-green)',
                                animation: 'shoot 0.5s infinite linear'
                            }} />
                        )}
                        {connectingTo && (
                            <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', color: 'var(--accent-green)', fontSize: '10px', animation: 'blink 0.5s infinite' }}>
                                EXCHANGING KEYS...
                            </div>
                        )}
                    </div>

                    {/* Destination Nodes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 2 }}>
                        {endpoints.map((ep) => {
                            const isHovered = hoveredNode === ep.id;
                            const isConnecting = connectingTo === ep.id;

                            return (
                                <button
                                    key={ep.id}
                                    onMouseEnter={() => setHoveredNode(ep.id)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    onClick={() => handleConnect(ep)}
                                    disabled={connectingTo !== null}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '15px',
                                        padding: '10px 20px',
                                        backgroundColor: isHovered || isConnecting ? 'var(--accent-blue-intense)' : 'var(--bg-primary)',
                                        border: `1px solid ${isHovered || isConnecting ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                                        color: isHovered || isConnecting ? 'var(--text-main)' : 'var(--text-muted)',
                                        cursor: connectingTo !== null ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        textAlign: 'left',
                                        width: '250px'
                                    }}
                                >
                                    <div style={{ fontSize: '20px', width: '30px', textAlign: 'center' }}>{ep.icon}</div>
                                    <div>
                                        <div style={{ fontSize: '10px', letterSpacing: '1px' }}>{ep.label}</div>
                                        <div style={{ fontSize: '12px', color: isHovered ? 'var(--text-main)' : 'var(--accent-blue)' }}>{ep.value}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shoot {
                    0% { left: 0; opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
            `}</style>
        </section>
    );
}
