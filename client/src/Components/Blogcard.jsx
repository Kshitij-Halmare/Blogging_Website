import React from 'react';
import { GetDay } from './GetDay'; // Corrected the import statement
import { FiHeart } from 'react-icons/fi'; // Heart icon
import { useNavigate } from 'react-router-dom';

function Blogcard({ content, author }) {
    const { publishedAt, tags, title, description, banner, activity: { total_likes }, blog_id: id } = content;
    const { full_name, userName, profile_img } = author.personal_info;
    const navigate = useNavigate();

    // Handle click for profile navigation
    const handleClick = (e) => {
        e.stopPropagation(); // Prevent click from propagating to the card
        navigate(`/profile/${userName}`);
    }

    // Check if the banner is base64 or URL
    const isBase64 = banner && banner.startsWith('data:image');

    return (
        <div onClick={() => { navigate(`/blog/${id}`) }} className='w-full max-w-lg flex flex-col md:flex-row border-2 mt-5 hover:scale-105 transition-all duration-300 bg-white shadow-lg rounded-lg p-6 mb-7'>
            {/* Banner Image */}
            <div className="w-full md:w-1/3 md:h-auto h-48 flex-shrink-0">
                <img 
                    src={isBase64 ? banner : `${banner}`} 
                    alt="Banner" 
                    className='w-full h-full object-cover rounded-lg shadow-md' 
                />
            </div>
            <div className="flex flex-col justify-between p-4 flex-grow">
                {/* Author Info */}
                <div className='flex items-center gap-3 mb-4'>
                    <img src={`${profile_img}`} alt="Profile" className="h-12 w-12 rounded-full object-cover" />
                    <div className='cursor-pointer' onClick={handleClick}>
                        <p className='font-semibold'>{full_name}</p>
                        <p className='text-sm text-gray-500'>{'@' + userName}</p>
                        <p className='text-sm text-gray-400'><GetDay timeStamp={publishedAt} /></p>
                    </div>
                </div>
                {/* Title */}
                <h1 className='text-3xl font-semibold text-gray-800 mb-3'>{title}</h1>
                {/* Description */}
                <p className='text-lg text-gray-600 mb-4 line-clamp-3'>{description}</p>
                {/* Tags and Likes */}
                <div className='flex items-center justify-between'>
                    <span className='py-2 px-4 bg-slate-200 text-sm font-semibold text-gray-700 rounded-full'>
                        {tags[0]}
                    </span>
                    <div className="flex items-center gap-2">
                        <FiHeart className="text-xl text-red-500" />
                        <p className='text-lg font-semibold'>{total_likes}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Blogcard;
