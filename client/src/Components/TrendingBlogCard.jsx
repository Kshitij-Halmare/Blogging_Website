import React from 'react';
import { FiHeart } from 'react-icons/fi'; // Heart icon
import { useNavigate } from 'react-router-dom';

function TrendingBlogcard({ content, author, index }) {
    const { publishedAt, tags, title, description, blog_id: id, activity: { total_likes } = {} } = content;
    const { full_name, userName, profile_img } = author.personal_info;
    // console.log(content);

    // Format the date to display full date (e.g., Jan 21, 2025)
    const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', // short month name (e.g., Jan, Feb)
        day: '2-digit', // two-digit day (e.g., 21)
    });

    const navigate = useNavigate();

    // Handle profile click
    const handleClick = (e) => {
        e.stopPropagation(); // Prevent the click from bubbling up to the blog card
        navigate(`/profile/${userName}`);
    };

    // Handle blog click (Navigate to the blog itself)
    const handleBlogClick = () => {
        navigate(`/blog/${id}`);
    };

    return (
        <div 
            onClick={handleBlogClick} 
            className='w-full h-full flex gap-6 border-2 mt-5 md:mx-auto lg:mx-auto max-w-xl bg-white shadow-xl rounded-xl p-6 mb-7 hover:scale-105 transform transition-all duration-300 ease-in-out cursor-pointer'
        >
            {/* Left Section - Author Info */}
            <div className='flex items-start gap-6'>
                <div className='p-4 rounded-full bg-gray-800'>
                    <h1 className='text-3xl text-white font-bold'>
                        {String(index + 1).padStart(2, '0')}
                    </h1>
                </div>

                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-start gap-4'>
                        <img 
                            src={`data:image/jpeg;base64,${profile_img}`} 
                            alt="Profile" 
                            className="h-8 w-8 rounded-full object-cover border-2 border-gray-200 shadow-lg" 
                        />
                        <div className="flex flex-col cursor-pointer" onClick={handleClick}>
                            <p className='text-md font-semibold text-gray-900'>{full_name}</p>
                            <p className='text-sm md:block hidden text-gray-600'>{'@' + userName}</p>
                            <p className='text-sm text-gray-400'>{formattedDate}</p> {/* Display the formatted date */}
                        </div>
                    </div>
                    <h2 className='text-3xl font-semibold text-gray-800 mt-2'>{title}</h2>
                    <p className='text-sm text-gray-600 mt-2'>{description}</p>
                </div>
            </div>

            {/* Right Section - Interaction (Heart Icon, Tags) */}
            <div className="flex flex-col justify-between items-center">
                <div className="mt-4 flex flex-wrap gap-2">
                    {tags && tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full border-2 border-gray-300">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TrendingBlogcard;
