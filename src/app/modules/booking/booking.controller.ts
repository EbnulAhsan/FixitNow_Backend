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














export const BookingControllers = {
    createBooking,
    getMyBookings
};