
// payment controller

import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { PaymentServices } from "./payment.service";
import config from "../../config";
import { AppError } from "../../utils/appError";
import stripe from "../../utils/stripe";

const createPaymentIntent = catchAsync(
    async (req: Request, res: Response) => {
        const customerId = (req as any).user.id;

        const result =
            await PaymentServices.createPaymentIntentIntoDB(
                customerId,
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Payment intent created successfully",
            data: result,
        });
    }
);

// stripe webhook controller

const handleStripeWebhook = catchAsync(
    async (req: Request, res: Response) => {
        const signature = req.headers["stripe-signature"];

        if (!signature) {
            throw new AppError(
                400,
                "Stripe signature is missing"
            );
        }

        if (!config.stripe_webhook_secret) {
            throw new AppError(
                500,
                "Stripe webhook secret is not configured"
            );
        }

        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            config.stripe_webhook_secret
        );

        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;

            await PaymentServices.completePaymentIntoDB(
                paymentIntent.id,
                paymentIntent.amount_received,
                paymentIntent.currency
            );
        }

        res.status(200).json({
            success: true,
            message: "Stripe webhook received successfully",
        });
    }
);




export const PaymentControllers = {
    createPaymentIntent,
    handleStripeWebhook
};
