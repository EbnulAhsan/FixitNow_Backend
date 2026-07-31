import { NextFunction, Request, Response } from "express";
import { verifytoken } from "../utils/jwt";

const auth = () => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const token = req.headers.authorization;

        if (!token) {
            throw new Error("You are not authorized");
        }

        const verifiedUser = verifytoken(token);

        (req as any).user = verifiedUser;

        next();
    };
};

export default auth;