import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Search, Bell, User } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';
interface TopNavProps {
  centerContent?: React.ReactNode;
}
export function TopNav({ centerContent }: TopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  return (
    <>
      <nav className="sticky top-0 z-40 glass-card-subtle border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/auctions" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-800 rounded-2xl flex items-center justify-center shadow-md">
                <Gavel className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-800">
                BidVault
              </span>
            </Link>

            {centerContent &&
            <div className="flex-1 flex justify-center px-8">
                {centerContent}
              </div>
            }

            <div className="flex items-center gap-3">
              <button className="p-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-full text-slate-700 hover:bg-white/60 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowNotifications(true)}
                className="p-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-full text-slate-700 hover:bg-white/60 transition-colors relative">
                
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="w-8 h-8 bg-white/40 backdrop-blur-sm border border-white/60 rounded-full flex items-center justify-center text-slate-700 hover:bg-white/60 transition-colors">
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)} />
      
    </>);

}