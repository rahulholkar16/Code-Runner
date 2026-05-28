import { createClient } from 'redis';

export const REDIS_CONFIG = {
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    password: process.env.REDIS_PASSWORD || undefined,
};

export const RESULT_TTL = parseInt(process.env.RESULT_TTL ?? '300');

export const redisClient = createClient(REDIS_CONFIG);

redisClient.on('error', (err) => console.error('[Redis] Error:', err));

export async function connectRedis(): Promise<void> {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('[Redis] Connected on port', process.env.REDIS_PORT ?? '6397');
    }
};