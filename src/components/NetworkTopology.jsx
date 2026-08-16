import React, { useState, useEffect } from 'react';
import useSvgAnimationPause from '../hooks/useSvgAnimationPause';

// Four-floor topology nodes
const NODES = [
    // Ground Floor (y: 410)
    { id: 'r0',   x: 180,  y: 410, label: 'Router0', sub: 'ISR4331', color: '#fbbf24' },
    { id: 'sw0',  x: 450,  y: 410, label: 'Switch0', sub: 'Gig0/1',  color: '#a78bfa' },
    { id: 'pc0',  x: 700,  y: 390, label: 'PC0',     sub: 'Fa0/1',   color: '#3B9DFF' },
    { id: 'lap0', x: 860,  y: 430, label: 'Laptop0', sub: 'Fa0/2',   color: '#3B9DFF' },
    { id: 'srv0', x: 1020, y: 410, label: 'Server-PT', sub: 'Fa0/3', color: '#fbbf24' },

    // First Floor (y: 300)
    { id: 'sw1',  x: 450,  y: 300, label: 'Switch1', sub: 'Gig0/2',  color: '#a78bfa' },
    { id: 'lap2', x: 750,  y: 300, label: 'Laptop2', sub: 'Fa0/1',   color: '#3B9DFF' },

    // Second Floor (y: 190)
    { id: 'sw3',  x: 450,  y: 190,  label: 'Switch2', sub: 'Gig0/3',  color: '#a78bfa' },
    { id: 'lap3', x: 700,  y: 170,  label: 'Laptop3', sub: 'Fa0/1',   color: '#3B9DFF' },
    { id: 'prn0', x: 860,  y: 210, label: 'Printer0', sub: 'Fa0/2',  color: '#2EFF7A' },
    { id: 'srv3', x: 1020, y: 190,  label: 'Server-PT', sub: 'Fa0/3', color: '#fbbf24' },
    
    // Third Floor (y: 80)
    { id: 'sw4',  x: 450,  y: 80, label: 'Switch3', sub: 'Gig0/4',  color: '#a78bfa' },
    { id: 'lap4', x: 750,  y: 80, label: 'Laptop4', sub: 'Fa0/1',   color: '#3B9DFF' },
];

const EDGES = [
    // Ground floor links
    { from: 'r0',  to: 'sw0', dash: false },
    { from: 'sw0', to: 'pc0', dash: true },
    { from: 'sw0', to: 'lap0', dash: true },
    { from: 'sw0', to: 'srv0', dash: true, dual: true },

    // First floor links
    { from: 'sw1', to: 'lap2', dash: true },

    // Second floor links
    { from: 'sw3', to: 'lap3', dash: true },
    { from: 'sw3', to: 'prn0', dash: true },
    { from: 'sw3', to: 'srv3', dash: true },

    // Third floor links
    { from: 'sw4', to: 'lap4', dash: true },

    // Inter-floor trunks
    { from: 'sw0', to: 'sw1', dash: false, trunk: true },
    { from: 'sw1', to: 'sw3', dash: false, trunk: true },
    { from: 'sw3', to: 'sw4', dash: false, trunk: true },
];

function getNode(id) { return NODES.find(n => n.id === id); }

const CAMPUS_NODES = [
    { id: 'ms3', x: 600, y: 80,  label: 'Multilayer Switch3', sub: 'IE-9320', color: '#ef4444' },
    { id: 'ms1', x: 350, y: 220, label: 'Multilayer Switch1', sub: '3650-24PS', color: '#f97316' },
    { id: 'ms2', x: 850, y: 220, label: 'Multilayer Switch2', sub: '3650-24PS', color: '#f97316' },
    { id: 'c_sw0', x: 200, y: 360, label: 'Switch0', sub: '2960-24TT', color: '#a78bfa' },
    { id: 'c_sw1', x: 450, y: 360, label: 'Switch1', sub: '2960-24TT', color: '#a78bfa' },
    { id: 'c_sw2', x: 750, y: 360, label: 'Switch2', sub: '2960-24TT', color: '#a78bfa' },
    { id: 'c_sw3', x: 1000, y: 360, label: 'Switch3', sub: '2960-24TT', color: '#a78bfa' },
    { id: 'c_lap0', x: 100, y: 460, label: 'Laptop0', sub: 'Laptop-PT', color: '#3B9DFF' },
    { id: 'c_lap_pt', x: 300, y: 460, label: 'Laptop-PT', sub: '', color: '#3B9DFF' },
    { id: 'c_srv0', x: 450, y: 460, label: 'Server0', sub: 'Server-PT', color: '#fbbf24' },
    { id: 'c_srv1', x: 750, y: 460, label: 'Server1', sub: 'Server-PT', color: '#fbbf24' },
    { id: 'c_lap_pt2', x: 900, y: 460, label: 'Laptop-PT', sub: '', color: '#3B9DFF' },
    { id: 'c_lap1', x: 1100, y: 460, label: 'Laptop1', sub: 'Laptop-PT', color: '#3B9DFF' },
];

const CAMPUS_EDGES = [
    { from: 'ms3', to: 'ms1', dash: false, trunk: true },
    { from: 'ms3', to: 'ms2', dash: false, trunk: true },
    { from: 'ms1', to: 'c_sw0', dash: false, trunk: true },
    { from: 'ms1', to: 'c_sw1', dash: false, trunk: true },
    { from: 'ms1', to: 'c_sw2', dash: false, trunk: true },
    { from: 'ms1', to: 'c_sw3', dash: false, trunk: true },
    { from: 'ms2', to: 'c_sw0', dash: false, trunk: true },
    { from: 'ms2', to: 'c_sw1', dash: false, trunk: true },
    { from: 'ms2', to: 'c_sw2', dash: false, trunk: true },
    { from: 'ms2', to: 'c_sw3', dash: false, trunk: true },
    { from: 'c_sw0', to: 'c_lap0', dash: true },
    { from: 'c_sw0', to: 'c_lap_pt', dash: true },
    { from: 'c_sw1', to: 'c_srv0', dash: true },
    { from: 'c_sw2', to: 'c_srv1', dash: true },
    { from: 'c_sw3', to: 'c_lap_pt2', dash: true },
    { from: 'c_sw3', to: 'c_lap1', dash: true },
];

function getCampusNode(id) { return CAMPUS_NODES.find(n => n.id === id); }

// ─── Multi-Branch Enterprise ─────────────────────────────────────────────────
const MB_NODES = [
    // HQ top
    { id: 'hq_r',    x: 600, y: 55,  label: 'HQ-Router',   sub: 'Gig0/0/0',  color: '#fbbf24',  type: 'router' },
    { id: 'internet',x: 1080,y: 55,  label: 'Internet',     sub: 'ISP',        color: '#ff4444',  type: 'world'  },

    // HQ zone (center)
    { id: 'hq_sw',   x: 520, y: 175, label: 'HQ-SW',        sub: '2960-24TT', color: '#a78bfa',  type: 'switch' },
    { id: 'sw5',     x: 660, y: 240, label: 'Switch5',       sub: '2960-24TT', color: '#a78bfa',  type: 'switch' },
    { id: 'sw6',     x: 520, y: 310, label: 'Switch6',       sub: '2960-24TT', color: '#a78bfa',  type: 'switch' },
    { id: 'hq_srv0', x: 660, y: 375, label: 'HQ-SRV0',      sub: 'Server-PT', color: '#fbbf24',  type: 'server' },
    { id: 'hq_srv1', x: 780, y: 340, label: 'HQ-SRV1',      sub: 'Server-PT', color: '#fbbf24',  type: 'server' },
    { id: 'hq_srv2', x: 520, y: 420, label: 'HQ-SRV2',      sub: 'Server-PT', color: '#fbbf24',  type: 'server' },

    // Branch 1 (left)
    { id: 'b1_r',    x: 200, y: 175, label: 'B1-Router',    sub: 'Gig0/0/1',  color: '#f97316',  type: 'router' },
    { id: 'b1_sw',   x: 200, y: 280, label: 'B1-Switch',    sub: '2960-24TT', color: '#a78bfa',  type: 'switch' },
    { id: 'b1_lap',  x: 110, y: 390, label: 'Laptop0',      sub: 'Fa0/1',     color: '#3B9DFF',  type: 'laptop' },
    { id: 'b1_srv',  x: 290, y: 390, label: 'B1-SRV',       sub: 'Fa0/2',     color: '#fbbf24',  type: 'server' },

    // Branch 2 (right)
    { id: 'b2_r',    x: 950, y: 175, label: 'B2-Router',    sub: 'Gig0/0/2',  color: '#f97316',  type: 'router' },
    { id: 'b2_sw',   x: 950, y: 280, label: 'B2-Switch',    sub: '2960-24TT', color: '#a78bfa',  type: 'switch' },
    { id: 'b2_lap',  x: 870, y: 390, label: 'Laptop1',      sub: 'Fa0/1',     color: '#3B9DFF',  type: 'laptop' },
    { id: 'b2_srv',  x: 1040,y: 390, label: 'B2-SRV',       sub: 'Fa0/2',     color: '#fbbf24',  type: 'server' },
];

const MB_EDGES = [
    { from: 'hq_r',   to: 'internet', color: '#00e5ff', dash: '6 3',  w: 1.5, label: 'WAN' },
    { from: 'hq_r',   to: 'b1_r',    color: '#2EFF7A', dash: '5 4',  w: 0.8, label: 'Gig0/0/1' },
    { from: 'hq_r',   to: 'b2_r',    color: '#2EFF7A', dash: '5 4',  w: 0.8, label: 'Gig0/0/2' },
    { from: 'hq_r',   to: 'hq_sw',   color: '#a78bfa', w: 1.5,   label: 'Gig1/0' },
    { from: 'hq_sw',  to: 'sw5',     color: '#FFF2DB', w: 2.5, label: '' },
    { from: 'hq_sw',  to: 'sw6',     color: '#FFF2DB', w: 2.5, label: '' },
    { from: 'sw5',    to: 'sw6',     color: '#ff2a9d', dash: '3 3',  w: 1.2, label: '', offsetX: -5, offsetY: -5 },
    { from: 'sw5',    to: 'sw6',     color: '#ff2a9d', dash: '3 3',  w: 1.2, label: '' },
    { from: 'sw5',    to: 'sw6',     color: '#ff2a9d', dash: '3 3',  w: 1.2, label: '', offsetX: 5, offsetY: 5 },
    // Switch5 → all 3 HQ servers
    { from: 'sw5',    to: 'hq_srv0', color: '#fbbf24', dash: '4 3',  w: 0.6, label: '' },
    { from: 'sw5',    to: 'hq_srv1', color: '#fbbf24', dash: '4 3',  w: 0.6, label: '' },
    { from: 'sw5',    to: 'hq_srv2', color: '#fbbf24', dash: '4 3',  w: 0.6, label: '' },
    // Switch6 → all 3 HQ servers
    { from: 'sw6',    to: 'hq_srv0', color: '#2EFF7A', dash: '3 3',  w: 0.5, label: '' },
    { from: 'sw6',    to: 'hq_srv1', color: '#2EFF7A', dash: '3 3',  w: 0.5, label: '' },
    { from: 'sw6',    to: 'hq_srv2', color: '#2EFF7A', dash: '3 3',  w: 0.5, label: '' },
    // B1: trunk uplink router → switch (thick solid green)
    { from: 'b1_r',   to: 'b1_sw',   color: '#2EFF7A', w: 1.8, label: 'TRUNK', trunk: true },
    { from: 'b1_sw',  to: 'b1_lap',  color: '#3B9DFF', dash: '4 4',  w: 0.6, label: 'Fa0/1' },
    { from: 'b1_sw',  to: 'b1_srv',  color: '#fbbf24', dash: '4 4',  w: 0.6, label: 'Fa0/2' },
    // B2: trunk uplink router → switch (thick solid)
    { from: 'b2_r',   to: 'b2_sw',   color: '#f97316', w: 2,   label: 'TRUNK', trunk: true },
    { from: 'b2_sw',  to: 'b2_lap',  color: '#3B9DFF', dash: '4 4',  w: 0.6, label: 'Fa0/1' },
    { from: 'b2_sw',  to: 'b2_srv',  color: '#fbbf24', dash: '4 4',  w: 0.6, label: 'Fa0/2' },
];

function getMBNode(id) { return MB_NODES.find(n => n.id === id); }

function Packet({ fromNode, toNode, delay, duration, color, offset = 0 }) {
    return (
        <circle r="2.5" fill={color} filter="url(#glow)">
            <animateMotion
                dur={`${duration}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
                path={`M${fromNode.x},${fromNode.y + offset} L${toNode.x},${toNode.y + offset}`}
            />
            <animate attributeName="opacity" values="0;1;1;0" dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite" />
        </circle>
    );
}

export default function NetworkTopology() {
    const daisySvgRef = useSvgAnimationPause();
    const campusSvgRef = useSvgAnimationPause();
    const mbSvgRef = useSvgAnimationPause();
    const tabs = ['Daisy-Chain', 'Redundant Campus Network', 'Multi-Branch Enterprise'];
    const [activeTab, setActiveTab] = useState('Multi-Branch Enterprise');
    const [failedSwitch, setFailedSwitch] = useState(null);

    const getFailedSwitches = (failed) => {
        if (!failed) return [];
        if (failed === 'sw0') return ['sw0', 'sw1', 'sw3', 'sw4'];
        if (failed === 'sw1') return ['sw1', 'sw3', 'sw4'];
        if (failed === 'sw3') return ['sw3', 'sw4'];
        if (failed === 'sw4') return ['sw4'];
        return [];
    };

    const getNodeParentSwitch = (id) => {
        if (['sw0', 'pc0', 'lap0', 'srv0'].includes(id)) return 'sw0';
        if (['sw1', 'lap2'].includes(id)) return 'sw1';
        if (['sw3', 'lap3', 'prn0', 'srv3'].includes(id)) return 'sw3';
        if (['sw4', 'lap4'].includes(id)) return 'sw4';
        return null; // r0 is not affected unless explicitly coded
    };

    const isNodeDown = (nodeId) => {
        if (!failedSwitch) return false;
        const failedSwitches = getFailedSwitches(failedSwitch);
        const parentSwitch = getNodeParentSwitch(nodeId);
        return failedSwitches.includes(parentSwitch);
    };

    const handleSwitchClick = (id) => {
        if (!id.startsWith('sw')) return;
        setFailedSwitch(prev => prev === id ? null : id);
    };

    const [failedCampusNode, setFailedCampusNode] = useState(null);

    const getFailedCampusNodes = (failed) => {
        if (!failed) return [];
        let down = [failed];
        if (failed === 'ms3') {
            return CAMPUS_NODES.map(n => n.id);
        }
        if (failed === 'c_sw0') down.push('c_lap0', 'c_lap_pt');
        if (failed === 'c_sw1') down.push('c_srv0');
        if (failed === 'c_sw2') down.push('c_srv1');
        if (failed === 'c_sw3') down.push('c_lap_pt2', 'c_lap1');
        return down;
    };
    
    const isCampusNodeDown = (nodeId) => {
        if (!failedCampusNode) return false;
        return getFailedCampusNodes(failedCampusNode).includes(nodeId);
    };
    
    const handleCampusClick = (id) => {
        if (!id.startsWith('ms') && !id.startsWith('c_sw')) return;
        setFailedCampusNode(prev => prev === id ? null : id);
    };

    const [failedMBNodes, setFailedMBNodes] = useState([]);

    const getFailedMBNodes = (failedList) => {
        let down = [...failedList];
        
        if (failedList.includes('internet')) {
            return MB_NODES.map(n => n.id);
        }
        
        if (failedList.includes('hq_r')) {
            down.push('hq_sw', 'sw5', 'sw6', 'hq_srv0', 'hq_srv1', 'hq_srv2', 'b1_r', 'b1_sw', 'b1_lap', 'b1_srv', 'b2_r', 'b2_sw', 'b2_lap', 'b2_srv');
        }
        if (failedList.includes('hq_sw')) {
            down.push('sw5', 'sw6', 'hq_srv0', 'hq_srv1', 'hq_srv2');
        }
        
        // Redundancy logic for servers
        if (failedList.includes('sw5') && failedList.includes('sw6')) {
            down.push('hq_srv0', 'hq_srv1', 'hq_srv2');
        }
        
        if (failedList.includes('b1_r'))  down.push('b1_sw', 'b1_lap', 'b1_srv');
        if (failedList.includes('b1_sw')) down.push('b1_lap', 'b1_srv');
        if (failedList.includes('b2_r'))  down.push('b2_sw', 'b2_lap', 'b2_srv');
        if (failedList.includes('b2_sw')) down.push('b2_lap', 'b2_srv');
        
        return down;
    };

    const isMBNodeDown = (nodeId) => {
        return getFailedMBNodes(failedMBNodes).includes(nodeId);
    };

    const handleMBClick = (id) => {
        const clickable = ['internet','hq_r','hq_sw','sw5','sw6','b1_r','b1_sw','b2_r','b2_sw'];
        if (!clickable.includes(id)) return;
        setFailedMBNodes(prev => 
            prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
        );
    };

    return (
        <section style={{ marginBottom: '80px', fontFamily: 'var(--font-mono)' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'
            }}>
                <div style={{
                    width: '12px', height: '12px',
                    backgroundColor: 'var(--accent-blue)',
                    boxShadow: '0 0 10px var(--accent-blue-glow)'
                }} />
                <h2 style={{ fontSize: '20px', letterSpacing: '2px', color: 'var(--text-main)', margin: 0 }}>
                    [ NETWORK_TOPOLOGY ]
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                    // LAB_PROJECTS
                </div>
            </div>

            {/* Tabs */}
            <div className="scroll-x" style={{ display: 'flex', gap: '20px', marginBottom: '20px', paddingBottom: '10px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: activeTab === tab ? 'var(--accent-blue-intense)' : 'transparent',
                            border: '1px solid var(--accent-blue)',
                            color: activeTab === tab ? 'var(--text-main)' : 'var(--accent-blue)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{
                backgroundColor: '#02050A',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                position: 'relative',
                height: '550px',
                overflow: 'hidden'
            }}>
                {activeTab === 'Daisy-Chain' ? (
                    <div className="scroll-x" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <svg
                            className="mobile-scale-svg"
                            ref={daisySvgRef}
                            viewBox="0 0 1200 500"
                            preserveAspectRatio="xMidYMid slice"
                            style={{ width: '100%', height: 'calc(100% - 60px)' }}
                            xmlns="http://www.w3.org/2000/svg"
                        >
                        <defs>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                            </filter>
                            <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                                <feGaussianBlur stdDeviation="5" result="blur" />
                                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                            </filter>
                            <filter id="panelGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="15" result="blur" />
                                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                            </filter>
                            <linearGradient id="purpleGlow" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="rgba(167,139,250,0.02)" />
                                <stop offset="50%" stopColor="rgba(167,139,250,0.08)" />
                                <stop offset="100%" stopColor="rgba(167,139,250,0.02)" />
                            </linearGradient>
                            <linearGradient id="blueGlow" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="rgba(59,157,255,0.02)" />
                                <stop offset="50%" stopColor="rgba(59,157,255,0.08)" />
                                <stop offset="100%" stopColor="rgba(59,157,255,0.02)" />
                            </linearGradient>
                            <linearGradient id="greenGlow" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="rgba(46,255,122,0.02)" />
                                <stop offset="50%" stopColor="rgba(46,255,122,0.08)" />
                                <stop offset="100%" stopColor="rgba(46,255,122,0.02)" />
                            </linearGradient>
                            <linearGradient id="orangeGlow" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="rgba(251,191,36,0.02)" />
                                <stop offset="50%" stopColor="rgba(251,191,36,0.08)" />
                                <stop offset="100%" stopColor="rgba(251,191,36,0.02)" />
                            </linearGradient>
                            <linearGradient id="redGlow" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="rgba(255,107,107,0.02)" />
                                <stop offset="50%" stopColor="rgba(255,107,107,0.08)" />
                                <stop offset="100%" stopColor="rgba(255,107,107,0.02)" />
                            </linearGradient>
                        </defs>

                        {/* Background Grid / Particle effect hints */}
                        <g opacity="0.15">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="500" stroke="#3B9DFF" strokeWidth="0.5" strokeDasharray="4 8" />
                            ))}
                        </g>

                        {/* Integrated four-floor network infrastructure title */}
                        <text x="40" y="30" fill="rgba(46,255,122,0.7)" fontSize="10" letterSpacing="2" filter="url(#glow)">
                            &gt;_ INTEGRATED FOUR-FLOOR NETWORK INFRASTRUCTURE.
                        </text>

                        {/* FLOOR PANELS */}
                        {/* Third Floor Panel */}
                        <rect x="100" y="45" width="1000" height="70" rx="4" fill="url(#orangeGlow)" stroke="rgba(251,191,36,0.15)" strokeWidth="1" filter="url(#panelGlow)"/>
                        <rect x="100" y="45" width="1000" height="70" rx="4" fill="transparent" stroke="rgba(251,191,36,0.3)" strokeWidth="1" />
                        <text x="120" y="85" fill="#fbbf24" fontSize="10" fontWeight="bold" letterSpacing="3" opacity="0.8" filter="url(#glow)" transform="rotate(-90 130 85)">THIRD</text>
                        
                        {/* Second Floor Panel */}
                        <rect x="100" y="155" width="1000" height="70" rx="4" fill="url(#purpleGlow)" stroke="rgba(167,139,250,0.15)" strokeWidth="1" filter="url(#panelGlow)"/>
                        <rect x="100" y="155" width="1000" height="70" rx="4" fill="transparent" stroke="rgba(167,139,250,0.3)" strokeWidth="1" />
                        <text x="120" y="195" fill="#a78bfa" fontSize="10" fontWeight="bold" letterSpacing="3" opacity="0.8" filter="url(#glow)" transform="rotate(-90 130 195)">SECOND</text>
                        
                        {/* First Floor Panel */}
                        <rect x="100" y="265" width="1000" height="70" rx="4" fill="url(#blueGlow)" stroke="rgba(59,157,255,0.15)" strokeWidth="1" filter="url(#panelGlow)"/>
                        <rect x="100" y="265" width="1000" height="70" rx="4" fill="transparent" stroke="rgba(59,157,255,0.3)" strokeWidth="1" />
                        <text x="120" y="305" fill="#3B9DFF" fontSize="10" fontWeight="bold" letterSpacing="3" opacity="0.8" filter="url(#glow)" transform="rotate(-90 130 305)">FIRST</text>
                        
                        {/* Ground Floor Panel */}
                        <rect x="100" y="375" width="1000" height="70" rx="4" fill="url(#greenGlow)" stroke="rgba(46,255,122,0.15)" strokeWidth="1" filter="url(#panelGlow)"/>
                        <rect x="100" y="375" width="1000" height="70" rx="4" fill="transparent" stroke="rgba(46,255,122,0.3)" strokeWidth="1" />
                        <text x="120" y="415" fill="#2EFF7A" fontSize="10" fontWeight="bold" letterSpacing="3" opacity="0.8" filter="url(#glow)" transform="rotate(-90 130 415)">GROUND</text>


                        {/* EDGES */}
                        {EDGES.map((e, i) => {
                            const a = getNode(e.from), b = getNode(e.to);
                            const down = isNodeDown(a.id) || isNodeDown(b.id);
                            const strokeColor = down ? '#ff4444' : (e.trunk ? '#2EFF7A' : 'rgba(59,157,255,0.3)');
                            const dash = e.dash ? '4 4' : 'none';
                            const strokeWidth = e.trunk ? '0.4' : '1';
                            
                            return (
                                <g key={`edge-${i}`}>
                                    {/* Dual links logic */}
                                    {e.dual ? (
                                        <>
                                            <line x1={a.x} y1={a.y - 3} x2={a.x === b.x ? b.x + 0.01 : b.x} y2={a.y === b.y ? b.y - 3 + 0.01 : b.y - 3} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={dash} filter={e.trunk && !down ? "url(#glow)" : "none"} />
                                            <line x1={a.x} y1={a.y + 3} x2={a.x === b.x ? b.x + 0.01 : b.x} y2={a.y === b.y ? b.y + 3 + 0.01 : b.y + 3} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={dash} filter={e.trunk && !down ? "url(#glow)" : "none"} />
                                        </>
                                    ) : (
                                        <line x1={a.x} y1={a.y} x2={a.x === b.x ? b.x + 0.01 : b.x} y2={a.y === b.y ? b.y + 0.01 : b.y} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={dash} filter={e.trunk && !down ? "url(#glow)" : "none"} />
                                    )}
                                </g>
                            );
                        })}

                        {/* TRAVELING PACKETS */}
                        {EDGES.map((e, i) => {
                            const a = getNode(e.from), b = getNode(e.to);
                            const down = isNodeDown(a.id) || isNodeDown(b.id);
                            if (down) return null; // No packets on dead lines
                            const dur = e.trunk ? 1.2 : 2.0 + (i % 3) * 0.5;
                            
                            return (
                                <g key={`pkts-${i}`}>
                                    {e.dual ? (
                                        <>
                                            <Packet fromNode={a} toNode={b} delay={i * 0.3} duration={dur} color={a.color} offset={-3} />
                                            <Packet fromNode={b} toNode={a} delay={i * 0.3 + dur/2} duration={dur} color={b.color} offset={3} />
                                        </>
                                    ) : (
                                        <>
                                            <Packet fromNode={a} toNode={b} delay={i * 0.4} duration={dur} color={a.color} />
                                            <Packet fromNode={b} toNode={a} delay={i * 0.4 + dur/2} duration={dur} color={b.color} />
                                        </>
                                    )}
                                    {/* Trunk pulse nodes */}
                                    {e.trunk && (
                                        <circle cx={a.x + (b.x-a.x)/2} cy={a.y + (b.y-a.y)/2} r="2" fill="#2EFF7A" filter="url(#glow)">
                                            <animate attributeName="r" values="1; 4; 1" dur="1.5s" repeatCount="indefinite" />
                                            <animate attributeName="opacity" values="0.2; 1; 0.2" dur="1.5s" repeatCount="indefinite" />
                                        </circle>
                                    )}
                                </g>
                            );
                        })}

                        {/* NODES (Devices) */}
                        {NODES.map(n => {
                            const down = isNodeDown(n.id);
                            const nodeColor = down ? '#ff4444' : n.color;
                            const isClickable = n.id.startsWith('sw');

                            return (
                            <g 
                                key={n.id}
                                onClick={() => handleSwitchClick(n.id)}
                                style={{ cursor: isClickable ? 'pointer' : 'default' }}
                            >
                                {/* Device Rectangle */}
                                <rect 
                                    x={n.x - 22} y={n.y - 12} 
                                    width="44" height="24" rx="3" 
                                    fill="#050B14" 
                                    stroke={nodeColor} strokeWidth="1.5" 
                                    filter={down ? "none" : "url(#nodeGlow)"} 
                                />
                                {/* Inner highlight */}
                                <rect 
                                    x={n.x - 20} y={n.y - 10} 
                                    width="40" height="20" rx="2" 
                                    fill="none" 
                                    stroke={nodeColor} strokeWidth="0.5" opacity="0.4"
                                />
                                {/* Status Dot */}
                                <circle cx={n.x - 14} cy={n.y} r="2" fill={nodeColor} style={down ? {} : {animation: "blink 2s infinite"}} />
                                
                                {/* Labels */}
                                <text
                                    x={n.x} y={n.y - 18}
                                    textAnchor="middle"
                                    fontSize="9"
                                    fill={nodeColor}
                                    fontWeight="bold"
                                    filter={down ? "none" : "url(#glow)"}
                                >{n.label}</text>
                                
                                {/* Sub-label (ports/models) */}
                                <text
                                    x={n.x} y={n.y + 22}
                                    textAnchor="middle"
                                    fontSize="7"
                                    fill={down ? "#ff4444" : "rgba(255,255,255,0.5)"}
                                    letterSpacing="0.5"
                                >{n.sub}</text>
                            </g>
                        )})}
                    </svg>
                        
                        {/* Download Buttons Section */}
                        <div style={{ 
                            height: '60px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '20px', 
                            borderTop: '1px solid var(--border-color)',
                            backgroundColor: 'rgba(5, 11, 20, 0.8)'
                        }}>
                            <a href="/DaisyChainLab.pkt" download style={{
                                padding: '8px 16px',
                                backgroundColor: 'var(--accent-blue-intense)',
                                border: '1px solid var(--accent-blue)',
                                color: 'var(--text-main)',
                                textDecoration: 'none',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>📥 Download Project File (.pkt)</span>
                            </a>
                            <a href="/README-DaisyChain.txt" target="_blank" download style={{
                                padding: '8px 16px',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--accent-blue)',
                                color: 'var(--accent-blue)',
                                textDecoration: 'none',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>📄 Read Documentation</span>
                            </a>
                        </div>
                    </div>
                ) : activeTab === 'Redundant Campus Network' ? (
                    <div className="scroll-x" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <svg
                            className="mobile-scale-svg"
                            ref={campusSvgRef}
                            viewBox="0 0 1200 500"
                            preserveAspectRatio="xMidYMid slice"
                            style={{ width: '100%', height: '100%' }}
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <filter id="glowCamp" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                </filter>
                                <filter id="nodeGlowCamp" x="-100%" y="-100%" width="300%" height="300%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                </filter>
                            </defs>
                            
                            <g opacity="0.15">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="500" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="4 8" />
                                ))}
                            </g>

                            {/* Redundant campus network title */}
                            <text x="40" y="30" fill="rgba(251,191,36,0.7)" fontSize="10" letterSpacing="2" filter="url(#glowCamp)">
                                &gt;_ HIGH-AVAILABILITY REDUNDANT CORE ARCHITECTURE.
                            </text>

                            {/* EDGES */}
                            {CAMPUS_EDGES.map((e, i) => {
                                const a = getCampusNode(e.from), b = getCampusNode(e.to);
                                const down = isCampusNodeDown(a.id) || isCampusNodeDown(b.id);
                                const strokeColor = down ? '#ff4444' : (e.trunk ? '#2EFF7A' : 'rgba(59,157,255,0.3)');
                                const dash = e.dash ? '4 4' : 'none';
                                const strokeWidth = e.trunk ? '0.4' : '1';
                                return (
                                    <g key={`edge-${i}`}>
                                        <line x1={a.x} y1={a.y} x2={a.x === b.x ? b.x + 0.01 : b.x} y2={a.y === b.y ? b.y + 0.01 : b.y} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={dash} filter={e.trunk && !down ? "url(#glowCamp)" : "none"} />
                                    </g>
                                );
                            })}

                            {/* TRAVELING PACKETS */}
                            {CAMPUS_EDGES.map((e, i) => {
                                const a = getCampusNode(e.from), b = getCampusNode(e.to);
                                const down = isCampusNodeDown(a.id) || isCampusNodeDown(b.id);
                                if (down) return null;
                                const dur = e.trunk ? 1.5 : 2.5;
                                return (
                                    <g key={`pkts-${i}`}>
                                        <Packet fromNode={a} toNode={b} delay={i * 0.2} duration={dur} color={a.color} />
                                        <Packet fromNode={b} toNode={a} delay={i * 0.2 + dur/2} duration={dur} color={b.color} />
                                    </g>
                                );
                            })}

                            {/* NODES */}
                            {CAMPUS_NODES.map(n => {
                                const down = isCampusNodeDown(n.id);
                                const nodeColor = down ? '#ff4444' : n.color;
                                const isClickable = n.id.startsWith('ms') || n.id.startsWith('c_sw');
                                return (
                                <g key={n.id} onClick={() => handleCampusClick(n.id)} style={{ cursor: isClickable ? 'pointer' : 'default' }}>
                                    <rect x={n.x - 25} y={n.y - 12} width="50" height="24" rx="3" fill="#050B14" stroke={nodeColor} strokeWidth="1.5" filter={down ? "none" : "url(#nodeGlowCamp)"} />
                                    <rect x={n.x - 23} y={n.y - 10} width="46" height="20" rx="2" fill="none" stroke={nodeColor} strokeWidth="0.5" opacity="0.4" />
                                    <circle cx={n.x - 16} cy={n.y} r="2" fill={nodeColor} style={down ? {} : {animation: "blink 2s infinite"}} />
                                    <text x={n.x + 3} y={n.y - 18} textAnchor="middle" fontSize="10" fill={nodeColor} fontWeight="bold" filter={down ? "none" : "url(#glowCamp)"}>{n.label}</text>
                                    <text x={n.x + 3} y={n.y + 22} textAnchor="middle" fontSize="8" fill={down ? "#ff4444" : "rgba(255,255,255,0.7)"}>{n.sub}</text>
                                </g>
                            )})}
                        </svg>

                        {/* Download Buttons Section */}
                        <div style={{ 
                            height: '60px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '20px', 
                            borderTop: '1px solid var(--border-color)',
                            backgroundColor: 'rgba(5, 11, 20, 0.8)'
                        }}>
                            <a href="/CampusNetworkLab.pkt" download style={{
                                padding: '8px 16px',
                                backgroundColor: 'var(--accent-blue-intense)',
                                border: '1px solid var(--accent-blue)',
                                color: 'var(--text-main)',
                                textDecoration: 'none',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>📥 Download Project File (.pkt)</span>
                            </a>
                            <a href="/README-CampusNetwork.txt" target="_blank" download style={{
                                padding: '8px 16px',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--accent-blue)',
                                color: 'var(--accent-blue)',
                                textDecoration: 'none',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>📄 Read Documentation</span>
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="scroll-x" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <svg
                            className="mobile-scale-svg"
                            ref={mbSvgRef}
                            viewBox="0 0 1200 480"
                            preserveAspectRatio="xMidYMid slice"
                            style={{ width: '100%', height: 'calc(100% - 60px)', background: '#000' }}
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <filter id="glowMB" x="-100" y="-100" width="1400" height="680" filterUnits="userSpaceOnUse">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                </filter>
                                <filter id="nodeGlowMB" x="-80%" y="-80%" width="260%" height="260%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                </filter>
                                <filter id="zoneglow" x="-10%" y="-10%" width="120%" height="120%">
                                    <feGaussianBlur stdDeviation="8" result="blur" />
                                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                </filter>
                                <radialGradient id="stasisB1" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="rgba(249,115,22,0.15)"/>
                                    <stop offset="100%" stopColor="rgba(249,115,22,0)"/>
                                </radialGradient>
                                <radialGradient id="stasisB2" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="rgba(59,157,255,0.15)"/>
                                    <stop offset="100%" stopColor="rgba(59,157,255,0)"/>
                                </radialGradient>
                                <radialGradient id="stasisHQ" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="rgba(167,139,250,0.1)"/>
                                    <stop offset="100%" stopColor="rgba(167,139,250,0)"/>
                                </radialGradient>
                            </defs>

                            {/* === BACKGROUND GRID === */}
                            <g opacity="0.07">
                                {Array.from({ length: 13 }).map((_, i) => (
                                    <line key={`vg-${i}`} x1={i*100} y1="0" x2={i*100} y2="480" stroke="#3B9DFF" strokeWidth="0.5" />
                                ))}
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <line key={`hg-${i}`} x1="0" y1={i*80} x2="1200" y2={i*80} stroke="#3B9DFF" strokeWidth="0.5" />
                                ))}
                            </g>

                            {/* Multi-branch enterprise title */}
                            <text x="40" y="30" fill="rgba(167,139,250,0.7)" fontSize="10" letterSpacing="2" filter="url(#glowMB)">
                                &gt;_ DISTRIBUTED WIDE-AREA ENTERPRISE TOPOLOGY.
                            </text>

                            {/* === FLOATING PARTICLES === */}
                            {[120,340,580,820,1050].map((px, i) => (
                                <g key={`p-${i}`}>
                                    <circle cx={px} cy={30+i*12} r="1.5" fill="#3B9DFF" opacity="0.4">
                                        <animate attributeName="cy" values={`${30+i*12};${20+i*12};${30+i*12}`} dur={`${2+i*0.4}s`} repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${2+i*0.4}s`} repeatCount="indefinite" />
                                    </circle>
                                    <circle cx={px+30} cy={440-i*10} r="1" fill="#2EFF7A" opacity="0.3">
                                        <animate attributeName="cy" values={`${440-i*10};${450-i*10};${440-i*10}`} dur={`${3+i*0.3}s`} repeatCount="indefinite" />
                                    </circle>
                                </g>
                            ))}

                            {/* === ZONE: BRANCH 1 (left green) === */}
                            <rect x="60" y="140" width="280" height="290" rx="8"
                                fill="rgba(46,255,122,0.03)" stroke="rgba(46,255,122,0.25)" strokeWidth="1"
                                strokeDasharray="6 4" filter="url(#zoneglow)" />
                            <text x="75" y="135" fill="rgba(46,255,122,0.6)" fontSize="9" letterSpacing="2" fontWeight="bold" filter="url(#glowMB)">BRANCH-1</text>

                            {/* === ZONE: HQ CENTER (purple) === */}
                            <rect x="390" y="140" width="440" height="320" rx="8"
                                fill="rgba(167,139,250,0.04)" stroke="rgba(167,139,250,0.25)" strokeWidth="1"
                                strokeDasharray="6 4" filter="url(#zoneglow)" />
                            <text x="405" y="135" fill="rgba(167,139,250,0.6)" fontSize="9" letterSpacing="2" fontWeight="bold" filter="url(#glowMB)">HQ CAMPUS</text>

                            {/* === ZONE: BRANCH 2 (right light-green) === */}
                            <rect x="860" y="140" width="280" height="290" rx="8"
                                fill="rgba(59,157,255,0.03)" stroke="rgba(59,157,255,0.25)" strokeWidth="1"
                                strokeDasharray="6 4" filter="url(#zoneglow)" />
                            <text x="875" y="135" fill="rgba(59,157,255,0.6)" fontSize="9" letterSpacing="2" fontWeight="bold" filter="url(#glowMB)">BRANCH-2</text>

                            {/* === STASIS FIELDS around floating servers === */}
                            <ellipse cx="200" cy="390" rx="55" ry="35" fill="url(#stasisB1)" />
                            <ellipse cx="950" cy="390" rx="55" ry="35" fill="url(#stasisB2)" />
                            <ellipse cx="660" cy="375" rx="90" ry="55" fill="url(#stasisHQ)" />

                            {/* === EDGES === */}
                            {MB_EDGES.map((e, i) => {
                                const a = getMBNode(e.from), b = getMBNode(e.to);
                                const aDown = isMBNodeDown(a.id), bDown = isMBNodeDown(b.id);
                                const edgeDown = aDown || bDown;
                                const color = edgeDown ? '#ff4444' : e.color;
                                return (
                                    <g key={`mb-edge-${i}`}>
                                        <line x1={a.x + (e.offsetX || 0)} y1={a.y + (e.offsetY || 0)} x2={b.x + (e.offsetX || 0)} y2={b.y + (e.offsetY || 0)}
                                            stroke={color} strokeWidth={edgeDown ? 0.6 : e.w}
                                            strokeDasharray={edgeDown ? '3 3' : (e.dash ? '12 8' : undefined)}
                                            filter={edgeDown ? 'none' : 'url(#glowMB)'}
                                            opacity={edgeDown ? 0.4 : 1}
                                            className={e.dash && !edgeDown ? 'mb-dashed-link' : undefined}
                                        />
                                        {e.label && !edgeDown && (
                                            <text
                                                x={(a.x+b.x)/2 + 6} y={(a.y+b.y)/2 - 4}
                                                fill={color} fontSize="7" opacity="0.7"
                                                filter="url(#glowMB)">{e.label}</text>
                                        )}
                                    </g>
                                );
                            })}

                            {/* === TRAVELING PACKETS === */}
                            {MB_EDGES.map((e, i) => {
                                const a = getMBNode(e.from), b = getMBNode(e.to);
                                const edgeDown = isMBNodeDown(a.id) || isMBNodeDown(b.id);
                                if (edgeDown) return null;
                                const dur = e.from === 'hq_r' ? 1.2 : 2;
                                return (
                                    <g key={`mb-pkt-${i}`}>
                                        <circle r="2" fill={e.color} filter="url(#glowMB)" opacity="0.9">
                                            <animateMotion dur={`${dur}s`} begin={`${i*0.3}s`} repeatCount="indefinite"
                                                path={`M${a.x + (e.offsetX || 0)},${a.y + (e.offsetY || 0)} L${b.x + (e.offsetX || 0)},${b.y + (e.offsetY || 0)}`} />
                                            <animate attributeName="opacity" values="0;1;1;0" dur={`${dur}s`} begin={`${i*0.3}s`} repeatCount="indefinite" />
                                        </circle>
                                        <circle r="1.5" fill={e.color} filter="url(#glowMB)" opacity="0.7">
                                            <animateMotion dur={`${dur}s`} begin={`${i*0.3+dur/2}s`} repeatCount="indefinite"
                                                path={`M${b.x + (e.offsetX || 0)},${b.y + (e.offsetY || 0)} L${a.x + (e.offsetX || 0)},${a.y + (e.offsetY || 0)}`} />
                                            <animate attributeName="opacity" values="0;1;1;0" dur={`${dur}s`} begin={`${i*0.3+dur/2}s`} repeatCount="indefinite" />
                                        </circle>
                                    </g>
                                );
                            })}

                            {/* === NODES === */}
                            {MB_NODES.map(n => {
                                const down = isMBNodeDown(n.id);
                                const col = down ? '#ff4444' : n.color;
                                const clickable = ['hq_r','hq_sw','sw5','sw6','b1_r','b1_sw','b2_r','b2_sw'].includes(n.id);
                                const isWorld = n.type === 'world';
                                return (
                                    <g key={n.id}
                                        onClick={() => handleMBClick(n.id)}
                                        style={{ cursor: clickable ? 'pointer' : 'default' }}
                                    >
                                        {/* Pulsing halo for routers/switches */}
                                        {clickable && !down && (
                                            <circle cx={n.x} cy={n.y} r="20" fill="none"
                                                stroke={col} strokeWidth="0.5"
                                                className="mb-halo"
                                            />
                                        )}

                                        {isWorld ? (
                                            // World/Globe shape
                                            <g>
                                                <circle cx={n.x} cy={n.y} r="20" fill="#050b14" stroke={col} strokeWidth="1.5" filter="url(#nodeGlowMB)" />
                                                <ellipse cx={n.x} cy={n.y} rx="9" ry="20" fill="none" stroke={col} strokeWidth="1" opacity="0.6" />
                                                <ellipse cx={n.x} cy={n.y} rx="20" ry="7" fill="none" stroke={col} strokeWidth="1" opacity="0.6" />
                                                <line x1={n.x} y1={n.y-20} x2={n.x} y2={n.y+20} stroke={col} strokeWidth="1" opacity="0.6" />
                                                <line x1={n.x-20} y1={n.y} x2={n.x+20} y2={n.y} stroke={col} strokeWidth="1" opacity="0.6" />
                                            </g>
                                        ) : (
                                            // Device box
                                            <g>
                                                <rect x={n.x-26} y={n.y-13} width="52" height="26" rx="4"
                                                    fill="rgba(5,11,20,0.85)" stroke={col} strokeWidth={down ? 1 : 1.5}
                                                    filter={down ? 'none' : 'url(#nodeGlowMB)'} />
                                                <rect x={n.x-24} y={n.y-11} width="48" height="22" rx="3"
                                                    fill="none" stroke={col} strokeWidth="0.4" opacity="0.35" />
                                                {/* inner particle stream */}
                                                {!down && (
                                                    <rect x={n.x-18} y={n.y-1} width="36" height="2" rx="1"
                                                        fill={col}
                                                        className="mb-particle"
                                                    />
                                                )}
                                                <circle cx={n.x-17} cy={n.y} r="2.5" fill={col}
                                                    className={down ? undefined : 'node-blink'} />
                                            </g>
                                        )}

                                        {/* Label */}
                                        <text x={n.x} y={n.y - 18} textAnchor="middle" fontSize="9.5"
                                            fill={col} fontWeight="bold"
                                            filter={down ? 'none' : 'url(#glowMB)'}>{n.label}</text>
                                        {/* Sub-label (port) */}
                                        <text x={n.x} y={n.y + 24} textAnchor="middle" fontSize="7"
                                            fill={down ? '#ff4444' : 'rgba(255,255,255,0.45)'}>{n.sub}</text>
                                    </g>
                                );
                            })}

                            {/* === INTERNET label === */}
                            <text x="1080" y="80" textAnchor="middle" fontSize="8" fill="rgba(255,68,68,0.6)" letterSpacing="1">ISP UPLINK</text>
                        </svg>

                        {/* Download Buttons */}
                        <div style={{
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '20px',
                            borderTop: '1px solid var(--border-color)',
                            backgroundColor: 'rgba(5, 11, 20, 0.8)'
                        }}>
                            <a href="/MultiBranchLab.pkt" download style={{
                                padding: '8px 16px',
                                backgroundColor: 'var(--accent-blue-intense)',
                                border: '1px solid var(--accent-blue)',
                                color: 'var(--text-main)',
                                textDecoration: 'none',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>📥 Download Project File (.pkt)</span>
                            </a>
                            <a href="/README-MultiBranch.txt" target="_blank" download style={{
                                padding: '8px 16px',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--accent-blue)',
                                color: 'var(--accent-blue)',
                                textDecoration: 'none',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>📄 Read Documentation</span>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
