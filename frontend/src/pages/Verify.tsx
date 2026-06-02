import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Mail } from 'lucide-react';
export function Verify() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/auctions');
  };
  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-white/40 backdrop-blur-sm border border-white/60 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-slate-800" />
        </div>
        <h2 className="text-xl font-medium text-slate-800 mb-2">
          Check your email
        </h2>
        <p className="text-sm text-slate-600">
          We've sent a 6-digit verification code to your email address
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            placeholder="000000"
            className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl text-slate-800 placeholder-slate-400 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-slate-800/30 focus:border-slate-800/40 transition-colors"
            style={{
              fontFamily: 'JetBrains Mono, monospace'
            }}
            required />
          
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white py-2 rounded-full font-medium hover:bg-slate-900 transition-colors">
          
          Verify
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-4">
        Didn't receive a code?{' '}
        <button className="text-slate-800 hover:text-slate-900 font-medium">
          Resend
        </button>
      </p>
    </AuthLayout>);

}