import React from 'react';
import { Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { ArrowLeft } from 'lucide-react';
const mockEscrowHoldings = [
{
  id: 1,
  itemName: 'Vintage Rolex Submariner',
  thumbnail:
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200',
  amount: 15420,
  status: 'active' as const
},
{
  id: 2,
  itemName: 'Rare First Edition Book',
  thumbnail:
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
  amount: 3200,
  status: 'ending' as const
}];

export function EscrowHoldings() {
  return (
    <div className="min-h-screen">
      <TopNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/wallet"
          className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 mb-6 font-medium">
          
          <ArrowLeft className="w-4 h-4" />
          Back to wallet
        </Link>

        <h1 className="text-3xl font-semibold text-slate-800 mb-2">
          Escrow Holdings
        </h1>
        <p className="text-slate-600 mb-8">
          Total in escrow:{' '}
          <span className="font-mono font-bold text-slate-800">$18,620</span>
        </p>

        <div className="glass-card rounded-3xl divide-y divide-white/30 overflow-hidden">
          {mockEscrowHoldings.map((holding) =>
          <div key={holding.id} className="flex items-center gap-4 p-4">
              <img
              src={holding.thumbnail}
              alt={holding.itemName}
              className="w-16 h-16 rounded-2xl object-cover" />
            
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">
                  {holding.itemName}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Amount held:{' '}
                  <span className="font-mono font-bold text-slate-800">
                    ${holding.amount.toLocaleString()}
                  </span>
                </p>
              </div>
              <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${holding.status === 'active' ? 'bg-slate-800/15 text-slate-800 border-slate-800/20' : 'bg-amber-500/20 text-amber-800 border-amber-500/30'}`}>
              
                {holding.status === 'active' ? 'Active' : 'Ending Soon'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>);

}