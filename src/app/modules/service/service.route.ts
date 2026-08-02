import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ServiceControllers } from "./service.controller";
import { ServiceValidation } from "./service.validation";

const router = express.Router();

router.get(
    "/",
    validateRequest(
        ServiceValidation.getAllServicesValidationSchema
    ),
    ServiceControllers.getAllServices
);

router.post(
    "/",
    auth("TECHNICIAN"),
    validateRequest(
        ServiceValidation.createServiceValidationSchema
    ),
    ServiceControllers.createService
);

// Get a single service
router.get(
    "/:id",
    validateRequest(
        ServiceValidation.serviceIdParamsValidationSchema
    ),
    ServiceControllers.getSingleService
);

// Update a service
router.patch(
    "/:id",
    auth("TECHNICIAN"),
    validateRequest(
        ServiceValidation.updateServiceValidationSchema
    ),
    ServiceControllers.updateService
);

router.delete(
    "/:id",
    auth("TECHNICIAN"),
    validateRequest(
        ServiceValidation.serviceIdParamsValidationSchema
    ),
    ServiceControllers.deleteService
);




export const ServiceRoutes = router;