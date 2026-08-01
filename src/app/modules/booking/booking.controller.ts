import { AppError } from "../../utils/appError";
import prisma from "../../utils/prisma";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { BookingServices } from "./booking.service";

const createBooking = catchAsync(
    async (req: Request, res: Response) => {
        const customerId = (req as any).user.id;

        const result = await BookingServices.createBookingIntoDB(
            customerId,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    }
);


const getMyBookings = catchAsync(
    async (req: Request, res: Response) => {
        const customerId = (req as any).user.id;

        const result = await BookingServices.getMyBookingsFromDB(
            customerId
        );

        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result,
        });
    }
);

// technician booking controller

const getTechnicianBookings = catchAsync(
    async (req: Request, res: Response) => {
        const userId = (req as any).user.id;

        const result =
            await BookingServices.getTechnicianBookingsFromDB(userId);

        res.status(200).json({
            success: true,
            message: "Technician bookings retrieved successfully",
            data: result,
        });
    }
);


// update booking controller

const updateBookingStatus = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const result =
            await BookingServices.updateBookingStatusIntoDB(
                id as string,
                userId,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            data: result,
        });
    }
);

// cancelbooking  controller 
const cancelBooking = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const customerId = (req as any).user.id;

        const result = await BookingServices.cancelBookingIntoDB(
            id as string,
            customerId
        );

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: result,
        });
    }
);














export const BookingControllers = {
    createBooking,
    getMyBookings,
    getTechnicianBookings,
    updateBookingStatus,
    cancelBooking
};