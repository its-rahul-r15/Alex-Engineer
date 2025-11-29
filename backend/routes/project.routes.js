import {Router} from 'express'
import {body} from 'express-validator'
import * as projectController from '../controllers/project.controller.js';
import * as authMiddleware from '../middleware/auth.middleware.js';
const router = Router();

router.post('/create', 
    authMiddleware.authUser,
    body('name').notEmpty().withMessage('Project name is required'),
     projectController.createProject
)

router.get('/all', 
    authMiddleware.authUser,
    projectController.getAllProjects
)

router.put('/add-user',
    authMiddleware.authUser,
    body('projectId').notEmpty().withMessage('Project ID is required').bail().isMongoId().withMessage('projectId must be a valid Mongo ID'),
    body('users').isArray({ min: 1 }).withMessage('Users must be a non-empty array').bail()
        .custom((users) => users.every(user => typeof user === 'string' && user.length > 0)).withMessage('Each user must be a non-empty string'),
    projectController.addUserToProject
)

router.get('/get-project/:projectId',
    authMiddleware.authUser,
    projectController.getProjectById
)

router.put('/update-file-tree',
    authMiddleware.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('fileTree').isObject().withMessage('File tree is required'),
    projectController.updateFileTree
)

export default router;