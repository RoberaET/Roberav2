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
import './App.css'

function App() {
    return (
        <div className="container">
            <Header />
            <main className="main-content">
                <SecureBadge />
                <NameSection />
                <StatusCards />
                <SystemMonitor />
                <Terminal />
                <AboutMe />
                <NetworkGrid />
                <SecureUplink />
                <SystemLogs />
            </main>
            <Footer />
        </div>
    )
}

export default App
