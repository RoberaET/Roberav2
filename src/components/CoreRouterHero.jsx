import React, { useEffect, useState, useRef } from 'react';
import Shuffle from './Shuffle';
import useSvgAnimationPause from '../hooks/useSvgAnimationPause';

// Topology nodes — placed as % of SVG viewBox 1200x400
const NODES = [
    { id: 'fw',      x: 60,   y: 200, label: 'FIREWALL',  color: '#ff6b6b' },
    { id: 'cr',      x: 280,  y: 120, label: 'CORE_RTR',  color: '#3B9DFF' },
    { id: 'sw1',     x: 480,  y: 60,  label: 'SW-DIST-1', color: '#2EFF7A' },
    { id: 'sw2',     x: 480,  y: 200, label: 'SW-DIST-2', color: '#2EFF7A' },
    { id: 'sw3',     x: 480,  y: 340, label: 'SW-ACC-1',  color: '#a78bfa' },
    { id: 'soc',     x: 720,  y: 60,  label: 'SOC',       color: '#ff6b6b' },
    { id: 'dc',      x: 720,  y: 200, label: 'DATA_CTR',  color: '#3B9DFF' },
    { id: 'vpn',     x: 720,  y: 340, label: 'VPN_GW',    color: '#fbbf24' },
    { id: 'inet',    x: 980,  y: 120, label: 'INTERNET',  color: '#3B9DFF' },
    { id: 'cloud',   x: 980,  y: 280, label: 'CLOUD',     color: '#a78bfa' },
    { id: 'edge',    x: 1140, y: 200, label: 'EDGE',      color: '#2EFF7A' },
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
    const id = `pkt-${fromNode.id}-${toNode.id}-${delay}`;
    return (
        <circle r="3" fill={color} filter="url(#glow)">
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
    const [scrambledTitle, setScrambledTitle] = useState("NETWORK_CORE_INIT");
    const shuffleWrapRef = useRef(null);

    // Auto-fire the shuffle non-stop until the user actually hovers
    useEffect(() => {
        // mouseenter doesn't bubble — must dispatch directly on the h1 Shuffle renders
        const getTarget = () =>
            shuffleWrapRef.current?.querySelector('h1') || shuffleWrapRef.current;

        const trigger = () => {
            const target = getTarget();
            if (target) target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
        };

        const first = setTimeout(trigger, 800);
        const interval = setInterval(trigger, 700);

        // isTrusted is false for synthetic events, true only for real user hover
        const stop = (e) => { if (e.isTrusted) clearInterval(interval); };

        // Give Shuffle time to mount and attach its own listener before we add ours
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
            padding: '60px 0 50px',
            borderBottom: '1px solid var(--border-color)',
            overflow: 'hidden',
            fontFamily: 'var(--font-mono)',
        }}>

            {/* ── Full-width SVG Topology Background ── */}
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
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                    </defs>

                    {/* Edges */}
                    {EDGES.map((e, i) => {
                        const a = getNode(e.from), b = getNode(e.to);
                        return (
                            <g key={i}>
                                {/* Base line */}
                                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                                    stroke="rgba(59,157,255,0.12)" strokeWidth="1" />
                                {/* Glow line */}
                                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                                    stroke="rgba(59,157,255,0.25)" strokeWidth="0.5"
                                    filter="url(#glow)" />
                            </g>
                        );
                    })}

                    {/* Traveling packets */}
                    {EDGES.map((e, i) => {
                        const a = getNode(e.from), b = getNode(e.to);
                        const color = a.color;
                        const dur  = 1.8 + (i % 4) * 0.6;
                        return (
                            <g key={`pkts-${i}`}>
                                <Packet fromNode={a} toNode={b} delay={i * 0.4} duration={dur} color={color} />
                                <Packet fromNode={b} toNode={a} delay={i * 0.4 + dur / 2} duration={dur} color={b.color} />
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {NODES.map(n => (
                        <g key={n.id}>
                            {/* Outer ring */}
                            <circle cx={n.x} cy={n.y} r="14" fill="none"
                                stroke={n.color} strokeWidth="0.5" opacity="0.3" />
                            {/* Node body */}
                            <circle cx={n.x} cy={n.y} r="7"
                                fill="#050B14" stroke={n.color} strokeWidth="1.5"
                                filter="url(#nodeGlow)" />
                            {/* Node dot */}
                            <circle cx={n.x} cy={n.y} r="2.5" fill={n.color} />
                            {/* Label */}
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


            {/* ── Foreground: clean name + tags ── */}
            <div style={{
                position: 'relative', zIndex: 1,
                textAlign: 'center', width: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
            }}>
                {/* Breadcrumb path above name */}
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '2px' }}>
                    <span style={{ color: 'var(--accent-green)' }}>robera</span>
                    <span>@net-infra</span>
                    <span style={{ color: 'var(--accent-blue)' }}>:~ $</span>
                    <span style={{ marginLeft: '6px', color: 'var(--text-muted)' }}>whoami</span>
                </div>

                {/* Name — wrapped so we can fire mouseenter programmatically */}
                <div ref={shuffleWrapRef} style={{ display: 'inline-block' }}>
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
                        fontSize: 'clamp(4rem, 10vw, 9rem)',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                        letterSpacing: '-0.05em',
                        textShadow: '0 0 60px rgba(59,157,255,0.4), 0 2px 0 rgba(0,0,0,0.8)',
                        margin: 0,
                        fontFamily: 'var(--font-mono)',
                        lineHeight: 1,
                        textTransform: 'uppercase'
                    }}
                />
                </div>

                {/* Role tags */}
                <div style={{
                    display: 'flex', gap: '24px', justifyContent: 'center',
                    fontSize: '13px', color: 'var(--accent-green)',
                    letterSpacing: '1px',
                }}>
                    <span>&lt; Enterprise Network Engineer /&gt;</span>
                    <span style={{ color: 'rgba(59,157,255,0.3)' }}>│</span>
                    <span>&lt; Future Security Engineer /&gt;</span>
                </div>

                {/* Status strip */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '24px',
                    backgroundColor: 'rgba(3,6,10,0.7)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(59,157,255,0.1)',
                    borderRadius: '6px',
                    padding: '8px 24px',
                    fontSize: '10px',
                    letterSpacing: '1.5px',
                    marginTop: '8px',
                }}>
                    {[
                        { k: 'LOCATION', v: 'Addis Ababa, ETH',  c: 'var(--text-main)' },
                        { k: 'STATUS',   v: 'AVAILABLE',          c: 'var(--accent-green)' },
                        { k: 'STACK',    v: 'OSPF · BGP · CCNA', c: 'var(--accent-blue)' },
                        { k: 'MODE',     v: 'NET→SEC',            c: 'var(--accent-green)' },
                    ].map((item, i, arr) => (
                        <React.Fragment key={i}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'center' }}>
                                <span style={{ color: 'var(--text-muted)' }}>{item.k}</span>
                                <span style={{ color: item.c, fontWeight: 'bold' }}>{item.v}</span>
                            </div>
                            {i < arr.length - 1 && <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(59,157,255,0.1)' }} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes streamUp {
                    0%   { transform: translateY(0); opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { transform: translateY(-100vh); opacity: 0; }
                }
            `}</style>
        </div>
    );
}
