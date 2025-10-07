import { useContext } from "react";
import { EditorContext } from "../../Pages/Editor/EditorPage";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authetication/Authentication";

function BlogEditorNavbar() {
  const { blog, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
  const blogTitle = blog.title || "Untitled Blog";
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePublish = () => {
    if (!blog.banner?.length) {
      return toast.error("📸 Blog banner is required");
    }
    if (!blog.title?.length) {
      return toast.error("✍️ Blog title is required");
    }
    if (textEditor?.isReady) {
      textEditor.save().then(data => {
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditorState("publish");
        } else {
          return toast.error("📝 Write something to publish");
        }
      }).catch((err) => {
        console.error(err);
        toast.error("❌ An error occurred while saving the content");
      });
    }
  };

  const handleDraft = async () => {
    if (!blog.banner?.length) {
      return toast.error("📸 Blog banner is required");
    }
    if (!blog.title?.length) {
      return toast.error("✍️ Blog title is required");
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/createDraft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          blog, 
          authorId: user.id, 
          draft: true, 
          blog_id: blog.blog_id 
        })
      });

      const resData = await response.json();

      if (resData.success) {
        toast.success("💾 Blog saved as draft successfully!");
      } else {
        toast.error(resData.message || "Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving blog as draft:", error);
      toast.error("❌ An error occurred while saving your blog. Please try again.");
    }
  };

  return (
    <nav className="z-50 sticky top-0 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 backdrop-blur-sm border-b-2 border-purple-200 shadow-lg">
      <div className="flex justify-between items-center h-20 px-6 max-w-[1400px] mx-auto">
        {/* Logo and Title Section */}
        <div className="flex items-center gap-4 group">
          <div 
            className="relative cursor-pointer transform transition-transform duration-300 hover:scale-110"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="Logo"
              className="h-16 w-16 object-contain rounded-full shadow-md ring-2 ring-purple-300 group-hover:ring-blue-500 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
          </div>
          
          <div className="hidden md:block">
            <p className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent max-w-md truncate">
              {blogTitle}
            </p>
            <p className="text-xs text-gray-500 font-medium">Draft in progress</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Save as Draft Button */}
          <button
            className="group relative px-5 py-2.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 font-semibold rounded-full border-2 border-purple-300 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
            onClick={handleDraft}
            aria-label="Save Blog as Draft"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span className="hidden sm:inline">Save Draft</span>
              <span className="sm:hidden">Draft</span>
            </span>
          </button>

          {/* Publish Button */}
          <button
            className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            onClick={handlePublish}
            aria-label="Publish Blog"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Publish</span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Title - Shows below navbar on small screens */}
      <div className="md:hidden px-6 pb-3">
        <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent truncate">
          {blogTitle}
        </p>
      </div>
    </nav>
  );
}

export default BlogEditorNavbar;