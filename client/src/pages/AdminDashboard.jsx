import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, CalendarOutlined, DownOutlined, DashboardOutlined, FileTextOutlined, AlertOutlined } from '@ant-design/icons';
import { Card, Button, message, List, Modal } from 'antd';
import Navbar from "../components/navbar";
import API_BASE_URL from "../constant";

const { Meta } = Card;

const AdminDashboard = () => {
    const [recipes, setRecipes] = useState([]);
    const [cookies] = useCookies(["access_token"]);
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const fetchPendingRecipes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/recipe/admin/pending`, {
                headers: { authorization: cookies.access_token },
            });
            setRecipes(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            message.error("Failed to fetch pending recipes");
            setLoading(false);
        }
    };

    const updateStatus = async (recipeId, status) => {
        try {
            await axios.put(
                `${API_BASE_URL}/api/v1/recipe/admin/status/${recipeId}`,
                { status },
                { headers: { authorization: cookies.access_token } }
            );
            // Refresh list
            setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
            message.success(`Recipe ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
            setDetailsModalVisible(false);
        } catch (err) {
            console.error(err);
            message.error("Failed to update status");
        }
    };

    const showRecipeDetails = (recipe) => {
        setSelectedRecipe(recipe);
        setDetailsModalVisible(true);
    };

    useEffect(() => {
        fetchPendingRecipes();
    }, []);

    // Admin role check
    useEffect(() => {
        if (currentUser && currentUser.data?.data?.user?.role !== 'admin') {
            alert("Access Denied: Admin privileges required");
            navigate("/");
        }
    }, [currentUser, navigate]);

    if (loading) return <div className="w-full min-h-screen bg-neutral-900 text-white flex items-center justify-center">Loading...</div>;

    // Additional check in case routing fails
    if (!currentUser || currentUser.data?.data?.user?.role !== 'admin') {
        return (
            <div className="w-full min-h-screen bg-neutral-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl mb-4">Access Denied</h1>
                    <p className="text-neutral-400">You do not have admin privileges.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px 60px", minHeight: "100vh", backgroundColor: "#171717", color: "#a3a3a3" }}>
            <Navbar />

            {/* Dashboard Header with Inline Styles */}
            <div style={{ marginTop: "40px", marginBottom: "60px" }}>
                {/* Title Section */}
                <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
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
                            <DashboardOutlined style={{ fontSize: "32px", color: "#000" }} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: "48px", color: "#fff", fontWeight: "bold", margin: 0 }}>Admin Dashboard</h1>
                            <p style={{ fontSize: "18px", color: "#a3a3a3", margin: "4px 0 0 0" }}>Review and manage recipe submissions</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                    {/* Pending Reviews Card */}
                    <div style={{
                        backgroundColor: "#262626",
                        borderRadius: "12px",
                        padding: "24px",
                        border: "2px solid #ffcc00",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                backgroundColor: "#ffcc00",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <ClockCircleOutlined style={{ fontSize: "24px", color: "#000" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "#a3a3a3", margin: 0 }}>
                                    Pending Review
                                </p>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
                                    <span style={{ fontSize: "36px", fontWeight: "bold", color: "#fff" }}>{recipes.length}</span>
                                    <span style={{ fontSize: "16px", color: "#a3a3a3" }}>
                                        {recipes.length === 1 ? 'Recipe' : 'Recipes'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {recipes.length > 0 && (
                            <div style={{
                                backgroundColor: "rgba(255, 204, 0, 0.1)",
                                border: "1px solid rgba(255, 204, 0, 0.3)",
                                borderRadius: "8px",
                                padding: "12px"
                            }}>
                                <p style={{ fontSize: "14px", fontWeight: "600", color: "#ffcc00", margin: 0 }}>
                                    ⚠️ Requires immediate attention
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Total Today Card */}
                    <div style={{
                        backgroundColor: "#262626",
                        borderRadius: "12px",
                        padding: "24px",
                        border: "2px solid #1890ff",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                backgroundColor: "#1890ff",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <FileTextOutlined style={{ fontSize: "24px", color: "#fff" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "#a3a3a3", margin: 0 }}>
                                    Submissions Today
                                </p>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
                                    <span style={{ fontSize: "36px", fontWeight: "bold", color: "#fff" }}>{recipes.length}</span>
                                    <span style={{ fontSize: "16px", color: "#a3a3a3" }}>Total</span>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            backgroundColor: "rgba(24, 144, 255, 0.1)",
                            border: "1px solid rgba(24, 144, 255, 0.3)",
                            borderRadius: "8px",
                            padding: "12px"
                        }}>
                            <p style={{ fontSize: "14px", fontWeight: "600", color: "#1890ff", margin: 0 }}>
                                📊 Real-time tracking
                            </p>
                        </div>
                    </div>

                    {/* System Status Card */}
                    <div style={{
                        backgroundColor: "#262626",
                        borderRadius: "12px",
                        padding: "24px",
                        border: recipes.length === 0 ? "2px solid #52c41a" : "2px solid #ff7a00",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                backgroundColor: recipes.length === 0 ? "#52c41a" : "#ff7a00",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <CheckCircleOutlined style={{ fontSize: "24px", color: "#fff" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "#a3a3a3", margin: 0 }}>
                                    Queue Status
                                </p>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
                                    <span style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>
                                        {recipes.length === 0 ? 'All Clear' : 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            backgroundColor: recipes.length === 0 ? "rgba(82, 196, 26, 0.1)" : "rgba(255, 122, 0, 0.1)",
                            border: recipes.length === 0 ? "1px solid rgba(82, 196, 26, 0.3)" : "1px solid rgba(255, 122, 0, 0.3)",
                            borderRadius: "8px",
                            padding: "12px"
                        }}>
                            <p style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: recipes.length === 0 ? "#52c41a" : "#ff7a00",
                                margin: 0
                            }}>
                                {recipes.length === 0 ? '✓ No pending items' : '⏳ In progress'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {recipes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                    <div style={{
                        display: "inline-block",
                        padding: "32px",
                        backgroundColor: "#262626",
                        borderRadius: "16px",
                        border: "1px solid #404040"
                    }}>
                        <CheckCircleOutlined style={{ fontSize: "64px", color: "#52c41a", marginBottom: "16px" }} />
                        <p style={{ fontSize: "20px", color: "#fff", fontWeight: "600", margin: 0 }}>All caught up!</p>
                        <p style={{ color: "#a3a3a3", marginTop: "8px" }}>No pending recipes for review.</p>
                    </div>
                </div>
            ) : (
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
                                style={{ borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                title={<span style={{ fontWeight: "bold", fontSize: "16px" }}>{recipe.name}</span>}
                                cover={<img alt={recipe.name} src={recipe.recipeImg} style={{ height: "200px", objectFit: "cover" }} />}
                                actions={[
                                    <Button
                                        type="primary"
                                        shape="round"
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => updateStatus(recipe._id, 'approved')}
                                        style={{
                                            backgroundColor: "#52c41a",
                                            borderColor: "transparent",
                                            color: "white",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Approve
                                    </Button>,
                                    <Button
                                        type="primary"
                                        shape="round"
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => updateStatus(recipe._id, 'rejected')}
                                        style={{
                                            backgroundColor: "#ff4d4f",
                                            borderColor: "transparent",
                                            color: "white",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Reject
                                    </Button>,
                                    <Button
                                        type="default"
                                        shape="round"
                                        icon={<DownOutlined />}
                                        onClick={() => showRecipeDetails(recipe)}
                                    >
                                        Details
                                    </Button>,
                                ]}
                            >
                                <Meta
                                    description={
                                        <div>
                                            <p style={{ color: "#777", marginBottom: "8px" }}>
                                                {recipe.description.length > 60
                                                    ? recipe.description.substring(0, 60) + "..."
                                                    : recipe.description}
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
                                                    <ClockCircleOutlined /> {recipe.cookingTime} min
                                                </span>
                                                <span style={{
                                                    backgroundColor: "#1890ff",
                                                    color: "white",
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold"
                                                }}>
                                                    <CalendarOutlined /> {new Date(recipe.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                />
                            </Card>
                        </List.Item>
                    )}
                />
            )}

            {/* Recipe Details Modal */}
            <Modal
                title={<span style={{ fontSize: "24px", fontWeight: "bold" }}>{selectedRecipe?.name}</span>}
                open={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                width={800}
                footer={[
                    <Button
                        key="approve"
                        type="primary"
                        size="large"
                        icon={<CheckCircleOutlined />}
                        onClick={() => updateStatus(selectedRecipe?._id, 'approved')}
                        style={{
                            backgroundColor: "#52c41a",
                            borderColor: "transparent",
                            fontWeight: "bold"
                        }}
                    >
                        Approve Recipe
                    </Button>,
                    <Button
                        key="reject"
                        type="primary"
                        size="large"
                        icon={<CloseCircleOutlined />}
                        onClick={() => updateStatus(selectedRecipe?._id, 'rejected')}
                        style={{
                            backgroundColor: "#ff4d4f",
                            borderColor: "transparent",
                            fontWeight: "bold"
                        }}
                    >
                        Reject Recipe
                    </Button>,
                ]}
            >
                {selectedRecipe && (
                    <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                        <img
                            src={selectedRecipe.recipeImg}
                            alt={selectedRecipe.name}
                            style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px", marginBottom: "16px" }}
                        />

                        <div style={{ marginBottom: "16px" }}>
                            <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>{selectedRecipe.description}</p>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>🥘 Ingredients</h3>
                            <ul style={{ paddingLeft: "20px" }}>
                                {selectedRecipe.ingredients.map((ingredient, index) => (
                                    <li key={index} style={{ marginBottom: "4px", color: "#444" }}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>📝 Instructions</h3>
                            <p style={{ color: "#444", lineHeight: "1.6", whiteSpace: "pre-line" }}>{selectedRecipe.instructions}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;
