import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Button, Card, message } from 'antd';
import { DeleteOutlined, DownOutlined } from '@ant-design/icons';
import Navbar from '../components/navbar.jsx';

import { useSelector } from 'react-redux';
import API_BASE_URL from "../constant.js";
import RecipeDetailsModal from "../components/RecipeDetailsModal.jsx";

export default function SavedRecipes() {
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser.data.data.user._id;

    const [savedRecipes, setSavedRecipes] = useState([]);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedRecipeDetails, setSelectedRecipeDetails] = useState({});

    useEffect(() => {
        const fetchSavedRecipes = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/recipe/savedRecipes/${userId}`
                );
                setSavedRecipes(response.data.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchSavedRecipes();
    }, [userId]);

    const getMoreDetailsOfRecipe = async (savedRecipeId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/v1/recipe/${savedRecipeId}`
            );
            setSelectedRecipeDetails(response.data.data);
            setDetailsModalVisible(true);
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch recipe details");
        }
    };

    const removeSavedRecipe = async (recipeID) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/v1/recipe/removeSaved/${recipeID}/${userId}`,
                {
                    recipeID,
                    userID: currentUser._id,
                }
            );
            setSavedRecipes(response.data.data.savedRecipes);
            message.success('Recipe removed from saved!');
        } catch (err) {
            console.error(err);
            message.error('Failed to remove recipe from saved');
        }
    };

    const truncateDescription = (description) => {
        const words = description.split(' ');
        if (words.length > 10) {
            return words.slice(0, 10).join(' ') + '...';
        }
        return description;
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
                            background: "#52c41a",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)"
                        }}>
                            <span style={{ fontSize: "32px" }}>💚</span>
                        </div>
                        <div>
                            <h1 style={{ fontSize: "48px", color: "#fff", fontWeight: "bold", margin: 0 }}>Saved Recipes</h1>
                            <p style={{ fontSize: "18px", color: "#a3a3a3", margin: "4px 0 0 0" }}>Your favorite recipes collection</p>
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
                    dataSource={savedRecipes}
                    renderItem={(savedRecipe) => (
                        <List.Item>
                            <Card
                                className="recipeCard"
                                hoverable
                                style={{
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#262626",
                                    border: "2px solid #52c41a"
                                }}
                                title={<span style={{ fontWeight: "bold", fontSize: "16px", color: "#fff" }}>{savedRecipe.name}</span>}
                                cover={<img alt={savedRecipe.name} src={savedRecipe.recipeImg} style={{ height: "200px", objectFit: "cover" }} />}
                                actions={[
                                    <Button
                                        type="primary"
                                        shape="round"
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeSavedRecipe(savedRecipe._id)}
                                        style={{ backgroundColor: "#ff4d4f", borderColor: "transparent", fontWeight: "bold" }}
                                    >
                                        Remove
                                    </Button>,
                                    <Button
                                        type="default"
                                        shape="round"
                                        icon={<DownOutlined />}
                                        onClick={() => getMoreDetailsOfRecipe(savedRecipe._id)}
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
                                <div>
                                    <p style={{ color: "#a3a3a3", marginBottom: "8px" }}>
                                        {truncateDescription(savedRecipe.description)}
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
                                            ⏰ {savedRecipe.cookingTime} min
                                        </span>
                                        {savedRecipe.createdAt && (
                                            <span style={{
                                                backgroundColor: "#1890ff",
                                                color: "white",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                                fontWeight: "bold"
                                            }}>
                                                📅 {new Date(savedRecipe.createdAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
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
