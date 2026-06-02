import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { User, Store, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
type UserRole = 'buyer' | 'seller' | 'admin';
export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switch (role) {
      case 'buyer':
        navigate('/auctions');
        break;
      case 'seller':
        navigate('/seller/listings');
        break;
      case 'admin':
        navigate('/admin');
        break;
    }
  };
  const roleDescriptions = {
    buyer: 'Sign in to browse and bid on auctions',
    seller: 'Sign in to manage your listings',
    admin: 'Sign in to the admin console'
  };
  const tabs = [
  {
    value: 'buyer' as UserRole,
    label: 'Buyer',
    icon: User
  },
  {
    value: 'seller' as UserRole,
    label: 'Seller',
    icon: Store
  },
  {
    value: 'admin' as UserRole,
    label: 'Admin',
    icon: Shield
  }];

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium text-slate-800 mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-slate-600">Sign in to your account</p>
      </div>

      <div className="mb-6">
        <div className="bg-white/30 backdrop-blur-sm rounded-full p-1 flex gap-1 border border-white/40">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setRole(tab.value)}
                className={`flex-1 relative py-2 px-3 rounded-full text-sm font-medium transition-all ${role === tab.value ? 'text-white' : 'text-slate-600 hover:text-slate-800'}`}>
                
                {role === tab.value &&
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-slate-800 rounded-full shadow-sm"
                  transition={{
                    type: 'spring',
                    bounce: 0.2,
                    duration: 0.6
                  }} />

                }
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </span>
              </button>);

          })}
        </div>
        <p className="text-xs text-slate-600 text-center mt-3">
          {roleDescriptions[role]}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1">
            
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800/30 focus:border-slate-800/40 transition-colors"
            required />
          
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1">
            
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800/30 focus:border-slate-800/40 transition-colors"
            required />
          
        </div>

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-slate-700 hover:text-slate-900">
            
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white py-2 rounded-full font-medium hover:bg-slate-900 transition-colors">
          
          Sign in
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-6">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-slate-800 hover:text-slate-900 font-medium">
          
          Register
        </Link>
      </p>
    </AuthLayout>);

}