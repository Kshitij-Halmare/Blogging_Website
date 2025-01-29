import React, { useContext } from 'react';
import { BlogContext } from '../../Pages/Editor/BlogId';
import { FaTimesCircle } from 'react-icons/fa';
import CommentFeild from './CommentFeild';

export const fetchComment = async ({
  skip =0,
  blog_id,
  setParentCommentCountfun,
  comment_array = null,
  isReply,
}) => {
  // console.log(blog_id,skip);
  const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getCommentData`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blog_id, skip,isReply }),
  });

  const resData = await response.json();
  // console.log(resData);
  if (resData.success) {
      const data = resData.data;
      data.map(comment=>{
        comment.childrenLevel=0;
      });
      console.log(data.length);
      setParentCommentCountfun(prev=>prev+data.length);
      return { 
          results: comment_array === null ? data : [...comment_array, ...data]
      };
  } else {
      console.error('Error fetching comments:', resData.message);
      return { results: [] };  // Return empty array on error
  }
};


function ComponentsContainer() {
  const {
    commentsWrapper,
    setCommentWrapper,
    totalParentsCommentsLoaded,
    blog_id,
    blog: { title, description, banner, content, publishedAt, tags, activity, author },
  } = useContext(BlogContext);
  
  return (
    <div
      className={`max-sm:w-full fixed rounded-xl ${
        commentsWrapper ? "top-0 sm:right-[0]" : "top-[200%] sm:right-[-100%]"
      } duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden`}
    >
      <div className="relative flex justify-between items-start">
        <div>
          <h1 className="text-xl font-medium">Comments</h1>
          <p className="text-lg mt-2 w-[70%] text-gray-800 line-clamp-1">{title}</p>
        </div>
        <button onClick={() => { setCommentWrapper(false) }}>
          <FaTimesCircle className="text-slate-600 hover:text-slate-800 flex items-center text-2xl" />
        </button>
      </div>
      <hr className="border-gray-400 my-8 w-[120%] -ml-10" />
      <CommentFeild action="Comment"/>

    </div>
  );
}

export default ComponentsContainer;
