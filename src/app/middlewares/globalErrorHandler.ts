import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    let statusCode = 500;
    let message = err.message || "Something went wrong";
    let errorDetails = err;

    if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation Error";

        errorDetails = err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
    });
};

export default globalErrorHandler;