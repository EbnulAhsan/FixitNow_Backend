import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BookingControllers } from "./booking.controller";
import { BookingValidation } from "./booking.validation";

const router = express.Router();

router.post(
    "/",
    auth("CUSTOMER"),
    validateRequest(
        BookingValidation.createBookingValidationSchema
    ),
    BookingControllers.createBooking
);


router.get(
    "/my-bookings",
    auth("CUSTOMER"),
    BookingControllers.getMyBookings
);

export const BookingRoutes = router;