import React, { useState, useRef, useEffect } from 'react';

export default function CommandTerminal({ onCyberRange }) {
    const [history, setHistory] = useState([
        { type: 'system', text: 'Cisco IOS Software, ROBERA_OS Software. Type "?" for a list of commands.' }
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const commands = {
        'help': [
            'Exec commands:',
            '  show version           - System hardware and software status',
            '  show running-config    - Current operating configuration',
            '  show ip interface brief- Interface status and contact links',
            '  show ip route          - Routing table and career paths',
            '  show cdp neighbors     - Connected topology neighbors',
            '  copy run start         - Save config (Download CV)',
            '  ping                   - Send ICMP echo requests',
            '  clear                  - Clear terminal screen'
        ],
        '?': [
            'Exec commands:',
            '  show version           - System hardware and software status',
            '  show running-config    - Current operating configuration',
            '  show ip interface brief- Interface status and contact links',
            '  show ip route          - Routing table and career paths',
            '  show cdp neighbors     - Connected topology neighbors',
            '  copy run start         - Save config (Download CV)',
            '  ping                   - Send ICMP echo requests',
            '  clear                  - Clear terminal screen'
        ],
        'show version': [
            'Cisco IOS Software, ROBERA_OS Software (C9300-UNIVERSALK9-M), Version 17.3.4',
            'System image file is "flash:robera-network-engineer-v2.bin"',
            'Uptime is 10 months, 22 days, 12 hours',
            'Processor board ID NETENG-4553',
            'Role: Enterprise Network Engineer / Cyber Security Enthusiast',
            'Location: Addis Ababa, Ethiopia'
        ],
        'show running-config': [
            'Building configuration...',
            'Current configuration : 4096 bytes',
            '!',
            'hostname ROBERA-CORE-RTR',
            '!',
            'interface Vlan1',
            ' description CORE_ROUTING_AND_SWITCHING',
            '!',
            'router ospf 1',
            ' network 10.0.0.0 0.255.255.255 area 0',
            '!',
            'crypto isakmp policy 10',
            ' authentication pre-share',
            ' description VPN_AND_NETWORK_SECURITY',
            '!',
            'access-list 100 permit tcp any any eq 443',
            '!',
            'line vty 0 4',
            ' description AUTOMATION_AND_PYTHON',
            '!',
            'end'
        ],
        'show ip interface brief': [
            'Interface                  IP-Address      OK? Method Status                Protocol',
            'GigabitEthernet0/0/0       Email           YES manual up                    up      (Robera4553@gmail.com)',
            'GigabitEthernet0/0/1       LinkedIn        YES manual up                    up      (linkedin.com/in/roberamekonnen)',
            'GigabitEthernet0/0/2       GitHub          YES manual up                    up      (github.com/RoberaET)',
            'Loopback0                  Phone           YES manual administratively down down    (Classified)'
        ],
        'show ip route': [
            'Gateway of last resort is BESYS_Technologies to network 0.0.0.0',
            '',
            'O*E2 0.0.0.0/0 [110/1] via BESYS_Technologies, 00:10:22, GigabitEthernet0/0/0',
            '                   (Enterprise Network Engineer)',
            'O    10.0.0.0/8 [110/2] via IE_Network_Solutions, 01:00:00, GigabitEthernet0/0/1',
            '                   (Modern Data Center & Cloud Engineer)',
            'C    192.168.1.0/24 is directly connected, Personal_Projects',
            '                   (Network Engineering Labs)'
        ],
        'show cdp neighbors': [
            'Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge',
            '                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone',
            '',
            'Device ID               Local Intrfce     Holdtme    Capability  Platform  Port ID',
            'Campus_Redundant_Core   Gig 0/0/0         120        R S I       C9300     Gig 1/0/1',
            'Multi_Branch_Enterprise Ser 0/0/0         120        R           ISR4321   Ser 0/0/0'
        ],
        'ping': [
            'Type escape sequence to abort.',
            'Sending 5, 100-byte ICMP Echos to robera.net, timeout is 2 seconds:',
            '!!!!!',
            'Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms',
            'Contact initiated!'
        ],
        'copy run start': [
            'Destination filename [startup-config]? ROBERAMEKONNENCV.pdf',
            'Building configuration...',
            '[OK]',
            'Downloading file...'
        ]
    };

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            let cmd = input.trim().toLowerCase();
            const newHistory = [...history, { type: 'input', text: `ROBERA-CORE-RTR# ${input}` }];
            
            // Aliases
            if (cmd === 'show run') cmd = 'show running-config';
            if (cmd === 'show ip int brief' || cmd === 'show int ip brief') cmd = 'show ip interface brief';
            if (cmd === 'copy running-config startup-config') cmd = 'copy run start';
            if (cmd === 'show cdp nei') cmd = 'show cdp neighbors';
            if (cmd.startsWith('ping ')) cmd = 'ping';
            
            if (cmd === 'clear') {
                setHistory([]);
            } else if (cmd === 'sudo su') {
                newHistory.push({ type: 'system', text: '[WARNING]: Elevating privileges...' });
                newHistory.push({ type: 'system', text: 'Access Granted. Initializing CYBER RANGE MODE.' });
                setHistory(newHistory);
                onCyberRange();
            } else if (commands[cmd]) {
                commands[cmd].forEach(line => {
                    newHistory.push({ type: 'output', text: line });
                });
                setHistory(newHistory);
                
                // If it's a redirect command, scroll to that section
                if (cmd === 'show cdp neighbors') {
                    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
                } else if (cmd === 'copy run start') {
                    setTimeout(() => {
                        window.open('/ROBERAMEKONNENCV.pdf', '_blank');
                    }, 1000);
                }
            } else if (cmd !== '') {
                newHistory.push({ type: 'error', text: `% Invalid input detected at '^' marker.` });
                setHistory(newHistory);
            }
            
            setInput('');
        }
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history]);

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
                    [ COMMAND_TERMINAL ]
                </h2>
            </div>

            <div 
                ref={containerRef}
                onClick={() => inputRef.current?.focus()}
                style={{
                    backgroundColor: '#03060a',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    padding: '20px',
                    height: '350px',
                    overflowY: 'auto',
                    position: 'relative',
                    cursor: 'text',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
                }}
            >
                {history.map((entry, i) => (
                    <div key={i} style={{ 
                        color: entry.type === 'error' ? '#ff4d4f' : entry.type === 'input' ? 'var(--accent-green)' : 'var(--text-main)',
                        marginBottom: '8px',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all'
                    }}>
                        {entry.text}
                    </div>
                ))}
                
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                    <span style={{ color: 'var(--accent-green)', marginRight: '10px' }}>ROBERA-CORE-RTR#</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        autoComplete="off"
                        spellCheck="false"
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--text-main)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
