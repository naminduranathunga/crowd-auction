import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { User, Store } from 'lucide-react';
import { motion } from 'framer-motion';
type UserRole = 'buyer' | 'seller';
export function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/verify');
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
  }];

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium text-slate-800 mb-1">
          Create your account
        </h2>
        <p className="text-sm text-slate-600">Join BidVault in seconds</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-slate-700 mb-1">
            
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800/30 focus:border-slate-800/40 transition-colors"
            required />
          
        </div>

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

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-slate-700 mb-1">
            
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800/30 focus:border-slate-800/40 transition-colors"
            required />
          
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            I am a:
          </label>
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
                    layoutId="activeRoleTab"
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
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white py-2 rounded-full font-medium hover:bg-slate-900 transition-colors">
          
          Create account
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-6">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-slate-800 hover:text-slate-900 font-medium">
          
          Sign in
        </Link>
      </p>
    </AuthLayout>);

}