import React from 'react'

function SystemLogs() {
    const logs = [
        { time: '2025-01-10 14:30:22', level: 'SUCCESS', color: '#3fb950', message: 'Certification: CCNA obtained from Cisco Networking Academy' },
        { time: '2025-01-08 09:15:41', level: 'DEPLOY', color: '#3b9eff', message: 'Project: Cloud Mesh Architecture v2.1 deployed to production' },
        { time: '2024-12-28 16:42:11', level: 'SUCCESS', color: '#3fb950', message: 'Certification: Fortinet Certified Associate (FCAC) completed' },
        { time: '2024-12-15 11:20:33', level: 'INFO', color: '#8b949e', message: 'Portfolio system upgraded to v2.0 with enhanced security protocols' },
        { time: '2024-11-30 13:55:09', level: 'DEPLOY', color: '#3b9eff', message: 'Project: Zero Trust Gateway implemented for enterprise client' },
        { time: '2024-11-20 10:12:47', level: 'SUCCESS', color: '#3fb950', message: 'Network optimization: Achieved 15% performance improvement' },
        { time: '2024-10-15 08:33:22', level: 'INFO', color: '#8b949e', message: 'System uptime milestone: 1825 days without critical failure' },
        { time: '2024-09-28 15:41:55', level: 'DEPLOY', color: '#3b9eff', message: 'Infrastructure migration: Successfully moved to AWS cloud architecture' }
    ]

    return (
        <section className="logs-section" id="logs">
            <div className="section-header-large">
                <span className="section-icon-large">📋</span>
                <h2>SYSTEM_LOGS // ACTIVITY_FEED</h2>
            </div>

            <div className="logs-container">
                <div className="logs-screen">
                    {logs.map((log, index) => (
                        <div key={index} className="log-entry" style={{ animationDelay: `${index * 0.1}s` }}>
                            <span className="log-timestamp">[{log.time}]</span>
                            <span className="log-level" style={{ color: log.color }}>[{log.level}]</span>
                            <span className="log-message">{log.message}</span>
                        </div>
                    ))}
                </div>
                <div className="logs-footer">
                    <span className="footer-text">END OF LOG // {logs.length} ENTRIES LOADED</span>
                </div>
            </div>
        </section>
    )
}

export default SystemLogs
