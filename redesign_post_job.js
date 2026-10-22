const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/customer/Dashboard.jsx', 'utf8');

const start = code.indexOf('<section className="post-job-section">');
const end = code.indexOf('</section>', start) + '</section>'.length;

const newSection = `          {/* Post Job Banner Redesign */}
          <section className="w-full max-w-[1200px] mx-auto px-6 md:px-12 py-12 md:py-16">
            <div className="relative w-full rounded-[28px] p-6 md:px-10 md:py-8 overflow-hidden shadow-[0_20px_50px_rgba(249,77,26,0.28)] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-8 lg:gap-12 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #FF9F0A 0%, #FF7A00 45%, #F94D1A 100%)' }}>
              
              {/* Subtle Decorations */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none"></div>
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/12 rounded-full blur-[16px] pointer-events-none animate-[floatCard_8s_ease-in-out_infinite]"></div>
              <div className="absolute -bottom-32 -right-16 w-64 h-64 bg-white/12 rounded-full blur-[12px] pointer-events-none animate-[floatCard_8s_ease-in-out_infinite_reverse]"></div>
              <div className="absolute inset-0 pointer-events-none rounded-[28px] border-[1px] border-white/25"></div>

              {/* LEFT: Icon and Text */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6 w-full md:w-auto flex-1">
                <div className="shrink-0 w-16 h-16 bg-[#000000] rounded-[18px] flex items-center justify-center shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"></path></svg>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[22px] md:text-[26px] lg:text-[30px] font-poppins font-bold text-white leading-[1.2] mb-1.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
                    Don't know who to hire?
                  </h2>
                  <p className="text-white/95 font-inter text-[16px] md:text-[17px] leading-[1.6] max-w-[460px] drop-shadow-[0_1px_8px_rgba(0,0,0,0.12)] [text-wrap:balance]">
                    Describe what you need and get <span className="font-semibold text-white">quotes</span> from verified workers in <span className="font-semibold text-white">minutes</span>.
                  </p>
                </div>
              </div>

              {/* MIDDLE: Mini Benefits (Desktop/Tablet Only) */}
              <div className="relative z-10 hidden md:flex flex-col gap-3 shrink-0 mr-auto lg:mr-0">
                {[
                  'Free to post',
                  'Verified workers only',
                  'Compare quotes'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-[22px] h-[22px] rounded-full bg-white/22 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-white text-[14px] font-medium tracking-wide">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* RIGHT: Button */}
              <div className="relative z-10 w-full md:w-auto shrink-0 flex flex-col items-center md:items-end gap-2">
                <button 
                  onClick={() => navigate('/customer/post-job')}
                  className="w-full md:w-auto bg-[#000000] text-white font-poppins font-semibold text-[16px] rounded-[12px] px-7 py-4 flex items-center justify-center gap-2.5 shadow-[0_10px_28px_rgba(0,0,0,0.30)] hover:-translate-y-[3px] hover:shadow-[0_15px_35px_rgba(0,0,0,0.40)] transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FF7A00]"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Post a Job
                  <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
                <span className="text-white/90 text-[13px] font-inter">Takes about 2 minutes</span>
              </div>

            </div>
          </section>`;

if (start !== -1 && end !== -1) {
  code = code.substring(0, start) + newSection + code.substring(end);
  fs.writeFileSync('frontend-web/src/pages/customer/Dashboard.jsx', code);
  console.log('Successfully redesigned Post Job Banner!');
} else {
  console.log('Could not find Post Job block!');
}
