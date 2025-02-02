import React, { useEffect, useState } from 'react';
import AnimationWrapper from '../Animation/AnimationWrapper';
import InPageNavigation from '../Components/InPageNavigation';
import Blogcard from '../Components/Blogcard';
import TrendingBlogcard from '../Components/TrendingBlogCard';
import FilterPaginationData from '../Components/FliterPaginationData';

function Home() {
  const [blogs, setBlogs] = useState([]); // To store blogs
  const [specificBlogs, setSpecificBlogs] = useState([]); // For specific category blogs
  const [trendingBlogs, setTrendingBlogs] = useState([]); // For trending blogs
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [totalDocs, setTotalDocs] = useState(0); // To track total document count for pagination
  const [page, setPage] = useState(1); // Pagination state for all blogs
  const [specificPage, setSpecificPage] = useState(1); // Pagination state for specific category blogs
  const [totalSpecificDocs, setTotalSpecificDocs] = useState(0); // Total document count for specific category blogs

  const categories = [
    "Technology", "Health", "Finance", "Sports", "Entertainment",
    "Education", "Lifestyle", "Business", "Travel", "Food", "Science", "Art"
  ];

  // Fetching blogs with pagination
  const getBlog = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getBlog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page }) // Send the current page to the server
      });

      const resData = await response.json();
      if (resData && resData.data) {
        // Get the data for the current page and pass it to FilterPaginationData
        const formattedData = await FilterPaginationData({
          createNewArray: false,
          state: { results: blogs, page }, // Pass current results and page to FilterPaginationData
          data: resData.data,
          page,
          countRoute: "all-latestblog-count", // Correct route for counting documents
          data_to_send: {}
        });
        // Update the blogs and totalDocs based on the fetched data
        setBlogs(formattedData.results); // Append new data to existing blogs
        if (formattedData.totalDocs) {
          setTotalDocs(formattedData.totalDocs);
        }
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Fetching blogs for a specific category
  const getSpecificBlog = async (category) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getSpecificTag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, page: specificPage }) // Pass specificPage for pagination
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        const formattedData = await FilterPaginationData({
          createNewArray: false,
          state: { results: specificBlogs, page: specificPage }, // Pass current results and specificPage to FilterPaginationData
          data: resData.data,
          page: specificPage,
          countRoute: "all-latestblog-count",
          data_to_send: { category }
        });
        setSpecificBlogs(formattedData.results);
        setTotalSpecificDocs(formattedData.totalDocs); // Set the total document count for specific blogs
      }
    } catch (err) {
      console.error("Error fetching specific blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetching trending blogs
  const getTrendingBlog = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/trendingBlog`, {
        method: "GET",
      });
      const resData = await response.json();
      if (resData && resData.data) {
        setTrendingBlogs(resData.data); // Set the trending blogs
      }
    } catch (error) {
      console.error("Error fetching trending blogs:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getBlog(), getTrendingBlog()]).finally(() => setIsLoading(false));
  }, [page]); // Re-fetch on page change

  useEffect(() => {
    if (selectedCategory) {
      setIsLoading(true);
      setSpecificBlogs([]); // Clear previous specific blogs when category changes
      setSpecificPage(1); // Reset specificPage when the category changes
      getSpecificBlog(selectedCategory).finally(() => setIsLoading(false));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (specificPage > 1) {
      getSpecificBlog(selectedCategory);
    }
  }, [specificPage]); // Fetch specific blogs when specificPage changes

  const handleLoadMore = () => {
    if (page * 3 < totalDocs) { // Check if there is more data to load (3 per page)
      setPage(prevPage => prevPage + 1); // Increment the page number to load next set of blogs
    }
  };

  const handleLoadMoreSpecific = () => {
    if (specificPage * 3 < totalSpecificDocs) { // Check if there is more data to load (3 per page)
      setSpecificPage(prevPage => prevPage + 1); // Increment the specificPage number
    }
  };

  return (
    <AnimationWrapper>
    <div className="flex flex-col md:flex-row bg-slate-50">
        <section className="h-cover flex flex-col justify-center gap-10 md:flex-row md:min-w-[60%] border-r-2 border-gray-100">
            <div className="w-full px-4">
                <InPageNavigation routes={selectedCategory ? [selectedCategory] : ["Home", "Trending Blogs"]} defaultHidden={["Trending Blogs"]}>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {selectedCategory ? (
                                <>
                                    {specificBlogs.length > 0 ? (
                                        <>
                                            <h1 className="text-2xl font-bold mb-6">{selectedCategory}</h1>
                                            <div className="flex flex-col md:flex-row md:flex-wrap gap-8 w-full">
                                                {specificBlogs.map((blog, index) => (
                                                    <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                                        <Blogcard content={blog} author={blog.author} />
                                                    </AnimationWrapper>
                                                ))}
                                            </div>
                                            {specificBlogs.length > 0 && specificPage * 3 < totalSpecificDocs && !isLoading && (
                                                <div className="flex justify-center mt-4">
                                                    <button onClick={handleLoadMoreSpecific} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                                                        Load More
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p>No blogs available in this category.</p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-bold mb-6">Latest Blogs</h1>
                                    {blogs.length > 0 ? (
                                        <>
                                            <div className="flex flex-col md:flex-row md:flex-wrap gap-8">
                                                {blogs.map((blog, index) => (
                                                    <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                                        <Blogcard content={blog} author={blog.author} />
                                                    </AnimationWrapper>
                                                ))}
                                            </div>
                                            {blogs.length > 0 && page * 3 < totalDocs && !isLoading && (
                                                <div className="flex justify-center mt-4">
                                                    <button onClick={handleLoadMore} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                                                        Load More
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p>No blogs available at the moment.</p>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    {/* Trending Blogs */}
                    <h1 className="text-2xl font-bold mb-6">Trending Blogs</h1>
                    {trendingBlogs.length > 0 ? (
                        <div className="flex flex-col md:flex-row md:flex-wrap gap-8">
                            {trendingBlogs.map((blog, index) => (
                                <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                                    <TrendingBlogcard content={blog} author={blog.author} index={index} />
                                </AnimationWrapper>
                            ))}
                        </div>
                    ) : (
                        <p>No trending blogs available at the moment.</p>
                    )}
                </InPageNavigation>
            </div>
        </section>
        <aside className="p-4 h-cover w-full md:w-1/3">
            <div className='hidden md:block'>
                <h1 className="font-semibold text-lg font-sans mb-4">Stories From All Interests</h1>
                <hr className="mt-4 mb-6" />
                <div className="flex flex-wrap gap-3 mb-6">
                    {categories.map((category, index) => (
                        <p
                            key={index}
                            onClick={() => {
                                setSelectedCategory(category);
                                setSpecificBlogs([]);
                            }}
                            className="cursor-pointer hover:scale-105 px-3 py-1 rounded-full bg-slate-100 text-gray-700 hover:bg-gray-200 transition duration-300"
                        >
                            {category}
                        </p>
                    ))}
                </div>
            </div>
            <hr className="my-5" />
            <h1 className="font-semibold text-lg mb-4">Trending</h1>
            {trendingBlogs.length > 0 ? (
                <div className="flex flex-col md:flex-row md:flex-wrap gap-8">
                    {trendingBlogs.map((blog, index) => (
                        <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
                            <TrendingBlogcard content={blog} author={blog.author} index={index} />
                        </AnimationWrapper>
                    ))}
                </div>
            ) : (
                <p>No trending blogs available at the moment.</p>
            )}
        </aside>
    </div>
</AnimationWrapper>

  );
}

export default Home;
