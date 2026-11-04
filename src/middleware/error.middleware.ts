import type { NextFunction, Request, Response } from "express";
import { unlink } from "node:fs/promises";
import { NODE_ENV } from "../config.js";

export const globalErrorHandling = (error: any, req: Request, res: Response, next: NextFunction): void => {
    // Remove Temp Files
    for (const file of (Array.isArray(req.files) ? req.files : []) as Express.Multer.File[]) {
        if (file.path) unlink(file.path).catch(() => undefined);
    }

    const status: number = error?.cause?.status ?? (error?.name === "MulterError" ? 400 : 500);
    res.status(status).json({
        message: error?.message || "Server error",
        status,
        issues: error?.cause?.issues,
        stack: NODE_ENV === "production" ? undefined : error?.stack
    });
};
