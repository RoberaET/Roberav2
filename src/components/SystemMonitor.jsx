import React, { useEffect, useRef, useState } from 'react'

function SystemMonitor() {
    const canvasRef = useRef(null)
    const [latency, setLatency] = useState(0)
    const [tx, setTx] = useState(0)
    const [rx, setRx] = useState(0)

    // Calculate real latency and update metrics
    useEffect(() => {
        // Get real page load latency
        const calculateLatency = () => {
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing
                const pageLoadTime = timing.loadEventEnd - timing.navigationStart
                const dnsTime = timing.domainLookupEnd - timing.domainLookupStart
                const actualLatency = Math.max(dnsTime, 1)
                setLatency(actualLatency)
            } else {
                // Fallback: measure time to a timestamp
                const start = performance.now()
                setTimeout(() => {
                    const end = performance.now()
                    setLatency(Math.round(end - start))
                }, 0)
            }
        }

        calculateLatency()

        // Update TX/RX with realistic fluctuations
        const updateMetrics = () => {
            // Simulate realistic network traffic (in MB/s)
            const baseTx = 120 + Math.random() * 10
            const baseRx = 450 + Math.random() * 10

            setTx(baseTx)
            setRx(baseRx)
        }

        updateMetrics()
        const metricsInterval = setInterval(updateMetrics, 1000)

        return () => clearInterval(metricsInterval)
    }, [])

    // Canvas animation
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationFrameId
        let time = 0

        const resize = () => {
            canvas.width = canvas.parentElement.clientWidth
            canvas.height = canvas.parentElement.clientHeight
        }

        window.addEventListener('resize', resize)
        resize()

        const draw = () => {
            time += 0.05
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Wave 1 (Blue)
            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = '#3b9eff'
            for (let x = 0; x < canvas.width; x++) {
                const y = Math.sin(x * 0.01 + time) * 30 + Math.sin(x * 0.02 + time * 1.5) * 10 + canvas.height / 2
                ctx.lineTo(x, y)
            }
            ctx.stroke()

            // Wave 2 (Cyan/Transparent)
            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = 'rgba(63, 185, 80, 0.4)'
            for (let x = 0; x < canvas.width; x++) {
                const y = Math.cos(x * 0.015 + time * 0.8) * 35 + canvas.height / 2
                ctx.lineTo(x, y)
            }
            ctx.stroke()

            // Scanline effect
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
            gradient.addColorStop(0, 'rgba(13, 17, 23, 0)')
            gradient.addColorStop(0.5, 'rgba(59, 158, 255, 0.05)')
            gradient.addColorStop(1, 'rgba(13, 17, 23, 0)')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            animationFrameId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    // Format speed values
    const formatSpeed = (mbps) => {
        if (mbps >= 1000) {
            return `${(mbps / 1000).toFixed(1)}GB/S`
        }
        return `${Math.round(mbps)}MB/S`
    }

    return (
        <div className="system-monitor-panel">
            <div className="monitor-header">
                <div className="header-left">
                    <div className="monitor-icon">
                        <span className="terminal-dot blue">_</span>
                    </div>
                    <div className="monitor-title-group">
                        <span className="monitor-title">R_MEKONNEN.SYS</span>
                        <span className="monitor-subtitle">PORTFOLIO_V2.0_RACK_VIEW</span>
                    </div>
                </div>
                <div className="header-right">
                    <div className="status-group">
                        <span className="status-text">SYSTEM ONLINE</span>
                        <span className="latency-text">Latency: {latency}ms</span>
                    </div>
                    <div className="monitor-controls">
                        <div className="control-icon"></div>
                        <div className="control-icon"></div>
                        <div className="control-icon"></div>
                    </div>
                </div>
            </div>

            <div className="oscilloscope-container">
                <div className="oscilloscope-header-row">
                    <span className="os-label">NETWORK_TRAFFIC_OSCILLOSCOPE</span>
                    <span className="os-value">98.4%</span>
                </div>
                <div className="oscilloscope-screen">
                    <canvas ref={canvasRef}></canvas>
                    <div className="grid-overlay"></div>
                </div>
                <div className="oscilloscope-footer-row">
                    <div className="metric">
                        <span className="metric-label">TX:</span>
                        <span className="metric-value">{formatSpeed(tx)}</span>
                    </div>
                    <div className="metric">
                        <span className="metric-label">RX:</span>
                        <span className="metric-value">{formatSpeed(rx)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SystemMonitor
