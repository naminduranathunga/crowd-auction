import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
import { Plus, Minus, ArrowDown, ArrowUp, Lock, Unlock, ArrowLeftRight } from 'lucide-react';
import { TopUpModal } from '../components/TopUpModal';
import { WithdrawModal } from '../components/WithdrawModal';
import { useAuth } from '../hooks/useAuth';
import { getWalletDetails, getTransactionHistory, WalletDto, TransactionDto } from '../services/walletApi';

export function WalletDashboard() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletDto | null>(null);
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const fetchWalletData = useCallback(async () => {
    if (!user) return;
    try {
      const [walletDetails, txHistory] = await Promise.all([
        getWalletDetails(user.id),
        getTransactionHistory(user.id)
      ]);
      setWallet(walletDetails);
      setTransactions(txHistory);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load wallet data. Please make sure the wallet service is running.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const getTransactionIcon = (type: TransactionDto['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDown className="w-4 h-4 text-emerald-700" />;
      case 'WITHDRAWAL':
        return <ArrowUp className="w-4 h-4 text-rose-700" />;
      case 'RESERVE':
        return <Lock className="w-4 h-4 text-amber-700" />;
      case 'RELEASE':
        return <Unlock className="w-4 h-4 text-emerald-700" />;
      case 'DEDUCT':
        return <ArrowLeftRight className="w-4 h-4 text-slate-700" />;
      case 'REFUND':
        return <ArrowDown className="w-4 h-4 text-emerald-700" />;
      default:
        return null;
    }
  };

  const getTransactionAmountSignAndColor = (tx: TransactionDto) => {
    switch (tx.type) {
      case 'DEPOSIT':
      case 'RELEASE':
      case 'REFUND':
        return { sign: '+', colorClass: 'text-emerald-700' };
      case 'WITHDRAWAL':
      case 'RESERVE':
      case 'DEDUCT':
        return { sign: '-', colorClass: 'text-slate-800' };
      default:
        return { sign: '', colorClass: 'text-slate-800' };
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' ' + date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-800"></div>
        </div>
      </div>
    );
  }

  // Calculate values
  const totalBalance = wallet ? wallet.balance : 0;
  const escrowBalance = wallet ? wallet.reservedBalance : 0;
  const availableBalance = totalBalance - escrowBalance;

  const isSeller = user?.roles?.includes('ROLE_SELLER') || user?.roles?.includes('SELLER');

  const displayedTransactions = isSeller
    ? transactions.filter(tx => tx.type === 'DEPOSIT' || tx.type === 'WITHDRAWAL')
    : transactions;

  return (
    <div className="min-h-screen">
      <TopNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          My Wallet
        </h1>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-700 text-sm rounded-2xl mb-8 flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => { setLoading(true); fetchWalletData(); }} 
              className="px-4 py-2 bg-red-600 text-white rounded-full text-xs font-semibold hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        <div className={`grid gap-6 mb-8 ${isSeller ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          <div className="glass-card rounded-3xl p-6 shadow-sm border border-white/40">
            <p className="text-sm text-slate-600 mb-2">
              {isSeller ? 'Total Earnings (Available for Withdrawal)' : `Available Balance (Total: $${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })})`}
            </p>
            <p className="text-4xl font-bold font-mono text-slate-800">
              ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          {!isSeller && (
            <div className="glass-card rounded-3xl p-6 shadow-sm border border-white/40">
              <p className="text-sm text-slate-600 mb-2">In Escrow</p>
              <p className="text-4xl font-bold font-mono text-slate-800">
                ${escrowBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <Link
                to="/wallet/escrow"
                className="text-sm text-slate-700 hover:text-slate-900 mt-2 inline-block font-medium">
                View holdings →
              </Link>
            </div>
          )}
        </div>

        <div className="flex gap-4 mb-8">
          {!isSeller && (
            <button
              onClick={() => setShowTopUp(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-full font-medium hover:bg-slate-900 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Top up wallet
            </button>
          )}
          
          <button
            onClick={() => setShowWithdraw(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white/60 text-slate-800 border border-slate-300 rounded-full font-medium hover:bg-white/80 transition-colors shadow-sm">
            <Minus className="w-4 h-4" />
            Withdraw funds
          </button>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden shadow-sm border border-white/40">
          <div className="p-6 border-b border-white/40">
            <h2 className="text-lg font-semibold text-slate-800">
              Transaction History
            </h2>
          </div>
          
          {displayedTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-white/30">
              {displayedTransactions.map((tx, idx) => {
                const { sign, colorClass } = getTransactionAmountSignAndColor(tx);
                
                // Customize description for seller
                let displayDescription = tx.description;
                if (isSeller) {
                  if (tx.type === 'DEPOSIT') {
                    if (tx.description.toLowerCase().startsWith('deposit')) {
                      const itemPart = tx.description.replace(/^[Dd]eposit\s+(for\s+|via\s+)?/, '');
                      if (itemPart && itemPart.toLowerCase() !== 'sandbox') {
                        displayDescription = `Earnings from ${itemPart}`;
                      } else {
                        displayDescription = 'Earnings from Item';
                      }
                    }
                  } else if (tx.type === 'WITHDRAWAL') {
                    if (tx.description.toLowerCase().includes('withdrawal')) {
                      displayDescription = 'Transfer to Bank';
                    }
                  }
                }

                return (
                  <div
                    key={tx.id}
                    className={`flex items-center justify-between p-4 ${idx % 2 === 1 ? 'bg-white/20' : ''}`}>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/50 backdrop-blur-sm border border-white/60 rounded-full flex items-center justify-center shadow-sm">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {displayDescription}
                        </p>
                        <p className="text-sm text-slate-600">
                          {formatDateTime(tx.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <p className={`font-mono font-bold ${colorClass}`}>
                      {sign}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <TopUpModal 
        isOpen={showTopUp} 
        onClose={() => setShowTopUp(false)} 
        onSuccess={fetchWalletData}
      />
      
      <WithdrawModal 
        isOpen={showWithdraw} 
        onClose={() => setShowWithdraw(false)} 
        onSuccess={fetchWalletData}
        availableBalance={availableBalance}
      />
    </div>
  );
}