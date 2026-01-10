import React from 'react'
import GlareHover from './GlareHover/GlareHover';
import besysLogo from '../assets/BESYS.png';
import leonorLogo from '../assets/LEONOR.png';
import ieLogo from '../assets/IE.png';
import microlinkLogo from '../assets/MICROLINK.png';
import aauLogo from '../assets/AAU.png';
import ciscoLogo from '../assets/CISCO.png';
import fortinetLogo from '../assets/FORTINET.png';
import udemyLogo from '../assets/UDEMY.png';

function AboutMe() {
    return (
        <section className="about-section" id="about">
            <div className="section-header-large">
                <span className="section-icon-large">⚡</span>
                <h2>SYSTEM_LOGS // RESUME</h2>
            </div>

            {/* Experience Section */}
            <div className="cyber-card">
                <div className="cyber-card-header">
                    <span className="cyber-title">
                        RUNTIME_PROCESSES <span className="cyber-subtitle">(EXPERIENCE)</span>
                    </span>
                </div>
                <div className="experience-grid">
                    <div className="job-card">
                        <div className="card-content-wrapper">
                            <div className="logo-frame">
                                <img src={besysLogo} alt="Besys Logo" />
                            </div>
                            <div className="card-text">
                                <span className="job-role">Junior Network Engineer</span>
                                <a href="https://besystechnologies.com/" target="_blank" rel="noopener noreferrer" className="job-company">Besys Technologies PLC</a>
                            </div>
                        </div>
                        <div className="job-meta-row">
                            <span>July 2025 - Present</span>
                            <span>Bole, Addis Ababa</span>
                        </div>
                        <ul className="job-points">
                            <li>Designed and implemented scalable network infrastructure.</li>
                            <li>Configured routers, switches, firewalls, and access points.</li>
                            <li>Optimized QoS for improved data flow and reliability.</li>
                            <li>Performed root-cause analysis for complex network issues.</li>
                        </ul>
                    </div>

                    <div className="job-card">
                        <div className="card-content-wrapper">
                            <div className="logo-frame">
                                <img src={leonorLogo} alt="Leonor Logo" />
                            </div>
                            <div className="card-text">
                                <span className="job-role">Operational Manager</span>
                                <a href="https://www.leonortrading.com/" target="_blank" rel="noopener noreferrer" className="job-company">Leonor Trading PLC</a>
                            </div>
                        </div>
                        <div className="job-meta-row">
                            <span>April 2024 - June 2024</span>
                            <span>Ayat, Addis Ababa</span>
                        </div>
                        <ul className="job-points">
                            <li>Supported daily operational processes and workflow efficiency.</li>
                            <li>Coordinated logistics reducing stock discrepancies.</li>
                            <li>Ensured 100% on-time delivery rate during internship.</li>
                        </ul>
                    </div>

                    <div className="job-card">
                        <div className="card-content-wrapper">
                            <div className="logo-frame">
                                <img src={ieLogo} alt="IE Logo" />
                            </div>
                            <div className="card-text">
                                <span className="job-role">Modern Data Center & Cloud Engineer</span>
                                <a href="https://www.ienetworksolutions.com/" target="_blank" rel="noopener noreferrer" className="job-company">IE Network Solutions</a>
                            </div>
                        </div>
                        <div className="job-meta-row">
                            <span>October 2023 - January 2024</span>
                            <span>Hayahulet, Addis Ababa</span>
                        </div>
                        <ul className="job-points">
                            <li>Increased data center efficiency by 15% via infra upgrades.</li>
                            <li>Improved system stability by 15% through comprehensive audits.</li>
                            <li>Collaborated to design modern cloud solutions for enterprises.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Education Section */}
            <div className="cyber-card">
                <div className="cyber-card-header">
                    <span className="cyber-title">
                        KERNEL_MODULES <span className="cyber-subtitle">(EDUCATION)</span>
                    </span>
                </div>
                <div className="education-grid">
                    <GlareHover
                        className="edu-card"
                        width="100%"
                        height="auto"
                        background="transparent"
                        borderRadius="8px"
                        borderColor="transparent"
                        transitionDuration={1500}
                        style={{ borderLeft: '4px solid #3fb950' }}
                    >
                        <div className="card-content-wrapper">
                            <div className="logo-frame">
                                <img src={microlinkLogo} alt="Microlink Logo" />
                            </div>
                            <div className="card-text">
                                <span className="edu-degree">B.Sc. in COMPUTER ENGINEERING</span>
                                <span className="edu-school">MICROLINK INFO TECH COLLEGE</span>
                            </div>
                        </div>
                        <div className="job-meta-row" style={{ marginBottom: 0, marginTop: '12px', border: 'none' }}>
                            <span>October 2019 - August 2024</span>
                        </div>
                    </GlareHover>
                    <GlareHover
                        className="edu-card"
                        width="100%"
                        height="auto"
                        background="transparent"
                        borderRadius="8px"
                        borderColor="transparent"
                        transitionDuration={1500}
                        style={{ borderLeft: '4px solid #3fb950' }}
                    >
                        <div className="card-content-wrapper">
                            <div className="logo-frame">
                                <img src={aauLogo} alt="AAU Logo" />
                            </div>
                            <div className="card-text">
                                <span className="edu-degree">BA in MANAGEMENT</span>
                                <span className="edu-school">ADDIS ABABA UNIVERSITY</span>
                            </div>
                        </div>
                        <div className="job-meta-row" style={{ marginBottom: 0, marginTop: '12px', border: 'none' }}>
                            <span>October 2020 - June 2025</span>
                        </div>
                    </GlareHover>
                </div>
            </div>

            {/* Certifications Section */}
            <div className="cyber-card">
                <div className="cyber-card-header">
                    <span className="cyber-title">
                        SECURITY_PROTOCOLS <span className="cyber-subtitle">(CERTIFICATIONS)</span>
                    </span>
                </div>
                <div className="cert-grid-large">
                    {[
                        { name: "CCNA", issuer: "CISCO", logo: ciscoLogo, progress: 100 },
                        { name: "Ethical Hacker", issuer: "CISCO", logo: ciscoLogo, progress: 100 },
                        { name: "Linux Essentials", issuer: "CISCO", logo: ciscoLogo, progress: 100 },
                        { name: "Cisco Meraki (CMNE-F)", issuer: "CISCO", logo: ciscoLogo, progress: 100 },
                        { name: "Cybersecurity Analyst", issuer: "CISCO", logo: ciscoLogo, progress: 100 },
                        { name: "FCAC", issuer: "FORTINET", logo: fortinetLogo, progress: 100 },
                        { name: "FCFC", issuer: "FORTINET", logo: fortinetLogo, progress: 100 },
                        { name: "Malware Analysis & BCP", issuer: "Udemy", logo: udemyLogo, progress: 100 }
                    ].map((cert, index) => (
                        <GlareHover
                            className="cert-card"
                            key={index}
                            width="100%"
                            height="auto"
                            background="transparent"
                            borderRadius="12px"
                            borderColor="rgba(59, 158, 255, 0.2)"
                            transitionDuration={1500}
                        >
                            <div className="card-content-wrapper">
                                <div className="logo-frame">
                                    <img src={cert.logo} alt={cert.issuer} />
                                </div>
                                <div className="card-text">
                                    <span className="cert-title">{cert.name}</span>
                                    <span className="cert-issuer">{cert.issuer}</span>
                                    <div className="cert-progress-container">
                                        <div className="cert-progress-bar" style={{ width: `${cert.progress}%` }}>
                                            <span className="cert-tooltip">{cert.progress}%</span>
                                        </div>
                                    </div>
                                    <span className="cert-status-below">Earned</span>
                                </div>
                            </div>
                        </GlareHover>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default AboutMe
