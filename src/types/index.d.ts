interface IApiErrors {
    statusCode: number,
    message?: string,
    success: boolean,
    errors?: unknown
}

interface IApiResponse <T = unknown> {
    statusCode: number,
    message?: string,
    success: boolean,
    data?: T
}

export type Language = 'python' | 'javascript';

export type Status = 'pending' | 'running' | 'done' | 'error' | 'timeout';

export interface SubmissionJob {
    token: string;
    code: string;
    language: Language;
}

export interface SubmissionResult {
    status: Status;
    stdout?: string;
    stderr?: string;
    exit_code?: number;
}

export interface SubmitRequestBody {
    code: string;
    language: Language;
}