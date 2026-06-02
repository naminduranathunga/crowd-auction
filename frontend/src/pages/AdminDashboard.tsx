import React from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Users, Gavel, Wallet, TrendingUp } from 'lucide-react';
const metrics = [
{
  label: 'Total Users',
  value: '1,234',
  icon: Users,
  color: 'text-slate-700'
},
{
  label: 'Active Auctions',
  value: '42',
  icon: Gavel,
  color: 'text-emerald-700'
},
{
  label: 'Total Escrow Held',
  value: '$234,560',
  icon: Wallet,
  color: 'text-amber-700'
},
{
  label: 'Bids Today',
  value: '156',
  icon: TrendingUp,
  color: 'text-red-700'
}];

const recentActivity = [
{
  id: 1,
  event: 'New user registered',
  user: 'john.doe@example.com',
  time: '2 minutes ago'
},
{
  id: 2,
  event: 'Bid placed',
  user: 'Bidder #7 on Vintage Rolex',
  time: '5 minutes ago'
},
{
  id: 3,
  event: 'Auction ended',
  user: 'Limited Edition Sneakers',
  time: '12 minutes ago'
},
{
  id: 4,
  event: 'Wallet top-up',
  user: 'jane.smith@example.com',
  time: '18 minutes ago'
},
{
  id: 5,
  event: 'New listing created',
  user: 'Rare First Edition Book',
  time: '25 minutes ago'
}];

const bidVolumeData = [
{
  hour: '00:00',
  bids: 12
},
{
  hour: '04:00',
  bids: 8
},
{
  hour: '08:00',
  bids: 24
},
{
  hour: '12:00',
  bids: 32
},
{
  hour: '16:00',
  bids: 28
},
{
  hour: '20:00',
  bids: 18
}];

export function AdminDashboard() {
  const maxBids = Math.max(...bidVolumeData.map((d) => d.bids));
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-slate-600">{metric.label}</p>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <p className="text-3xl font-bold text-slate-800">
                  {metric.value}
                </p>
              </div>);

          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity) =>
              <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-slate-800 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {activity.event}
                    </p>
                    <p className="text-xs text-slate-600 truncate">
                      {activity.user}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Bid Volume (24h)
            </h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {bidVolumeData.map((data) =>
              <div
                key={data.hour}
                className="flex-1 flex flex-col items-center gap-2">
                
                  <div
                  className="w-full bg-slate-800/15 rounded-t-2xl relative flex items-end"
                  style={{
                    height: '160px'
                  }}>
                  
                    <div
                    className="w-full bg-slate-800 rounded-t-2xl transition-all"
                    style={{
                      height: `${data.bids / maxBids * 160}px`
                    }} />
                  
                  </div>
                  <span className="text-xs text-slate-600">{data.hour}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>);

}