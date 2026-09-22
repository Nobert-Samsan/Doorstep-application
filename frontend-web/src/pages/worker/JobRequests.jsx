import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const JobRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/worker/job-requests');
      setRequests(res.data.data);
    } catch (error) {
      toast.error('Failed to load job requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await api.put(`/bookings/${id}/accept`);
      toast.success('Job request accepted successfully!');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept job');
    }
  };

  const handleDecline = async (id) => {
    try {
      await api.put(`/bookings/${id}/decline`, { reason: 'Schedule conflict' });
      toast.info('Job request declined.');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to decline job');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading incoming requests...</div>;

  return (
    <div>
      {requests.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center border border-gray-100 border-dashed">
          <p className="text-gray-500">No new job requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition-colors overflow-hidden">
              <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900">{request.serviceTitle}</h3>
                    {request.urgency === 'urgent' && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Urgent</span>}
                  </div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Customer:</span> {request.customerId?.firstName} {request.customerId?.lastName} &bull; {request.city || 'Location N/A'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <Clock size={14} className="text-gray-400" /> {new Date(request.scheduledDate).toLocaleDateString()} | {request.scheduledTimeSlot}
                  </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <Link to={`/worker/jobs/${request._id}?from=dashboard`} className="flex-1 md:flex-none text-center px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">View Details</Link>
                  <button onClick={() => handleAccept(request._id)} className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">Accept</button>
                  <button onClick={() => handleDecline(request._id)} className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors">Decline</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobRequests;
