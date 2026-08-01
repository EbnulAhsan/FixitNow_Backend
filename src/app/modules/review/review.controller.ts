import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ReviewServices } from "./review.service";

const createReview = catchAsync(
    async (req: Request, res: Response) => {
        const customerId = (req as any).user.id;

        const result = await ReviewServices.createReviewIntoDB(
            customerId,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            data: result,
        });
    }
);

// get technician review controller

const getTechnicianReviews = catchAsync(
    async (req: Request, res: Response) => {
        const technicianId = req.params.technicianId as string;

        const result =
            await ReviewServices.getTechnicianReviewsFromDB(
                technicianId
            );

        res.status(200).json({
            success: true,
            message: "Technician reviews retrieved successfully",
            data: result,
        });
    }
);




export const ReviewControllers = {
    createReview,
    getTechnicianReviews
};