import React, { useState, useEffect } from 'react';

const navItems = [
    { id: 'edge-firewall', label: 'EDGE_FW', target: 'top' },
    { id: 'core-router', label: 'CORE_RTR', target: 'core-router' },
    { id: 'network-ops', label: 'NET_OPS', target: 'network-ops' },
    { id: 'data-center', label: 'DATA_CTR', target: 'data-center' },
    { id: 'security-ops', label: 'SEC_OPS', target: 'security-ops' },
    { id: 'command-terminal', label: 'TERMINAL', target: 'command-terminal' }
];

export default function SwitchNavbar() {
    const [activePort, setActivePort] = useState('edge-firewall');
    const [hoveredPort, setHoveredPort] = useState(null);

    // Simple scroll spy to update active port based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 300) {
                setActivePort('edge-firewall');
                return;
            }
            
            for (let i = navItems.length - 1; i >= 0; i--) {
                const item = navItems[i];
                if (item.target === 'top') continue;
                
                const element = document.getElementById(item.target);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200) {
                        setActivePort(item.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (targetId) => {
        if (targetId === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const el = document.getElementById(targetId);
            if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 120; // Offset for sticky nav
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    };

    return (
        <nav style={{
            position: 'sticky',
            top: '20px',
            zIndex: 1000,
            marginBottom: '60px',
            backgroundColor: '#050b14',
            border: '2px solid #1a2333',
            borderLeft: '12px solid #0a1120',
            borderRight: '12px solid #0a1120',
            borderRadius: '4px',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.6)',
            fontFamily: 'var(--font-mono)'
        }}>
            {/* Branding / Model Number */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px' }}>
                    ROBERA-OS-SW1
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '1px' }}>
                    MANAGEMENT INTERFACE
                </div>
            </div>

            {/* Ports Container */}
            <div style={{ display: 'flex', gap: '2px', backgroundColor: '#020408', padding: '10px', borderRadius: '2px', border: '1px solid #111824' }}>
                {navItems.map((item, index) => {
                    const isActive = activePort === item.id;
                    const isHovered = hoveredPort === item.id;
                    const showActivity = isActive || isHovered;

                    return (
                        <div 
                            key={item.id}
                            onMouseEnter={() => setHoveredPort(item.id)}
                            onMouseLeave={() => setHoveredPort(null)}
                            onClick={() => scrollTo(item.target)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                padding: '0 8px',
                                borderRight: index < navItems.length - 1 ? '1px solid #111824' : 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {/* LED Indicators */}
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {/* Link LED */}
                                <div style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    backgroundColor: showActivity ? 'var(--accent-green)' : '#222',
                                    boxShadow: showActivity ? '0 0 8px var(--accent-green)' : 'none',
                                    transition: 'all 0.2s ease'
                                }} />
                                {/* Activity LED (blinks on hover) */}
                                <div style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    backgroundColor: isHovered ? 'var(--accent-green)' : '#222',
                                    boxShadow: isHovered ? '0 0 8px var(--accent-green)' : 'none',
                                    animation: isHovered ? 'blink 0.2s infinite' : 'none'
                                }} />
                            </div>

                            {/* RJ45 Port Visual */}
                            <div style={{
                                width: '24px', height: '24px',
                                backgroundColor: '#000',
                                border: `1px solid ${showActivity ? 'var(--accent-green)' : '#333'}`,
                                borderRadius: '2px',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                {/* Inner Pins */}
                                <div style={{
                                    position: 'absolute', top: 0,
                                    width: '14px', height: '8px',
                                    display: 'flex', gap: '1px',
                                    justifyContent: 'center'
                                }}>
                                    {[1,2,3,4,5,6,7,8].map(pin => (
                                        <div key={pin} style={{ width: '1px', height: '100%', backgroundColor: showActivity ? '#ffd700' : '#555' }} />
                                    ))}
                                </div>
                            </div>

                            {/* Port Label */}
                            <div style={{
                                fontSize: '9px',
                                color: showActivity ? 'var(--text-main)' : 'var(--text-muted)',
                                letterSpacing: '1px',
                                textShadow: showActivity ? '0 0 5px var(--accent-green)' : 'none',
                                fontWeight: showActivity ? 'bold' : 'normal',
                                marginTop: '4px'
                            }}>
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Right side power indicators */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>SYS</div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>PWR</div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }} />
                </div>
            </div>
        </nav>
    );
}
