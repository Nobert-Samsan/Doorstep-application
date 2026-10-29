import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  X,
  User,
  Envelope,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  IdentificationCard,
  CheckCircle,
  XCircle,
  Eye
} from '@phosphor-icons/react';

const WorkerApprovals = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchWorkers = async () => {
    try {
      const res = await api.get('/admin/workers');
      // A worker is pending approval if approvalStatus is 'pending' OR isApproved is false
      const pending = (res.data?.data || []).filter(
        (w) => w.approvalStatus === 'pending' || w.isApproved === false
      );
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
      if (selectedWorker?._id === id) {
        setSelectedWorker(null);
      }
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
      if (selectedWorker?._id === id) {
        setSelectedWorker(null);
      }
      fetchWorkers();
    } catch (err) {
      toast.error('Failed to reject worker');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading pending approvals...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Worker Approvals</h2>
          <p className="text-sm text-gray-500 mt-1">
            Review submitted registration details, services, and identification documents before approving.
          </p>
        </div>
        <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
          {workers.length} Pending
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">Applicant</th>
                <th className="px-6 py-3.5">Gender</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Services Offered</th>
                <th className="px-6 py-3.5">Applied On</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {workers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No pending worker approvals at this time.
                  </td>
                </tr>
              ) : (
                workers.map((worker) => {
                  const servicesCount = worker.services?.length || 0;
                  const firstService = worker.services?.[0]?.serviceTitle || 'General';

                  return (
                    <tr key={worker._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                            {worker.firstName ? worker.firstName[0].toUpperCase() : 'W'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {worker.firstName} {worker.lastName}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {worker.phone || worker.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 capitalize">
                        {worker.gender || '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {worker.district ? `${worker.city ? `${worker.city}, ` : ''}${worker.district}` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 text-xs font-medium">
                          {firstService}
                          {servicesCount > 1 && (
                            <span className="text-gray-500 font-normal">+{servicesCount - 1} more</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(worker.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedWorker(worker)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <Eye size={14} />
                            View All Details
                          </button>
                          <button
                            onClick={() => handleApprove(worker._id)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-black hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(worker._id)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL DETAILS MODAL */}
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
                    Registration ID: {selectedWorker._id}
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Close
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleReject(selectedWorker._id)}
                  className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => handleApprove(selectedWorker._id)}
                  className="px-5 py-2 text-sm font-semibold text-white bg-black hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  Approve Worker
                </button>
              </div>
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

export default WorkerApprovals;
