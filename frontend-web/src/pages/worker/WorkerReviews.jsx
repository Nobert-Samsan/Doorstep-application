import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Star,
  ArrowLeft,
  ChatCircleText,
  User,
  CalendarBlank,
  Briefcase,
  CheckCircle,
  ThumbsUp
} from '@phosphor-icons/react';

const WorkerReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [filterStar, setFilterStar] = useState('all');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await api.get('/reviews/my-reviews');
        if (res.data?.success) {
          setReviews(res.data.data.reviews || []);
          setStats(res.data.data.stats || {
            averageRating: 0,
            totalReviews: 0,
            breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          });
        }
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    if (filterStar === 'all') return true;
    return Math.round(r.rating) === Number(filterStar);
  });

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/worker/dashboard')}
            className="w-10 h-10 rounded-xl bg-white border border-[#E8E2DB] flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-black transition-colors shadow-sm"
          >
            <ArrowLeft size={18} weight="bold" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-gray-900">
              Ratings & Reviews
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-inter">
              Customer feedback and service quality ratings
            </p>
          </div>
        </div>

        {/* Rating Overview Summary Card */}
        <div className="bg-white rounded-2xl border border-[#E8E2DB] p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Score Big Display */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center md:border-r md:border-gray-100 md:pr-8">
              <span className="text-6xl sm:text-7xl font-poppins font-bold text-gray-900 tracking-tight">
                {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
              </span>
              <div className="flex items-center gap-1.5 my-3 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    weight={star <= Math.round(stats.averageRating) ? 'fill' : 'regular'}
                    className={star <= Math.round(stats.averageRating) ? 'text-amber-400' : 'text-gray-200'}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-600 font-inter">
                Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Star Distribution Breakdown */}
            <div className="md:col-span-7 space-y-2.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.breakdown?.[star] || 0;
                const pct = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs sm:text-sm font-inter">
                    <span className="w-12 font-medium text-gray-600 flex items-center gap-1">
                      {star} <Star size={13} weight="fill" className="text-amber-400" />
                    </span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-semibold text-gray-500">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterStar('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStar === 'all'
                ? 'bg-black text-white shadow-sm'
                : 'bg-white border border-[#E8E2DB] text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setFilterStar(String(star))}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                filterStar === String(star)
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white border border-[#E8E2DB] text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{star}</span>
              <Star size={13} weight="fill" className={filterStar === String(star) ? 'text-amber-400' : 'text-amber-500'} />
              <span>({stats.breakdown?.[star] || 0})</span>
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-gray-400 font-inter text-sm bg-white rounded-2xl border border-[#E8E2DB]">
              Loading reviews...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E2DB]">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <ChatCircleText size={26} weight="duotone" />
              </div>
              <h3 className="font-poppins font-bold text-gray-800 text-base">No reviews yet</h3>
              <p className="text-gray-500 font-inter text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                Customer reviews and ratings will show here as you complete jobs.
              </p>
            </div>
          ) : (
            filteredReviews.map((rev) => {
              const cust = rev.customerId;
              const custName = cust ? `${cust.firstName || ''} ${cust.lastName || ''}`.trim() : 'Customer';
              const serviceTitle = rev.bookingId?.serviceTitle || 'Completed Service';

              return (
                <div
                  key={rev._id}
                  className="bg-white rounded-2xl border border-[#E8E2DB] p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Customer Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFF5EB] border border-[#FED7AA] text-[#FF7A00] flex items-center justify-center font-bold text-sm">
                        {cust?.firstName ? cust.firstName[0].toUpperCase() : 'C'}
                      </div>
                      <div>
                        <h4 className="font-poppins font-bold text-gray-900 text-sm">
                          {custName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
                            <Briefcase size={12} /> {serviceTitle}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-[11px] text-gray-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 font-bold text-xs">
                      <Star size={14} weight="fill" className="text-amber-500" />
                      <span>{Number(rev.rating).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Comment */}
                  {(rev.comment || rev.reviewText) && (
                    <p className="text-sm text-gray-700 font-inter mt-3.5 leading-relaxed bg-[#FAF8F5] p-3.5 rounded-xl border border-[#F3EFEA]">
                      "{rev.comment || rev.reviewText}"
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerReviews;
