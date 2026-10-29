import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  X,
  Briefcase,
  IdentificationCard,
  Eye,
  MagnifyingGlass
} from '@phosphor-icons/react';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [custRes, workRes] = await Promise.all([
        api.get('/admin/customers'),
        api.get('/admin/workers')
      ]);
      setCustomers(custRes.data?.data || []);
      setWorkers(workRes.data?.data || []);
    } catch (err) {
      toast.error('Failed to load users from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      toast.success(res.data?.message || 'Status updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const list = activeTab === 'customers' ? customers : workers;
  const filteredUsers = list.filter((u) => {
    const q = searchQuery.toLowerCase();
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const phone = (u.phone || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    return fullName.includes(q) || phone.includes(q) || email.includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Directory</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all registered customers and workers</p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-3.5 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'customers'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Customers ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'workers'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Workers ({workers.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <MagnifyingGlass size={15} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading users...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">First Name</th>
                <th className="px-5 py-3.5">Last Name</th>
                <th className="px-5 py-3.5">Gender</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">District</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const isApproved = user.approvalStatus === 'approved' || user.isApproved === true;
                const isActive = user.isActive !== false && !user.isBanned;
                return (
                  <tr key={user._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {user.firstName || '—'}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {user.lastName || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-700 capitalize">
                      {user.gender || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {user.email || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-mono text-xs">
                      {user.phone || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {user.district || '—'}
                    </td>
                    <td className="px-5 py-4">
                      {activeTab === 'workers' ? (
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              isApproved
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {isApproved ? 'Approved' : 'Pending Approval'}
                          </span>
                          {!isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200">
                              Suspended
                            </span>
                          )}
                        </div>
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-600 border border-red-200'
                          }`}
                        >
                          {isActive ? 'Active' : 'Suspended'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {activeTab === 'workers' && (
                          <button
                            onClick={() => setSelectedWorker(user)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <Eye size={13} />
                            Details
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors ${
                            isActive
                              ? 'text-red-600 border-red-200 hover:bg-red-50'
                              : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                          }`}
                        >
                          {isActive ? 'Block / Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No {activeTab} found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* FULL DETAILS MODAL FOR WORKERS */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-base">
                  {selectedWorker.firstName ? selectedWorker.firstName[0].toUpperCase() : 'W'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {selectedWorker.firstName} {selectedWorker.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    User ID: {selectedWorker._id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-xs text-gray-500 block">First Name</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedWorker.firstName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Last Name</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedWorker.lastName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Gender</span>
                    <span className="text-sm font-semibold text-gray-900 capitalize">{selectedWorker.gender || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Date of Birth</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedWorker.dateOfBirth
                        ? new Date(selectedWorker.dateOfBirth).toLocaleDateString()
                        : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Phone</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedWorker.phone || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Email Address</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedWorker.email || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Address & Coverage
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 block">District</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedWorker.district || '—'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">City</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedWorker.city || '—'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Max Travel Distance</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {selectedWorker.maxTravelDistance ? `${selectedWorker.maxTravelDistance} km` : 'Standard'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Street Address</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedWorker.streetAddress || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Services Offered */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Services Offered & Experience
                </h4>
                {selectedWorker.services && selectedWorker.services.length > 0 ? (
                  <div className="space-y-2">
                    {selectedWorker.services.map((srv, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <Briefcase size={18} className="text-gray-500" />
                          <span className="font-semibold text-sm text-gray-900">
                            {srv.serviceTitle}
                          </span>
                        </div>
                        <span className="text-xs font-medium px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-gray-700">
                          {srv.yearsExperience} {srv.yearsExperience === 1 ? 'Year' : 'Years'} Exp.
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No services listed.</p>
                )}
              </div>

              {/* Uploaded Documents */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Verification Documents (NIC Front & Back)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* NIC Front */}
                  <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col items-center justify-center min-h-[160px] text-center">
                    <span className="text-xs font-semibold text-gray-600 mb-2">NIC Front</span>
                    {selectedWorker.documents?.nicFront ? (
                      <img
                        src={selectedWorker.documents.nicFront}
                        alt="NIC Front"
                        className="max-h-40 w-auto object-contain rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setPreviewImage(selectedWorker.documents.nicFront)}
                      />
                    ) : (
                      <div className="text-center p-4">
                        <IdentificationCard size={32} className="mx-auto text-gray-300 mb-1" />
                        <span className="text-xs text-gray-400">Not provided</span>
                      </div>
                    )}
                  </div>

                  {/* NIC Back */}
                  <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col items-center justify-center min-h-[160px] text-center">
                    <span className="text-xs font-semibold text-gray-600 mb-2">NIC Back</span>
                    {selectedWorker.documents?.nicBack ? (
                      <img
                        src={selectedWorker.documents.nicBack}
                        alt="NIC Back"
                        className="max-h-40 w-auto object-contain rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setPreviewImage(selectedWorker.documents.nicBack)}
                      />
                    ) : (
                      <div className="text-center p-4">
                        <IdentificationCard size={32} className="mx-auto text-gray-300 mb-1" />
                        <span className="text-xs text-gray-400">Not provided</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-5 py-2 text-sm font-semibold text-white bg-black hover:bg-neutral-800 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX PREVIEW MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={previewImage}
              alt="Enlarged document preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-sm font-semibold flex items-center gap-1"
            >
              <X size={20} /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
