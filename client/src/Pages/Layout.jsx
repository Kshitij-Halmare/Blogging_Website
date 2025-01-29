import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Components/Navabar';
import AnimationWrapper from '../Animation/AnimationWrapper';

function Layout() {
  const location = useLocation();

  return (
    <div>
      <Navbar />
      <AnimationWrapper key={location.pathname}>
        <main className="min-h-screen">
          {/* Render the child routes using Outlet */}
          <Outlet />
        </main>
      </AnimationWrapper>
    </div>
  );
}

export default Layout;
