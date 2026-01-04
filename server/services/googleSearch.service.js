/**
 * Returns a default image for AI-generated recipes
 * @param {string} query - The recipe name (unused, kept for API compatibility)
 * @returns {Promise<string>} - URL of the default AI recipe image
 */
export const fetchRecipeImage = async (query) => {
    // Return a high-quality default food image for AI-generated recipes
    // Using Unsplash's reliable food image
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
};
