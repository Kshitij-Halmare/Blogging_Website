// import React, { useContext } from 'react';
// import logo from "../../assets/sm_5b29ed73cf5c8.jpg";
// import { EditorContext } from '../../Pages/Editor/EditorPage.jsx';
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// function BlogEditorNavbar() {
//   const context = useContext(EditorContext);
//   const blog = context?.blog || {};
//   const setBlog = context?.setBlog;
//   const textEditor = context?.textEditor;
//   console.log(textEditor);
//   const setEditorState = context?.setEditorState;
//   const blogTitle = blog?.title || "Untitled Blog";
//   const navigate = useNavigate();

//   const handlePublish = () => {
//     if (!blog?.title?.trim()) {
//       return toast.error("Write a blog title to publish it.");
//     }
//     if (!blog?.banner?.trim()) {
//       return toast.error("Upload a blog banner to publish it.");
//     }

//     if (textEditor) {
//             if (data?.blocks?.length) {
//               setBlog?.({ ...blog, content: data });
//               setEditorState?.("publish");
//             } else {
//               toast.error("Write something in your blog to publish it.");
//             }
//       } 
//     }


//   const handleCancel = () => {
//     toast("Edit cancelled.");
//     // Additional cancel logic can be added here
//   };

//   return (
//     <nav className="z-10 flex justify-between h-20 sticky shadow-md py-2 top-0 px-4 items-center bg-white">
//       <div className="flex items-center">
//         <img
//           src={logo}
//           alt="Logo"
//           className="h-16 w-16 object-contain"
//           onClick={() => navigate("/")}
//         />
//         <p className="pl-4 text-lg font-serif whitespace-nowrap">{blogTitle}</p>
//       </div>
//       <div className="flex gap-2">
//         <button
//           className="p-2 bg-black text-white px-3 hover:bg-slate-900 rounded-full font-serif hover:scale-105 transition-transform duration-200"
//           onClick={handlePublish}
//           aria-label="Publish Blog"
//         >
//           Publish
//         </button>
//         <button
//           className="p-2 bg-slate-300 text-black px-3 hover:bg-slate-400 rounded-full font-serif hover:scale-105 transition-transform duration-200"
//           onClick={handleCancel}
//           aria-label="Cancel Blog Edit"
//         >
//           Cancel
//         </button>
//       </div>
//     </nav>
//   );
// }

// export default BlogEditorNavbar;

import { useContext } from "react";
import { EditorContext } from "../../Pages/Editor/EditorPage";
import toast from "react-hot-toast";
import logo from "../../assets/sm_5b29ed73cf5c8.jpg";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authetication/Authentication";

function BlogEditorNavbar() {
  const { blog, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
  const blogTitle = blog.title || "New Blog"; // Default to "New Blog" if title is not provided
  const navigate = useNavigate();
  const {user} = useAuth();

  const handlePublish = () => {
    if (!blog.banner.length) {
      return toast.error("Blog Banner Required");
    }
    if (!blog.title.length) {
      return toast.error("Blog title Required");
    }
    if (textEditor.isReady) {
      textEditor.save().then(data => {
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditorState("publish");
        } else {
          return toast.error("Write Something to publish");
        }
      }).catch((err) => {
        console.error(err);
        toast.error("An error occurred while saving the content");
      });
    }
  };

  const handleDraft = async () => {
    if (!blog.banner.length) {
      return toast.error("Blog Banner Required");
    }
    if (!blog.title.length) {
      return toast.error("Blog title Required");
    }

    try {
      console.log(user,blog);
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/createDraft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ blog, authorId: user.id, draft: true, blog_id: blog.blog_id })
      });

      const resData = await response.json();

      if (resData.success) {
        toast.success("Your blog is being saved as draft.");
      } else {
        toast.error(resData.message);
      }
    } catch (error) {
      console.error("Error saving blog as draft:", error);
      toast.error("An error occurred while saving your blog. Please try again.");
    }
  };

  return (
    <nav className="z-10 flex justify-between h-20 sticky shadow-md py-2 top-0 px-4 items-center bg-white">
      <div className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          className="h-16 w-16 object-contain"
          onClick={() => navigate("/")}
        />
        <p className="pl-4 text-lg font-serif whitespace-nowrap">{`${blogTitle}`}</p>
      </div>
      <div className="flex gap-2">
        <button
          className="p-2 bg-black text-white px-3 hover:bg-slate-900 rounded-full font-serif hover:scale-105 transition-transform duration-200"
          onClick={handlePublish}
          aria-label="Publish Blog"
        >
          Publish
        </button>
        <button
          className="p-2 bg-slate-300 text-black px-3 hover:bg-slate-400 rounded-full font-serif hover:scale-105 transition-transform duration-200"
          onClick={handleDraft} // Trigger save as draft
          aria-label="Save Blog as Draft"
        >
          Save as Draft
        </button>
      </div>
    </nav>
  );
}

export default BlogEditorNavbar;
