import React, { useState } from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { Search, Pencil, CircleSlash } from 'lucide-react';
const mockUsers = [
{
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'buyer' as const,
  status: 'active' as const,
  joined: '2026-01-15',
  initials: 'JD'
},
{
  id: 2,
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  role: 'seller' as const,
  status: 'active' as const,
  joined: '2026-02-20',
  initials: 'JS'
},
{
  id: 3,
  name: 'Bob Wilson',
  email: 'bob.wilson@example.com',
  role: 'buyer' as const,
  status: 'suspended' as const,
  joined: '2026-03-10',
  initials: 'BW'
},
{
  id: 4,
  name: 'Alice Brown',
  email: 'alice.brown@example.com',
  role: 'admin' as const,
  status: 'active' as const,
  joined: '2025-12-05',
  initials: 'AB'
}];

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const getRoleBadge = (role: string) => {
    const styles = {
      buyer: 'bg-slate-800/15 text-slate-800 border-slate-800/20',
      seller: 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30',
      admin: 'bg-purple-500/20 text-purple-800 border-purple-500/30'
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[role as keyof typeof styles]}`}>
        
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>);

  };
  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${status === 'active' ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30' : 'bg-red-500/20 text-red-800 border-red-500/30'}`}>
        
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>);

  };
  const inputClass =
  'px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-full text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800/30';
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">Users</h1>

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-white/40 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className={`${inputClass} w-full pl-11`} />
              
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={inputClass}>
              
              <option value="all">All Roles</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/30 border-b border-white/40">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">
                    User
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">
                    Role
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">
                    Joined
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                {mockUsers.map((user) =>
                <tr
                  key={user.id}
                  className="hover:bg-white/30 transition-colors">
                  
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800/15 backdrop-blur-sm border border-slate-800/20 rounded-full flex items-center justify-center text-slate-800 font-semibold text-sm">
                          {user.initials}
                        </div>
                        <span className="font-medium text-slate-800">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.joined}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-700 hover:text-slate-900 hover:bg-white/50 rounded-full transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                        className={`p-2 rounded-full transition-colors ${user.status === 'active' ? 'text-red-700 hover:text-red-800 hover:bg-red-500/20' : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-500/20'}`}>
                        
                          <CircleSlash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>);

}