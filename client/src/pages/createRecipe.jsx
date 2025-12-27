import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Input, Form, Button, Tag, message } from "antd";
// import createRecipeImg from "../../public/assets/createRecipe.png";
import "../styles/createRecipe.css";
import UploadWidget from "../components/UploadWidget.jsx";

import { useSelector } from "react-redux";
import Spinner from "../components/Spinner.jsx";
import API_BASE_URL from "../constant.js";

const CreateRecipe = () => {
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser.data.data.user._id;

  const navigate = useNavigate();

  const [cookies, _] = useCookies(["access_token"]);

  const [isLoading, setIsLoading] = useState(false);

  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    recipeImg: "",
    cookingTime: 0,
    userOwner: userId,
  });

  // Handle input field changes
  const handleChange = (field, value) => {
    setRecipe({ ...recipe, [field]: value });
  };

  const handleIngredientChange = (value, index) => {
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    handleChange("ingredients", ingredients);
  };

  // Add a new empty ingredient field
  const handleAddIngredient = () => {
    if (recipe.ingredients.some((ingredient) => !ingredient)) {
      message.error("Please complete the existing ingredient before adding a new one.");
      return;
    }
    handleChange("ingredients", [...recipe.ingredients, ""]);
  };

  // Remove an ingredient by index
  const handleRemoveIngredient = (index) => {
    const ingredients = [...recipe.ingredients];
    ingredients.splice(index, 1);
    handleChange("ingredients", ingredients);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const requiredFields = ["name", "instructions", "recipeImg"];
      if (requiredFields.some((field) => !recipe[field])) {
        message.error("Please fill in all required fields.");
        setIsLoading(false);
        return;
      }

      const resp = await axios.post(
        `${API_BASE_URL}/api/v1/recipe/create`,
        { ...recipe },
        {
          headers: { authorization: cookies.access_token },
        }
      );
      console.log("Response:", resp);
      setIsLoading(false);
      message.success("Recipe Created");
      navigate("/");
    } catch (error) {
      console.error(error);
      setIsLoading(false); // Ensure loading is stopped in case of error
      message.error("Failed to create recipe");
    }
  };

  // Handle image upload
  const handleImageUpload = (imageUrl) => {
    if (!imageUrl) {
      message.error("Image upload failed.");
      return;
    }
    handleChange("recipeImg", imageUrl);
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
              background: "#ffcc00",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)"
            }}>
              <span style={{ fontSize: "32px" }}>✨</span>
            </div>
            <div>
              <h1 style={{ fontSize: "48px", color: "#fff", fontWeight: "bold", margin: 0 }}>Create Recipe</h1>
              <p style={{ fontSize: "18px", color: "#a3a3a3", margin: "4px 0 0 0" }}>Share your culinary creations</p>
            </div>
          </div>
        </div>
        <div className="createRecipe" style={{ backgroundColor: "#262626", padding: "30px", borderRadius: "12px", border: "2px solid #ffcc00" }}>
          <img src="/assets/createRecipe.png" alt="" />
          <Form onFinish={handleSubmit} className="createRecipeForm" requiredMark={false}>
            {/* Name Field */}
            <Form.Item
              name="name"
              label={<label style={{ fontWeight: "bold", color: "#fff" }}>Recipe</label>}
              rules={[{ required: true, message: "Please input the name!" }]}
            >
              <Input
                placeholder="Name"
                value={recipe.name}
                onChange={(e) => handleChange("name", e.target.value)}
                style={{ backgroundColor: "#171717", borderColor: "#404040", color: "#fff" }}
              />
            </Form.Item>

            {/* Description Field */}
            <Form.Item
              name="description"
              label={<label style={{ fontWeight: "bold", color: "#fff" }}>Description</label>}
              rules={[{ required: true, message: "Please input the description!" }]}
            >
              <Input.TextArea
                placeholder="Description"
                value={recipe.description}
                onChange={(e) => handleChange("description", e.target.value)}
                style={{ backgroundColor: "#171717", borderColor: "#404040", color: "#fff" }}
              />
            </Form.Item>

            {/* Ingredients Field */}
            <Form.Item
              name="ingredients"
              label={<label style={{ fontWeight: "bold", color: "#fff" }}>Ingredients</label>}
            >
              <div>
                {recipe.ingredients.map((ingredient, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleRemoveIngredient(index)}
                  >
                    <Input
                      placeholder={`Ingredient ${index + 1}`}
                      value={ingredient}
                      onChange={(e) =>
                        handleIngredientChange(e.target.value, index)
                      }
                      style={{ backgroundColor: "#171717", borderColor: "#404040", color: "#fff" }}
                    />
                  </Tag>
                ))}
                <Button
                  type="dashed"
                  onClick={handleAddIngredient}
                  style={{ marginTop: 8, fontWeight: "normal", backgroundColor: "#262626", borderColor: "#ffcc00", color: "#ffcc00" }}
                >
                  Add Ingredient
                </Button>
              </div>
            </Form.Item>

            {/* Instructions Field */}
            <Form.Item
              name="instructions"
              label={<label style={{ fontWeight: "bold", color: "#fff" }}>Instructions</label>}
              rules={[{ required: true, message: "Please input the instructions!" }]}
            >
              <Input.TextArea
                placeholder="Instructions"
                value={recipe.instructions}
                onChange={(e) => handleChange("instructions", e.target.value)}
                style={{ backgroundColor: "#171717", borderColor: "#404040", color: "#fff" }}
              />
            </Form.Item>

            {/* Recipe Image Field */}
            <Form.Item
              name="recipeImg"
              label={<label style={{ fontWeight: "bold", color: "#fff" }}>Recipe Image</label>}
            >
              <Input
                placeholder="Image URL"
                disabled
                value={recipe.recipeImg}
                onChange={(e) => handleChange("recipeImg", e.target.value)}
                style={{ backgroundColor: "#171717", borderColor: "#404040", color: "#a3a3a3" }}
              />
              <UploadWidget onImageUpload={handleImageUpload} />
            </Form.Item>

            {/* Cooking Time Field */}
            <Form.Item
              name="cookingTime"
              label={<label style={{ fontWeight: "bold", color: "#fff" }}>Cooking Time</label>}
              rules={[{ required: true, message: "Please input the cooking time!" }]}
            >
              <Input
                type="number"
                placeholder="Cooking Time (minutes)"
                value={recipe.cookingTime}
                onChange={(e) => handleChange("cookingTime", e.target.value)}
                style={{ backgroundColor: "#171717", borderColor: "#404040", color: "#fff" }}
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              {isLoading ? (
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ fontWeight: "bold", backgroundColor: "#ffcc00", borderColor: "transparent", color: "#000" }}
                >
                  <Spinner />
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "#ffcc00",
                    borderColor: "transparent",
                    color: "#000",
                    borderRadius: "8px",
                    padding: "8px 24px",
                    height: "auto"
                  }}
                >
                  Create Recipe
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
