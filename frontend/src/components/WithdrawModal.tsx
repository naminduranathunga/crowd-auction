import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { withdrawFunds } from '../services/walletApi';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableBalance: number;
}

export function WithdrawModal({ isOpen, onClose, onSuccess, availableBalance }: WithdrawModalProps) {
  const { user } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const presetAmounts = [50, 100, 250];

  const handleWithdrawFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please specify a valid amount');
      return;
    }

    if (amount > availableBalance) {
      setError('Insufficient available balance');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await withdrawFunds(user.id, amount, 'Withdrawal via sandbox');
      setSelectedAmount(null);
      setCustomAmount('');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to withdraw funds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-red-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Withdraw funds
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-200"
                  disabled={loading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleWithdrawFunds} className="p-6 space-y-6">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <div className="flex gap-3 mb-4">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
                          selectedAmount === amount
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                        disabled={loading || amount > availableBalance}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Or enter custom amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        $
                      </span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        className="w-full pl-8 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        max={availableBalance}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || (!selectedAmount && !customAmount)}
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Withdraw funds'}
                </button>

                <p className="text-xs text-slate-500 text-center">
                  This is a sandbox simulation. No real bank transfer is processed.
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
