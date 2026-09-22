const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/customer/BookingDetail.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Import Star icon from lucide-react if not present
if (!content.includes('Star,')) {
  content = content.replace(/import { Link, useParams, useNavigate } from 'react-router-dom';/, "import { Link, useParams, useNavigate } from 'react-router-dom';\nimport { Star } from 'lucide-react';");
}

// 2. Add Review state variables inside component
if (!content.includes('const [rating, setRating] = useState(0);')) {
  content = content.replace(
    /const \[loading, setLoading\] = useState\(true\);/,
    `const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);`
  );
}

// 3. Add handleSubmitReview function
if (!content.includes('const handleSubmitReview = async')) {
  content = content.replace(
    /const handleCancel = async \(\) => \{/,
    `const handleSubmitReview = async () => {
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

  const handleCancel = async () => {`
  );
}

// 4. Inject Review UI below the Pending Quotation Banner logic, right before the Header
const reviewUI = `
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
`;

content = content.replace(
  /\{\/\* Header \*\/\}/,
  reviewUI + '\n            {/* Header */}'
);

fs.writeFileSync(filePath, content);
console.log('BookingDetail.jsx updated with Review UI!');
