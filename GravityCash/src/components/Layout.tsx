import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { OrbitalBackground } from './animations/OrbitalBackground';

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen dark:bg-gray-900 bg-gray-50 text-gray-900 dark:text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <OrbitalBackground />
      </div>
      
      <div className="relative z-10 flex flex-col h-screen">
        <Navbar />
        
        <div className="flex flex-1 overflow-hidden">
          {isAuthenticated && (
            <div className="hidden md:block w-64 flex-shrink-0">
              <Sidebar />
            </div>
          )}
          
          <main className="flex-1 overflow-auto p-4">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;