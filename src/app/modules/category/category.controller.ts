import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { CategoryServices } from "./category.service";

const createCategory = catchAsync(
    async (req: Request, res: Response) => {
        const result = await CategoryServices.createCategory(
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: result,
        });
    }
);

const getAllCategories = catchAsync(
    async (req: Request, res: Response) => {
        const result = await CategoryServices.getAllCategories();

        res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            data: result,
        });
    }
);

export const CategoryControllers = {
    createCategory,
    getAllCategories,
};