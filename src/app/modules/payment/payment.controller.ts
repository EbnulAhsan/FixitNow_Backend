
// payment controller

import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { PaymentServices } from "./payment.service";

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

export const PaymentControllers = {
    createPaymentIntent,
};
