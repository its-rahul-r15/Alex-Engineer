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
// HELPER FUNCTIONS
// ================================
function cleanJsonResponse(response) {
    if (!response) return '{}';

    let cleaned = response.trim();

    // Remove markdown code blocks if present
    const markdownJsonMatch = cleaned.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownJsonMatch) {
        cleaned = markdownJsonMatch[1].trim();
    } else {
        // Try removing any code block wrappers
        const codeBlockMatch = cleaned.match(/```\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
            cleaned = codeBlockMatch[1].trim();
        }
    }

    // Find the first '{' and last '}' to extract JSON
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    return cleaned;
}

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
                const { message, mode = 'react' } = data;  // ← Extract mode
                console.log('📩 Received message data:', { message, mode, fullData: data });
                const aiRequested = message.includes('@ai');

                // Broadcast user message
                io.to(socket.roomId).emit('project-message', data);

                if (!aiRequested) return;

                const prompt = message.replace('@ai', '').trim();
                console.log('🤖 Calling AI with mode:', mode, 'prompt:', prompt.substring(0, 50));
                const aiResponse = await generateResult(prompt, mode);  // ← Pass mode
                console.log('✅ AI Response received, length:', aiResponse?.length);

                // Clean JSON response (remove markdown, extra text, etc.)
                const cleanedResponse = cleanJsonResponse(aiResponse);
                console.log('🧹 Cleaned response preview:', cleanedResponse.substring(0, 200));

                // Try JSON parse safely
                let parsed = null;
                try {
                    parsed = JSON.parse(cleanedResponse);
                    console.log('✅ JSON parsed successfully');
                    console.log('📦 Parsed object keys:', Object.keys(parsed));
                    if (parsed.fileTree) {
                        console.log('📁 FileTree found with', Object.keys(parsed.fileTree).length, 'files');
                    }
                } catch (err) {
                    console.error("❌ Failed to parse AI response after cleaning:", err.message);
                    console.error("Cleaned response preview:", cleanedResponse.substring(0, 200));
                }

                if (parsed && parsed.fileTree) {
                    await projectModal.findByIdAndUpdate(
                        socket.project._id,
                        { fileTree: parsed.fileTree },
                        { new: true }
                    );
                    console.log("✅ FileTree saved to database");
                }

                // Emit AI response - send the cleaned JSON
                console.log('📤 Emitting AI response to room:', socket.roomId);
                io.to(socket.roomId).emit('project-message', {
                    message: cleanedResponse,
                    sender: { _id: 'ai', email: 'AI Assistant' }
                });
                console.log('✅ AI response emitted successfully');

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