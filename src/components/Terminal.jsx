import React, { useState, useEffect, useRef } from 'react'

const FILE_SYSTEM = {
    '/': {
        type: 'dir',
        children: {
            'bin': {
                type: 'dir',
                children: {
                    'bash': { type: 'file', content: 'ELF 64-bit LSB executable, x86-64' },
                    'ls': { type: 'file', content: 'ELF 64-bit LSB executable, x86-64' },
                    'cat': { type: 'file', content: 'ELF 64-bit LSB executable, x86-64' },
                    'cp': { type: 'file', content: 'ELF 64-bit LSB executable, x86-64' },
                    'mv': { type: 'file', content: 'ELF 64-bit LSB executable, x86-64' },
                    'rm': { type: 'file', content: 'ELF 64-bit LSB executable, x86-64' },
                    'grep': { type: 'file', content: 'ELF 64-bit LSB executable, x86-64' },
                    'ping': { type: 'file', content: 'ELF 64-bit LSB executable, x86-64' },
                    'nano': { type: 'file', content: 'ELF 64-bit LSB executable, x86-64' }
                }
            },
            'boot': {
                type: 'dir',
                children: {
                    'vmlinuz-5.15.0-current': { type: 'file', content: 'Linux Kernel Image' },
                    'grub': { type: 'dir', children: {} },
                    'initrd.img': { type: 'file', content: 'Initial RAM disk' }
                }
            },
            'dev': {
                type: 'dir',
                children: {
                    'null': { type: 'file', content: 'Character special device' },
                    'zero': { type: 'file', content: 'Character special device' },
                    'random': { type: 'file', content: 'Character special device' },
                    'sda': { type: 'file', content: 'Block special device' },
                    'tty1': { type: 'file', content: 'Character special device' }
                }
            },
            'etc': {
                type: 'dir',
                children: {
                    'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\nguest:x:1000:1000:guest:/home/guest:/bin/bash' },
                    'shadow': { type: 'file', content: 'Permission denied' },
                    'hostname': { type: 'file', content: 'robera-portfolio' },
                    'hosts': { type: 'file', content: '127.0.0.1 localhost\n127.0.1.1 robera-portfolio' },
                    'resolv.conf': { type: 'file', content: 'nameserver 8.8.8.8\nnameserver 1.1.1.1' },
                    'sudoers': { type: 'file', content: 'root ALL=(ALL:ALL) ALL' }
                }
            },
            'home': { type: 'dir', children: { 'guest': { type: 'dir', children: {} } } },
            'lib': { type: 'dir', children: { 'modules': { type: 'dir', children: {} } } },
            'media': { type: 'dir', children: {} },
            'mnt': { type: 'dir', children: {} },
            'opt': { type: 'dir', children: {} },
            'proc': {
                type: 'dir',
                children: {
                    'cpuinfo': { type: 'file', content: 'model name	: AMD Ryzen 9 5950X 16-Core Processor' },
                    'meminfo': { type: 'file', content: 'MemTotal:       32840624 kB' },
                    'version': { type: 'file', content: 'Linux version 5.15.0-generic' }
                }
            },
            'root': {
                type: 'dir',
                children: {
                    'projects': {
                        type: 'dir',
                        children: {
                            'cloud-mesh': { type: 'file', content: 'Distributed cloud network architecture using mesh topology.' },
                            'fiber-core': { type: 'file', content: 'High-speed fiber optic backbone implementation.' },
                            'secure-gateway': { type: 'file', content: 'Enterprise-grade security gateway with zero-trust architecture.' }
                        }
                    },
                    'skills': {
                        type: 'dir',
                        children: {
                            'python_automation': { type: 'dir', children: {} },
                            'bgp_routing_ops': { type: 'dir', children: {} },
                            'aws_cloud_net': { type: 'dir', children: {} },
                            'security_firewalls': { type: 'dir', children: {} },
                            'infrastructure.tf': { type: 'file', size: 1024, content: 'Terraform configuration...' }
                        }
                    },
                    'about.txt': { type: 'file', content: 'Robera Mekonnen - Network Architect.\nSpecializing in high-availability systems and secure infrastructure.' },
                    'contact.txt': { type: 'file', content: 'Email: robera4553@gmail.com\nGitHub: github.com/RoberaET' },
                    'skills.txt': { type: 'file', content: '- Network Design\n- Cloud Infrastructure\n- Cybersecurity\n- System Administration' }
                }
            },
            'run': { type: 'dir', children: {} },
            'sbin': { type: 'dir', children: { 'iptables': { type: 'file', content: 'Executable' }, 'reboot': { type: 'file', content: 'Executable' } } },
            'srv': { type: 'dir', children: {} },
            'sys': { type: 'dir', children: {} },
            'tmp': { type: 'dir', children: { 'sess_0x8382': { type: 'file', content: 'Session file' } } },
            'usr': { type: 'dir', children: { 'bin': { type: 'dir', children: {} }, 'local': { type: 'dir', children: {} } } },
            'var': {
                type: 'dir',
                children: {
                    'log': {
                        type: 'dir',
                        children: {
                            'syslog': { type: 'file', content: 'Jan 10 10:00:01 robera CRON[123]: (root) CMD (backup.sh)' },
                            'auth.log': { type: 'file', content: 'Jan 10 09:12:44 robera sshd[456]: Accepted publickey for root' }
                        }
                    },
                    'www': { type: 'dir', children: {} }
                }
            }
        }
    }
}

function Terminal() {
    const [history, setHistory] = useState([])
    const [input, setInput] = useState('')
    const [currentPath, setCurrentPath] = useState('/root')
    const [isBooting, setIsBooting] = useState(true)
    const [runningProcess, setRunningProcess] = useState(null)
    const inputRef = useRef(null)
    const bottomRef = useRef(null)
    const processRef = useRef(null)

    // Command list for autocomplete
    const COMMANDS = ['help', 'ls', 'cd', 'cat', 'clear', 'whoami', 'date', 'pwd', 'ping', 'uname', 'rm']

    // Boot sequence
    useEffect(() => {
        const finishBoot = setTimeout(() => {
            setIsBooting(false)
            setHistory([{
                type: 'output',
                content: '// Welcome user. Type \'help\' to execute system protocols...',
                className: 'text-gray-500 italic'
            }])
            inputRef.current?.focus()
        }, 500)

        return () => clearTimeout(finishBoot)
    }, [])

    useEffect(() => {
        if (bottomRef.current && bottomRef.current.parentElement) {
            bottomRef.current.parentElement.scrollTop = bottomRef.current.parentElement.scrollHeight
        }
    }, [history])

    // Process handling (Ctrl+C support)
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'c') {
                if (processRef.current) {
                    clearInterval(processRef.current)
                    processRef.current = null
                    setRunningProcess(null)
                    setHistory(prev => [...prev, { type: 'output', content: '^C' }])
                }
            }
        }

        window.addEventListener('keydown', handleGlobalKeyDown)
        return () => window.removeEventListener('keydown', handleGlobalKeyDown)
    }, [])

    const getDirFromPath = (pathStr) => {
        if (!pathStr) return null
        if (pathStr === '/') return FILE_SYSTEM['/']

        // Remove trailing slash if present unless it's just "/"
        const cleanPath = pathStr.length > 1 && pathStr.endsWith('/') ? pathStr.slice(0, -1) : pathStr

        const parts = cleanPath.split('/').filter(p => p)
        let current = FILE_SYSTEM['/']

        for (const part of parts) {
            if (current.children && current.children[part] && current.children[part].type === 'dir') {
                current = current.children[part]
            } else {
                return null
            }
        }
        return current
    }

    const resolveAbsolutePath = (pathStr) => {
        if (!pathStr) return currentPath

        if (pathStr.startsWith('~')) {
            return pathStr.replace('~', '/root')
        }

        if (pathStr.startsWith('/')) {
            return pathStr
        }

        // Relative path
        const base = currentPath === '/' ? '' : currentPath
        return `${base}/${pathStr}`.replace('//', '/')
    }

    const canonicalizePath = (pathStr) => {
        if (!pathStr) return currentPath

        // Handle .. and .
        const parts = pathStr.split('/').filter(p => p && p !== '.')
        const stack = []

        for (const part of parts) {
            if (part === '..') {
                stack.pop()
            } else {
                stack.push(part)
            }
        }

        const result = '/' + stack.join('/')
        return result || '/'
    }

    const runPing = (args) => {
        const host = args[0] || '8.8.8.8'
        setRunningProcess('ping')

        setHistory(prev => [...prev, { type: 'output', content: `PING ${host} (${host}) 56(84) bytes of data.` }])

        let seq = 1
        const interval = setInterval(() => {
            const time = (Math.random() * 10 + 10).toFixed(1)
            const ttl = 117
            setHistory(prev => [...prev, { type: 'output', content: `64 bytes from ${host}: icmp_seq=${seq++} ttl=${ttl} time=${time} ms` }])
        }, 1000)

        processRef.current = interval
    }

    const handleCommand = (cmd) => {
        const trimmedCmd = cmd.trim()
        if (!trimmedCmd) {
            setHistory(prev => [...prev, { type: 'command', content: '' }])
            return
        }

        const [command, ...args] = trimmedCmd.split(' ')
        const newHistory = [...history, { type: 'command', content: trimmedCmd }]
        setHistory(newHistory)

        switch (command.toLowerCase()) {
            case 'help':
                setHistory(prev => [...prev, {
                    type: 'output',
                    html: true,
                    content: `
                        <div style="color: #c9d1d9; font-family: 'JetBrains Mono', monospace;">
                            <div style="margin-bottom: 8px;">Available Commands:</div>
                            <div style="display: grid; grid-template-columns: 1fr; gap: 4px;">
                                <div><span style="color: #3b9eff;">$ echo $NAME</span> &nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #8b949e;">// Identify User</span></div>
                                <div><span style="color: #3b9eff;">$ echo $ROLE</span> &nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #8b949e;">// Display System Role</span></div>
                                <div><span style="color: #3b9eff;">$ uptime</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #8b949e;">// System Status</span></div>
                                <div><span style="color: #3b9eff;">$ ls -la skills/</span> &nbsp; <span style="color: #8b949e;">// List Capabilities</span></div>
                                <div><span style="color: #3b9eff;">$ whoami</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #8b949e;">// Identify Current Session</span></div>
                            </div>
                        </div>
                    `
                }])
                break
            case 'echo':
                const varName = args[0]
                if (varName === '$NAME') {
                    setHistory(prev => [...prev, { type: 'output', content: 'Robera Mekonnen' }])
                } else if (varName === '$ROLE') {
                    setHistory(prev => [...prev, { type: 'output', content: 'Network Engineer | Cisco Certified (CCNA/CCNP)' }])
                } else {
                    setHistory(prev => [...prev, { type: 'output', content: args.join(' ') }])
                }
                break
            case 'uptime':
                setHistory(prev => [...prev, {
                    type: 'output',
                    html: true,
                    content: `
                        <div style="background: rgba(13, 17, 23, 0.5); padding: 12px; border-radius: 6px; border: 1px solid rgba(59, 158, 255, 0.1); color: #c9d1d9;">
                            <div>up 5 years, 4 months, 12 days</div>
                            <div style="margin-top: 4px;">load average: 0.85, 0.92, 0.88</div>
                            <div style="margin-top: 4px;">status: <span style="color: #3fb950;">OPTIMIZED</span></div>
                        </div>
                    `
                }])
                break
            case 'clear':
                setHistory([])
                return
            case 'uname':
                setHistory(prev => [...prev, { type: 'output', content: 'Linux robera-portfolio 5.15.0-generic #42-Ubuntu SMP Fri Nov 14 2025 x86_64 x86_64 x86_64 GNU/Linux' }])
                break
            case 'ls': {
                const cleanArgs = args.filter(arg => !arg.startsWith('-'))
                const targetPath = cleanArgs[0]
                    ? canonicalizePath(resolveAbsolutePath(cleanArgs[0]))
                    : currentPath

                const dir = getDirFromPath(targetPath)

                if (!dir) {
                    setHistory(prev => [...prev, { type: 'error', content: `ls: cannot access '${cleanArgs[0]}': No such file or directory` }])
                    break
                }

                if (dir.children) {
                    const items = Object.keys(dir.children).map(name => {
                        const isDir = dir.children[name].type === 'dir'
                        const isFile = !isDir

                        // LS listing style matching screenshot if arguments contain -l or -la
                        if (args.includes('-la') || args.includes('-l')) {
                            if (isDir) {
                                return `<div style="color: #d16d9e;">drwxr-xr-x ${name}</div>` // Pink/Purple for dirs
                            } else {
                                return `<div style="color: #3b9eff;">-rw-r--r-- ${name}</div>` // Blue for files
                            }
                        }

                        return `<span class="${isDir ? 'text-blue-400 font-bold' : 'text-green-400'}">${name}${isDir ? '/' : ''}</span>`
                    }).join(args.includes('-la') || args.includes('-l') ? '' : '  ')

                    setHistory(prev => [...prev, { type: 'output', content: items, html: true }])
                }
                break
            }
            case 'cd': {
                const target = args[0]
                let newPath = ''

                if (!target || target === '~') {
                    newPath = '/root'
                } else if (target === '-') {
                    // Previous path not implemented, go home
                    newPath = '/root'
                } else {
                    const absPath = resolveAbsolutePath(target)
                    newPath = canonicalizePath(absPath)
                }

                const dir = getDirFromPath(newPath)
                if (dir && dir.type === 'dir') {
                    setCurrentPath(newPath)
                } else {
                    setHistory(prev => [...prev, { type: 'error', content: `cd: ${target}: No such file or directory` }])
                }
                break
            }
            case 'rm': {
                if (args.includes('-rf') || args.includes('-fr')) {
                    setHistory(prev => [...prev, { type: 'output', content: 'Nice try! But you didn\'t say the magic word... just kidding, it\'s simulated! 😉' }])
                } else {
                    setHistory(prev => [...prev, { type: 'error', content: 'rm: permission denied' }])
                }
                break
            }
            case 'cat': {
                const file = args[0]
                if (!file) {
                    setHistory(prev => [...prev, { type: 'error', content: 'cat: missing filename' }])
                    break
                }

                const absPath = resolveAbsolutePath(file)
                const canonicalPath = canonicalizePath(absPath)

                // Split path to find file in directory
                const lastSlash = canonicalPath.lastIndexOf('/')
                const dirPath = canonicalPath.substring(0, lastSlash) || '/'
                const fileName = canonicalPath.substring(lastSlash + 1)

                const dir = getDirFromPath(dirPath)

                if (dir && dir.children && dir.children[fileName] && dir.children[fileName].type === 'file') {
                    setHistory(prev => [...prev, { type: 'output', content: dir.children[fileName].content }])
                } else {
                    setHistory(prev => [...prev, { type: 'error', content: `cat: ${file}: No such file` }])
                }
                break
            }
            case 'whoami':
                setHistory(prev => [...prev, { type: 'output', content: 'root' }])
                break
            case 'pwd':
                setHistory(prev => [...prev, { type: 'output', content: currentPath }])
                break
            case 'date':
                setHistory(prev => [...prev, { type: 'output', content: new Date().toString() }])
                break
            case 'ping':
                runPing(args)
                break
            default:
                setHistory(prev => [...prev, { type: 'error', content: `${command}: command not found` }])
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault()
            const parts = input.trim().split(' ')

            if (parts.length === 1) {
                // Command autocomplete
                const partialCmd = parts[0].toLowerCase()
                const matches = COMMANDS.filter(cmd => cmd.startsWith(partialCmd))

                if (matches.length === 1) {
                    setInput(matches[0] + ' ')
                }
            } else if (parts.length > 1) {
                // File/Directory autocomplete
                const partialPath = parts[parts.length - 1]
                const cmdPrefix = parts.slice(0, -1).join(' ')

                // Resolve directory to search in
                let searchPath = currentPath
                let partialFile = partialPath

                if (partialPath.includes('/')) {
                    const lastSlash = partialPath.lastIndexOf('/')
                    const dirPart = partialPath.substring(0, lastSlash)
                    partialFile = partialPath.substring(lastSlash + 1)
                    searchPath = canonicalizePath(resolveAbsolutePath(dirPart))
                }

                const dir = getDirFromPath(searchPath)
                if (dir && dir.children) {
                    const matches = Object.keys(dir.children).filter(name => name.startsWith(partialFile))

                    if (matches.length === 1) {
                        const match = matches[0]
                        const isDir = dir.children[match].type === 'dir'

                        // Construct new input
                        let completion = match
                        if (partialPath.includes('/')) {
                            const lastSlash = partialPath.lastIndexOf('/')
                            completion = partialPath.substring(0, lastSlash + 1) + match
                        }

                        if (isDir) completion += '/'

                        setInput(cmdPrefix + ' ' + completion)
                    }
                }
            }
            return
        }

        if (e.key === 'Enter') {
            if (runningProcess) return // Don't accept input while running a process
            handleCommand(input)
            setInput('')
        }
    }

    return (
        <div
            className="terminal"
            onClick={() => !runningProcess && inputRef.current?.focus()}
        >
            <div className="terminal-header">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
            </div>
            <div className="terminal-content">
                {history.map((line, i) => (
                    <div key={i} className={`terminal-line ${line.type === 'error' ? 'error' : ''} ${line.type === 'command' ? 'command-line' : ''}`}>
                        {line.type === 'command' && <span className="prompt">root@robera:{currentPath === '/root' ? '~' : currentPath}# </span>}
                        {line.html ? (
                            <span dangerouslySetInnerHTML={{ __html: line.content }} />
                        ) : (
                            <span className={line.type === 'command' ? 'command-text' : 'output-text'}>{line.content}</span>
                        )}
                    </div>
                ))}
                {!isBooting && !runningProcess && (
                    <div className="terminal-line input-line">
                        <span className="prompt">root@robera:{currentPath === '/root' ? '~' : currentPath}# </span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="terminal-input"
                            spellCheck="false"
                            autoComplete="off"
                        />
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    )
}

export default Terminal
