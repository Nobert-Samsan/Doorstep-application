import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import JobRequests from './JobRequests';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheck, Clock, MapPin, Wrench } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/worker/dashboard');
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard', error);
      }
    };
    fetchDashboard();
  }, []);

  const name = user ? `${user.firstName} ${user.lastName}` : 'Worker';
  const workerId = user && (user._id || user.id) ? (user._id || user.id).slice(-6).toUpperCase() : '---';
  const district = user ? user.district : 'Not specified';
  const approvalStatus = data?.profile?.approvalStatus || 'pending';
  
  // Try to safely extract services if they exist
  let servicesList = 'No services listed';
  if (data?.profile?.services && data.profile.services.length > 0) {
    servicesList = data.profile.services.map(s => s.serviceTitle).join(', ');
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sidebar to-gray-900 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-lg relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-gray-700" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold border-2 border-gray-600">
                {name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold mb-1">Welcome back, {name}!</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mt-2">
                <span className="bg-gray-800 px-2.5 py-1 rounded-md font-mono text-xs border border-gray-700">ID: #{workerId}</span>
                <span className="flex items-center gap-1 bg-gray-800/50 px-2.5 py-1 rounded-md"><MapPin size={14} /> {district}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 md:items-end w-full md:w-auto mt-4 md:mt-0">
            <div className="flex items-center gap-2 flex-wrap md:justify-end">
              <span className="text-sm text-gray-400">Services:</span>
              <span className="flex items-center gap-1.5 text-sm font-medium bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700 shadow-sm"><Wrench size={12} className="text-gray-400" /> {servicesList}</span>
            </div>
            
            {/* Status Indicator */}
            {approvalStatus === 'approved' ? (
              <div className="flex items-center gap-1.5 text-green-400 text-sm font-medium mt-1 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
                <ShieldCheck size={16} /> Verified & Active
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-400 text-sm font-medium mt-1 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20">
                <Clock size={16} /> Pending Approval
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-primary">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card-bg p-4 rounded-lg shadow-sm border border-border">
          <h3 className="text-text-secondary text-sm font-medium">Month Net Earnings</h3>
          <p className="text-3xl font-bold mt-2 text-text-primary">Rs. {((data?.stats?.monthEarnings || 0) * 0.9).toFixed(2)}</p>
        </div>
        <div className="bg-card-bg p-4 rounded-lg shadow-sm border border-border">
          <h3 className="text-text-secondary text-sm font-medium">Jobs Completed</h3>
          <p className="text-3xl font-bold mt-2">{data?.stats?.jobsCompleted || 0}</p>
        </div>
        <div className="bg-card-bg p-4 rounded-lg shadow-sm border border-border">
          <h3 className="text-text-secondary text-sm font-medium">Average Rating</h3>
          <p className="text-3xl font-bold mt-2">{data?.stats?.avgRating || 0}</p>
        </div>
        <div className="bg-card-bg p-4 rounded-lg shadow-sm border border-danger">
          <h3 className="text-danger text-sm font-medium">Commission Due</h3>
          <p className="text-3xl font-bold mt-2 text-danger">Rs. {Number(data?.stats?.commissionDue || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-12">
        <JobRequests />
      </div>
    </div>
  );
};

export default Dashboard;
