import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { SubmissionResult, SubmitRequestBody } from "../types/index.js";
import { v4 as uuid } from "uuid";
import { redisClient, RESULT_TTL } from "../config/redis.js";
import { submissionQueue } from "../queue/index.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

export const submitCode = asyncHandler(async (req: Request, res: Response) => {
    const { code, language } = req.body as SubmitRequestBody;

    const token = uuid();

    const pending: SubmissionResult = { status: 'pending' };
    await redisClient.set(token, JSON.stringify(pending), { EX: RESULT_TTL });
    await submissionQueue.add('run', { token, code, language });

    res.status(201).json(new ApiResponse(201, "Runing", { token }));
});

export const getResult = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;

    if (!token || typeof token != 'string') throw new ApiError(400, "Token is required");

    const raw = await redisClient.get(token);
    if(!raw) throw new ApiError(404, 'Result not found or already expired');

    const result: SubmissionResult = JSON.parse(raw);
    res.status(200).json(new ApiResponse(200, "", result));
});