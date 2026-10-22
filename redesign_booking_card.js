const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/customer/BookingDetail.jsx', 'utf8');

const start = code.indexOf('<div className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden mb-6">');
const endMarker = '            )}';
const end = code.indexOf(endMarker, start) + endMarker.length;

if (start === -1 || end === -1) {
  console.log('Could not find the target block.');
  process.exit(1);
}

const newCard = `              {/* Redesigned Booking Details Card */}
              <div className="w-full max-w-[760px] mx-auto bg-[#FFFFFF] rounded-[24px] border border-[#E8E2DB] shadow-[0_16px_40px_rgba(0,0,0,0.07)] overflow-hidden mb-8 animate-[fadeInUp_0.5s_ease-out]">
                {/* Orange Gradient Top Accent */}
                <div className="w-full h-[4px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]"></div>

                {/* 1. HEADER */}
                <div className="bg-[#FFF8F1] px-6 py-6 md:px-8 border-b border-[#E8E2DB] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#6B6B6B] text-[12px] font-semibold tracking-[0.12em] uppercase">Booking</span>
                    <div className="flex items-center gap-3">
                      <h3 className="text-[28px] font-poppins font-bold text-[#000000] leading-none">#{refId}</h3>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(refId); toast.success('Booking ID copied!'); }}
                        className="w-8 h-8 rounded-full border border-[#E8E2DB] bg-transparent flex items-center justify-center text-[#FF7A00] hover:bg-[#FFF1E3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                        title="Copy ID"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  {(() => {
                    const st = booking.status || 'pending';
                    let bg, text, border, dot, icon;
                    if (st === 'in_progress') {
                      bg = 'bg-[#FFF1E3]'; text = 'text-[#B84700]'; border = 'border border-[#FF7A00]/35';
                      dot = <div className="w-2 h-2 rounded-full bg-[#FF7A00] animate-[pulseOrangeDot_2s_infinite]"></div>;
                    } else if (st === 'confirmed' || st === 'upcoming') {
                      bg = 'bg-[#2E9E5B]/12'; text = 'text-[#1F7A44]'; border = 'border-transparent';
                      dot = <div className="w-2 h-2 rounded-full bg-[#2E9E5B]"></div>;
                    } else if (st === 'completed') {
                      bg = 'bg-[#2E9E5B]'; text = 'text-white'; border = 'border-transparent';
                      icon = <Check size={14} className="text-white" strokeWidth={3} />;
                    } else if (st === 'cancelled') {
                      bg = 'bg-[#FDECEC]'; text = 'text-[#B42318]'; border = 'border-transparent';
                      dot = <div className="w-2 h-2 rounded-full bg-[#B42318]"></div>;
                    } else {
                      bg = 'bg-[#F3EFEA]'; text = 'text-[#3D3D3D]'; border = 'border-transparent';
                      dot = <div className="w-2 h-2 rounded-full bg-[#6B6B6B]"></div>;
                    }
                    return (
                      <div className={\`inline-flex items-center gap-2 px-3.5 py-2 rounded-full font-poppins font-semibold text-[12px] uppercase tracking-wide \${bg} \${text} \${border}\`}>
                        {icon ? icon : dot}
                        {st.replace('_', ' ')}
                      </div>
                    );
                  })()}
                </div>

                <style dangerouslySetInnerHTML={{__html: \`
                  @keyframes pulseOrangeDot {
                    0% { box-shadow: 0 0 0 0 rgba(255, 122, 0, 0.4); }
                    70% { box-shadow: 0 0 0 6px rgba(255, 122, 0, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 122, 0, 0); }
                  }
                  @keyframes drawLine {
                    from { width: 0; }
                    to { width: 100%; }
                  }
                  @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                \`}} />

                {/* 2. PROGRESS TRACKER */}
                <div className="px-6 py-6 md:px-8 border-b border-[#E8E2DB]">
                  {(() => {
                    const st = booking.status || 'pending';
                    const steps = ['Booked', 'Provider assigned', 'In progress', 'Completed'];
                    let currentIndex = 0;
                    if (st === 'in_progress') currentIndex = 2;
                    else if (st === 'completed') currentIndex = 3;
                    else if (booking.workerId) currentIndex = 1;

                    if (st === 'cancelled') {
                      return <div className="text-[#B42318] font-medium text-[14px]">This booking has been cancelled.</div>;
                    }

                    return (
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative gap-4 md:gap-0">
                        {/* Desktop lines */}
                        <div className="hidden md:block absolute top-[11px] left-[10%] right-[10%] h-[2px] z-0">
                          <div className="w-full h-full border-t-2 border-dashed border-[#E8E2DB] absolute inset-0"></div>
                          <div className="h-full bg-[#2E9E5B] absolute inset-0 left-0 transition-all duration-1000 ease-out animate-[drawLine_1s_ease-out]" style={{ width: \`\${(currentIndex / (steps.length - 1)) * 100}%\` }}></div>
                        </div>

                        {steps.map((step, idx) => {
                          const isDone = idx < currentIndex;
                          const isCurrent = idx === currentIndex;
                          const isFuture = idx > currentIndex;

                          return (
                            <div key={idx} className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2 w-full md:w-auto">
                              {/* Mobile vertical line */}
                              {idx !== steps.length - 1 && (
                                <div className="md:hidden absolute top-[24px] left-[11px] bottom-[-24px] w-[2px]">
                                  <div className="w-full h-full border-l-2 border-dashed border-[#E8E2DB] absolute inset-0"></div>
                                  <div className={\`w-full bg-[#2E9E5B] absolute top-0 left-0 \${isDone || isCurrent ? 'h-full' : 'h-0'} transition-all duration-1000\`} style={{ transitionDelay: \`\${idx * 300}ms\` }}></div>
                                </div>
                              )}
                              
                              {isDone ? (
                                <div className="w-[24px] h-[24px] rounded-full bg-[#2E9E5B] flex items-center justify-center shrink-0">
                                  <Check size={14} className="text-white" strokeWidth={3} />
                                </div>
                              ) : isCurrent ? (
                                <div className="w-[24px] h-[24px] rounded-full bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shrink-0 ring-4 ring-[#FF7A00]/20">
                                  <div className="w-[8px] h-[8px] bg-white rounded-full"></div>
                                </div>
                              ) : (
                                <div className="w-[24px] h-[24px] rounded-full border-2 border-[#6B6B6B]/30 bg-white shrink-0"></div>
                              )}
                              <span className={\`text-[13px] \${isCurrent ? 'text-black font-semibold' : 'text-[#6B6B6B] font-medium'}\`}>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* 3. DETAILS GRID */}
                <div className="p-6 md:p-8 flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Date */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[#6B6B6B] text-[12px] font-poppins font-semibold tracking-[0.1em] uppercase">Scheduled Date</span>
                      <div className="flex items-center gap-3">
                        <div className="w-[44px] h-[44px] rounded-[12px] bg-[#FFF1E3] flex items-center justify-center shrink-0">
                          <Calendar size={20} className="text-[#FF7A00]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#000000] font-poppins font-semibold text-[18px] leading-tight">
                            {new Date(booking.scheduledDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-[#6B6B6B] text-[14px]">
                            {booking.urgency === 'urgent' ? 'ASAP (Emergency)' : 'Flexible timeframe'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Category */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[#6B6B6B] text-[12px] font-poppins font-semibold tracking-[0.1em] uppercase">Category</span>
                      <div className="flex items-center gap-3">
                        <div className="w-[44px] h-[44px] rounded-[12px] bg-[#FFF1E3] flex items-center justify-center shrink-0">
                          <Wrench size={20} className="text-[#FF7A00]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#000000] font-poppins font-semibold text-[18px] leading-tight">
                            {booking.categoryId?.nameEn || 'General service'}
                          </span>
                          {(booking.categoryId && booking.categoryId.nameEn !== 'Other') && (
                            <span className="text-[#6B6B6B] text-[14px]">Standard request</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#E8E2DB]" />

                  {/* Job Location */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[#6B6B6B] text-[12px] font-poppins font-semibold tracking-[0.1em] uppercase">Job Location</span>
                    <div className="bg-[#FFF8F1] rounded-[16px] border border-[#E8E2DB] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-[44px] h-[44px] rounded-[12px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(255,122,0,0.3)]">
                          <MapPin size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#6B6B6B] text-[11px] font-bold uppercase tracking-wider mb-0.5">Service Location</span>
                          <span className="text-[#000000] font-poppins font-semibold text-[17px] leading-tight">
                            {booking.streetAddress || booking.city}, {booking.district}
                          </span>
                        </div>
                      </div>
                      <div className="flex w-full md:w-auto items-center gap-2 mt-2 md:mt-0">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border border-[#FF7A00] text-[#E86100] font-semibold text-[14px] rounded-[8px] hover:bg-[#FFF1E3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A00]">
                          <Map size={16} /> Directions
                        </button>
                        <button 
                          onClick={() => { navigator.clipboard.writeText(\`\${booking.streetAddress || booking.city}, \${booking.district}\`); toast.success('Address copied!'); }}
                          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border border-[#E8E2DB] text-black font-semibold text-[14px] rounded-[8px] hover:bg-[#FFF8F1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                        >
                          <Copy size={16} /> Copy
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#E8E2DB]" />

                  {/* Job Notes */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[#6B6B6B] text-[12px] font-poppins font-semibold tracking-[0.1em] uppercase">Job Notes</span>
                    <div className="bg-[#FFF8F1] rounded-[16px] border border-[#E8E2DB] p-4 px-5">
                      {booking.jobDescription ? (
                        <p className="text-[#3D3D3D] text-[15px] leading-[1.6] whitespace-pre-wrap">{booking.jobDescription}</p>
                      ) : (
                        <p className="text-[#6B6B6B] text-[14px] italic flex items-center gap-2">
                          <ClipboardList size={16} /> No additional notes provided
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. PROVIDER ROW (If assigned) */}
                {booking.workerId && (
                  <div className="px-6 py-5 md:px-8 border-t border-[#E8E2DB] bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-[48px] h-[48px] rounded-full p-[2px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A]">
                        <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-100 flex items-center justify-center">
                          {booking.workerId.profilePhoto ? (
                            <img src={booking.workerId.profilePhoto} alt="Provider" className="w-full h-full object-cover" />
                          ) : (
                            <User size={24} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#000000] font-semibold text-[16px]">{booking.workerId.firstName}</span>
                          <div className="bg-[#2E9E5B]/10 text-[#2E9E5B] text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Check size={10} strokeWidth={3} /> VERIFIED
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-[#FF7A00]">
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <Star size={12} fill="currentColor" />
                          <span className="text-[#6B6B6B] text-[12px] ml-1">(5.0)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 rounded-full bg-[#FFF8F1] text-[#FF7A00] flex items-center justify-center hover:bg-[#FFF1E3] transition-colors border border-[#FF7A00]/20 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]">
                        <Phone size={18} />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-[#FFF8F1] text-[#FF7A00] flex items-center justify-center hover:bg-[#FFF1E3] transition-colors border border-[#FF7A00]/20 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]">
                        <MessageCircle size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. FOOTER ACTIONS */}
                <div className="bg-[#FFF8F1] border-t border-[#E8E2DB] p-5 md:px-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                  <button className="w-full sm:w-auto px-6 py-[14px] bg-white border border-[#E8E2DB] text-[#B42318] font-semibold text-[15px] rounded-[12px] hover:bg-[#FDECEC] hover:border-[#F3B8B2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A00]">
                    Cancel booking
                  </button>
                  <button className="w-full sm:w-auto px-6 py-[14px] bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] text-white font-poppins font-semibold text-[15px] rounded-[12px] shadow-[0_8px_22px_rgba(255,122,0,0.30)] hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#FF7A00] flex items-center justify-center gap-2">
                    <MessageCircle size={18} /> Contact provider
                  </button>
                </div>
              </div>`;

code = code.substring(0, start) + newCard + code.substring(end);
fs.writeFileSync('frontend-web/src/pages/customer/BookingDetail.jsx', code);
console.log('Successfully redesigned Booking Details card!');
