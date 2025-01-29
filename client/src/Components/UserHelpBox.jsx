import React from 'react';
import { FaBook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Authetication/Authentication';
function UserHelpBox({ data }) {
  const { user, signOut } = useAuth();
  console.log(user);
  const navigate = useNavigate();
  const handleClick=()=>{
    navigate(`/profile/${user.data.userName}`);
  }
  
  const animationVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      className="bg-white rounded-lg p-4 absolute top-12 right-10 mt-1 shadow-md border border-gray-200 w-64"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={animationVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex flex-col gap-4">
        {/* Action Items */}
        <div className="flex flex-col gap-3">
          <div  className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer transition duration-200">
            <FaBook className="text-gray-500" />
            <span className="text-gray-800 font-medium">Write</span>
          </div>
          <div onClick={handleClick} className="hover:bg-gray-100 p-2 rounded-md cursor-pointer transition duration-200">
            <span className="text-gray-800 font-medium">Profile</span>
          </div>
          <div className="hover:bg-gray-100 p-2 rounded-md cursor-pointer transition duration-200">
            <span className="text-gray-800 font-medium">Dashboard</span>
          </div>
          <div className="hover:bg-gray-100 p-2 rounded-md cursor-pointer transition duration-200">
            <span className="text-gray-800 font-medium">Settings</span>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-300" />

        {/* User Info */}
        <div className="flex flex-col gap-3">
          <div onClick={signOut} className="hover:bg-red-50 p-2 rounded-md cursor-pointer text-red-600 font-medium transition duration-200">
            Sign Out
          </div>
          <div className="text-gray-700 font-medium">
            <span>{data?.full_name || 'Guest'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
  // <button
  //               onClick={signOut}
  //               className="bg-gray-900 text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-800 transition-colors duration-300 ease-in-out"
  //             >
  //               Sign Out
  //             </button>
export default UserHelpBox;
