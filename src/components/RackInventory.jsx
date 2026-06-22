import React, { useState } from 'react';

const servers = [
    {
        id: '01',
        name: 'BESYS Technologies',
        status: 'ONLINE',
        role: 'Network Engineer',
        duration: 'Current',
        logs: [
            "[OK] Deployed and maintained enterprise LAN/WAN infrastructure",
            "[OK] Configured VLAN segmentation and inter-VLAN routing",
            "[OK] Implemented OSPF routing in enterprise environments",
            "[OK] Supported IP-based CCTV camera installation and configuration",
            "[INFO] Performed daily network monitoring and troubleshooting",
            "[INFO] Supported branch connectivity and uptime stability"
        ]
    },
    {
        id: '02',
        name: 'IE Network Solutions',
        status: 'ARCHIVED',
        role: 'Modern Data Center & Cloud Engineer',
        duration: 'Previous',
        logs: [
            "[OK] Managed Active Directory (AD) user and group administration",
            "[OK] Supported Windows Server environment (DNS, DHCP, file services)",
            "[OK] Assisted Exchange Server configuration and mailbox management",
            "[OK] Performed data migration between on-prem systems and servers",
            "[OK] Supported virtualization infrastructure (VMware / Hyper-V)",
            "[INFO] Assisted in backup and system recovery operations"
        ]
    },
    {
        id: '03',
        name: 'Personal Projects',
        status: 'STANDBY',
        role: 'Network Engineering Labs',
        duration: 'ONGOING',
        logs: [
            "[OK] Built campus network topologies using Cisco Packet Tracer / GNS3",
            "[OK] Designed redundant campus network architectures (STP, link redundancy)",
            "[OK] Simulated multi-branch enterprise network connectivity (VPN / routing)",
            "[INFO] Implementing scalable enterprise-style network designs"
        ]
    }
];

export default function RackInventory() {
    const [expandedServer, setExpandedServer] = useState(null);

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
                    [ RACK_INVENTORY ]
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                    // PROFESSIONAL_EXPERIANCES
                </div>
            </div>

            {/* Server Rack Frame */}
            <div style={{
                backgroundColor: '#03060a',
                border: '2px solid #1a2333',
                borderLeft: '10px solid #111824',
                borderRight: '10px solid #111824',
                borderRadius: '4px',
                padding: '20px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)'
            }}>
                {servers.map((server) => {
                    const isExpanded = expandedServer === server.id;
                    const isOnline = server.status === 'ONLINE';
                    
                    return (
                        <div key={server.id} 
                            style={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid #1a2333',
                            borderTop: '2px solid #2a3548',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }}>
                            {/* 1U Server Faceplate */}
                            <div 
                                onClick={() => setExpandedServer(isExpanded ? null : server.id)}
                                style={{
                                    padding: '12px 20px',
                                    display: 'grid',
                                    gridTemplateColumns: '10px 60px 1fr 80px 10px',
                                    alignItems: 'center',
                                    gap: '15px',
                                    background: 'linear-gradient(90deg, #0b1324 0%, #111a2e 50%, #0b1324 100%)',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ width: '10px', height: '24px', backgroundColor: '#1a2333', borderRadius: '2px' }} />
                                <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>UNIT_{server.id}</div>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        color: 'var(--text-main)', fontSize: '14px', letterSpacing: '1px', fontWeight: 'bold',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                    }}>
                                        {server.name}
                                    </div>
                                    <div style={{ 
                                        fontSize: '12px', color: 'var(--accent-blue)', 
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
                                    }}>
                                        {server.role}
                                    </div>
                                </div>
                                <div style={{ 
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    color: isOnline ? 'var(--accent-green)' : 'var(--text-muted)',
                                    fontSize: '10px'
                                }}>
                                    <div style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        backgroundColor: isOnline ? 'var(--accent-green)' : (server.status === 'STANDBY' ? 'var(--accent-blue)' : '#444'),
                                        boxShadow: isOnline ? '0 0 8px var(--accent-green)' : (server.status === 'STANDBY' ? '0 0 8px var(--accent-blue)' : 'none'),
                                        animation: isOnline ? 'blink 2s infinite' : 'none'
                                    }} />
                                    {server.status}
                                </div>
                                <div style={{ width: '10px', height: '24px', backgroundColor: '#1a2333', borderRadius: '2px' }} />
                            </div>

                            {/* Slide-out Logs */}
                            <div style={{
                                maxHeight: isExpanded ? '300px' : '0px',
                                padding: isExpanded ? '20px' : '0 20px',
                                opacity: isExpanded ? 1 : 0,
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                backgroundColor: '#050a12',
                                borderTop: isExpanded ? '1px solid #1a2333' : 'none',
                            }}>
                                <div style={{ fontSize: '12px', color: 'var(--accent-blue)', marginBottom: '10px' }}>
                                    &gt; EXTRACTING_SYS_LOGS... [{server.duration}]
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {server.logs.map((log, i) => (
                                        <div key={i} style={{ 
                                            fontSize: '13px', 
                                            color: log.startsWith('[OK]') ? 'var(--accent-green)' : 'var(--text-main)',
                                            display: 'flex',
                                            gap: '10px'
                                        }}>
                                            <span style={{ opacity: 0.5 }}>{new Date().toISOString().split('T')[1].substring(0,8)}</span>
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </section>
    );
}
