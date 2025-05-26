import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, CreditCard, Shield, Bell, LogOut } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  if (!user) return null;

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Your Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition ${
                activeTab === tab.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-3">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}

          <button
            className="w-full flex items-center px-4 py-3 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            onClick={logout}
          >
            <span className="mr-3"><LogOut size={16} /></span>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === 'personal' && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="sm:w-1/3 mb-2 sm:mb-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          defaultValue={user.name}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="sm:w-1/3 mb-2 sm:mb-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          defaultValue={user.email}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="sm:w-1/3 mb-2 sm:mb-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Account Number
                    </label>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="rounded-md bg-gray-50 dark:bg-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {user.accountNumber}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="sm:w-1/3 mb-2 sm:mb-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Preferred Currency
                    </label>
                  </div>
                  <div className="sm:w-2/3">
                    <select
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      defaultValue={user.currency}
                    >
                      <option value="EUR">Euro (EUR)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="JPY">Japanese Yen (JPY)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-3"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Security Settings
              </h2>
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="sm:w-1/3 mb-2 sm:mb-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Password
                    </label>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          placeholder="Enter current password"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="sm:w-1/3 mb-2 sm:mb-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Password
                    </label>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="sm:w-1/3 mb-2 sm:mb-0">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm New Password
                    </label>
                  </div>
                  <div className="sm:w-2/3">
                    <div className="flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-3"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Two-Factor Authentication
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        Not enabled
                      </span>
                      <button
                        type="button"
                        className="ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <span className="sr-only">Enable 2FA</span>
                        <span
                          aria-hidden="true"
                          className="inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 translate-x-0"
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'payment' && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Payment Methods
              </h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Visa Card
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.cardNumber} • Expires 12/25
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">
                        Default
                      </span>
                      <button className="ml-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  leftIcon={<CreditCard size={16} />}
                  className="mt-4"
                >
                  Add New Payment Method
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Notification Preferences
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications about account activity
                    </p>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">Enable email notifications</span>
                    <span
                      aria-hidden="true"
                      className="inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 translate-x-5"
                    ></span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      SMS Notifications
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive text messages for important alerts
                    </p>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">Enable SMS notifications</span>
                    <span
                      aria-hidden="true"
                      className="inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 translate-x-0"
                    ></span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Push Notifications
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive push notifications on your mobile device
                    </p>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">Enable push notifications</span>
                    <span
                      aria-hidden="true"
                      className="inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 translate-x-5"
                    ></span>
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Notification Types
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="withdrawals"
                          name="withdrawals"
                          type="checkbox"
                          defaultChecked
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="withdrawals" className="font-medium text-gray-700 dark:text-gray-300">
                          Withdrawals
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">Get notified when a withdrawal is made from your account.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="deposits"
                          name="deposits"
                          type="checkbox"
                          defaultChecked
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="deposits" className="font-medium text-gray-700 dark:text-gray-300">
                          Deposits
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">Get notified when money is deposited into your account.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="security"
                          name="security"
                          type="checkbox"
                          defaultChecked
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="security" className="font-medium text-gray-700 dark:text-gray-300">
                          Security Alerts
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">Get notified about important security updates.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-3"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;