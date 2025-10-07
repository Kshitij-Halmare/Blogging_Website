import React, { useState, useContext, useEffect } from 'react';
import { useAuth } from '../../Authetication/Authentication';
import toast from 'react-hot-toast';
import { BlogContext } from '../../Pages/Editor/BlogId';
import CommentCard from './CommentCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaComments } from 'react-icons/fa';

function CommentFeild({ action, index = undefined, replyingTo = undefined, setReplying }) {
    const { blog, blog_id, setBlog, totalParentsCommentsLoaded, settotalParentsCommentsLoaded } = useContext(BlogContext);
    const { user, loading } = useAuth();
    const [textArea, setTextArea] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-solid rounded-full"></div>
                    <div className="w-12 h-12 border-t-4 border-indigo-600 border-solid rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (blog && blog.comments && blog.activity) {
            setLoadingData(false);
        }
    }, [blog]);

    const handleComment = async () => {
        if (user) {
            if (!textArea.trim().length) {
                return toast.error("Write something to add a comment");
            }

            setIsLoading(true);

            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/addComment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: user.id,
                        blog_id: blog_id,
                        comment: textArea,
                        blog_author: blog.author._id,
                        replying_to: replyingTo,
                    }),
                });

                const resData = await response.json();
                if (resData.success) {
                    setTextArea("");

                    const newComment = {
                        comment: textArea,
                        commented_by: resData.data.user,
                        childrenLevel: 0,
                        _id: resData.data._id,
                        commentedAt: resData.data.commentedAt,
                    };

                    let updatedComments;
                    if (replyingTo) {
                        updatedComments = blog.comments.results.map(comment => {
                            if (comment._id === replyingTo) {
                                const updatedComment = { ...comment };
                                updatedComment.children = updatedComment.children || [];
                                updatedComment.children.push(newComment);
                                updatedComment.childrenLevel = updatedComment.childrenLevel + 1;
                                return updatedComment;
                            }
                            return comment;
                        });
                    } else {
                        updatedComments = [newComment, ...blog.comments.results];
                    }

                    setBlog(prevBlog => ({
                        ...prevBlog,
                        comments: { ...prevBlog.comments, results: updatedComments },
                        activity: {
                            ...prevBlog.activity,
                            total_comments: prevBlog.activity.total_comments + 1,
                            total_parents_comments: prevBlog.activity.total_parents_comments + (replyingTo ? 0 : 1),
                        },
                    }));

                    setIsLoading(false);
                    toast.success("Comment added!");
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            } catch (error) {
                toast.error("Error submitting comment.");
                setIsLoading(false);
            }
        } else {
            toast.error("Please login to comment");
        }
    };

    const loadMoreComments = async () => {
        if (isLoadingMore || totalParentsCommentsLoaded >= blog.activity.total_parents_comments) {
            return;
        }

        setIsLoadingMore(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getCommentData`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blog_id, skip: totalParentsCommentsLoaded }),
            });

            const resData = await response.json();

            if (resData.success) {
                const newComments = resData.data.map(comment => ({
                    ...comment,
                    childrenLevel: 0,
                }));

                setBlog(prevBlog => ({
                    ...prevBlog,
                    comments: { ...prevBlog.comments, results: [...prevBlog.comments.results, ...newComments] },
                    activity: {
                        ...prevBlog.activity,
                        total_parents_comments: prevBlog.activity.total_parents_comments + newComments.length,
                    },
                }));
                settotalParentsCommentsLoaded(prev => prev + newComments.length);
                toast.success("More comments loaded!");
            } else {
                toast.error("Failed to load more comments.");
            }
        } catch (error) {
            toast.error(`Error loading more comments.`);
        } finally {
            setIsLoadingMore(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-solid rounded-full"></div>
                    <div className="w-12 h-12 border-t-4 border-indigo-600 border-solid rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Comment Input */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className="relative">
                    <textarea
                        onChange={(e) => setTextArea(e.target.value)}
                        className="w-full p-4 pr-14 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 focus:border-indigo-400 focus:bg-white rounded-2xl resize-none transition-all duration-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[120px]"
                        value={textArea}
                        placeholder="Share your thoughts..."
                    />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleComment}
                        disabled={isLoading || !textArea.trim()}
                        className={`absolute right-3 bottom-3 p-3 rounded-xl transition-all duration-300 ${
                            isLoading || !textArea.trim()
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        }`}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <FaPaperPlane className="text-white text-lg" />
                        )}
                    </motion.button>
                </div>
                <div className="flex items-center justify-between mt-2 px-2">
                    <p className="text-xs text-gray-500">
                        {textArea.length}/500 characters
                    </p>
                    {user && (
                        <p className="text-xs text-gray-500">
                            Commenting as <span className="font-semibold text-indigo-600">@{user.userName}</span>
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Comments List */}
            <div className="space-y-4">
                {blog.comments.results.length > 0 && !replyingTo ? (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <FaComments className="text-indigo-600 text-xl" />
                            <h3 className="text-lg font-bold text-gray-900">
                                {blog.activity.total_comments} {blog.activity.total_comments === 1 ? 'Comment' : 'Comments'}
                            </h3>
                        </div>
                        <AnimatePresence>
                            {blog.comments.results.map((data, key) => (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, delay: key * 0.05 }}
                                >
                                    <CommentCard data={data} index={key} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <FaComments className="text-3xl text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No comments yet</h3>
                        <p className="text-gray-500">Be the first to share your thoughts!</p>
                    </motion.div>
                )}
            </div>

            {/* Load More Button */}
            {blog.activity.total_parent_comments > totalParentsCommentsLoaded && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={loadMoreComments}
                    disabled={isLoadingMore}
                    className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoadingMore ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                        </span>
                    ) : (
                        'Load More Comments'
                    )}
                </motion.button>
            )}
        </div>
    );
}

export default CommentFeild;