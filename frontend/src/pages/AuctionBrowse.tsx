import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { motion } from 'framer-motion';
import { AuctionResponse, getAuctions } from '../services/itemApi';
import AuctionStatusBadge from '../components/AuctionStatusBadge';
type FilterType = 'all' | 'active' | 'ending' | 'closed';


function getAuctionImage(auction: AuctionResponse): string {
  if (localStorage.getItem(`auction_image_${auction.id}`)) {
    return localStorage.getItem(`auction_image_${auction.id}`)!;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(auction.name)}&size=48&background=cbd5e1&color=334155&bold=true&format=png`;
}

function AuctionRemaingTimeComponent({ auction }: { auction: AuctionResponse }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const endTime = new Date(auction.endTime);
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({
        hours,
        minutes,
        seconds
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [auction.endTime]);


  return (
    <div className="text-sm text-slate-600">
      {String(timeLeft.hours).padStart(2, '0')}:
      {String(timeLeft.minutes).padStart(2, '0')}:
      {String(timeLeft.seconds).padStart(2, '0')}
    </div>
  );
}


export function AuctionBrowse() {
  const [auctions, setAuctions] = useState<AuctionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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


  useEffect(() => {
    getAuctions()
      .then((data) => {
        setAuctions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

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
          {loading && <>
            <div className="rounded-3xl overflow-hidden bg-slate-200 p-4">
              <div className="aspect-square w-full animate-pulse bg-slate-300 rounded-xl "></div>
              <div className="w-full h-8 my-4 bg-slate-300 animate-pulse rounded-xl "></div>
            </div>
            <div className="rounded-3xl overflow-hidden bg-slate-200 p-4">
              <div className="aspect-square w-full animate-pulse bg-slate-300 rounded-xl "></div>
              <div className="w-full h-8 my-4 bg-slate-300 animate-pulse rounded-xl "></div>
            </div>
            <div className="rounded-3xl overflow-hidden bg-slate-200 p-4">
              <div className="aspect-square w-full animate-pulse bg-slate-300 rounded-xl "></div>
              <div className="w-full h-8 my-4 bg-slate-300 animate-pulse rounded-xl "></div>
            </div>
          </>}
          {error && <div className="text-red-600 text-center col-span-full">
            Error loading auctions: {error}
          </div>}
          {auctions && auctions.map((auction, index) =>
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
                  src={getAuctionImage(auction)}
                  alt={auction.name}
                  className="w-full h-full object-cover" />
                
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    {auction.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Current bid:{' '}
                    <span className="font-mono font-bold text-slate-800">
                      ${auction.items[0]?.currentPrice?.toLocaleString()}
                    </span>
                  </p>
                  <div className="flex items-center justify-between">
                    <AuctionStatusBadge status={auction.status} />
                    <span className="text-sm font-mono text-slate-600">
                      {/*
                      {String(auction.timeLeft.hours).padStart(2, '0')}:
                      {String(auction.timeLeft.minutes).padStart(2, '0')}:
                      {String(auction.timeLeft.seconds).padStart(2, '0')}
                      */}
                      <AuctionRemaingTimeComponent auction={auction} />
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