import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaFacebook, FaGithub, FaInstagram, FaTwitter, FaYoutube, FaLink } from 'react-icons/fa';
import { useAuth } from '../Authetication/Authentication';
function ProfilePage() {
    const {user}=useAuth();
  const username = useParams(); // Get username from URL params
  const [data, setData] = useState(null); // Store user data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch user profile data
  const getProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }), // Send username as request body
      });

      const resData = await response.json();
      if (resData.success) {
        console.log(resData.data);
        setData(resData.data); // Store data if successful
      } else {
        console.error('Error fetching profile:', resData.message);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getProfile(); 
  }, [username]); 
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin inline-block w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full"></div>
      </div>
    );
  }

  // Handle the case when no user data is found
  if (!data) {
    return <p className="text-center text-gray-500">User not found.</p>;
  }

  const { personal_info, blog_data } = data;

  // Define default social links in case they are missing
  const defaultSocialLinks = {
    youtube: '',
    instagram: '',
    facebook: '',
    twitter: '',
    github: '',
    website: '',
  };

  const isBase64 = (string) => {
    return string.startsWith('data:image/');
  };

  const socialLinks = blog_data?.social_links || defaultSocialLinks;
  console.log(data.blogs);
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
            <img
            src={isBase64(personal_info.profile_img) ? `data:image/jpeg;base64,${personal_info.profile_img}` : personal_info.profile_img || '/default-avatar.png'}          
              alt={`${personal_info.userName}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800">{personal_info.full_name}</h2>
            <p className="text-lg text-gray-600">@{personal_info.userName}</p>
            <p className="mt-2 text-gray-500">{personal_info.email}</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Social Links</h3>
          <div className="flex flex-wrap gap-4">
            {/* YouTube */}
            <a
              href={socialLinks.youtube || '#'}
              className={`text-red-500 hover:underline flex items-center ${!socialLinks.youtube && 'opacity-50'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="mr-2" /> YouTube
            </a>

            {/* Instagram */}
            <a
              href={socialLinks.instagram || '#'}
              className={`text-pink-500 hover:underline flex items-center ${!socialLinks.instagram && 'opacity-50'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="mr-2" /> Instagram
            </a>

            {/* Facebook */}
            <a
              href={socialLinks.facebook || '#'}
              className={`text-blue-600 hover:underline flex items-center ${!socialLinks.facebook && 'opacity-50'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="mr-2" /> Facebook
            </a>

            {/* Twitter */}
            <a
              href={socialLinks.twitter || '#'}
              className={`text-blue-400 hover:underline flex items-center ${!socialLinks.twitter && 'opacity-50'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="mr-2" /> Twitter
            </a>

            {/* GitHub */}
            <a
              href={socialLinks.github || '#'}
              className={`text-gray-800 hover:underline flex items-center ${!socialLinks.github && 'opacity-50'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="mr-2" /> GitHub
            </a>

            {/* Website */}
            <a
              href={socialLinks.website || '#'}
              className={`text-green-500 hover:underline flex items-center ${!socialLinks.website && 'opacity-50'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLink className="mr-2" /> Website
            </a>
          </div>
        </div>

        {/* Account Information */}
        {data?.account_info && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Account Information</h3>
            <div className="mt-4 space-y-2">
              <p className="text-gray-600">Total Reads: {data.account_info.total_reads || 0}</p>
            </div>
          </div>
        )}

        {/* Blogs */}
        {data?.blogs && data.blogs.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Blogs</h3>
            <ul className="mt-4 space-y-2">
              {data.blogs.map((blog, index) => (
                <div className='w-full items-center flex p-1 hover:shadow-lg focus-within:outline'>
                  <img src={blog.banner} className='h-24 w-32' alt="" />
                  <h1 className='text-xl pl-10 font-semibold font-serif'>{blog.title}</h1>
                </div>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No blogs published yet.</p>
        )}
      </div>
      <div className={`${user.data.userName==username?"block":"hidden"} p-2 bg-slate-300 hover:bg-slate-500`}>Edit</div>
    </div>
  );
}

export default ProfilePage;
