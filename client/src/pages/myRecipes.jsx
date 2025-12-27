import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { List, Button, Card, message, Modal, Form, Input } from "antd";
import { DeleteOutlined, EditOutlined, DownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import API_BASE_URL from "../constant.js";
import RecipeDetailsModal from "../components/RecipeDetailsModal.jsx";

const { TextArea } = Input;
import RecipeEditModal from "../components/RecipeEditModal.jsx";

export default function MyRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editedRecipe, setEditedRecipe] = useState({});
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedRecipeDetails, setSelectedRecipeDetails] = useState({});

    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser.data.data.user._id;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/recipe/userRecipes/${userId}`
                );
                setRecipes(response.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRecipes();
    }, [userId]);

    const handleDelete = async (recipeId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/v1/recipe/delete/${recipeId}`);

            setRecipes((prevRecipes) =>
                prevRecipes.filter((recipe) => recipe._id !== recipeId)
            );

            message.success("Recipe deleted successfully");
        } catch (error) {
            message.error("Failed to delete recipe");
        }
    };

    const handleEdit = (recipe) => {
        setEditedRecipe({
            _id: recipe._id,
            name: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients.join(","),
            instructions: recipe.instructions,
            cookingTime: recipe.cookingTime.toString(),
        });
        setIsModalVisible(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(
                `${API_BASE_URL}/api/v1/recipe/update/${editedRecipe._id}`,
                editedRecipe
            );

            setIsModalVisible(false);
            message.success("Recipe updated successfully");

            const response = await axios.get(
                `${API_BASE_URL}/api/v1/recipe/userRecipes/${userId}`
            );
            setRecipes(response.data.data);
        } catch (error) {
            message.error("Failed to update recipe");
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

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

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#171717", color: "#a3a3a3" }}>
            <Navbar />
            <div style={{ padding: "40px 60px" }}>
                <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                        <div style={{
                            width: "64px",
                            height: "64px",
                            background: "#1890ff",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)"
                        }}>
                            <span style={{ fontSize: "32px" }}>👨‍🍳</span>
                        </div>
                        <div>
                            <h1 style={{ fontSize: "48px", color: "#fff", fontWeight: "bold", margin: 0 }}>My Recipes</h1>
                            <p style={{ fontSize: "18px", color: "#a3a3a3", margin: "4px 0 0 0" }}>Recipes created by you</p>
                        </div>
                    </div>
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
                    dataSource={recipes}
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
                                    border: "2px solid #1890ff"
                                }}
                                title={<span style={{ fontWeight: "bold", fontSize: "16px", color: "#fff" }}>{recipe.name}</span>}
                                cover={<img alt={recipe.name} src={recipe.recipeImg} style={{ height: "200px", objectFit: "cover" }} />}
                                actions={[
                                    <Button
                                        type="primary"
                                        shape="round"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDelete(recipe._id)}
                                        style={{ backgroundColor: "#ff4d4f", borderColor: "transparent", fontWeight: "bold" }}
                                    >
                                        Delete
                                    </Button>,
                                    <Button
                                        type="primary"
                                        shape="round"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEdit(recipe)}
                                        style={{ backgroundColor: "#1890ff", borderColor: "transparent", fontWeight: "bold" }}
                                    >
                                        Edit
                                    </Button>,
                                    <Button
                                        type="default"
                                        shape="round"
                                        icon={<DownOutlined />}
                                        onClick={() => getMoreDetailsOfRecipe(recipe._id)}
                                        style={{
                                            backgroundColor: "#262626",
                                            borderColor: "#404040",
                                            color: "#fff",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Details
                                    </Button>,
                                ]}
                            >
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
                            </Card>
                        </List.Item>
                    )}
                />
                <RecipeEditModal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onUpdate={handleUpdate}
                    editedRecipe={editedRecipe}
                    setEditedRecipe={setEditedRecipe}
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
