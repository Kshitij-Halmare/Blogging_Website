import React, { useEffect, useState } from 'react';
import { useAuth } from '../Authetication/Authentication';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { FaBlog, FaBell, FaPen, FaUser, FaLock, FaBars, FaHome } from 'react-icons/fa';

function SideNav() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [PageState, setPageState] = useState(location.pathname.split("/")[2]);
    const [showSideNav, setShowSideNav] = useState(false);
    // console.log(user.notifications.new_notification_available);
    useEffect(() => {
        if (user === null) {
            navigate("/signin");
        }
    }, [user, navigate]);

    if (user === null) {
        return <div>Loading...</div>;
    }

    const toggleSideNav = () => {
        setShowSideNav(!showSideNav);
    };
    console.log(user);
    useEffect(() => {
        const path = location.pathname.split("/")[2] || "Dashboard";
        setPageState(path.replace("-", " "));
    }, [location]);

    return (
        <div className="flex flex-col md:flex-row">
            <div className="flex flex-col md:w-64 bg-gray-100 min-h-screen">
                <div className="sticky top-0 bg-gray-100 p-4 md:p-6">
                    <div className="flex border-b border-gray-600 justify-between items-center">
                        <button className="text-xl md:hidden" onClick={toggleSideNav}>
                            <FaBars />
                        </button>
                        <div className="flex items-center gap-2 text-gray-800">
                            <FaHome className="text-xl" />
                            {PageState}
                        </div>
                    </div>
                    <div className={`mt-4 ${showSideNav ? 'block' : 'hidden'} md:block`}>
                        <nav className="space-y-2">
                            <NavLink
                                to="/dashboard/blogs"
                                onClick={() => setPageState('Blogs')}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                                        isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-200'
                                    }`
                                }
                            >
                                <FaBlog className="text-lg" /> Blogs
                            </NavLink>
                            <NavLink
                                to="/dashboard/notifications"
                                onClick={() => setPageState('Notifications')}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                                        isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-200'
                                    }`
                                }
                            ><>
                                <FaBell className="text-lg" /> Notifications
                                {
                                    user?.notifications?.new_notification_available?(
                                        <>
                                        {
                                            console.log(user.notifications.new_notification_available)
                                        }
                                        <div className='bg-red-600 p-1 -ml-2 rounded-full'></div>
                                        </>
                                    ):(
                                        <div></div>
                                    )
                                }
                            </>
                            </NavLink>
                            <NavLink
                                to="/editor"
                                onClick={() => setPageState('Write')}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                                        isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-200'
                                    }`
                                }
                            >
                                <FaPen className="text-lg" /> Write
                            </NavLink>
                        </nav>

                        <hr className="my-4 border-gray-300" />

                        <nav className="space-y-2">
                            <NavLink
                                to="/dashboard/edit-profile"
                                onClick={() => setPageState('Edit Profile')}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                                        isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-200'
                                    }`
                                }
                            >
                                <FaUser className="text-lg" /> Edit Profile
                            </NavLink>
                            <NavLink
                                to="/dashboard/change-password"
                                onClick={() => setPageState('Change Password')}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                                        isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-200'
                                    }`
                                }
                            >
                                <FaLock className="text-lg" /> Change Password
                            </NavLink>
                        </nav>
                    </div>
                </div>
            </div>
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}

export default SideNav;
