import React, { useState, useEffect } from 'react';

export default function SecurityOperations() {
    const [events, setEvents] = useState([
        { id: 1, time: '10:45:12', sev: 'LOW', msg: 'VPN tunnel established (Branch-02)' },
        { id: 2, time: '10:43:05', sev: 'INFO', msg: 'OSPF adjacency full (10.0.0.4)' },
        { id: 3, time: '10:41:22', sev: 'HIGH', msg: 'Failed SSH attempt (192.168.1.100)' }
    ]);
    const [blockedCount, setBlockedCount] = useState(1452);

    useEffect(() => {
        const interval = setInterval(() => {
            const msgs = [
                { sev: 'INFO', msg: 'BGP Keepalive received' },
                { sev: 'LOW', msg: 'Port security violation reset' },
                { sev: 'HIGH', msg: 'IPS Signature Match: SQLi attempt dropped' },
                { sev: 'INFO', msg: 'Admin user logged in via Console' },
                { sev: 'MED', msg: 'High CPU utilization detected on Core-Sw1' }
            ];
            const newMsg = msgs[Math.floor(Math.random() * msgs.length)];
            
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;

            setEvents(prev => {
                const newEvents = [{ id: Date.now(), time: timeStr, ...newMsg }, ...prev];
                if (newEvents.length > 6) newEvents.pop();
                return newEvents;
            });

            if (newMsg.sev === 'HIGH') {
                setBlockedCount(prev => prev + 1);
            }
        }, 3500);

        return () => clearInterval(interval);
    }, []);

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
                    [ SECURITY_OPERATIONS_CENTER ]
                </h2>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: 'auto auto',
                gap: '20px'
            }}>
                {/* Metric 1: Network Health */}
                <div style={{
                    backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                    padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '15px' }}>GLOBAL_NETWORK_HEALTH</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                        <div style={{ fontSize: '36px', color: 'var(--accent-green)', fontWeight: 'bold', lineHeight: '1' }}>99.9%</div>
                        <div style={{ fontSize: '12px', color: 'var(--accent-green)' }}>OPERATIONAL</div>
                    </div>
                    <div style={{ marginTop: 'auto', height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: '99.9%', height: '100%', backgroundColor: 'var(--accent-green)' }} />
                    </div>
                </div>

                {/* Metric 2: Blocked Threats */}
                <div style={{
                    backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                    padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '15px' }}>THREATS_BLOCKED_24H</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                        <div style={{ fontSize: '36px', color: 'var(--accent-blue)', fontWeight: 'bold', lineHeight: '1' }}>{blockedCount.toLocaleString()}</div>
                        <div style={{ fontSize: '12px', color: 'var(--accent-blue)' }}>+1.2% /hr</div>
                    </div>
                </div>

                {/* Metric 3: Active VPNs */}
                <div style={{
                    backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                    padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '15px' }}>ACTIVE_IPSEC_TUNNELS</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                        <div style={{ fontSize: '36px', color: 'var(--text-main)', fontWeight: 'bold', lineHeight: '1' }}>24</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>UP</div>
                    </div>
                </div>

                {/* Live Event Feed */}
                <div style={{
                    gridColumn: '1 / span 2',
                    backgroundColor: '#03060a', border: '1px solid #1a2333',
                    padding: '20px', borderRadius: '4px', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ fontSize: '10px', color: 'var(--accent-blue)', marginBottom: '15px', borderBottom: '1px solid #1a2333', paddingBottom: '10px' }}>
                        LIVE_SIEM_EVENT_FEED
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {events.map((ev) => (
                            <div key={ev.id} className="fade-in" style={{
                                display: 'grid', gridTemplateColumns: '80px 60px 1fr', gap: '15px',
                                fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '5px'
                            }}>
                                <div style={{ color: 'var(--text-muted)' }}>{ev.time}</div>
                                <div style={{ 
                                    color: ev.sev === 'HIGH' ? '#ff4d4f' : ev.sev === 'MED' ? '#faad14' : ev.sev === 'LOW' ? 'var(--accent-blue)' : 'var(--text-main)',
                                    fontWeight: 'bold'
                                }}>
                                    [{ev.sev}]
                                </div>
                                <div style={{ color: 'var(--text-main)' }}>{ev.msg}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Firewall Status Map */}
                <div style={{
                    backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                    padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    position: 'relative'
                }}>
                    <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '10px', color: 'var(--text-muted)' }}>FW_CLUSTER_STATUS</div>
                    
                    <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                        {/* Radar sweeping effect */}
                        <div style={{
                            position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--accent-blue)', opacity: 0.2
                        }} />
                        <div style={{
                            position: 'absolute', inset: '20px', borderRadius: '50%', border: '1px solid var(--accent-blue)', opacity: 0.4
                        }} />
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', width: '1px', height: '60px',
                            backgroundColor: 'var(--accent-green)', transformOrigin: 'top',
                            animation: 'radarSpin 4s linear infinite'
                        }} />
                        
                        <div style={{ position: 'absolute', top: '20px', left: '30px', width: '6px', height: '6px', backgroundColor: 'var(--accent-green)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-green)' }} />
                        <div style={{ position: 'absolute', bottom: '40px', right: '20px', width: '6px', height: '6px', backgroundColor: 'var(--accent-green)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-green)' }} />
                        
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            color: 'var(--accent-green)', fontSize: '12px', fontWeight: 'bold'
                        }}>SYNCED</div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes radarSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
}
