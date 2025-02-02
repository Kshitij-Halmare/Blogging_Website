import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import logo from '../assets/sm_5b29ed73cf5c8.jpg'; // Assuming logo is a local image
import Search from './Search';
import { FaBell, FaBook, FaSearch, FaUser } from 'react-icons/fa';
import { useAuth } from '../Authetication/Authentication';
import UserHelpBox from './UserHelpBox';

function Navbar() {
  const [displaySearch, setDisplaySearch] = useState(false);
  const [helpBox, setHelpBox] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // Fetch notifications only when user exists (and id is present)
  useEffect(() => {
    if (user?.id && notifications.length === 0) { // Avoid fetching if notifications already exist
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/getNotification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id }),
          });

          const resData = await response.json();

          if (resData.new_notification_available) {
            setNotifications(resData.data);
            setUser({
              ...user,
              notifications: {
                new_notification_available: resData.new_notification_available,
                data: resData.data,
              },
            });
          }
        } catch (err) {
          console.error('Error fetching notifications:', err);
        } finally {
          setLoadingNotifications(false);
        }
      };

      fetchNotifications();
    }
  }, [user, notifications, setUser,setNotifications]); // This will only re-fetch if the user or notifications are changed

  // Ensure notifications are fetched and available
  useEffect(() => {
    if (!loadingNotifications && notifications.length > 0) {
      console.log('Notifications fetched:', notifications);
    }
  }, [loadingNotifications, notifications]);

  return (
    <div className="z-10 sticky top-0 bg-white shadow-md w-full flex flex-col md:flex-row md:justify-between justify-between items-center px-4 py-2 md:py-3">
      <div className="flex items-center md:justify-center justify-between w-full">
        <div className="h-14 w-14">
          <Link to="/" className="h-14 w-14">
            <img src={`${"data:image/jpeg;base64",logo}`} alt="Logo" className="h-full" />
          </Link>
        </div>
        <div className="hidden md:flex flex-1 justify-center px-4">
          <Search />
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          {/* Search Icon (visible on small screens only) */}
          <div
            className="w-8 h-8 md:hidden flex items-center justify-center bg-gray-200 rounded-full text-gray-800 cursor-pointer"
            onClick={() => setDisplaySearch((prev) => !prev)}
          >
            <FaSearch />
          </div>
          {user ? (
            <>
              <Link
                to="/editor"
                className="hidden md:flex px-4 py-2 mr-5 text-gray-500 font-semibold border border-slate-300 rounded-md hover:bg-gray-100 transition-colors duration-300 ease-in-out"
              >
                <FaBook className="mt-1 mr-2" />
                Write
              </Link>
              <div className="pr-3 flex">
                {/* Bell icon with conditional style */}
                {notifications.length > 0 ? (
                  <div>
                    <FaBell
                      onClick={() => {
                        navigate('/dashboard/notifications');
                      }}
                      className="cursor-pointer md:mr-7 mr-3 drop-shadow-md shadow-red-200 text-red-400 border rounded-full w-8 h-8 flex items-center justify-center"
                    />
                  </div>
                ) : (
                  <FaBell
                    onClick={() => {
                      navigate('/dashboard/notifications');
                    }}
                    className="cursor-pointer md:mr-7 mr-3 text-gray-400 drop-shadow-md shadow-gray-200 border rounded-full w-8 h-8 flex items-center justify-center"
                  />
                )}
                {/* Conditionally render profile image or default icon */}
                <div
                  onClick={() => {
                    setHelpBox((prev) => !prev);
                  }}
                  className="cursor-pointer text-gray-800 border rounded-full w-8 h-8 flex items-center justify-center"
                >
                  {user?.profile_img ? (
                    <img
                      src={`data:image/jpeg;base64,${user.profile_img}`} // base64 encoded image
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FaUser className="text-xl" />
                  )}
                </div>
                {helpBox ? (
                  <AnimatePresence>
                    <UserHelpBox data={user} />
                  </AnimatePresence>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/editor"
                className="hidden md:flex px-4 py-2 text-gray-500 font-semibold border border-slate-300 rounded-md hover:bg-gray-100 transition-colors duration-300 ease-in-out"
              >
                <FaBook className="mt-1 mr-2" />
                Write
              </Link>
              <Link
                to="/signin"
                className="bg-gray-900 text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-800 transition-colors duration-300 ease-in-out"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-gray-400 text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-600 transition-colors duration-300 ease-in-out"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      <div
        className={`${displaySearch ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'} md:hidden w-full pt-2 overflow-hidden pb-2 transition-all duration-300 ease-in-out`}
      >
        <Search />
      </div>
    </div>
  );
}

export default Navbar;
