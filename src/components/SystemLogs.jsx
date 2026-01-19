import React, { useState, useEffect, useRef } from 'react'

const INITIAL_LOGS = [
    { time: '2025-01-10 14:30:22', level: 'SUCCESS', color: '#3fb950', message: 'Certification: CCNA obtained from Cisco Networking Academy' },
    { time: '2025-01-08 09:15:41', level: 'DEPLOY', color: '#3b9eff', message: 'Project: Cloud Mesh Architecture v2.1 deployed to production' },
    { time: '2024-12-28 16:42:11', level: 'SUCCESS', color: '#3fb950', message: 'Certification: Fortinet Certified Associate (FCAC) completed' },
    { time: '2024-12-15 11:20:33', level: 'INFO', color: '#8b949e', message: 'Besys Tech: Network infrastructure audit completed successfully' },
    { time: '2024-11-30 13:55:09', level: 'DEPLOY', color: '#3b9eff', message: 'Project: Zero Trust Gateway implemented for enterprise client' },
    { time: '2024-11-20 10:12:47', level: 'SUCCESS', color: '#3fb950', message: 'Microlink: B.Sc. Computer Engineering - Final Project Approved' },
    { time: '2024-10-15 08:33:22', level: 'INFO', color: '#8b949e', message: 'AAU: Management final exam scheduled' },
    { time: '2024-09-28 15:41:55', level: 'DEPLOY', color: '#3b9eff', message: 'Leonor Trading: Logistics system optimization complete' }
]

const LOG_TEMPLATES = [
    { level: 'INFO', color: '#8b949e', messages: ['Configuring Besys router...', 'Reviewing Leonor logistics data...', 'Microlink assignment submitted.', 'Optimizing QoS at Besys...', 'Analyzing Packet Whisperer logs...', 'Reading Cisco documentation...'] },
    { level: 'SUCCESS', color: '#3fb950', messages: ['CCNA: Validation Complete.', 'Cloud Mesh: Node synched.', 'AAU: Semester passed.', 'Fortinet FCAC: Certified.', 'Besys: Ticket resolved.', 'Zero Trust Handshake verified.'] },
    { level: 'WARN', color: '#d29922', messages: ['Packet loss in Cloud Mesh test.', 'Deadline approaching: Final Project.', 'High latency at Leonor branch.', 'Reviewing legacy firewall rules.', 'Memory spike in Docker container.'] },
    { level: 'TRACE', color: '#58a6ff', messages: ['Tracing route to Besys server...', 'Learning path: Kubernetes...', 'Debugging Packet Whisperer...', 'Simulating BGP failover...'] }
]

function SystemLogs() {
    const [logs, setLogs] = useState(INITIAL_LOGS)
    const scrollRef = useRef(null)

    // Helper to get current timestamp
    const getTimestamp = () => {
        const now = new Date()
        const date = now.toISOString().split('T')[0]
        const time = now.toTimeString().split(' ')[0]
        return `${date} ${time}`
    }

    // Auto-scroll effect
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    // Dynamic log generation
    useEffect(() => {
        const interval = setInterval(() => {
            const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
            const message = template.messages[Math.floor(Math.random() * template.messages.length)]

            const newLog = {
                time: getTimestamp(),
                level: template.level,
                color: template.color,
                message: message
            }

            setLogs(prev => {
                const newLogs = [...prev, newLog]
                if (newLogs.length > 50) return newLogs.slice(newLogs.length - 50) // Keep last 50 logs
                return newLogs
            })

        }, 100) // Add new log every 0.1s

        return () => clearInterval(interval)
    }, [])

    return (
        <section className="logs-section" id="logs">
            <div className="section-header-large">
                <span className="section-icon-large">📋</span>
                <h2>SYSTEM_LOGS // ACTIVITY_FEED</h2>
            </div>

            <div className="logs-container">
                <div className="logs-screen" ref={scrollRef}>
                    {logs.map((log, index) => (
                        <div key={index} className="log-entry">
                            <span className="log-timestamp">[{log.time}]</span>
                            <span className="log-level" style={{ color: log.color }}>[{log.level}]</span>
                            <span className="log-message">{log.message}</span>
                        </div>
                    ))}
                </div>
                <div className="logs-footer">
                    <span className="footer-text">LIVE FEED // {logs.length} ACTIVE PROCESSES</span>
                </div>
            </div>
        </section>
    )
}

export default SystemLogs
