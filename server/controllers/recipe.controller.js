// Import necessary models and utils
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Recipe } from "../models/recipe.model.js";
import { User } from "../models/user.model.js";

// Search recipes by name or description
const searchRecipes = asyncHandler(async (req, res) => {
    const { query } = req.query; // Extract the query parameter from the request

    if (!query) {
        throw new ApiError(400, "Search query is required"); // Throw error if no query is provided
    }

    try {
        // Search for recipes that match the name or description using a case-insensitive regular expression
        const recipes = await Recipe.find({
            $or: [
                { name: { $regex: query, $options: "i" } }, // Search in recipe name
                { description: { $regex: query, $options: "i" } } // Search in description
            ]
        });

        return res.status(200).json(new ApiResponse(200, recipes, `Search results for "${query}"`));
    } catch (error) {
        throw new ApiError(500, `Error during search: ${error.message}`);
    }
});

// Other controllers

const getAllRecipes = asyncHandler(async(_, resp) => {
    try {
        const recipe = await Recipe.find({ status: 'approved' });
        return resp.status(200).json(
            new ApiResponse(200, recipe, `All approved recipes fetched successfully`)
        );
    } catch (error) {
        throw new ApiError(400, `Couldn't find recipes ${error}`);
    }
});

// Create recipe
const createRecipe = asyncHandler(async(req, resp) => {
    const recipe = new Recipe(req.body);
    try {
        const response = await recipe.save();
        return resp.status(200).json(
            new ApiResponse(200, response, `Recipe created successfully`)
        );
    } catch (error) {
        throw new ApiError(400, `Couldn't Create Recipe : ${error}`);
    }
});

// Save recipe
const savedRecipe = asyncHandler(async(req, resp) => {
    const recipe = await Recipe.findById(req.body.recipeID);
    const user = await User.findById(req.body.userID);

    try {
        user.savedRecipes.push(recipe);
        await user.save();
        resp.status(201).json(
            new ApiResponse(200, { savedRecipes: user.savedRecipes }, `Recipe Saved successfully`));
    } catch (err) {
        throw new ApiError(400, `Couldn't Save Recipe ${err}`);
    }
});

// IDs of saved recipes
const getIdsOfSavedRecipes = asyncHandler(async(req, resp) => {
    try {
        const user = await User.findById(req.params.userId);
        resp.status(201).json(new ApiResponse(200, user, `Recipe saved successfully`));
    } catch (error) {
        throw new ApiError(400, `Couldn't get IDs of saved recipes`);
    }
});

// Get saved recipe
const getSavedRecipe = asyncHandler(async(req, resp) => {
    try {
        const user = await User.findById(req.params.userId);
        const savedRecipes = await Recipe.find({
            _id: { $in: user.savedRecipes },
        });

        resp.status(201).json(new ApiResponse(200, savedRecipes, `Saved recipes fetched successfully`));
    } catch (error) {
        throw new ApiError(400, `Couldn't find saved recipes`);
    }
});

// Get user recipes
const getUserRecipes = asyncHandler(async(req, resp) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        throw new ApiError(400, `User not found`);
    }

    try {
        const userRecipes = await Recipe.find({ userOwner: user._id });
        return resp.status(200).json(new ApiResponse(200, userRecipes, `Recipes fetched successfully`));
    } catch (error) {
        throw new ApiError(400, `User not found : ${error}`);
    }
});

// User recipe (delete)
const deleteUserRecipes = asyncHandler(async(req, resp) => {
    const recipe = await Recipe.findByIdAndDelete(req.params.recipeId);
    console.log(recipe);

    if (!recipe) {
        throw new ApiError(400, `Recipe not found`);
    } else {
        return resp.status(200).json(new ApiResponse(202, `Recipe deleted`));
    }
});

// User recipe (update)
const updateUserRecipe = asyncHandler(async(req, resp) => {
    const recipe = req.params.recipeId;
    const updateFields = req.body;

    if (!recipe) {
        throw new ApiError(400, `Recipe not found`);
    }

    if (!updateFields) {
        throw new ApiError(400, `Updated fields not found`);
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
        recipe,
        updateFields, { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
        throw new ApiError(400, `Recipe not found`);
    }

    return resp.status(200)
        .json(new ApiResponse(200, updateFields, "Recipe Updated Successfully"));
});

// Remove saved recipes
const removeSaveRecipe = asyncHandler(async(req, res) => {
    const userId = req.params.userId;
    const recipeId = req.params.recipeId;

    if (!userId) {
        throw new ApiError(400, `User not found`);
    }

    if (!recipeId) {
        throw new ApiError(400, `Recipe not found`);
    }

    const user = await User.findByIdAndUpdate(
        userId, { $pull: { savedRecipes: recipeId } }, 
        { new: true } 
    );

    if (!user) {
        throw new ApiError(404, `User not found`);
    }

    res.status(200).json(new ApiResponse(200, `Recipe removed from saved`, { savedRecipes: user.savedRecipes }));
});

// Get specific recipe by ID
const getRecipeById = asyncHandler(async (req, resp) => {
    const recipeId = req.params.id;

    if (!recipeId) {
        throw new ApiError(400, `Recipe not found`);
    }

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
        throw new ApiError(400, `Recipe not found`);
    }

    resp.status(200).json(new ApiResponse(200, recipe, "Recipe fetched successfully"));
});




// Admin: Get pending recipes
const getPendingRecipes = asyncHandler(async (req, res) => {
    try {
        const recipes = await Recipe.find({ status: 'pending' });
        return res.status(200).json(new ApiResponse(200, recipes, "Pending recipes fetched successfully"));
    } catch (error) {
        throw new ApiError(500, `Error fetching pending recipes: ${error.message}`);
    }
});

// Admin: Update recipe status
const updateRecipeStatus = asyncHandler(async (req, res) => {
    const { recipeId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    try {
        const recipe = await Recipe.findByIdAndUpdate(
            recipeId,
            { status },
            { new: true }
        );

        if (!recipe) {
            throw new ApiError(404, "Recipe not found");
        }

        return res.status(200).json(new ApiResponse(200, recipe, `Recipe status updated to ${status}`));
    } catch (error) {
        throw new ApiError(500, `Error updating recipe status: ${error.message}`);
    }
});

export {
    getAllRecipes,
    createRecipe,
    savedRecipe,
    getIdsOfSavedRecipes,
    getSavedRecipe,
    getUserRecipes,
    deleteUserRecipes,
    updateUserRecipe,
    removeSaveRecipe,
    getRecipeById,
    searchRecipes, // Export the new search function
    getPendingRecipes,
    updateRecipeStatus
   
};
