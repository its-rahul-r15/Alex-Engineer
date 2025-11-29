
import * as projectService from '../services/project.service.js';
import { validationResult } from 'express-validator';
import userModel from '../models/user.model.js';


export const createProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name } = req.body;

        console.log('Creating project with name:', name);
        console.log('User from req.user:', req.user);

        if (!req.user || !req.user.email) {
            console.error('req.user or req.user.email is missing');
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const loggedInUserId = await userModel.findOne({ email: req.user.email }).select('_id');

        if (!loggedInUserId) {
            console.error('User not found in database with email:', req.user.email);
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = loggedInUserId._id;

        const newProject = await projectService.createProject({
            name,
            userId
        });

        res.status(201).json({ project: newProject });
    } catch (err) {
        console.error('Error creating project:', err.message);
        console.error('Full error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        console.log('Fetching projects for user:', loggedInUser.email, 'with ID:', loggedInUser._id);

        const allUserProjects = await projectService.getAllProjectByUserId({ userId: loggedInUser._id });

        console.log(`Found ${allUserProjects.length} projects for user ${loggedInUser.email}`);
        console.log('Project names:', allUserProjects.map(p => p.name));

        return res.status(200).json({ projects: allUserProjects });
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formatted = errors.array().map(err => ({
            type: 'field',
            msg: err.msg,
            // ensure path is always present (express-validator uses 'param')
            path: err.param ?? err.path ?? '',
            location: err.location ?? 'body'
        }));

        return res.status(400).json({ errors: formatted });
    }

    try {

        const { projectId, users } = req.body

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })


        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({
            project,
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }


}

export const getProjectById = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await projectService.getProjectById({ projectId });

        return res.status(200).json({ project });
    } catch (err) {
        console.error('Error fetching project:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}