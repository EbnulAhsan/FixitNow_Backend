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

router.get(
    "/my-payments",
    auth("CUSTOMER"),
    PaymentControllers.getMyPayments
);

router.post(
    "/webhook",
    PaymentControllers.handleStripeWebhook
);

router.post(
    "/confirm",
    auth("CUSTOMER"),
    PaymentControllers.confirmPayment
);

export const PaymentRoutes = router;