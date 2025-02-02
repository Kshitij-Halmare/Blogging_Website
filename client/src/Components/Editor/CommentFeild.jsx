import React, { useState, useContext, useEffect } from 'react';
import { useAuth } from '../../Authetication/Authentication';
import toast from 'react-hot-toast';
import { BlogContext } from '../../Pages/Editor/BlogId';
import CommentCard from './CommentCard';

function CommentFeild({ action, index = undefined, replyingTo = undefined, setReplying }) {
    const { blog, blog_id, setBlog, totalParentsCommentsLoaded, settotalParentsCommentsLoaded } = useContext(BlogContext);
    const { user,loading } = useAuth();
    if(loading){
        return <div>Loading...</div>
    }
    const [textArea, setTextArea] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (blog && blog.comments && blog.activity) {
            setLoadingData(false);
        }
    }, [blog]);

    // Function to handle adding a new comment
    const handleComment = async () => {
        if (user) {
            console.log(user);
            if (!textArea.trim().length) {
                return toast("Write Something to add a comment");
            }

            setIsLoading(true);

            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/addComment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
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
                    setTextArea(""); // Clear text area after success

                    const newComment = {
                        comment: textArea,
                        commented_by: resData.data.user,
                        childrenLevel: 0,
                        _id: resData.data._id,
                        commentedAt: resData.data.commentedAt,
                    };

                    // Update comments structure based on whether it's a reply or not
                    let updatedComments;
                    if (replyingTo) {
                        // Find the parent comment and add the new reply to its children
                        updatedComments = blog.comments.results.map(comment => {
                            if (comment._id === replyingTo) {
                                // Ensure children array exists
                                const updatedComment = { ...comment }; // Copy the parent comment
                                updatedComment.children = updatedComment.children || []; 
                                updatedComment.children.push(newComment); // Add the new reply
                                updatedComment.childrenLevel = updatedComment.childrenLevel + 1; // Update the children level
                                return updatedComment;
                            }
                            return comment;
                        });
                    } else {
                        // It's a parent comment, add it to the top-level comments
                        updatedComments = [newComment, ...blog.comments.results];
                    }

                    // Dynamically update blog's comments and activity
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
                    toast.success("Comment Added!");
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            } catch (error) {
                toast.error("Error submitting comment.");
                setIsLoading(false);
            }
        } else {
            toast.error("Please Login to Comment");
        }
    };

    // Function to handle "Load More" functionality
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
            toast.error(`Error loading more comments.,${error}`);
        } finally {
            setIsLoadingMore(false);
        }
    };

    if (isLoading) {
        return <div>Submitting your comment...</div>;
    }

    if (loadingData) {
        return <div>Loading comments...</div>;
    }

    return (
        <div>
            <textarea
                onChange={(e) => setTextArea(e.target.value)}
                className="pl-5 p-2 placeholder:text-gray-800 focus:outline-none hover:shadow-xl resize-none overflow-auto bg-slate-300 hover:bg-slate-100 w-full rounded-lg h-[150px]"
                value={textArea}
                placeholder="Leave a comment ..."
            />
            <button
                onClick={handleComment}
                disabled={isLoading}
                className={`px-4 py-2 mt-2 bg-black hover:opacity-80 text-white duration-200 rounded-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? 'Submitting...' : `${action}`}
            </button>

            {/* Display comments */}
            {blog.comments.results.length && !replyingTo > 0 ? (
                blog.comments.results.map((data, key) => <CommentCard key={key} data={data} action="Comment" />)
            ) : (
                <h1>No Comments Yet</h1>
            )}

            {/* Load More button */}
            {blog.activity.total_parent_comments > totalParentsCommentsLoaded && (
                <button
                    onClick={loadMoreComments}
                    disabled={isLoadingMore}
                    className="hover:bg-slate-800 bg-black rounded-full px-4 py-2 mt-4 text-white font-medium text-center"
                >
                    {isLoadingMore ? 'Loading...' : 'Load More'}
                </button>
            )}
        </div>
    );
}

export default CommentFeild;
