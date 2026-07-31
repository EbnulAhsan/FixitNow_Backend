import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ServiceControllers } from "./service.controller";
import { ServiceValidation } from "./service.validation";

const router = express.Router();

router.post(
    "/",
    auth("TECHNICIAN"),
    validateRequest(
        ServiceValidation.createServiceValidationSchema
    ),
    ServiceControllers.createService
);

export const ServiceRoutes = router;