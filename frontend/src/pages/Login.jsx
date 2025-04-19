import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await API.post("/login", formData);
            localStorage.setItem("token", res.data.token);
            toast.success("Login successful! 🚀");
            navigate("/");
        } catch (err) {
            const message = err.response?.data?.message || "Invalid credentials!";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-300">
            <motion.div
                className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
            >
                <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Sign In 🔑</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            required
                            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="relative">
                        <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Your Password"
                            required
                            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                            onChange={handleChange}
                        />
                    </div>
                    <motion.button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging In..." : "Login"}
                    </motion.button>
                </form>

                <p className="text-center mt-4 text-sm">
                    <Link to="/forgot-password" className="text-blue-700 hover:underline transition">
                        Forgot your password?
                    </Link>
                </p>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Don't have an account?
                    <Link to="/register" className="text-purple-700 font-semibold hover:underline ml-1 transition">Register</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;