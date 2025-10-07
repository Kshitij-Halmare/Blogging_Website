import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from "./Pages/Layout.jsx";
import Signin from "./Pages/Signin";
import SignUp from './Pages/SignUp';
import EditorPage from "./Pages/Editor/EditorPage";
import Home from "./Pages/Home.jsx";
import SearchBar from './Components/SearchBar.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import BlogId from './Pages/Editor/BlogId.jsx';
import SideNav from './Components/SideNav.jsx';
import EditProfile from './Pages/EditProfile.jsx';
import ChangePassword from './Pages/ChangePassword.jsx';
import DashBoardBlogs from './Pages/DashBoardBlogs.jsx';
import Notification from './Pages/Notification.jsx';

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/signin",
          element: <Signin />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/search/:data",
          element: <SearchBar />,
        },
        {
          path: "/profile/:username",
          element: <ProfilePage />,
        },
        {
          path: "/dashboard",
          element: <SideNav />, // Sidebar should be used here
          children: [
            {
              path: "edit-profile", // Relative path for settings pages
              element: <EditProfile/>,
            },
            {
              path: "change-password",
              element: <ChangePassword/>,
            },
            {
              path: "blogs",
              element: <DashBoardBlogs/>, // Replace with actual page component
            },
            {
              path: "notifications",
              element: <Notification/>, // Replace with actual page component
            },
            {
              path: "write",
              element: <h1>Write Page</h1>, // Replace with actual page component
            },
          ],
        },
      ],
    },
    {
      path: "/editor",
      element: <EditorPage />,
    },
    {
      path: "/editBlog/:blog_id",
      element: <EditorPage />,
    },
    {
      path: "/blog/:id",
      element: <BlogId />,
    },
  ]);

  return <RouterProvider router={router} />;
}
