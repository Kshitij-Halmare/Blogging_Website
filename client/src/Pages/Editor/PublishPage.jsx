import React, { useContext, useState } from 'react';
import AnimationWrapper from '../../Animation/AnimationWrapper';
import { FaTimesCircle } from 'react-icons/fa';
import { EditorContext } from './EditorPage';
import Tags from '../../Components/Editor/Tags';
import toast from 'react-hot-toast';
import {useAuth} from "../../Authetication/Authentication.jsx"
import BlogEditorNavbar from '../../Components/Editor/BlogEditorNavbar.jsx';
function PublishPage() {
  // const user=useContext(useAuth);
  const { user } = useAuth();
  // console.log(user);  
  const NumberofTags = 5;
  const { setEditorState, blog, setBlog } = useContext(EditorContext);
  // console.log(blog);
  const [tag, setTag] = useState("");
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
  const handleubmit = async () => {
    // console.log(user);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/createBlog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ blog, authorId: user.id,draft:false,blog_id:blog.blog_id })
      });
  
      const resData = await response.json();
      // console.log(response, resData);
  
      if (resData.success) {
        toast.success("Your blog is being published.");
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      console.error("Error publishing blog:", error);
      toast.error("An error occurred while publishing your blog. Please try again.");
    }
  };
  
  const handleBlogDescriptionChange = (e) => {
    setBlog((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };
  const handleAddTheTag = (e) => {
    const text = tag;
    // console.log(text);
    if (!blog.tags.includes(text) && text.length > 0) {
      if (blog.tags.length < NumberofTags) {
        blog.tags.push(text);
        setTag("");
        toast.success("Tag added Successfully");
      } else {
        toast.error("Tags limit exceeded");
      }
    } else {
      toast.error("Please add any tag or it may be included before only")
    }
  }
  return (
    <AnimationWrapper>

      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex flex-col items-center py-10 px-4">
        {/* Close Button */}
        <FaTimesCircle
          onClick={goBack}
          className="cursor-pointer text-3xl bg-gray-800 text-white rounded-full p-1 absolute top-6 right-6 hover:bg-red-500 transition duration-300"
          title="Go Back to Editor"
        />

        {/* Header */}
        {/* <h1 className="text-4xl font-serif font-semibold text-gray-800 mb-8">Publish Your Blog</h1> */}

        {/* Preview Section */}
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Preview</h2>

          {/* Banner Image */}
          <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden mb-6">
            {blog?.banner ? (
              <img
                src={blog.banner}
                alt="Blog Banner"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <p className="text-xl">No Banner Image Available</p>
              </div>
            )}
          </div>

          {/* Blog Content */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {blog?.title || 'Untitled Blog'}
            </h1>
            <p className="text-gray-700 leading-through">
              {blog?.description || 'Write a short description to preview your blog content here.'}
            </p>
          </div>

          {/* Blog Editing Form */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Blog Details</h3>

            {/* Blog Title Input */}
            <div className="mb-4">
              <label htmlFor="blog-title" className="block text-gray-600 font-medium mb-2">
                Blog Title
              </label>
              <input
                id="blog-title"
                type="text"
                onChange={handleBlogTitleChange}
                value={blog.title}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Blog Description Input */}
            <div className='mb-8'>
              <label htmlFor="blog-description" className="block text-gray-600 font-medium mb-2">
                Blog Description
              </label>
              <textarea
                id="blog-description"
                onChange={handleBlogDescriptionChange}
                value={blog.description}
                maxLength={200}
                rows={4}
                onKeyDown={handleKeyDown}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Write a short description about your blog (max 200 characters)"
              ></textarea>
              <p className="text-red-600 text-right mt-1">Maximum 200 characters allowed</p>
            </div>
            <div >
              <p className='mt-9 mb-2 text-gray-800 font-semibold text-xl'>Topics-[Helps in Searching and ranking your blog]</p>
              <input type="text" onChange={(e) => setTag(e.target.value)} value={tag} placeholder='Topic' className='sticky bg-white w-full focus:outline-gray-100 p-2 rounded-lg border left-0 top-4 pb-4 mb-3 focus:bg-white' />
              <button className='bg-black hover:opacity-80 p-2 px-3 rounded-lg text-white' onClick={handleAddTheTag}>Add</button>
              <div className="flex gap-2 mt-5 flex-wrap">
                {blog.tags.map((val, i) => (
                  <Tags key={i} tag={val} index={i} />
                ))}
              </div>
              <p className='text-red-600 text-right'>Only {5 - blog.tags.length} are left that can be added</p>
            </div>
          </div>
          <button onClick={handleubmit}>Publish</button>
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default PublishPage;


