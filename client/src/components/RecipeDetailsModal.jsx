import React from 'react';
import { Modal } from 'antd';

const RecipeDetailsModal = ({ visible, onCancel, recipeDetails }) => {
    // Recipe Box Styles
    const modalStyle = {
        backgroundColor: 'white', // Main background color of the modal
        borderRadius: '15px',     // Smooth, rounded corners
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)', // Soft shadow to make it pop out
        padding: '20px',          // Extra padding inside the modal for content
        border: '1px solid #ddd', // Subtle border for a card-like effect
    };

    // Background Gradient for the Modal Header Section
    const headerStyle = {
        background: 'linear-gradient(45deg, #FF6F61, #DE3C3C)', // Gradient background
        padding: '20px',
        borderRadius: '10px 10px 0 0',  // Only round the top corners
        color: '#fff',                 // White text for contrast
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '24px'
    };

    const sectionStyle = {
        padding: '15px',
        marginBottom: '10px',
        borderRadius: '8px',
        color: '#fff'
    };

    const labelStyle = {
        fontWeight: 'bold',
        color: '#000' // Black color for the label
    };

    const recipeNameStyle = {
        fontSize: '28px',   // Bigger size for the name
        fontWeight: 'bold', // Bold font for the name
        color: '#fff'       // Keep the name in white to contrast with the background
    };

    // Updated Ingredients Style to Fix Bullet Issue
    const ingredientsTextStyle = {
        fontWeight: 'normal', // Remove bold from ingredients text
        color: '#000',        // Black color for ingredients text
        paddingLeft: '20px',  // Add padding to the left to keep the bullets inside
        listStylePosition: 'inside', // Ensure the bullets are inside the container
        margin: '0',          // Remove default margin from <ul>
    };

    const sectionColors = ['#c0392b', '#2980b9', '#ffff00', '#8e44ad', '#138507']; // Section background colors

    return (
        <Modal
            title={null} // Remove the default title as we have a custom header
            visible={visible}
            onCancel={onCancel}
            footer={null}
            bodyStyle={{ backgroundColor: '#f9f9f9', padding: '0' }} // Remove default padding
        >
            {/* Custom Recipe Box Style */}
            <div style={modalStyle}>

                {/* Custom Header Section with Gradient */}
                <div style={headerStyle}>
                    <p style={recipeNameStyle}>{recipeDetails.name}</p>
                </div>

                <div style={{ padding: '20px' }}> {/* Padding inside modal content */}
                    {/* Description Section */}
                    <div style={{ ...sectionStyle, backgroundColor: sectionColors[1], color: '#000' }}>
                        <p><span style={labelStyle}>Description:</span> {recipeDetails.description}</p>
                    </div>

                    {/* Ingredients Section */}
                    <div style={{ ...sectionStyle, backgroundColor: sectionColors[2], color: '#000' }}>
                        <p><span style={labelStyle}>Ingredients:</span></p>
                        <ul style={ingredientsTextStyle}>
                            {Array.isArray(recipeDetails.ingredients) 
                              ? recipeDetails.ingredients.map((ingredient, index) => (
                                  <li key={index}>{ingredient}</li>
                                )) 
                              : ''}
                        </ul>
                    </div>

                    {/* Instructions Section */}
                    <div style={{ ...sectionStyle, backgroundColor: sectionColors[3] }}>
                        <p><span style={labelStyle}>Instructions:</span> {recipeDetails.instructions}</p>
                    </div>

                    {/* Cooking Time Section */}
                    <div style={{ ...sectionStyle, backgroundColor: sectionColors[4] }}>
                        <p><span style={labelStyle}>Cooking Time:</span> {recipeDetails.cookingTime} minutes</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default RecipeDetailsModal;
