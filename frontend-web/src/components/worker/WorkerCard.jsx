import React from 'react';
import { useNavigate } from 'react-router-dom';

const WorkerCard = ({ worker }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/customer/worker/${worker._id}`)}
      className="bg-white h-full rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all flex flex-col group cursor-pointer"
    >
      <div className="p-5 flex items-start space-x-4">
        <div className="w-16 h-16 bg-primary/10 text-primary font-bold text-xl rounded-full flex-shrink-0 relative flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          {worker.userId?.profilePhoto ? (
            <img src={worker.userId.profilePhoto} alt={worker.userId.firstName} className="w-full h-full object-cover" />
          ) : (
            <span>{worker.userId?.firstName?.charAt(0)}{worker.userId?.lastName?.charAt(0)}</span>
          )}
          {worker.isAvailable && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full z-10"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-text-primary truncate">
            {worker.userId?.firstName} {worker.userId?.lastName}
            {worker.verifiedBadge && <span className="ml-1 text-info text-sm" title="Verified">✔️</span>}
          </h3>
          <p className="text-sm font-bold text-gray-800 truncate">
            {(() => {
              const cat = worker.services?.[0]?.serviceTitle || 'Professional Worker';
              const map = {
                'Plumbing': 'Plumber',
                'Electrical': 'Electrician',
                'Carpentry': 'Carpenter',
                'Painting': 'Painter',
                'Masonry': 'Mason',
                'Cleaning': 'Cleaner',
                'AC Repair': 'AC Technician',
                'Gardening': 'Gardener',
                'Pest Control': 'Pest Exterminator',
                'Roofing': 'Roofer',
                'Appliance Repair': 'Appliance Technician',
                'CCTV Installation': 'CCTV Technician'
              };
              return map[cat] || cat;
            })()}
          </p>
          <div className="flex items-center mt-2 gap-4 text-sm text-gray-500 font-medium">
            <div className="flex items-center whitespace-nowrap">
              <span className="text-primary mr-1.5">📍</span>
              {worker.serviceDistricts?.[0] || 'Anywhere'}
            </div>
            <div className="flex items-center whitespace-nowrap">
              <span className="text-amber-400 mr-1.5">⭐</span>
              {worker.averageRating}
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-2 flex flex-wrap gap-2 text-xs mt-auto">
        {worker.services?.[0]?.specificSkills?.slice(0, 3).map((skill, idx) => (
          <span key={idx} className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md font-medium">{skill}</span>
        ))}
      </div>
      
      <div className="p-5 mt-2 border-t border-gray-100 flex flex-col gap-4">
        <div>
          <p className="font-bold text-gray-900 text-[15px]">Pricing after Inspection</p>
          <p className="text-xs text-gray-500 mt-0.5">Custom quotes based on job scope</p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/customer/book/${worker._id}`);
          }}
          className="block w-full text-center px-4 py-2.5 text-sm font-bold bg-primary text-white rounded-xl hover:bg-amber-600 shadow-md shadow-primary/20 transition-all group-hover:-translate-y-0.5"
        >
          Book
        </button>
      </div>
    </div>
  );
};

export default WorkerCard;
