import { Request, Response } from "express";
import { AuthServices } from "./auth.service";
import catchAsync from "../../utils/catchAsync";

const registerUser = catchAsync(
    async (req: Request, res: Response) => {
        const result = await AuthServices.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    }
);

// login user 

const loginUser = catchAsync(
    async (req: Request, res: Response) => {
        const result = await AuthServices.loginUser(req.body);

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: result,
        });
    }
);
``
export const AuthControllers = {
    registerUser,
    loginUser
};