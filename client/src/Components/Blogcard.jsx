import React, { useState } from 'react';
import { GetDay } from './GetDay';
import { FiHeart, FiBookmark, FiShare2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Blogcard({ content, author }) {
    const { publishedAt, tags, title, description, banner, activity: { total_likes }, blog_id: id } = content;
    const { full_name, userName, profile_img } = author.personal_info;
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleClick = (e) => {
        e.stopPropagation();
        navigate(`/profile/${userName}`);
    }

    const handleLike = (e) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
    }

    const handleSave = (e) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
    }

    const handleShare = (e) => {
        e.stopPropagation();
        // Share functionality
    }

    const isBase64 = banner && banner.startsWith('data:image');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            onClick={() => { navigate(`/blog/${id}`) }}
            className='group relative w-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500'
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {/* Decorative Border */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-200 group-hover:ring-indigo-300 transition-all duration-500"></div>

            <div className='relative flex flex-col md:flex-row'>
                {/* Banner Image with Overlay */}
                <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={isBase64 ? banner : `${banner}`}
                        alt="Banner"
                        className='w-full h-full object-cover'
                    />
                    {/* Image Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Tag Badge on Image */}
                    <div className="absolute top-4 left-4">
                        <span className='px-4 py-2 bg-white/95 backdrop-blur-sm text-sm font-bold text-gray-800 rounded-full shadow-lg border border-gray-200'>
                            {tags[0]}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col justify-between p-6 md:p-8 flex-grow">
                    {/* Author Info */}
                    <div className='flex items-center gap-3 mb-4'>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative"
                        >
                            <img 
                                src={`${profile_img}`} 
                                alt="Profile" 
                                className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-lg" 
                            />
                            <div className="absolute inset-0 rounded-full ring-2 ring-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </motion.div>
                        <div className='cursor-pointer' onClick={handleClick}>
                            <p className='font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-300'>
                                {full_name}
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <p className='text-gray-500'>{'@' + userName}</p>
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                <p className='text-gray-400'><GetDay timeStamp={publishedAt} /></p>
                            </div>
                        </div>
                    </div>

                    {/* Title with Gradient on Hover */}
                    <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500'>
                        {title}
                    </h1>

                    {/* Description */}
                    <p className='text-base text-gray-600 mb-6 line-clamp-3 leading-relaxed'>
                        {description}
                    </p>

                    {/* Actions Bar */}
                    <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                        {/* Engagement Stats */}
                        <div className="flex items-center gap-6">
                            {/* Like Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleLike}
                                className="flex items-center gap-2 group/like"
                            >
                                <div className={`p-2 rounded-full transition-all duration-300 ${
                                    isLiked 
                                        ? 'bg-gradient-to-br from-red-500 to-pink-500' 
                                        : 'bg-gray-100 group-hover/like:bg-red-50'
                                }`}>
                                    <FiHeart 
                                        className={`text-lg transition-colors duration-300 ${
                                            isLiked 
                                                ? 'text-white fill-white' 
                                                : 'text-gray-600 group-hover/like:text-red-500'
                                        }`}
                                    />
                                </div>
                                <span className={`font-semibold transition-colors duration-300 ${
                                    isLiked ? 'text-red-500' : 'text-gray-700'
                                }`}>
                                    {total_likes}
                                </span>
                            </motion.button>

                            {/* Bookmark Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSave}
                                className="group/save"
                            >
                                <div className={`p-2 rounded-full transition-all duration-300 ${
                                    isSaved 
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500' 
                                        : 'bg-gray-100 group-hover/save:bg-indigo-50'
                                }`}>
                                    <FiBookmark 
                                        className={`text-lg transition-colors duration-300 ${
                                            isSaved 
                                                ? 'text-white fill-white' 
                                                : 'text-gray-600 group-hover/save:text-indigo-500'
                                        }`}
                                    />
                                </div>
                            </motion.button>

                            {/* Share Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleShare}
                                className="group/share"
                            >
                                <div className="p-2 rounded-full bg-gray-100 group-hover/share:bg-blue-50 transition-all duration-300">
                                    <FiShare2 className="text-lg text-gray-600 group-hover/share:text-blue-500 transition-colors duration-300" />
                                </div>
                            </motion.button>
                        </div>

                        {/* Read More Indicator */}
                        <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-2 text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                            <span>Read More</span>
                            <svg 
                                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </motion.div>
    );
}

export default Blogcard;