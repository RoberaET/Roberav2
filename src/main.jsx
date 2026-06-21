import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Force unregister any lingering Service Workers from the previous PWA setup
// This ensures returning visitors don't get stuck on "Initializing Subsystems..."
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
            registration.unregister();
            console.log('Unregistered old service worker.');
        }
    }).catch(err => console.error('Service worker unregistration failed:', err));
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
