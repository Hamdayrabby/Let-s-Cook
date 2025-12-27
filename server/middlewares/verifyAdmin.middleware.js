import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
    try {
        // At this point, req.user should be set by verifyToken middleware
        if (!req.user) {
            throw new ApiError(401, "Authentication required");
        }

        if (req.user.role !== 'admin') {
            throw new ApiError(403, "Access denied. Admin privileges required.");
        }

        next();
    } catch (error) {
        throw new ApiError(403, error?.message || "Admin access required");
    }
});
