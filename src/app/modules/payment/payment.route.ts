

// payment route

import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { PaymentControllers } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

const router = express.Router();

router.post(
    "/create-payment-intent",
    auth("CUSTOMER"),
    validateRequest(
        PaymentValidation.createPaymentIntentValidationSchema
    ),
    PaymentControllers.createPaymentIntent
);

export const PaymentRoutes = router;