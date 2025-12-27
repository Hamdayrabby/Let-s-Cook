import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors());

app.use(express.json({ limit: "900kb" }));
app.use(express.urlencoded({ extended: true, limit: "900kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Root route to check API status
app.get("/", (req, res) => {
    res.status(200).json({ message: "API works fine" });
  });
  
// routes

import userRoute from "./routes/user.route.js";
import recipeRoute from "./routes/recipe.route.js"

import aiRoute from "./routes/ai.route.js";

// routes declaration

app.use("/api/v1/users/", userRoute);
app.use("/api/v1/recipe/", recipeRoute);
app.use("/api/v1/ai/", aiRoute);

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || []
    });
});

export { app }