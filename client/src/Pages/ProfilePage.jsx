import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFacebook, FaGithub, FaInstagram, FaTwitter, FaYoutube, FaLink, FaEdit } from 'react-icons/fa';
import { useAuth } from '../Authetication/Authentication';

function ProfilePage() {
  const { user } = useAuth();
  const { username } = useParams();
  console.log(username);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data
  const getProfile = async () => {
    try {
      console.log(username);
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const resData = await response.json();
      console.log(resData);
      if (resData.success) {
        setData(resData.data);
      } else {
        console.error('Error fetching profile:', resData.message);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(username){
      getProfile();
    }
  }, [username]);

  const isBase64 = (string) => {
    return string?.startsWith('data:image/');
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
        <div className="relative">
          <div className="animate-spin inline-block w-20 h-20 border-4 border-t-blue-600 border-r-purple-600 border-b-indigo-600 border-l-transparent rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Loading profile...
        </p>
      </div>
    );
  }

  // User Not Found State
  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-2xl font-bold text-gray-700">User not found</p>
          <p className="text-gray-500 mt-2">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const { personal_info, blog_data, account_info, blogs } = data;
  const defaultSocialLinks = {
    youtube: '',
    instagram: '',
    facebook: '',
    twitter: '',
    github: '',
    website: '',
  };
  const socialLinks = blog_data?.social_links || defaultSocialLinks;
  const isOwnProfile = user?.data?.userName === username;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-100 mb-6">
          {/* Cover Background */}
          <div className="h-48 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            {isOwnProfile && (
              <button
                onClick={() => navigate('/dashboard/edit-profile')}
                className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-full shadow-lg hover:shadow-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>

          {/* Profile Header */}
          <div className="px-6 md:px-10 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-16">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-6 border-white shadow-2xl ring-4 ring-purple-200 group-hover:ring-purple-400 transition-all duration-300">
                  <img
                    src={
                      isBase64(personal_info.profile_img)
                        ? personal_info.profile_img
                        : personal_info.profile_img || '/default-avatar.png'
                    }
                    alt={`${personal_info.userName}'s profile`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left md:ml-8 mt-6 md:mt-0">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {personal_info.full_name}
                </h1>
                <p className="text-xl text-gray-600 mt-2">@{personal_info.userName}</p>
                <p className="text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {personal_info.email}
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-6 md:mt-0">
                <div className="text-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border-2 border-purple-200">
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {blogs?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">Blogs</p>
                </div>
                <div className="text-center px-6 py-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl border-2 border-purple-200">
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {account_info?.total_reads || 0}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">Reads</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="px-6 md:px-10 pb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Connect With Me
            </h3>
            <div className="flex flex-wrap gap-3">
              {/* YouTube */}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube className="text-lg" /> YouTube
                </a>
              )}

              {/* Instagram */}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-full hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="text-lg" /> Instagram
                </a>
              )}

              {/* Facebook */}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className="text-lg" /> Facebook
                </a>
              )}

              {/* Twitter */}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="text-lg" /> Twitter
                </a>
              )}

              {/* GitHub */}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-all duration-300 hover:scale-105 shadow-md font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="text-lg" /> GitHub
                </a>
              )}

              {/* Website */}
              {socialLinks.website && (
                <a
                  href={socialLinks.website}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLink className="text-lg" /> Website
                </a>
              )}
            </div>
            {!Object.values(socialLinks).some(link => link) && (
              <p className="text-gray-500 italic mt-2">No social links added yet.</p>
            )}
          </div>
        </div>

        {/* Blogs Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-100 p-6 md:p-10">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Published Blogs
            <span className="ml-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              {blogs?.length || 0}
            </span>
          </h3>

          {blogs && blogs.length > 0 ? (
            <div className="grid gap-4">
              {blogs.map((blog, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-purple-100 hover:border-purple-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  {/* Blog Banner */}
                  <div className="relative overflow-hidden rounded-lg shadow-md flex-shrink-0">
                    <img
                      src={blog.banner}
                      className="h-24 w-32 md:h-28 md:w-40 object-cover group-hover:scale-110 transition-transform duration-300"
                      alt={blog.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>

                  {/* Blog Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 truncate">
                      {blog.title}
                    </h4>
                    {blog.description && (
                      <p className="text-gray-600 mt-1 line-clamp-2 text-sm md:text-base">
                        {blog.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs md:text-sm text-gray-500">
                      {blog.publishedAt && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(blog.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="text-purple-600 group-hover:translate-x-2 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl font-semibold text-gray-600">No blogs published yet</p>
              <p className="text-gray-500 mt-2">
                {isOwnProfile ? "Start writing your first blog!" : "Check back later for new content."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;