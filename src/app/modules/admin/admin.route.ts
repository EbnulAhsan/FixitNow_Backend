import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AdminControllers } from "./admin.controller";
import { AdminValidation } from "./admin.validation";
import { BookingControllers } from "../booking/booking.controller";
import { BookingValidation } from "../booking/booking.validation";
import { PaymentControllers } from "../payment/payment.controller";
import { PaymentValidation } from "../payment/payment.validation";


const router = express.Router();

router.get(
    "/users",
    auth("ADMIN"),
    validateRequest(
        AdminValidation.getAllUsersValidationSchema
    ),
    AdminControllers.getAllUsers
);

router.patch(
    "/users/:id/block",
    auth("ADMIN"),
    validateRequest(
        AdminValidation.userIdParamsValidationSchema
    ),
    AdminControllers.blockUser
);


router.patch(
    "/users/:id/unblock",
    auth("ADMIN"),
    validateRequest(
        AdminValidation.userIdParamsValidationSchema
    ),
    AdminControllers.unblockUser
);



router.patch(
    "/users/:id/soft-delete",
    auth("ADMIN"),
    validateRequest(
        AdminValidation.userIdParamsValidationSchema
    ),
    AdminControllers.softDeleteUser
);

router.get(
    "/bookings",
    auth("ADMIN"),
    validateRequest(
        BookingValidation.getAllBookingsForAdminValidationSchema
    ),
    BookingControllers.getAllBookingsForAdmin
);


router.get(
    "/payments",
    auth("ADMIN"),
    validateRequest(
        PaymentValidation.getAllPaymentsForAdminValidationSchema
    ),
    PaymentControllers.getAllPaymentsForAdmin
);


export const AdminRoutes = router;
