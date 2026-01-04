import express from "express";
import { generateRecipeMetadata } from "../services/gemini.service.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

import { fetchRecipeImage } from "../services/googleSearch.service.js";

const router = express.Router();

// router.post("/generate-recipe", verifyToken, async (req, res) => {
router.post("/generate-recipe", async (req, res) => {
  try {
    const { ingredients, cuisine, cookingTime, difficulty } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a list of ingredients"
      });
    }

    // 1. Generate recipe text metadata
    const recipe = await generateRecipeMetadata(ingredients, cuisine, cookingTime, difficulty);

    // 2. Fetch relevant image
    const image = await fetchRecipeImage(recipe.name);

    // 3. Combine result
    recipe.image = image;

    res.status(200).json({
      status: "success",
      data: { recipe }
    });
  } catch (error) {
    console.error("AI Generation Error:", error);

    // Check for specific Gemini/Google API errors
    if (error.message?.includes("API key") || error.message?.includes("403")) {
      return res.status(403).json({
        status: "error",
        message: "Invalid or missing Gemini API Key. Please check your server .env file."
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message || "Failed to generate recipe. Please try again."
    });
  }
});

export default router;
