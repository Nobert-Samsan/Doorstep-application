import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Dark theme for Admin */}
      <aside className="w-64 bg-gray-900 text-white hidden md:block">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-accent">DoorStep</h2>
          <p className="text-sm mt-1 text-gray-400">Admin Portal</p>
        </div>
        <div className="p-4">
          <nav className="space-y-2 mt-4">
            <Link to="/admin/dashboard" className="block px-4 py-2 rounded text-gray-300 hover:bg-gray-800 hover:text-white">Overview</Link>
            <Link to="/admin/approvals" className="block px-4 py-2 rounded text-gray-300 hover:bg-gray-800 hover:text-white">
              Worker Approvals <span className="bg-danger text-white text-xs px-2 py-0.5 rounded-full ml-2">3</span>
            </Link>
            <Link to="/admin/users" className="block px-4 py-2 rounded text-gray-300 hover:bg-gray-800 hover:text-white">Users Directory</Link>
            <Link to="/admin/categories" className="block px-4 py-2 rounded text-gray-300 hover:bg-gray-800 hover:text-white">Categories</Link>
            <Link to="/admin/disputes" className="block px-4 py-2 rounded text-gray-300 hover:bg-gray-800 hover:text-white">Disputes</Link>
            
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 rounded text-red-400 hover:bg-gray-800 mt-8">Logout</button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">Admin Control Center</h1>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">A</div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
