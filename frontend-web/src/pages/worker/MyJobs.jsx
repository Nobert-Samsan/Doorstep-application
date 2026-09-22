import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const MyJobs = () => {
  const [activeTab, setActiveTab] = useState('All Jobs');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/bookings');
        setJobs(data.data);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'in_progress': return 'border-l-4 border-info bg-blue-50 text-info';
      case 'completed': return 'border-l-4 border-success bg-green-50 text-success';
      case 'accepted': return 'border-l-4 border-primary bg-amber-50 text-primary';
      default: return 'border-l-4 border-gray-400 bg-gray-50 text-gray-700';
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'All Jobs') return true;
    if (activeTab === 'Active') {
      return ['in_progress', 'accepted', 'en_route', 'arrived', 'quote_provided'].includes(job.status);
    }
    if (activeTab === 'Completed') return job.status === 'completed';
    return true;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">My Active & Past Jobs</h2>
      
      <div className="flex space-x-4 mb-6 border-b border-border">
        <button 
          onClick={() => setActiveTab('All Jobs')}
          className={`pb-2 border-b-2 font-medium ${activeTab === 'All Jobs' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
        >
          All Jobs
        </button>
        <button 
          onClick={() => setActiveTab('Active')}
          className={`pb-2 border-b-2 font-medium ${activeTab === 'Active' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
        >
          Active
        </button>
        <button 
          onClick={() => setActiveTab('Completed')}
          className={`pb-2 border-b-2 font-medium ${activeTab === 'Completed' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
        >
          Completed
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading your jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No {activeTab.toLowerCase()} found.
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job._id} className="bg-white rounded-lg shadow-sm border border-border flex flex-col md:flex-row overflow-hidden">
              <div className={`w-2 md:w-auto md:w-1 ${getStatusStyle(job.status).split(' ')[0]}`}></div>
              <div className="p-5 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg text-text-primary">{job.serviceTitle}</h3>
                  <p className="text-sm text-text-secondary">Customer: {job.customerId?.firstName} {job.customerId?.lastName} • {new Date(job.scheduledDate).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col md:items-end w-full md:w-auto gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold inline-block w-fit ${getStatusStyle(job.status).replace('border-l-4 border-', '')}`}>
                    {job.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <Link to={`/worker/jobs/${job._id}`} className="text-center px-4 py-1.5 border border-primary text-primary rounded text-sm hover:bg-light-accent w-full md:w-auto">
                    Manage Job
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyJobs;
