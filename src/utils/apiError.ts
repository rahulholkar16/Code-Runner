class ApiError extends Error implements IApiErrors {
    statusCode: number;
    success: boolean;
    errors?: unknown;

    constructor(statusCode: number, message = "Something went wrong", errors?: unknown, stack?: string) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
};

export { ApiError };