import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons
import { useAuth } from '../Authetication/Authentication';

function ChangePassword() {
  const [showPassword, setShowPassword] = useState(true); // State for toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(true); // State for confirming password visibility
  const { user } = useAuth(); // Accessing the current user
  const [data, setData] = useState({
    currentPassword: "",
    ChangePassword: ""
  });

  // Toggle password visibility
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async () => {
    if (data.currentPassword.length === 0) {
      toast("Please add current Password");
      return;
    }
    if (data.ChangePassword.length === 0) {
      toast("Please add new Password");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/changePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, user })
      });

      const resData = await response.json();
      console.log(resData);

      if (resData.success) {
        toast.success("Password changed successfully!");
      } else {
        toast.error(resData.message || "Something went wrong!");
      }

    } catch (error) {
      console.error(error);
      toast.error("There was an error processing your request.");
    }
  };

  return (
    <div className="m-auto flex justify-center items-center min-h-screen ">
      <div className="flex flex-col w-[350px] sm:w-[400px] md:w-[500px] shadow-lg gap-8 bg-white p-8 rounded-lg  hover:shadow-2xl transition-shadow duration-300">
        <h1 className="text-2xl font-serif font-semibold text-center text-gray-800">Change Password</h1>

        {/* Current Password Field */}
        <div className="relative">
          <input
            value={data.currentPassword}
            onChange={(e) => setData(prev => ({ ...prev, currentPassword: e.target.value }))}
            type={showPassword ? 'password' : 'text'}
            className="bg-slate-100 placeholder:text-slate-500 px-4 py-3 text-lg rounded-lg outline-none hover:shadow-md focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="Current Password"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* New Password Field */}
        <div className="relative">
          <input
            value={data.ChangePassword}
            onChange={(e) => setData(prev => ({ ...prev, ChangePassword: e.target.value }))}
            type={showConfirmPassword ? 'password' : 'text'}
            className="bg-slate-100 placeholder:text-slate-500 px-4 py-3 text-lg rounded-lg outline-none  hover:shadow-md focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="New Password"
          />
          <button
            type="button"
            onClick={toggleConfirmPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Change Password Button */}
        <button
          onClick={handleSubmit}
          className="bg-black hover:opacity-80 rounded-full px-4 py-2 mx-auto text-white text-lg transition-colors duration-200"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
