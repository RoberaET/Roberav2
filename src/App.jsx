import React from 'react'
import Header from './components/Header'
import SecureBadge from './components/SecureBadge'
import NameSection from './components/NameSection'
import SystemMonitor from './components/SystemMonitor'
import StatusCards from './components/StatusCards'
import Terminal from './components/Terminal'
import AboutMe from './components/AboutMe'
import NetworkGrid from './components/NetworkGrid'
import SecureUplink from './components/SecureUplink'
import SystemLogs from './components/SystemLogs'
import Footer from './components/Footer'
import useScrollAnimation from './hooks/useScrollAnimation'
import './App.css'

function App() {
    useScrollAnimation();

    return (
        <div className="container">
            <Header />
            <main className="main-content">
                <div className="scroll-animate scroll-fade-up">
                    <SecureBadge />
                </div>
                <div className="scroll-animate scroll-fade-up">
                    <NameSection />
                </div>
                <div className="scroll-animate scroll-scale">
                    <StatusCards />
                </div>
                <div className="scroll-animate scroll-fade-up">
                    <SystemMonitor />
                </div>
                <div className="scroll-animate scroll-fade-up">
                    <Terminal />
                </div>
                <div className="scroll-animate scroll-fade-up">
                    <AboutMe />
                </div>
                <div className="scroll-animate scroll-fade-up">
                    <NetworkGrid />
                </div>
                <div className="scroll-animate scroll-fade-up">
                    <SecureUplink />
                </div>
                <div className="scroll-animate scroll-fade-up">
                    <SystemLogs />
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default App
