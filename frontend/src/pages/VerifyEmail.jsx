import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPaperPlane, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';

const VerifyEmail = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendError, setResendError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    const handleVerifyEmail = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await API.post('/verify-email', { email, verificationCode });
            toast.success(response.data.message);
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong.');
            toast.error(error.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResendLoading(true);
        setResendError('');
        try {
            const response = await API.post('/resend-verification-code', { email });
            toast.success(response.data.message);
        } catch (error) {
            setResendError(error.response?.data?.message || 'Failed to resend code.');
            toast.error(error.response?.data?.message || 'Failed to resend code.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
            <motion.div
                className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
                <div className="text-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-5xl mb-4" />
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Verify Your Email</h2>
                    {email && <p className="mb-4 text-gray-700">We have sent a verification code to: <strong className="text-blue-600">{email}</strong></p>}
                </div>
                <div className="mb-6">
                    <label htmlFor="verificationCode" className="block text-gray-700 text-sm font-bold mb-2">
                        Verification Code:
                    </label>
                    <input
                        type="text"
                        id="verificationCode"
                        className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Enter the 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                </div>
                {error && <motion.p className="text-red-500 text-sm italic mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
                <div className="flex space-x-4">
                    <motion.button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:shadow-outline w-1/2 transition"
                        type="button"
                        onClick={handleVerifyEmail}
                        disabled={loading}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {loading ? 'Verifying...' : <div className="flex items-center justify-center"><FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Verify</div>}
                    </motion.button>
                    <motion.button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-xl focus:outline-none focus:shadow-outline w-1/2 transition"
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendLoading}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {resendLoading ? 'Resending...' : <div className="flex items-center justify-center"><FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> Resend</div>}
                    </motion.button>
                </div>
                {resendError && <motion.p className="text-red-500 text-sm italic mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{resendError}</motion.p>}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;