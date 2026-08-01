import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AdminControllers } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = express.Router();

router.get(
    "/users",
    auth("ADMIN"),
    validateRequest(
        AdminValidation.getAllUsersValidationSchema
    ),
    AdminControllers.getAllUsers
);

router.patch(
    "/users/:id/block",
    auth("ADMIN"),
    validateRequest(
        AdminValidation.userIdParamsValidationSchema
    ),
    AdminControllers.blockUser
);

export const AdminRoutes = router;
