import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Plus, Trash2, X } from 'lucide-react';

const WorkerJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quotation Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({
    estimatedDuration: '',
    noteToCustomer: '',
    lineItems: [{ description: '', amount: '' }]
  });

  const fetchJob = async () => {
    try {
      const { data } = await api.get(`/bookings/${id}`);
      setJob(data.data);
      
      const qRes = await api.get(`/quotations/booking/${id}`);
      setQuotations(qRes.data.data);
    } catch (error) {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    import('socket.io-client').then(({ io }) => {
      const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      
      socket.on('booking_status_update', (updatedBooking) => {
        if (updatedBooking._id === id) {
          fetchJob();
        }
      });

      socket.on('new_quotation', (quotation) => {
        if (quotation.bookingId === id) {
          fetchJob();
        }
      });

      return () => socket.disconnect();
    });
  }, [id]);

  const updateStatus = async (endpoint) => {
    try {
      let payload = {};
      if (endpoint === 'complete') {
        const hasAcceptedQuote = quotations.some(q => q.status === 'accepted');
        if (!hasAcceptedQuote) {
          toast.info("You must send a final quotation before marking the job as complete.");
          setShowQuoteModal(true);
          return;
        }
        
        // If they already have an accepted quote, we just complete it
      }
      
      const res = await api.put(`/bookings/${id}/${endpoint}`, payload);
      toast.success('Status updated successfully');
      
      if (res.data?.newBookingId && res.data.newBookingId !== id) {
        navigate(`/worker/jobs/${res.data.newBookingId}`);
      } else {
        fetchJob();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAddLineItem = () => {
    setQuoteData({
      ...quoteData,
      lineItems: [...quoteData.lineItems, { description: '', amount: '' }]
    });
  };

  const handleRemoveLineItem = (index) => {
    const newItems = quoteData.lineItems.filter((_, i) => i !== index);
    setQuoteData({ ...quoteData, lineItems: newItems });
  };

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...quoteData.lineItems];
    newItems[index][field] = value;
    setQuoteData({ ...quoteData, lineItems: newItems });
  };

  const handleSendQuotation = async () => {
    // Validate
    if (quoteData.lineItems.some(item => !item.description || !item.amount)) {
      return toast.error("Please fill in all line item details");
    }
    
    try {
      const res = await api.post('/quotations', {
        bookingId: id,
        ...quoteData
      });
      toast.success("Quotation sent to customer!");
      setShowQuoteModal(false);
      
      // If a new booking was created (for a broadcast job), redirect to the new booking ID
      if (res.data.newBookingId && res.data.newBookingId !== id) {
        navigate(`/worker/jobs/${res.data.newBookingId}`);
      } else {
        fetchJob(); // Refresh to update timeline
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send quotation');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!job) return <div className="p-8 text-center">Job not found</div>;

  const baseTimelineSteps = [
    { id: 'pending', label: 'Requested' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'en_route', label: 'Worker En Route' },
    { id: 'arrived', label: 'Worker Arrived' },
    { id: 'quote_provided', label: 'Quote Pending Approval' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  const hasStarted = job.statusHistory?.some(h => h.status === 'in_progress') || job.status === 'in_progress';

  const timelineSteps = (quotations.length > 0 && !hasStarted)
    ? baseTimelineSteps 
    : baseTimelineSteps.filter(s => s.id !== 'quote_provided');

  let currentStepIndex = timelineSteps.findIndex(s => s.id === job.status);
  // Fallback if status is something like 'quote_provided' and it isn't linearly mapping perfectly
  // For UI flow: pending(0) -> accepted(1) -> en_route(2) -> in_progress(3) -> quote_provided(4) -> completed(5)

  const totalQuoteAmount = quoteData.lineItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative">
      <div className="flex-1 space-y-6">
        
        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-4 flex flex-wrap gap-2">
          
          {job.paymentStatus === 'pending' && job.status === 'in_progress' ? (
            <div className="w-full flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded text-amber-800">
              <span className="font-medium">Customer chose Cash Payment. Did you receive the money?</span>
              <button onClick={() => updateStatus('confirm-cash')} className="px-4 py-2 bg-success text-white rounded font-bold hover:bg-green-600">
                Confirm Cash Received
              </button>
            </div>
          ) : (
            <>
              {job.status === 'accepted' && <button onClick={() => updateStatus('en-route')} className="px-4 py-2 bg-info text-white rounded font-medium">Mark En Route</button>}
              {job.status === 'en_route' && <button onClick={() => updateStatus('start')} className="px-4 py-2 bg-primary text-white rounded font-medium">Mark Arrived & Start</button>}
              {job.status === 'in_progress' && <button onClick={() => updateStatus('complete')} className="px-4 py-2 bg-success text-white rounded font-medium">Mark Completed</button>}
              
              {/* Accept/Decline for direct requests and broadcast jobs */}
              {job.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus('accept')} className="px-4 py-2 bg-success text-white rounded font-medium hover:bg-green-600">Accept Request</button>
                  <button onClick={() => updateStatus('decline')} className="px-4 py-2 border border-danger text-danger rounded font-medium hover:bg-red-50">Decline Request</button>
                </>
              )}

              {/* Send Quotation button available when in progress, accepted, or pending (for broadcast) */}
              {['pending', 'accepted', 'en_route', 'in_progress'].includes(job.status) && (
                 <button onClick={() => setShowQuoteModal(true)} className="px-4 py-2 border border-primary text-primary rounded font-medium hover:bg-light-accent">Send Quotation / Bill</button>
              )}
              
              {quotations.some(q => q.status === 'pending') && (
                <div className="w-full flex items-center justify-center bg-blue-50 border border-blue-200 p-3 rounded text-blue-800 font-medium">
                  ⏳ Waiting for Customer to Review & Accept {job.status === 'in_progress' ? 'Final Bill' : 'Quotation'}...
                </div>
              )}

              {['accepted', 'en_route'].includes(job.status) && (
                <button onClick={() => updateStatus('cancel')} className="px-4 py-2 border border-danger text-danger rounded font-medium hover:bg-red-50 ml-auto">Cancel Job</button>
              )}
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-text-primary">{job.serviceTitle}</h2>
            {job.urgency === 'urgent' && <span className="bg-red-100 text-danger text-xs px-2 py-1 rounded font-bold uppercase">Urgent</span>}
          </div>
          <p className="text-text-secondary mb-6">{job.jobDescription}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
            <div>
              <h4 className="text-xs font-bold text-text-hint uppercase tracking-wider mb-2">Schedule</h4>
              <p className="font-medium text-text-primary">{new Date(job.scheduledDate).toLocaleDateString()}</p>
              <p className="text-sm text-text-secondary">{job.scheduledTimeSlot}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-hint uppercase tracking-wider mb-2">Customer</h4>
              <p className="font-medium text-text-primary">{job.customerId?.firstName} {job.customerId?.lastName}</p>
              <p className="text-sm text-text-secondary">{job.customerId?.phone}</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-xs font-bold text-text-hint uppercase tracking-wider mb-2">Exact Address (Revealed)</h4>
            <p className="font-medium text-text-primary bg-gray-50 p-3 border border-gray-200 rounded">{job.streetAddress}, {job.city}</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-border p-6">
          <h3 className="font-bold mb-6 text-text-primary">Job Progress</h3>
          <div className="space-y-6">
            {timelineSteps.map((step, idx) => {
              const isDone = currentStepIndex >= idx;
              return (
                <div key={idx} className="flex gap-4 relative">
                  {idx !== timelineSteps.length - 1 && (
                    <div className={`absolute left-2.5 top-6 bottom-[-24px] w-0.5 ${isDone && currentStepIndex > idx ? 'bg-primary' : 'bg-gray-200'}`}></div>
                  )}
                  <div className={`w-5 h-5 rounded-full mt-0.5 relative z-10 flex-shrink-0 border-2 ${isDone ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}></div>
                  <div>
                    <p className={`font-medium text-sm ${isDone ? 'text-text-primary' : 'text-gray-400'}`}>{step.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quotation Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Create Quotation</h2>
              <button onClick={() => setShowQuoteModal(false)} className="text-gray-400 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration</label>
                  <input type="text" placeholder="e.g. 2 hours, 1 day" value={quoteData.estimatedDuration} onChange={(e) => setQuoteData({...quoteData, estimatedDuration: e.target.value})} className="w-full border border-gray-300 rounded py-2 px-3 focus:ring-primary focus:border-primary outline-none" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Line Items</label>
                  <button onClick={handleAddLineItem} className="text-sm text-primary font-bold flex items-center gap-1 hover:text-amber-700">
                    <Plus size={16} /> Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {quoteData.lineItems.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input type="text" placeholder="Description (e.g. Parts, Labor)" value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} className="w-full border border-gray-300 rounded py-2 px-3 focus:ring-primary focus:border-primary outline-none" />
                      </div>
                      <div className="w-32">
                        <input type="number" placeholder="Rs." value={item.amount} onChange={(e) => handleLineItemChange(index, 'amount', e.target.value)} className="w-full border border-gray-300 rounded py-2 px-3 focus:ring-primary focus:border-primary outline-none" />
                      </div>
                      {quoteData.lineItems.length > 1 && (
                        <button onClick={() => handleRemoveLineItem(index)} className="mt-2 text-red-500 hover:text-red-700">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="font-bold text-gray-700">Total Estimated Amount:</span>
                <span className="text-xl font-bold text-primary">Rs. {totalQuoteAmount.toFixed(2)}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note to Customer (Optional)</label>
                <textarea rows="3" value={quoteData.noteToCustomer} onChange={(e) => setQuoteData({...quoteData, noteToCustomer: e.target.value})} className="w-full border border-gray-300 rounded py-2 px-3 focus:ring-primary focus:border-primary outline-none resize-none"></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button onClick={() => setShowQuoteModal(false)} className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
              <button onClick={handleSendQuotation} className="px-6 py-2 bg-primary text-white rounded font-medium hover:bg-amber-600">Send Quotation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerJobDetail;
