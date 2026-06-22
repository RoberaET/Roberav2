import React, { useRef, useState, Component, Suspense, lazy } from 'react'
import ConnectionGateway from './components/ConnectionGateway'
import CoreRouterHero from './components/CoreRouterHero'
import FloatingMuteButton from './components/FloatingMuteButton'
import HeartbeatNav from './components/HeartbeatNav'

import RunningConfig from './components/RunningConfig'
import RackInventory from './components/RackInventory'
import Certifications from './components/Certifications'
import EducationBGP from './components/EducationBGP'
import NetworkTopology from './components/NetworkTopology'
import EstablishConnection from './components/EstablishConnection'
import CommandTerminal from './components/CommandTerminal'
import Footer from './components/Footer'

import './App.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: 'red', fontFamily: 'monospace' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}


function App() {
    const audioRef = useRef(null)
    const [isConnected, setIsConnected] = useState(false)
    const [cyberRangeMode, setCyberRangeMode] = useState(false)

    // Setup audio on mount but don't play until authorized
    React.useEffect(() => {
        const audio = new Audio('/honorable.m4a')
        audio.loop = true
        audio.volume = 0.05
        audioRef.current = audio

        return () => {
            audio.pause()
            audio.src = ''
        }
    }, [])

    const handleAuthorize = () => {
        setIsConnected(true)
        if (audioRef.current) {
            audioRef.current.play().catch(() => console.log("Audio play blocked"))
        }
    }

    return (
        <ErrorBoundary>
            <div className={`app-container ${cyberRangeMode ? 'cyber-range' : ''}`}>
                {/* Ambient Background Glow */}
                <div className="ambient-glow" />

                {!isConnected ? (
                    <ConnectionGateway onAuthorize={handleAuthorize} />
                ) : (
                    <div className="main-content fade-in" style={{ padding: '40px' }}>
                        
                        {/* Floating Mute Button — always visible while scrolling */}
                        <FloatingMuteButton audioRef={audioRef} />

                        <HeartbeatNav />

                        {/* Phase 2 Components */}
                        <div id="core-router">
                            <CoreRouterHero />
                        </div>
                        
                            {/* Phase 3 Components */}
                            <div id="network-ops" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                                <RunningConfig />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                    <RackInventory />
                                    <Certifications />
                                </div>
                            </div>
                            <EducationBGP />

                            {/* Phase 4 Components */}
                            <div id="data-center">
                                <NetworkTopology />
                            </div>

                            {/* Phase 5 Components */}
                            <div id="security-ops">
                                <EstablishConnection />
                            </div>

                            {/* Phase 6 Components */}
                            <div id="command-terminal">
                                <CommandTerminal onCyberRange={() => setCyberRangeMode(true)} />
                            </div>
                    </div>
                    <Footer />
                )}
            </div>
        </ErrorBoundary>
    )
}

export default App
