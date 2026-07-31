import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifytoken } from "../utils/jwt";

type TUserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

const auth = (...requiredRoles: TUserRole[]) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            throw new Error("You are not authorized");
        }

        const token = authorizationHeader.startsWith("Bearer ")
            ? authorizationHeader.split(" ")[1]
            : authorizationHeader;

        const verifiedUser = verifytoken(token) as JwtPayload & {
            id: string;
            email: string;
            role: TUserRole;
        };

        if (
            requiredRoles.length &&
            !requiredRoles.includes(verifiedUser.role)
        ) {
            throw new Error(
                "You do not have permission to access this resource"
            );
        }

        (req as any).user = verifiedUser;

        next();
    };
};

export default auth;