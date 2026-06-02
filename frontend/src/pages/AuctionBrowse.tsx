import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { motion } from 'framer-motion';
type FilterType = 'all' | 'active' | 'ending' | 'closed';
const mockAuctions = [
{
  id: 1,
  title: 'Vintage Rolex Submariner',
  image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
  currentBid: 15420,
  status: 'live',
  timeLeft: {
    hours: 2,
    minutes: 34,
    seconds: 12
  }
},
{
  id: 2,
  title: 'Rare First Edition Book',
  image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
  currentBid: 3200,
  status: 'live',
  timeLeft: {
    hours: 0,
    minutes: 45,
    seconds: 30
  }
},
{
  id: 3,
  title: 'Limited Edition Sneakers',
  image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
  currentBid: 890,
  status: 'live',
  timeLeft: {
    hours: 5,
    minutes: 12,
    seconds: 8
  }
},
{
  id: 4,
  title: 'Vintage Fender Stratocaster',
  image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
  currentBid: 7650,
  status: 'live',
  timeLeft: {
    hours: 1,
    minutes: 20,
    seconds: 45
  }
},
{
  id: 5,
  title: 'Canon EOS R5 Camera',
  image: 'https://images.unsplash.com/photo-1606980707146-b0367c6b2f3d?w=400',
  currentBid: 2340,
  status: 'live',
  timeLeft: {
    hours: 3,
    minutes: 8,
    seconds: 22
  }
},
{
  id: 6,
  title: 'Abstract Art Print',
  image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
  currentBid: 1200,
  status: 'live',
  timeLeft: {
    hours: 0,
    minutes: 28,
    seconds: 55
  }
}];

export function AuctionBrowse() {
  const [filter, setFilter] = useState<FilterType>('all');
  const filters: {
    value: FilterType;
    label: string;
  }[] = [
  {
    value: 'all',
    label: 'All'
  },
  {
    value: 'active',
    label: 'Active'
  },
  {
    value: 'ending',
    label: 'Ending Soon'
  },
  {
    value: 'closed',
    label: 'Closed'
  }];

  return (
    <div className="min-h-screen">
      <TopNav
        centerContent={
        <div className="flex gap-2">
            {filters.map((f) =>
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f.value ? 'bg-slate-800 text-white' : 'bg-white/30 backdrop-blur-sm border border-white/40 text-slate-700 hover:bg-white/50'}`}>
            
                {f.label}
              </button>
          )}
          </div>
        } />
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Live Auctions
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAuctions.map((auction, index) =>
          <motion.div
            key={auction.id}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index * 0.05
            }}
            whileHover={{
              y: -4
            }}>
            
              <Link
              to={`/auctions/${auction.id}`}
              className="block glass-card rounded-3xl overflow-hidden transition-all hover:shadow-xl">
              
                <div className="aspect-square overflow-hidden">
                  <img
                  src={auction.image}
                  alt={auction.title}
                  className="w-full h-full object-cover" />
                
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    {auction.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Current bid:{' '}
                    <span className="font-mono font-bold text-slate-800">
                      ${auction.currentBid.toLocaleString()}
                    </span>
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/15 text-red-700 text-xs font-medium rounded-md border border-red-500/30">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse-dot"></span>
                      LIVE
                    </span>
                    <span className="text-sm font-mono text-slate-600">
                      {String(auction.timeLeft.hours).padStart(2, '0')}:
                      {String(auction.timeLeft.minutes).padStart(2, '0')}:
                      {String(auction.timeLeft.seconds).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>);

}