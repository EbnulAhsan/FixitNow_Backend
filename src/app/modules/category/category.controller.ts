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

// Update category
const updateCategory = catchAsync(
    async (req: Request, res: Response) => {
        const categoryId = req.params.id as string;

        const result =
            await CategoryServices.updateCategory(
                categoryId,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: result,
        });
    }
);


// Delete category
const deleteCategory = catchAsync(
    async (req: Request, res: Response) => {
        const categoryId = req.params.id as string;

        const result =
            await CategoryServices.deleteCategory(
                categoryId
            );

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: result,
        });
    }
);


export const CategoryControllers = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};