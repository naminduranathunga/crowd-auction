import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getAuctions, deleteAuction, AuctionResponse } from '../services/itemApi';
import { useAuth } from '../hooks/useAuth';
import { ConfirmModal } from '../components/ConfirmModal';

type ListingFilter = 'ALL' | 'DRAFT' | 'PENDING' | 'ACTIVE' | 'CLOSED' | 'CANCELLED';

export function SellerListings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ListingFilter>('ALL');
  const [auctions, setAuctions] = useState<AuctionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [auctionToDelete, setAuctionToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await getAuctions();
        if (user) {
          setAuctions(data.filter((a) => a.userId === user.id));
        } else {
          setAuctions([]);
        }
      } catch (err) {
        console.error('Failed to fetch auctions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
    const interval = setInterval(fetchAuctions, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const filters: { value: ListingFilter; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

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

  const calculateDuration = (start: string, end: string) => {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    return Math.round(diffMs / 60000) + ' min';
  };

  const handleDelete = (id: number) => {
    setAuctionToDelete(id);
  };

  const confirmDelete = async () => {
    if (!auctionToDelete) return;
    const id = auctionToDelete;
    
    try {
      await deleteAuction(id);
      setAuctions((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete auction:', err);
      alert('Failed to delete listing.');
    } finally {
      setAuctionToDelete(null);
    }
  };

  const filteredAuctions = filter === 'ALL' 
    ? auctions 
    : auctions.filter(a => a.status === filter);

  return (
    <div className="min-h-screen">
      <TopNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-slate-800">My Listings</h1>
          <Link
            to="/seller/listings/new"
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-full font-medium hover:bg-slate-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New listing
          </Link>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.value
                  ? 'bg-slate-800 text-white'
                  : 'bg-white/30 backdrop-blur-sm border border-white/40 text-slate-700 hover:bg-white/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/30 border-b border-white/40">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Item</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Start Time</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Duration</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Starting Price</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Current Bid</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-600">
                      Loading listings...
                    </td>
                  </tr>
                ) : filteredAuctions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-600">
                      No listings found.
                    </td>
                  </tr>
                ) : (
                  filteredAuctions.map((auction) => {
                    const firstItem = auction.items && auction.items.length > 0 ? auction.items[0] : null;
                    const startingPrice = firstItem?.startPrice || 0;
                    const currentBid = firstItem?.currentPrice && firstItem.currentPrice > startingPrice ? firstItem.currentPrice : null;
                    const hasBids = currentBid !== null;
                    const isEditable = auction.status === 'DRAFT' || auction.status === 'PENDING';

                    return (
                      <tr 
                        key={auction.id} 
                        className="hover:bg-white/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/seller/listings/${auction.id}/bids`)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={localStorage.getItem(`auction_image_${auction.id}`) || `https://ui-avatars.com/api/?name=${encodeURIComponent(auction.name)}&size=48&background=cbd5e1&color=334155&bold=true&format=png`}
                              alt={auction.name}
                              className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
                            />
                            <span className="font-medium text-slate-800">{auction.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {new Date(auction.startTime.endsWith('Z') ? auction.startTime : `${auction.startTime}Z`).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {calculateDuration(auction.startTime.endsWith('Z') ? auction.startTime : `${auction.startTime}Z`, auction.endTime.endsWith('Z') ? auction.endTime : `${auction.endTime}Z`)}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-slate-800">
                          ${startingPrice.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono font-bold text-slate-800">
                          {currentBid ? `$${currentBid.toLocaleString()}` : '—'}
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(auction.status)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                             <Link
                              to={`/seller/listings/${auction.id}/edit`}
                              onClick={(e) => e.stopPropagation()}
                              className={`p-2 rounded-full transition-colors ${
                                isEditable
                                  ? 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                                  : 'text-slate-400 cursor-not-allowed pointer-events-none'
                              }`}
                              title={!isEditable ? 'Cannot edit active or closed listings' : 'Edit listing'}
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              className={`p-2 rounded-full transition-colors ${
                                isEditable
                                  ? 'text-red-700 hover:text-red-800 hover:bg-red-500/20'
                                  : 'text-slate-400 cursor-not-allowed'
                              }`}
                              title={isEditable ? 'Delete listing' : 'Cannot delete active or closed listings'}
                              disabled={!isEditable}
                              onClick={(e) => { e.stopPropagation(); handleDelete(auction.id); }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      <ConfirmModal
        isOpen={auctionToDelete !== null}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setAuctionToDelete(null)}
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}