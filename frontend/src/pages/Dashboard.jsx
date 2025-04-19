import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faIdCard, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await API.get('/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to fetch profile data.');
                setLoading(false);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out successfully!");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                <motion.div
                    className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold mb-4">🎉 Welcome to Your Dashboard</h1>
                    <p className="text-gray-600 mb-6">Loading your profile information...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                <motion.div
                    className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold mb-4">⚠️ Error</h1>
                    <p className="text-red-500 mb-6">{error}</p>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
            <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold mb-6">🎉 Welcome, {user?.username}!</h1>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Profile</h2>
                    <div className="bg-indigo-100 rounded-md shadow-sm p-4 text-gray-700 mb-2">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faUser} className="mr-3 text-indigo-500 text-xl" />
                            <p><strong className="text-indigo-700">Username:</strong> {user?.username}</p>
                        </div>
                    </div>
                    <div className="bg-blue-100 rounded-md shadow-sm p-4 text-gray-700 mb-2">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-blue-500 text-xl" />
                            <p><strong className="text-blue-700">Email:</strong> {user?.email}</p>
                        </div>
                    </div>
                    <div className="bg-green-100 rounded-md shadow-sm p-4 text-gray-700 mb-2">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faIdCard} className="mr-3 text-green-500 text-xl" />
                            <p><strong className="text-green-700">ID:</strong> {user?._id}</p>
                        </div>
                    </div>
                    <div className="bg-yellow-100 rounded-md shadow-sm p-4 text-gray-700">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-yellow-500 text-xl" />
                            <p><strong className="text-yellow-700">Registered:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    {/* Waxaad ku dari kartaa xog kale halkan */}
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition mt-6"
                >
                    Logout
                </button>
            </motion.div>
        </div>
    );
};

export default Dashboard;