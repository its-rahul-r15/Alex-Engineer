import { Router } from "express";
import * as userController from "../controllers/user.controllers.js";
import {body} from 'express-validator';
import { authUser } from "../middleware/auth.middleware.js";


const router = Router();

router.post('/register',
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    
    userController.createUserController);

    router.post('/login',
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required'),
        userController.loginUserController
    )

    router.get('/profile',authUser, userController.getUserProfileController);

    router.get('/logout',authUser, userController.logoutUserController);

   router.get('/all', authUser, userController.getAllUsersController);
    export default router;