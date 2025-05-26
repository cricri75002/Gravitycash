import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreditCard, BookOpen, ArrowRight, Check, AlertCircle, Smartphone, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import NfcEmitter from '../components/ui/NfcEmitter';

type WithdrawalMethod = 'card' | 'iban' | 'nfc' | 'instant';

interface WithdrawalFormData {
  amount: string;
  // Card withdrawal fields
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  // IBAN withdrawal fields
  accountName?: string;
  iban?: string;
  bankName?: string;
  reference?: string;
}

const WithdrawPage = () => {
  const [searchParams] = useSearchParams();
  const initialMethod = (searchParams.get('method') as WithdrawalMethod) || 'card';
  
  const [method, setMethod] = useState<WithdrawalMethod>(initialMethod);
  const [formData, setFormData] = useState<WithdrawalFormData>({ amount: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    setMethod(initialMethod);
  }, [initialMethod]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const amount = parseFloat(formData.amount);
    
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (user && amount > user.balance) {
      setError('Insufficient funds');
      return;
    }

    // Validate form fields based on method
    if (method === 'card' || method === 'instant') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        setError('Please fill in all required card fields');
        return;
      }
    } else if (method === 'iban') {
      if (!formData.accountName || !formData.iban || !formData.bankName) {
        setError('Please fill in all required IBAN fields');
        return;
      }
    }

    // Process withdrawal
    setIsProcessing(true);
    
    // Simulate API call with different processing times for instant vs regular
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, method === 'instant' ? 500 : 2000);
  };

  const handleNfcSuccess = () => {
    setIsComplete(true);
  };

  const handleNfcError = (error: string) => {
    setError(error);
  };

  const resetForm = () => {
    setFormData({ amount: '' });
    setIsComplete(false);
    setError('');
  };

  if (isComplete) {
    return (
      <div className="max-w-md mx-auto my-10 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600 dark:text-green-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {method === 'instant' ? 'Instant Withdrawal Complete!' : 'Withdrawal Successful!'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your withdrawal request of {user && parseFloat(formData.amount).toLocaleString(undefined, {
            style: 'currency',
            currency: user?.currency || 'EUR',
          })} has been {method === 'instant' ? 'instantly processed' : 'processed successfully'}.
        </p>
        <Button
          onClick={resetForm}
          size="lg"
        >
          Make Another Withdrawal
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Withdraw Cash
      </h1>

      {/* Method selection */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => setMethod('instant')}
            className={`p-4 flex items-center rounded-lg border-2 ${
              method === 'instant'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mr-4">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-300" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-gray-900 dark:text-white">Instant</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Instant card withdrawal
              </p>
            </div>
            {method === 'instant' && (
              <div className="ml-4 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>

          <button
            onClick={() => setMethod('card')}
            className={`p-4 flex items-center rounded-lg border-2 ${
              method === 'card'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mr-4">
              <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-gray-900 dark:text-white">Credit Card</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Standard card withdrawal
              </p>
            </div>
            {method === 'card' && (
              <div className="ml-4 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>

          <button
            onClick={() => setMethod('iban')}
            className={`p-4 flex items-center rounded-lg border-2 ${
              method === 'iban'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mr-4">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-gray-900 dark:text-white">IBAN Transfer</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Transfer to any IBAN account
              </p>
            </div>
            {method === 'iban' && (
              <div className="ml-4 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>

          <button
            onClick={() => setMethod('nfc')}
            className={`p-4 flex items-center rounded-lg border-2 ${
              method === 'nfc'
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mr-4">
              <Smartphone className="w-5 h-5 text-teal-600 dark:text-teal-300" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-gray-900 dark:text-white">NFC Payment</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tap your device to pay
              </p>
            </div>
            {method === 'nfc' && (
              <div className="ml-4 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        </div>
      </div>

      <Card className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-md flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-3" />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Withdrawal Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                {user?.currency || '€'}
              </span>
            </div>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              placeholder="0.00"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                {user?.currency || 'EUR'}
              </span>
            </div>
          </div>
          {user && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Available balance: {user.balance?.toLocaleString(undefined, {
                style: 'currency',
                currency: user.currency,
              })}
            </p>
          )}
        </div>

        {method === 'nfc' ? (
          <NfcEmitter
            amount={parseFloat(formData.amount) || 0}
            onSuccess={handleNfcSuccess}
            onError={handleNfcError}
          />
        ) : method === 'card' || method === 'instant' ? (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber || ''}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="**** **** **** ****"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate || ''}
                  onChange={handleInputChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv || ''}
                  onChange={handleInputChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="***"
                  required
                />
              </div>
            </div>

            {method === 'instant' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-md">
                <div className="flex items-center mb-2">
                  <Zap className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="font-medium text-green-800 dark:text-green-300">
                    Instant Withdrawal
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Funds will be available on your card immediately. A small fee may apply.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName || ''}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Enter account holder name"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                IBAN
              </label>
              <input
                type="text"
                name="iban"
                value={formData.iban || ''}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Enter IBAN"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName || ''}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Enter bank name"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reference (Optional)
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference || ''}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Enter reference"
              />
            </div>
          </>
        )}

        {method !== 'nfc' && (
          <div className="mt-8">
            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isProcessing}
              rightIcon={method === 'instant' ? <Zap size={18} /> : <ArrowRight size={18} />}
              onClick={handleSubmit}
              className={method === 'instant' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isProcessing 
                ? 'Processing...' 
                : method === 'instant'
                  ? 'Withdraw Instantly'
                  : 'Withdraw Funds'
              }
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WithdrawPage;