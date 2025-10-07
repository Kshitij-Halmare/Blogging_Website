import React, { useContext, useState } from 'react';
import { BlogContext } from '../../Pages/Editor/BlogId';
import { useAuth } from '../../Authetication/Authentication';
import CommentFeild from './CommentFeild';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaReply, FaHeart, FaRegHeart } from 'react-icons/fa';

let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const GetDay = (timeStamp) => {
    if (!timeStamp || !timeStamp.timeStamp) {
        return 'Invalid Date';
    }

    let date = new Date(timeStamp.timeStamp);

    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    let day = days[date.getDay()];
    let dayOfMonth = date.getDate();
    let monthName = month[date.getMonth()];

    return `${day}, ${dayOfMonth} ${monthName}`;
};

function CommentCard({ data, index }) {
    const { user } = useAuth();
    const [isReplying, setIsReplying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const { comment, commented_by, commentedAt, _id } = data;
    const fullName = commented_by?.personal_info?.full_name || "Unknown User";
    const userName = commented_by?.personal_info?.userName || "Unknown";
    const profileImg = commented_by?.personal_info?.profile_img;
    const formattedDate = GetDay({ timeStamp: commentedAt });

    const handleClick = () => {
        if (!user) {
            toast.error("Please sign up to reply");
            return;
        }
        setIsReplying(prevVal => !prevVal);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
        >
            {/* Gradient Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="flex gap-4">
                {/* Avatar */}
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0"
                >
                    {profileImg ? (
                        <img
                            src={`data:image/jpeg;base64,${profileImg}`}
                            alt={fullName}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-indigo-300 transition-all duration-300"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-gray-200 group-hover:ring-indigo-300 transition-all duration-300">
                            {fullName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">{fullName}</h4>
                            <p className="text-xs text-gray-500">@{userName}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{formattedDate}</span>
                    </div>

                    {/* Comment Text */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                        {comment || "No comment text available"}
                    </p>

                </div>
            </div>
        </motion.div>
    );
}

export default CommentCard;