import { execFile } from 'child_process';
import { promisify } from 'util';
import { Language, SubmissionResult } from '../types/index.js';

const exec = promisify(execFile);

const DOCKER_IMAGES: Record<Language, string> = {
    python: 'python:3.11-alpine',
    javascript: 'node:20-alpine',
};

const RUN_CMD: Record<Language, [string, string]> = {
    python: ['python3', '-c'],
    javascript: ['node', '-e'],
};

export async function processCode(
    code: string,
    language: Language
): Promise<SubmissionResult> {
    const image = DOCKER_IMAGES[language];
    const [bin, flag] = RUN_CMD[language];

    const dockerArgs = [
        'run', '--rm',
        '--network=none',
        '--memory=128m',
        '--cpus=0.5',
        '--pids-limit=64',
        image, bin, flag, code,
    ];

    try {
        const { stdout, stderr } = await exec('docker', dockerArgs, {
            timeout: 10_000,
        });
        return { status: 'done', stdout, stderr, exit_code: 0 };
    } catch (err: any) {
        if (err.killed) {
            return { status: 'timeout', stderr: 'Timed out after 10s', exit_code: 124 };
        }
        return {
            status: 'error',
            stdout: err.stdout ?? '',
            stderr: err.stderr ?? err.message,
            exit_code: err.code ?? 1,
        };
    }
}