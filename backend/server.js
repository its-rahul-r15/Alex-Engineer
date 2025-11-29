import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModal from './models/project.model.js';
import { generateResult } from './services/ai.service.js';

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// ================================
// SOCKET AUTH MIDDLEWARE
// ================================
io.use(async (socket, next) => {
    try {
        const token =
            socket.handshake.auth.token ||
            socket.handshake.headers.authorization?.split(' ')[1];

        const projectId = socket.handshake.query.projectId;

        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid or missing projectId'));
        }

        const project = await projectModal.findById(projectId);

        if (!project) {
            return next(new Error('Project not found'));
        }

        socket.project = project;

        if (!token) {
            return next(new Error('Authentication error: Token missing'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;

        return next();
    } catch (err) {
        console.log("Socket Auth Error:", err);
        next(new Error('Authentication failed'));
    }
});


// ================================
// SOCKET EVENTS
// ================================
io.on('connection', (socket) => {
    try {
        socket.roomId = socket.project._id.toString();
        socket.join(socket.roomId);

        console.log("User connected to room:", socket.roomId);

        socket.on('project-message', async (data) => {
            try {
                const { message } = data;
                const aiRequested = message.includes('@ai');

                // Broadcast user message
                io.to(socket.roomId).emit('project-message', data);

                if (!aiRequested) return;

                const prompt = message.replace('@ai', '').trim();
                const aiResponse = await generateResult(prompt);

                // Try JSON parse safely
                let parsed = null;
                try {
                    parsed = JSON.parse(aiResponse);
                } catch (_) { }

                if (parsed && parsed.fileTree) {
                    await projectModal.findByIdAndUpdate(
                        socket.project._id,
                        { fileTree: parsed.fileTree },
                        { new: true }
                    );
                    console.log("FileTree saved");
                }

                // Emit AI response
                io.to(socket.roomId).emit('project-message', {
                    message: aiResponse,
                    sender: { _id: 'ai', email: 'AI Assistant' }
                });

            } catch (error) {
                console.log("Error in project-message:", error);
            }
        });

        socket.on('disconnect', () => {
            console.log("User disconnected:", socket.roomId);
        });

    } catch (err) {
        console.log("Socket connection error:", err);
    }
});


// ================================
// START SERVER
// ================================
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
