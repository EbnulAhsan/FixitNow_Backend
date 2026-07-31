import express from "express";
import { AuthControllers } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/register",
    validateRequest(AuthValidation.registerValidationSchema),
    AuthControllers.registerUser
);


router.post(

    "/login",

    validateRequest(AuthValidation.loginValidationSchema),

    AuthControllers.loginUser
);

router.get(
    "/me",
    auth(),
    AuthControllers.getMe
);



export const AuthRoutes = router;