import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { Plus, ArrowDown, ArrowUp, Lock, ArrowLeftRight } from 'lucide-react';
import { TopUpModal } from '../components/TopUpModal';
const mockTransactions = [
{
  id: 1,
  type: 'deposit',
  description: 'Wallet top-up',
  amount: 500,
  time: '2 hours ago'
},
{
  id: 2,
  type: 'escrow',
  description: 'Bid placed - Vintage Rolex',
  amount: -15420,
  time: '3 hours ago'
},
{
  id: 3,
  type: 'refund',
  description: 'Auction lost - Rare Book',
  amount: 3200,
  time: '1 day ago'
},
{
  id: 4,
  type: 'settlement',
  description: 'Won auction - Sneakers',
  amount: -890,
  time: '2 days ago'
}];

export function WalletDashboard() {
  const [showTopUp, setShowTopUp] = useState(false);
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDown className="w-4 h-4 text-emerald-700" />;
      case 'escrow':
        return <Lock className="w-4 h-4 text-amber-700" />;
      case 'refund':
        return <ArrowUp className="w-4 h-4 text-emerald-700" />;
      case 'settlement':
        return <ArrowLeftRight className="w-4 h-4 text-slate-700" />;
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen">
      <TopNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          My Wallet
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card rounded-3xl p-6">
            <p className="text-sm text-slate-600 mb-2">Available Balance</p>
            <p className="text-4xl font-bold font-mono text-slate-800">
              $12,340
            </p>
          </div>
          <div className="glass-card rounded-3xl p-6">
            <p className="text-sm text-slate-600 mb-2">In Escrow</p>
            <p className="text-4xl font-bold font-mono text-slate-800">
              $15,420
            </p>
            <Link
              to="/wallet/escrow"
              className="text-sm text-slate-700 hover:text-slate-900 mt-2 inline-block font-medium">
              
              View holdings →
            </Link>
          </div>
        </div>

        <button
          onClick={() => setShowTopUp(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-full font-medium hover:bg-slate-900 transition-colors mb-8">
          
          <Plus className="w-4 h-4" />
          Top up wallet
        </button>

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/40">
            <h2 className="text-lg font-semibold text-slate-800">
              Transaction History
            </h2>
          </div>
          <div className="divide-y divide-white/30">
            {mockTransactions.map((tx, idx) =>
            <div
              key={tx.id}
              className={`flex items-center justify-between p-4 ${idx % 2 === 1 ? 'bg-white/20' : ''}`}>
              
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/50 backdrop-blur-sm border border-white/60 rounded-full flex items-center justify-center">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      {tx.description}
                    </p>
                    <p className="text-sm text-slate-600">{tx.time}</p>
                  </div>
                </div>
                <p
                className={`font-mono font-bold ${tx.amount > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                
                  {tx.amount > 0 ? '+' : ''}$
                  {Math.abs(tx.amount).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <TopUpModal isOpen={showTopUp} onClose={() => setShowTopUp(false)} />
    </div>);

}