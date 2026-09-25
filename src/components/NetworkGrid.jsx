import React from 'react'
import GlareHover from './GlareHover/GlareHover'

const GITHUB_REPO = "https://github.com/RoberaET/Enterprise-Campus-Network-Ospf-Hsrp-Vlan"

function NetworkGrid() {
    const projects = [
        {
            title: "ENTERPRISE_CORE_NET",
            status: "ONLINE",
            desc: "High-availability 3-tier architecture (Core, Distribution, Access) designed with redundant links and rapid convergence protocols.",
            tags: ["CISCO", "OSPF", "VLAN/STP"],
            link: "#",
            githubLink: null
        },
        {
            title: "REDUNDANT_CAMPUS_NET",
            status: "ACTIVE",
            desc: "Designed and simulated a fully redundant enterprise campus network using OSPF for dynamic routing, HSRP for default gateway redundancy, and VLAN segmentation for traffic isolation. Includes inter-VLAN routing, EtherChannel for link aggregation, STP tuning, and DHCP/DNS services — all verified end-to-end in Cisco Packet Tracer.",
            tags: ["OSPF", "HSRP", "VLAN", "EtherChannel", "STP", "Cisco"],
            link: GITHUB_REPO,
            githubLink: GITHUB_REPO
        },
        {
            title: "MULTI_BRANCH_ENTERPRISE",
            status: "SECURED",
            desc: "Multi-site enterprise network topology connecting HQ and remote branch offices with secure site-to-site links, centralized routing via OSPF, and VLAN-based department segmentation. Implements HSRP for failover resilience, QoS policies for traffic prioritization, and ACLs for perimeter security — documented with full topology diagrams and configuration files.",
            tags: ["OSPF", "HSRP", "ACL", "QoS", "VPN", "VLAN"],
            link: GITHUB_REPO,
            githubLink: GITHUB_REPO
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
                        borderColor={proj.githubLink ? "rgba(63, 185, 80, 0.3)" : "rgba(59, 158, 255, 0.2)"}
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
                                <a
                                    href={proj.link}
                                    className="project-link"
                                    target={proj.githubLink ? "_blank" : "_self"}
                                    rel={proj.githubLink ? "noopener noreferrer" : undefined}
                                    style={proj.githubLink ? { color: '#3fb950' } : {}}
                                >
                                    <span className="link-text">{proj.githubLink ? "VIEW_ON_GITHUB" : "ACCESS_NODE"}</span>
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
