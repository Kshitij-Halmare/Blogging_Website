import React, { useContext, useState } from 'react';
import AnimationWrapper from '../../Animation/AnimationWrapper';
import { FaTimesCircle } from 'react-icons/fa';
import { EditorContext } from './EditorPage';
import Tags from '../../Components/Editor/Tags';
import toast from 'react-hot-toast';
import { useAuth } from "../../Authetication/Authentication.jsx";

function PublishPage() {
  const { user } = useAuth();
  const NumberofTags = 5;
  const { setEditorState, blog, setBlog } = useContext(EditorContext);
  const [tag, setTag] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const goBack = () => {
    setEditorState('editor');
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleBlogTitleChange = (e) => {
    setBlog((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!blog.title?.trim()) {
      return toast.error("✍️ Blog title is required");
    }
    if (!blog.description?.trim()) {
      return toast.error("📝 Blog description is required");
    }
    if (blog.tags.length === 0) {
      return toast.error("🏷️ Add at least one topic");
    }

    try {
      setIsPublishing(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/createBlog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          blog, 
          authorId: user.id, 
          draft: false, 
          blog_id: blog.blog_id 
        })
      });

      const resData = await response.json();

      if (resData.success) {
        toast.success("🎉 Your blog is being published!");
        setTimeout(() => setEditorState('editor'), 1500);
      } else {
        toast.error(resData.message || "Failed to publish blog");
      }
    } catch (error) {
      console.error("Error publishing blog:", error);
      toast.error("❌ An error occurred while publishing. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBlogDescriptionChange = (e) => {
    setBlog((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handleAddTheTag = () => {
    const text = tag.trim();
    
    if (!text) {
      return toast.error("📌 Please enter a topic");
    }

    if (blog.tags.includes(text)) {
      return toast.error("🔄 This topic is already added");
    }

    if (blog.tags.length >= NumberofTags) {
      return toast.error(`⚠️ Maximum ${NumberofTags} topics allowed`);
    }

    setBlog((prev) => ({
      ...prev,
      tags: [...prev.tags, text]
    }));
    setTag("");
    toast.success("✅ Topic added successfully!");
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTheTag();
    }
  };

  return (
    <AnimationWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header with Close Button */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Publish Your Blog
              </h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">
                Review and finalize your masterpiece before publishing
              </p>
            </div>
            <button
              onClick={goBack}
              className="group flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full shadow-md hover:shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105"
              title="Go Back to Editor"
            >
              <FaTimesCircle className="text-xl text-purple-600 group-hover:text-red-500 transition-colors duration-300" />
              <span className="hidden sm:inline font-semibold">Back</span>
            </button>
          </div>

          {/* Main Content Card */}
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border-2 border-purple-100">
            {/* Preview Section */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 border-b-2 border-purple-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </h2>

              {/* Banner Image */}
              <div className="relative h-72 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden mb-6 shadow-lg border-2 border-white">
                {blog?.banner ? (
                  <img
                    src={blog.banner}
                    alt="Blog Banner"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <svg className="w-16 h-16 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xl font-semibold">No Banner Image</p>
                  </div>
                )}
              </div>

              {/* Preview Content */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {blog?.title || 'Untitled Blog'}
                </h1>
                <p className="text-gray-600 leading-relaxed line-clamp-3">
                  {blog?.description || 'Your blog description will appear here...'}
                </p>
              </div>
            </div>

            {/* Edit Section */}
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Blog Details
              </h3>

              {/* Blog Title */}
              <div className="mb-6">
                <label htmlFor="blog-title" className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Blog Title *
                </label>
                <input
                  id="blog-title"
                  type="text"
                  onChange={handleBlogTitleChange}
                  value={blog.title}
                  placeholder="Enter your captivating blog title..."
                  className="w-full p-4 border-2 border-purple-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
                />
              </div>

              {/* Blog Description */}
              <div className="mb-6">
                <label htmlFor="blog-description" className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Blog Description *
                </label>
                <textarea
                  id="blog-description"
                  onChange={handleBlogDescriptionChange}
                  value={blog.description}
                  maxLength={200}
                  rows={4}
                  onKeyDown={handleKeyDown}
                  className="w-full p-4 border-2 border-purple-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Write a compelling description that captures your blog's essence..."
                ></textarea>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    {blog.description?.length || 0}/200 characters
                  </p>
                  <p className="text-sm text-purple-600 font-medium">
                    {200 - (blog.description?.length || 0)} remaining
                  </p>
                </div>
              </div>

              {/* Topics Section */}
              <div className="mb-8">
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Topics * <span className="text-gray-500 text-xs normal-case">(Helps in searching and ranking)</span>
                </label>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    onChange={(e) => setTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    value={tag}
                    placeholder="Enter a topic (e.g., Technology, Health, Travel)"
                    className="flex-1 p-4 border-2 border-purple-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    onClick={handleAddTheTag}
                    className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    Add Topic
                  </button>
                </div>

                {/* Tags Display */}
                {blog.tags.length > 0 ? (
                  <div className="flex gap-3 flex-wrap p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-purple-100">
                    {blog.tags.map((val, i) => (
                      <Tags key={i} tag={val} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center">
                    <p className="text-gray-500">No topics added yet. Add at least one topic to continue.</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-gray-600">
                    {blog.tags.length} / {NumberofTags} topics added
                  </p>
                  <p className="text-sm font-medium text-purple-600">
                    {NumberofTags - blog.tags.length} slots remaining
                  </p>
                </div>
              </div>

              {/* Publish Button */}
              <button
                onClick={handleSubmit}
                disabled={isPublishing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {isPublishing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Publish Blog
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default PublishPage;