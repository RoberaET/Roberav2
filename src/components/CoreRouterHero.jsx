import React, { useEffect, useState, useRef } from 'react';
import Shuffle from './Shuffle';
import useSvgAnimationPause from '../hooks/useSvgAnimationPause';

// Topology nodes — placed as % of SVG viewBox 1200x400
const NODES = [
    { id: 'fw',      x: 60,   y: 200, label: 'FIREWALL',   color: '#ff6b6b' },
    { id: 'cr',      x: 280,  y: 120, label: 'CORE_RTR',   color: '#00F0FF' },
    { id: 'sw1',     x: 480,  y: 60,  label: 'SW-DIST-1',  color: '#00FFA3' },
    { id: 'sw2',     x: 480,  y: 200, label: 'SW-DIST-2',  color: '#00FFA3' },
    { id: 'sw3',     x: 480,  y: 340, label: 'SW-ACC-1',   color: '#a78bfa' },
    { id: 'soc',     x: 720,  y: 60,  label: 'SOC',        color: '#ff6b6b' },
    { id: 'dc',      x: 720,  y: 200, label: 'DATA_CTR',   color: '#00F0FF' },
    { id: 'vpn',     x: 720,  y: 340, label: 'VPN_GW',     color: '#fbbf24' },
    { id: 'inet',    x: 980,  y: 120, label: 'INTERNET',   color: '#00F0FF' },
    { id: 'cloud',   x: 980,  y: 280, label: 'CLOUD',      color: '#a78bfa' },
    { id: 'edge',    x: 1140, y: 200, label: 'EDGE_ROUTER',color: '#00FFA3' },
];

const EDGES = [
    { from: 'fw', to: 'cr' },
    { from: 'cr', to: 'sw1' },
    { from: 'cr', to: 'sw2' },
    { from: 'cr', to: 'sw3' },
    { from: 'sw1', to: 'soc' },
    { from: 'sw2', to: 'dc' },
    { from: 'sw3', to: 'vpn' },
    { from: 'soc', to: 'inet' },
    { from: 'dc',  to: 'inet' },
    { from: 'dc',  to: 'cloud' },
    { from: 'vpn', to: 'cloud' },
    { from: 'inet', to: 'edge' },
    { from: 'cloud', to: 'edge' },
];

function getNode(id) { return NODES.find(n => n.id === id); }

function Packet({ fromNode, toNode, delay, duration, color }) {
    return (
        <circle r="2.8" fill={color} filter="url(#heroGlow)">
            <animateMotion
                dur={`${duration}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
                path={`M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`}
            />
            <animate attributeName="opacity" values="0;1;1;0" dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite" />
        </circle>
    );
}

export default function CoreRouterHero() {
    const svgRef = useSvgAnimationPause();
    const shuffleWrapRef = useRef(null);

    // Auto-fire the shuffle non-stop until the user actually hovers (PRESERVED IDENTICAL)
    useEffect(() => {
        const getTarget = () =>
            shuffleWrapRef.current?.querySelector('h1') || shuffleWrapRef.current;

        const trigger = () => {
            const target = getTarget();
            if (target) target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
        };

        const first = setTimeout(trigger, 800);
        const interval = setInterval(trigger, 700);

        const stop = (e) => { if (e.isTrusted) clearInterval(interval); };

        const setupStop = setTimeout(() => {
            getTarget()?.addEventListener('mouseenter', stop);
        }, 200);

        return () => {
            clearTimeout(first);
            clearTimeout(setupStop);
            clearInterval(interval);
            getTarget()?.removeEventListener('mouseenter', stop);
        };
    }, []);

    return (
        <div style={{
            position: 'relative',
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 10px 50px',
            borderBottom: '1px solid var(--border-color)',
            overflow: 'hidden',
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'transparent',
        }}>
            <style>{`
                @keyframes hero-pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.35; transform: scale(0.85); }
                }
                .hero-action-btn {
                    transition: all 0.25s ease;
                }
                .hero-action-btn:hover {
                    background: rgba(0, 240, 255, 0.15) !important;
                    border-color: #00F0FF !important;
                    box-shadow: 0 0 12px rgba(0, 240, 255, 0.3) !important;
                }
            `}</style>

            {/* ── Transparent SVG Topology Background (PRESERVED AS USED TO BE) ── */}
            <div className="scroll-x" style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                opacity: 0.55,
                pointerEvents: 'none',
            }}>
                <svg
                    className="mobile-scale-svg"
                    ref={svgRef}
                    viewBox="0 0 1200 400"
                    preserveAspectRatio="xMidYMid slice"
                    style={{ width: '100%', height: '100%' }}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <filter id="heroNodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                    </defs>

                    {/* Edges */}
                    {EDGES.map((e, i) => {
                        const a = getNode(e.from), b = getNode(e.to);
                        return (
                            <g key={i}>
                                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                                    stroke="rgba(59,157,255,0.12)" strokeWidth="1" />
                                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                                    stroke="rgba(59,157,255,0.25)" strokeWidth="0.5"
                                    filter="url(#heroGlow)" />
                            </g>
                        );
                    })}

                    {/* Traveling packets */}
                    {EDGES.map((e, i) => {
                        const a = getNode(e.from), b = getNode(e.to);
                        const dur = 1.8 + (i % 4) * 0.6;
                        return (
                            <g key={`pkts-${i}`}>
                                <Packet fromNode={a} toNode={b} delay={i * 0.4} duration={dur} color={a.color} />
                                <Packet fromNode={b} toNode={a} delay={i * 0.4 + dur / 2} duration={dur} color={b.color} />
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {NODES.map(n => (
                        <g key={n.id}>
                            <circle cx={n.x} cy={n.y} r="14" fill="none"
                                stroke={n.color} strokeWidth="0.5" opacity="0.3" />
                            <circle cx={n.x} cy={n.y} r="7"
                                fill="#050B14" stroke={n.color} strokeWidth="1.5"
                                filter="url(#heroNodeGlow)" />
                            <circle cx={n.x} cy={n.y} r="2.5" fill={n.color} />
                            <text
                                x={n.x} y={n.y + 26}
                                textAnchor="middle"
                                fontSize="9"
                                fill={n.color}
                                opacity="0.7"
                                fontFamily="JetBrains Mono, monospace"
                                letterSpacing="0.5"
                            >{n.label}</text>
                        </g>
                    ))}
                </svg>
            </div>

            {/* ── Foreground: clean single-line name + technical surroundings ── */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                textAlign: 'center',
                width: '100%',
                maxWidth: '1440px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '18px',
            }}>
                {/* 1. Sleek Command Breadcrumb (Transparent Frosted Pill) */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '5px 16px',
                    background: 'rgba(8, 5, 26, 0.45)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(0, 240, 255, 0.22)',
                    borderRadius: '20px',
                    fontSize: '11px',
                    letterSpacing: '1.5px',
                }}>
                    <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#00FFA3',
                        boxShadow: '0 0 6px #00FFA3',
                        animation: 'hero-pulse-dot 2s ease-in-out infinite',
                    }} />
                    <span style={{ color: '#00FFA3' }}>robera</span>
                    <span style={{ color: 'rgba(74, 90, 138, 0.7)' }}>@</span>
                    <span style={{ color: '#00F0FF' }}>core-rtr</span>
                    <span style={{ color: 'rgba(74, 90, 138, 0.5)' }}>:</span>
                    <span style={{ color: '#a78bfa' }}>~</span>
                    <span style={{ color: 'rgba(74, 90, 138, 0.5)' }}>$</span>
                    <span style={{ color: '#E8F0FF', fontWeight: 600 }}>whoami</span>
                    <span style={{
                        fontSize: '9px',
                        color: 'rgba(0, 240, 255, 0.65)',
                        borderLeft: '1px solid rgba(74, 90, 138, 0.3)',
                        paddingLeft: '8px',
                        letterSpacing: '1px',
                    }}>
                        ETH0: UP
                    </span>
                </div>

                {/* 2. THE NAME: GUARANTEED IN ONE SINGLE LINE */}
                <div
                    ref={shuffleWrapRef}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'visible',
                        padding: '4px 0',
                    }}
                >
                    <Shuffle
                        text="ROBERA MEKONNEN"
                        tag="h1"
                        shuffleDirection="right"
                        duration={0.25}
                        animationMode="evenodd"
                        shuffleTimes={3}
                        ease="power2.out"
                        stagger={0.02}
                        threshold={0.1}
                        scrambleCharset="01X@#$*&^%!"
                        triggerOnce={true}
                        triggerOnHover={true}
                        style={{
                            fontSize: 'clamp(3.2rem, 10.5vw, 10.2rem)',
                            fontWeight: 800,
                            color: 'var(--text-main)',
                            letterSpacing: '-0.04em',
                            textShadow: '0 0 50px rgba(59, 157, 255, 0.45), 0 2px 0 rgba(0, 0, 0, 0.8)',
                            margin: 0,
                            fontFamily: 'var(--font-mono)',
                            lineHeight: 1.1,
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                        }}
                    />
                </div>

                {/* 3. Engineering Role Tags with glowing technical separators */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    flexWrap: 'wrap',
                }}>
                    <span style={{ color: '#00FFA3' }}>&lt; Enterprise Network Engineer /&gt;</span>
                    <span style={{ color: 'rgba(0, 240, 255, 0.3)', fontSize: '14px' }}>│</span>
                    <span style={{ color: '#00F0FF' }}>&lt; Systems &amp; Security Engineer /&gt;</span>
                    <span style={{ color: 'rgba(0, 240, 255, 0.3)', fontSize: '14px' }}>│</span>
                    <span style={{ color: '#a78bfa' }}>&lt; Virtualization &amp; Infrastructure /&gt;</span>
                </div>

                {/* 4. Elegant Transparent Status Strip + CV Button */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '20px',
                    backgroundColor: 'rgba(8, 5, 26, 0.55)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 240, 255, 0.18)',
                    borderRadius: '6px',
                    padding: '8px 20px',
                    fontSize: '10px',
                    letterSpacing: '1.2px',
                    marginTop: '6px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}>
                    {[
                        { k: 'LOCATION', v: 'Addis Ababa, ETH', c: 'var(--text-main)' },
                        { k: 'ROLE',     v: 'BESYS Tech (Current)', c: '#00FFA3' },
                        { k: 'STACK',    v: 'OSPF · BGP · AD · Proxmox', c: '#00F0FF' },
                        { k: 'STATUS',   v: 'AVAILABLE', c: '#00FFA3' },
                    ].map((item, i, arr) => (
                        <React.Fragment key={i}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'center' }}>
                                <span style={{ color: 'rgba(74, 90, 138, 0.85)', fontSize: '8px' }}>{item.k}</span>
                                <span style={{ color: item.c, fontWeight: 'bold' }}>{item.v}</span>
                            </div>
                            <div style={{ width: '1px', height: '22px', backgroundColor: 'rgba(0, 240, 255, 0.15)' }} />
                        </React.Fragment>
                    ))}

                    {/* Resume download action */}
                    <a
                        href="/ROBERAMEKONNENCV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hero-action-btn"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 12px',
                            background: 'rgba(0, 240, 255, 0.08)',
                            border: '1px solid rgba(0, 240, 255, 0.35)',
                            borderRadius: '3px',
                            color: '#00F0FF',
                            textDecoration: 'none',
                            fontSize: '9px',
                            letterSpacing: '1px',
                            fontWeight: 700,
                        }}
                    >
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M6 1v7M3 5.5l3 3 3-3M1 11h10" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>CV (.PDF)</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
