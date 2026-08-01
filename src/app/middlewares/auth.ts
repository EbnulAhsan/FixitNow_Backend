import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../utils/prisma";
import { AppError } from "../utils/appError";
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
            throw new AppError(
                401,
                "You are not authorized"
            );
        }

        const token = authorizationHeader.startsWith("Bearer ")
            ? authorizationHeader.split(" ")[1]
            : authorizationHeader;

        if (!token) {
            throw new AppError(
                401,
                "You are not authorized"
            );
        }

        const verifiedUser = verifytoken(token) as JwtPayload & {
            id: string;
            email: string;
            role: TUserRole;
        };

        const user = await prisma.user.findUnique({
            where: {
                id: verifiedUser.id,
            },
            select: {
                id: true,
                email: true,
                role: true,
                isBlocked: true,
                isDeleted: true,
            },
        });

        if (!user) {
            throw new AppError(
                401,
                "User account not found"
            );
        }

        if (user.isDeleted) {
            throw new AppError(
                403,
                "Your account has been deleted"
            );
        }

        if (user.isBlocked) {
            throw new AppError(
                403,
                "Your account has been blocked"
            );
        }

        if (
            requiredRoles.length > 0 &&
            !requiredRoles.includes(user.role)
        ) {
            throw new AppError(
                403,
                "You do not have permission to access this resource"
            );
        }

        // Use the current database role instead of trusting
        // the potentially outdated role stored in the token.
        (req as any).user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        next();
    };
};

export default auth;