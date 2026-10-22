import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Briefcase, CheckCircle } from 'lucide-react';

const ROLE_MAP = {
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

const DEFAULT_ROLE_SKILLS = {
  'Plumbing': ['Pipe Repairs', 'Leak Fixing', 'Tap Fitting', 'Drain Cleaning'],
  'Plumber': ['Pipe Repairs', 'Leak Fixing', 'Tap Fitting', 'Drain Cleaning'],
  'Electrical': ['Wiring', 'Switches & Sockets', 'Circuit Breakers', 'Fixture Installation'],
  'Electrician': ['Wiring', 'Switches & Sockets', 'Circuit Breakers', 'Fixture Installation'],
  'Carpentry': ['Furniture Repair', 'Door Fitting', 'Window Frames', 'Cabinet Making'],
  'Carpenter': ['Furniture Repair', 'Door Fitting', 'Window Frames', 'Cabinet Making'],
  'Painting': ['Interior Painting', 'Exterior Painting', 'Wall Putty', 'Waterproofing'],
  'Painter': ['Interior Painting', 'Exterior Painting', 'Wall Putty', 'Waterproofing'],
  'Masonry': ['Floor Tiling', 'Wall Tiling', 'Cement Work', 'Plastering'],
  'Mason': ['Floor Tiling', 'Wall Tiling', 'Cement Work', 'Plastering'],
  'Cleaning': ['Deep Cleaning', 'Sanitization', 'Window Cleaning', 'Kitchen Cleaning'],
  'Cleaner': ['Deep Cleaning', 'Sanitization', 'Window Cleaning', 'Kitchen Cleaning'],
  'AC Repair': ['AC Servicing', 'Gas Refill', 'Leak Repair', 'Installation'],
  'AC Technician': ['AC Servicing', 'Gas Refill', 'Leak Repair', 'Installation'],
  'Gardening': ['Lawn Mowing', 'Tree Pruning', 'Landscaping', 'Plant Care'],
  'Gardener': ['Lawn Mowing', 'Tree Pruning', 'Landscaping', 'Plant Care'],
  'Pest Control': ['Termite Control', 'Bed Bug Treatment', 'Fumigation', 'Rodent Control'],
  'Pest Exterminator': ['Termite Control', 'Bed Bug Treatment', 'Fumigation', 'Rodent Control'],
  'Roofing': ['Roof Repairs', 'Leak Fixing', 'Tile Replacement', 'Waterproofing'],
  'Roofer': ['Roof Repairs', 'Leak Fixing', 'Tile Replacement', 'Waterproofing'],
  'Appliance Repair': ['Washing Machine', 'Refrigerator', 'Microwave', 'Oven Repair'],
  'Appliance Technician': ['Washing Machine', 'Refrigerator', 'Microwave', 'Oven Repair'],
  'CCTV Installation': ['Camera Setup', 'DVR Configuration', 'Wiring', 'Remote Viewing'],
  'CCTV Technician': ['Camera Setup', 'DVR Configuration', 'Wiring', 'Remote Viewing']
};

export const WorkerCardSkeleton = () => {
  return (
    <div className="bg-white rounded-[20px] border border-[#E8E2DB] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex flex-col justify-between h-full animate-pulse select-none">
      <div>
        {/* Top Row Skeleton */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[#E8E2DB]/70 shrink-0" />
          <div className="flex-1 min-w-0 pt-1 space-y-2">
            <div className="h-5 bg-[#E8E2DB]/80 rounded-md w-3/4" />
            <div className="h-4 bg-[#E8E2DB]/60 rounded-md w-1/2" />
            <div className="h-4 bg-[#E8E2DB]/50 rounded-md w-1/3" />
          </div>
        </div>

        {/* Facts Row Skeleton */}
        <div className="flex items-center gap-3 mt-4 pt-3.5 border-t border-[#E8E2DB]/60">
          <div className="h-4 bg-[#E8E2DB]/60 rounded w-16" />
          <div className="h-4 bg-[#E8E2DB]/60 rounded w-16" />
          <div className="h-4 bg-[#E8E2DB]/60 rounded w-20" />
        </div>
      </div>

      <div className="mt-4">
        {/* Skills Section Skeleton */}
        <div className="bg-[#FFF8F1] rounded-[12px] p-2.5 mb-3.5 flex flex-wrap gap-1.5 items-center">
          <div className="h-6 bg-[#E8E2DB]/60 rounded-full w-20" />
          <div className="h-6 bg-[#E8E2DB]/60 rounded-full w-24" />
          <div className="h-6 bg-[#E8E2DB]/60 rounded-full w-18" />
          <div className="h-6 bg-[#E8E2DB]/60 rounded-full w-20" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[44px] bg-[#E8E2DB]/60 rounded-[12px]" />
          <div className="flex-[1.2] h-[44px] bg-[#E8E2DB]/80 rounded-[12px]" />
        </div>
      </div>
    </div>
  );
};

const WorkerCard = ({ worker }) => {
  const navigate = useNavigate();

  if (!worker) return null;

  const workerId = worker._id || worker.id;
  const user = worker.userId || {};
  const firstName = user.firstName || worker.firstName || '';
  const lastName = user.lastName || worker.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Professional Worker';
  const profilePhoto = user.profilePhoto || worker.profilePhoto;
  const initials = ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase() || 'W';
  
  // Verification
  const isVerified = Boolean(worker.verifiedBadge || worker.isVerified);

  // Role
  const rawTitle = worker.services?.[0]?.serviceTitle || worker.category || worker.serviceTitle || '';
  const role = ROLE_MAP[rawTitle] || rawTitle;

  // Rating & Reviews (Remove "New" pill, always show star + rating)
  const totalReviews = Number(worker.totalReviews) || 0;
  const averageRating = Number(worker.averageRating) || 0;

  // Facts (max 3, only if real data exists)
  const location = worker.serviceDistricts?.[0] || user.city || worker.city;
  const expYears = worker.totalYearsExperience || worker.services?.[0]?.yearsExperience;
  const jobsDone = Number(worker.totalJobsCompleted) || 0;

  const facts = [];
  if (expYears && Number(expYears) > 0) {
    facts.push({
      id: 'exp',
      icon: Briefcase,
      text: `${expYears} yrs experience`
    });
  }

  // Rating in facts row (after experience)
  facts.push({
    id: 'rating',
    isRating: true,
    score: averageRating > 0 ? averageRating.toFixed(1) : (worker.averageRating ?? 0),
    reviews: totalReviews
  });

  if (jobsDone > 0) {
    facts.push({
      id: 'jobs',
      icon: CheckCircle,
      text: `${jobsDone} jobs done`
    });
  }
  const visibleFacts = facts.slice(0, 3);

  // Specific Skills (max 4 skills)
  const rawSkills = Array.isArray(worker.services)
    ? [...new Set(worker.services.flatMap(s => s?.specificSkills || []))].filter(Boolean)
    : (Array.isArray(worker.specificSkills) ? worker.specificSkills.filter(Boolean) : []);
  
  const fallbackSkills = DEFAULT_ROLE_SKILLS[rawTitle] || DEFAULT_ROLE_SKILLS[role] || ['General Repairs', 'Maintenance', 'Inspection', 'Installation'];
  const displaySkills = (rawSkills.length > 0 ? rawSkills : fallbackSkills).slice(0, 4);

  const isAvailable = worker.isAvailable === true;

  // Navigation handlers
  const handleCardClick = () => {
    if (workerId) {
      navigate(`/customer/worker/${workerId}`);
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (workerId) {
      navigate(`/customer/worker/${workerId}`);
    }
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    if (workerId) {
      navigate(`/customer/book/${workerId}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      role="article"
      aria-label={`Profile for ${fullName}`}
      className="group bg-white h-full rounded-[20px] border border-[#E8E2DB] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 hover:border-[rgba(255,122,0,0.5)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-all duration-[250ms] ease-in-out motion-reduce:transition-none motion-reduce:hover:translate-y-0 p-5 flex flex-col justify-between cursor-pointer focus-within:ring-2 focus-within:ring-[#FF7A00]"
    >
      <div>
        {/* TOP ROW */}
        <div className="flex items-start gap-4">
          {/* Avatar (64px circle with 2px orange gradient ring and 3px white gap) */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full p-[2px] bg-[#FF7A00]">
              <div className="w-full h-full rounded-full p-[3px] bg-white">
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#FF7A00] text-white">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt={fullName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-poppins font-bold text-[18px] text-white select-none">
                      {initials}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Small green dot at bottom-right if available now */}
            {isAvailable && (
              <span
                className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#2E9E5B] border-2 border-white rounded-full z-10"
                title="Available now"
                aria-label="Available now"
              />
            )}
          </div>

          {/* Name, Role, Rating */}
          <div className="flex-1 min-w-0 pt-0.5">
            {/* Name + Verification */}
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-poppins font-semibold text-[18px] text-[#000000] truncate leading-snug">
                {fullName}
              </h3>
              {isVerified && (
                <span
                  title="NIC verified"
                  className="inline-flex items-center text-[#2E9E5B] shrink-0 cursor-help"
                  aria-label="NIC verified"
                >
                  <ShieldCheck className="w-4 h-4 text-[#2E9E5B]" strokeWidth={2.5} />
                </span>
              )}
            </div>

            {/* Role */}
            {role && (
              <p className="font-inter text-[14px] text-[#6B6B6B] truncate leading-tight mt-0.5">
                {role}
              </p>
            )}

            {/* Location (replaces rating) */}
            {location && (
              <div className="mt-1 flex items-center gap-1.5 text-[13px] text-[#3D3D3D] font-inter">
                <MapPin className="w-3.5 h-3.5 text-[#6B6B6B] shrink-0" strokeWidth={2} />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* FACTS ROW (max 3, each only if data exists) */}
        {visibleFacts.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3.5 pt-3.5 border-t border-[#E8E2DB]/60">
            {visibleFacts.map((fact) => {
              if (fact.isRating) {
                return (
                  <div
                    key={fact.id}
                    className="inline-flex items-center gap-1.5 text-[13px] text-[#3D3D3D] font-inter font-normal"
                  >
                    <Star className="w-3.5 h-3.5 fill-[#FF7A00] text-[#FF7A00] shrink-0" />
                    <span className="font-poppins font-semibold text-[13px] text-[#000000] leading-none">
                      {fact.score}
                    </span>
                    {fact.reviews > 0 && (
                      <span className="font-inter text-[12px] text-[#6B6B6B] leading-none">
                        ({fact.reviews})
                      </span>
                    )}
                  </div>
                );
              }
              const IconComponent = fact.icon;
              return (
                <div
                  key={fact.id}
                  className="inline-flex items-center gap-1.5 text-[13px] text-[#3D3D3D] font-inter font-normal"
                >
                  <IconComponent className="w-3.5 h-3.5 text-[#6B6B6B] shrink-0" strokeWidth={2} />
                  <span className="whitespace-nowrap">{fact.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-3.5">
        {/* SPECIFIC SKILLS SECTION (Replaces "Busy" section, max 4 skills) */}
        {displaySkills.length > 0 && (
          <div className="bg-[#FFF8F1] rounded-[12px] p-2.5 mb-3.5 flex flex-wrap gap-1.5 items-center">
            {displaySkills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-white border border-[#E8E2DB] text-[#3D3D3D] text-[12px] font-medium rounded-full px-2.5 py-1 leading-tight shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* BUTTONS (View profile & Book) */}
        <div className="flex items-center gap-3">
          {/* View profile */}
          <button
            type="button"
            onClick={handleProfileClick}
            className="flex-1 h-[44px] min-h-[44px] bg-white border-[1.5px] border-black text-black font-poppins font-semibold text-[14px] rounded-[12px] hover:bg-black hover:text-white transition-colors duration-200 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 motion-reduce:transition-none"
          >
            View profile
          </button>

          {/* Book */}
          <button
            type="button"
            onClick={handleBookClick}
            className="flex-[1.2] h-[44px] min-h-[44px] font-poppins font-semibold text-[14px] rounded-[12px] flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 bg-[#D97706] text-white shadow-md shadow-[#D97706]/30 hover:bg-[#B45309] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D97706]/40 cursor-pointer"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
