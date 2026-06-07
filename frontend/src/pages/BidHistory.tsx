import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { ArrowLeft, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
const mockBidHistory = [
{
  id: 1,
  bidder: 'Bidder #7',
  amount: 15420,
  time: '2 minutes ago',
  isWinner: true
},
{
  id: 2,
  bidder: 'Bidder #3',
  amount: 15200,
  time: '8 minutes ago',
  isWinner: false
},
{
  id: 3,
  bidder: 'Bidder #7',
  amount: 15000,
  time: '15 minutes ago',
  isWinner: false
},
{
  id: 4,
  bidder: 'Bidder #2',
  amount: 14800,
  time: '23 minutes ago',
  isWinner: false
},
{
  id: 5,
  bidder: 'Bidder #5',
  amount: 14500,
  time: '31 minutes ago',
  isWinner: false
},
{
  id: 6,
  bidder: 'Bidder #1',
  amount: 14200,
  time: '45 minutes ago',
  isWinner: false
}];

export function BidHistory() {
  const { id } = useParams();
  return (
    <div className="min-h-screen">
      <TopNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/seller/listings"
          className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 mb-6 font-medium">
          
          <ArrowLeft className="w-4 h-4" />
          Back to listings
        </Link>

        <h1 className="text-3xl font-semibold text-slate-800 mb-6">
          Bid History — Vintage Rolex Submariner
        </h1>

        <div className="glass-card rounded-3xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Bids</p>
              <p className="text-2xl font-bold text-slate-800">
                {mockBidHistory.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Highest Bid</p>
              <p className="text-2xl font-bold font-mono text-slate-800">
                ${mockBidHistory[0].amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Status</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/15 text-red-700 border border-red-500/30 text-sm font-medium rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse-dot"></span>
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/30 border-b border-white/40">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">
                  #
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">
                  Bidder
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/30">
              {mockBidHistory.map((bid, idx) =>
              <motion.tr
                key={bid.id}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: idx * 0.05
                }}
                className={
                bid.isWinner ?
                'bg-emerald-500/15 border-l-4 border-l-emerald-600' :
                'hover:bg-white/30 transition-colors'
                }>
                
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">
                        {bid.bidder}
                      </span>
                      {bid.isWinner &&
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 text-xs font-medium rounded-full">
                          <Trophy className="w-3 h-3" />
                          Winner
                        </span>
                    }
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">
                    ${bid.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {bid.time}
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}