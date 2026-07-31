import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TechnicianControllers } from "./technician.controller";
import { TechnicianValidation } from "./technician.validation";

const router = express.Router();

router.put(
    "/profile",
    auth("TECHNICIAN"),
    validateRequest(
        TechnicianValidation.upsertTechnicianProfileValidationSchema
    ),
    TechnicianControllers.upsertTechnicianProfile
);

export const TechnicianRoutes = router;
