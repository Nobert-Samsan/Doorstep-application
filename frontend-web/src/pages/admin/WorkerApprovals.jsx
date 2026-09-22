import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const WorkerApprovals = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkers = async () => {
    try {
      const res = await api.get('/admin/workers');
      // Filter out approved workers locally (or we could do it in the backend)
      const pending = res.data.data.filter(w => w.isApproved === false);
      setWorkers(pending);
    } catch (err) {
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/workers/${id}/approve`);
      toast.success('Worker successfully approved!');
      fetchWorkers();
    } catch (err) {
      toast.error('Failed to approve worker');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject and remove this worker?')) return;
    try {
      await api.put(`/admin/workers/${id}/reject`);
      toast.info('Worker application rejected.');
      fetchWorkers();
    } catch (err) {
      toast.error('Failed to reject worker');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading pending approvals...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Worker Approvals</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Applicant</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Applied On</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {workers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No pending worker approvals at this time.</td>
                </tr>
              ) : (
                workers.map(worker => (
                  <tr key={worker._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {worker.firstName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{worker.firstName} {worker.lastName}</p>
                          <p className="text-xs text-gray-500">ID: {worker._id.substring(worker._id.length - 6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{worker.email}</td>
                    <td className="px-6 py-4 text-gray-600">{worker.phone}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(worker.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleApprove(worker._id)} className="text-success font-medium hover:underline mr-4">Approve</button>
                      <button onClick={() => handleReject(worker._id)} className="text-danger font-medium hover:underline">Reject</button>
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

export default WorkerApprovals;
