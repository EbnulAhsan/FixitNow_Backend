import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest =
    (schema: z.ZodTypeAny) =>
        (req: Request, res: Response, next: NextFunction) => {
            schema.parse({
                body: req.body,
            });

            next();
        };