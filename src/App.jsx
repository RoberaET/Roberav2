import React from 'react'
import Header from './components/Header'
import SecureBadge from './components/SecureBadge'
import NameSection from './components/NameSection'
import StatusCards from './components/StatusCards'
import Terminal from './components/Terminal'
import AboutMe from './components/AboutMe'
import './App.css'

function App() {
    return (
        <div className="container">
            <Header />
            <main className="main-content">
                <SecureBadge />
                <NameSection />
                <StatusCards />
                <Terminal />
                <AboutMe />
            </main>
        </div>
    )
}

export default App
