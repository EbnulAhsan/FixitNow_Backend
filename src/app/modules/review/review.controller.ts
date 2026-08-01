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

// update review controller

const updateReview = catchAsync(
    async (req: Request, res: Response) => {
        const reviewId = req.params.id as string;
        const customerId = (req as any).user.id;

        const result = await ReviewServices.updateReviewIntoDB(
            reviewId,
            customerId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: result,
        });
    }
);

// delete review controller

const deleteReview = catchAsync(
    async (req: Request, res: Response) => {
        const reviewId = req.params.id as string;
        const customerId = (req as any).user.id;

        const result = await ReviewServices.deleteReviewFromDB(
            reviewId,
            customerId
        );

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: result,
        });
    }
);




export const ReviewControllers = {
    createReview,
    getTechnicianReviews,
    updateReview,
    deleteReview
};