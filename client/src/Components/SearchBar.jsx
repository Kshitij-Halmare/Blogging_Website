import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InPageNavigation from './InPageNavigation';
import Blogcard from './Blogcard';
import AnimationWrapper from '../Animation/AnimationWrapper';
import FilterPaginationData from './FliterPaginationData';
import { useNavigate } from 'react-router-dom';
function SearchBar() {
    const { data } = useParams(); // Get query from URL params
    const query = data;
    const [blogs, setBlogs] = useState([]); // Store the blogs data
    const [page, setPage] = useState(1); // Add page state for pagination
    const [totalDocs, setTotalDocs] = useState(0); // Total number of blogs for pagination
    const [isLoading, setIsLoading] = useState(false); // State to handle loading state
    const [dataPerson, setDataPerson] = useState([]); // Store the user data
    const category = query;
  
    // Function to fetch blogs based on query and page number
    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getSpecificTag`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query, // Send query to search for blog titles
                    page, // Send the current page number
                }),
            });
    
            const data = await response.json();
            if (data.success && data.data) {
                const formattedData = await FilterPaginationData({
                    createNewArray: false,
                    state: { results: blogs, page: page },
                    data: data.data,
                    page: page,
                    countRoute: "all-latestblog-count",
                    data_to_send: category,
                });
                setBlogs(formattedData.results);
                setTotalDocs(formattedData.totalDocs);
            } else {
                console.error("No data received or error in the response");
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch user data
    const fetchUser = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/findUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query })
            });
            const resData = await response.json();

            if (resData.success) {
                setDataPerson(resData.data);
            } else {
                setDataPerson([]); // Reset user data if no users found
                console.error("No users found");
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            setDataPerson([]); // Reset user data on error
        }
    };

    // Load blogs and user data when the query changes or pagination changes
    useEffect(() => {
        setBlogs([]); // Clear blogs when the query changes
        setPage(1); // Reset to page 1 when query changes
        fetchBlogs();
        fetchUser();
    }, [query]); // Dependency array includes query

    // Handle "Load More" button click to load more blogs
    const handleLoadMore = () => {
        if (blogs.length * page < totalDocs) {
            setPage(prevPage => prevPage + 1); // Increment the page number to load more blogs
        }
    };

    // Use effect to fetch new blogs when page changes
    useEffect(() => {
        if (page > 1) {
            fetchBlogs(); // Fetch new data for the next page
        }
    }, [page]); // Dependency array includes page

    return (
        <div className="w-full px-4  flex flex-col md:flex-col gap-8">
            <InPageNavigation
                routes={[`Search Results for "${query}"`, 'Account Matched']}
                defaultHidden={['Account Matched']}
            >
                {/* Main Blog Section */}
                <div className='w-full md:flex'>
                <div className="w-full md:w-2/3  min-w-[60%]">
                    {isLoading ? (
                        <div className="flex justify-center items-center mt-10">
                            <div className="animate-spin inline-block w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full"></div>
                        </div>
                    ) : (
                        <>
                            {blogs.length > 0 ? (
                                <>
                                    <div className="">
                                        {blogs.map((blog, index) => (
                                            <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                                <Blogcard content={blog} author={blog.author} />
                                            </AnimationWrapper>
                                        ))}
                                    </div>
                                    {blogs.length > 0 && page * 3 < totalDocs && !isLoading && (
                                        <div className="flex justify-center mt-6">
                                            <button
                                                onClick={handleLoadMore}
                                                className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
                                            >
                                                Load More
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-center text-gray-500">No blogs available at the moment.</p>
                            )}
                        </>
                    )}
                </div>
                    
                {/* User Information Section */}
                <div className="w-full min-w-[40%] md:block hidden space-y-6">
                    {dataPerson.length > 0 ? (
                        <div className="p-6  rounded-lg shadow-lg bg-white">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">User Profile</h2>
                            {dataPerson.map((person, index) => (
                                <div key={index} className="flex items-center space-x-4 mb-6">
                                    <img
                                        src={person.personal_info.profile_img || '/default-avatar.png'} // Default image if no profile image exists
                                        alt={`${person.personal_info.username}'s profile`}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-medium text-lg text-gray-900">{person.personal_info.full_name}</h3>
                                        <p className="text-sm text-gray-500">{person.personal_info.username}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No users found for this query.</p>
                    )}
                </div>
                </div>

                {/* User Information Section */}
                <div className="w-full min-w-[40%] space-y-6">
                    {dataPerson.length > 0 ? (
                        <div className="p-6 bg-white rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">User Profile</h2>
                            {dataPerson.map((person, index) => (
                                <div key={index} className="flex items-center space-x-4 mb-6">
                                    <img
                                        src={person.personal_info.profile_img || '/default-avatar.png'} // Default image if no profile image exists
                                        alt={`${person.personal_info.username}'s profile`}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-medium text-lg text-gray-900">{person.personal_info.full_name}</h3>
                                        <p className="text-sm text-gray-500">{person.personal_info.username}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No users found for this query.</p>
                    )}
                </div>
            </InPageNavigation>
        </div>
    );
}

export default SearchBar;
