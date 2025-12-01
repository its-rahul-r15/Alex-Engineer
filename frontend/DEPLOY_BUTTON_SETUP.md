# Deploy Button Setup for Project.jsx

## Overview
This document explains how to add a deployment button to the Project.jsx frontend page that will deploy projects to Vercel.

## Changes Required

### 1. Add State Variables
Add these state variables to the `Project` component (around line 287 after the existing state declarations):

```javascript
// Deployment states
const [isDeployModalOpen, setIsDeployModalOpen] = useState(false)
const [isDeploying, setIsDeploying] = useState(false)
const [deploymentUrl, setDeploymentUrl] = useState('')
const [deploymentStatus, setDeploymentStatus] = useState('')
const [deploymentId, setDeploymentId] = useState(null)
```

### 2. Add Handler Functions
Add these functions after the `handleContentUpdate` function (around line 712):

```javascript
// Handle deployment
const handleDeploy = async () => {
    if (!project?._id || Object.keys(fileTree).length === 0) {
        alert('No files to deploy. Please add files to your project first.')
        return
    }

    try {
        setIsDeploying(true)
        setDeploymentStatus('Preparing deployment...')
        setIsDeployModalOpen(true)

        const response = await axios.post('/deploy/start', {
            projectId: project._id,
            projectName: project.name || 'my-project'
        })

        if (response.data.success) {
            setDeploymentId(response.data.deployment._id)
            setDeploymentUrl(response.data.deployment.deploymentUrl)
            setDeploymentStatus('Deploying to Vercel...')
            
            // Start polling for deployment status
            checkDeploymentStatus(response.data.deployment._id)
        }
    } catch (error) {
        console.error('Deployment error:', error)
        setDeploymentStatus(`Error: ${error.response?.data?.error || error.message}`)
        setIsDeploying(false)
    }
}

// Check deployment status
const checkDeploymentStatus = async (deplId) => {
    try {
        const response = await axios.get(`/deploy/status/${deplId}`)
        const deployment = response.data.deployment

        setDeploymentStatus(deployment.status)

        if (deployment.status === 'ready') {
            setIsDeploying(false)
            setDeploymentUrl(deployment.deploymentUrl)
            setDeploymentStatus('Deployment successful! 🎉')
        } else if (deployment.status === 'error') {
            setIsDeploying(false)
            setDeploymentStatus(`Deployment failed: ${deployment.errorMessage || 'Unknown error'}`)
        } else if (deployment.status === 'deploying') {
            // Poll again after 3 seconds
            setTimeout(() => checkDeploymentStatus(deplId), 3000)
        }
    } catch (error) {
        console.error('Error checking deployment status:', error)
        setIsDeploying(false)
        setDeploymentStatus('Error checking deployment status')
    }
}
```

### 3. Add Deploy Button to UI
In the actions section (around line 891), add the Deploy button next to the Run/Stop button:

```javascript
<div className="actions flex gap-2 p-3">
    {isRunning ? (
        <button
            onClick={stopProject}
            className="px-4 py-2 rounded-lg font-medium transition-all bg-red-600 hover:bg-red-500 text-white flex items-center gap-2"
        >
            <i className="ri-stop-fill"></i>
            Stop
        </button>
    ) : (
        <button
            onClick={runProject}
            disabled={!webContainer}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${webContainer ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
        >
            <i className="ri-play-fill"></i>
            {webContainer ? 'Run' : 'Initializing...'}
        </button>
    )}
    
    {/* ADD THIS DEPLOY BUTTON */}
    <button
        onClick={handleDeploy}
        disabled={isDeploying || Object.keys(fileTree).length === 0}
        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${!isDeploying && Object.keys(fileTree).length > 0 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
    >
        <i className={isDeploying ? "ri-loader-4-line animate-spin" : "ri-rocket-2-fill"}></i>
        {isDeploying ? 'Deploying...' : 'Deploy'}
    </button>
</div>
```

### 4. Add Deployment Modal
Add this modal at the end of the component, just before the closing `</main>` tag (around line 1024):

```javascript
{/* Deployment Modal */}
{isDeployModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl w-full max-w-md shadow-2xl border border-gray-700">
            <header className="flex justify-between items-center p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                    <i className="ri-rocket-2-fill text-blue-400"></i>
                    Deploying to Vercel
                </h2>
                <button
                    onClick={() => {
                        if (!isDeploying) {
                            setIsDeployModalOpen(false)
                            setDeploymentStatus('')
                        }
                    }}
                    disabled={isDeploying}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-gray-200 disabled:opacity-50"
                >
                    <i className="ri-close-fill text-xl"></i>
                </button>
            </header>

            <div className="p-6">
                <div className="mb-4">
                    <p className="text-gray-300 text-sm mb-2">Status:</p>
                    <div className="bg-gray-900 rounded-lg p-4 flex items-center gap-3">
                        {isDeploying && (
                            <i className="ri-loader-4-line animate-spin text-blue-400 text-xl"></i>
                        )}
                        <p className="text-gray-200">{deploymentStatus || 'Initializing...'}</p>
                    </div>
                </div>

                {deploymentUrl && !isDeploying && (
                    <div>
                        <p className="text-gray-300 text-sm mb-2">Deployment URL:</p>
                        <div className="bg-gray-900 rounded-lg p-4">
                            <a 
                                href={deploymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 break-all flex items-center gap-2"
                            >
                                {deploymentUrl}
                                <i className="ri-external-link-line"></i>
                            </a>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-gray-700">
                <button
                    onClick={() => {
                        setIsDeployModalOpen(false)
                        setDeploymentStatus('')
                        setDeploymentUrl('')
                    }}
                    disabled={isDeploying}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${!isDeploying ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                >
                    {isDeploying ? 'Deploying...' : 'Close'}
                </button>
            </div>
        </div>
    </div>
)}
```

## Backend Infrastructure

The backend deployment routes are already set up:
- **POST `/deploy/start`** - Starts deployment to Vercel
- **GET `/deploy/status/:deploymentId`** - Gets deployment status
- **GET `/deploy/history/:projectId`** - Gets deployment history

## Features

1. **Deploy Button** - Located next to the Run/Stop button
2. **Real-time Status** - Polls deployment status every 3 seconds
3. **Status Modal** - Shows deployment progress and final URL
4. **Error Handling** - Displays errors if deployment fails
5. **Disabled States** - Button disabled when no files or while deploying

## Icons Used

- `ri-rocket-2-fill` - Deploy button icon
- `ri-loader-4-line` - Loading spinner (with `animate-spin`)
- `ri-external-link-line` - External link icon for deployment URL

## Testing

1. Create a project with files
2. Click the "Deploy" button
3. Monitor the deployment status in the modal
4. Once complete, click the deployment URL to view your deployed app
