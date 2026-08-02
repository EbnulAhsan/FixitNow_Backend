import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidation } from "./category.validation";
import { CategoryControllers } from "./category.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  auth("ADMIN"),
  validateRequest(
    CategoryValidation.createCategoryValidationSchema
  ),
  CategoryControllers.createCategory
);

router.get(
  "/",
  CategoryControllers.getAllCategories
);


router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(
    CategoryValidation.updateCategoryValidationSchema
  ),
  CategoryControllers.updateCategory
);

router.delete(
  "/:id",
  auth("ADMIN"),
  validateRequest(
    CategoryValidation.deleteCategoryValidationSchema
  ),
  CategoryControllers.deleteCategory
);




export const CategoryRoutes = router;