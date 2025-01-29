import React, { useEffect, useState } from 'react';
import { useAuth } from '../Authetication/Authentication';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function DashBoardBlogs() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("Blogs");
    const [isLoading, setIsLoading] = useState(false);  // Loading state
    const list = ["Blogs", "Draft"];
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            if (!user || !user.id) {
                console.log("No user data available");
                return;
            }

            setIsLoading(true);  // Set loading state to true before fetching

            const user_id = user.id;
            const isDraft = filter === "Draft"; // Calculate isDraft based on the filter

            console.log('Fetching blogs with isDraft:', isDraft);

            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/fetchBlogs`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ user_id, isDraft }) // Passing directly as an object
                });

                const resData = await response.json();
                console.log(resData);

                if (resData.success) {
                    setData(resData.data);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setIsLoading(false); // Set loading state to false after fetching is complete
            }
        };

        fetchBlogs(); // Fetch blogs whenever `user` or `filter` changes

    }, [user, filter]); // Dependencies: user and filter change triggers the effect

    // Handle Delete
    const deleteBlog = async (blogId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/deleteBlog`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ blogId }),
            });

            const resData = await response.json();
            console.log(resData);
            if (resData.success) {
                // Remove the deleted blog from the state
                setData((prevData) => prevData.filter((blog) => blog._id !== blogId));
                toast("Successfully deleted");
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    return (
        <>
            <div className='flex gap-2 mx-4'>
                {list.map((l, i) => (
                    <h1
                        key={i}
                        onClick={() => { setFilter(l); }}
                        className={`text-lg duration-300 rounded-md py-2 px-4 cursor-pointer ${filter === l ? "bg-black text-white" : "bg-slate-200"}`}
                    >
                        {l}
                    </h1>
                ))}
            </div>
            <hr className='border-1 my-2' />
            
            {/* Display loading indicator while fetching */}
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16 border-solid"></div>
                </div>
            ) : (
                // Render blog cards
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.length > 0 ? (
                        data.map((blog) => (
                            <div key={blog._id} className="border rounded-lg p-4 shadow-lg">
                                {/* Blog Banner Image */}
                                <img src={blog.banner} alt={blog.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                                
                                {/* Blog Title */}
                                <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                                
                                {/* Blog Description */}
                                <p className="text-gray-700 mb-4">{blog.description}</p>
                                
                                {/* Delete Button */}
                                <button
                                    onClick={() => deleteBlog(blog._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No blogs found.</p>
                    )}
                </div>
            )}
        </>
    );
}

export default DashBoardBlogs;
