import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl shadow-xl w-full max-w-sm pointer-events-auto overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-500/20' : 'bg-slate-800/10'}`}>
                    <AlertTriangle className={`w-5 h-5 ${isDestructive ? 'text-red-600' : 'text-slate-700'}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
                </div>
                <p className="text-slate-600 mb-8">{message}</p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onCancel}
                    className="px-5 py-2 rounded-full font-medium text-slate-600 bg-slate-200/50 hover:bg-slate-200 transition-colors"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`px-5 py-2 rounded-full font-medium text-white transition-colors ${
                      isDestructive 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
