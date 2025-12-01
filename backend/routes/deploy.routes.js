import express from 'express';
import * as deployController from '../controllers/deploy.controller.js';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Start deployment
router.post('/start',
    authMiddleware.authUser,
    deployController.startDeployment
);

// Get deployment status
router.get('/status/:deploymentId',
    authMiddleware.authUser,
    deployController.getDeploymentStatus
);

// Get deployment history for a project
router.get('/history/:projectId',
    authMiddleware.authUser,
    deployController.getDeploymentHistory
);

export default router;
