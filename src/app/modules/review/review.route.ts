import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewControllers } from "./review.controller";
import { ReviewValidation } from "./review.validation";

const router = express.Router();

router.post(
    "/",
    auth("CUSTOMER"),
    validateRequest(
        ReviewValidation.createReviewValidationSchema
    ),
    ReviewControllers.createReview
);

router.get(
    "/technician/:technicianId",
    validateRequest(
        ReviewValidation.getTechnicianReviewsValidationSchema
    ),
    ReviewControllers.getTechnicianReviews
);


router.patch(
    "/:id",
    auth("CUSTOMER"),
    validateRequest(
        ReviewValidation.updateReviewValidationSchema
    ),
    ReviewControllers.updateReview
);




export const ReviewRoutes = router;