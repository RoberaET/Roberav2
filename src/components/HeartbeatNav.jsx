import React, { useState, useEffect } from 'react';

const SECTIONS = [
    { id: 'top',              label: 'GATEWAY',  target: 'top',              cmd: 'init.d'   },
    { id: 'core-router',      label: 'IDENTITY', target: 'core-router',      cmd: 'whoami'   },
    { id: 'network-ops',      label: 'NET_OPS',  target: 'network-ops',      cmd: 'netstat'  },
    { id: 'data-center',      label: 'TOPOLOGY', target: 'data-center',      cmd: 'tracert'  },
    { id: 'security-ops',     label: 'SEC_OPS',  target: 'security-ops',     cmd: 'iptables' },
    { id: 'command-terminal', label: 'TERMINAL', target: 'command-terminal', cmd: 'bash'     },
];

export default function HeartbeatNav() {
    const [activeIdx, setActiveIdx] = useState(0);
    const [hovered, setHovered]     = useState(null);
    const [blink, setBlink]         = useState(true);

    // Cursor blink
    useEffect(() => {
        const id = setInterval(() => setBlink(b => !b), 530);
        return () => clearInterval(id);
    }, []);

    // Scroll spy
    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                if (window.scrollY < 200) { setActiveIdx(0); ticking = false; return; }
                for (let i = SECTIONS.length - 1; i >= 0; i--) {
                    if (SECTIONS[i].target === 'top') continue;
                    const el = document.getElementById(SECTIONS[i].target);
                    if (el && el.getBoundingClientRect().top <= 220) { setActiveIdx(i); break; }
                }
                ticking = false;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (idx) => {
        setActiveIdx(idx);
        const t = SECTIONS[idx].target;
        if (t === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        const el = document.getElementById(t);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    };

    const active = SECTIONS[activeIdx];

    return (
        <nav style={{
            position: 'sticky',
            top: '12px',
            zIndex: 1000,
            marginBottom: '20px',
            fontFamily: 'var(--font-mono)',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                height: '36px',
                backgroundColor: '#020a14',
                border: '1px solid #0d1e30',
                borderLeft: '3px solid #2EFF7A',
                borderRadius: '3px',
                padding: '0 12px',
                gap: '0',
                overflow: 'hidden',
            }}>

                {/* Prompt prefix */}
                <span style={{ fontSize: '11px', color: '#2EFF7A', whiteSpace: 'nowrap', marginRight: '4px' }}>
                    root@sec-os
                </span>
                <span style={{ fontSize: '11px', color: '#3B9DFF', marginRight: '2px' }}>:</span>
                <span style={{ fontSize: '11px', color: '#a78bfa', marginRight: '8px' }}>~</span>
                <span style={{ fontSize: '11px', color: '#3B9DFF', marginRight: '12px' }}>$</span>

                {/* Command being "typed" */}
                <span style={{ fontSize: '11px', color: '#fbbf24', marginRight: '4px' }}>
                    {active.cmd}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '16px', opacity: 0.5 }}>
                    --nav
                </span>

                {/* Divider */}
                <span style={{ color: '#0d1e30', marginRight: '16px', fontSize: '18px', lineHeight: 1 }}>│</span>

                {/* Nav items */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
                    {SECTIONS.map((s, i) => {
                        const isActive  = i === activeIdx;
                        const isHovered = hovered === i;

                        return (
                            <button
                                key={s.id}
                                onClick={() => scrollTo(i)}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '3px 10px',
                                    border: 'none',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    letterSpacing: '1.2px',
                                    fontWeight: isActive ? 'bold' : 'normal',
                                    backgroundColor: isActive
                                        ? 'rgba(46,255,122,0.12)'
                                        : isHovered
                                            ? 'rgba(59,157,255,0.07)'
                                            : 'transparent',
                                    color: isActive
                                        ? '#2EFF7A'
                                        : isHovered
                                            ? 'var(--text-main)'
                                            : 'var(--text-muted)',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap',
                                    outline: 'none',
                                }}
                            >
                                {/* Active dot */}
                                <span style={{
                                    width: '4px', height: '4px',
                                    borderRadius: '50%',
                                    backgroundColor: isActive ? '#2EFF7A' : 'transparent',
                                    boxShadow: isActive ? '0 0 6px #2EFF7A' : 'none',
                                    flexShrink: 0,
                                    transition: 'all 0.2s',
                                }} />
                                {s.label}
                            </button>
                        );
                    })}
                </div>

                {/* Right side: status pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px', flexShrink: 0 }}>
                    <span style={{ color: '#0d1e30', fontSize: '18px', lineHeight: 1 }}>│</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#2EFF7A', boxShadow: '0 0 5px #2EFF7A', display: 'inline-block' }} />
                        <span style={{ fontSize: '9px', color: '#2EFF7A', letterSpacing: '1px' }}>FW:ON</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#3B9DFF', boxShadow: '0 0 5px #3B9DFF44', display: 'inline-block' }} />
                        <span style={{ fontSize: '9px', color: '#3B9DFF', letterSpacing: '1px' }}>IDS:OK</span>
                    </div>

                    {/* Blinking cursor */}
                    <span style={{
                        fontSize: '13px',
                        color: '#2EFF7A',
                        opacity: blink ? 1 : 0,
                        transition: 'opacity 0.1s',
                        lineHeight: 1,
                    }}>▋</span>
                </div>
            </div>
        </nav>
    );
}
