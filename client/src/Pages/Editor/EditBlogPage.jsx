import React, { useContext, useEffect, useState } from 'react';
import toast from "react-hot-toast";
import blogBannerPlaceholder from "../../assets/360_F_588335931_SG8mqLyvPnIQZL6vlkDtDhtJacYDoFuQ.jpg";
import BlogEditorNavbar from '../../Components/Editor/BlogEditorNavbar';
import AnimationWrapper from '../../Animation/AnimationWrapper';
import { EditorContext } from './EditorPage';
import EditorJS from '@editorjs/editorjs';
import { editorTools } from './Tools';
import { useAuth } from '../../Authetication/Authentication';

// function EditBlogPage() {
//   const { blog, setBlog, textEditor, setTextEditor } = useContext(EditorContext);
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     // Only initialize the editor if it's not already initialized
//     if (!textEditor) {
//       const editor = new EditorJS({
//         holder: "textEditor",
//         data: {
//           blocks: blog.content && blog.content.length > 0 ? blog.content[0].blocks : [],
//         },
//         tools: editorTools,
//         placeholder: "Start Writing a new Journey ...",
//       });

//       setTextEditor(editor);
//     }


//   }, [blog, textEditor, setTextEditor]);  // Add dependencies

//   const userId = user.data.email;
//   console.log(userId);

//   const handleImageUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) {
//       toast.error('No file selected.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('image', file);

//     try {
//       setLoading(true);

//       // Display the image preview immediately after selection
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result); // Set preview for image
//       };
//       reader.readAsDataURL(file);

//       const response = await fetch(
//         `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/upload-blog-banner/${userId}`,
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to upload image');
//       }

//       const data = await response.json();

//       // Updating the blog banner in the context state
//       setBlog((prevBlog) => ({
//         ...prevBlog,
//         banner: data.bannerImageUrl,
//       }));

//       toast.success('Image uploaded successfully');
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       toast.error('Error uploading image');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <BlogEditorNavbar />
//       <AnimationWrapper>
//         <section>
//           <div className='mx-auto max-w-[900px] w-full'>
//             {/* Banner image upload */}
//             <div className='relative aspect-video bg-white border-4 border-gray hover:opacity-80'>
//               <label htmlFor="uploadImage" className="cursor-pointer">
//                 {loading ? (
//                   <div className="flex items-center justify-center h-full">
//                     <p className="text-gray-500 font-semibold">Uploading...</p>
//                   </div>
//                 ) : (
//                   <>
//                     <img
//                       src={imagePreview || blog.banner || blogBannerPlaceholder} // Display image preview or fallback
//                       alt="Blog Banner"
//                       className="md:min-w-[800px] w-full h-full object-cover rounded-lg"
//                     />
//                     {!imagePreview && (
//                       <div className="absolute text-gray-600 font-bold font-serif top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
//                         <p className="md:text-4xl text-2xl">Upload</p>
//                         <p className="md:text-6xl text-3xl">Blog Banner</p>
//                       </div>
//                     )}
//                   </>
//                 )}
//                 <input
//                   id="uploadImage"
//                   type="file"
//                   accept=".png,.jpg,.jpeg"
//                   className="hidden"
//                   onChange={handleImageUpload}
//                 />
//               </label>
//             </div>

//             {/* Blog Title Input */}
//             <div className="my-4">
//               <input
//                 type="text"
//                 value={blog.title}
//                 onChange={(e) =>
//                   setBlog((prevBlog) => ({ ...prevBlog, title: e.target.value }))
//                 }
//                 placeholder="Enter Blog Title"
//                 className="w-full px-4 py-4 text-4xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className='textEditor' id='textEditor'></div> {/* This div should only appear once */}
//           </div>
//         </section>
//       </AnimationWrapper>
//     </>
//   );
// }

// export default EditBlogPage;


function EditBlogPage() {
  const { blog, setBlog, textEditor, setTextEditor } = useContext(EditorContext);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    useEffect(()=>{
      if(!textEditor.isReady){
        setTextEditor(new EditorJS({
          holderId:"textEditor",
          data:Array.isArray(blog.content)?blog.content[0]:EditBlogPage.content,
          tools:editorTools,
          placeholder:"Start Writing ..."
        }))
      }
    },[]);
    const userId = user.data.email;
  const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
          toast.error('No file selected.');
          return;
        }
    
        const formData = new FormData();
        formData.append('image', file);
    
        try {
          setLoading(true);
    
          // Display the image preview immediately after selection
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result); // Set preview for image
          };
          reader.readAsDataURL(file);
    
          const response = await fetch(
            `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/upload-blog-banner/${userId}`,
            {
              method: 'POST',
              body: formData,
            }
          );
    
          if (!response.ok) {
            throw new Error('Failed to upload image');
          }
    
          const data = await response.json();
    
          // Updating the blog banner in the context state
          setBlog((prevBlog) => ({
            ...prevBlog,
            banner: data.bannerImageUrl,
          }));
    
          toast.success('Image uploaded successfully');
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('Error uploading image');
        } finally {
          setLoading(false);
        }
      };
  return (
    <>
      <BlogEditorNavbar />
      <AnimationWrapper>
        <section>
          <div className='mx-auto max-w-[900px] w-full '>
          <div className='relative aspect-video bg-white border-4 border-gray hover:opacity-80'>
               <label htmlFor="uploadImage" className="cursor-pointer">
                 {loading ? (
                   <div className="flex items-center justify-center h-full">
                     <p className="text-gray-500 font-semibold">Uploading...</p>
                   </div>
                 ) : (
                   <>
                     <img
                      src={imagePreview || blog.banner || blogBannerPlaceholder} // Display image preview or fallback
                      alt="Blog Banner"
                      className="md:min-w-[800px] w-full h-full object-cover rounded-lg"
                    />
                    {!imagePreview && (
                      <div className="absolute text-gray-600 font-bold font-serif top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="md:text-4xl text-2xl">Upload</p>
                        <p className="md:text-6xl text-3xl">Blog Banner</p>
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
                />
              </label>
            </div>
            <div className="my-4">
               <input
                type="text"
                value={blog.title}
                onChange={(e) =>
                  setBlog((prevBlog) => ({ ...prevBlog, title: e.target.value }))
                }
                placeholder="Enter Blog Title"
                className="w-full px-4 py-4 text-4xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
             <div className='textEditor' id='textEditor'></div>

          </div>
        </section>
      </AnimationWrapper>
    </>
  )
}

export default EditBlogPage