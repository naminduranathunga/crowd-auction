import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Gavel, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
{
  path: '/admin',
  icon: LayoutDashboard,
  label: 'Dashboard'
},
{
  path: '/admin/users',
  icon: Users,
  label: 'Users'
},
{
  path: '/admin/audit',
  icon: FileText,
  label: 'Audit Logs'
}];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-20 glass-card-subtle border-r border-white/30 flex flex-col items-center py-6 gap-4 min-h-screen">
      <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-md">
        <Gavel className="w-5 h-5 text-white" />
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isActive ? 'bg-slate-800/15 backdrop-blur-sm text-slate-800' : 'text-slate-600 hover:bg-white/40'}`}
            title={item.label}>
            <Icon className="w-5 h-5" />
          </Link>);
      })}

      {/* Spacer to push logout to bottom */}
      <div className="flex-1" />

      <button
        onClick={handleLogout}
        title="Sign Out"
        className="w-12 h-12 flex items-center justify-center rounded-2xl text-red-500 hover:bg-red-50 transition-all border border-red-200/50">
        <LogOut className="w-5 h-5" />
      </button>
    </div>);
}