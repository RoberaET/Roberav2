import React from 'react'

function Deployments() {
    return (
        <div className="deployments-section">
            <h2 className="deployments-title">RECENT_DEPLOYMENTS</h2>
            <div className="deployments-grid">
                <div className="deployment-card">
                    <div className="deployment-image cloud-mesh"></div>
                    <p className="deployment-label">CLOUD MESH</p>
                </div>
                <div className="deployment-card">
                    <div className="deployment-image fiber-core"></div>
                    <p className="deployment-label">FIBER CORE</p>
                </div>
            </div>
        </div>
    )
}

export default Deployments
