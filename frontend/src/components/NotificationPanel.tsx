import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
const mockNotifications = [
{
  id: 1,
  title: "You've been outbid",
  subtitle: 'Vintage Rolex Submariner • 2 minutes ago',
  type: 'outbid',
  read: false
},
{
  id: 2,
  title: 'Auction ending soon',
  subtitle: 'Rare First Edition Book • 15 minutes ago',
  type: 'ending',
  read: false
},
{
  id: 3,
  title: 'You won an auction!',
  subtitle: 'Limited Edition Sneakers • 1 hour ago',
  type: 'won',
  read: true
}];

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50" />
        
          <motion.div
          initial={{
            x: '100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '100%'
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 200
          }}
          className="fixed right-0 top-0 bottom-0 w-[340px] bg-white/40 backdrop-blur-2xl border-l border-white/50 shadow-2xl z-50 flex flex-col">
          
            <div className="flex items-center justify-between p-4 border-b border-white/40">
              <h2 className="text-lg font-semibold text-slate-800">
                Notifications
              </h2>
              <div className="flex items-center gap-2">
                <button className="text-sm text-slate-700 hover:text-slate-900">
                  Mark all as read
                </button>
                <button
                onClick={onClose}
                className="p-1 text-slate-600 hover:text-slate-800">
                
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {mockNotifications.map((notif) =>
            <div
              key={notif.id}
              className={`p-4 border-l-4 border-b border-white/30 cursor-pointer hover:bg-white/30 transition-colors ${notif.type === 'outbid' ? 'border-l-amber-500' : notif.type === 'ending' ? 'border-l-amber-500' : 'border-l-emerald-500'} ${!notif.read ? 'bg-white/20' : ''}`}>
              
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">
                    {notif.title}
                  </h3>
                  <p className="text-xs text-slate-600">{notif.subtitle}</p>
                </div>
            )}
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}