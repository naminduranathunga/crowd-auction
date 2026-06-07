import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Lock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {!submitted ?
        <motion.div
          key="form"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}>
          
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white/40 backdrop-blur-sm border border-white/60 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-slate-800" />
              </div>
              <h2 className="text-xl font-medium text-slate-800 mb-1">
                Reset your password
              </h2>
              <p className="text-sm text-slate-600">
                Enter your email and we'll send you a reset link
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

              <button
              type="submit"
              className="w-full bg-slate-800 text-white py-2 rounded-full font-medium hover:bg-slate-900 transition-colors">
              
                Send reset link
              </button>
            </form>

            <p className="text-center text-sm text-slate-600 mt-4">
              <Link
              to="/login"
              className="text-slate-800 hover:text-slate-900 font-medium">
              
                Back to login
              </Link>
            </p>
          </motion.div> :

        <motion.div
          key="success"
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          className="text-center">
          
            <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-700" />
            </div>
            <h2 className="text-xl font-medium text-slate-800 mb-2">
              Reset link sent
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Check your inbox for the reset link
            </p>
            <Link
            to="/login"
            className="inline-block bg-slate-800 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-slate-900 transition-colors">
            
              Back to login
            </Link>
          </motion.div>
        }
      </AnimatePresence>
    </AuthLayout>);

}