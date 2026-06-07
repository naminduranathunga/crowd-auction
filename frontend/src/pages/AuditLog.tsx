import React, { useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
const mockLogs = [
{
  id: 1,
  type: 'login' as const,
  description: 'User logged in',
  actor: 'john.doe@example.com',
  time: '2 minutes ago'
},
{
  id: 2,
  type: 'bid' as const,
  description: 'Bid placed on Vintage Rolex Submariner',
  actor: 'jane.smith@example.com',
  time: '5 minutes ago'
},
{
  id: 3,
  type: 'wallet' as const,
  description: 'Wallet top-up: $500',
  actor: 'bob.wilson@example.com',
  time: '12 minutes ago'
},
{
  id: 4,
  type: 'role_change' as const,
  description: 'User role changed from Buyer to Seller',
  actor: 'System',
  time: '18 minutes ago'
},
{
  id: 5,
  type: 'suspension' as const,
  description: 'User account suspended',
  actor: 'admin@bidvault.com',
  time: '25 minutes ago'
}];

export function AuditLog() {
  const [eventType, setEventType] = useState('all');
  const [dateRange, setDateRange] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const getEventColor = (type: string) => {
    const colors = {
      login: 'bg-slate-700',
      bid: 'bg-emerald-600',
      wallet: 'bg-amber-600',
      role_change: 'bg-purple-600',
      suspension: 'bg-red-600'
    };
    return colors[type as keyof typeof colors] || 'bg-slate-500';
  };
  const inputClass =
  'px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-full text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800/30';
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Audit Log
        </h1>

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-white/40 flex flex-wrap items-center gap-4">
            <input
              type="date"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={inputClass} />
            
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className={inputClass}>
              
              <option value="all">All Events</option>
              <option value="login">Login</option>
              <option value="bid">Bid</option>
              <option value="wallet">Wallet</option>
              <option value="role_change">Role Change</option>
              <option value="suspension">Suspension</option>
            </select>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search user..."
              className={`${inputClass} flex-1`} />
            
          </div>

          <div className="divide-y divide-white/30">
            {mockLogs.map((log) =>
            <div
              key={log.id}
              className="flex items-center gap-4 p-4 hover:bg-white/30 cursor-pointer transition-colors">
              
                <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${getEventColor(log.type)}`} />
              
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    {log.description}
                  </p>
                  <p className="text-xs text-slate-600">Actor: {log.actor}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {log.time}
                </span>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/40 text-center">
            <button className="text-sm text-slate-700 hover:text-slate-900 font-medium">
              Load more
            </button>
          </div>
        </div>
      </div>
    </div>);

}