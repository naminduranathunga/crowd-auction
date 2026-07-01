import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { ChevronDown, ChevronUp } from 'lucide-react';
import RealtimeBidder from '../components/RealtimeBidder';
import { AuctionResponse, getAuctionById } from '../services/itemApi';
import AuctionStatusBadge from '../components/AuctionStatusBadge';
import AuctionDetailsTimer from '../components/AuctionDetailsTimer';
import { placeBid } from '../services/bidApi';
import { useAuth } from '../hooks/useAuth';
const mockItem = {
  id: 1,
  title: 'Vintage Rolex Submariner',
  seller: 'WatchCollector_Pro',
  images: [
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
  'https://images.unsplash.com/photo-1587836374228-4c4c1c4c0c5f?w=800',
  'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800'],

  currentBid: 15420,
  minNextBid: 15500,
  timeLeft: {
    hours: 2,
    minutes: 34,
    seconds: 12
  },
  description:
  'Authentic vintage Rolex Submariner in excellent condition. Includes original box and papers.',
  bidHistory: [
  {
    bidder: 'Bidder #7',
    amount: 15420,
    time: '2 minutes ago'
  },
  {
    bidder: 'Bidder #3',
    amount: 15200,
    time: '8 minutes ago'
  },
  {
    bidder: 'Bidder #7',
    amount: 15000,
    time: '15 minutes ago'
  },
  {
    bidder: 'Bidder #2',
    amount: 14800,
    time: '23 minutes ago'
  }]

};
export function ItemDetail() {
  const { id } = useParams();
  const {user} = useAuth();
  const [currentAuction, setCurrentAuction] = useState<AuctionResponse|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [showBidHistory, setShowBidHistory] = useState(false);
  
  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    placeBid(id ? parseInt(id) : 0, parseFloat(bidAmount), user?.id || '')
      .then((response) => {
        alert(`Bid placed: $${response.amount}`);
        setBidAmount('');
        document.dispatchEvent(new CustomEvent("bid-placed", { detail: { itemId: id, bid: response } }));
      })
      .catch((error) => {
        console.error('Error placing bid:', error);
        alert('Failed to place bid. Please try again.');
      });
  };

  useEffect(() => {
    getAuctionById(id ? parseInt(id) : 0)
      .then((auction) => {
        setCurrentAuction(auction);
      })
      .catch((error) => {
        console.error('Error fetching auction details:', error);
        setError('Failed to fetch auction details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const handleAuctionTimerExpired = (event: CustomEvent) => {
      const expiredAuctionId = event.detail.auctionId;
      if (currentAuction && currentAuction.id === expiredAuctionId) {
        setCurrentAuction({ ...currentAuction, status: 'CLOSED' });
      }
    };

    document.addEventListener('auction-timer-expired', handleAuctionTimerExpired as EventListener);
    return () => {
      document.removeEventListener('auction-timer-expired', handleAuctionTimerExpired as EventListener);
    }
  }, [currentAuction]);

  return (
    <div className="min-h-screen">
      <TopNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-video glass-card rounded-3xl overflow-hidden mb-4">
              <img
                src={mockItem.images[selectedImage]}
                alt={mockItem.title}
                className="w-full h-full object-cover" />
              
            </div>
            <div className="flex gap-2">
              {mockItem.images.map((img, idx) =>
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-slate-800' : 'border-white/50'}`}>
                
                  <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover" />
                
                </button>
              )}
            </div>
          </div>

          {currentAuction && <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {currentAuction?.name}
              </h1>
              <p className="text-sm text-slate-600">
                {currentAuction.description}
              </p>
              <AuctionStatusBadge status={currentAuction.status} />
            </div>

            <AuctionDetailsTimer auction={currentAuction} />

            {currentAuction.items && currentAuction.items.length > 0 && (
              <RealtimeBidder Item={currentAuction.items[0]} Auction={currentAuction} ItemId={id ? parseInt(id) : 0} />
            )}

            {/*<div className="glass-card rounded-3xl p-6">
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-1">
                  Current highest bid
                </p>
                <p className="text-3xl font-bold font-mono text-slate-800">
                  ${mockItem.currentBid.toLocaleString()}
                </p>
              </div>

              <div className="border-t border-white/40 pt-4">
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Your bid (must be higher than $
                      {mockItem.minNextBid.toLocaleString()})
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={mockItem.minNextBid}
                      className="w-full px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800/30 focus:border-slate-800/40"
                      placeholder={mockItem.minNextBid.toString()}
                      required />
                    
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-800 text-white py-3 rounded-full font-semibold hover:bg-slate-900 transition-colors">
                    
                    Place bid
                  </button>
                  <p className="text-xs text-slate-600 text-center">
                    Funds will be held in escrow immediately
                  </p>
                </form>
              </div>
            </div>

            <div className="glass-card rounded-3xl">
              <button
                onClick={() => setShowBidHistory(!showBidHistory)}
                className="w-full flex items-center justify-between p-4 text-left">
                
                <span className="font-semibold text-slate-800">
                  Bid History
                </span>
                {showBidHistory ?
                <ChevronUp className="w-5 h-5 text-slate-600" /> :

                <ChevronDown className="w-5 h-5 text-slate-600" />
                }
              </button>
              {showBidHistory &&
              <div className="border-t border-white/40">
                  {mockItem.bidHistory.map((bid, idx) =>
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border-b border-white/30 last:border-0">
                  
                      <div>
                        <p className="font-medium text-slate-800">
                          {bid.bidder}
                        </p>
                        <p className="text-xs text-slate-600">{bid.time}</p>
                      </div>
                      <p className="font-mono font-bold text-slate-800">
                        ${bid.amount.toLocaleString()}
                      </p>
                    </div>
                )}
                </div>
              }
            </div>*/}
          </div>}
        </div>
      </div>
    </div>);

}