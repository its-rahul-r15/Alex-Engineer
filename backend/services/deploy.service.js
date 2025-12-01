import axios from 'axios';
import Deployment from '../models/deployment.model.js';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_API_URL = 'https://api.vercel.com';

// Validate if project is a React/Vite project
export const validateReactProject = (fileTree) => {
    const files = Object.keys(fileTree);

    const hasViteConfig = files.some(file => file.includes('vite.config.js') || file.includes('vite.config.ts'));
    const hasPackageJson = files.some(file => file.includes('package.json'));

    if (!hasViteConfig || !hasPackageJson) {
        throw new Error('This is not a valid React/Vite project. Required files: vite.config.js and package.json');
    }

    return true;
};

// Format files for Vercel deployment
export const formatFilesForVercel = (fileTree) => {
    const files = [];

    Object.entries(fileTree).forEach(([path, fileObj]) => {
        let content = '';

        if (fileObj && fileObj.file && fileObj.file.contents) {
            content = fileObj.file.contents;
        } else if (fileObj && fileObj.contents) {
            content = fileObj.contents;
        } else if (typeof fileObj === 'string') {
            content = fileObj;
        }

        files.push({
            file: path,
            data: content
        });
    });

    return files;
};

// Deploy to Vercel
export const deployToVercel = async (projectName, fileTree) => {
    try {
        const files = formatFilesForVercel(fileTree);

        const deploymentPayload = {
            name: projectName,
            files: files,
            projectSettings: {
                framework: 'vite',
                buildCommand: 'npm run build',
                outputDirectory: 'dist',
                installCommand: 'npm install'
            }
        };

        const response = await axios.post(
            `${VERCEL_API_URL}/v13/deployments`,
            deploymentPayload,
            {
                headers: {
                    'Authorization': `Bearer ${VERCEL_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Vercel deployment error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || 'Failed to deploy to Vercel');
    }
};

// Check deployment status
export const checkDeploymentStatus = async (vercelDeploymentId) => {
    try {
        const response = await axios.get(
            `${VERCEL_API_URL}/v13/deployments/${vercelDeploymentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${VERCEL_TOKEN}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error checking deployment status:', error.response?.data || error.message);
        throw new Error('Failed to check deployment status');
    }
};

// Update deployment status in database
export const updateDeploymentStatus = async (deploymentId, status, errorMessage = null) => {
    try {
        const updateData = { status };
        if (errorMessage) {
            updateData.error = errorMessage;
        }

        const deployment = await Deployment.findByIdAndUpdate(
            deploymentId,
            updateData,
            { new: true }
        );

        return deployment;
    } catch (error) {
        console.error('Error updating deployment status:', error);
        throw error;
    }
};

// Get project deployments
export const getProjectDeployments = async (projectId) => {
    try {
        const deployments = await Deployment.find({ projectId })
            .sort({ createdAt: -1 })
            .limit(10);

        return deployments;
    } catch (error) {
        console.error('Error fetching deployments:', error);
        throw error;
    }
};
