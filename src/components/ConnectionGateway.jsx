import React, { useState, useEffect } from 'react';

export default function ConnectionGateway({ onAuthorize }) {
    const [ip, setIp] = useState('DETECTING...');
    const [location, setLocation] = useState('DETECTING...');
    const [isp, setIsp] = useState('DETECTING...');
    const [trustScore, setTrustScore] = useState(0);
    const [status, setStatus] = useState('PENDING');
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    const [packets, setPackets] = useState([]);

    // Fetch real IP data and calculate trust score
    useEffect(() => {
        const fetchIpData = async () => {
            try {
                // Try API 1: ipapi.co
                let res = await fetch('https://ipapi.co/json/');
                if (res.ok) {
                    const data = await res.json();
                    setIp(data.ip);
                    setLocation(`${data.city || 'UNKNOWN'}, ${data.country || data.country_name || 'UNKNOWN'}`);
                    setIsp(data.org || data.asn || 'UNKNOWN_ISP');
                    return;
                }
            } catch (e) { /* ignore */ }

            try {
                // Try API 2: ipinfo.io
                let res = await fetch('https://ipinfo.io/json');
                if (res.ok) {
                    const data = await res.json();
                    setIp(data.ip);
                    setLocation(`${data.city || 'UNKNOWN'}, ${data.country || 'UNKNOWN'}`);
                    setIsp(data.org || 'UNKNOWN_ISP');
                    return;
                }
            } catch (e) { /* ignore */ }

            try {
                // Try API 3: geojs
                let res = await fetch('https://get.geojs.io/v1/ip/geo.json');
                if (res.ok) {
                    const data = await res.json();
                    setIp(data.ip);
                    setLocation(`${data.city || 'UNKNOWN'}, ${data.country || 'UNKNOWN'}`);
                    setIsp(data.organization_name || data.organization || 'UNKNOWN_ISP');
                    return;
                }
            } catch (e) { /* ignore */ }

            // Final fallback
            setIp(`${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`);
            setLocation('UNKNOWN_NODE');
            setIsp('PRIVATE_NETWORK');
        };

        fetchIpData();

        // Animate trust score calculation
        let score = 0;
        const scoreInterval = setInterval(() => {
            score += Math.floor(Math.random() * 15);
            if (score > 87) {
                score = 87 + Math.floor(Math.random() * 10);
                clearInterval(scoreInterval);
            }
            setTrustScore(score);
        }, 100);

        return () => clearInterval(scoreInterval);
    }, []);

    const handleAuthorize = () => {
        setIsAuthorizing(true);
        setStatus('ESTABLISHING SECURE TUNNEL...');
        
        // Generate flowing packets
        const newPackets = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            delay: Math.random() * 1.5,
            duration: 1 + Math.random(),
            top: `${Math.random() * 100}%`
        }));
        setPackets(newPackets);

        setTimeout(() => setStatus('SECURE CONNECTION ESTABLISHED'), 1800);
        
        // Complete the authorization and trigger transition
        setTimeout(() => {
            onAuthorize();
        }, 3000);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'var(--bg-primary)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-main)',
            overflow: 'hidden'
        }}>
            {/* Background scanning lines */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.05,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--accent-blue) 2px, var(--accent-blue) 4px)'
            }} />

            {/* Packet Flow Animation Layer */}
            {isAuthorizing && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    {packets.map(p => (
                        <div key={p.id} style={{
                            position: 'absolute',
                            left: '-10%',
                            top: p.top,
                            width: '40px',
                            height: '2px',
                            background: 'var(--accent-green)',
                            boxShadow: '0 0 10px var(--accent-green)',
                            animation: `packetFly ${p.duration}s ${p.delay}s ease-in forwards`
                        }} />
                    ))}
                </div>
            )}

            <div style={{
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                padding: '40px',
                width: '100%',
                maxWidth: '600px',
                position: 'relative',
                zIndex: 10,
                boxShadow: '0 0 40px rgba(0,0,0,0.5)'
            }}>
                <h2 style={{
                    color: isAuthorizing ? 'var(--accent-green)' : 'var(--accent-blue)',
                    fontSize: '20px',
                    letterSpacing: '2px',
                    marginBottom: '30px',
                    textTransform: 'uppercase',
                    textAlign: 'center'
                }}>
                    {status === 'PENDING' ? 'Incoming Connection Detected' : status}
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    marginBottom: '40px',
                    fontSize: '14px',
                    color: 'var(--text-muted)'
                }}>
                    <div>
                        <div style={{ marginBottom: '4px', fontSize: '10px' }}>SOURCE_IP</div>
                        <div style={{ color: 'var(--text-main)' }}>{ip}</div>
                    </div>
                    <div>
                        <div style={{ marginBottom: '4px', fontSize: '10px' }}>LOCATION_NODE</div>
                        <div style={{ color: 'var(--text-main)' }}>{location}</div>
                    </div>
                    <div>
                        <div style={{ marginBottom: '4px', fontSize: '10px' }}>TRUST_SCORE</div>
                        <div style={{ 
                            color: trustScore > 80 ? 'var(--accent-green)' : 'var(--accent-blue)',
                            textShadow: `0 0 10px ${trustScore > 80 ? 'var(--accent-green-glow)' : 'var(--accent-blue-glow)'}`
                        }}>
                            {trustScore}%
                        </div>
                    </div>
                    <div>
                        <div style={{ marginBottom: '4px', fontSize: '10px' }}>ISP_PROVIDER</div>
                        <div style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={isp}>
                            {isp}
                        </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '15px' }}>
                        <div style={{ marginBottom: '4px', fontSize: '10px' }}>STATUS</div>
                        <div style={{ color: isAuthorizing ? 'var(--accent-green)' : 'var(--accent-blue)' }}>
                            [{status}]
                        </div>
                    </div>
                </div>

                {!isAuthorizing && (
                    <button 
                        onClick={handleAuthorize}
                        disabled={trustScore === 0}
                        style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--accent-blue)',
                            color: 'var(--accent-blue)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '16px',
                            letterSpacing: '4px',
                            cursor: trustScore === 0 ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            opacity: trustScore === 0 ? 0.5 : 1
                        }}
                        onMouseOver={(e) => {
                            if (trustScore > 0) {
                                e.target.style.backgroundColor = 'var(--accent-blue-glow)';
                                e.target.style.boxShadow = '0 0 20px var(--accent-blue-glow)';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        Authorize Connection
                    </button>
                )}
            </div>

            <style>{`
                @keyframes packetFly {
                    0% { left: -10%; opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { left: 110%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
