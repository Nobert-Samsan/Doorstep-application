import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings');
        
        // Map backend schema to frontend variables
        const mappedBookings = data.data.map(b => ({
          id: b._id,
          serviceTitle: b.serviceTitle,
          status: b.status,
          date: new Date(b.scheduledDate).toLocaleDateString(),
          worker: b.workerId ? `${b.workerId.firstName} ${b.workerId.lastName}` : 'Unassigned',
          workerId: b.workerId?._id,
          profession: b.categoryId?.nameEn || 'Professional', // Ideally we populate category
          amount: b.finalAmount ? `Rs. ${b.finalAmount}` : 'Pending Quote'
        }));
        
        setBookings(mappedBookings);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleMessage = async (workerId) => {
    if (!workerId) return;
    try {
      await api.post('/chat/conversations', { participantId: workerId });
      navigate('/customer/messages');
    } catch (err) {
      console.error("Failed to start chat", err);
      navigate('/customer/messages');
    }
  };

  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setReviewText('');
    setReviewModalOpen(true);
  };

  const submitReview = async () => {
    try {
      await api.post('/reviews', {
        bookingId: selectedBooking.id,
        workerId: selectedBooking.workerId,
        rating,
        reviewText
      });
      alert('Review submitted successfully!');
      setReviewModalOpen(false);
    } catch (error) {
      console.error("Failed to submit review", error);
      alert('Error submitting review');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'All Bookings') return true;
    if (activeTab === 'Pending') return b.status === 'pending';
    if (activeTab === 'Active') return ['in_progress', 'accepted', 'en_route', 'arrived', 'quote_provided'].includes(b.status);
    if (activeTab === 'Completed') return b.status === 'completed';
    if (activeTab === 'Cancelled') return b.status === 'cancelled';
    if (activeTab === 'Complaint') return ['complaint', 'disputed'].includes(b.status);
    return true;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500';
      case 'accepted': 
      case 'en_route':
      case 'arrived':
      case 'quote_provided': return 'bg-blue-100 text-blue-700 border-l-4 border-blue-500';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-l-4 border-blue-500';
      case 'completed': return 'bg-green-100 text-green-700 border-l-4 border-green-500';
      case 'cancelled': return 'bg-red-50 text-red-700 border-l-4 border-red-500';
      case 'complaint': return 'bg-purple-100 text-purple-700 border-l-4 border-purple-500';
      default: return 'bg-gray-100 text-gray-700 border-l-4 border-gray-500';
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your bookings...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">My Bookings</h2>
        <Link to="/customer/post-job" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary">Post a Job Request</Link>
      </div>

      <div className="flex space-x-4 mb-6 border-b border-border overflow-x-auto hide-scrollbar">
        {['All Bookings', 'Pending', 'Active', 'Completed', 'Cancelled', 'Complaint'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 border-b-2 font-medium ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredBookings.map(booking => (
          <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-border flex flex-col md:flex-row overflow-hidden">
            <div className={`w-2 md:w-auto md:w-1 ${getStatusStyle(booking.status).split(' ')[0]}`}></div>
            <div className="p-5 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              <div>
                <h3 className="font-bold text-lg text-text-primary">{booking.serviceTitle}</h3>
                <p className="text-sm text-text-secondary">{booking.profession}: {booking.worker} • {booking.date}</p>
              </div>

              <div className="flex flex-col md:items-end w-full md:w-auto gap-2">
                <div className="flex justify-between w-full md:w-auto gap-4 items-center">
                  <span className="font-semibold">{booking.amount}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusStyle(booking.status).replace('border-l-4 border-', '')}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Link to={`/customer/bookings/${booking.id}`} className="flex-1 md:flex-none text-center px-4 py-1.5 border border-primary text-primary rounded text-sm hover:bg-light-accent">View Details</Link>
                  {['in_progress', 'accepted', 'en_route', 'arrived', 'quote_provided'].includes(booking.status) && <button onClick={() => handleMessage(booking.workerId)} className="flex-1 md:flex-none px-4 py-1.5 bg-primary text-white rounded text-sm hover:bg-secondary">Message</button>}
                  {booking.status === 'completed' && <button onClick={() => handleOpenReview(booking)} className="flex-1 md:flex-none px-4 py-1.5 bg-success text-white rounded text-sm hover:bg-green-700">Leave Review</button>}
                  {booking.status === 'cancelled' && <button onClick={() => navigate(booking.workerId ? `/customer/book/${booking.workerId}` : '/customer/post-job')} className="flex-1 md:flex-none px-4 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">Rebook</button>}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
            <p className="text-sm text-gray-500 mb-6">How was your experience with {selectedBooking.worker}?</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea 
              className="w-full border border-gray-300 rounded-md p-3 mb-6 h-24 resize-none"
              placeholder="Tell us what you liked (or didn't like)..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3">
              <button onClick={() => setReviewModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
              <button onClick={submitReview} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary">Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
