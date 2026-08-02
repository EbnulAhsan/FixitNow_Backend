import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    let statusCode = err.statusCode || 500;
    let message =
        err.message || "Internal Server Error";

    let errorDetails: unknown = {
        statusCode,
    };

    if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation Error";

        errorDetails = err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    } else if (err.code === "P2002") {
        statusCode = 409;
        message = "Data already exists";

        errorDetails = {
            statusCode,
            meta: err.meta,
        };
    } else {
        errorDetails = {
            statusCode,
        };
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
    });
};

export default globalErrorHandler;
