import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, CreditCard, BookOpen, MapPin } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const HomePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <header className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user.name?.split(' ')[0] ?? 'User'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your universal gravitational cash portal
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Balance</h2>
              <div className="mt-2 flex items-baseline">
                <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  {(user?.balance ?? 0).toLocaleString(undefined, {
                    style: 'currency',
                    currency: user?.currency ?? 'USD',
                  })}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Available
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Account: {user?.accountNumber ?? 'N/A'}
              </p>
            </div>
            <div>
              <Link to="/withdraw">
                <Button variant="primary" rightIcon={<ArrowRight size={18} />}>
                  Withdraw Cash
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col h-64 hoverable">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Withdraw via Credit Card
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex-grow">
            Use your credit card to quickly withdraw cash from any supported ATM in your area.
          </p>
          <div className="mt-4">
            <Link to="/withdraw?method=card">
              <Button variant="outline" size="sm" className="mt-auto" rightIcon={<ArrowRight size={16} />}>
                Get Started
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 flex flex-col h-64 hoverable">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Withdraw via IBAN
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex-grow">
            Transfer funds directly to any IBAN account with low fees and secure processing.
          </p>
          <div className="mt-4">
            <Link to="/withdraw?method=iban">
              <Button variant="outline" size="sm" className="mt-auto" rightIcon={<ArrowRight size={16} />}>
                Get Started
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 flex flex-col h-64 hoverable">
          <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-teal-600 dark:text-teal-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Find Nearby Locations
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex-grow">
            Discover ATMs and withdrawal points in your area with our interactive map.
          </p>
          <div className="mt-4">
            <Link to="/locations">
              <Button variant="outline" size="sm" className="mt-auto" rightIcon={<ArrowRight size={16} />}>
                View Map
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Transactions
        </h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  {
                    id: 1,
                    date: '2025-04-12',
                    description: 'ATM Withdrawal',
                    amount: -200,
                    status: 'Completed',
                  },
                  {
                    id: 2,
                    date: '2025-04-10',
                    description: 'Salary Deposit',
                    amount: 2500,
                    status: 'Completed',
                  },
                  {
                    id: 3,
                    date: '2025-04-08',
                    description: 'IBAN Transfer',
                    amount: -350,
                    status: 'Completed',
                  },
                ].map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {transaction.amount.toLocaleString(undefined, {
                        style: 'currency',
                        currency: user?.currency ?? 'USD',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="mt-4 text-center">
          <Link to="/history">
            <Button variant="ghost" rightIcon={<ArrowRight size={16} />}>
              View All Transactions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;