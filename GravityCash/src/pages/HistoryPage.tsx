import React, { useState } from 'react';
import { Search, Calendar, Download, Filter } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  type: 'withdrawal' | 'deposit' | 'transfer';
  method?: string;
  location?: string;
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: '2025-04-12',
    description: 'ATM Withdrawal',
    amount: -200,
    status: 'Completed',
    type: 'withdrawal',
    method: 'Card',
    location: 'CityBank ATM, Main Street'
  },
  {
    id: 2,
    date: '2025-04-10',
    description: 'Salary Deposit',
    amount: 2500,
    status: 'Completed',
    type: 'deposit'
  },
  {
    id: 3,
    date: '2025-04-08',
    description: 'IBAN Transfer to John Doe',
    amount: -350,
    status: 'Completed',
    type: 'transfer',
    method: 'IBAN'
  },
  {
    id: 4,
    date: '2025-04-05',
    description: 'ATM Withdrawal',
    amount: -100,
    status: 'Completed',
    type: 'withdrawal',
    method: 'Card',
    location: 'Metro ATM, 5th Avenue'
  },
  {
    id: 5,
    date: '2025-04-02',
    description: 'Online Purchase Refund',
    amount: 75.50,
    status: 'Completed',
    type: 'deposit'
  },
  {
    id: 6,
    date: '2025-03-28',
    description: 'IBAN Transfer to Jane Smith',
    amount: -120,
    status: 'Failed',
    type: 'transfer',
    method: 'IBAN'
  },
  {
    id: 7,
    date: '2025-03-25',
    description: 'ATM Withdrawal',
    amount: -50,
    status: 'Completed',
    type: 'withdrawal',
    method: 'Card',
    location: 'QuickCash Partner, Broadway'
  },
  {
    id: 8,
    date: '2025-03-20',
    description: 'Subscription Payment',
    amount: -15.99,
    status: 'Completed',
    type: 'withdrawal'
  },
  {
    id: 9,
    date: '2025-03-15',
    description: 'Freelance Payment',
    amount: 450,
    status: 'Completed',
    type: 'deposit'
  },
  {
    id: 10,
    date: '2025-03-10',
    description: 'IBAN Transfer to Supplier',
    amount: -230,
    status: 'Pending',
    type: 'transfer',
    method: 'IBAN'
  },
];

const HistoryPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'Pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'Failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transaction History
        </h1>
        <Button 
          variant="outline" 
          leftIcon={<Download size={16} />}
        >
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 md:col-span-1">
          <h2 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Filter size={16} className="mr-2" />
            Filters
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Search transactions"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Select date range"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transaction Type
              </label>
              <select
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-white"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="deposit">Deposits</option>
                <option value="transfer">Transfers</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setStatusFilter('all');
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </Card>

        <div className="md:col-span-3">
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        No transactions found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    sortedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          transaction.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                        }`}>
                          {transaction.amount.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {transaction.method && <div>Method: {transaction.method}</div>}
                          {transaction.location && <div className="text-xs mt-1">{transaction.location}</div>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;