import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegThumbsUp, FaRegComments, FaEye, FaTwitter, FaThumbsUp, FaBookmark, FaRegBookmark, FaShareAlt, FaEdit } from 'react-icons/fa';
import { useAuth } from '../../Authetication/Authentication';
import toast from 'react-hot-toast';
import ComponentsContainer, { fetchComment } from '../../Components/Editor/ComponentsContainer';
import { motion } from 'framer-motion';

export const BlogContext = createContext({});

function BlogId() {
  const [blog_id, setBlog_id] = useState(null);
  const [commentsWrapper, setCommentWrapper] = useState(true);
  const [totalParentsCommentsLoaded, settotalParentsCommentsLoaded] = useState(0);
  let blogId = useParams();
  blogId = blogId.id;
  const [blog, setBlog] = useState(null);
  const [loading1, setLoading1] = useState(true);
  const { user, loading } = useAuth();
  const [category, setCategory] = useState('');
  const [relBlog, setRelBlog] = useState([]);
  const navigate = useNavigate();
  const [isLiked, setIsLikedUser] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 border-solid rounded-full"></div>
          <div className="w-20 h-20 border-t-4 border-indigo-600 border-solid rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setCommentWrapper(false);
    settotalParentsCommentsLoaded(0);
    setCommentWrapper(0);
  }, []);

  useEffect(() => {
    if (blog_id) {
      console.log(blog_id,user)
      const fetchLikeDetails = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/isLikedUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ blog_id: blog_id, user_id: user.id }),
          });
          const resData = await response.json();
          setIsLikedUser(Boolean(resData.data));
        } catch (error) {
          console.error(error);
        }
      };
      fetchLikeDetails();
    }
  }, [blog_id]);

  const handleClickLike = async () => {
    if (!user || !user.id) {
      toast.error("Please Sign in");
      return;
    }

    const newLikeState = !isLiked;

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/updateLike`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blog_id: blog._id,
          user_id: user.id,
          isLiked: newLikeState,
        }),
      });

      const resData = await response.json();

      if (resData) {
        toast(newLikeState ? "Successfully liked" : "Successfully unliked");
        setIsLikedUser(prev => !prev);
        setBlog({
          ...blog,
          activity: {
            ...blog.activity,
            total_likes: resData.updatedLikes,
          },
        });
      } else {
        toast(resData.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error in handleClickLike:", error);
    }
  };

  const fetchBlogDetails = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getBlogData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: blogId }),
      });
      const resData = await response.json();
      if (resData.success) {
        const blogData = resData.data;
        blogData.comments = await fetchComment({ blog_id: blogData._id, setParentCommentCountfun: settotalParentsCommentsLoaded, isReply: false }) || [];
        setBlog(blogData);
        setBlog_id(blogData._id);
        setCategory(blogData.tags[0]);
      } else {
        console.error('Error fetching blog data:', resData);
      }
    } catch (error) {
      console.error('Error fetching blog details:', error);
    } finally {
      setLoading1(false);
    }
  }, [blogId]);

  const getSpecificBlog = useCallback(async (category) => {
    if (!category) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getSpecificTag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setRelBlog(resData.data);
      }
    } catch (err) {
      console.error('Error fetching specific blogs:', err);
    }
  }, []);

  useEffect(() => {
    fetchBlogDetails();
  }, [fetchBlogDetails]);

  useEffect(() => {
    if (category) {
      getSpecificBlog(category);
    }
  }, [category, getSpecificBlog]);

  if (loading1) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 border-solid rounded-full"></div>
          <div className="w-20 h-20 border-t-4 border-indigo-600 border-solid rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold text-red-600">Blog not found</div>
      </div>
    );
  }

  const { title, description, banner, content, publishedAt, tags, activity, author } = blog;

  const generateTwitterLink = () => {
    const tweetText = encodeURIComponent(`${title}: ${description}`);
    const tweetUrl = encodeURIComponent(window.location.href);
    const tweetHashtags = encodeURIComponent(tags.join(', '));
    return `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}&hashtags=${tweetHashtags}`;
  };

  const renderContent = (content) => {
    if (!content || !content.blocks || !Array.isArray(content.blocks)) {
      return <p className="text-gray-500">No content available.</p>;
    }

    const blocks = content.blocks;

    return blocks.map((block) => {
      const { id, type, data } = block;

      switch (type) {
        case 'paragraph':
          return (
            <p key={id} className="text-lg text-gray-700 mb-6 leading-relaxed">
              {data.text || 'No text available'}
            </p>
          );

        case 'header':
          const HeaderTag = `h${data.level}`;
          return (
            <HeaderTag key={id} className="text-3xl font-bold text-gray-900 mb-6 mt-8">
              {data.text || 'No header text available'}
            </HeaderTag>
          );

        case 'list':
          if (Array.isArray(data.items)) {
            const ListTag = data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={id} className="list-disc ml-8 mb-6 space-y-2">
                {data.items.map((item, index) => (
                  <li key={index} className="text-lg text-gray-700">
                    {item.content || 'Empty item'}
                  </li>
                ))}
              </ListTag>
            );
          } else {
            return <p key={id}>List data is missing or incorrect.</p>;
          }

        case 'image':
          return (
            <div key={id} className="mb-8 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={data.file?.url || '/path/to/fallback-image.jpg'}
                alt={data.file?.filename || 'Image'}
                className="w-full h-auto object-cover"
              />
            </div>
          );

        case 'quote':
          return (
            <blockquote
              key={id}
              className="relative bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-600 p-8 italic text-xl text-gray-800 rounded-2xl mb-8 shadow-lg"
            >
              <div className="absolute left-4 top-4 text-6xl text-indigo-300 opacity-50">"</div>
              <p className="relative z-10 pl-8">{data.text || 'No quote text available'}</p>
            </blockquote>
          );

        default:
          return <p key={id}>Unrecognized block type: {type}</p>;
      }
    });
  };

  return (
    <BlogContext.Provider value={{ commentsWrapper, setCommentWrapper, totalParentsCommentsLoaded, settotalParentsCommentsLoaded, blog, blog_id, setBlog }}>
      <ComponentsContainer />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto px-4"
        >
          {/* Hero Banner */}
          <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl">
            <img src={banner} alt={title} className="w-full h-[500px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="p-8 md:p-12 border-b border-gray-100">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-full shadow-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={author.personal_info.profile_img}
                    alt={author.personal_info.full_name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-100 shadow-lg cursor-pointer"
                    onClick={() => navigate(`/profile/${author.personal_info.userName}`)}
                  />
                  <div>
                    <p className="text-xl font-bold text-gray-900">{author.personal_info.full_name}</p>
                    <p
                      onClick={() => navigate(`/profile/${author.personal_info.userName}`)}
                      className="text-sm cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors duration-300"
                    >
                      @{author.personal_info.userName}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {user && author.personal_info.userName === user.userName && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/editBlog/${blog.blog_id}`)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </motion.button>
                  )}
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={generateTwitterLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-100 text-blue-500 rounded-full hover:bg-blue-200 transition-colors duration-300"
                  >
                    <FaTwitter className="text-xl" />
                  </motion.a>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="px-8 md:px-12 py-8 bg-gradient-to-r from-indigo-50 to-purple-50">
              <p className="text-xl text-gray-700 leading-relaxed italic">
                {description}
              </p>
            </div>

            {/* Blog Content */}
            <div className="px-8 md:px-12 py-12 prose prose-lg max-w-none">
              {content && content.length > 0 ? renderContent(...content) : <p className="text-gray-500">No content available.</p>}
            </div>

            {/* Engagement Bar */}
            <div className="px-8 md:px-12 py-8 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-6">
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClickLike}
                    className="flex items-center gap-3 group"
                  >
                    <div className={`p-3 rounded-full transition-all duration-300 ${isLiked ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gray-200 group-hover:bg-blue-100'}`}>
                      {isLiked ? (
                        <FaThumbsUp className="text-white text-xl" />
                      ) : (
                        <FaRegThumbsUp className="text-gray-600 group-hover:text-blue-600 text-xl" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Likes</p>
                      <p className={`text-lg font-bold ${isLiked ? 'text-blue-600' : 'text-gray-900'}`}>
                        {activity.total_likes}
                      </p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCommentWrapper(prev => !prev)}
                    className="flex items-center gap-3 group"
                  >
                    <div className="p-3 rounded-full bg-gray-200 group-hover:bg-green-100 transition-all duration-300">
                      <FaRegComments className="text-gray-600 group-hover:text-green-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Comments</p>
                      <p className="text-lg font-bold text-gray-900">{activity.total_comments}</p>
                    </div>
                  </motion.button>

                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-gray-200">
                      <FaEye className="text-gray-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Reads</p>
                      <p className="text-lg font-bold text-gray-900">{activity.total_reads}</p>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSaved(!isSaved)}
                  className="group"
                >
                  <div className={`p-4 rounded-full transition-all duration-300 ${isSaved ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gray-200 group-hover:bg-amber-100'}`}>
                    {isSaved ? (
                      <FaBookmark className="text-white text-xl" />
                    ) : (
                      <FaRegBookmark className="text-gray-600 group-hover:text-amber-600 text-xl" />
                    )}
                  </div>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Related Blogs */}
          {relBlog && relBlog.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-2xl">📚</span>
                </div>
                Related Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relBlog.map((relatedBlog, index) => (
                  relatedBlog.blog_id !== blogId ? (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      onClick={() => navigate(`/blog/${relatedBlog.blog_id}`)}
                      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
                    >
                      <div className="flex gap-4 p-6">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
                            {relatedBlog.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-2 mb-4">{relatedBlog.description}</p>
                          <span className="text-sm font-semibold text-indigo-600">Read more →</span>
                        </div>
                        <img
                          src={relatedBlog.banner}
                          alt={relatedBlog.title}
                          className="w-32 h-32 object-cover rounded-xl flex-shrink-0"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </motion.div>
                  ) : null
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </BlogContext.Provider>
  );
}

export default BlogId;