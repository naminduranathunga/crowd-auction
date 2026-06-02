import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { Trophy } from 'lucide-react';
type BidStatus = 'all' | 'leading' | 'outbid' | 'won' | 'lost';
const mockBids = [
{
  id: 1,
  itemName: 'Vintage Rolex Submariner',
  auctionTitle: 'Luxury Watch Auction',
  thumbnail:
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200',
  bidAmount: 15420,
  status: 'outbid' as const
},
{
  id: 2,
  itemName: 'Limited Edition Sneakers',
  auctionTitle: 'Streetwear Collection',
  thumbnail:
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=200',
  bidAmount: 890,
  status: 'won' as const
},
{
  id: 3,
  itemName: 'Rare First Edition Book',
  auctionTitle: 'Literary Treasures',
  thumbnail:
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
  bidAmount: 3200,
  status: 'leading' as const
},
{
  id: 4,
  itemName: 'Vintage Fender Stratocaster',
  auctionTitle: 'Musical Instruments',
  thumbnail:
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200',
  bidAmount: 7650,
  status: 'lost' as const
}];

export function MyBids() {
  const [filter, setFilter] = useState<BidStatus>('all');
  const filters: {
    value: BidStatus;
    label: string;
  }[] = [
  {
    value: 'all',
    label: 'All'
  },
  {
    value: 'leading',
    label: 'Leading'
  },
  {
    value: 'outbid',
    label: 'Outbid'
  },
  {
    value: 'won',
    label: 'Won'
  },
  {
    value: 'lost',
    label: 'Lost'
  }];

  const getStatusBadge = (status: string) => {
    const styles = {
      leading: 'bg-slate-800/15 text-slate-800 border-slate-800/20',
      outbid: 'bg-amber-500/20 text-amber-800 border-amber-500/30',
      won: 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30',
      lost: 'bg-white/40 text-slate-600 border-white/60'
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        
        {status === 'won' && <Trophy className="w-3.5 h-3.5" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>);

  };
  return (
    <div className="min-h-screen">
      <TopNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-6">My Bids</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {filters.map((f) =>
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === f.value ? 'bg-slate-800 text-white' : 'bg-white/30 backdrop-blur-sm border border-white/40 text-slate-700 hover:bg-white/50'}`}>
            
              {f.label}
            </button>
          )}
        </div>

        <div className="glass-card rounded-3xl divide-y divide-white/40 overflow-hidden">
          {mockBids.map((bid) =>
          <Link
            key={bid.id}
            to={`/auctions/${bid.id}`}
            className="flex items-center gap-4 p-4 hover:bg-white/30 transition-colors">
            
              <img
              src={bid.thumbnail}
              alt={bid.itemName}
              className="w-16 h-16 rounded-2xl object-cover" />
            
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">
                  {bid.itemName}
                </h3>
                <p className="text-sm text-slate-600 truncate">
                  {bid.auctionTitle}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-slate-800 mb-1">
                  ${bid.bidAmount.toLocaleString()}
                </p>
                {getStatusBadge(bid.status)}
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>);

}