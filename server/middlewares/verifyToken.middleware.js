import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const token = req.headers?.authorization;
        console.log("VerifyToken - Received Token:", token ? `${token.substring(0, 10)}...` : "NONE");

        if (!token) {
            throw new ApiError(401, "Access token is required");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("VerifyToken - Decoded:", decodedToken ? "Success" : "Failed");

        if (!decodedToken) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("VerifyToken - Error:", error.message);
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
