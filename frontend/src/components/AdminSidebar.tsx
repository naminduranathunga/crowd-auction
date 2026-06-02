import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Gavel } from 'lucide-react';
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
  return (
    <div className="w-20 glass-card-subtle border-r border-white/30 flex flex-col items-center py-6 gap-4">
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
    </div>);

}