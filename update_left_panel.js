const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/auth/Login.jsx', 'utf8');

const start = code.indexOf('{/* LEFT BRAND PANEL (Desktop Only) */}');
const end = code.indexOf('{/* RIGHT FORM PANEL */}');

if (start !== -1 && end !== -1) {
  const newPanel = `{/* LEFT BRAND PANEL (Desktop Only) */}
      <div className="hidden md:flex flex-col w-[38%] lg:w-[45%] relative overflow-hidden px-8 lg:px-16 py-12 justify-between bg-[#000000]">
        
        {/* Background Image and Overlays */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src="/login-bg.jpg" 
            alt="Professional at work" 
            className="absolute inset-0 w-full h-full object-cover object-[center_top] animate-[slowZoom_1.4s_ease-out_forwards] pointer-events-none" 
            style={{ transformOrigin: 'top center' }}
          />
          {/* Unifying Tone Overlay */}
          <div className="absolute inset-0 bg-[#000000]/15 pointer-events-none"></div>
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/55 to-[#000000] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.92) 75%, #000000 100%)' }}></div>
        </div>

        {/* Subtle Decorative Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#FF7A00]/18 rounded-full blur-[100px] pointer-events-none"></div>

        <style dangerouslySetInnerHTML={{__html: \`
          @keyframes slowZoom {
            from { transform: scale(1.08); }
            to { transform: scale(1); }
          }
        \`}} />

        {/* Top Logo */}
        <FadeIn delay={0} className="relative z-10">
          <Link to="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-[#FF7A00] rounded">
            <div className="bg-white p-3 rounded-[12px] inline-block shadow-lg">
              <img src="/logo-new.png" alt="DoorStep" className="h-[2.5rem] object-contain" />
            </div>
            <p className="text-white/80 text-[14px] mt-3 font-inter drop-shadow-md">Sri Lanka's trusted home services platform</p>
          </Link>
        </FadeIn>

        {/* Center Content */}
        <div className="relative z-10 mt-12 mb-auto flex-1 flex flex-col justify-end pb-8">
          <FadeIn delay={100}>
            <h1 className="text-[32px] lg:text-[48px] font-poppins font-bold text-white leading-[1.15] mb-10 max-w-[480px] drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
              Find trusted workers <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A] drop-shadow-none">right at your doorstep</span>
              <svg className="inline-block ml-3 w-8 h-8 lg:w-10 lg:h-10 text-white fill-[url(#orange-grad)] drop-shadow-md" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="orange-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF9F0A" />
                    <stop offset="100%" stopColor="#F94D1A" />
                  </linearGradient>
                </defs>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="url(#orange-grad)" stroke="none"></path>
                <polyline points="9 22 9 12 15 12 15 22" stroke="white" fill="none"></polyline>
              </svg>
            </h1>
          </FadeIn>

          <div className="flex flex-col gap-3.5">
            {[
              { icon: ShieldCheck, text: "Verified Workers Island-wide", highlight: "Verified Workers" },
              { icon: Lock, text: "Your contact details are always protected", highlight: "always protected" },
              { icon: Zap, text: "Average response time under 8 minutes", highlight: "under 8 minutes" }
            ].map((feature, idx) => (
              <FadeIn delay={200 + (idx * 100)} key={idx}>
                <div className="group flex items-center gap-4 bg-[#111111]/82 backdrop-blur-[12px] border border-white/10 rounded-[16px] p-4 pr-5 hover:border-[#FF7A00]/50 hover:-translate-y-[3px] transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                  <div className="flex-shrink-0 w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center">
                    <feature.icon size={20} className="text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-white/90 font-inter text-[15px] leading-snug drop-shadow-sm">
                    {feature.text.split(feature.highlight).map((part, i) => 
                      i === 0 ? <React.Fragment key={i}>{part}<span className="text-white font-semibold drop-shadow-sm">{feature.highlight}</span></React.Fragment> : <React.Fragment key={i}>{part}</React.Fragment>
                    )}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

      </div>

      `;

  code = code.substring(0, start) + newPanel + code.substring(end);
  fs.writeFileSync('frontend-web/src/pages/auth/Login.jsx', code);
  console.log('Successfully updated Left Brand Panel with photo background!');
}
