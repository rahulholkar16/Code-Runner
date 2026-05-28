import 'dotenv/config';
import { Worker } from 'bullmq';
import { SubmissionJob, SubmissionResult } from '../types/index.js';
import { QUEUE_NAME } from '../constant.js';
import { processCode } from './processor.js';
import { connectRedis, REDIS_CONFIG, redisClient, RESULT_TTL } from '../config/redis.js';

async function main() {
    await connectRedis();

    const worker = new Worker<SubmissionJob>(
        QUEUE_NAME,
        async (job) => {
            const { token, code, language } = job.data;
            console.log(`[Worker] Running ${token} (${language})`);

            // Mark as running
            const running: SubmissionResult = { status: 'running' };
            await redisClient.set(token, JSON.stringify(running), { EX: RESULT_TTL });

            // Actual execution (processor.ts)
            const result = await processCode(code, language);

            // Save result with TTL — auto-delete hoga
            await redisClient.set(token, JSON.stringify(result), { EX: RESULT_TTL });
            console.log(`[Worker] Done ${token} → ${result.status}`);
        },
        { connection: REDIS_CONFIG.socket }
    );

    worker.on('failed', async (job, err) => {
        if (!job) return;
        console.error(`[Worker] Failed ${job.data.token}:`, err.message);
        const errResult: SubmissionResult = { status: 'error', stderr: err.message };
        await redisClient.set(job.data.token, JSON.stringify(errResult), { EX: RESULT_TTL });
    });

    console.log(`[Worker] Listening on queue "${QUEUE_NAME}"...`);
}

main().catch(console.error);