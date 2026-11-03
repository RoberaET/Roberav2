import React, { useState, useEffect, useRef } from 'react';

const routes = [
    {
        network:   'VIRTUALIZATION',
        prefix:    '10.100.0.0/16',
        nextHop:   'VMware-ESXi',
        as_path:   '7B2F → 00F0',
        metric:    91,
        weight:    200,
        status:    'ACTIVE',
        color:     '#7B2FFF',
        label:     'IN PROGRESS',
        labelColor:'#7B2FFF',
        tracks: [
            { name: 'VMware vSphere / ESXi', done: true },
            { name: 'Hyper-V Server 2022',   done: true },
            { name: 'KVM / QEMU Basics',     done: false },
            { name: 'vCenter Cluster Mgmt',  done: false },
        ],
    },
    {
        network:   'OPENSTACK',
        prefix:    '10.200.0.0/16',
        nextHop:   'OpenStack-Core',
        as_path:   'FF00 → 00F0',
        metric:    74,
        weight:    180,
        status:    'LEARNING',
        color:     '#FF00C8',
        label:     'NEXT HOP',
        labelColor:'#FF00C8',
        tracks: [
            { name: 'Nova Compute Service',  done: false },
            { name: 'Neutron Networking',    done: false },
            { name: 'Cinder Block Storage',  done: false },
            { name: 'Horizon Dashboard',     done: false },
        ],
    },
    {
        network:   'STORAGE_SYSTEMS',
        prefix:    '10.150.0.0/16',
        nextHop:   'SAN-NAS-GW',
        as_path:   'FFA3 → 00F0',
        metric:    62,
        weight:    160,
        status:    'LEARNING',
        color:     '#00FFA3',
        label:     'QUEUED',
        labelColor:'#00FFA3',
        tracks: [
            { name: 'SAN / iSCSI Protocol',  done: true },
            { name: 'NAS Configuration',     done: true },
            { name: 'ZFS / RAID Arrays',     done: false },
            { name: 'Ceph Distributed Store',done: false },
        ],
    },
    {
        network:   'ACTIVE_DIRECTORY',
        prefix:    '10.50.0.0/16',
        nextHop:   'AD-DC-PRIMARY',
        as_path:   '58A6 → 00F0',
        metric:    88,
        weight:    190,
        status:    'ACTIVE',
        color:     '#00F0FF',
        label:     'ESTABLISHED',
        labelColor:'#00F0FF',
        tracks: [
            { name: 'Domain Controllers',    done: true },
            { name: 'GPO / Policy Mgmt',     done: true },
            { name: 'LDAP / Kerberos Auth',  done: true },
            { name: 'Azure AD Hybrid Join',  done: false },
        ],
    },
];

function ProgressArc({ value, color, size = 52 }) {
    const r = 20;
    const circ = 2 * Math.PI * r;
    const dash = (value / 100) * circ;
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
            <circle cx="24" cy="24" r={r}
                fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <circle cx="24" cy="24" r={r}
                fill="none" stroke={color} strokeWidth="4"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                transform="rotate(-90 24 24)"
                style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke-dasharray 1.2s ease' }}
            />
            <text x="24" y="28" textAnchor="middle"
                fill={color} fontSize="10" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
                {value}%
            </text>
        </svg>
    );
}

function RouteRow({ route, index, visible }) {
    const [expanded, setExpanded] = useState(false);
    const done = route.tracks.filter(t => t.done).length;
    const pct  = Math.round((done / route.tracks.length) * 100);

    return (
        <div style={{
            border: `1px solid ${expanded ? route.color + '55' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: '3px',
            overflow: 'hidden',
            backgroundColor: expanded ? `${route.color}08` : 'transparent',
            transition: 'border-color 0.3s, background-color 0.3s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transitionProperty: 'opacity, transform, border-color, background-color',
            transitionDuration: '0.4s, 0.4s, 0.3s, 0.3s',
            transitionDelay: `${index * 0.08}s, ${index * 0.08}s, 0s, 0s`,
        }}>
            {/* ── Header row ── */}
            <div
                onClick={() => setExpanded(e => !e)}
                style={{
                    display: 'grid',
                    gridTemplateColumns: '52px 1fr 90px 80px 60px',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    userSelect: 'none',
                }}
            >
                {/* Arc */}
                <ProgressArc value={pct} color={route.color} size={48} />

                {/* Network + prefix */}
                <div style={{ minWidth: 0 }}>
                    <div style={{
                        fontSize: '13px', fontWeight: 700,
                        color: route.color, letterSpacing: '1px',
                        fontFamily: 'var(--font-mono)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        {route.network}
                    </div>
                    <div style={{
                        fontSize: '9px', color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.5px', marginTop: '2px',
                        whiteSpace: 'nowrap',
                    }}>
                        {route.prefix} · via {route.nextHop}
                    </div>
                    <div style={{
                        fontSize: '9px', color: 'rgba(255,255,255,0.18)',
                        fontFamily: 'var(--font-mono)', marginTop: '1px',
                    }}>
                        AS_PATH: {route.as_path}
                    </div>
                </div>

                {/* Label badge */}
                <div style={{
                    border: `1px solid ${route.labelColor}44`,
                    backgroundColor: `${route.labelColor}0e`,
                    padding: '3px 8px',
                    borderRadius: '2px',
                    textAlign: 'center',
                }}>
                    <span style={{
                        fontSize: '9px', color: route.labelColor,
                        letterSpacing: '1.5px', fontFamily: 'var(--font-mono)',
                        whiteSpace: 'nowrap',
                    }}>
                        {route.label}
                    </span>
                </div>

                {/* Metric */}
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>METRIC</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{route.metric}</div>
                </div>

                {/* Expand chevron */}
                <div style={{
                    textAlign: 'right', fontSize: '11px',
                    color: 'var(--text-muted)',
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s',
                }}>▼</div>
            </div>

            {/* ── Expanded: track list ── */}
            <div style={{
                maxHeight: expanded ? '220px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}>
                <div style={{
                    borderTop: `1px solid ${route.color}22`,
                    padding: '12px 14px 14px 14px',
                }}>
                    <div style={{
                        fontSize: '9px', color: route.color,
                        letterSpacing: '2.5px', marginBottom: '10px',
                        opacity: 0.6, fontFamily: 'var(--font-mono)',
                    }}>
                        ── ROUTE_ATTRIBUTES · WEIGHT: {route.weight} ──
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {route.tracks.map((track, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                            }}>
                                {/* Status dot */}
                                <div style={{
                                    width: '7px', height: '7px', borderRadius: '50%',
                                    backgroundColor: track.done ? route.color : 'rgba(255,255,255,0.1)',
                                    boxShadow: track.done ? `0 0 6px ${route.color}` : 'none',
                                    flexShrink: 0,
                                }} />
                                {/* Track line */}
                                <div style={{ flex: 1, height: '1px', backgroundColor: track.done ? `${route.color}30` : 'rgba(255,255,255,0.05)' }} />
                                {/* Name */}
                                <span style={{
                                    fontSize: '11px',
                                    color: track.done ? 'rgba(232,240,255,0.85)' : 'var(--text-muted)',
                                    fontFamily: 'var(--font-sans)',
                                    textDecoration: track.done ? 'none' : 'none',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {track.name}
                                </span>
                                {/* Badge */}
                                <span style={{
                                    fontSize: '8px',
                                    color: track.done ? route.color : 'rgba(255,255,255,0.2)',
                                    fontFamily: 'var(--font-mono)',
                                    letterSpacing: '1px',
                                    flexShrink: 0,
                                }}>
                                    {track.done ? 'INSTALLED' : 'PENDING'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BGPRouteTable() {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <section ref={ref} style={{ marginBottom: '80px', fontFamily: 'var(--font-mono)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{
                    width: '12px', height: '12px', flexShrink: 0,
                    backgroundColor: 'var(--accent-blue)',
                    boxShadow: '0 0 10px var(--accent-blue-glow)',
                }} />
                <h2 style={{
                    fontSize: '20px', letterSpacing: '2px',
                    color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap',
                }}>
                    [ BGP_ROUTE_TABLE ]
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    // LEARNING_PATHS
                </div>
            </div>

            {/* Routes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {routes.map((route, i) => (
                    <RouteRow key={route.network} route={route} index={i} visible={visible} />
                ))}
            </div>

            {/* Legend */}
            <div style={{
                marginTop: '14px',
                display: 'flex', gap: '20px', flexWrap: 'wrap',
                padding: '8px 0',
                borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
                {[
                    { dot: '#00FFA3', label: 'INSTALLED — mastered / in use' },
                    { dot: 'rgba(255,255,255,0.15)', label: 'PENDING — learning next' },
                ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{
                            width: '7px', height: '7px', borderRadius: '50%',
                            backgroundColor: item.dot, flexShrink: 0,
                        }} />
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                            {item.label}
                        </span>
                    </div>
                ))}
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.1)', marginLeft: 'auto' }}>
                    click any row to expand
                </span>
            </div>
        </section>
    );
}
