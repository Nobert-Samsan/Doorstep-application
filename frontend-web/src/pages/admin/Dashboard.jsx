import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    activeWorkers: 0,
    pendingApprovals: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load admin dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  const safeStats = stats || {
    totalRevenue: 0,
    totalCustomers: 0,
    activeWorkers: 0,
    pendingApprovals: 0,
    recentTransactions: []
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue (10% Cut)</h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">Rs. {(safeStats.totalRevenue || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Customers</h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">{safeStats.totalCustomers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Active Workers</h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">{safeStats.activeWorkers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-warning">
          <h3 className="text-gray-500 text-sm font-medium">Pending Approvals</h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">{safeStats.pendingApprovals || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Recent Transactions</h3>
          <div className="space-y-4">
            {(!safeStats.recentTransactions || safeStats.recentTransactions.length === 0) ? (
              <p className="text-gray-500 text-sm">No transactions yet.</p>
            ) : (
              safeStats.recentTransactions.map(tx => (
                <div key={tx._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium text-sm">{tx.bookingId ? tx.bookingId.serviceTitle : 'Service Fee'}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="font-bold text-success">+Rs. {tx.commissionAmount}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">System Alerts</h3>
          <div className="space-y-4">
            {safeStats.pendingApprovals > 0 && (
              <div className="bg-amber-50 text-amber-800 p-3 rounded border border-amber-200 text-sm">
                <strong>Action Required:</strong> {safeStats.pendingApprovals} new worker(s) pending approval.
              </div>
            )}
            <div className="bg-blue-50 text-info p-3 rounded border border-blue-100 text-sm">
              <strong>System:</strong> All services are running smoothly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
