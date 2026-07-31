import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { TechnicianServices } from "./technician.service";

const upsertTechnicianProfile = catchAsync(
    async (req: Request, res: Response) => {
        const userId = (req as any).user.id;

        const result =
            await TechnicianServices.upsertTechnicianProfile(
                userId,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Technician profile saved successfully",
            data: result,
        });
    }
);

export const TechnicianControllers = {
    upsertTechnicianProfile,
};