import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Smartphone, Plus, ArrowDown } from 'lucide-react';
import Button from './Button';

interface NfcEmitterProps {
  amount: number;
  mode?: 'pay' | 'recharge';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const NfcEmitter: React.FC<NfcEmitterProps> = ({ amount, mode = 'pay', onSuccess, onError }) => {
  const [isEmitting, setIsEmitting] = useState(false);
  const [supported, setSupported] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    
    // Check for NFC support
    if (iOS) {
      // iOS supports NFC through Safari
      setSupported(true);
    } else {
      // Other browsers - check for Web NFC API
      setSupported('NDEFReader' in window);
    }
  }, []);

  const startEmitting = async () => {
    if (!supported) {
      onError?.('NFC not supported on this device');
      return;
    }

    try {
      setIsEmitting(true);

      if (isIOS) {
        // iOS NFC Session
        const paymentData = {
          type: mode === 'pay' ? 'apple-pay' : 'apple-pay-recharge',
          amount: amount,
          currency: 'EUR',
          merchantId: 'merchant.com.gravitycash',
          timestamp: new Date().toISOString()
        };

        // Create Apple Pay session
        const session = new (window as any).ApplePaySession(3, {
          countryCode: 'FR',
          currencyCode: 'EUR',
          supportedNetworks: ['visa', 'masterCard', 'amex'],
          merchantCapabilities: ['supports3DS', 'supportsEMV', 'supportsCredit', 'supportsDebit'],
          total: {
            label: mode === 'pay' ? 'GravityCash Withdrawal' : 'GravityCash Recharge',
            amount: amount
          }
        });

        session.onvalidatemerchant = async (event: any) => {
          try {
            // Validate merchant session
            const merchantSession = await fetch('/validate-merchant', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                validationURL: event.validationURL,
                mode: mode
              })
            }).then(res => res.json());

            session.completeMerchantValidation(merchantSession);
          } catch (error) {
            session.abort();
            onError?.('Failed to validate merchant');
          }
        };

        session.onpaymentauthorized = async (event: any) => {
          try {
            // Process the payment/recharge
            const result = await fetch('/process-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                payment: event.payment,
                mode: mode,
                amount: amount
              })
            }).then(res => res.json());

            if (result.success) {
              session.completePayment(ApplePaySession.STATUS_SUCCESS);
              onSuccess?.();
            } else {
              session.completePayment(ApplePaySession.STATUS_FAILURE);
              onError?.('Payment processing failed');
            }
          } catch (error) {
            session.completePayment(ApplePaySession.STATUS_FAILURE);
            onError?.('Payment processing failed');
          }
        };

        session.begin();
      } else {
        // Web NFC API for other devices
        const ndef = new (window as any).NDEFReader();
        await ndef.write({
          records: [{
            recordType: "mime",
            mediaType: "application/json",
            data: JSON.stringify({
              type: mode === 'pay' ? 'payment' : 'recharge',
              amount: amount,
              timestamp: new Date().toISOString(),
              currency: 'EUR'
            })
          }]
        });
        onSuccess?.();
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to initiate transaction');
    } finally {
      setIsEmitting(false);
    }
  };

  if (!supported) {
    return (
      <div className="flex items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
        <WifiOff className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
        <span className="text-sm text-yellow-700 dark:text-yellow-300">
          NFC payment not supported on this device
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={`relative ${isEmitting ? 'animate-pulse' : ''}`}>
        {isIOS ? (
          <Smartphone className={`w-12 h-12 ${
            isEmitting 
              ? 'text-green-500 dark:text-green-400' 
              : 'text-gray-400 dark:text-gray-600'
          }`} />
        ) : (
          <Wifi className={`w-12 h-12 ${
            isEmitting 
              ? 'text-green-500 dark:text-green-400' 
              : 'text-gray-400 dark:text-gray-600'
          }`} />
        )}
        {isEmitting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-green-500/20 dark:bg-green-400/20 rounded-full animate-ping" />
          </div>
        )}
      </div>
      
      <Button
        onClick={startEmitting}
        disabled={isEmitting}
        variant={isEmitting ? 'outline' : 'primary'}
        size="lg"
        leftIcon={mode === 'recharge' ? <Plus size={18} /> : <ArrowDown size={18} />}
      >
        {isEmitting 
          ? 'Processing...' 
          : isIOS 
            ? mode === 'pay' 
              ? 'Pay with Apple Pay'
              : 'Recharge with Apple Pay'
            : mode === 'pay'
              ? 'Tap to Pay'
              : 'Tap to Recharge'
        }
      </Button>
      
      {isEmitting && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isIOS 
            ? 'Complete the Apple Pay transaction'
            : 'Hold your device near the terminal'
          }
        </p>
      )}
    </div>
  );
};

export default NfcEmitter;