import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Try to check blacklist, but don't fail if Redis is down
        try {
            const isBlacklisted = await redisClient.get(`blacklist_${token}`);

            if (isBlacklisted) {
                res.cookie('token', '');
                return res.status(401).json({ message: 'Unauthorized' });
            }
        } catch (redisError) {
            console.warn('Redis not available, skipping blacklist check:', redisError.message);
            // Continue without blacklist check if Redis is down
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        res.status(401).json({ message: 'Unauthorized' });
    }
}