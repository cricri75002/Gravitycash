import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CreditCard, MapPin, Clock, User } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/withdraw', label: 'Withdraw', icon: <CreditCard size={20} /> },
    { path: '/locations', label: 'Locations', icon: <MapPin size={20} /> },
    { path: '/history', label: 'History', icon: <Clock size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <div className="h-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm">
      <div className="h-full py-4 flex flex-col">
        <div className="space-y-1 px-2 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;