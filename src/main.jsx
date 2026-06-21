import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register the Service Worker.
// autoUpdate: true means when a new version is deployed, the SW updates
// silently in the background and activates on next page navigation.
registerSW({
    immediate: true,
    onRegistered(r) {
        // Check for updates every 60 seconds while page is open
        r && setInterval(() => r.update(), 60 * 1000)
    },
    onOfflineReady() {
        console.log('[PWA] App is ready to work offline.')
    },
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
