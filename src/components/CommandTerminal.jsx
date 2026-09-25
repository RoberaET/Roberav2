import React, { useState, useRef, useEffect, useCallback } from 'react';

// ─── Command Tree ────────────────────────────────────────────────────────────
// Each node: { description, children?, action? }
const CMD_TREE = {
    'show': {
        description: 'Show running system information',
        children: {
            'version': {
                description: 'System hardware and software status',
                action: 'show version',
            },
            'running-config': {
                description: 'Current operating configuration',
                action: 'show running-config',
            },
            'startup-config': {
                description: 'Contents of startup configuration',
                action: 'show startup-config',
            },
            'ip': {
                description: 'IP information',
                children: {
                    'interface': {
                        description: 'Interface status and configuration',
                        children: {
                            'brief': {
                                description: 'Brief summary of all interfaces',
                                action: 'show ip interface brief',
                            },
                        },
                    },
                    'route': {
                        description: 'IP routing table',
                        action: 'show ip route',
                    },
                    'bgp': {
                        description: 'BGP information',
                        action: 'show ip bgp',
                    },
                    'ospf': {
                        description: 'OSPF information',
                        action: 'show ip ospf',
                    },
                },
            },
            'interfaces': {
                description: 'Interface status and configuration',
                action: 'show interfaces',
            },
            'cdp': {
                description: 'CDP information',
                children: {
                    'neighbors': {
                        description: 'CDP neighbor entries',
                        action: 'show cdp neighbors',
                    },
                },
            },
            'processes': {
                description: 'Active process statistics',
                children: {
                    'cpu': {
                        description: 'CPU utilization information',
                        action: 'show processes cpu',
                    },
                },
            },
            'crypto': {
                description: 'Encryption module information',
                children: {
                    'isakmp': {
                        description: 'ISAKMP information',
                        children: {
                            'policy': {
                                description: 'ISAKMP protection suite policy',
                                action: 'show crypto isakmp policy',
                            },
                        },
                    },
                },
            },
            'flash': {
                description: 'System flash information',
                action: 'show flash',
            },
            'clock': {
                description: 'Display the system clock',
                action: 'show clock',
            },
            'users': {
                description: 'Display information about terminal lines',
                action: 'show users',
            },
        },
    },
    'ping': {
        description: 'Send ICMP echo messages',
        action: 'ping',
        argHint: '<host>  Hostname or IP address',
    },
    'traceroute': {
        description: 'Trace route to destination',
        action: 'traceroute',
        argHint: '<host>  Hostname or IP address',
    },
    'copy': {
        description: 'Copy from one file to another',
        children: {
            'running-config': {
                description: 'Copy from running config',
                children: {
                    'startup-config': {
                        description: 'Copy to startup config (download CV)',
                        action: 'copy run start',
                    },
                },
            },
        },
    },
    'enable': {
        description: 'Turn on privileged commands',
        action: 'enable',
    },
    'disable': {
        description: 'Turn off privileged commands',
        action: 'disable',
    },
    'exit': {
        description: 'Exit current mode',
        action: 'exit',
    },
    'clear': {
        description: 'Clear terminal screen',
        action: 'clear',
    },
    'reload': {
        description: 'Halt and perform a cold restart',
        action: 'reload',
    },
    'whoami': {
        description: 'Display current user',
        action: 'whoami',
    },
};

// ─── Abbreviation aliases ─────────────────────────────────────────────────────
const ALIASES = {
    'sh': 'show',
    'sh ver': 'show version',
    'sh run': 'show running-config',
    'sh start': 'show startup-config',
    'sh ip int br': 'show ip interface brief',
    'sh ip int brief': 'show ip interface brief',
    'sh ip route': 'show ip route',
    'sh ip bgp': 'show ip bgp',
    'sh ip ospf': 'show ip ospf',
    'sh int': 'show interfaces',
    'sh cdp nei': 'show cdp neighbors',
    'sh cdp neighbors': 'show cdp neighbors',
    'sh proc cpu': 'show processes cpu',
    'sh clock': 'show clock',
    'sh users': 'show users',
    'sh flash': 'show flash',
    'copy run start': 'copy run start',
    'copy running-config startup-config': 'copy run start',
    'en': 'enable',
    'dis': 'disable',
    'wr': 'copy run start',
    'write': 'copy run start',
};

// ─── Actions (output) ─────────────────────────────────────────────────────────
const ACTIONS = {
    'show version': () => [
        { t: 'o', v: 'Cisco IOS Software, ROBERA_OS Software (C9300-UNIVERSALK9-M), Version 17.3.4a' },
        { t: 'o', v: 'RELEASE SOFTWARE (fc3)' },
        { t: 'o', v: 'Technical Support: https://github.com/RoberaET' },
        { t: 'o', v: '' },
        { t: 'o', v: 'ROM: IOS-XE ROMMON' },
        { t: 'o', v: '' },
        { t: 'h', v: 'ROBERA-CORE-RTR uptime is 10 months, 22 days, 14 hours, 53 minutes' },
        { t: 'o', v: 'System returned to ROM by reload' },
        { t: 'o', v: 'System image file is "flash:robera-network-engineer-v3.bin"' },
        { t: 'o', v: 'Last reload reason: <user-initiated reload>' },
        { t: 'o', v: '' },
        { t: 'o', v: 'Cisco C9300-48U (X86) processor (revision V01) with 1622614K/6147K bytes of memory.' },
        { t: 'o', v: 'Processor board ID NETENG-4553' },
        { t: 'o', v: '4 Gigabit Ethernet interfaces' },
        { t: 'o', v: '32768K bytes of non-volatile configuration memory.' },
        { t: 'o', v: '8388608K bytes of physical memory.' },
        { t: 'o', v: '' },
        { t: 'h', v: 'Role: Enterprise Network Engineer / Cybersecurity Enthusiast' },
        { t: 'h', v: 'Location: Addis Ababa, Ethiopia' },
        { t: 'o', v: '' },
        { t: 'o', v: 'Configuration register is 0x102' },
    ],
    'show running-config': () => [
        { t: 'o', v: 'Building configuration...' },
        { t: 'o', v: '' },
        { t: 'o', v: 'Current configuration : 4096 bytes' },
        { t: 'o', v: '!' },
        { t: 'h', v: 'hostname ROBERA-CORE-RTR' },
        { t: 'o', v: '!' },
        { t: 'o', v: 'boot-start-marker' },
        { t: 'o', v: 'boot-end-marker' },
        { t: 'o', v: '!' },
        { t: 'o', v: 'aaa new-model' },
        { t: 'o', v: '!' },
        { t: 'o', v: 'interface GigabitEthernet0/0/0' },
        { t: 'o', v: ' description Email_Interface' },
        { t: 'h', v: ' ip address robera4553@gmail.com' },
        { t: 'o', v: ' negotiation auto' },
        { t: 'o', v: '!' },
        { t: 'o', v: 'interface GigabitEthernet0/0/1' },
        { t: 'o', v: ' description LinkedIn_Interface' },
        { t: 'h', v: ' ip address linkedin.com/in/roberamekonnen' },
        { t: 'o', v: '!' },
        { t: 'o', v: 'interface GigabitEthernet0/0/2' },
        { t: 'o', v: ' description GitHub_Interface' },
        { t: 'h', v: ' ip address github.com/RoberaET' },
        { t: 'o', v: '!' },
        { t: 'o', v: 'router ospf 1' },
        { t: 'o', v: ' network 10.0.0.0 0.255.255.255 area 0' },
        { t: 'o', v: '!' },
        { t: 'o', v: 'crypto isakmp policy 10' },
        { t: 'o', v: ' encr aes 256' },
        { t: 'o', v: ' authentication pre-share' },
        { t: 'o', v: ' group 14' },
        { t: 'o', v: '!' },
        { t: 'o', v: 'line vty 0 4' },
        { t: 'o', v: ' login local' },
        { t: 'o', v: ' transport input ssh' },
        { t: 'o', v: '!' },
        { t: 'o', v: 'end' },
    ],
    'show startup-config': () => [
        { t: 'o', v: 'Using 4096 bytes' },
        { t: 'o', v: '!' },
        { t: 'h', v: 'hostname ROBERA-CORE-RTR' },
        { t: 'o', v: '!' },
        { t: 'o', v: '! Last configuration change at 00:00:01 UTC by robera' },
        { t: 'o', v: '! NVRAM config last updated at 00:00:01 UTC' },
        { t: 'o', v: '!' },
        { t: 'o', v: 'end' },
    ],
    'show ip interface brief': () => [
        { t: 'h', v: 'Interface                  IP-Address            OK? Method Status                Protocol' },
        { t: 'g', v: 'GigabitEthernet0/0/0       robera4553@gmail.com  YES manual up                    up' },
        { t: 'g', v: 'GigabitEthernet0/0/1       linkedin.com/in/...   YES manual up                    up' },
        { t: 'g', v: 'GigabitEthernet0/0/2       github.com/RoberaET   YES manual up                    up' },
        { t: 'e', v: 'Loopback0                  unassigned            YES unset  administratively down down' },
    ],
    'show ip route': () => [
        { t: 'o', v: 'Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP' },
        { t: 'o', v: '       O - OSPF, IA - OSPF inter area, E1/E2 - OSPF external' },
        { t: 'o', v: '' },
        { t: 'o', v: 'Gateway of last resort is BESYS_Technologies to network 0.0.0.0' },
        { t: 'o', v: '' },
        { t: 'h', v: 'O*E2  0.0.0.0/0 [110/1] via BESYS_Technologies, 00:10:22, GigabitEthernet0/0/0' },
        { t: 'o', v: '               (Current Role: Enterprise Network Engineer)' },
        { t: 'o', v: '' },
        { t: 'g', v: 'O     10.0.0.0/8 [110/2] via IE_Network_Solutions, 01:00:00, GigabitEthernet0/0/1' },
        { t: 'o', v: '               (Previous Role: Modern Data Center & Cloud Engineer)' },
        { t: 'o', v: '' },
        { t: 'g', v: 'C     192.168.1.0/24 is directly connected, Personal_Projects' },
        { t: 'o', v: '               (Network Engineering Labs)' },
    ],
    'show ip bgp': () => [
        { t: 'o', v: 'BGP table version is 1, local router ID is 10.0.0.1' },
        { t: 'o', v: 'Status codes: s suppressed, d damped, h history, * valid, > best, i - internal' },
        { t: 'o', v: '' },
        { t: 'h', v: '   Network          Next Hop            Metric  LocPrf  Weight  Path' },
        { t: 'g', v: '*> 0.0.0.0/0        BESYS_Technologies       0             0   i (CCNA-Certified)' },
        { t: 'g', v: '*> 10.0.0.0/8       IE_Network_Solutions     0             0   i (FCAC-Certified)' },
        { t: 'o', v: '*  172.16.0.0/12    Personal_Lab             0             0   i' },
    ],
    'show ip ospf': () => [
        { t: 'o', v: ' Routing Process "ospf 1" with ID 10.0.0.1' },
        { t: 'o', v: ' Start time: 00:00:01.000, Time elapsed: 10m22d14h53m' },
        { t: 'o', v: ' Supports only single TOS(TOS0) routes' },
        { t: 'o', v: ' SPF algorithm executed 3 times' },
        { t: 'h', v: ' Area BACKBONE(0) ActiveInterfaces: GigabitEthernet0/0/0, 0/0/1, 0/0/2' },
    ],
    'show interfaces': () => [
        { t: 'h', v: 'GigabitEthernet0/0/0 is up, line protocol is up' },
        { t: 'o', v: '  Hardware is Ethernet, address is aabb.cc00.0100' },
        { t: 'o', v: '  Description: Email_Interface' },
        { t: 'o', v: '  MTU 1500 bytes, BW 1000000 Kbit, DLY 100 usec' },
        { t: 'g', v: '     5 minute input rate 512000 bits/sec, 64 packets/sec' },
        { t: 'g', v: '     5 minute output rate 512000 bits/sec, 64 packets/sec' },
        { t: 'o', v: '' },
        { t: 'h', v: 'GigabitEthernet0/0/1 is up, line protocol is up' },
        { t: 'o', v: '  Hardware is Ethernet, address is aabb.cc00.0200' },
        { t: 'o', v: '  Description: LinkedIn_Interface' },
        { t: 'o', v: '' },
        { t: 'h', v: 'GigabitEthernet0/0/2 is up, line protocol is up' },
        { t: 'o', v: '  Hardware is Ethernet, address is aabb.cc00.0300' },
        { t: 'o', v: '  Description: GitHub_Interface' },
    ],
    'show cdp neighbors': () => [
        { t: 'o', v: 'Capability Codes: R - Router, T - Trans Bridge, S - Switch, H - Host' },
        { t: 'o', v: '' },
        { t: 'h', v: 'Device ID               Local Intrfce     Holdtme  Capability  Platform   Port ID' },
        { t: 'g', v: 'BESYS_Technologies      Gig 0/0/0         150      R S         C9300      Gig 1/0/1' },
        { t: 'g', v: 'IE_Network_Solutions    Gig 0/0/1         150      R           ISR4321    Ser 0/0/0' },
        { t: 'o', v: 'Microlink_InfoTech      Gig 0/0/2         150      H           Host       Eth 0/1' },
        { t: 'o', v: '' },
        { t: 'o', v: 'Total cdp entries displayed : 3' },
    ],
    'show processes cpu': () => [
        { t: 'h', v: 'CPU utilization for five seconds: 12%/4%; one minute: 8%; five minutes: 6%' },
        { t: 'o', v: '' },
        { t: 'o', v: ' PID  Runtime(ms)  Invoked   uSecs    5Sec   1Min   5Min TTY Process' },
        { t: 'g', v: '   1        2345    11234      208    4.25%  3.12%  2.88%   0 IOS_Main' },
        { t: 'g', v: '   2         820     9812       83    2.10%  1.90%  1.85%   0 Network_Mgr' },
        { t: 'o', v: '   3         340     4200       80    0.80%  0.75%  0.70%   0 BGP_Router' },
        { t: 'o', v: '   4         120     3100       38    0.55%  0.40%  0.35%   0 OSPF_Hello' },
    ],
    'show flash': () => [
        { t: 'o', v: '-#- --length-- -----date/time------ path' },
        { t: 'g', v: '  1    52428800 Jun 22 2026 00:00:00 robera-network-engineer-v3.bin' },
        { t: 'g', v: '  2      948176 Jun 22 2026 00:00:00 ROBERAMEKONNENCV.pdf' },
        { t: 'o', v: '' },
        { t: 'h', v: '8388608 bytes total (7440432 bytes free)' },
    ],
    'show clock': () => {
        const now = new Date();
        return [{ t: 'h', v: `*${now.toTimeString().split(' ')[0]} UTC ${now.toDateString()}` }];
    },
    'show users': () => [
        { t: 'h', v: '    Line       User       Host(s)          Idle       Location' },
        { t: 'g', v: '*   0 con 0    robera     idle             00:00:00   console' },
        { t: 'o', v: '    1 vty 0    visitor    idle             00:02:44   robera.vercel.app' },
    ],
    'show crypto isakmp policy': () => [
        { t: 'o', v: 'Global IKE policy' },
        { t: 'o', v: 'Protection suite of priority 10' },
        { t: 'h', v: '    encryption algorithm:  AES - Advanced Encryption Standard (256 bit keys)' },
        { t: 'o', v: '    hash algorithm:        Secure Hash Standard 2 (SHA256)' },
        { t: 'o', v: '    authentication method: Pre-Shared Key' },
        { t: 'o', v: '    Diffie-Hellman group:  #14 (2048 bit)' },
        { t: 'o', v: '    lifetime:              86400 seconds, no volume limit' },
    ],
    'ping': (args) => {
        const host = args || 'robera.vercel.app';
        return [
            { t: 'o', v: `Type escape sequence to abort.` },
            { t: 'o', v: `Sending 5, 100-byte ICMP Echos to ${host}, timeout is 2 seconds:` },
            { t: 'g', v: '!!!!!' },
            { t: 'h', v: `Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms` },
        ];
    },
    'traceroute': (args) => {
        const host = args || 'robera.vercel.app';
        return [
            { t: 'o', v: `Type escape sequence to abort.` },
            { t: 'o', v: `Tracing the route to ${host}` },
            { t: 'o', v: '' },
            { t: 'o', v: '  1  192.168.1.1    1 msec  1 msec  1 msec' },
            { t: 'o', v: '  2  10.0.0.1       2 msec  2 msec  2 msec' },
            { t: 'g', v: `  3  ${host}   4 msec  3 msec  4 msec` },
        ];
    },
    'enable': () => [
        { t: 'h', v: 'Password: ******** (Authentication successful)' },
        { t: 'g', v: 'Privileged EXEC mode enabled. All commands now available.' },
    ],
    'disable': () => [{ t: 'o', v: 'Returning to User EXEC mode.' }],
    'exit': () => [{ t: 'o', v: 'Connection closed by remote host.' }],
    'reload': () => [
        { t: 'e', v: 'Proceed with reload? [confirm] y' },
        { t: 'o', v: 'System configuration has been modified. Save? [yes/no]: no' },
        { t: 'h', v: 'Reload requested by robera on console.' },
    ],
    'whoami': () => [{ t: 'h', v: 'robera (Network Engineer @ BESYS Technologies)' }],
    'copy run start': () => [
        { t: 'o', v: 'Destination filename [startup-config]? startup-config' },
        { t: 'o', v: 'Building configuration...' },
        { t: 'g', v: '[OK]' },
        { t: 'h', v: '!! Downloading ROBERAMEKONNENCV.pdf from flash...' },
    ],
};

// ─── Tab-complete / ? helper ─────────────────────────────────────────────────
function getCompletions(inputStr) {
    const tokens = inputStr.trimStart().split(' ').filter((t, i, arr) => t !== '' || i === arr.length - 1);
    let node = CMD_TREE;
    let depth = 0;

    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        const isLast = i === tokens.length - 1;

        if (isLast) {
            // partial match at this level
            return Object.entries(node)
                .filter(([k]) => k.startsWith(tok))
                .map(([k, v]) => ({ word: k, description: v.description }));
        }

        // exact match → go deeper
        if (node[tok]) {
            if (node[tok].children) {
                node = node[tok].children;
                depth++;
            } else {
                // leaf with action — no more children
                return [];
            }
        } else {
            // no match
            return null;
        }
    }
    // empty input at this level
    return Object.entries(node).map(([k, v]) => ({ word: k, description: v.description }));
}

function resolveAction(inputStr) {
    // Check aliases first
    const lower = inputStr.trim().toLowerCase();
    const aliased = ALIASES[lower] || lower;

    // Check if it's ping/traceroute with an argument
    if (aliased.startsWith('ping ')) {
        return { action: 'ping', args: aliased.slice(5).trim() };
    }
    if (aliased.startsWith('traceroute ')) {
        return { action: 'traceroute', args: aliased.slice(11).trim() };
    }
    if (aliased === 'ping') return { action: 'ping', args: null };
    if (aliased === 'traceroute') return { action: 'traceroute', args: null };

    if (ACTIONS[aliased]) return { action: aliased, args: null };
    return null;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CommandTerminal({ onCyberRange }) {
    const PROMPT = 'ROBERA-CORE-RTR#';
    const [history, setHistory] = useState([
        { t: 'sys', v: 'Cisco IOS Software, ROBERA_OS Software (C9300-UNIVERSALK9-M), Version 17.3.4a' },
        { t: 'sys', v: 'Copyright (c) 1986-2026 by Robera Mekonnen. All rights reserved.' },
        { t: 'sys', v: '' },
        { t: 'sys', v: 'Type "?" for available commands. Use Tab to autocomplete.' },
    ]);
    const [input, setInput] = useState('');
    const [cmdHistory, setCmdHistory] = useState([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [hint, setHint] = useState(null); // inline tab hint

    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const push = useCallback((lines) => {
        setHistory(prev => [...prev, ...lines]);
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history, hint]);

    const colorForType = (t) => {
        if (t === 'g') return '#2EFF7A';
        if (t === 'h') return 'var(--text-main)';
        if (t === 'e') return '#ff4d4f';
        if (t === 'sys') return '#3B9DFF';
        if (t === 'cmd') return '#2EFF7A';
        if (t === 'help') return '#a78bfa';
        return 'rgba(180,200,220,0.75)';
    };

    const handleKeyDown = (e) => {
        // ── Arrow Up: history back ──
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length === 0) return;
            const newIdx = histIdx === -1 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
            setHistIdx(newIdx);
            setInput(cmdHistory[newIdx]);
            setHint(null);
            return;
        }
        // ── Arrow Down: history forward ──
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIdx === -1) return;
            const newIdx = histIdx + 1;
            if (newIdx >= cmdHistory.length) {
                setHistIdx(-1);
                setInput('');
            } else {
                setHistIdx(newIdx);
                setInput(cmdHistory[newIdx]);
            }
            setHint(null);
            return;
        }

        // ── Ctrl+C: cancel ──
        if (e.ctrlKey && e.key === 'c') {
            push([{ t: 'cmd', v: `${PROMPT} ${input}` }, { t: 'e', v: '^C' }]);
            setInput('');
            setHint(null);
            return;
        }

        // ── Ctrl+L: clear ──
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            setHistory([]);
            setHint(null);
            return;
        }

        // ── Tab: autocomplete ──
        if (e.key === 'Tab') {
            e.preventDefault();
            const completions = getCompletions(input);
            if (!completions || completions.length === 0) {
                push([
                    { t: 'cmd', v: `${PROMPT} ${input}` },
                    { t: 'e', v: '% Unrecognized command' },
                ]);
                return;
            }
            if (completions.length === 1) {
                // complete the word
                const tokens = input.trimStart().split(' ');
                tokens[tokens.length - 1] = completions[0].word;
                const completed = tokens.join(' ') + ' ';
                setInput(completed);
                setHint(null);
            } else {
                // show ambiguous completions
                push([
                    { t: 'cmd', v: `${PROMPT} ${input}` },
                    ...completions.map(c => ({
                        t: 'help',
                        v: `  ${c.word.padEnd(24)} ${c.description}`,
                    })),
                ]);
            }
            return;
        }

        // ── ?: context-sensitive help ──
        if (e.key === '?' && !e.ctrlKey) {
            e.preventDefault();
            const base = input.trim();
            const completions = getCompletions(base + ' ');
            const cmdLines = [{ t: 'cmd', v: `${PROMPT} ${input}?` }];

            if (!completions || completions.length === 0) {
                // check if current input resolves to a leaf with argHint
                const tokens = base.split(' ');
                let node = CMD_TREE;
                let found = null;
                for (const tok of tokens) {
                    if (node[tok]) { found = node[tok]; node = node[tok].children || {}; }
                    else { found = null; break; }
                }
                if (found && found.argHint) {
                    cmdLines.push({ t: 'help', v: `  ${found.argHint}` });
                    cmdLines.push({ t: 'help', v: '  <cr>' });
                } else {
                    cmdLines.push({ t: 'help', v: '  <cr>' });
                }
            } else {
                completions.forEach(c => {
                    cmdLines.push({ t: 'help', v: `  ${c.word.padEnd(24)} ${c.description}` });
                });
            }
            push(cmdLines);
            return;
        }

        // ── Enter: execute ──
        if (e.key === 'Enter') {
            setHint(null);
            const raw = input.trim();
            push([{ t: 'cmd', v: `${PROMPT} ${input}` }]);
            setInput('');
            setHistIdx(-1);
            if (!raw) return;

            // Save to cmd history
            setCmdHistory(prev => {
                const next = [...prev.filter(c => c !== raw), raw];
                return next.slice(-50);
            });

            const lower = raw.toLowerCase();

            if (lower === 'clear') { setHistory([]); return; }

            if (lower === 'sudo su' || lower === 'sudo su -') {
                push([
                    { t: 'e', v: '[WARNING]: Elevating privileges...' },
                    { t: 'g', v: 'Access Granted. Initializing CYBER RANGE MODE.' },
                ]);
                setTimeout(() => onCyberRange?.(), 600);
                return;
            }

            const resolved = resolveAction(raw);
            if (resolved) {
                const { action, args } = resolved;
                const result = typeof ACTIONS[action] === 'function' ? ACTIONS[action](args) : [];
                push(result);

                if (action === 'copy run start') {
                    setTimeout(() => window.open('/ROBERAMEKONNENCV.pdf', '_blank'), 800);
                }
                return;
            }

            // Unknown command — IOS style error
            push([
                { t: 'e', v: `% Ambiguous command:  "${raw}"` },
            ]);
        }
    };

    return (
        <section style={{ marginBottom: '80px', fontFamily: 'var(--font-mono)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{
                    width: '12px', height: '12px',
                    backgroundColor: 'var(--accent-blue)',
                    boxShadow: '0 0 10px var(--accent-blue-glow)'
                }} />
                <h2 style={{ fontSize: '20px', letterSpacing: '2px', color: 'var(--text-main)', margin: 0 }}>
                    [ COMMAND_TERMINAL ]
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                    // IOS_CLI_EMULATOR
                </div>
            </div>

            <div
                ref={containerRef}
                onClick={() => inputRef.current?.focus()}
                style={{
                    backgroundColor: '#03060a',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    padding: '20px',
                    height: '420px',
                    overflowY: 'auto',
                    position: 'relative',
                    cursor: 'text',
                    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9)',
                }}
            >
                {history.map((entry, i) => (
                    <div key={i} style={{
                        color: colorForType(entry.t),
                        marginBottom: '3px',
                        fontSize: '13.5px',
                        lineHeight: '1.55',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        fontWeight: entry.t === 'h' ? '600' : '400',
                    }}>
                        {entry.v}
                    </div>
                ))}

                {/* Active input line */}
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '13.5px', marginTop: '4px' }}>
                    <span style={{ color: '#2EFF7A', marginRight: '8px', whiteSpace: 'nowrap' }}>{PROMPT}</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => { setInput(e.target.value); setHint(null); }}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--text-main)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13.5px',
                            outline: 'none',
                            caretColor: '#2EFF7A',
                        }}
                    />
                </div>
            </div>

            {/* Keyboard shortcut hints */}
            <div style={{
                display: 'flex', gap: '20px', marginTop: '10px',
                fontSize: '11px', color: 'var(--text-muted)',
            }}>
                {[
                    ['Tab', 'autocomplete'],
                    ['?', 'context help'],
                    ['↑↓', 'command history'],
                    ['Ctrl+C', 'cancel'],
                    ['Ctrl+L', 'clear screen'],
                ].map(([key, desc]) => (
                    <span key={key}>
                        <span style={{
                            border: '1px solid #1a2333',
                            borderRadius: '3px',
                            padding: '1px 6px',
                            color: '#3B9DFF',
                            marginRight: '4px',
                        }}>{key}</span>
                        {desc}
                    </span>
                ))}
            </div>
        </section>
    );
}
