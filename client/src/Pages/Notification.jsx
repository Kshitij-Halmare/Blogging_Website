import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authetication/Authentication';

function Notification() {
  const { user, setUser } = useAuth();
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const [error, setError] = useState(null);
  const filters = ['All', 'like', 'comment'];

  const handleNotification = async (page = 1, deletedDocCount = 0) => {
    if (!user || !user.id) return; // Ensure user is available
    setLoading(true); // Start loading
    setError(null); // Reset error state

    const user_id = user.id;

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page, filter, deletedDocCount, user_id }),
      });

      const resData = await response.json();
      console.log(resData);

      if (resData.message === 'success') {
        setNotifications(resData.data); // Store notifications in state
      } else {
        setError('Error fetching notifications: ' + resData.message);
      }
    } catch (error) {
      setError('There was an error processing your request.');
      console.error('Error:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const markNotificationsAsSeen = async () => {
    if (!user || !user.id) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/setSeenNotification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });

      const resData = await response.json();
      if (resData.message === 'Notifications marked as seen.') {
        setUser({...user, notifications: null});
        console.log('Notifications marked as seen');
      }
    } catch (error) {
      console.error('Error marking notifications as seen:', error);
    }
  };

  // Fetch notifications when the component mounts or the filter changes
  useEffect(() => {
    if (user && user.id) {
      handleNotification(); // Fetch notifications when the component mounts or filter changes
      markNotificationsAsSeen(); // Mark notifications as seen as soon as they are loaded
    }
  }, [filter]); // Ensure fetch is triggered on filter change or when user is available

  const handleFilterChange = (fil) => {
    setFilter(fil); // Update filter and trigger useEffect
  };

  return (
    <div className="flex flex-col p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Filter Buttons */}
      <div className="flex justify-center space-x-6 p-4 bg-white rounded-lg shadow-sm">
        {filters.map((fil, i) => (
          <div
            key={i}
            className={`font-semibold text-lg cursor-pointer px-4 py-2 rounded-md transition-colors duration-300 ease-in-out ${
              filter === fil
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
            onClick={() => handleFilterChange(fil)}
          >
            {fil}
          </div>
        ))}
      </div>

      {/* Horizontal Rule (hr) */}
      <hr className="my-4 border-t-2 border-gray-300" />

      {/* Loading State */}
      {loading && <p className="text-gray-600 text-center">Loading...</p>}

      {/* Error State */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Display Notifications */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4"
            >
              <div className="flex items-center space-x-4 mb-4">
                {/* User Avatar */}
                <img
                  src={`data:image/jpeg;base64,${notification.user.personal_info.profile_img}`}
                  alt={notification.user.personal_info.userName}
                  className="w-12 h-12 rounded-full border border-gray-200"
                />
                <div>
                  <p className="font-medium text-gray-800">{notification.user.personal_info.full_name}</p>
                  <p className="text-sm text-gray-500">@{notification.user.personal_info.userName}</p>
                </div>
              </div>

              {/* Notification Content */}
              <div className="text-gray-700">
                <p className="font-semibold">{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</p>
                <p>{notification.comment ? notification.comment.comment : 'No comment available'}</p>
              </div>

              {/* Blog Details */}
              {notification.blog && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-medium text-gray-600">Blog: {notification.blog.title}</p>
                </div>
              )}

              {/* Timestamp */}
              <p className="mt-2 text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No notifications available.</p>
        )}
      </div>
    </div>
  );
}

export default Notification;
