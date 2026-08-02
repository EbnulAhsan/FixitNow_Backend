import { AppError } from "../../utils/appError";
import prisma from "../../utils/prisma";
import { TCategory } from "./category.interface";

const createCategory = async (payload: TCategory) => {
    const categoryName = payload.name.trim();

    const existingCategory =
        await prisma.category.findFirst({
            where: {
                name: {
                    equals: categoryName,
                    mode: "insensitive",
                },
            },
        });

    if (existingCategory) {
        throw new AppError(
            409,
            "Category already exists"
        );
    }

    const result = await prisma.category.create({
        data: {
            ...payload,
            name: categoryName,
        },
    });

    return result;
};

const getAllCategories = async () => {
    const result = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};

// Update category
const updateCategory = async (
    categoryId: string,
    payload: Partial<TCategory>
) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (!category) {
        throw new AppError(
            404,
            "Category not found"
        );
    }

    const categoryName = payload.name?.trim();

    if (categoryName) {
        const duplicateCategory =
            await prisma.category.findFirst({
                where: {
                    name: {
                        equals: categoryName,
                        mode: "insensitive",
                    },
                    NOT: {
                        id: categoryId,
                    },
                },
            });

        if (duplicateCategory) {
            throw new AppError(
                409,
                "Category already exists"
            );
        }
    }

    const result = await prisma.category.update({
        where: {
            id: categoryId,
        },
        data: {
            ...payload,
            ...(categoryName
                ? { name: categoryName }
                : {}),
        },
    });

    return result;
};


// Delete category
const deleteCategory = async (
    categoryId: string
) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
        include: {
            _count: {
                select: {
                    services: true,
                },
            },
        },
    });

    if (!category) {
        throw new AppError(
            404,
            "Category not found"
        );
    }

    if (category._count.services > 0) {
        throw new AppError(
            409,
            "Category cannot be deleted because it has associated services"
        );
    }

    const result = await prisma.category.delete({
        where: {
            id: categoryId,
        },
    });

    return result;
};

export const CategoryServices = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};