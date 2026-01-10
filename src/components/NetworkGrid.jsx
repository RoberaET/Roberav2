import React from 'react'
import GlareHover from './GlareHover/GlareHover'

function NetworkGrid() {
    const projects = [
        {
            title: "CLOUD_MESH_NET",
            status: "ONLINE",
            desc: "Distributed network architecture simulation with auto-failover redundancy protocols and load balancing.",
            tags: ["PYTHON", "AWS", "TERRAFORM"],
            link: "#"
        },
        {
            title: "PACKET_WHISPERER",
            status: "BETA",
            desc: "Real-time traffic analyzer and anomaly detection system using machine learning algorithms.",
            tags: ["WIRESHARK", "ML", "REACT"],
            link: "#"
        },
        {
            title: "ZERO_TRUST_GATEWAY",
            status: "V1.2",
            desc: "Identity-aware proxy implementation for secure remote access without VPN dependencies.",
            tags: ["NODE.JS", "OAUTH", "DOCKER"],
            link: "#"
        }
    ]

    return (
        <section className="network-section" id="projects">
            <div className="section-header-large">
                <span className="section-icon-large">🕸️</span>
                <h2>NETWORK_GRID // PROJECTS & LABS</h2>
            </div>

            <div className="projects-grid">
                {projects.map((proj, index) => (
                    <GlareHover
                        key={index}
                        className="project-card"
                        width="100%"
                        height="auto"
                        background="rgba(13, 17, 23, 0.6)"
                        borderRadius="12px"
                        borderColor="rgba(59, 158, 255, 0.2)"
                        transitionDuration={1500}
                    >
                        <div className="card-content-wrapper">
                            <div className="project-header">
                                <span className="project-title">{proj.title}</span>
                                <span className="project-status">{proj.status}</span>
                            </div>
                            <p className="project-desc">{proj.desc}</p>
                            <div className="project-tags">
                                {proj.tags.map((tag, i) => (
                                    <span key={i} className="tech-tag">[{tag}]</span>
                                ))}
                            </div>
                            <div className="project-footer">
                                <a href={proj.link} className="project-link">
                                    <span className="link-text">ACCESS_NODE</span>
                                    <span className="link-arrow">→</span>
                                </a>
                            </div>
                        </div>
                    </GlareHover>
                ))}
            </div>
        </section>
    )
}

export default NetworkGrid
