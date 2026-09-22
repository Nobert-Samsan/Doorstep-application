import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Earnings = () => {
  const [data, setData] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    commissionDue: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await api.get('/worker/earnings');
        setData(res.data.data);
      } catch (error) {
        toast.error('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading financials...</div>;

  const safeData = data || { totalEarnings: 0, monthlyEarnings: 0, commissionDue: 0, transactions: [] };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Earnings & Commission</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-primary text-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-white/80">Net Earnings (All Time)</h3>
          <p className="text-3xl font-bold mt-2">Rs. {(safeData.totalEarnings * 0.9 || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white border border-border p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-text-secondary">This Month's Net Earnings</h3>
          <p className="text-3xl font-bold mt-2 text-text-primary">Rs. {(safeData.monthlyEarnings * 0.9 || 0).toFixed(2)}</p>
        </div>
        <div className="bg-red-50 border border-danger p-6 rounded-lg shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-danger">Commission Due (10%)</h3>
            <p className="text-3xl font-bold mt-2 text-danger">Rs. {(safeData.commissionDue || 0).toFixed(2)}</p>
          </div>
          <button className="mt-4 bg-danger text-white py-2 px-4 rounded font-medium hover:bg-red-700 transition-colors" disabled={!safeData.commissionDue || safeData.commissionDue <= 0}>
            Pay Commission Now
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-bold text-lg text-text-primary">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-amber-50 text-text-secondary text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Job Amount</th>
                <th className="px-6 py-4 font-medium text-danger">Commission (10%)</th>
                <th className="px-6 py-4 font-medium text-success">Net Earnings</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {safeData.transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No transactions found.</td>
                </tr>
              ) : (
                safeData.transactions.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium">{t.description}</td>
                    <td className="px-6 py-4">Rs. {(t.jobAmount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-danger">-Rs. {Number(t.commissionAmount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-success font-bold">Rs. {Number((t.jobAmount || 0) - (t.commissionAmount || 0)).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${t.status === 'UNPAID' ? 'bg-red-100 text-danger' : 'bg-green-100 text-success'}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
