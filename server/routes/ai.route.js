import express from "express";
import { generateRecipeMetadata } from "../services/gemini.service.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

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

    const recipe = await generateRecipeMetadata(ingredients, cuisine, cookingTime, difficulty);

    res.status(200).json({
      status: "success",
      data: { recipe }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: "error", 
      message: "Failed to generate recipe. Please try again." 
    });
  }
});

export default router;
