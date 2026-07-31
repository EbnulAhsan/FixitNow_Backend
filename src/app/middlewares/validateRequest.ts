import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validateRequest =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction) => {
            schema.parse({
                body: req.body,
            });

            next();
        };

export default validateRequest;