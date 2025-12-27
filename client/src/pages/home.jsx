import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import "../styles/home.css";
import { useSelector } from "react-redux";
import { SaveOutlined, CheckOutlined, DownOutlined, SearchOutlined } from "@ant-design/icons";
import { List, Button, Card, message, Input } from "antd";

const { Meta } = Card;
import API_BASE_URL from "../constant.js";
import RecipeDetailsModal from "../components/RecipeDetailsModal.jsx";

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedRecipeDetails, setSelectedRecipeDetails] = useState({});
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const { currentUser } = useSelector((state) => state.user);
    const userID = currentUser.data.data.user._id;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/recipe`);
                setRecipes(response.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchSavedRecipes = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/recipe/savedRecipes/ids/${userID}`
                );
                setSavedRecipes(response.data.data.savedRecipes);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRecipes();
        fetchSavedRecipes();
    }, [userID]);

    const saveRecipe = async (recipeID) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/v1/recipe/save`,
                {
                    recipeID,
                    userID,
                }
            );
            setSavedRecipes(response.data.data.savedRecipes);
            message.success("Recipe saved!");
        } catch (err) {
            console.error(err);
            message.error("Failed to save recipe");
        }
    };

    const isRecipeSaved = (id) => savedRecipes.includes(id);

    const truncateDescription = (description) => {
        const words = description.split(" ");
        if (words.length > 10) {
            return words.slice(0, 10).join(" ") + "...";
        }
        return description;
    };

    const getMoreDetailsOfRecipe = async (recipeId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/v1/recipe/${recipeId}`
            );
            setSelectedRecipeDetails(response.data.data);
            setDetailsModalVisible(true);
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch recipe details");
        }
    };

    const closeModal = () => {
        setDetailsModalVisible(false);
        setSelectedRecipeDetails({});
    };

    // Filter the recipes based on the search term
    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#171717", color: "#a3a3a3" }}>
            <Navbar />
            <div style={{ padding: "40px 60px" }} className="homeContainer">
                <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                        <div style={{
                            width: "64px",
                            height: "64px",
                            background: "#ffcc00",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)"
                        }}>
                            <span style={{ fontSize: "32px" }}>🍳</span>
                        </div>
                        <div>
                            <h1 style={{ fontSize: "48px", color: "#fff", fontWeight: "bold", margin: 0 }}>Recipe Collection</h1>
                            <p style={{ fontSize: "18px", color: "#a3a3a3", margin: "4px 0 0 0" }}>Discover and save your favorite recipes</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: "30px" }}>
                    <Input
                        size="large"
                        placeholder="Search recipes by name..."
                        prefix={<SearchOutlined style={{ color: "#a3a3a3" }} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            maxWidth: "600px",
                            borderRadius: "12px",
                            backgroundColor: "#262626",
                            borderColor: "#404040",
                            color: "#fff",
                            padding: "12px 20px"
                        }}
                    />
                </div>

                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 3,
                        xl: 4,
                    }}
                    dataSource={filteredRecipes}
                    renderItem={(recipe) => (
                        <List.Item>
                            <Card
                                className="recipeCard"
                                hoverable
                                style={{
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#262626",
                                    border: isRecipeSaved(recipe._id) ? "2px solid #52c41a" : "2px solid #ffcc00"
                                }}
                                title={<span style={{ fontWeight: "bold", fontSize: "16px", color: "#fff" }}>{recipe.name}</span>}
                                cover={<img alt={recipe.name} src={recipe.recipeImg} style={{ height: "200px", objectFit: "cover" }} />}
                                actions={[
                                    <Button
                                        type="primary"
                                        shape="round"
                                        icon={isRecipeSaved(recipe._id) ? <CheckOutlined /> : <SaveOutlined />}
                                        onClick={() => saveRecipe(recipe._id)}
                                        disabled={isRecipeSaved(recipe._id)}
                                        style={{
                                            backgroundColor: isRecipeSaved(recipe._id) ? "#52c41a" : "#ffcc00",
                                            borderColor: "transparent",
                                            color: isRecipeSaved(recipe._id) ? "white" : "black",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                                    </Button>,
                                    <Button
                                        type="default"
                                        shape="round"
                                        icon={<DownOutlined />}
                                        onClick={() => getMoreDetailsOfRecipe(recipe._id)}
                                        style={{
                                            backgroundColor: "#1890ff",
                                            borderColor: "transparent",
                                            color: "#fff",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Read More
                                    </Button>,
                                ]}
                            >
                                <Meta
                                    description={
                                        <div>
                                            <p style={{ color: "#a3a3a3", marginBottom: "8px" }}>
                                                {truncateDescription(recipe.description)}
                                            </p>
                                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                                                <span style={{
                                                    backgroundColor: "#ffcc00",
                                                    color: "black",
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold"
                                                }}>
                                                    ⏰ {recipe.cookingTime} min
                                                </span>
                                                {recipe.createdAt && (
                                                    <span style={{
                                                        backgroundColor: "#1890ff",
                                                        color: "white",
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "12px",
                                                        fontWeight: "bold"
                                                    }}>
                                                        📅 {new Date(recipe.createdAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    }
                                />
                            </Card>
                        </List.Item>
                    )}
                />
                <RecipeDetailsModal
                    visible={detailsModalVisible}
                    onCancel={closeModal}
                    recipeDetails={selectedRecipeDetails}
                />
            </div>
        </div>
    );
}
