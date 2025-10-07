import React, { useState } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser, FaRocket } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { motion } from 'framer-motion';

function SignUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleSubmit = async () => {
        if (!data.name || !data.email || !data.password) {
            toast.error("All fields are required");
            return;
        }
        if (data.password.length < 5) {
            toast.error("Password must be at least 5 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: data.name, email: data.email, password: data.password })
            });

            const resData = await response.json();
            if (resData.success) {
                toast.success("Account created! Please sign in to continue");
                navigate("/signin");
            } else {
                toast.error(resData.message);
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4'>
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='relative w-full max-w-md'
            >
                {/* Main Card */}
                <div className='bg-white rounded-3xl shadow-2xl p-8 md:p-10 backdrop-blur-lg bg-white/95'>
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className='w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg'
                        >
                            <FaRocket className='text-3xl text-white' />
                        </motion.div>
                        <h1 className='text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                            Join Us Today
                        </h1>
                        <p className='text-gray-600'>Create your account and start exploring</p>
                    </div>

                    {/* Form */}
                    <div className='space-y-5'>
                        {/* Name Input */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Full Name</label>
                            <div className="relative group">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                                    placeholder="John Doe"
                                />
                            </div>
                        </motion.div>

                        {/* Email Input */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Email</label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </motion.div>

                        {/* Password Input */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Password</label>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                                    value={data.password}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-300'
                                >
                                    {showPassword ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
                                </motion.button>
                            </div>
                            <p className='text-xs text-gray-500 mt-2'>Must be at least 5 characters</p>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className='w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating Account...
                                </span>
                            ) : (
                                'Sign Up'
                            )}
                        </motion.button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>

                        {/* Sign In Link */}
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/signin")}
                            className='w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300'
                        >
                            Sign In
                        </motion.button>
                    </div>
                </div>

                {/* Footer Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className='text-center text-sm text-gray-600 mt-6'
                >
                    By signing up, you agree to our{' '}
                    <span className='text-indigo-600 hover:underline cursor-pointer'>Terms</span>
                    {' '}and{' '}
                    <span className='text-indigo-600 hover:underline cursor-pointer'>Privacy Policy</span>
                </motion.p>
            </motion.div>
        </div>
    );
}

export default SignUp;