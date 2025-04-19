import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faCheckDouble } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await API.post(`/reset-password/${token}`, {
                newPassword: password,
            });
            toast.success(res.data.message || "Password reset successful!");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Token expired or invalid");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-blue-300">
            <motion.div
                className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
            >
                <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">🔑 Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <FontAwesomeIcon icon={faKey} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <FontAwesomeIcon icon={faCheckDouble} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <motion.button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Resetting..." : "Reset Password"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;