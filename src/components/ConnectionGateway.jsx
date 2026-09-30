import React, { useState, useEffect, useRef } from 'react';

const PROMPT = 'root@kali:~# ';

export default function ConnectionGateway({ onAuthorize }) {
    const [ip, setIp]           = useState(null);
    const [location, setLocation] = useState(null);
    const [isp, setIsp]         = useState(null);

    const [lines, setLines]     = useState([]);   // completed lines
    const [typing, setTyping]   = useState('');   // current line being typed
    const [cursor, setCursor]   = useState(true); // blinking cursor
    const [done, setDone]       = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [exiting, setExiting] = useState(false);
    const bottomRef = useRef(null);

    // Fetch IP info first, then start the script
    useEffect(() => {
        const fetchIp = async () => {
            let ipAddr = `${rand()}.${rand()}.${rand()}.${rand()}`;
            let loc    = 'UNKNOWN';
            let ispVal = 'PRIVATE_NETWORK';
            try {
                const res  = await fetch('https://ipapi.co/json/');
                if (res.ok) {
                    const d = await res.json();
                    ipAddr  = d.ip;
                    loc     = `${d.city || 'UNKNOWN'}${d.region ? ', ' + d.region : ''}, ${d.country_name || 'UNKNOWN'}`;
                    ispVal  = d.org || 'UNKNOWN_ISP';
                }
            } catch (_) {}
            setIp(ipAddr);
            setLocation(loc);
            setIsp(ispVal);
        };
        fetchIp();
    }, []);

    useEffect(() => {
        if (!ip) return;

        const SCRIPT = [
            { cmd: 'curl ifconfig.me', output: [
                { t: 'green',  v: ip },
            ]},
            { cmd: `geoip-lookup ${ip}`, output: [
                { t: 'cyan',   v: `[+] IP Address   : ${ip}` },
                { t: 'cyan',   v: `[+] Location     : ${location}` },
                { t: 'cyan',   v: `[+] ISP / Org    : ${ispVal(isp)}` },
                { t: 'cyan',   v: '[+] Proxy / VPN  : NOT DETECTED' },
                { t: 'cyan',   v: '[+] Threat Level : LOW' },
            ]},
            { cmd: 'nmap -sV --open -T4 --reason ' + ip, output: [
                { t: 'text',   v: 'Starting Nmap 7.94 ( https://nmap.org )' },
                { t: 'text',   v: `Nmap scan report for ${ip}` },
                { t: 'text',   v: 'Host is up (0.0042s latency).' },
                { t: 'green',  v: 'PORT     STATE  SERVICE   VERSION' },
                { t: 'green',  v: '22/tcp   open   ssh       OpenSSH 9.3' },
                { t: 'green',  v: '443/tcp  open   https     nginx 1.25.3' },
                { t: 'text',   v: 'Service detection performed.' },
            ]},
            { cmd: 'openssl s_client -connect ' + ip + ':443 -brief', output: [
                { t: 'cyan',   v: 'CONNECTION ESTABLISHED' },
                { t: 'cyan',   v: 'Protocol    : TLSv1.3' },
                { t: 'cyan',   v: 'Cipher      : TLS_AES_256_GCM_SHA384' },
                { t: 'cyan',   v: 'Verify      : OK' },
            ]},
            { cmd: 'whoami && id', output: [
                { t: 'green',  v: 'visitor' },
                { t: 'text',   v: 'uid=1337(visitor) gid=1337(visitor) groups=1337(visitor),4(adm)' },
            ]},
        ];

        let lineBuffer = [];
        let scriptIdx  = 0;
        let timeout;

        const pushLine = (content, cb) => {
            lineBuffer = [...lineBuffer, content];
            setLines([...lineBuffer]);
            timeout = setTimeout(cb, 15);
        };

        const typeCommand = (cmd, charIdx, afterCb) => {
            if (charIdx <= cmd.length) {
                setTyping(cmd.slice(0, charIdx));
                timeout = setTimeout(() => typeCommand(cmd, charIdx + 1, afterCb), 8);
            } else {
                timeout = setTimeout(() => {
                    setTyping('');
                    pushLine({ type: 'prompt', value: cmd }, afterCb);
                }, 30);
            }
        };

        const runOutput = (outputLines, idx, afterCb) => {
            if (idx >= outputLines.length) {
                timeout = setTimeout(afterCb, 40);
                return;
            }
            pushLine({ type: outputLines[idx].t, value: outputLines[idx].v }, () =>
                runOutput(outputLines, idx + 1, afterCb)
            );
        };

        const runNextCommand = () => {
            if (scriptIdx >= SCRIPT.length) {
                setDone(true);
                return;
            }
            const step = SCRIPT[scriptIdx++];
            timeout = setTimeout(() => {
                typeCommand(step.cmd, 0, () =>
                    runOutput(step.output, 0, runNextCommand)
                );
            }, 30);
        };

        // Start
        lineBuffer = [];
        setLines([]);
        timeout = setTimeout(runNextCommand, 300);
        return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ip]);

    // Cursor blink
    useEffect(() => {
        const id = setInterval(() => setCursor(c => !c), 500);
        return () => clearInterval(id);
    }, []);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines, typing, done, authorized]);

    const handleAuthorize = () => {
        if (authorized) return;
        setAuthorized(true);
        setTimeout(() => setExiting(true), 200); // give time to read connection message
        setTimeout(() => onAuthorize(), 500);
    };

    // Enter key support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && done && !authorized) {
                handleAuthorize();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [done, authorized]);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: exiting ? 'transparent' : '#020b05',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            overflow: 'hidden',
            transition: 'background-color 0.4s ease-out 0.2s',
        }}>
            <style>{`
                @keyframes crtOff {
                    0% { transform: scale(1, 1); opacity: 1; filter: brightness(1) contrast(1); }
                    30% { transform: scale(1, 0.01); opacity: 1; filter: brightness(3) contrast(2); }
                    70% { transform: scale(0.001, 0.01); opacity: 1; filter: brightness(5); }
                    100% { transform: scale(0, 0); opacity: 0; filter: brightness(1); }
                }
            `}</style>
            
            {/* Scanlines overlay */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,80,0.018) 3px, rgba(0,255,80,0.018) 4px)',
                opacity: exiting ? 0 : 1,
                transition: 'opacity 0.2s',
            }} />
            {/* Subtle vignette */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
                background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)',
                opacity: exiting ? 0 : 1,
                transition: 'opacity 0.2s',
            }} />

            {/* Terminal window */}
            <div style={{
                position: 'relative', zIndex: 10,
                width: '100%', maxWidth: '860px',
                margin: '0 20px',
                border: '1px solid #1a4a1a',
                borderTop: '3px solid #00ff50',
                borderRadius: '4px',
                backgroundColor: '#010e04',
                boxShadow: exiting 
                    ? '0 0 200px rgba(0,255,80,0.8)' 
                    : '0 0 60px rgba(0,255,80,0.08), 0 0 120px rgba(0,255,80,0.04)',
                display: 'flex', flexDirection: 'column',
                maxHeight: '82vh',
                transformOrigin: 'center center',
                animation: exiting ? 'crtOff 0.5s cubic-bezier(0.11, 0, 0.5, 0) forwards' : 'none',
            }}>
                {/* Title bar */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#010d03',
                    borderBottom: '1px solid #0d2a10',
                    flexShrink: 0,
                }}>
                    <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
                    <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                    <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#28c840' }} />
                    <span style={{ marginLeft: '12px', fontSize: '12px', color: '#1a5a1a', letterSpacing: '1px' }}>
                        kali@robera-sec — bash — 142×38
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#0d3a10', letterSpacing: '2px' }}>
                        TLS 1.3 ● AES-256-GCM
                    </span>
                </div>

                {/* Output area */}
                <div style={{
                    flex: 1, overflowY: 'auto', overflowX: 'hidden',
                    padding: '20px 24px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#0d2a10 transparent',
                }}>
                    {/* Static boot header */}
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '11px', color: '#0d4a10', margin: '1px 0', letterSpacing: '1px' }}>
                            Kali GNU/Linux 2024.3 — kernel 6.6.9-amd64
                        </p>
                        <p style={{ fontSize: '11px', color: '#0d4a10', margin: '1px 0', letterSpacing: '1px' }}>
                            Last login: {new Date().toUTCString()} from {ip || '...'}
                        </p>
                        <p style={{ fontSize: '11px', color: '#00ff50', margin: '4px 0', letterSpacing: '1px' }}>
                            [!] ALERT: Incoming connection detected. Running security assessment...
                        </p>
                    </div>

                    {/* Rendered lines */}
                    {lines.map((line, i) => {
                        if (line.type === 'prompt') return (
                            <div key={i} style={{ display: 'flex', alignItems: 'baseline', marginBottom: '2px' }}>
                                <span style={{ color: '#00ff50', fontSize: '17px', whiteSpace: 'pre', flexShrink: 0 }}>{PROMPT}</span>
                                <span style={{ color: '#e0ffe0', fontSize: '17px', wordBreak: 'break-all' }}>{line.value}</span>
                            </div>
                        );
                        if (line.type === 'green') return (
                            <p key={i} style={{ color: '#00ff50', fontSize: '16px', margin: '1px 0 1px 0', paddingLeft: '2px' }}>{line.value}</p>
                        );
                        if (line.type === 'cyan') return (
                            <p key={i} style={{ color: '#00f5ff', fontSize: '16px', margin: '1px 0 1px 0', paddingLeft: '2px' }}>{line.value}</p>
                        );
                        return (
                            <p key={i} style={{ color: '#4a8a50', fontSize: '15px', margin: '1px 0 1px 0', paddingLeft: '2px' }}>{line.value}</p>
                        );
                    })}

                    {/* Currently typing line */}
                    {!done && (
                        <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '2px' }}>
                            <span style={{ color: '#00ff50', fontSize: '17px', whiteSpace: 'pre', flexShrink: 0 }}>{PROMPT}</span>
                            <span style={{ color: '#e0ffe0', fontSize: '17px' }}>{typing}</span>
                            <span style={{
                                display: 'inline-block', width: '10px', height: '19px',
                                backgroundColor: cursor ? '#00ff50' : 'transparent',
                                marginLeft: '1px', verticalAlign: 'bottom',
                                transition: 'background-color 0.05s',
                            }} />
                        </div>
                    )}

                    {/* Final authorize prompt */}
                    {done && !authorized && (
                        <div style={{ marginTop: '28px' }}>
                            <p style={{ color: '#00ff50', fontSize: '17px', margin: '0 0 4px' }}>
                                {PROMPT}<span style={{ color: '#e0ffe0' }}>echo "Press ENTER to establish secure session..."</span>
                            </p>
                            <p style={{ color: '#00f5ff', fontSize: '17px', margin: '0 0 20px' }}>
                                Press ENTER to establish secure session...
                            </p>
                            <button
                                onClick={handleAuthorize}
                                style={{
                                    display: 'block',
                                    padding: '14px 48px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #00ff50',
                                    color: '#00ff50',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '16px',
                                    letterSpacing: '4px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 0 20px rgba(0,255,80,0.1)',
                                    margin: '0 auto',
                                }}
                                onMouseEnter={e => {
                                    e.target.style.backgroundColor = 'rgba(0,255,80,0.08)';
                                    e.target.style.boxShadow = '0 0 30px rgba(0,255,80,0.25)';
                                }}
                                onMouseLeave={e => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.boxShadow = '0 0 20px rgba(0,255,80,0.1)';
                                }}
                            >
                                [ ENTER ]
                            </button>
                        </div>
                    )}

                    {authorized && (
                        <div style={{ marginTop: '16px' }}>
                            <p style={{ color: '#00ff50', fontSize: '17px' }}>
                                {PROMPT}<span style={{ color: '#e0ffe0' }}>ssh -i ~/.ssh/id_ed25519 visitor@robera.net</span>
                            </p>
                            <p style={{ color: '#00f5ff', fontSize: '16px', margin: '4px 0' }}>Connecting to robera.net... authenticated.</p>
                            <p style={{ color: '#00ff50', fontSize: '16px' }}>Welcome. Loading portfolio...</p>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
}

function rand() { return Math.floor(Math.random() * 255); }
function ispVal(v) { return v || 'UNKNOWN_ISP'; }
