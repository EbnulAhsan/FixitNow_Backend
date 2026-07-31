import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validateRequest =
    (schema: ZodSchema) =>
        (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            next();
        };

export default validateRequest;