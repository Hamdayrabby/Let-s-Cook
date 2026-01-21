import React from 'react';
import { Modal, Tag, Typography, Divider, Image, Row, Col } from 'antd';
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const RecipeDetailsModal = ({ visible, onCancel, recipeDetails }) => {
    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            bodyStyle={{ padding: 0, borderRadius: '12px', overflow: 'hidden' }}
            centered
            closeIcon={<span style={{ color: 'white', fontSize: '18px', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</span>}
        >
            {/* Hero Image Section */}
            <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                <Image
                    src={recipeDetails.recipeImg || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={recipeDetails.name}
                    style={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                    preview={false}
                    width={'100%'}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '40px 24px 20px',
                }}>
                    <Title level={2} style={{ color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        {recipeDetails.name}
                    </Title>
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '24px', backgroundColor: '#fff' }}>
                {/* Meta Tags */}
                <div style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
                    <Tag icon={<ClockCircleOutlined />} color="gold" style={{ padding: '4px 10px', fontSize: '14px' }}>
                        {recipeDetails.cookingTime} mins
                    </Tag>
                    {recipeDetails.createdAt && (
                        <Tag icon={<CalendarOutlined />} style={{ padding: '4px 10px', fontSize: '14px', backgroundColor: '#e6f7ff', color: '#1890ff', borderColor: '#91d5ff' }}>
                            {new Date(recipeDetails.createdAt).toLocaleDateString()}
                        </Tag>
                    )}
                </div>

                {/* Description */}
                <div style={{ marginBottom: '24px', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ffcc00' }}>
                    <Text italic style={{ fontSize: '16px', color: '#555' }}>
                        "{recipeDetails.description}"
                    </Text>
                </div>

                <Row gutter={[32, 24]}>
                    {/* Ingredients Column */}
                    <Col xs={24} md={10}>
                        <Title level={4} style={{ color: '#333', marginBottom: '16px', borderBottom: '2px solid #ffcc00', paddingBottom: '8px', display: 'inline-block' }}>
                            Ingredients
                        </Title>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {Array.isArray(recipeDetails.ingredients) && recipeDetails.ingredients.map((ingredient, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '6px',
                                    border: '1px solid #eee'
                                }}>
                                    <span style={{ color: '#ffcc00', marginRight: '10px', fontSize: '12px' }}>●</span>
                                    <Text style={{ fontSize: '15px' }}>{ingredient}</Text>
                                </div>
                            ))}
                        </div>
                    </Col>

                    {/* Instructions Column */}
                    <Col xs={24} md={14}>
                        <Title level={4} style={{ color: '#333', marginBottom: '16px', borderBottom: '2px solid #ffcc00', paddingBottom: '8px', display: 'inline-block' }}>
                            Instructions
                        </Title>
                        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#444', whiteSpace: 'pre-line' }}>
                            {recipeDetails.instructions}
                        </Paragraph>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};

export default RecipeDetailsModal;
