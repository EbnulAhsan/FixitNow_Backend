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


//   get a single service id

router.get(
    "/:id",
    ServiceControllers.getSingleService
)

// update 
router.patch(
    "/:id",
    auth("TECHNICIAN"),
    validateRequest(
        ServiceValidation.updateServiceValidationSchema
    ),
    ServiceControllers.updateService
);

// for delete 
router.delete(
    "/:id",
    auth("TECHNICIAN"),
    ServiceControllers.deleteService
);

export const ServiceRoutes = router;