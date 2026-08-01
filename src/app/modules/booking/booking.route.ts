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


router.get(
    "/technician-bookings",
    auth("TECHNICIAN"),
    BookingControllers.getTechnicianBookings
);


router.patch(
    "/:id/status",
    auth("TECHNICIAN"),
    validateRequest(
        BookingValidation.updateBookingStatusValidationSchema
    ),
    BookingControllers.updateBookingStatus
);

router.patch(
    "/:id/cancel",
    auth("CUSTOMER"),
    validateRequest(
        BookingValidation.cancelBookingValidationSchema
    ),
    BookingControllers.cancelBooking
);

export const BookingRoutes = router;