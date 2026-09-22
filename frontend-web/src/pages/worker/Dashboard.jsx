import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import JobRequests from './JobRequests';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheck, Clock, MapPin, Wrench, Wallet, CheckCircle, Star, AlertCircle } from 'lucide-react';

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
  
  let servicesList = 'No services listed';
  if (data?.profile?.services && data.profile.services.length > 0) {
    servicesList = data.profile.services.map(s => s.serviceTitle).join(', ');
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 shadow-md" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold border-2 border-slate-700 shadow-md">
                {name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight">Welcome back, {name}!</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mt-2">
                <span className="bg-slate-800/80 px-2.5 py-1 rounded-md font-mono text-xs border border-slate-700/50">ID: #{workerId}</span>
                <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50"><MapPin size={14} /> {district}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 md:items-end w-full md:w-auto mt-4 md:mt-0">
            <div className="flex items-center gap-2 flex-wrap md:justify-end">
              <span className="text-sm text-slate-400">Services:</span>
              <span className="flex items-center gap-1.5 text-sm font-medium bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/50 shadow-sm">
                <Wrench size={12} className="text-slate-400" /> {servicesList}
              </span>
            </div>
            
            {approvalStatus === 'approved' ? (
              <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium mt-1 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
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

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Month Net Earnings</h3>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Wallet size={20} /></div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">Rs. {((data?.stats?.monthEarnings || 0) * 0.9).toFixed(2)}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Jobs Completed</h3>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><CheckCircle size={20} /></div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{data?.stats?.jobsCompleted || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Average Rating</h3>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-500"><Star size={20} fill="currentColor" /></div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{data?.stats?.avgRating || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-red-50 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -z-10"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-red-600 text-sm font-medium">Commission Due</h3>
            <div className="p-2 bg-red-100 rounded-lg text-red-600"><AlertCircle size={20} /></div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-red-600">Rs. {Number(data?.stats?.commissionDue || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Incoming Job Requests</h2>
        </div>
        <div className="p-1 sm:p-5">
          <JobRequests />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
