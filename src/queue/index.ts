import { Queue } from 'bullmq';
import { REDIS_CONFIG } from '../config/redis.js';

export const submissionQueue = new Queue('code_runner_submissions', {
    connection: REDIS_CONFIG.socket,
    defaultJobOptions: {
        attempts: 3, // Retry failed jobs up to 3 times
        backoff: {
            type: 'exponential',
            delay: 5000, // Initial delay of 5 seconds before retrying
        },
        removeOnComplete: true, // Automatically remove completed jobs from the queue
        removeOnFail: true, // Keep failed jobs in the queue for debugging
    }
});