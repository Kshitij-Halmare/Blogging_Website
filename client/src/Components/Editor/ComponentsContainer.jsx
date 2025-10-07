import React, { useContext } from 'react';
import { BlogContext } from '../../Pages/Editor/BlogId';
import { FaTimes } from 'react-icons/fa';
import CommentFeild from './CommentFeild';
import { motion, AnimatePresence } from 'framer-motion';

export const fetchComment = async ({
    skip = 0,
    blog_id,
    setParentCommentCountfun,
    comment_array = null,
    isReply,
}) => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getCommentData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id, skip, isReply }),
    });

    const resData = await response.json();
    if (resData.success) {
        const data = resData.data;
        data.map(comment => {
            comment.childrenLevel = 0;
        });
        setParentCommentCountfun(prev => prev + data.length);
        return {
            results: comment_array === null ? data : [...comment_array, ...data]
        };
    } else {
        console.error('Error fetching comments:', resData.message);
        return { results: [] };
    }
};

function ComponentsContainer() {
    const {
        commentsWrapper,
        setCommentWrapper,
        blog: { title, activity },
    } = useContext(BlogContext);

    return (
        <AnimatePresence>
            {commentsWrapper && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCommentWrapper(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Comment Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 w-full sm:w-[500px] h-full z-50 bg-white shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 pr-4">
                                    <h2 className="text-2xl font-bold mb-2">Comments</h2>
                                    <p className="text-sm text-white/90 line-clamp-2">{title}</p>
                                    <p className="text-xs text-white/80 mt-2">
                                        {activity?.total_comments || 0} {activity?.total_comments === 1 ? 'comment' : 'comments'}
                                    </p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setCommentWrapper(false)}
                                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-300"
                                >
                                    <FaTimes className="text-xl" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Comments Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-white">
                            <CommentFeild action="Comment" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default ComponentsContainer;
