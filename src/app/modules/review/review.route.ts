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

router.delete(
    "/:id",
    auth("CUSTOMER"),
    validateRequest(
        ReviewValidation.deleteReviewValidationSchema
    ),
    ReviewControllers.deleteReview
);





export const ReviewRoutes = router;