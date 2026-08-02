import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AdminServices } from "./admin.service";


const getAllUsers = catchAsync(
    async (req: Request, res: Response) => {
        const result = await AdminServices.getAllUsersFromDB(
            req.query
        );

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result,
        });
    }
);




// block user controller 
const blockUser = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.params.id as string;
        const adminId = (req as any).user.id;

        const result = await AdminServices.blockUserIntoDB(
            userId,
            adminId
        );

        res.status(200).json({
            success: true,
            message: "User blocked successfully",
            data: result,
        });
    }
);


// unblock user controller
// unblock user controller
const unblockUser = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.params.id as string;

        const result = await AdminServices.unblockUserIntoDB(userId);

        res.status(200).json({
            success: true,
            message: "User unblocked successfully",
            data: result,
        });
    }
);


// soft delete user

// Soft delete user
const softDeleteUser = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.params.id as string;
        const adminId = (req as any).user.id;

        const result =
            await AdminServices.softDeleteUserIntoDB(
                userId,
                adminId
            );

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: result,
        });
    }
);





export const AdminControllers = {
    getAllUsers,
    blockUser,
    unblockUser,
    softDeleteUser
};