import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet } from 'lucide-react';
interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const presetAmounts = [50, 100, 250];
  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = selectedAmount || parseFloat(customAmount);
    alert(`Added $${amount} to wallet (sandbox simulation)`);
    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" />
        
          <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 0.95
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md pointer-events-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Add funds to your wallet
                  </h2>
                </div>
                <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200">
                
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddFunds} className="p-6 space-y-6">
                <div>
                  <div className="flex gap-3 mb-4">
                    {presetAmounts.map((amount) =>
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${selectedAmount === amount ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-700 text-slate-300 hover:border-slate-600'}`}>
                    
                        ${amount}
                      </button>
                  )}
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
                      className="w-full pl-8 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      min="1"
                      step="0.01" />
                    
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 mt-3">
                    Current balance: $12,340
                  </p>
                </div>

                <button
                type="submit"
                disabled={!selectedAmount && !customAmount}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                
                  Add funds
                </button>

                <p className="text-xs text-slate-500 text-center">
                  This is a sandbox simulation. No real payment is processed.
                </p>
              </form>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}