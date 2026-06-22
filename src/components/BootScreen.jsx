import React, { useEffect, useRef, useState } from 'react'

const BOOT_LOGS = [
    { delay: 0,    text: 'BIOS v4.2.1 — Initializing hardware interfaces...',       color: '#8b949e' },
    { delay: 300,  text: 'CPU: AMD Ryzen 9 5950X @ 3.40GHz — [OK]',                color: '#3fb950' },
    { delay: 550,  text: 'RAM: 32768MB DDR4 @ 3600MHz — [OK]',                      color: '#3fb950' },
    { delay: 800,  text: 'NIC: Intel X550-T2 10GbE — Detecting...',                 color: '#8b949e' },
    { delay: 1100, text: 'NIC: Uplink established at 10.0 Gbps — [OK]',             color: '#3fb950' },
    { delay: 1400, text: 'OSPF: Discovering neighbors on eth0/eth1...',              color: '#8b949e' },
    { delay: 1700, text: 'OSPF: Area 0 adjacency FULL with 4 peers — [OK]',         color: '#3fb950' },
    { delay: 2000, text: 'Firewall: Loading ACL rulesets — 2,048 rules applied',    color: '#d29922' },
    { delay: 2250, text: 'VPN: IPSec tunnel endpoints authenticated — [OK]',        color: '#3fb950' },
    { delay: 2500, text: 'VLAN: Trunking active on GigE 0/0–0/47 — [OK]',          color: '#3fb950' },
    { delay: 2750, text: 'HSRP: Active gateway elected — Priority 110 — [OK]',      color: '#3fb950' },
    { delay: 3000, text: 'Loading portfolio kernel v3.0...',                         color: '#3b9eff' },
    { delay: 3300, text: 'Decrypting identity: ROBERA MEKONNEN — VERIFIED',         color: '#3b9eff' },
    { delay: 3600, text: '>>> SYSTEM READY. AWAITING OPERATOR CONFIRMATION <<<',    color: '#fff' },
]

export default function BootScreen({ onBoot }) {
    const canvasRef = useRef(null)
    const [visibleLogs, setVisibleLogs] = useState([])
    const [progress, setProgress] = useState(0)
    const [showButton, setShowButton] = useState(false)
    const [glitch, setGlitch] = useState(false)
    const [btnHover, setBtnHover] = useState(false)

    // Typewriter logs
    useEffect(() => {
        const timers = BOOT_LOGS.map((log, i) =>
            setTimeout(() => {
                setVisibleLogs(prev => [...prev, log])
                setProgress(Math.round(((i + 1) / BOOT_LOGS.length) * 100))
            }, log.delay)
        )
        const btnTimer = setTimeout(() => setShowButton(true), 3800)
        return () => { timers.forEach(clearTimeout); clearTimeout(btnTimer) }
    }, [])

    // Random glitch flicker on title
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            setGlitch(true)
            setTimeout(() => setGlitch(false), 120)
        }, 2800)
        return () => clearInterval(glitchInterval)
    }, [])

    // Canvas: animated network node grid
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        let animId
        let time = 0

        const nodes = Array.from({ length: 28 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 1.5,
            pulse: Math.random() * Math.PI * 2,
        }))

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener('resize', resize)
        resize()

        const draw = () => {
            time += 0.012
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Moving nodes
            nodes.forEach(n => {
                n.x += n.vx; n.y += n.vy; n.pulse += 0.04
                if (n.x < 0 || n.x > canvas.width)  n.vx *= -1
                if (n.y < 0 || n.y > canvas.height) n.vy *= -1
            })

            // Draw edges between close nodes
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x
                    const dy = nodes[i].y - nodes[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 180) {
                        const alpha = (1 - dist / 180) * 0.18
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(59,158,255,${alpha})`
                        ctx.lineWidth = 1
                        ctx.moveTo(nodes[i].x, nodes[i].y)
                        ctx.lineTo(nodes[j].x, nodes[j].y)
                        ctx.stroke()
                    }
                }
            }

            // Draw nodes
            nodes.forEach(n => {
                const pulse = 0.6 + 0.4 * Math.sin(n.pulse)
                ctx.beginPath()
                ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(59,158,255,${0.5 * pulse})`
                ctx.fill()
                // Glow ring
                ctx.beginPath()
                ctx.arc(n.x, n.y, n.r * 3 * pulse, 0, Math.PI * 2)
                ctx.strokeStyle = `rgba(59,158,255,${0.08 * pulse})`
                ctx.lineWidth = 1
                ctx.stroke()
            })

            // Horizontal scan line sweeping downward
            const scanY = ((time * 60) % canvas.height)
            const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40)
            scanGrad.addColorStop(0,   'rgba(59,158,255,0)')
            scanGrad.addColorStop(0.5, 'rgba(59,158,255,0.04)')
            scanGrad.addColorStop(1,   'rgba(59,158,255,0)')
            ctx.fillStyle = scanGrad
            ctx.fillRect(0, scanY - 40, canvas.width, 80)

            animId = requestAnimationFrame(draw)
        }
        draw()
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
    }, [])

    const progressColor = progress < 50 ? '#3b9eff' : progress < 80 ? '#d29922' : '#3fb950'

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 999999,
            backgroundColor: '#0a0d11',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            overflow: 'hidden',
        }}>
            {/* Canvas background */}
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

            {/* CRT scanlines overlay */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
            }} />

            {/* Vignette */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
            }} />

            {/* Main content */}
            <div style={{
                position: 'relative', zIndex: 2, width: '100%', maxWidth: '760px',
                padding: '0 32px', display: 'flex', flexDirection: 'column', gap: '28px',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                    <div style={{
                        fontSize: '11px', letterSpacing: '6px', color: '#3b9eff',
                        marginBottom: '16px', opacity: 0.7,
                    }}>
                        R_MEKONNEN.SYS // PORTFOLIO_V3.0
                    </div>

                    {/* Glitch title */}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <h1 style={{
                            fontSize: 'clamp(28px, 5vw, 48px)',
                            fontWeight: 700,
                            letterSpacing: '6px',
                            color: glitch ? '#ff3b6b' : '#ffffff',
                            textShadow: glitch
                                ? '3px 0 #3b9eff, -3px 0 #3fb950'
                                : '0 0 30px rgba(59,158,255,0.4)',
                            margin: 0,
                            transition: 'color 0.05s',
                            userSelect: 'none',
                        }}>
                            SECURE UPLINK
                        </h1>
                        {glitch && (
                            <h1 style={{
                                position: 'absolute', top: 0, left: '3px',
                                fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700,
                                letterSpacing: '6px', color: '#3b9eff',
                                margin: 0, opacity: 0.6, userSelect: 'none',
                                clipPath: 'polygon(0 30%, 100% 30%, 100% 50%, 0 50%)',
                            }}>SECURE UPLINK</h1>
                        )}
                    </div>

                    <div style={{
                        width: '120px', height: '2px', margin: '16px auto 0',
                        background: 'linear-gradient(90deg, transparent, #3b9eff, transparent)',
                    }} />
                </div>

                {/* Terminal log window */}
                <div style={{
                    background: 'rgba(13, 17, 23, 0.85)',
                    border: '1px solid rgba(59, 158, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    height: '220px',
                    overflowY: 'hidden',
                    position: 'relative',
                    backdropFilter: 'blur(8px)',
                }}>
                    <div style={{
                        fontSize: '10px', color: '#3b9eff', letterSpacing: '2px',
                        marginBottom: '10px', borderBottom: '1px solid rgba(59,158,255,0.1)',
                        paddingBottom: '8px', display: 'flex', justifyContent: 'space-between',
                    }}>
                        <span>BOOT_SEQUENCE_LOG</span>
                        <span style={{ color: '#3fb950' }}>● LIVE</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {visibleLogs.slice(-9).map((log, i) => (
                            <div key={i} style={{
                                fontSize: '12px', color: log.color, lineHeight: 1.5,
                                animation: 'fadeIn 0.2s ease',
                                display: 'flex', gap: '8px',
                            }}>
                                <span style={{ color: '#3b9eff', opacity: 0.5, flexShrink: 0 }}>›</span>
                                <span>{log.text}</span>
                            </div>
                        ))}
                        {/* Blinking cursor */}
                        <span style={{
                            display: 'inline-block', width: '8px', height: '14px',
                            backgroundColor: '#3b9eff', marginTop: '2px',
                            animation: 'blink 1s step-end infinite',
                        }} />
                    </div>
                </div>

                {/* Progress bar */}
                <div>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: '10px', letterSpacing: '2px', marginBottom: '8px',
                    }}>
                        <span style={{ color: '#8b949e' }}>SYSTEM_LOAD</span>
                        <span style={{ color: progressColor }}>{progress}%</span>
                    </div>
                    <div style={{
                        height: '4px', background: 'rgba(255,255,255,0.06)',
                        borderRadius: '2px', overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%', width: `${progress}%`,
                            background: `linear-gradient(90deg, #3b9eff, ${progressColor})`,
                            borderRadius: '2px',
                            transition: 'width 0.3s ease, background 0.5s ease',
                            boxShadow: `0 0 10px ${progressColor}88`,
                        }} />
                    </div>
                    {/* Segment ticks */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                        {[0,25,50,75,100].map(v => (
                            <span key={v} style={{
                                fontSize: '9px', color: progress >= v ? progressColor : '#333',
                                transition: 'color 0.3s',
                            }}>{v}%</span>
                        ))}
                    </div>
                </div>

                {/* Initialize button */}
                <div style={{
                    textAlign: 'center',
                    opacity: showButton ? 1 : 0,
                    transform: showButton ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'opacity 0.6s ease, transform 0.6s ease',
                    pointerEvents: showButton ? 'auto' : 'none',
                }}>
                    <button
                        onClick={onBoot}
                        onMouseEnter={() => setBtnHover(true)}
                        onMouseLeave={() => setBtnHover(false)}
                        style={{
                            background: btnHover
                                ? 'rgba(59,158,255,0.15)'
                                : 'rgba(59,158,255,0.06)',
                            border: `1px solid ${btnHover ? '#3b9eff' : 'rgba(59,158,255,0.5)'}`,
                            color: '#ffffff',
                            padding: '16px 48px',
                            fontSize: '13px',
                            letterSpacing: '4px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            transition: 'all 0.25s ease',
                            textTransform: 'uppercase',
                            boxShadow: btnHover
                                ? '0 0 30px rgba(59,158,255,0.35), inset 0 0 20px rgba(59,158,255,0.06)'
                                : '0 0 16px rgba(59,158,255,0.15)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Sweep shine on hover */}
                        {btnHover && (
                            <div style={{
                                position: 'absolute', top: 0, left: '-100%',
                                width: '60%', height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                                animation: 'sweep 0.5s ease forwards',
                            }} />
                        )}
                        ⟩ INITIALIZE SYSTEM
                    </button>
                    <p style={{
                        color: '#8b949e', fontSize: '10px',
                        letterSpacing: '2px', marginTop: '14px',
                    }}>
                        PRESS TO ESTABLISH CONNECTION
                    </p>
                </div>
            </div>

            {/* Corner decorations */}
            {[
                { top: 20, left: 20, borderTop: '2px solid', borderLeft: '2px solid' },
                { top: 20, right: 20, borderTop: '2px solid', borderRight: '2px solid' },
                { bottom: 20, left: 20, borderBottom: '2px solid', borderLeft: '2px solid' },
                { bottom: 20, right: 20, borderBottom: '2px solid', borderRight: '2px solid' },
            ].map((style, i) => (
                <div key={i} style={{
                    position: 'absolute', ...style,
                    width: '28px', height: '28px',
                    borderColor: 'rgba(59,158,255,0.35)',
                    zIndex: 2,
                }} />
            ))}

            {/* Timestamp bottom bar */}
            <div style={{
                position: 'absolute', bottom: '20px', left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '10px', letterSpacing: '3px', color: '#3b3f47',
                zIndex: 2, whiteSpace: 'nowrap',
            }}>
                {new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC // NETWORK_ARCHITECT_TERMINAL
            </div>

            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0);   }
                }
                @keyframes sweep {
                    from { left: -100%; }
                    to   { left: 200%;  }
                }
            `}</style>
        </div>
    )
}
