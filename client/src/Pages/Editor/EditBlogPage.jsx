import React, { useContext, useEffect, useState } from 'react';
import toast from "react-hot-toast";
import blogBannerPlaceholder from "../../assets/360_F_588335931_SG8mqLyvPnIQZL6vlkDtDhtJacYDoFuQ.jpg";
import BlogEditorNavbar from '../../Components/Editor/BlogEditorNavbar';
import AnimationWrapper from '../../Animation/AnimationWrapper';
import { EditorContext } from './EditorPage';
import EditorJS from '@editorjs/editorjs';
import { editorTools } from './Tools';
import { useAuth } from '../../Authetication/Authentication';

function EditBlogPage() {
  const { blog, setBlog, textEditor, setTextEditor } = useContext(EditorContext);
  const { user, loading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Initialize EditorJS
  useEffect(() => {
    if (!textEditor?.isReady) {
      const editorInstance = new EditorJS({
        holderId: "textEditor",
        data: Array.isArray(blog.content) ? blog.content[0] : blog.content || { blocks: [] },
        tools: editorTools,
        placeholder: "Start writing your story...",
      });
      setTextEditor(editorInstance);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error('No file selected.');
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PNG, JPG, or JPEG image.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);

      // Display the image preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/upload-blog-banner/${user?.data?.email}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      // Update the blog banner
      setBlog((prevBlog) => ({
        ...prevBlog,
        banner: data.bannerImageUrl,
      }));

      toast.success('Banner uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BlogEditorNavbar />
      <AnimationWrapper>
        <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
          <div className="mx-auto max-w-[900px] w-full px-4">
            {/* Banner Upload Section */}
            <div className="relative aspect-video bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 group">
              <label htmlFor="uploadImage" className="cursor-pointer block h-full">
                {uploading ? (
                  <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                    <p className="text-blue-600 font-semibold text-lg">Uploading your banner...</p>
                  </div>
                ) : (
                  <>
                    <img
                      src={imagePreview || blog.banner || blogBannerPlaceholder}
                      alt="Blog Banner"
                      className="w-full h-full object-cover"
                    />
                    {!imagePreview && !blog.banner && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-300">
                        <div className="text-center space-y-4">
                          <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">Upload Blog Banner</p>
                            <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG or JPEG (max 5MB)</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {(imagePreview || blog.banner) && (
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <p className="text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Click to change banner
                        </p>
                      </div>
                    )}
                  </>
                )}
                <input
                  id="uploadImage"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Blog Title Input */}
            <div className="my-8">
              <input
                type="text"
                value={blog.title}
                onChange={(e) =>
                  setBlog((prevBlog) => ({ ...prevBlog, title: e.target.value }))
                }
                placeholder="Enter your blog title..."
                className="w-full px-6 py-5 text-3xl md:text-4xl font-bold bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-300"
              />
            </div>

            {/* Editor Container */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 md:p-8 min-h-[500px]">
              <div className="textEditor prose prose-lg max-w-none" id="textEditor"></div>
            </div>

            {/* Helper Text */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>💡 Tip: Use the toolbar above to format your content and add rich media</p>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}

export default EditBlogPage;