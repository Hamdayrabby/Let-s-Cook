import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path: "./.env",
});

import { User } from "./models/user.model.js";
import bcrypt from "bcryptjs";

connectDB()
    .then(async () => {
        app.on("error", (error) => {
            console.error("ERROR: ", error);
            throw error;
        });

        // Seed Admin User
        try {
            const adminExists = await User.findOne({ role: "admin" });
            if (!adminExists) {
                const adminPassword = await bcrypt.hash("admin", 10);
                await User.create({
                    username: "admin",
                    email: "admin@letscook.com",
                    password: "admin", // The pre-save hook will hash this, but we can also just pass the string if the model handles it. checking model...
                    // Model has pre-save hook: if (this.isModified("password")) ...
                    // So we can pass plain text "admin" and let the model hash it.
                    // Wait, if I manually hash it here AND the model hashes it, it might be double hashed?
                    // The model says: if (this.isModified("password")) { this.password = await bcrypt.hash(this.password, 10) }
                    // So I should pass PLAIN TEXT "admin".
                    role: "admin",
                    savedRecipes: []
                });
                console.log("Default admin user created: admin / admin");
            }
        } catch (error) {
            console.error("Error creating default admin:", error);
        }

        app.listen(process.env.PORT || 3002, () => {
            console.log(`APP listening on ${process.env.PORT}`);
        });
    })
    .catch((error) => {
         console.log("FAILED TO CONNECT DB!!!", error);
    });