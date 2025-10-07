// import React, { useEffect, useState } from 'react';
// import AnimationWrapper from '../Animation/AnimationWrapper';
// import InPageNavigation from '../Components/InPageNavigation';
// import Blogcard from '../Components/Blogcard';
// import TrendingBlogcard from '../Components/TrendingBlogCard';
// import FilterPaginationData from '../Components/FliterPaginationData';

// function Home() {
//   const [blogs, setBlogs] = useState([]); // To store blogs
//   const [specificBlogs, setSpecificBlogs] = useState([]); // For specific category blogs
//   const [trendingBlogs, setTrendingBlogs] = useState([]); // For trending blogs
//   const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
//   const [isLoading, setIsLoading] = useState(true); // Loading state
//   const [totalDocs, setTotalDocs] = useState(0); // To track total document count for pagination
//   const [page, setPage] = useState(1); // Pagination state for all blogs
//   const [specificPage, setSpecificPage] = useState(1); // Pagination state for specific category blogs
//   const [totalSpecificDocs, setTotalSpecificDocs] = useState(0); // Total document count for specific category blogs

//   const categories = [
//     "Technology", "Health", "Finance", "Sports", "Entertainment",
//     "Education", "Lifestyle", "Business", "Travel", "Food", "Science", "Art"
//   ];

//   // Fetching blogs with pagination
//   const getBlog = async () => {
//     try {
//       setIsLoading(true); // Start loading
//       const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getBlog`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ page }) // Send the current page to the server
//       });

//       const resData = await response.json();
//       if (resData && resData.data) {
//         // Get the data for the current page and pass it to FilterPaginationData
//         const formattedData = await FilterPaginationData({
//           createNewArray: false,
//           state: { results: blogs, page }, // Pass current results and page to FilterPaginationData
//           data: resData.data,
//           page,
//           countRoute: "all-latestblog-count", // Correct route for counting documents
//           data_to_send: {}
//         });
//         // Update the blogs and totalDocs based on the fetched data
//         setBlogs(formattedData.results); // Append new data to existing blogs
//         if (formattedData.totalDocs) {
//           setTotalDocs(formattedData.totalDocs);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching blogs:", error);
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   // Fetching blogs for a specific category
//   const getSpecificBlog = async (category) => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getSpecificTag`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ category, page: specificPage }) // Pass specificPage for pagination
//       });
//       const resData = await response.json();
//       if (resData.success && resData.data) {
//         const formattedData = await FilterPaginationData({
//           createNewArray: false,
//           state: { results: specificBlogs, page: specificPage }, // Pass current results and specificPage to FilterPaginationData
//           data: resData.data,
//           page: specificPage,
//           countRoute: "all-latestblog-count",
//           data_to_send: { category }
//         });
//         setSpecificBlogs(formattedData.results);
//         setTotalSpecificDocs(formattedData.totalDocs); // Set the total document count for specific blogs
//       }
//     } catch (err) {
//       console.error("Error fetching specific blogs:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetching trending blogs
//   const getTrendingBlog = async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/trendingBlog`, {
//         method: "GET",
//       });
//       const resData = await response.json();
//       if (resData && resData.data) {
//         setTrendingBlogs(resData.data); // Set the trending blogs
//       }
//     } catch (error) {
//       console.error("Error fetching trending blogs:", error);
//     }
//   };

//   useEffect(() => {
//     setIsLoading(true);
//     Promise.all([getBlog(), getTrendingBlog()]).finally(() => setIsLoading(false));
//   }, [page]); // Re-fetch on page change

//   useEffect(() => {
//     if (selectedCategory) {
//       setIsLoading(true);
//       setSpecificBlogs([]); // Clear previous specific blogs when category changes
//       setSpecificPage(1); // Reset specificPage when the category changes
//       getSpecificBlog(selectedCategory).finally(() => setIsLoading(false));
//     }
//   }, [selectedCategory]);

//   useEffect(() => {
//     if (specificPage > 1) {
//       getSpecificBlog(selectedCategory);
//     }
//   }, [specificPage]); // Fetch specific blogs when specificPage changes

//   const handleLoadMore = () => {
//     if (page * 3 < totalDocs) { // Check if there is more data to load (3 per page)
//       setPage(prevPage => prevPage + 1); // Increment the page number to load next set of blogs
//     }
//   };

//   const handleLoadMoreSpecific = () => {
//     if (specificPage * 3 < totalSpecificDocs) { // Check if there is more data to load (3 per page)
//       setSpecificPage(prevPage => prevPage + 1); // Increment the specificPage number
//     }
//   };

//   return (
//     <AnimationWrapper>
//     <div className="flex flex-col md:flex-row bg-slate-50">
//         <section className="h-cover flex flex-col justify-center gap-10 md:flex-row md:min-w-[60%] border-r-2 border-gray-100">
//             <div className="w-full px-4">
//                 <InPageNavigation routes={selectedCategory ? [selectedCategory] : ["Home", "Trending Blogs"]} defaultHidden={["Trending Blogs"]}>
//                     {isLoading ? (
//                         <div className="flex justify-center items-center h-full">
//                             <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
//                         </div>
//                     ) : (
//                         <>
//                             {selectedCategory ? (
//                                 <>
//                                     {specificBlogs.length > 0 ? (
//                                         <>
//                                             <h1 className="text-2xl font-bold mb-6">{selectedCategory}</h1>
//                                             <div className="flex flex-col md:flex-row md:flex-wrap gap-8 w-full">
//                                                 {specificBlogs.map((blog, index) => (
//                                                     <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
//                                                         <Blogcard content={blog} author={blog.author} />
//                                                     </AnimationWrapper>
//                                                 ))}
//                                             </div>
//                                             {specificBlogs.length > 0 && specificPage * 3 < totalSpecificDocs && !isLoading && (
//                                                 <div className="flex justify-center mt-4">
//                                                     <button onClick={handleLoadMoreSpecific} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
//                                                         Load More
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </>
//                                     ) : (
//                                         <p>No blogs available in this category.</p>
//                                     )}
//                                 </>
//                             ) : (
//                                 <>
//                                     <h1 className="text-2xl font-bold mb-6">Latest Blogs</h1>
//                                     {blogs.length > 0 ? (
//                                         <>
//                                             <div className="flex flex-col md:flex-row md:flex-wrap gap-8">
//                                                 {blogs.map((blog, index) => (
//                                                     <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
//                                                         <Blogcard content={blog} author={blog.author} />
//                                                     </AnimationWrapper>
//                                                 ))}
//                                             </div>
//                                             {blogs.length > 0 && page * 3 < totalDocs && !isLoading && (
//                                                 <div className="flex justify-center mt-4">
//                                                     <button onClick={handleLoadMore} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
//                                                         Load More
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </>
//                                     ) : (
//                                         <p>No blogs available at the moment.</p>
//                                     )}
//                                 </>
//                             )}
//                         </>
//                     )}
//                     {/* Trending Blogs */}
//                     <h1 className="text-2xl font-bold mb-6">Trending Blogs</h1>
//                     {trendingBlogs.length > 0 ? (
//                         <div className="flex flex-col md:flex-row md:flex-wrap gap-8">
//                             {trendingBlogs.map((blog, index) => (
//                                 <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
//                                     <TrendingBlogcard content={blog} author={blog.author} index={index} />
//                                 </AnimationWrapper>
//                             ))}
//                         </div>
//                     ) : (
//                         <p>No trending blogs available at the moment.</p>
//                     )}
//                 </InPageNavigation>
//             </div>
//         </section>
//         <aside className="p-4 h-cover w-full md:w-1/3">
//             <div className='hidden md:block'>
//                 <h1 className="font-semibold text-lg font-sans mb-4">Stories From All Interests</h1>
//                 <hr className="mt-4 mb-6" />
//                 <div className="flex flex-wrap gap-3 mb-6">
//                     {categories.map((category, index) => (
//                         <p
//                             key={index}
//                             onClick={() => {
//                                 setSelectedCategory(category);
//                                 setSpecificBlogs([]);
//                             }}
//                             className="cursor-pointer hover:scale-105 px-3 py-1 rounded-full bg-slate-100 text-gray-700 hover:bg-gray-200 transition duration-300"
//                         >
//                             {category}
//                         </p>
//                     ))}
//                 </div>
//             </div>
//             <hr className="my-5" />
//             <h1 className="font-semibold text-lg mb-4">Trending</h1>
//             {trendingBlogs.length > 0 ? (
//                 <div className="flex flex-col md:flex-row md:flex-wrap gap-8">
//                     {trendingBlogs.map((blog, index) => (
//                         <AnimationWrapper key={index} transition={{ duration: 1, delay: index * 0.1 }}>
//                             <TrendingBlogcard content={blog} author={blog.author} index={index} />
//                         </AnimationWrapper>
//                     ))}
//                 </div>
//             ) : (
//                 <p>No trending blogs available at the moment.</p>
//             )}
//         </aside>
//     </div>
// </AnimationWrapper>

//   );
// }

// export default Home;






import React, { useEffect, useState } from 'react';
import AnimationWrapper from '../Animation/AnimationWrapper';
import InPageNavigation from '../Components/InPageNavigation';
import Blogcard from '../Components/Blogcard';
import TrendingBlogcard from '../Components/TrendingBlogCard';
import FilterPaginationData from '../Components/FliterPaginationData';
import { Sparkles, TrendingUp, Grid3x3, Flame } from 'lucide-react';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [specificBlogs, setSpecificBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalDocs, setTotalDocs] = useState(0);
  const [page, setPage] = useState(1);
  const [specificPage, setSpecificPage] = useState(1);
  const [totalSpecificDocs, setTotalSpecificDocs] = useState(0);

  const categories = [
    { name: "Technology", gradient: "from-blue-500 to-cyan-500", icon: "💻" },
    { name: "Health", gradient: "from-green-500 to-emerald-500", icon: "🏥" },
    { name: "Finance", gradient: "from-yellow-500 to-orange-500", icon: "💰" },
    { name: "Sports", gradient: "from-red-500 to-pink-500", icon: "⚽" },
    { name: "Entertainment", gradient: "from-purple-500 to-pink-500", icon: "🎬" },
    { name: "Education", gradient: "from-indigo-500 to-blue-500", icon: "📚" },
    { name: "Lifestyle", gradient: "from-pink-500 to-rose-500", icon: "✨" },
    { name: "Business", gradient: "from-gray-600 to-gray-800", icon: "💼" },
    { name: "Travel", gradient: "from-teal-500 to-cyan-500", icon: "✈️" },
    { name: "Food", gradient: "from-orange-500 to-red-500", icon: "🍕" },
    { name: "Science", gradient: "from-violet-500 to-purple-500", icon: "🔬" },
    { name: "Art", gradient: "from-fuchsia-500 to-purple-500", icon: "🎨" }
  ];

  const getBlog = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getBlog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page })
      });
      const resData = await response.json();
      console.log(resData);
      if (resData && resData.data) {
        const formattedData = await FilterPaginationData({
          createNewArray: false,
          state: { results: blogs, page },
          data: resData.data,
          page,
          countRoute: "all-latestblog-count",
          data_to_send: {}
        });
        setBlogs(formattedData.results);
        if (formattedData.totalDocs) {
          setTotalDocs(formattedData.totalDocs);
        }
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSpecificBlog = async (category) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getSpecificTag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, page: specificPage })
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        const formattedData = await FilterPaginationData({
          createNewArray: false,
          state: { results: specificBlogs, page: specificPage },
          data: resData.data,
          page: specificPage,
          countRoute: "all-latestblog-count",
          data_to_send: { category }
        });
        setSpecificBlogs(formattedData.results);
        setTotalSpecificDocs(formattedData.totalDocs);
      }
    } catch (err) {
      console.error("Error fetching specific blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendingBlog = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/trendingBlog`, {
        method: "GET",
      });
      const resData = await response.json();
      if (resData && resData.data) {
        setTrendingBlogs(resData.data);
      }
    } catch (error) {
      console.error("Error fetching trending blogs:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getBlog(), getTrendingBlog()]).finally(() => setIsLoading(false));
  }, [page]);

  useEffect(() => {
    if (selectedCategory) {
      setIsLoading(true);
      setSpecificBlogs([]);
      setSpecificPage(1);
      getSpecificBlog(selectedCategory).finally(() => setIsLoading(false));
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (specificPage > 1) {
      getSpecificBlog(selectedCategory);
    }
  }, [specificPage]);

  const handleLoadMore = () => {
    if (page * 3 < totalDocs) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleLoadMoreSpecific = () => {
    if (specificPage * 3 < totalSpecificDocs) {
      setSpecificPage(prevPage => prevPage + 1);
    }
  };

  return (
    <AnimationWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4 mb-8">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="relative max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Discover Stories
              </h1>
            </div>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              Explore the latest insights, trends, and stories from creators around the world
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 pb-12">
          {/* Main Content */}
          <section className="flex-1 min-w-0">
            <InPageNavigation 
              routes={selectedCategory ? [selectedCategory] : ["Latest", "Trending"]} 
              defaultHidden={["Trending"]}
            >
              {isLoading ? (
                <div className="flex flex-col justify-center items-center h-96">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-200 border-solid rounded-full"></div>
                    <div className="w-20 h-20 border-t-4 border-indigo-600 border-solid rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">Loading amazing content...</p>
                </div>
              ) : (
                <>
                  {selectedCategory ? (
                    <>
                      {specificBlogs.length > 0 ? (
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-8">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categories.find(c => c.name === selectedCategory)?.gradient || 'from-gray-500 to-gray-700'} flex items-center justify-center text-2xl shadow-lg`}>
                              {categories.find(c => c.name === selectedCategory)?.icon || '📝'}
                            </div>
                            <div>
                              <h2 className="text-3xl font-bold text-gray-900">{selectedCategory}</h2>
                              <p className="text-gray-600">{specificBlogs.length} stories</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-6">
                            {specificBlogs.map((blog, index) => (
                              <AnimationWrapper key={index} transition={{ duration: 0.5, delay: index * 0.1 }}>
                                <div className="transform hover:scale-[1.02] transition-all duration-300">
                                  <Blogcard content={blog} author={blog.author} />
                                </div>
                              </AnimationWrapper>
                            ))}
                          </div>
                          {specificPage * 3 < totalSpecificDocs && (
                            <div className="flex justify-center mt-8">
                              <button 
                                onClick={handleLoadMoreSpecific} 
                                className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                              >
                                <span className="relative z-10">Load More Stories</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <div className="text-6xl mb-4">📭</div>
                          <p className="text-xl text-gray-600">No stories in this category yet</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-8">
                          <Grid3x3 className="w-8 h-8 text-indigo-600" />
                          <h2 className="text-3xl font-bold text-gray-900">Latest Stories</h2>
                        </div>
                        {blogs.length > 0 ? (
                          <>
                            <div className="grid grid-cols-1 gap-16">
                              {blogs.map((blog, index) => (
                                <AnimationWrapper key={index} transition={{ duration: 0.5, delay: index * 0.1 }}>
                                  <div className="transform hover:scale-[1.02] transition-all duration-300">
                                    <Blogcard content={blog} author={blog.author} />
                                  </div>
                                </AnimationWrapper>
                              ))}
                            </div>
                            {page * 3 < totalDocs && (
                              <div className="flex justify-center mt-8">
                                <button 
                                  onClick={handleLoadMore} 
                                  className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                >
                                  <span className="relative z-10">Load More Stories</span>
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-16">
                            <div className="text-6xl mb-4">📝</div>
                            <p className="text-xl text-gray-600">No stories available yet</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Trending Tab Content */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
                </div>
                {trendingBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {trendingBlogs.map((blog, index) => (
                      <AnimationWrapper key={index} transition={{ duration: 0.5, delay: index * 0.1 }}>
                        <div className="transform hover:scale-[1.02] transition-all duration-300">
                          <TrendingBlogcard content={blog} author={blog.author} index={index} />
                        </div>
                      </AnimationWrapper>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔥</div>
                    <p className="text-xl text-gray-600">No trending stories yet</p>
                  </div>
                )}
              </div>
            </InPageNavigation>
          </section>

          {/* Sidebar */}
          <aside className="lg:w-96 space-y-8">
            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Grid3x3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Explore Topics</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setSpecificBlogs([]);
                    }}
                    className={`group relative px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category.name
                        ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </span>
                  </button>
                ))}
              </div>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory("")}
                  className="w-full mt-4 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-300"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Trending Sidebar */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-xl p-6 border border-orange-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">What's Hot</h3>
              </div>
              {trendingBlogs.length > 0 ? (
                <div className="space-y-4">
                  {trendingBlogs.slice(0, 5).map((blog, index) => (
                    <AnimationWrapper key={index} transition={{ duration: 0.5, delay: index * 0.05 }}>
                      <div className="transform hover:scale-[1.02] transition-all duration-300">
                        <TrendingBlogcard content={blog} author={blog.author} index={index} />
                      </div>
                    </AnimationWrapper>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🔥</div>
                  <p className="text-gray-600">Check back soon!</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default Home;
