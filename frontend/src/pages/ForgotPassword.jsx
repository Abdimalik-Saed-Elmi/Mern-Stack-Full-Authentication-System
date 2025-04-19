import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import API from "../api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await API.post("/forgot-password", { email });
            toast.success("Reset link has been sent to your email!");
            setEmail("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 to-pink-300">
            <motion.div
                className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
            >
                <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Forgot Password 🤔</h2>
                <p className="text-gray-600 text-center mb-6">
                    Enter your email and we’ll send you a link to reset your password.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <motion.button
                        type="submit"
                        className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Sending Link..." : "Send Reset Link"}
                    </motion.button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600">
                    <Link to="/login" className="text-blue-700 font-semibold hover:underline transition flex items-center justify-center">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back to Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;