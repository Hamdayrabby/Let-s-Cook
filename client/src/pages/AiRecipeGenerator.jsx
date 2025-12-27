import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Input, Button, Tag, Select, Card, Spin, message, Space, Divider } from "antd";
import {
    ThunderboltOutlined,
    ExperimentOutlined,
    ClockCircleOutlined,
    FireOutlined,
    SaveOutlined,
    ArrowRightOutlined
} from "@ant-design/icons";
import Navbar from "../components/Navbar";
import API_BASE_URL from "../constant";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Option } = Select;

const AiRecipeGenerator = () => {
    const [ingredients, setIngredients] = useState([]);
    const [currentIngredient, setCurrentIngredient] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [cookingTime, setCookingTime] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [generatedRecipe, setGeneratedRecipe] = useState(null);

    const [cookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser?.data?.data?.user?._id;

    const handleAddIngredient = (e) => {
        e.preventDefault();
        if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
            setIngredients([...ingredients, currentIngredient.trim()]);
            setCurrentIngredient("");
        }
    };

    const removeIngredient = (tag) => {
        setIngredients(ingredients.filter((ingredient) => ingredient !== tag));
    };

    const handleGenerate = async () => {
        if (ingredients.length === 0) {
            message.error("Please add at least one ingredient!");
            return;
        }

        if (!cookies.access_token) {
            message.error("You must be logged in to generate recipes!");
            return;
        }

        console.log("Sending request with token:", cookies.access_token ? "Present" : "Missing");

        setIsLoading(true);
        setGeneratedRecipe(null);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/v1/ai/generate-recipe`,
                {
                    ingredients,
                    cuisine,
                    cookingTime,
                    difficulty
                },
                {
                    headers: { authorization: cookies.access_token }
                }
            );

            if (response.data.status === "success") {
                setGeneratedRecipe(response.data.data.recipe);
                message.success("Recipe generated successfully! ✨");
            }
        } catch (error) {
            console.error("AI Generation Error:", error);
            message.error("Failed to generate recipe. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveRecipe = async () => {
        if (!generatedRecipe) return;

        try {
            // Format recipe for saving to database
            const recipeToSave = {
                name: generatedRecipe.name,
                description: generatedRecipe.description,
                ingredients: generatedRecipe.ingredients,
                instructions: generatedRecipe.instructions,
                cookingTime: generatedRecipe.cookingTime,
                recipeImg: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Default pleasant food image placeholder
                userOwner: userId,
                status: "pending" // Keep AI recipes private - only visible to creator
            };

            // First, create the recipe
            const createResponse = await axios.post(
                `${API_BASE_URL}/api/v1/recipe/create`,
                recipeToSave,
                {
                    headers: { authorization: cookies.access_token }
                }
            );

            const createdRecipe = createResponse.data.data;

            // Then, add it to user's saved recipes
            await axios.put(
                `${API_BASE_URL}/api/v1/recipe/save`,
                {
                    recipeID: createdRecipe._id,
                    userID: userId
                },
                {
                    headers: { authorization: cookies.access_token }
                }
            );

            message.success("Recipe saved to your collection!");
            navigate("/saved-recipes");
        } catch (error) {
            console.error("Save Error:", error);
            message.error("Failed to save recipe.");
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#171717", color: "#a3a3a3" }}>
            <Navbar />
            <div style={{ padding: "40px 60px" }}>
                {/* Header */}
                <div style={{ marginBottom: "40px", textAlign: "center" }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "16px",
                        marginBottom: "16px"
                    }}>
                        <div style={{
                            width: "64px",
                            height: "64px",
                            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 10px 20px rgba(139, 92, 246, 0.3)"
                        }}>
                            <ExperimentOutlined style={{ fontSize: "32px", color: "white" }} />
                        </div>
                    </div>
                    <h1 style={{ fontSize: "48px", color: "#fff", fontWeight: "bold", margin: 0 }}>
                        AI Recipe Generator
                    </h1>
                    <p style={{ fontSize: "18px", color: "#a3a3a3", marginTop: "8px" }}>
                        Transform your ingredients into magic with Gemini AI ✨
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>
                    {/* Input Section */}
                    <div style={{
                        backgroundColor: "#262626",
                        padding: "32px",
                        borderRadius: "24px",
                        border: "1px solid #404040"
                    }}>
                        <h3 style={{ color: "white", fontSize: "20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <ThunderboltOutlined style={{ color: "#ec4899" }} /> Configuration
                        </h3>

                        {/* Ingredients Input */}
                        <div style={{ marginBottom: "24px" }}>
                            <label style={{ display: "block", color: "#fff", marginBottom: "8px", fontWeight: "500" }}>
                                What ingredients do you have?
                            </label>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                                <Input
                                    placeholder="e.g. Chicken, Tomatoes, Basil"
                                    value={currentIngredient}
                                    onChange={(e) => setCurrentIngredient(e.target.value)}
                                    onPressEnter={handleAddIngredient}
                                    style={{
                                        backgroundColor: "#171717",
                                        borderColor: "#404040",
                                        color: "white",
                                        borderRadius: "8px"
                                    }}
                                />
                                <Button
                                    type="primary"
                                    onClick={handleAddIngredient}
                                    style={{
                                        background: "#262626",
                                        borderColor: "#8b5cf6",
                                        color: "#8b5cf6"
                                    }}
                                >
                                    Add
                                </Button>
                            </div>
                            <div style={{ minHeight: "40px" }}>
                                {ingredients.map(tag => (
                                    <Tag
                                        closable
                                        onClose={() => removeIngredient(tag)}
                                        key={tag}
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: "6px",
                                            fontSize: "14px",
                                            marginBottom: "8px",
                                            backgroundColor: "rgba(139, 92, 246, 0.1)",
                                            borderColor: "#8b5cf6",
                                            color: "#c4b5fd"
                                        }}
                                    >
                                        {tag}
                                    </Tag>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "32px" }}>
                            <div>
                                <label style={{ display: "block", color: "#a3a3a3", marginBottom: "8px", fontSize: "12px" }}>CUISINE</label>
                                <Select
                                    placeholder="Any"
                                    style={{ width: "100%" }}
                                    onChange={setCuisine}
                                    className="ai-select"
                                    dropdownStyle={{ backgroundColor: "#262626" }}
                                >
                                    <Option value="Italian">Italian 🍝</Option>
                                    <Option value="Mexican">Mexican 🌮</Option>
                                    <Option value="Indian">Indian 🍛</Option>
                                    <Option value="Chinese">Chinese 🥡</Option>
                                    <Option value="Japanese">Japanese 🍱</Option>
                                    <Option value="American">American 🍔</Option>
                                </Select>
                            </div>
                            <div>
                                <label style={{ display: "block", color: "#a3a3a3", marginBottom: "8px", fontSize: "12px" }}>TIME</label>
                                <Select
                                    placeholder="Any"
                                    style={{ width: "100%" }}
                                    onChange={setCookingTime}
                                >
                                    <Option value="15 min">Quick (15m)</Option>
                                    <Option value="30 min">Medium (30m)</Option>
                                    <Option value="60 min">Long (1h+)</Option>
                                </Select>
                            </div>
                            <div>
                                <label style={{ display: "block", color: "#a3a3a3", marginBottom: "8px", fontSize: "12px" }}>DIFFICULTY</label>
                                <Select
                                    placeholder="Any"
                                    style={{ width: "100%" }}
                                    onChange={setDifficulty}
                                >
                                    <Option value="Easy">Beginner</Option>
                                    <Option value="Medium">Intermediate</Option>
                                    <Option value="Hard">Advanced</Option>
                                </Select>
                            </div>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={handleGenerate}
                            loading={isLoading}
                            icon={!isLoading && <ExperimentOutlined />}
                            style={{
                                height: "56px",
                                borderRadius: "12px",
                                fontSize: "18px",
                                fontWeight: "bold",
                                background: "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)",
                                border: "none",
                                boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)"
                            }}
                        >
                            {isLoading ? "Brewing Magic..." : "Generate Recipe"}
                        </Button>
                    </div>

                    {/* Results Section */}
                    <div style={{
                        minHeight: "500px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: generatedRecipe ? "start" : "center",
                        alignItems: generatedRecipe ? "stretch" : "center"
                    }}>
                        {!generatedRecipe && !isLoading && (
                            <div style={{ textAlign: "center", color: "#525252" }}>
                                <div style={{
                                    fontSize: "64px",
                                    marginBottom: "16px",
                                    opacity: 0.2,
                                    filter: "grayscale(100%)"
                                }}>
                                    ✨
                                </div>
                                <p>Your AI-generated recipe will appear here</p>
                            </div>
                        )}

                        {isLoading && (
                            <div style={{ textAlign: "center", padding: "60px" }}>
                                <Spin size="large" />
                                <p style={{ marginTop: "24px", color: "#ec4899", fontSize: "16px" }}>
                                    Consulting the digital chef...
                                </p>
                            </div>
                        )}

                        {generatedRecipe && (
                            <Card
                                className="generated-recipe-card"
                                style={{
                                    backgroundColor: "#262626",
                                    borderColor: "#404040",
                                    borderRadius: "24px",
                                    overflow: "hidden"
                                }}
                                bodyStyle={{ padding: "0" }}
                            >
                                <div style={{
                                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
                                    padding: "32px",
                                    borderBottom: "1px solid #404040"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                        <div>
                                            <h2 style={{ color: "white", fontSize: "28px", margin: "0 0 8px 0" }}>
                                                {generatedRecipe.name}
                                            </h2>
                                            <p style={{ color: "#a3a3a3", fontSize: "16px", margin: 0 }}>
                                                {generatedRecipe.description}
                                            </p>
                                        </div>
                                        <Button
                                            type="primary"
                                            shape="round"
                                            icon={<SaveOutlined />}
                                            onClick={handleSaveRecipe}
                                            style={{
                                                backgroundColor: "#52c41a",
                                                borderColor: "#52c41a",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Save Recipe
                                        </Button>
                                    </div>

                                    <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
                                        <Tag icon={<ClockCircleOutlined />} color="warning">
                                            {generatedRecipe.cookingTime} mins
                                        </Tag>
                                        <Tag icon={<FireOutlined />} color="error">
                                            {generatedRecipe.difficulty || "Medium"}
                                        </Tag>
                                        <Tag color="purple">
                                            {generatedRecipe.calories ? `${generatedRecipe.calories} kcal` : "Healthy"}
                                        </Tag>
                                    </div>
                                </div>

                                <div style={{ padding: "32px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px" }}>
                                        <div>
                                            <h4 style={{ color: "#ec4899", textTransform: "uppercase", letterSpacing: "1px", fontSize: "12px", marginBottom: "16px" }}>
                                                Ingredients
                                            </h4>
                                            <ul style={{ paddingLeft: "16px", color: "#e5e5e5" }}>
                                                {generatedRecipe.ingredients.map((ing, i) => (
                                                    <li key={i} style={{ marginBottom: "8px" }}>{ing}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 style={{ color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "1px", fontSize: "12px", marginBottom: "16px" }}>
                                                Instructions
                                            </h4>
                                            <div style={{ color: "#d4d4d4", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                                                {generatedRecipe.instructions}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiRecipeGenerator;
