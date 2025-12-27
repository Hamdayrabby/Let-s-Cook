import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import logo from "../../../../public/assets/logo.svg";
import "../../../styles/register.css";

import { logInStart, logInSuccess, logInFailure } from "../../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner.jsx";
import API_BASE_URL from "../../../constant.js";

const AdminLoginForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.user);

    const [_, setCookies] = useCookies(["access_token"]);

    const onFinish = async (values) => {
        try {
            dispatch(logInStart());
            const response = await axios.post(
                `${API_BASE_URL}/api/v1/users/login`,
                {
                    username: values.username,
                    password: values.password,
                }
            );

            const userData = response.data.data;

            // Admin Check - Only allow admin role
            if (userData.user.role !== 'admin') {
                message.error("Access Denied: You are not an administrator.");
                dispatch(logInFailure({ message: "Not an admin" }));
                return;
            }

            dispatch(logInSuccess(response));

            message.success("Admin login successful");

            setCookies("access_token", userData.access_token);

            navigate("/admin");
        } catch (err) {
            message.error("Login failed. Please check your credentials.");
            console.error(err);
            dispatch(logInFailure(err));
        }
    };

    return (
        <div className="w-full min-h-screen bg-neutral-900 flex items-center justify-center">
            <div className="formContainer">
                <Form form={form} onFinish={onFinish}>
                    <div className="registerFormLogo">
                        <img src="/assets/logo.svg" alt="logo" />
                        <h2 style={{ color: "#ef4444" }}>Admin Login</h2>
                        <p style={{ color: "#a3a3a3", fontSize: "14px", marginTop: "8px" }}>
                            For administrators only
                        </p>
                    </div>
                    <Form.Item name="username" rules={[{ required: true, message: "Please enter admin username" }]}>
                        <Input placeholder="Admin Username" className="formInput" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: "Please enter admin password" }]}>
                        <Input.Password placeholder="Admin Password" className="formInput" />
                    </Form.Item>

                    <Form.Item>
                        {loading ? (
                            <Button type="primary" htmlType="submit">
                                <Spinner />
                            </Button>
                        ) : (
                            <Button type="primary" htmlType="submit">
                                Login as Admin
                            </Button>
                        )}
                        <Link to="/auth/login">Regular User Login</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AdminLoginForm;
