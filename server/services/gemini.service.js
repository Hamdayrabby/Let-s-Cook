import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini API
if (!process.env.GEMINI_API_KEY) {
  console.error("CRITICAL: GEMINI_API_KEY is missing in .env file");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateRecipeMetadata = async (ingredients, cuisine, cookingTime, difficulty) => {
  try {
    // Use gemini-pro as it's the stable model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Create a unique and delicious recipe using these ingredients: ${ingredients.join(", ")}.
      ${cuisine ? `Cuisine style: ${cuisine}` : ""}
      ${cookingTime ? `Preferred cooking time: ${cookingTime}` : ""}
      ${difficulty ? `Difficulty level: ${difficulty}` : ""}
      
      The output MUST be a valid JSON object with NO markdown formatting, NO backticks, and NO extra text.
      Use this exact structure:
      {
        "name": "Creative Recipe Name",
        "description": "A brief appetizing description (2-3 sentences)",
        "ingredients": ["List of ingredients with quantities"],
        "instructions": "Step-by-step cooking instructions with newline characters for formatting",
        "cookingTime": 30,
        "difficulty": "Easy/Medium/Hard",
        "calories": 500
      }
    `;

    console.log("Using Gemini API Key exists:", !!process.env.GEMINI_API_KEY);
    console.log("API Key (first 10 chars):", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + "..." : "NOT FOUND");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini Raw Response:", text);

    // Clean string to remove any markdown code blocks if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating recipe with Gemini:", error);
    // Log more details if available
    if (error.response) {
      console.error("Gemini API Error details:", JSON.stringify(error.response, null, 2));
    }
    throw new Error("Failed to generate recipe");
  }
};
