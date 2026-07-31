import prisma from "../../utils/prisma";
import { TCategory } from "./category.interface";

const createCategory = async (payload: TCategory) => {
    const isCategoryExists = await prisma.category.findUnique({
        where: {
            name: payload.name,
        },
    });

    if (isCategoryExists) {
        throw new Error("Category already exists");
    }

    const result = await prisma.category.create({
        data: payload,
    });

    return result;
};

const getAllCategories = async () => {
    const result = await prisma.category.findMany();

    return result;
};

export const CategoryServices = {
    createCategory,
    getAllCategories,
};