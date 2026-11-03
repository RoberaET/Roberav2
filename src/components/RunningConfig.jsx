import React, { useEffect, useState, useRef } from 'react';

const START_DATE = new Date('2025-07-30T00:00:00');

function computeUptime() {
    const now = new Date();
    let years  = now.getFullYear()  - START_DATE.getFullYear();
    let months = now.getMonth()     - START_DATE.getMonth();
    let days   = now.getDate()      - START_DATE.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const parts = [];
    if (years > 0)  parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}mo`);
    parts.push(`${days}d`);
    return parts.join(' ');
}

const processes = [
    { pid: '0x01', name: 'ospf.routing',       cpu: 91, mem: 78, state: 'R', priority: 'CORE',    color: '#00FFA3', desc: 'OSPF · BGP · Static Routing' },
    { pid: '0x02', name: 'vlan.segmentation',   cpu: 84, mem: 65, state: 'R', priority: 'CORE',    color: '#00FFA3', desc: 'VLAN · Inter-VLAN · STP' },
    { pid: '0x03', name: 'firewall.policy',      cpu: 77, mem: 71, state: 'R', priority: 'HIGH',    color: '#00F0FF', desc: 'Fortinet · ACL · Zone Policy' },
    { pid: '0x04', name: 'active.directory',     cpu: 68, mem: 55, state: 'S', priority: 'HIGH',    color: '#00F0FF', desc: 'AD · DNS · DHCP · GPO' },
    { pid: '0x05', name: 'datacenter.vm',        cpu: 62, mem: 60, state: 'S', priority: 'MED',     color: '#7B2FFF', desc: 'VMware · Hyper-V · vSphere' },
    { pid: '0x06', name: 'ztna.security',        cpu: 55, mem: 48, state: 'S', priority: 'HIGH',    color: '#00F0FF', desc: 'ZTNA · VPN · Zero Trust' },
    { pid: '0x07', name: 'packet.tracer.lab',    cpu: 44, mem: 38, state: 'T', priority: 'MED',     color: '#7B2FFF', desc: 'GNS3 · Packet Tracer · EVE-NG' },
    { pid: '0x08', name: 'wireshark.capture',    cpu: 38, mem: 32, state: 'T', priority: 'LOW',     color: '#4A5A8A', desc: 'Wireshark · tcpdump · NetFlow' },
    { pid: '0x09', name: 'python.automation',    cpu: 31, mem: 27, state: 'T', priority: 'MED',     color: '#7B2FFF', desc: 'Python · Bash · Ansible' },
    { pid: '0x0A', name: 'cloud.connect',        cpu: 24, mem: 22, state: 'Z', priority: 'LOW',     color: '#4A5A8A', desc: 'Azure · AWS · Cloudflare' },
];

const stateLabel = { R: 'RUNNING', S: 'SLEEPING', T: 'TRACED', Z: 'ZOMBIE' };
const stateColor = { R: '#00FFA3', S: '#00F0FF', T: '#7B2FFF', Z: '#4A5A8A' };

function MiniBar({ value, color, width = 80 }) {
    return (
        <div style={{
            width, height: '8px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: '1px',
            overflow: 'hidden',
            flexShrink: 0,
        }}>
            <div style={{
                width: `${value}%`,
                height: '100%',
                backgroundColor: color,
                boxShadow: `0 0 6px ${color}`,
                borderRadius: '1px',
                transition: 'width 1.2s ease',
            }} />
        </div>
    );
}

function LiveClock() {
    const [time, setTime] = useState(() => new Date().toISOString().replace('T', ' ').substring(0, 19));
    useEffect(() => {
        const id = setInterval(() => setTime(new Date().toISOString().replace('T', ' ').substring(0, 19)), 1000);
        return () => clearInterval(id);
    }, []);
    return <span>{time} UTC</span>;
}

function ProcessRow({ proc, index, visible }) {
    const [hovered, setHovered] = useState(false);
    const [cpuVal, setCpuVal] = useState(proc.cpu);
    const [memVal, setMemVal] = useState(proc.mem);

    // Jitter the bars slightly to feel "live"
    useEffect(() => {
        const id = setInterval(() => {
            setCpuVal(Math.max(5, Math.min(99, proc.cpu + (Math.random() * 10 - 5))));
            setMemVal(Math.max(5, Math.min(99, proc.mem + (Math.random() * 6 - 3))));
        }, 2000 + index * 300);
        return () => clearInterval(id);
    }, [proc.cpu, proc.mem, index]);

    const rowColor = hovered ? proc.color : 'transparent';

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'grid',
                gridTemplateColumns: '52px 180px 72px 72px 90px 80px 1fr',
                alignItems: 'center',
                gap: '0',
                padding: '5px 14px',
                backgroundColor: hovered ? `${proc.color}12` : (index % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent'),
                borderLeft: `2px solid ${hovered ? proc.color : 'transparent'}`,
                transition: 'background-color 0.2s, border-color 0.2s',
                cursor: 'default',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-12px)',
                transitionProperty: 'opacity, transform, background-color, border-color',
                transitionDuration: `0.35s, 0.35s, 0.2s, 0.2s`,
                transitionDelay: `${index * 0.055}s, ${index * 0.055}s, 0s, 0s`,
            }}
        >
            {/* PID */}
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>
                {proc.pid}
            </span>

            {/* Process name */}
            <span style={{
                fontSize: '12px',
                color: hovered ? proc.color : 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.3px',
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}>
                {proc.name}
            </span>

            {/* State */}
            <span style={{
                fontSize: '10px',
                color: stateColor[proc.state],
                fontFamily: 'var(--font-mono)',
                letterSpacing: '1px',
            }}>
                {proc.state}
            </span>

            {/* Priority */}
            <span style={{
                fontSize: '10px',
                color: proc.priority === 'CORE' ? '#00FFA3' : proc.priority === 'HIGH' ? '#00F0FF' : proc.priority === 'MED' ? '#7B2FFF' : '#4A5A8A',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.5px',
            }}>
                {proc.priority}
            </span>

            {/* CPU bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MiniBar value={cpuVal} color={proc.color} width={50} />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', width: '28px' }}>
                    {Math.round(cpuVal)}%
                </span>
            </div>

            {/* MEM bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MiniBar value={memVal} color={proc.color} width={40} />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', width: '28px' }}>
                    {Math.round(memVal)}%
                </span>
            </div>

            {/* Description — only visible on hover */}
            <span style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.25s',
            }}>
                // {proc.desc}
            </span>
        </div>
    );
}

export default function RunningConfig() {
    const [uptime, setUptime] = useState(computeUptime());
    const [visible, setVisible] = useState(false);
    const [totalCpu, setTotalCpu] = useState(62);
    const [totalMem, setTotalMem] = useState(54);
    const sectionRef = useRef(null);

    useEffect(() => {
        const id = setInterval(() => setUptime(computeUptime()), 60_000);
        return () => clearInterval(id);
    }, []);

    // Animate total CPU/MEM meters
    useEffect(() => {
        const id = setInterval(() => {
            setTotalCpu(prev => Math.max(40, Math.min(85, prev + (Math.random() * 8 - 4))));
            setTotalMem(prev => Math.max(40, Math.min(75, prev + (Math.random() * 4 - 2))));
        }, 1800);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <section ref={sectionRef} style={{ marginBottom: '80px', fontFamily: 'var(--font-mono)' }}>

            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{
                    width: '12px', height: '12px', flexShrink: 0,
                    backgroundColor: 'var(--accent-blue)',
                    boxShadow: '0 0 10px var(--accent-blue-glow)',
                }} />
                <h2 style={{ fontSize: '20px', letterSpacing: '2px', color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap' }}>
                    [ KERNEL_PROCESS_TABLE ]
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    // SKILL_STACK
                </div>
            </div>

            {/* Main panel */}
            <div style={{
                backgroundColor: '#030610',
                border: '1px solid rgba(0,240,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
            }}>

                {/* ── TOP BAR: htop-style header ── */}
                <div style={{
                    backgroundColor: '#020409',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                }}>
                    {/* Left: identity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <div>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>HOSTNAME</span>
                            <span style={{ fontSize: '13px', color: '#00FFA3', letterSpacing: '1px' }}>ROBERA@sec-os</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>UPTIME</span>
                            <span style={{ fontSize: '13px', color: 'var(--text-main)', letterSpacing: '0.5px' }}>{uptime} @ BESYS</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>KERNEL</span>
                            <span style={{ fontSize: '13px', color: 'var(--text-main)' }}>NETENG-2.0.1-CCNP</span>
                        </div>
                    </div>

                    {/* Right: CPU / MEM / CLOCK */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        {/* CPU meter */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                <span style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1px' }}>CPU</span>
                                <span style={{ fontSize: '9px', color: '#00FFA3' }}>{Math.round(totalCpu)}%</span>
                            </div>
                            <div style={{ width: '110px', height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
                                <div style={{ width: `${totalCpu}%`, height: '100%', background: `linear-gradient(90deg, #00FFA3, #00F0FF)`, transition: 'width 1.5s ease', boxShadow: '0 0 8px #00FFA3' }} />
                            </div>
                        </div>

                        {/* MEM meter */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                <span style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1px' }}>MEM</span>
                                <span style={{ fontSize: '9px', color: '#7B2FFF' }}>{Math.round(totalMem)}%</span>
                            </div>
                            <div style={{ width: '110px', height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
                                <div style={{ width: `${totalMem}%`, height: '100%', background: `linear-gradient(90deg, #7B2FFF, #00F0FF)`, transition: 'width 1.5s ease', boxShadow: '0 0 8px #7B2FFF' }} />
                            </div>
                        </div>

                        {/* Clock */}
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.5px' }}>
                            <LiveClock />
                        </div>
                    </div>
                </div>

                {/* ── COLUMN HEADERS ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '52px 180px 72px 72px 90px 80px 1fr',
                    gap: '0',
                    padding: '6px 14px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: '#010308',
                }}>
                    {['PID', 'PROCESS', 'STATE', 'PRI', 'CPU%', 'MEM%', ''].map((col, i) => (
                        <span key={i} style={{
                            fontSize: '9px', color: '#00F0FF',
                            letterSpacing: '2px', fontWeight: 700,
                        }}>
                            {col}
                        </span>
                    ))}
                </div>

                {/* ── PROCESS ROWS ── */}
                <div style={{ padding: '6px 0 10px' }}>
                    {processes.map((proc, i) => (
                        <ProcessRow key={proc.pid} proc={proc} index={i} visible={visible} />
                    ))}
                </div>

                {/* ── STATUS BAR ── */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: '#020409',
                    padding: '8px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {Object.entries(stateLabel).map(([key, label]) => (
                            <span key={key} style={{ fontSize: '10px', letterSpacing: '1px' }}>
                                <span style={{ color: stateColor[key] }}>{key}</span>
                                <span style={{ color: 'var(--text-muted)' }}> = {label}</span>
                            </span>
                        ))}
                    </div>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.5px' }}>
                        {processes.length} processes · hover to inspect
                    </span>
                </div>
            </div>
        </section>
    );
}
