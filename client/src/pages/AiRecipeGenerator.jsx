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
import "../styles/aiRecipeGenerator.css";

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
        <div className="ai-generator-container">
            <Navbar />
            <div className="ai-generator-content">
                {/* Header */}
                <div className="ai-header">
                    <div className="ai-icon-wrapper">
                        <div className="ai-icon-container">
                            <ExperimentOutlined style={{ fontSize: "32px", color: "white" }} />
                        </div>
                    </div>
                    <h1 className="ai-title">
                        AI Recipe Generator
                    </h1>
                    <p className="ai-subtitle">
                        Transform your ingredients into magic with Gemini AI ✨
                    </p>
                </div>

                <div className="ai-main-grid">
                    {/* Input Section */}
                    <div className="ai-input-section">
                        <h3 className="ai-section-title">
                            <ThunderboltOutlined style={{ color: "#ec4899" }} /> Configuration
                        </h3>

                        {/* Ingredients Input */}
                        <div className="ai-ingredients-container">
                            <label className="ai-label">
                                What ingredients do you have?
                            </label>
                            <div className="ai-input-group">
                                <Input
                                    placeholder="e.g. Chicken, Tomatoes, Basil"
                                    value={currentIngredient}
                                    onChange={(e) => setCurrentIngredient(e.target.value)}
                                    onPressEnter={handleAddIngredient}
                                    className="ai-input"
                                />
                                <Button
                                    type="primary"
                                    onClick={handleAddIngredient}
                                    className="ai-add-button"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="ai-tags-container">
                                {ingredients.map(tag => (
                                    <Tag
                                        closable
                                        onClose={() => removeIngredient(tag)}
                                        key={tag}
                                        className="ai-tag"
                                    >
                                        {tag}
                                    </Tag>
                                ))}
                            </div>
                        </div>

                        <div className="ai-options-grid">
                            <div>
                                <label className="ai-option-label">CUISINE</label>
                                <Select
                                    placeholder="Any"
                                    style={{ width: "100%" }}
                                    onChange={setCuisine}
                                    className="ai-select"
                                    popupClassName="ai-select-dropdown"
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
                                <label className="ai-option-label">TIME</label>
                                <Select
                                    placeholder="Any"
                                    style={{ width: "100%" }}
                                    onChange={setCookingTime}
                                    popupClassName="ai-select-dropdown"
                                    dropdownStyle={{ backgroundColor: "#262626" }}
                                >
                                    <Option value="15 min">Quick (15m)</Option>
                                    <Option value="30 min">Medium (30m)</Option>
                                    <Option value="60 min">Long (1h+)</Option>
                                </Select>
                            </div>
                            <div>
                                <label className="ai-option-label">DIFFICULTY</label>
                                <Select
                                    placeholder="Any"
                                    style={{ width: "100%" }}
                                    onChange={setDifficulty}
                                    popupClassName="ai-select-dropdown"
                                    dropdownStyle={{ backgroundColor: "#262626" }}
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
                            className="ai-generate-button"
                        >
                            {isLoading ? "Brewing Magic..." : "Generate Recipe"}
                        </Button>
                    </div>

                    {/* Results Section */}
                    <div className={`ai-results-section ${generatedRecipe ? 'has-recipe' : ''}`}>
                        {!generatedRecipe && !isLoading && (
                            <div className="ai-empty-state">
                                <div className="ai-empty-icon">
                                    ✨
                                </div>
                                <p>Your AI-generated recipe will appear here</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="ai-loading-state">
                                <Spin size="large" />
                                <p className="ai-loading-text">
                                    Consulting the digital chef...
                                </p>
                            </div>
                        )}

                        {generatedRecipe && (
                            <Card
                                className="generated-recipe-card"
                                bodyStyle={{ padding: "0" }}
                            >
                                <div className="recipe-card-header">
                                    <div className="recipe-header-content">
                                        <div>
                                            <h2 className="recipe-title">
                                                {generatedRecipe.name}
                                            </h2>
                                            <p className="recipe-description">
                                                {generatedRecipe.description}
                                            </p>
                                        </div>
                                        <Button
                                            type="primary"
                                            shape="round"
                                            icon={<SaveOutlined />}
                                            onClick={handleSaveRecipe}
                                            className="recipe-save-button"
                                        >
                                            Save Recipe
                                        </Button>
                                    </div>

                                    <div className="recipe-tags">
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

                                <div className="recipe-card-body">
                                    <div className="recipe-content-grid">
                                        <div>
                                            <h4 className="recipe-section-title recipe-ingredients-title">
                                                Ingredients
                                            </h4>
                                            <ul className="recipe-ingredients-list">
                                                {generatedRecipe.ingredients.map((ing, i) => (
                                                    <li key={i} style={{ marginBottom: "8px" }}>{ing}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="recipe-section-title recipe-instructions-title">
                                                Instructions
                                            </h4>
                                            <div className="recipe-instructions">
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
