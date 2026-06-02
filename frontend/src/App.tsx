import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Verify } from './pages/Verify';
import { ForgotPassword } from './pages/ForgotPassword';
import { AuctionBrowse } from './pages/AuctionBrowse';
import { ItemDetail } from './pages/ItemDetail';
import { MyBids } from './pages/MyBids';
import { WalletDashboard } from './pages/WalletDashboard';
import { EscrowHoldings } from './pages/EscrowHoldings';
import { SellerListings } from './pages/SellerListings';
import { CreateListing } from './pages/CreateListing';
import { EditListing } from './pages/EditListing';
import { BidHistory } from './pages/BidHistory';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagement } from './pages/UserManagement';
import { AuditLog } from './pages/AuditLog';
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auctions" element={<AuctionBrowse />} />
        <Route path="/auctions/:id" element={<ItemDetail />} />
        <Route path="/my-bids" element={<MyBids />} />
        <Route path="/wallet" element={<WalletDashboard />} />
        <Route path="/wallet/escrow" element={<EscrowHoldings />} />
        <Route path="/seller/listings" element={<SellerListings />} />
        <Route path="/seller/listings/new" element={<CreateListing />} />
        <Route path="/seller/listings/:id/edit" element={<EditListing />} />
        <Route path="/seller/listings/:id/bids" element={<BidHistory />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/audit" element={<AuditLog />} />
      </Routes>
    </BrowserRouter>);

}