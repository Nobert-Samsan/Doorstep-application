const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

// Ensure Home, Wrench are imported
if (!code.includes('Wrench')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, Home, Wrench } from 'lucide-react';");
}

// 1. Update customerSteps to include bolded text for Step 1
code = code.replace(
  "'Register in just 2 minutes using your phone number or email. Verify your identity with a 6 digit OTP sent to your phone. Your personal details are always kept private and never shared with workers.'",
  "'Register in just <span class=\"font-semibold text-black\">2 minutes</span> using your phone number or email. Verify your identity with a <span class=\"font-semibold text-black\">6 digit OTP</span> sent to your phone. Your personal details are always kept private and <span class=\"font-semibold text-black\">never shared with workers</span>.'"
);

// 2. Update step 1 image to use the new one provided
code = code.replace(
  "'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&q=80'",
  "'/step1-customer.jpg'"
);

// 3. Replace renderSteps and Tab Selector
const tabSelectorStart = code.indexOf('{/* 2. Tab Selector */}');
const stepsContentEnd = code.indexOf('{/* Commission Policy (Only for Workers) */}');

if (tabSelectorStart !== -1 && stepsContentEnd !== -1) {
  const newTabsAndSteps = `{/* 2. Tab Selector - Pill Style */}
      <section className="bg-white border-b border-[#E8E2DB] sticky top-0 md:top-[72px] z-40 shadow-[0_4px_12px_rgba(0,0,0,0.02)] pt-6 pb-4">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8">
          <div className="flex justify-center">
            <div className="relative flex p-[6px] bg-[#FFF8F1] rounded-full border border-[#E8E2DB] shadow-[0_6px_20px_rgba(0,0,0,0.05)]" role="tablist">
              
              {/* Sliding Active Pill */}
              <div 
                className="absolute top-[6px] bottom-[6px] w-[160px] sm:w-[220px] rounded-full bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] shadow-[0_6px_16px_rgba(255,122,0,0.3)] transition-transform duration-300 ease-in-out"
                style={{ transform: activeTab === 'customer' ? 'translateX(0)' : 'translateX(100%)' }}
              ></div>

              <button 
                onClick={() => setActiveTab('customer')}
                role="tab"
                aria-selected={activeTab === 'customer'}
                className={\`relative z-10 w-[160px] sm:w-[220px] py-3 flex flex-col items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] \${activeTab === 'customer' ? 'text-white' : 'text-[#000000] hover:bg-[#FFF1E3]'}\`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <Home size={16} className={activeTab === 'customer' ? 'text-white' : 'text-[#6B6B6B]'} />
                  <span className="font-poppins font-semibold text-[13px] sm:text-[15px]">For Customers</span>
                </div>
                <span className={\`text-[10px] sm:text-[12px] mt-0.5 \${activeTab === 'customer' ? 'text-white/85' : 'text-[#6B6B6B]'}\`}>(Homeowners)</span>
              </button>

              <button 
                onClick={() => setActiveTab('worker')}
                role="tab"
                aria-selected={activeTab === 'worker'}
                className={\`relative z-10 w-[160px] sm:w-[220px] py-3 flex flex-col items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] \${activeTab === 'worker' ? 'text-white' : 'text-[#000000] hover:bg-[#FFF1E3]'}\`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <Wrench size={16} className={activeTab === 'worker' ? 'text-white' : 'text-[#6B6B6B]'} />
                  <span className="font-poppins font-semibold text-[13px] sm:text-[15px]">For Workers</span>
                </div>
                <span className={\`text-[10px] sm:text-[12px] mt-0.5 \${activeTab === 'worker' ? 'text-white/85' : 'text-[#6B6B6B]'}\`}>(Service Providers)</span>
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Steps Content Redesigned */}
      <div className="bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8 pt-16 pb-12 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FF7A00]/7 blur-[100px] pointer-events-none rounded-full"></div>
          <div className="relative z-10">
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 bg-[#FFF1E3] border border-[#FF7A00]/30 px-4 py-1.5 rounded-full mb-6">
                <div className="w-2 h-2 rounded-full bg-[#FF7A00]"></div>
                <span className="text-[#E86100] text-[13px] font-semibold uppercase tracking-[0.12em]">Step By Step Guide</span>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-poppins font-bold text-[#000000] mb-6 leading-tight">
                How {activeTab === 'customer' ? 'Customers' : 'Workers'} Use <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">DoorStep</span>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[60px] h-[4px] rounded-full bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]"></div>
                </span>
              </h2>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="font-inter text-[17px] md:text-[18px] text-[#6B6B6B] max-w-[600px] mx-auto">
                From finding a worker to getting the job done — here is exactly how it works
              </p>
            </FadeIn>
          </div>
        </div>

        <div className="relative pb-8">
          {/* Timeline lines */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0 border-l border-dashed border-[#FF7A00]/35 -translate-x-1/2 z-0"></div>
          <div className="block lg:hidden absolute left-[32px] md:left-[40px] top-0 bottom-0 w-0 border-l border-dashed border-[#FF7A00]/35 z-0"></div>

          {(activeTab === 'customer' ? customerSteps : workerSteps).map((step, idx) => {
            const isLeft = idx % 2 === 0;
            const StepIcon = step.icon;
            
            return (
              <div key={idx} className={\`relative w-full \${idx % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#FFF8F1]'} py-14 lg:py-20 overflow-hidden\`}>
                <FadeIn delay={100}>
                <div className="max-w-[1100px] mx-auto px-6 md:px-8 relative z-10">
                  
                  {/* Step Number Bubble */}
                  <div className="absolute left-[32px] md:left-[40px] lg:left-1/2 top-14 lg:top-1/2 -translate-x-1/2 lg:-translate-y-1/2 w-[48px] h-[48px] lg:w-[56px] lg:h-[56px] rounded-full bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] shadow-[0_0_0_8px_rgba(255,122,0,0.1)] flex items-center justify-center z-20">
                    <span className="text-white font-poppins font-bold text-[20px]">{idx + 1}</span>
                  </div>

                  <div className={\`flex flex-col lg:flex-row items-center gap-12 lg:gap-[64px] \${!isLeft ? 'lg:flex-row-reverse' : ''} ml-[48px] md:ml-[64px] lg:ml-0\`}>
                    
                    {/* Text Content */}
                    <div className="flex-1 w-full relative">
                      <div className="absolute -top-12 left-0 text-[72px] font-poppins font-bold text-transparent select-none pointer-events-none" style={{ WebkitTextStroke: '2px rgba(255,122,0,0.18)' }}>
                        0{idx + 1}
                      </div>
                      <div className="relative z-10 pt-4">
                        <div className="text-[#FF7A00] uppercase text-[13px] font-semibold tracking-[0.12em] mb-3">
                          STEP {idx + 1}
                        </div>
                        <h3 className="text-[28px] lg:text-[32px] font-poppins font-bold text-[#000000] mb-5 leading-tight">{step.title}</h3>
                        <p className="font-inter text-[16px] lg:text-[17px] text-[#3D3D3D] leading-[1.75] mb-8" dangerouslySetInnerHTML={{ __html: step.desc.replace(/ΓÇö/g, '—') }}></p>
                        
                        {step.ticks && (
                          <ul className="space-y-3">
                            {step.ticks.map((tick, i) => (
                              <li key={i} className="flex items-center text-[#000000] font-medium text-[16px] gap-3">
                                <div className="w-[24px] h-[24px] rounded-full bg-[#2E9E5B]/12 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle2 size={14} className="text-[#2E9E5B] stroke-[3]" />
                                </div>
                                {tick}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Image Content */}
                    <div className="flex-1 w-full max-w-[500px] lg:max-w-none relative group">
                      <div className="absolute top-[14px] left-[14px] w-full h-full rounded-[24px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] opacity-18 pointer-events-none"></div>
                      <div className="relative bg-[#FFF8F1] rounded-[24px] overflow-hidden aspect-[4/3] shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                        <img 
                          src={step.imgUrl} 
                          alt={step.title} 
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#FF7A00]/4 pointer-events-none mix-blend-overlay"></div>
                        
                        <div className="absolute -bottom-2 -left-2 lg:bottom-4 lg:-left-6 w-[56px] h-[56px] rounded-[16px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_12px_24px_rgba(255,122,0,0.4)] z-20 transition-transform duration-300 group-hover:-translate-y-2">
                          <StepIcon size={28} className="text-white" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                </FadeIn>
              </div>
            );
          })}
        </div>
        
        {/* Closing Strip */}
        <div className="py-16 text-center border-t border-[#E8E2DB] bg-white">
          <FadeIn delay={0}>
            <h3 className="text-[20px] font-poppins font-semibold text-[#000000] mb-6">Ready to start?</h3>
            <div className="flex flex-col items-center justify-center gap-3">
              <Link to={activeTab === 'customer' ? "/register" : "/register"} className="group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-poppins font-semibold text-[16px] py-[14px] px-[28px] rounded-[12px] shadow-[0_8px_24px_rgba(255,122,0,0.35)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(255,122,0,0.45)] transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]">
                {activeTab === 'customer' ? "Create Free Account" : "Join as a Worker"}
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <span className="text-[13px] text-[#6B6B6B] font-medium">Free to join. No credit card required.</span>
            </div>
          </FadeIn>
        </div>

      </div>

      `;
  code = code.substring(0, tabSelectorStart) + newTabsAndSteps + code.substring(stepsContentEnd);
}

// Remove renderSteps definition from top
const renderStepsDefStart = code.indexOf('const renderSteps =');
if (renderStepsDefStart !== -1) {
  const renderStepsDefEnd = code.indexOf('return (', renderStepsDefStart);
  // Actually, we don't need renderSteps at all anymore since we render inline, 
  // but wait, I just replaced the entire usage of renderSteps.
  // Oh, wait, the original file had `renderSteps` defined OUTSIDE the component? No, inside.
  // Let me just regex replace the definition of renderSteps with empty string.
  // We can leave it unused, but it's cleaner to remove it.
  
  // Let's just remove the renderSteps function
  // It ends at: `  );` just before `return (` of the main component
  const endOfRenderSteps = code.indexOf('return (', renderStepsDefStart);
  if (endOfRenderSteps !== -1) {
    code = code.substring(0, renderStepsDefStart) + code.substring(endOfRenderSteps);
  }
}

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log('Successfully redesigned Tab Selector and Steps List');
