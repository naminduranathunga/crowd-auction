import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { ArrowLeft, Trophy } from 'lucide-react';
import { getAuctionById, AuctionResponse } from '../services/itemApi';
import { getBidsByItemId, BidResponseDTO } from '../services/bidApi';
import { getUserById, UserDto } from '../services/userApi';

interface BidWithUser extends BidResponseDTO {
  user?: UserDto;
}

export function BidHistory() {
  const { id } = useParams<{ id: string }>();
  const [auction, setAuction] = useState<AuctionResponse | null>(null);
  const [bids, setBids] = useState<BidWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!id) return;
        const auctionData = await getAuctionById(id);
        setAuction(auctionData);

        const firstItem = auctionData.items && auctionData.items.length > 0 ? auctionData.items[0] : null;
        if (firstItem) {
          try {
            const bidsData = await getBidsByItemId(firstItem.id);
            
            // Sort bids descending by amount
            const sortedBids = bidsData.sort((a, b) => b.amount - a.amount);
            
            // Fetch user details for each unique user
            const uniqueUserIds = Array.from(new Set(sortedBids.map(b => b.userId)));
            const userCache: Record<string, UserDto> = {};
            
            await Promise.all(
              uniqueUserIds.map(async (userId) => {
                try {
                  const user = await getUserById(userId);
                  userCache[userId] = user;
                } catch (err) {
                  console.error(`Failed to fetch user ${userId}`);
                }
              })
            );

            const bidsWithUsers = sortedBids.map(bid => ({
              ...bid,
              user: userCache[bid.userId]
            }));

            setBids(bidsWithUsers);
          } catch (bidErr) {
            console.error('Failed to fetch bids from bid-service', bidErr);
            setBids([]);
          }
        }
      } catch (err) {
        console.error('Failed to load auction details', err);
        setError('Failed to load auction details.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    
    // Auto-refresh every 10 seconds if auction is active
    const interval = setInterval(() => {
      fetchHistory();
    }, 10000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading && !auction) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopNav />
        <div className="max-w-4xl mx-auto px-4 py-8 mt-16 text-center text-slate-600">
          Loading bid history...
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopNav />
        <div className="max-w-4xl mx-auto px-4 py-8 mt-16 text-center text-red-600">
          {error || 'Listing not found.'}
        </div>
      </div>
    );
  }

  const isClosed = auction.status === 'CLOSED';
  const winnerBidId = isClosed && bids.length > 0 ? bids[0].id : null;
  const firstItem = auction.items && auction.items.length > 0 ? auction.items[0] : null;
  const startingPrice = firstItem?.startPrice || 0;
  const currentBid = bids.length > 0 ? bids[0].amount : startingPrice;

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    let styles = 'bg-white/30 text-slate-600 border-white/40';
    if (s === 'active') styles = 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30';
    else if (s === 'draft' || s === 'pending') styles = 'bg-yellow-500/20 text-yellow-800 border-yellow-500/30';
    else if (s === 'cancelled') styles = 'bg-red-500/20 text-red-800 border-red-500/30';

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles}`}>
        {status.charAt(0).toUpperCase() + status.toLowerCase().slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
        <div className="mb-6">
          <Link to="/seller/listings" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to listings
          </Link>
        </div>

        {/* Item Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <img
                src={localStorage.getItem(`auction_image_${auction.id}`) || `https://ui-avatars.com/api/?name=${encodeURIComponent(auction.name)}&size=300&background=cbd5e1&color=334155&bold=true&format=png`}
                alt={auction.name}
                className="w-full h-48 md:h-64 rounded-2xl object-cover border border-slate-100"
              />
            </div>
            
            <div className="w-full md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h1 className="text-2xl font-bold text-slate-800">{auction.name}</h1>
                  {getStatusBadge(auction.status)}
                </div>
                <p className="text-slate-600 text-sm mb-6">{auction.description || 'No description provided.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                <div>
                  <span className="block text-xs text-slate-500 font-medium uppercase tracking-wider">Starting Price</span>
                  <span className="text-lg font-bold text-slate-800 font-mono">${startingPrice.toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium uppercase tracking-wider">Current Bid</span>
                  <span className="text-lg font-bold text-slate-800 font-mono">
                    {bids.length > 0 ? `$${currentBid.toLocaleString()}` : '—'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
                <div>
                  <span className="font-semibold">Starts: </span>
                  {new Date(auction.startTime.endsWith('Z') ? auction.startTime : `${auction.startTime}Z`).toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">Ends: </span>
                  {new Date(auction.endTime.endsWith('Z') ? auction.endTime : `${auction.endTime}Z`).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bids Table Section */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-800">Bid History ({bids.length})</h2>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Date & Time</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Bidder</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bids.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                      No bids have been placed yet.
                    </td>
                  </tr>
                ) : (
                  bids.map((bid) => {
                    const isWinner = bid.id === winnerBidId;
                    const rowStyles = isWinner ? "bg-emerald-50/50" : "hover:bg-slate-50";
                    
                    let textStyles = "text-slate-800";
                    if (isClosed) {
                      textStyles = isWinner ? "text-emerald-600 font-semibold" : "text-red-500";
                    } else {
                      textStyles = isWinner ? "text-emerald-600 font-semibold" : "text-slate-800";
                    }

                    return (
                      <tr key={bid.id} className={`transition-colors ${rowStyles}`}>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(bid.createdAt + 'Z').toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            {isWinner && <Trophy className="w-4 h-4 text-emerald-500" />}
                            <span className={textStyles}>
                              {bid.user ? `${bid.user.firstName} ${bid.user.lastName}` : `User ${bid.userId}`}
                            </span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm text-right font-mono font-bold ${textStyles}`}>
                          ${bid.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}