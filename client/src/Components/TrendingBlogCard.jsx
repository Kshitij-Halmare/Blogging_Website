import React, { useState } from 'react';
import { FiHeart, FiTrendingUp, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function TrendingBlogcard({ content, author, index }) {
    const { publishedAt, tags, title, description, blog_id: id, activity: { total_likes } = {} } = content;
    const { full_name, userName, profile_img } = author.personal_info;
    const [isLiked, setIsLiked] = useState(false);

    const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });

    const navigate = useNavigate();

    const handleClick = (e) => {
        e.stopPropagation();
        navigate(`/profile/${userName}`);
    };

    const handleBlogClick = () => {
        navigate(`/blog/${id}`);
    };

    const handleLike = (e) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    // Generate gradient based on index
    const gradients = [
        'from-amber-500 to-orange-600',
        'from-rose-500 to-pink-600',
        'from-violet-500 to-purple-600',
        'from-cyan-500 to-blue-600',
        'from-emerald-500 to-teal-600'
    ];
    const gradient = gradients[index % gradients.length];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={handleBlogClick}
            className='group relative w-full overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 hover:border-transparent'
        >
            {/* Gradient Border Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}></div>
            
            {/* Trending Badge */}
            <div className="absolute top-0 right-0 z-10">
                <div className={`px-4 py-2 bg-gradient-to-br ${gradient} text-white text-xs font-bold rounded-bl-2xl rounded-tr-2xl shadow-lg flex items-center gap-1.5`}>
                    <FiTrendingUp className="text-sm" />
                    <span>TRENDING</span>
                </div>
            </div>

            <div className='relative p-6 flex gap-5'>
                {/* Rank Badge */}
                <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className='flex-shrink-0'
                >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl relative overflow-hidden group-hover:shadow-2xl transition-all duration-300`}>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <h1 className='text-2xl text-white font-black z-10'>
                            {String(index + 1).padStart(2, '0')}
                        </h1>
                    </div>
                </motion.div>

                {/* Content Section */}
                <div className='flex-1 min-w-0'>
                    {/* Author Info */}
                    <div className='flex items-center gap-3 mb-4'>
                        <motion.div
                            whileHover={{ scale: 1.15 }}
                            className="relative flex-shrink-0"
                        >
                            <img
                                src={`data:image/jpeg;base64,${profile_img}`}
                                alt="Profile"
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-md"
                            />
                            <div className={`absolute inset-0 rounded-full ring-2 ring-offset-1 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        </motion.div>
                        
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={handleClick}>
                            <p className='font-bold text-gray-900 hover:text-transparent hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300 truncate'>
                                {full_name}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                                <p className='text-gray-500 truncate'>@{userName}</p>
                                <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                                <p className='text-gray-400 flex-shrink-0'>{formattedDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500'>
                        {title}
                    </h2>

                    {/* Description */}
                    <p className='text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed'>
                        {description}
                    </p>

                    {/* Tags and Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 flex-1 min-w-0">
                            {tags && tags.slice(0, 2).map((tag, idx) => (
                                <motion.span
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r ${gradient} text-white shadow-md hover:shadow-lg transition-all duration-300`}
                                >
                                    #{tag}
                                </motion.span>
                            ))}
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Like Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleLike}
                                className="flex items-center gap-1.5 group/like"
                            >
                                <div className={`p-2 rounded-full transition-all duration-300 ${
                                    isLiked 
                                        ? 'bg-gradient-to-br from-red-500 to-pink-500' 
                                        : 'bg-gray-100 group-hover/like:bg-red-50'
                                }`}>
                                    <FiHeart
                                        className={`text-base transition-colors duration-300 ${
                                            isLiked 
                                                ? 'text-white fill-white' 
                                                : 'text-gray-600 group-hover/like:text-red-500'
                                        }`}
                                    />
                                </div>
                                <span className={`text-sm font-bold transition-colors duration-300 ${
                                    isLiked ? 'text-red-500' : 'text-gray-700'
                                }`}>
                                    {total_likes || 0}
                                </span>
                            </motion.button>

                            {/* Views (Mock) */}
                            <div className="flex items-center gap-1.5">
                                <div className="p-2 rounded-full bg-gray-100">
                                    <FiEye className="text-base text-gray-600" />
                                </div>
                                <span className="text-sm font-bold text-gray-700">
                                    {Math.floor(Math.random() * 1000) + 500}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated Bottom Accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none"></div>
        </motion.div>
    );
}

export default TrendingBlogcard;