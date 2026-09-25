import React, { useState } from 'react';

const bgpSessions = [
    {
        id: '1',
        peer: 'MICROLINK INFO TECH COLLEGE',
        asn: 'AS-64510',
        routes: 'B.Sc. COMPUTER ENGINEERING',
        uptime: 'Oct 2019 - Aug 2024',
        status: 'ESTABLISHED',
        prefixes: [
            '10.0.0.0/8 [Information & Computer Security]',
            '172.16.0.0/12 [Software Engineering]',
            '192.168.1.0/24 [Object Oriented Programming]',
            '0.0.0.0/0 [Microcomputer & Interfacing]'
        ]
    },
    {
        id: '2',
        peer: 'ADDIS ABABA UNIVERSITY',
        asn: 'AS-64511',
        routes: 'B.A in MANAGEMENT',
        uptime: 'Oct 2020 - Jun 2025',
        status: 'ESTABLISHED',
        prefixes: [
            '10.100.0.0/16 [Business Strategy]',
            '172.31.0.0/16 [Project Management]',
            '192.168.10.0/24 [Organizational Behavior]',
            '0.0.0.0/0 [Operations Management]'
        ]
    }
];

export default function EducationBGP() {
    const [hoveredSession, setHoveredSession] = useState(null);

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
                    [ BGP_PEER_SESSIONS ]
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                    // ACADEMIC_ROUTING_TABLE
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {bgpSessions.map((session) => {
                    const isHovered = hoveredSession === session.id;

                    return (
                        <div 
                            key={session.id}
                            onMouseEnter={() => setHoveredSession(session.id)}
                            onMouseLeave={() => setHoveredSession(null)}
                            style={{
                                border: `1px solid ${isHovered ? 'var(--accent-green)' : '#1a2333'}`,
                                backgroundColor: '#050a12',
                                borderRadius: '4px',
                                padding: '25px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                boxShadow: isHovered ? '0 0 20px rgba(46, 255, 122, 0.1)' : 'none'
                            }}
                        >
                            {/* Animated Keepalive Line */}
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, height: '2px',
                                background: '#111824',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: '100px',
                                    height: '100%',
                                    background: isHovered ? 'var(--accent-green)' : 'var(--accent-blue)',
                                    boxShadow: isHovered ? '0 0 10px var(--accent-green)' : '0 0 10px var(--accent-blue)',
                                    animation: `packetFly ${isHovered ? '1s' : '3s'} linear infinite`
                                }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '20px', alignItems: 'center' }}>
                                
                                {/* Autonomous System Info */}
                                <div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>REMOTE_PEER_ASN</div>
                                    <div style={{ fontSize: '16px', color: 'var(--text-main)', fontWeight: 'bold' }}>{session.asn}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{session.peer}</div>
                                </div>

                                {/* Routes Received (Degree) */}
                                <div style={{ 
                                    borderLeft: '1px dashed #1a2333',
                                    borderRight: '1px dashed #1a2333',
                                    padding: '0 20px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>IMPORTED_ROUTES</div>
                                        <div style={{ fontSize: '10px', color: 'var(--accent-green)' }}>STATE: {session.status}</div>
                                    </div>
                                    <div style={{ 
                                        fontSize: '18px', 
                                        color: isHovered ? 'var(--text-main)' : 'var(--accent-blue)',
                                        textShadow: isHovered ? '0 0 10px var(--accent-blue-glow)' : 'none',
                                        transition: 'all 0.3s ease',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px'
                                    }}>
                                        {session.routes}
                                    </div>
                                    
                                    {/* Sub-routes dropdown simulation */}
                                    <div style={{
                                        maxHeight: isHovered ? '100px' : '0px',
                                        opacity: isHovered ? 1 : 0,
                                        overflow: 'hidden',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        marginTop: isHovered ? '15px' : '0'
                                    }}>
                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>&gt; show ip bgp neighbors {session.asn} routes</div>
                                        {session.prefixes.map((prefix, i) => (
                                            <div key={i} style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', gap: '10px' }}>
                                                <span style={{ color: 'var(--accent-green)' }}>*&gt;</span>
                                                {prefix}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Uptime */}
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>SESSION_UPTIME</div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-main)' }}>{session.uptime}</div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
