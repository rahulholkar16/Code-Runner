import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";

export function validateSubmission(req: Request, res: Response, next: NextFunction) {
    const { code, language } = req.body;
    
    if (typeof code !== 'string' || code.trim() === '' || !code)
        throw new ApiError(400, 'Code is required and must be a non-empty string');
    
    if (typeof language !== 'string' || language.trim() === '' || !language)
        throw new ApiError(400, 'Language is required and must be a non-empty string');

    next();
}