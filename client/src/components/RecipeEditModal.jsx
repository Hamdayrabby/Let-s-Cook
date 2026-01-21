import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import UploadWidget from "./UploadWidget";
const { TextArea } = Input;

const RecipeEditModal = ({
    visible,
    onCancel,
    onUpdate,
    editedRecipe,
}) => {
    const [form] = Form.useForm();

    // Populate form when modal opens or recipe changes
    useEffect(() => {
        if (visible && editedRecipe) {
            form.setFieldsValue({
                ...editedRecipe,
                // ingredients is already a string "a,b,c" from MyRecipes
            });
        }
    }, [visible, editedRecipe, form]);

    const handleImageUpload = (imageUrl) => {
        form.setFieldsValue({ recipeImg: imageUrl });
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            // Format data for backend
            const updatedData = {
                ...editedRecipe, // keep original ID and other fields
                ...values,
                // Convert ingredients string back to array if needed suitable for backend
                // logic in MyRecipes joined it. Backend expects Array.
                // We should ensure we send Array? 
                // Let's check: handleEdit in MyRecipes used .join(",").
                // So form has string.
                // We must split it back to array.
                ingredients: typeof values.ingredients === 'string' ? values.ingredients.split(",") : values.ingredients,
                cookingTime: parseInt(values.cookingTime, 10)
            };

            onUpdate(updatedData);
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    return (
        <Modal
            title="Edit Recipe"
            visible={visible}
            onOk={handleOk}
            onCancel={onCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please input the recipe name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input the description!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Recipe Image">
                    <Form.Item name="recipeImg" noStyle>
                        <Input disabled style={{ marginBottom: "10px" }} />
                    </Form.Item>
                    <UploadWidget onImageUpload={handleImageUpload} />
                </Form.Item>

                <Form.Item
                    name="ingredients"
                    label="Ingredients (comma separated)"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="instructions"
                    label="Instructions"
                    rules={[{ required: true, message: 'Please input the instructions!' }]}
                >
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="cookingTime"
                    label="Cooking Time (minutes)"
                    rules={[{ required: true, message: 'Please input the cooking time!' }]}
                >
                    <Input type="number" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RecipeEditModal;
