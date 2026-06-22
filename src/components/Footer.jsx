import React, { useEffect, useRef, useState } from 'react';

const UPTIME_START = new Date('2025-07-30T00:00:00');

function getUptime() {
    const now = new Date();
    const diff = now - UPTIME_START;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, mins, secs };
}

const INTERFACES = [
    { label: 'GitHub', url: 'https://github.com/RoberaET', status: 'up', color: '#2EFF7A', id: 'Gi0/0/0' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/roberamekonnen/', status: 'up', color: '#3B9DFF', id: 'Gi0/0/1' },
    { label: 'Email', url: 'mailto:robera4553@gmail.com', status: 'up', color: '#a78bfa', id: 'Gi0/0/2' },
];

export default function Footer() {
    const canvasRef = useRef(null);
    const [uptime, setUptime] = useState(getUptime());
    const [packetCount, setPacketCount] = useState(Math.floor(Math.random() * 50000) + 80000);
    const [hovered, setHovered] = useState(null);

    // Live uptime ticker
    useEffect(() => {
        const id = setInterval(() => {
            setUptime(getUptime());
            setPacketCount(p => p + Math.floor(Math.random() * 5) + 1);
        }, 1000);
        return () => clearInterval(id);
    }, []);

    // Animated canvas — scrolling packet stream
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -Math.random() * 0.5 - 0.2,
            size: Math.random() * 1.5 + 0.3,
            color: ['#2EFF7A', '#3B9DFF', '#a78bfa', '#fbbf24'][Math.floor(Math.random() * 4)],
            alpha: Math.random() * 0.6 + 0.2,
        }));

        let animId;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animId);
    }, []);

    const pad = n => String(n).padStart(2, '0');

    return (
        <footer style={{
            position: 'relative',
            marginTop: '80px',
            fontFamily: 'var(--font-mono)',
            overflow: 'hidden',
        }}>
            {/* Top border glow line */}
            <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, #2EFF7A 20%, #3B9DFF 50%, #a78bfa 80%, transparent 100%)',
                boxShadow: '0 0 20px rgba(46,255,122,0.4)',
                marginBottom: 0,
            }} />

            {/* Particle canvas background */}
            <canvas ref={canvasRef} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 0,
            }} />

            {/* Main footer body */}
            <div style={{
                position: 'relative', zIndex: 1,
                background: 'linear-gradient(180deg, rgba(5,11,20,0.97) 0%, rgba(2,5,10,1) 100%)',
                padding: '48px 40px 32px',
            }}>

                {/* === TOP ROW === */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '40px',
                    marginBottom: '40px',
                    alignItems: 'start',
                }}>

                    {/* COLUMN 1 — Identity */}
                    <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '3px', marginBottom: '12px' }}>
                            // DEVICE_IDENTITY
                        </div>
                        <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--text-main)', letterSpacing: '2px', marginBottom: '4px' }}>
                            ROBERA<span style={{ color: '#2EFF7A' }}>.</span>MEKONNEN
                        </div>
                        <div style={{ fontSize: '12px', color: '#3B9DFF', marginBottom: '16px', letterSpacing: '1px' }}>
                            Network Engineer · Cybersecurity Enthusiast
                        </div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            border: '1px solid rgba(46,255,122,0.3)',
                            backgroundColor: 'rgba(46,255,122,0.05)',
                            padding: '6px 14px', borderRadius: '2px',
                        }}>
                            <div style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                backgroundColor: '#2EFF7A',
                                boxShadow: '0 0 8px #2EFF7A',
                                animation: 'footerBlink 2s step-end infinite',
                            }} />
                            <span style={{ fontSize: '11px', color: '#2EFF7A', letterSpacing: '2px' }}>
                                STATUS: OPERATIONAL
                            </span>
                        </div>
                    </div>

                    {/* COLUMN 2 — Live System Uptime */}
                    <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '3px', marginBottom: '12px' }}>
                            // SESSION_UPTIME
                        </div>
                        <div style={{
                            border: '1px solid #1a2333',
                            backgroundColor: '#030710',
                            borderRadius: '4px',
                            padding: '20px',
                        }}>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                &gt; show version | include uptime
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '8px',
                                textAlign: 'center',
                            }}>
                                {[
                                    { val: uptime.days, label: 'DAYS' },
                                    { val: pad(uptime.hours), label: 'HRS' },
                                    { val: pad(uptime.mins), label: 'MIN' },
                                    { val: pad(uptime.secs), label: 'SEC' },
                                ].map(({ val, label }) => (
                                    <div key={label}>
                                        <div style={{
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            color: '#2EFF7A',
                                            textShadow: '0 0 10px rgba(46,255,122,0.5)',
                                            lineHeight: 1,
                                        }}>{val}</div>
                                        <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '1px' }}>
                                            {label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{
                                marginTop: '16px', paddingTop: '12px',
                                borderTop: '1px solid #1a2333',
                                display: 'flex', justifyContent: 'space-between',
                                fontSize: '10px', color: 'var(--text-muted)',
                            }}>
                                <span>PACKETS_TX</span>
                                <span style={{ color: '#3B9DFF', fontWeight: 'bold' }}>
                                    {packetCount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 3 — Interface Table */}
                    <div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '3px', marginBottom: '12px' }}>
                            // CONTACT_INTERFACES
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {INTERFACES.map(iface => (
                                <a
                                    key={iface.id}
                                    href={iface.url}
                                    target={iface.url.startsWith('mailto') ? '_self' : '_blank'}
                                    rel="noopener noreferrer"
                                    onMouseEnter={() => setHovered(iface.id)}
                                    onMouseLeave={() => setHovered(null)}
                                    style={{
                                        textDecoration: 'none',
                                        display: 'grid',
                                        gridTemplateColumns: '70px 1fr 40px',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 14px',
                                        border: `1px solid ${hovered === iface.id ? iface.color : '#1a2333'}`,
                                        borderRadius: '2px',
                                        backgroundColor: hovered === iface.id ? `${iface.color}0d` : '#030710',
                                        transition: 'all 0.25s ease',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{iface.id}</span>
                                    <span style={{ fontSize: '13px', color: hovered === iface.id ? iface.color : 'var(--text-main)', fontWeight: 'bold', transition: 'color 0.2s' }}>
                                        {iface.label}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <div style={{
                                            width: '6px', height: '6px', borderRadius: '50%',
                                            backgroundColor: iface.color,
                                            boxShadow: `0 0 6px ${iface.color}`,
                                        }} />
                                        <span style={{ fontSize: '9px', color: iface.color }}>UP</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* === DIVIDER === */}
                <div style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, #1a2333 30%, #1a2333 70%, transparent)',
                    marginBottom: '24px',
                }} />

                {/* === BOTTOM ROW === */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                        © {new Date().getFullYear()} ROBERA MEKONNEN · BUILT WITH{' '}
                        <span style={{ color: '#3B9DFF' }}>REACT</span> +{' '}
                        <span style={{ color: '#fbbf24' }}>VITE</span> ·{' '}
                        <span style={{ color: '#2EFF7A' }}>ALL ROUTES OPERATIONAL</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                            BUILD: <span style={{ color: '#2EFF7A' }}>v3.0.0</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                            NODE: <span style={{ color: '#3B9DFF' }}>ROBERA-CORE-RTR</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                            LOCATION: <span style={{ color: '#a78bfa' }}>ADDIS ABABA, ET</span>
                        </div>
                    </div>
                </div>

                {/* === FINAL ASCII LINE === */}
                <div style={{
                    marginTop: '28px',
                    textAlign: 'center',
                    fontSize: '11px',
                    color: 'rgba(46,255,122,0.15)',
                    letterSpacing: '4px',
                    userSelect: 'none',
                }}>
                    ──────────────────────── END OF TRANSMISSION ────────────────────────
                </div>
            </div>

            <style>{`
                @keyframes footerBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </footer>
    );
}
