interface IApiErrors {
    statusCode: number,
    message: string,
    success: boolean,
    errors?: unknown
}

interface IApiResponse <T = unknown> {
    statusCode: number,
    message: string,
    success: boolean,
    data?: T
}