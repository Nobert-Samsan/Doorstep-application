import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { io } from 'socket.io-client';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchBooking = async () => {
    try {
      const { data: bData } = await api.get(`/bookings/${id}`);
      setBooking(bData.data);
      
      try {
        const { data: qData } = await api.get(`/quotations/booking/${id}`);
        setQuotations(qData.data);
      } catch (err) {
        console.warn('Could not fetch quotations', err);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    socket.on('booking_status_update', (updatedBooking) => {
      if (updatedBooking._id === id) {
        fetchBooking();
      }
    });

    socket.on('new_quotation', (quotation) => {
      if (quotation.bookingId === id) {
        fetchBooking();
      }
    });

    return () => socket.disconnect();
  }, [id]);

  const handleAcceptQuote = async (quoteId) => {
    try {
      console.log('Accepting quote:', quoteId);
      const res = await api.put(`/quotations/${quoteId}/accept`);
      console.log('Response:', res.data);
      toast.success("Quotation Accepted! Please pay the worker in cash after completion.");
      fetchBooking();
    } catch (err) {
      console.error('Accept error:', err);
      toast.error(err.response?.data?.message || "Failed to accept quotation");
    }
  };

  const handleDeclineQuote = async (quoteId) => {
    try {
      console.log('Declining quote:', quoteId);
      const res = await api.put(`/quotations/${quoteId}/reject`);
      console.log('Response:', res.data);
      toast.info("Quotation Declined. Worker will be notified.");
      fetchBooking();
    } catch (err) {
      console.error('Decline error:', err);
      toast.error(err.response?.data?.message || "Failed to decline quotation");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!booking) {
    return <div className="p-8 text-center text-red-500">Booking not found</div>;
  }

  const baseTimelineSteps = [
    { key: 'pending', label: 'Requested' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'en_route', label: 'Worker En Route' },
    { key: 'arrived', label: 'Worker Arrived' },
    { key: 'quote_provided', label: 'Quote Pending Approval' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' }
  ];

  const hasStarted = booking.statusHistory?.some(h => h.status === 'in_progress') || booking.status === 'in_progress';
  
  // Only show "Quote Pending" in timeline if there is a quotation AND it was sent BEFORE work started (estimate)
  const timelineSteps = (quotations.length > 0 && !hasStarted)
    ? baseTimelineSteps 
    : baseTimelineSteps.filter(s => s.key !== 'quote_provided');

  const timeline = timelineSteps.map(step => {
    const historyItem = booking.statusHistory?.find(h => h.status === step.key);
    // Determine if this step is "done" based on the current status hierarchy
    const currentIndex = timelineSteps.findIndex(s => s.key === booking.status);
    const stepIndex = timelineSteps.findIndex(s => s.key === step.key);
    
    // If it's cancelled/complaint, we just rely on historyItem existence
    let done = false;
    if (booking.status === 'cancelled' || booking.status === 'complaint') {
      done = !!historyItem;
    } else {
      done = stepIndex <= currentIndex || !!historyItem;
    }

    return {
      status: step.key,
      label: step.label,
      time: historyItem ? new Date(historyItem.timestamp).toLocaleString() : null,
      done
    };
  });

  const handleSubmitReview = async () => {
    if (rating === 0) return toast.error("Please select a star rating");
    try {
      setIsSubmittingReview(true);
      await api.post('/reviews', {
        bookingId: booking._id,
        workerId: booking.workerId._id || booking.workerId,
        rating,
        comment: reviewComment
      });
      toast.success("Thank you for your review!");
      fetchBooking();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleCancel = async () => {
    const reason = window.prompt("Why do you want to cancel this booking?");
    if (reason === null) return; // User clicked cancel on the prompt
    
    try {
      await api.put(`/bookings/${booking._id}/cancel`, {
        reason: reason || 'No reason provided'
      });
      // Refresh the booking data
      const { data } = await api.get(`/bookings/${id}`);
      setBooking(data.data);
      // Optional: Add a success toast here if toast is imported
    } catch (err) {
      console.error("Failed to cancel booking", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Job Details & Worker */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Active Pending Quotation Banner */}
          {quotations.map(quote => {
            const isFinalBill = booking.statusHistory?.some(h => h.status === 'in_progress') || booking.status === 'in_progress';
            return quote.status === 'pending' && (
              <div key={quote._id} className="bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  {isFinalBill ? "Final Bill Ready for Review" : "Worker Quotation Ready"}
                </h3>
                <p className="text-amber-800 mb-4">
                  {isFinalBill 
                    ? "The worker has finished the job and provided the final bill. Please review and accept to complete the service." 
                    : "The worker has provided an itemized quotation for your job. Please review and accept to proceed."}
                </p>
                
                <div className="bg-white rounded border border-amber-100 p-4 mb-4 space-y-2">
                  {quote.lineItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.description}</span>
                      <span className="font-medium text-gray-900">Rs. {item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-amber-100 mt-2 pt-2 flex justify-between font-bold text-lg text-amber-900">
                    <span>Total Estimated Amount</span>
                    <span>Rs. {quote.totalAmount.toLocaleString()}</span>
                  </div>
                  {quote.estimatedDuration && (
                    <div className="text-sm text-gray-500 mt-2">Estimated Duration: {quote.estimatedDuration}</div>
                  )}
                  {quote.noteToCustomer && (
                    <div className="text-sm text-gray-600 mt-1 italic">"{quote.noteToCustomer}"</div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => handleAcceptQuote(quote._id)} className="px-6 py-2 bg-success text-white font-bold rounded shadow-sm hover:bg-green-600 transition-colors">
                    {booking.statusHistory?.some(h => h.status === 'in_progress') || booking.status === 'in_progress'
                      ? "Accept Final Bill & Complete Job"
                      : "Accept Quotation & Start Work"}
                  </button>
                  <button onClick={() => handleDeclineQuote(quote._id)} className="px-6 py-2 border border-danger text-danger font-medium rounded hover:bg-red-50 transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            );
          })}

          
            {/* Review Prompt if Completed */}
            {booking.status === 'completed' && !booking.reviewId && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-primary/20 rounded-lg p-6 shadow-sm mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Job Completed! Rate Your Experience</h3>
                <p className="text-gray-600 mb-4 text-sm">Your feedback helps {booking.workerId?.firstName} get more jobs and helps other customers make informed decisions.</p>
                
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={32} 
                        fill={(hoverRating || rating) >= star ? "#F59E0B" : "transparent"} 
                        className={(hoverRating || rating) >= star ? "text-amber-500" : "text-gray-300"} 
                      />
                    </button>
                  ))}
                </div>
                
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Leave a comment about the service (optional)..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  rows="3"
                ></textarea>
                
                <button 
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview || rating === 0}
                  className="px-6 py-2 bg-primary text-white font-bold rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            )}
            
            {/* Already Reviewed */}
            {booking.status === 'completed' && booking.reviewId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Star size={20} fill="#16a34a" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 text-sm">Review Submitted</h4>
                  <p className="text-green-700 text-xs">Thank you for rating {booking.workerId?.firstName}!</p>
                </div>
              </div>
            )}

            {/* Header */}
          <div className="flex justify-between items-start bg-white p-6 rounded-lg shadow-sm border border-border">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Booking #{booking._id.substring(booking._id.length - 6).toUpperCase()}</h2>
              <span className={`inline-block mt-2 px-3 py-1 text-sm font-bold rounded-full capitalize ${
                booking.status === 'completed' ? 'bg-success text-white' : 
                booking.status === 'cancelled' ? 'bg-gray-200 text-gray-700' : 
                booking.status === 'complaint' ? 'bg-danger text-white' : 'bg-primary text-white'
              }`}>
                {booking.status.replace('_', ' ')}
              </span>
            </div>

            {/* Cancel Button */}
            {['pending', 'accepted', 'en_route', 'arrived', 'quote_provided'].includes(booking.status) && (
              <button 
                onClick={handleCancel}
                className="text-danger border border-danger hover:bg-red-50 px-4 py-2 rounded-md font-medium transition-colors text-sm whitespace-nowrap"
              >
                Cancel Booking
              </button>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-bold mb-2">{booking.serviceTitle}</h3>
            <p className="text-text-secondary mb-4">{booking.jobDescription}</p>
            <hr className="border-border my-4" />
            <div className="flex justify-between text-sm">
              <div>
                <span className="text-gray-400 block font-bold uppercase mb-1">Schedule</span>
                <p className="font-medium text-text-primary">{new Date(booking.scheduledDate).toLocaleDateString()}</p>
                <p className="text-text-secondary">{booking.scheduledTimeSlot}</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block font-bold uppercase mb-1">Location</span>
                <p className="font-medium text-text-primary">{booking.streetAddress}</p>
                <p className="text-text-secondary">{booking.city}</p>
              </div>
            </div>
          </div>

          {/* Worker Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex justify-between items-center">
            <div className="flex items-center gap-4">
              {booking.workerId?.profilePhoto ? (
                <img 
                  src={booking.workerId.profilePhoto} 
                  alt="Worker Profile" 
                  className="w-16 h-16 rounded-full flex-shrink-0 object-cover shadow-sm border border-gray-200" 
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xl text-gray-500">
                  {booking.workerId?.firstName?.[0]}{booking.workerId?.lastName?.[0]}
                </div>
              )}
              <div>
                <span className="text-gray-400 block text-xs font-bold uppercase mb-1">Assigned Worker</span>
                <h3 className="text-lg font-bold text-text-primary">{booking.workerId?.firstName} {booking.workerId?.lastName}</h3>
                <p className="text-text-secondary text-sm">{booking.workerId?.phone || 'Phone hidden until accepted'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-primary text-primary rounded hover:bg-light-accent transition-colors font-medium">Call</button>
              <button onClick={() => navigate('/customer/messages')} className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors font-medium">Message</button>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Pricing */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
            <h3 className="font-bold text-lg mb-4">Booking Timeline</h3>
            <div className="space-y-4">
              {timeline.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 ${step.done ? 'bg-primary border-primary' : 'border-gray-300'}`}></div>
                    {idx !== timeline.length - 1 && <div className={`w-0.5 h-10 ${step.done ? 'bg-primary' : 'bg-gray-200'}`}></div>}
                  </div>
                  <div>
                    <p className={`font-bold ${step.done ? 'text-text-primary' : 'text-gray-400'}`}>{step.label}</p>
                    {step.time && <p className="text-xs text-text-secondary">{step.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
            <h3 className="font-bold text-lg mb-4">Payment Summary</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary">Status</span>
              <span className="font-bold capitalize">{booking.paymentStatus.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-primary mt-4 pt-4 border-t border-border">
              <span>Total</span>
              <span>
                {booking.status === 'completed' && booking.finalAmount 
                  ? `Rs. ${booking.finalAmount}` 
                  : booking.pricingType === 'fixed' && booking.fixedRate
                  ? `Rs. ${booking.fixedRate} (Fixed)`
                  : 'Pending Inspection'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
