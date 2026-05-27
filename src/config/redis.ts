import { createClient } from 'redis';

export const REDIS_CONFIG = {
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    password: process.env.REDIS_PASSWORD || undefined,
};

export const RESULT_TTL_SECONDS = 600; // 10 minutes

export async function createRedisClient() {
    const client = createClient(REDIS_CONFIG);

    client.on('error', (err: unknown) => {
        console.error('Redis Client Error:', err);
    });

    await client.connect();
    console.log('Connected to Redis');
    return client;
}