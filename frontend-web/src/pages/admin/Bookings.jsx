import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  MagnifyingGlass,
  Eye,
  X,
  User,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  CurrencyDollar,
  Receipt,
  CheckCircle,
  ClockCounterClockwise
} from '@phosphor-icons/react';

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      setBookings(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in_progress':
      case 'quote_provided':
      case 'en_route':
      case 'arrived':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'accepted':
      case 'pending':
      case 'broadcast':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'complaint':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCommissionBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800';
      case 'due':
        return 'bg-amber-100 text-amber-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    const service = (b.serviceTitle || '').toLowerCase();
    const customerName = `${b.customerId?.firstName || ''} ${b.customerId?.lastName || ''}`.toLowerCase();
    const workerName = `${b.workerId?.firstName || ''} ${b.workerId?.lastName || ''}`.toLowerCase();
    const bookingId = (b._id || '').toLowerCase();
    const location = `${b.city || ''} ${b.district || ''}`.toLowerCase();

    const matchesSearch =
      service.includes(q) ||
      customerName.includes(q) ||
      workerName.includes(q) ||
      bookingId.includes(q) ||
      location.includes(q);

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Bookings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Complete history of customer requests, assigned workers, job statuses, and platform commissions
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="px-3.5 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors w-fit"
        >
          Refresh
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {st === 'all' ? 'All' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by ID, customer, worker, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <MagnifyingGlass size={15} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading bookings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Booking / Service</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Assigned Worker</th>
                  <th className="px-5 py-3.5">Scheduled Date</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Job Amount</th>
                  <th className="px-5 py-3.5">Platform Commission (10%)</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((b) => {
                  const jobAmount = b.finalAmount || b.fixedRate || 0;
                  const commAmount = b.commission?.amount ?? (jobAmount > 0 ? Math.round(jobAmount * 0.1) : 0);
                  const commStatus = b.commission?.status || (b.status === 'completed' ? 'due' : 'pending');

                  return (
                    <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Service & ID */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{b.serviceTitle || 'General Service'}</p>
                        <p className="text-xs text-gray-400 font-mono">
                          #{b._id.substring(b._id.length - 8).toUpperCase()}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        {b.customerId ? (
                          <div>
                            <p className="font-semibold text-gray-900 text-xs">
                              {b.customerId.firstName} {b.customerId.lastName}
                            </p>
                            <p className="text-[11px] text-gray-500 font-mono">
                              {b.customerId.phone || b.customerId.email || '—'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Worker */}
                      <td className="px-5 py-4">
                        {b.workerId ? (
                          <div>
                            <p className="font-semibold text-gray-900 text-xs">
                              {b.workerId.firstName} {b.workerId.lastName}
                            </p>
                            <p className="text-[11px] text-gray-500 font-mono">
                              {b.workerId.phone || '—'}
                            </p>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-500">
                            Not assigned
                          </span>
                        )}
                      </td>

                      {/* Scheduled Date */}
                      <td className="px-5 py-4 text-xs text-gray-600">
                        <p className="font-medium text-gray-900">
                          {b.scheduledDate ? new Date(b.scheduledDate).toLocaleDateString() : '—'}
                        </p>
                        <p className="text-[11px] text-gray-500">{b.scheduledTimeSlot || ''}</p>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4 text-xs text-gray-600">
                        {b.district ? `${b.city ? `${b.city}, ` : ''}${b.district}` : '—'}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${getStatusBadge(
                            b.status
                          )}`}
                        >
                          {b.status?.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Job Amount */}
                      <td className="px-5 py-4 text-xs">
                        {jobAmount > 0 ? (
                          <p className="font-bold text-gray-900">Rs. {jobAmount.toLocaleString()}</p>
                        ) : (
                          <p className="text-gray-400 italic">Quote pending</p>
                        )}
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">
                          {b.paymentStatus || 'unpaid'}
                        </span>
                      </td>

                      {/* Commission Column */}
                      <td className="px-5 py-4 text-xs">
                        {commAmount > 0 ? (
                          <div className="flex flex-col items-start gap-1">
                            <span className="font-bold text-[#FF7A00]">
                              Rs. {commAmount.toLocaleString()}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${getCommissionBadge(
                                commStatus
                              )}`}
                            >
                              {commStatus}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Rs. 0</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                      No bookings found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-8">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {selectedBooking.serviceTitle}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${getStatusBadge(
                      selectedBooking.status
                    )}`}
                  >
                    {selectedBooking.status?.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Booking ID: {selectedBooking._id}
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Customer & Worker Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Card */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2 text-gray-600 font-bold text-xs uppercase tracking-wider">
                    <User size={15} /> Customer Details
                  </div>
                  {selectedBooking.customerId ? (
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-gray-900">
                        {selectedBooking.customerId.firstName} {selectedBooking.customerId.lastName}
                      </p>
                      <p className="text-xs text-gray-600">Phone: {selectedBooking.customerId.phone || '—'}</p>
                      <p className="text-xs text-gray-600">Email: {selectedBooking.customerId.email || '—'}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Customer details not available</p>
                  )}
                </div>

                {/* Worker Card */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2 text-gray-600 font-bold text-xs uppercase tracking-wider">
                    <Briefcase size={15} /> Assigned Worker
                  </div>
                  {selectedBooking.workerId ? (
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-gray-900">
                        {selectedBooking.workerId.firstName} {selectedBooking.workerId.lastName}
                      </p>
                      <p className="text-xs text-gray-600">Phone: {selectedBooking.workerId.phone || '—'}</p>
                      <p className="text-xs text-gray-600">Email: {selectedBooking.workerId.email || '—'}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-600 italic">No worker assigned yet</p>
                  )}
                </div>
              </div>

              {/* Schedule & Location */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Schedule & Location
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 block">Date & Time Slot</span>
                    <span className="font-semibold text-gray-900">
                      {selectedBooking.scheduledDate
                        ? new Date(selectedBooking.scheduledDate).toLocaleDateString()
                        : '—'}{' '}
                      ({selectedBooking.scheduledTimeSlot || 'Flexible'})
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Urgency</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {selectedBooking.urgency || 'Normal'}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs text-gray-500 block">Address</span>
                    <span className="font-semibold text-gray-900">
                      {selectedBooking.streetAddress ? `${selectedBooking.streetAddress}, ` : ''}
                      {selectedBooking.city ? `${selectedBooking.city}, ` : ''}
                      {selectedBooking.district || '—'}
                    </span>
                    {selectedBooking.landmark && (
                      <p className="text-xs text-gray-500 mt-1">Landmark: {selectedBooking.landmark}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Job Description
                </h4>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedBooking.jobDescription || 'No description provided.'}
                </div>
              </div>

              {/* Financial & Commission Details */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Pricing & Platform Commission
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 block">Pricing Model</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {selectedBooking.pricingType || 'Variable'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Job Total</span>
                    <span className="font-bold text-gray-900">
                      {selectedBooking.finalAmount
                        ? `Rs. ${selectedBooking.finalAmount.toLocaleString()}`
                        : selectedBooking.fixedRate
                        ? `Rs. ${selectedBooking.fixedRate.toLocaleString()}`
                        : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Platform Commission</span>
                    <span className="font-bold text-[#FF7A00]">
                      Rs.{' '}
                      {(
                        selectedBooking.commission?.amount ??
                        Math.round((selectedBooking.finalAmount || selectedBooking.fixedRate || 0) * 0.1)
                      ).toLocaleString()}{' '}
                      <span className="text-[11px] font-normal text-gray-500">(10%)</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Commission Status</span>
                    <span
                      className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${getCommissionBadge(
                        selectedBooking.commission?.status ||
                          (selectedBooking.status === 'completed' ? 'due' : 'pending')
                      )}`}
                    >
                      {selectedBooking.commission?.status ||
                        (selectedBooking.status === 'completed' ? 'due' : 'pending')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2 text-sm font-semibold text-white bg-black hover:bg-neutral-800 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManagement;
