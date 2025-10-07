import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/logo.png';
import Search from './Search';
import { FaBell, FaBook, FaSearch, FaUser } from 'react-icons/fa';
import { useAuth } from '../Authetication/Authentication';
import UserHelpBox from './UserHelpBox';

function Navbar() {
  const [displaySearch, setDisplaySearch] = useState(false);
  const [helpBox, setHelpBox] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (user?.id && notifications.length === 0) {
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
  }, [user, notifications, setUser, setNotifications]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`z-50 sticky top-0 backdrop-blur-lg bg-white/90 border-b transition-all duration-300 ${
        scrolled ? 'shadow-xl border-gray-200/50' : 'shadow-md border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3 flex-shrink-0">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative h-12 w-12 md:h-14 md:w-14 rounded-full overflow-hidden shadow-lg ring-2 ring-indigo-100 group-hover:ring-indigo-300 transition-all duration-300"
            >
              <img 
                src={`${"data:image/jpeg;base64",logo}`} 
                alt="Logo" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
            <span className="hidden lg:block text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BlogHub
            </span>
          </Link>

          {/* Center Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <Search />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDisplaySearch((prev) => !prev)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-purple-100 text-gray-700 hover:text-indigo-600 transition-all duration-300 shadow-md"
            >
              <FaSearch className="text-sm" />
            </motion.button>

            {user ? (
              <>
                {/* Write Button */}
                <Link to="/editor">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <FaBook className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>Write</span>
                  </motion.button>
                </Link>

                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate('/dashboard/notifications')}
                  className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 hover:from-orange-100 hover:to-red-100 transition-all duration-300 shadow-md"
                >
                  <FaBell 
                    className={`text-lg transition-colors duration-300 ${
                      notifications.length > 0 ? 'text-red-500' : 'text-gray-600'
                    }`}
                  />
                  {notifications.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg ring-2 ring-white"
                    >
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </motion.span>
                  )}
                </motion.button>

                {/* Profile */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setHelpBox((prev) => !prev)}
                    className="w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-white hover:ring-indigo-300 transition-all duration-300"
                  >
                    {user?.profile_img ? (
                      <img
                        src={`data:image/jpeg;base64,${user.profile_img}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                      </div>
                    )}
                  </motion.button>
                  <AnimatePresence>
                    {helpBox && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <UserHelpBox data={user} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                {/* Write Button (Guest) */}
                <Link to="/editor" className="hidden md:block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold border-2 border-gray-300 rounded-full hover:border-indigo-400 hover:text-indigo-600 transition-all duration-300"
                  >
                    <FaBook />
                    <span>Write</span>
                  </motion.button>
                </Link>

                {/* Sign In */}
                <Link to="/signin">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 text-gray-700 font-semibold border-2 border-gray-300 rounded-full hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 shadow-sm"
                  >
                    Sign In
                  </motion.button>
                </Link>

                {/* Sign Up */}
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        <motion.div
          initial={false}
          animate={{
            height: displaySearch ? 'auto' : 0,
            opacity: displaySearch ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="md:hidden overflow-hidden"
        >
          <div className="pb-4 pt-2">
            <Search />
          </div>
        </motion.div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
    </motion.nav>
  );
}

export default Navbar;