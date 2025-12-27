import { Router } from "express";
import {
    getAllRecipes,
    createRecipe,
    savedRecipe,
    getSavedRecipe,
    getIdsOfSavedRecipes,
    getUserRecipes,
    deleteUserRecipes,
    updateUserRecipe,
    removeSaveRecipe,
    getRecipeById,
    getPendingRecipes,
    updateRecipeStatus
} from "../controllers/recipe.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router()

router.route("/").get(getAllRecipes)
router.route("/create").post(createRecipe)
router.route("/save").put(savedRecipe)
router.route("/savedRecipes/ids/:userId").get(getIdsOfSavedRecipes)
router.route("/savedRecipes/:userId").get(getSavedRecipe)
router.route("/userRecipes/:userId").get(getUserRecipes)
router.route("/:id").get(getRecipeById)
router.route("/delete/:recipeId").delete(deleteUserRecipes)
router.route("/update/:recipeId").put(updateUserRecipe)
router.route("/removeSaved/:recipeId/:userId").put(removeSaveRecipe)

// Admin Routes - Protected with authentication and admin role verification
router.route("/admin/pending").get(verifyToken, verifyAdmin, getPendingRecipes);
router.route("/admin/status/:recipeId").put(verifyToken, verifyAdmin, updateRecipeStatus);

export default router