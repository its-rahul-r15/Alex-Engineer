import Deployment from '../models/deployment.model.js';
import * as deployService from '../services/deploy.service.js';
import projectModel from '../models/project.model.js';

// Start deployment
export const startDeployment = async (req, res) => {
    try {
        const { projectId, projectName } = req.body;

        // Validate authentication
        if (!req.user) {
            console.error('No user in request');
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Get userId from req.user (could be _id or id depending on JWT structure)
        const userId = req.user._id || req.user.id || req.user.userId;

        if (!userId) {
            console.error('No userId found in req.user:', req.user);
            return res.status(401).json({ error: 'User ID not found in token' });
        }

        if (!projectId || !projectName) {
            return res.status(400).json({ error: 'Project ID and project name are required' });
        }

        // Get project
        const project = await projectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Detect project type (vanilla or react)
        let projectType;
        try {
            projectType = deployService.detectProjectType(project.fileTree);
            console.log(`📦 Detected project type: ${projectType}`);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

        // Deploy to Vercel
        const vercelDeployment = await deployService.deployToVercel(projectName, project.fileTree, projectType);

        // Save deployment record
        const deployment = new Deployment({
            projectId,
            userId: userId,
            deploymentUrl: vercelDeployment.url || `https://${vercelDeployment.alias?.[0] || projectName + '.vercel.app'}`,
            status: 'deploying',
            vercelDeploymentId: vercelDeployment.id,
            projectName
        });

        await deployment.save();

        // Start checking deployment status in background
        checkDeploymentStatusLoop(deployment._id, vercelDeployment.id);

        res.status(200).json({
            success: true,
            deployment
        });

    } catch (error) {
        console.error('Deployment error:', error);
        res.status(500).json({ error: error.message || 'Failed to start deployment' });
    }
};

// Background function to check deployment status
async function checkDeploymentStatusLoop(deploymentId, vercelDeploymentId) {
    try {
        const vercelStatus = await deployService.checkDeploymentStatus(vercelDeploymentId);

        if (vercelStatus.ready || vercelStatus.readyState === 'READY') {
            await deployService.updateDeploymentStatus(deploymentId, 'ready');
        } else if (vercelStatus.error || vercelStatus.readyState === 'ERROR') {
            await deployService.updateDeploymentStatus(
                deploymentId,
                'error',
                vercelStatus.error?.message || 'Deployment failed'
            );
        } else {
            // Check again in 5 seconds
            setTimeout(() => checkDeploymentStatusLoop(deploymentId, vercelDeploymentId), 5000);
        }
    } catch (error) {
        console.error('Error in status check loop:', error);
        await deployService.updateDeploymentStatus(deploymentId, 'error', error.message);
    }
}

// Get deployment status
export const getDeploymentStatus = async (req, res) => {
    try {
        const { deploymentId } = req.params;

        const deployment = await Deployment.findById(deploymentId);
        if (!deployment) {
            return res.status(404).json({ error: 'Deployment not found' });
        }

        res.status(200).json({ deployment });

    } catch (error) {
        console.error('Error fetching deployment status:', error);
        res.status(500).json({ error: 'Failed to fetch deployment status' });
    }
};

// Get deployment history for a project
export const getDeploymentHistory = async (req, res) => {
    try {
        const { projectId } = req.params;

        const deployments = await deployService.getProjectDeployments(projectId);

        res.status(200).json({ deployments });

    } catch (error) {
        console.error('Error fetching deployment history:', error);
        res.status(500).json({ error: 'Failed to fetch deployment history' });
    }
};
