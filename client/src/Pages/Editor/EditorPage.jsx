import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../../Authetication/Authentication.jsx"
import React from 'react'
import EditBlogPage from "./EditBlogPage.jsx";
import PublishPage from "./PublishPage.jsx"
import BlogId from "./BlogId.jsx";

const blogStrucuter = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  description: "",
  author: { personal_info: {} }
}

export const EditorContext = createContext({});
function EditorPage() {
  const [blog, setBlog] = useState(blogStrucuter);
  let  {blog_id}  = useParams();
  // console.log(blog_id);
  const user = useAuth();
  const [isLiked,setIsLikedUser]=useState(false);
  const [textEditor, setTextEditor] = useState({ isReady: false })
  // console.log(user);
  const [loading, setLoading] = useState(true);
  const [editorState, setEditorState] = useState("editor");
  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }
    const fetchBlogDetails = async () => {
      if (!blog_id) {
        setLoading(false);
        return;
      }

      try {
        const id=blog_id;
        const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getBlogData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, draft: true, mode: "edit" }), // fixed mode to "edit"
        });

        const resData = await response.json();

        if (resData.success) {
          console.log(resData);
          setBlog(resData.data);
        } else {
          console.error("Error fetching blog data:", resData);
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [blog_id])
  return (
    <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor, isLiked, setIsLikedUser }}>
      {
        user.user === null ? <Navigate to="/signup" /> :
          loading ? (<h1>loading</h1>) :
            editorState === "editor" ? <EditBlogPage /> : <PublishPage />

      }
    </EditorContext.Provider>
  )
}

export default EditorPage