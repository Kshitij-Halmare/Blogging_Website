import React, { useContext, useState } from 'react';
import { BlogContext } from '../../Pages/Editor/BlogId';
import { useAuth } from '../../Authetication/Authentication';
import CommentFeild from './CommentFeild';
import toast from 'react-hot-toast'; // Ensure toast is imported

let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Function to format the date
export const GetDay = (timeStamp) => {
    if (!timeStamp || !timeStamp.timeStamp) {
        console.error('Invalid timeStamp:', timeStamp);
        return 'Invalid Date';
    }

    let date = new Date(timeStamp.timeStamp);

    if (isNaN(date.getTime())) {
        console.error('Invalid date:', date);
        return 'Invalid Date';
    }

    let day = days[date.getDay()];
    let dayOfMonth = date.getDate();
    let monthName = month[date.getMonth()];

    return `${day}, ${dayOfMonth} ${monthName}`;
};

function CommentCard({ data, key }) {
    const { blog, blog_id, setBlog } = useContext(BlogContext);
    const { user } = useAuth();
    const [isReplying, setIsReplying] = useState(false);
    const { comment, commented_by, commentedAt, _id } = data;
    const fullName = commented_by?.personal_info?.full_name || "Unknown User";
    const userName = commented_by?.personal_info?.userName || "Unknown Username";
    const formattedDate = GetDay({ timeStamp: commentedAt });

    // Handle click for reply
    const handleClick = () => {
        if (!user) {
            toast.error("Please Signup to reply");  // Show error if user is not logged in
            return;
        }
        setIsReplying(prevVal => !prevVal);
    };

    return (
        <div className="comment-card my-2 p-4 w-full rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
            <div className="mb-4">
                <h4 className="text-lg font-semibold text-slate-800">{fullName}</h4>
                <p className="text-sm text-gray-500">@{userName}</p>
                <p className="text-sm text-gray-400 mt-1">{formattedDate}</p>
            </div>

            <div className="flex justify-between items-center">
                <p className="text-gray-800 text-lg">{comment || "No comment text available"}</p>

                {/* <div
                    onClick={handleClick}
                    className="mt-4 text-sm text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                    Reply
                </div> */}
            </div>

            {/* Display reply field if isReplying is true */}
            {/* {isReplying && (
                <div className='mt-3'>
                    <CommentFeild 
                        index={key} 
                        action="Reply" 
                        replyingTo={_id} 
                        setReplying={setIsReplying} // Pass state setter function
                    />
                </div>
            )} */}
        </div>
    );
}

export default CommentCard;
