import React, { useState } from 'react';

const deployments = [
    {
        id: 'campus',
        name: 'Redundant Campus Network',
        nodes: [
            { id: 'isp', label: 'ISP Uplinks', layer: 'WAN', desc: 'Dual ISPs with BGP failover and static default route tracking.' },
            { id: 'sec', label: 'Edge Firewall', layer: 'SECURITY', desc: 'Stateful inspection, NAT, and Site-to-Site VPN endpoints.' },
            { id: 'core', label: 'Core Routers (HSRP)', layer: 'CORE', desc: 'HSRP Active/Standby configuration for default gateway redundancy.' },
            { id: 'dist', label: 'Distribution Switches', layer: 'DISTRIBUTION', desc: 'OSPF routing, inter-VLAN routing, and ACL enforcement.' },
            { id: 'access', label: 'Access Switches', layer: 'ACCESS', desc: 'Port-security, VLAN access ports, and PoE for end devices.' }
        ]
    },
    {
        id: 'branch',
        name: 'Multi-Branch Enterprise',
        nodes: [
            { id: 'isp', label: 'MPLS Provider', layer: 'WAN', desc: 'Leased lines connecting HQ to branch offices.' },
            { id: 'sec', label: 'Branch Firewalls', layer: 'SECURITY', desc: 'IPSec VPN tunnels over public internet as backup to MPLS.' },
            { id: 'core', label: 'HQ Core', layer: 'CORE', desc: 'OSPF Area 0, route summarization to branches.' },
            { id: 'dist', label: 'Branch Routers', layer: 'DISTRIBUTION', desc: 'OSPF Totally Stubby Areas, DHCP relays.' },
            { id: 'access', label: 'Branch Switches', layer: 'ACCESS', desc: 'Data and Voice VLAN separation.' }
        ]
    }
];

export default function NetworkDeployments() {
    const [activeDeployment, setActiveDeployment] = useState(deployments[0]);
    const [selectedNode, setSelectedNode] = useState(activeDeployment.nodes[2]); // Default to Core

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
                    [ NETWORK_DEPLOYMENTS ]
                </h2>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                {deployments.map(dep => (
                    <button
                        key={dep.id}
                        onClick={() => {
                            setActiveDeployment(dep);
                            setSelectedNode(dep.nodes[2]);
                        }}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: activeDeployment.id === dep.id ? 'var(--accent-blue-intense)' : 'transparent',
                            border: '1px solid var(--accent-blue)',
                            color: activeDeployment.id === dep.id ? 'var(--text-main)' : 'var(--accent-blue)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {dep.name}
                    </button>
                ))}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '20px'
            }}>
                {/* Diagram View */}
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '40px',
                    position: 'relative',
                    backgroundImage: 'radial-gradient(circle at center, rgba(59,157,255,0.05) 0%, transparent 70%)'
                }}>
                    {/* Connection Line */}
                    <div style={{
                        position: 'absolute',
                        top: '40px', bottom: '40px', left: '50%',
                        width: '2px', backgroundColor: 'var(--accent-blue)',
                        opacity: 0.3, zIndex: 0
                    }} />

                    {activeDeployment.nodes.map((node, i) => {
                        const isSelected = selectedNode?.id === node.id;
                        return (
                            <div key={node.id} 
                                onClick={() => setSelectedNode(node)}
                                style={{
                                    position: 'relative', zIndex: 1,
                                    width: '100%', maxWidth: '300px',
                                    backgroundColor: 'var(--bg-primary)',
                                    border: `1px solid ${isSelected ? 'var(--accent-green)' : 'var(--accent-blue)'}`,
                                    padding: '15px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    boxShadow: isSelected ? '0 0 20px var(--accent-green-glow)' : '0 0 10px rgba(0,0,0,0.5)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ 
                                    fontSize: '10px', color: 'var(--text-muted)', marginBottom: '5px' 
                                }}>
                                    LAYER: {node.layer}
                                </div>
                                <div style={{ 
                                    fontSize: '14px', 
                                    color: isSelected ? 'var(--accent-green)' : 'var(--text-main)',
                                    fontWeight: 'bold' 
                                }}>
                                    {node.label}
                                </div>
                                {isSelected && (
                                    <div style={{
                                        position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)',
                                        width: '0', height: '0',
                                        borderTop: '10px solid transparent',
                                        borderBottom: '10px solid transparent',
                                        borderLeft: '15px solid var(--accent-green)'
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Details Panel */}
                <div style={{
                    backgroundColor: '#03060a',
                    border: '1px solid var(--border-color)',
                    padding: '24px',
                    borderRadius: '4px'
                }}>
                    <div style={{
                        color: 'var(--accent-green)',
                        fontSize: '10px',
                        letterSpacing: '2px',
                        marginBottom: '20px',
                        borderBottom: '1px solid var(--border-color)',
                        paddingBottom: '10px'
                    }}>
                        DEVICE_INSPECTION_PANEL
                    </div>
                    
                    {selectedNode ? (
                        <div className="fade-in" key={selectedNode.id}>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>NODE_ID:</div>
                            <div style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '20px' }}>{selectedNode.label}</div>
                            
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>LAYER:</div>
                            <div style={{ fontSize: '14px', color: 'var(--accent-blue)', marginBottom: '20px' }}>{selectedNode.layer}</div>
                            
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>IMPLEMENTATION_DETAILS:</div>
                            <div style={{ 
                                fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6',
                                backgroundColor: 'rgba(59,157,255,0.05)', padding: '15px', borderLeft: '2px solid var(--accent-blue)'
                            }}>
                                {selectedNode.desc}
                            </div>
                            
                            <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-green)', borderRadius: '50%', animation: 'blink 1s infinite' }} />
                                <span style={{ fontSize: '10px', color: 'var(--accent-green)' }}>STATUS: OPERATIONAL</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                            SELECT A NODE TO VIEW DETAILS
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
