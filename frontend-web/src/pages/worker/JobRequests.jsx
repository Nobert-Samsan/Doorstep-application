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
      <h2 className="text-2xl font-bold text-text-primary mb-6">Incoming Job Requests</h2>
      
      {requests.length === 0 ? (
        <div className="bg-white rounded-lg border border-border p-8 text-center">
          <p className="text-text-secondary">No new job requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request._id} className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-text-primary">{request.serviceTitle}</h3>
                    {request.urgency === 'urgent' && <span className="bg-red-100 text-danger text-xs px-2 py-0.5 rounded font-bold uppercase">Urgent</span>}
                  </div>
                  <p className="text-sm text-text-secondary">
                    Customer: {request.customerId?.firstName} {request.customerId?.lastName} • {request.city || 'Location N/A'}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    🕒 {new Date(request.scheduledDate).toLocaleDateString()} | {request.scheduledTimeSlot}
                  </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <Link to={`/worker/jobs/${request._id}?from=dashboard`} className="flex-1 md:flex-none text-center px-4 py-2 border border-primary text-primary font-medium rounded hover:bg-light-accent">View Details</Link>
                  <button onClick={() => handleAccept(request._id)} className="flex-1 md:flex-none px-4 py-2 bg-success text-white font-medium rounded hover:bg-green-700">Accept</button>
                  <button onClick={() => handleDecline(request._id)} className="flex-1 md:flex-none px-4 py-2 border border-danger text-danger font-medium rounded hover:bg-red-50">Decline</button>
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
