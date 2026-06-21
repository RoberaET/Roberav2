import React, { useState, useEffect, useRef, useCallback } from 'react';

const SECTIONS = [
    {
        id: 'top',          label: 'GATEWAY',  target: 'top',
        color: '#2EFF7A',
        // slow steady pulse — normal baseline traffic
        wave: (x) => {
            const t = x % 80;
            if (t < 10) return 0;
            if (t < 14) return -18 * Math.sin(Math.PI * (t-10)/4);
            if (t < 18) return 22 * Math.sin(Math.PI * (t-14)/4);
            if (t < 22) return -6 * Math.sin(Math.PI * (t-18)/4);
            return 0;
        },
    },
    {
        id: 'core-router',  label: 'CORE_RTR', target: 'core-router',
        color: '#3B9DFF',
        // strong double-peak — powerful router throughput
        wave: (x) => {
            const t = x % 60;
            if (t < 8)  return 0;
            if (t < 12) return -24 * Math.sin(Math.PI * (t-8)/4);
            if (t < 16) return 28 * Math.sin(Math.PI * (t-12)/4);
            if (t < 20) return -24 * Math.sin(Math.PI * (t-16)/4);
            if (t < 24) return 28 * Math.sin(Math.PI * (t-20)/4);
            if (t < 28) return -8  * Math.sin(Math.PI * (t-24)/4);
            return 0;
        },
    },
    {
        id: 'network-ops',  label: 'NET_OPS',  target: 'network-ops',
        color: '#2EFF7A',
        // chaotic multi-frequency — busy network ops
        wave: (x) => {
            return (
                12 * Math.sin(x * 0.18) +
                7  * Math.sin(x * 0.37 + 1) +
                4  * Math.sin(x * 0.71 + 2.5)
            );
        },
    },
    {
        id: 'data-center',  label: 'DATA_CTR', target: 'data-center',
        color: '#a78bfa',
        // smooth sine — steady data center flow
        wave: (x) => 20 * Math.sin(x * 0.12),
    },
    {
        id: 'security-ops', label: 'SEC_OPS',  target: 'security-ops',
        color: '#ff6b6b',
        // sharp aggressive spikes — intrusion detection alerts
        wave: (x) => {
            const t = x % 40;
            if (t < 2)  return -30 * (t / 2);
            if (t < 4)  return 30 - 30 * ((t-2)/2);
            if (t < 10) return 0;
            if (t < 11) return -15;
            if (t < 12) return 15;
            if (t < 13) return -8;
            if (t < 14) return 8;
            return 0;
        },
    },
    {
        id: 'command-terminal', label: 'TERMINAL', target: 'command-terminal',
        color: '#fbbf24',
        // square wave — binary/CLI digital signal
        wave: (x) => {
            const t = x % 30;
            if (t < 7)  return 20;
            if (t < 15) return -20;
            if (t < 22) return 20;
            return -20;
        },
    },
];

const W = 600; // SVG canvas width
const H = 70;  // SVG canvas height
const MID = H / 2;
const POINTS = 300; // number of x samples

export default function HeartbeatNav() {
    const [activeIdx, setActiveIdx]   = useState(0);
    const [ripple, setRipple]         = useState(null);
    const rafRef                      = useRef(null);
    const lastTimeRef                 = useRef(null);
    const offsetRef                   = useRef(0);

    // Refs for direct DOM manipulation
    const pathGlowRef = useRef(null);
    const pathMainRef = useRef(null);
    const dotMainRef  = useRef(null);
    const dotGlowRef  = useRef(null);

    // Scroll spy
    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY < 200) { setActiveIdx(0); return; }
            for (let i = SECTIONS.length - 1; i >= 0; i--) {
                if (SECTIONS[i].target === 'top') continue;
                const el = document.getElementById(SECTIONS[i].target);
                if (el && el.getBoundingClientRect().top <= 220) {
                    setActiveIdx(i);
                    break;
                }
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Animation loop (bypasses React render)
    useEffect(() => {
        const animate = (ts) => {
            if (lastTimeRef.current !== null) {
                const dt = ts - lastTimeRef.current;
                offsetRef.current += dt * 0.05;
                
                // Active section and offset
                const section = SECTIONS[activeIdx];
                const offset = offsetRef.current;

                // Build path string
                const pts = [];
                for (let i = 0; i <= POINTS; i++) {
                    const x = (i / POINTS) * W;
                    const wx = (i / POINTS) * 120 + offset;
                    const y = MID + section.wave(wx);
                    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
                }
                const dString = pts.join(' ');

                // Update paths
                if (pathGlowRef.current) pathGlowRef.current.setAttribute('d', dString);
                if (pathMainRef.current) pathMainRef.current.setAttribute('d', dString);

                // Update cursor dot
                const dotY = MID + section.wave(120 + offset);
                if (dotMainRef.current) dotMainRef.current.setAttribute('cy', dotY);
                if (dotGlowRef.current) dotGlowRef.current.setAttribute('cy', dotY);
            }
            lastTimeRef.current = ts;
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [activeIdx]); // Rebind loop when active section changes

    const section = SECTIONS[activeIdx];

    const scrollTo = (idx) => {
        const target = SECTIONS[idx].target;
        if (target === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        const el = document.getElementById(target);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
        setRipple({ t: Date.now() });
    };

    return (
        <nav style={{
            position: 'sticky',
            top: '16px',
            zIndex: 1000,
            marginBottom: '16px',
        }}>
            <div style={{
                backgroundColor: 'rgba(2, 5, 10, 0.92)',
                backdropFilter: 'blur(14px)',
                border: `1px solid ${section.color}22`,
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: `0 4px 40px rgba(0,0,0,0.8), 0 0 0 1px ${section.color}11`,
                fontFamily: 'var(--font-mono)',
                transition: 'border-color 0.6s ease, box-shadow 0.6s ease',
            }}>

                {/* Top meta bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 18px',
                    borderBottom: `1px solid ${section.color}18`,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '5px', height: '5px', borderRadius: '50%',
                            backgroundColor: section.color,
                            boxShadow: `0 0 6px ${section.color}`,
                            animation: 'blink 1.4s infinite',
                        }} />
                        <span style={{ fontSize: '9px', color: section.color, letterSpacing: '2px', opacity: 0.8 }}>
                            NET_MONITOR
                        </span>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.15)', letterSpacing: '1px', marginLeft: '6px' }}>
                            INTERFACE: eth0
                        </span>
                    </div>

                    {/* Section pills */}
                    <div className="heartbeat-pills-container" style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'center', margin: '0 16px' }}>
                        {SECTIONS.map((s, i) => (
                            <button
                                key={s.id}
                                onClick={() => { setActiveIdx(i); scrollTo(i); }}
                                style={{
                                    padding: '3px 10px',
                                    borderRadius: '100px',
                                    border: `1px solid ${i === activeIdx ? s.color : 'rgba(255,255,255,0.06)'}`,
                                    backgroundColor: i === activeIdx ? `${s.color}18` : 'transparent',
                                    color: i === activeIdx ? s.color : 'rgba(255,255,255,0.25)',
                                    fontSize: '9px',
                                    letterSpacing: '1.5px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: i === activeIdx ? 'bold' : 'normal',
                                }}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px' }}>
                        {new Date().toLocaleTimeString('en-GB')}
                    </span>
                </div>

                {/* Heartbeat SVG canvas */}
                <div style={{ position: 'relative', height: `${H}px` }}>
                    <svg
                        viewBox={`0 0 ${W} ${H}`}
                        preserveAspectRatio="none"
                        style={{ width: '100%', height: '100%', display: 'block' }}
                    >
                        <defs>
                            <linearGradient id="waveGrad" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%"   stopColor={section.color} stopOpacity="0" />
                                <stop offset="30%"  stopColor={section.color} stopOpacity="0.6" />
                                <stop offset="80%"  stopColor={section.color} stopOpacity="1" />
                                <stop offset="100%" stopColor={section.color} stopOpacity="0.3" />
                            </linearGradient>
                            <filter id="waveGlow">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                            </filter>
                            {/* Clip to fade out edges */}
                            <linearGradient id="fadeMask" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%"   stopColor="white" stopOpacity="0" />
                                <stop offset="8%"   stopColor="white" stopOpacity="1" />
                                <stop offset="92%"  stopColor="white" stopOpacity="1" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                            <mask id="edgeFade">
                                <rect x="0" y="0" width={W} height={H} fill="url(#fadeMask)" />
                            </mask>
                        </defs>

                        {/* Center baseline */}
                        <line x1="0" y1={MID} x2={W} y2={MID}
                            stroke={`${section.color}14`} strokeWidth="1" />

                        {/* Glow shadow copy */}
                        <path
                            ref={pathGlowRef}
                            fill="none"
                            stroke={section.color}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.15"
                            filter="url(#waveGlow)"
                            mask="url(#edgeFade)"
                        />

                        {/* Main wave line */}
                        <path
                            ref={pathMainRef}
                            fill="none"
                            stroke="url(#waveGrad)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            mask="url(#edgeFade)"
                        />

                        {/* Live cursor dot at the right end */}
                        <g>
                            <circle ref={dotMainRef} cx={W * 0.82} cy={MID} r="4"
                                fill={section.color}
                                opacity="0.9" />
                            <circle ref={dotGlowRef} cx={W * 0.82} cy={MID} r="8"
                                fill="none"
                                stroke={section.color}
                                strokeWidth="1"
                                opacity="0.3"
                            >
                                <animate attributeName="r" values="4;14" dur="1s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.4;0" dur="1s" repeatCount="indefinite" />
                            </circle>
                        </g>
                    </svg>

                    {/* Left label overlay */}
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '18px',
                        transform: 'translateY(-50%)',
                        display: 'flex', flexDirection: 'column', gap: '2px',
                        pointerEvents: 'none',
                    }}>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: section.color,
                            letterSpacing: '3px',
                            textShadow: `0 0 20px ${section.color}`,
                            lineHeight: 1,
                            transition: 'color 0.5s ease',
                        }}>
                            {section.label}
                        </span>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px' }}>
                            SIGNAL_ACTIVE
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
}

