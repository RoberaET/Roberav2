import React, { useEffect, useState } from 'react';

// Start date: July 30, 2025 (10 months 22 days before June 21, 2026)
const START_DATE = new Date('2025-07-30T00:00:00');

function computeUptime() {
    const now = new Date();
    let years  = now.getFullYear()  - START_DATE.getFullYear();
    let months = now.getMonth()     - START_DATE.getMonth();
    let days   = now.getDate()      - START_DATE.getDate();
    const hours = now.getHours();

    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    const parts = [];
    if (years > 0)  parts.push(`${years} year${years  > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days > 0 || parts.length === 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    return parts.join(' ');
}

export default function RunningConfig() {
    const [uptime, setUptime] = useState(computeUptime());

    // Refresh uptime once per minute (covers day rollovers without hammering the CPU)
    useEffect(() => {
        const id = setInterval(() => setUptime(computeUptime()), 60_000);
        return () => clearInterval(id);
    }, []);

    const configLines = [
        "!",
        "version 2.0",
        "service timestamps debug datetime msec",
        "service timestamps log datetime msec",
        "service password-encryption",
        "!",
        "hostname ROBERA",
        "!",
        "boot-start-marker",
        "boot-end-marker",
        "!",
        "identity:",
        "  role: Network Engineer",
        "  specialization:",
        "    - Network Infrastructure",
        "    - High Availability",
        "    - Routing and Switching",
        "  career_path: Cybersecurity",
        "  current_status: Operational",
        `  uptime: ${uptime} @ BESYS Technologies`,
        "!",
        "interface Loopback0",
        " description Management Interface",
        " ip address 10.0.0.1 255.255.255.255",
        "!",
        "interface GigabitEthernet0/0/0",
        " description Uplink to Global Networks",
        " ip address dhcp",
        " negotiation auto",
        "!",
        "end"
    ];

    const [visibleLines, setVisibleLines] = useState([]);
    const [hasStarted, setHasStarted] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) {
            setVisibleLines([]);
            return;
        }
        
        setVisibleLines([]);
        let currentLine = 0;
        const interval = setInterval(() => {
            if (currentLine < configLines.length) {
                const lineToAdd = configLines[currentLine];
                setVisibleLines(prev => [...prev, lineToAdd]);
                currentLine++;
            } else {
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasStarted, uptime]);

    return (
        <section ref={sectionRef} style={{ marginBottom: '80px', fontFamily: 'var(--font-mono)' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'
            }}>
                <div style={{
                    width: '12px', height: '12px',
                    backgroundColor: 'var(--accent-blue)',
                    boxShadow: '0 0 10px var(--accent-blue-glow)'
                }} />
                <h2 style={{ fontSize: '20px', letterSpacing: '2px', color: 'var(--text-main)', margin: 0 }}>
                    [ RUNNING_CONFIGURATION ]
                </h2>
            </div>

            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                padding: '24px',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Scanline effect */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.2) 51%)',
                    backgroundSize: '100% 4px',
                    zIndex: 1
                }} />

                <div style={{
                    position: 'relative', zIndex: 2,
                    color: 'var(--accent-green)',
                    fontSize: '14px',
                    lineHeight: '1.6'
                }}>
                    ROBERA# show running-config<br/>
                    Building configuration...<br/>
                    <br/>
                    Current configuration : 1845 bytes<br/>

                    {visibleLines.map((line, index) => {
                        if (!line) return null;
                        const isHighlight = line.includes('role:') || line.includes('career_path:') || line.includes('hostname') || line.includes('uptime:');
                        const isValue = line.startsWith('  ');
                        return (
                            <div key={index} style={{
                                color: isHighlight ? 'var(--text-main)' : isValue ? 'var(--text-muted)' : 'var(--accent-green)'
                            }}>
                                {line.replace(/ /g, "\u00a0")}
                            </div>
                        );
                    })}
                    {visibleLines.length === configLines.length && (
                        <div style={{ marginTop: '10px' }}>
                            <span style={{ animation: 'blink 1s step-end infinite', display: 'inline-block', width: '8px', height: '15px', backgroundColor: 'var(--accent-green)' }} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

