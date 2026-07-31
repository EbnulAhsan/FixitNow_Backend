import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidation } from "./category.validation";
import { CategoryControllers } from "./category.controller";

const router = express.Router();

router.post(
  "/",
  validateRequest(
    CategoryValidation.createCategoryValidationSchema
  ),
  CategoryControllers.createCategory
);

router.get(
  "/",
  CategoryControllers.getAllCategories
);



// router.post(
//     "/",
//     CategoryControllers.createCategory
// );
export const CategoryRoutes = router;