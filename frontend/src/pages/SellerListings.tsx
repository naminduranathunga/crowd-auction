import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { Plus, Pencil, Trash2 } from 'lucide-react';
type ListingStatus = 'all' | 'scheduled' | 'active' | 'closed';
const mockListings = [
{
  id: 1,
  title: 'Vintage Rolex Submariner',
  thumbnail:
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200',
  startTime: 'Today, 2:00 PM',
  duration: '120 min',
  startingPrice: 10000,
  currentBid: 15420,
  status: 'active' as const,
  hasBids: true
},
{
  id: 2,
  title: 'Limited Edition Sneakers',
  thumbnail:
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=200',
  startTime: 'Tomorrow, 10:00 AM',
  duration: '60 min',
  startingPrice: 500,
  currentBid: null,
  status: 'scheduled' as const,
  hasBids: false
},
{
  id: 3,
  title: 'Rare First Edition Book',
  thumbnail:
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
  startTime: 'Yesterday, 3:00 PM',
  duration: '90 min',
  startingPrice: 2000,
  currentBid: 3200,
  status: 'closed' as const,
  hasBids: true
}];

export function SellerListings() {
  const [filter, setFilter] = useState<ListingStatus>('all');
  const filters: {
    value: ListingStatus;
    label: string;
  }[] = [
  {
    value: 'all',
    label: 'All'
  },
  {
    value: 'scheduled',
    label: 'Scheduled'
  },
  {
    value: 'active',
    label: 'Active'
  },
  {
    value: 'closed',
    label: 'Closed'
  }];

  const getStatusBadge = (status: string) => {
    const styles = {
      scheduled: 'bg-white/40 text-slate-700 border-white/60',
      active: 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30',
      closed: 'bg-white/30 text-slate-600 border-white/40'
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>);

  };
  return (
    <div className="min-h-screen">
      <TopNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-slate-800">My Listings</h1>
          <Link
            to="/seller/listings/new"
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-full font-medium hover:bg-slate-900 transition-colors">
            
            <Plus className="w-4 h-4" />
            New listing
          </Link>
        </div>

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

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/30 border-b border-white/40">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Item
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Start Time
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Duration
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Starting Price
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Current Bid
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                {mockListings.map((listing) =>
                <tr
                  key={listing.id}
                  className="hover:bg-white/30 transition-colors">
                  
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                        src={listing.thumbnail}
                        alt={listing.title}
                        className="w-12 h-12 rounded-2xl object-cover" />
                      
                        <span className="font-medium text-slate-800">
                          {listing.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {listing.startTime}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {listing.duration}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-800">
                      ${listing.startingPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono font-bold text-slate-800">
                      {listing.currentBid ?
                    `$${listing.currentBid.toLocaleString()}` :
                    '—'}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(listing.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                        to={`/seller/listings/${listing.id}/edit`}
                        className={`p-2 rounded-full transition-colors ${listing.status === 'scheduled' ? 'text-slate-700 hover:text-slate-900 hover:bg-white/50' : 'text-slate-400 cursor-not-allowed'}`}
                        title={
                        listing.status !== 'scheduled' ?
                        'Cannot edit active or closed listings' :
                        'Edit listing'
                        }>
                        
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                        className={`p-2 rounded-full transition-colors ${!listing.hasBids ? 'text-red-700 hover:text-red-800 hover:bg-red-500/20' : 'text-slate-400 cursor-not-allowed'}`}
                        title={
                        listing.hasBids ?
                        'Cannot delete — bids placed' :
                        'Delete listing'
                        }
                        disabled={listing.hasBids}>
                        
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>);

}