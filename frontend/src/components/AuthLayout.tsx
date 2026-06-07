import React from 'react';
import { motion } from 'framer-motion';
import { Gavel } from 'lucide-react';
interface AuthLayoutProps {
  children: React.ReactNode;
}
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4
        }}
        className="w-full max-w-md">
        
        <div className="glass-card rounded-3xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
              <Gavel className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-medium text-slate-800">BidVault</h1>
          </div>
          {children}
        </div>
      </motion.div>
    </div>);

}