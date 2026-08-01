import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ServiceServices } from "./service.service";

const createService = catchAsync(
    async (req: Request, res: Response) => {
        const userId = (req as any).user.id;

        const result = await ServiceServices.createService(
            userId,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: result,
        });
    }
);

const getAllServices = catchAsync(
    async (req: Request, res: Response) => {
        const result = await ServiceServices.getAllServices(
            req.query
        );

        res.status(200).json({
            success: true,
            message: "Services retrieved successfully",
            data: result,
        });
    }
);


// get single service by id

const getSingleService = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ServiceServices.getSingleServiceFromDB(id as string);

    res.status(200).json({
        success: true,
        message: "Service retrieved successfully",
        data: result,
    });
});

// update service controller 

const updateService = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const userId = (req as any).user.id;

    const result = await ServiceServices.updateServiceIntoDB(
        id as string,
        userId,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Service updated successfully",
        data: result,
    });
});


// delete service controller

const deleteService = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const result = await ServiceServices.deleteServiceFromDB(
        id as string,
        userId
    );

    res.status(200).json({
        success: true,
        message: "Service deleted successfully",
        data: result,
    });
});
















export const ServiceControllers = {
    createService,
    getAllServices,
    getSingleService,
    updateService,
    deleteService
};