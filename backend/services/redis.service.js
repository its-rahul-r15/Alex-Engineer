import Redis from "ioredis";


const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
        if (times > 3) {
            console.error('Redis connection failed after 3 retries');
            return null; // Stop retrying
        }
        return Math.min(times * 50, 2000);
    }
})

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.warn('Redis connection error:', err.message);
    console.warn('Application will continue without Redis caching');
});

export default redisClient;