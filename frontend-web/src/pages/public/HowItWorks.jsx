import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {     ChevronRight, CheckCircle2, ChevronDown, MessageSquare, PhoneCall, Search, Star, CreditCard, ShieldCheck, MapPin, UserCheck, Briefcase, Info, Smartphone, FileText , ArrowDown, ArrowRight , Home, Wrench , UserPlus, Check, FileQuestion , Headset } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-xl border border-amber-200 overflow-hidden mb-2 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-4 focus:outline-none bg-white hover:bg-gray-50"
      >
        <span className="text-gray-900 font-bold text-sm text-left">{question}</span>
        <ChevronDown size={18} className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 pt-0">
          <div className="border-l-4 border-primary pl-4">
            <p className="text-gray-600 text-sm">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


const useIntersectionObserver = (ref, options) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
  return isIntersecting;
};

const FadeIn = ({ children, delay = 0 }) => {
  const ref = React.useRef(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

const HowItWorks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl === 'worker' ? 'worker' : 'customer');

  React.useEffect(() => {
    if (tabFromUrl === 'worker' || tabFromUrl === 'customer') {
      setActiveTab(tabFromUrl);
      const timer = setTimeout(() => {
        const el = document.getElementById('steps-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [tabFromUrl]);

  const customerSteps = [
    {
      title: 'Create Your Free Account',
      desc: 'Register in just <span class="font-semibold text-black">2 minutes</span> using your phone number or email. Verify your identity with a <span class="font-semibold text-black">6 digit OTP</span> sent to your phone. Your personal details are always kept private and <span class="font-semibold text-black">never shared with workers</span>.',
      ticks: ['Free registration', 'No credit card required', 'OTP phone verification'],
      icon: Smartphone,
      imgUrl: '/step1-customer.jpg'
    },
    {
      title: 'Search Workers or Post a Job',
      desc: 'Browse verified workers by service category and your district. Filter by rating, experience and price. Or simply post your job request and let nearby workers apply to you, so you choose who to hire.',
      icon: Search,
      imgUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
    },
    {
      title: 'Review Profiles and Book',
      desc: 'View full worker profiles showing their experience, qualifications, ratings from other customers, sample work photos and pricing. Send a booking request with your preferred date and time.',
      icon: UserCheck,
      imgUrl: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&q=80'
    },
    {
      title: 'Worker Accepts and Arrives',
      desc: 'The worker reviews your request and accepts. You get an instant SMS and app notification confirming the booking. The worker arrives at your home at the agreed time. Chat with them securely through the app, where your phone number is never shared.',
      icon: MessageSquare,
      imgUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'
    },
    {
      title: 'Job Gets Done',
      desc: 'The worker completes the job. For variable price jobs like electrical or plumbing work, the worker sends you a detailed quotation through the app after assessing the work on site. You review and approve the quotation before work begins.',
      icon: Briefcase,
      imgUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80'
    },
    {
      title: 'Pay and Leave a Review',
      desc: 'Pay online through the app or in cash directly to the worker, your choice. After payment, leave a star rating and written review to help other Sri Lankan families find great workers near them.',
      icon: Star,
      imgUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80'
    }
  ];

  const workerSteps = [
    {
      title: 'Apply to Join DoorStep',
      desc: 'Submit your personal details, skills, years of experience, NIC document, qualification certificates and profile photo. Our admin team reviews your application within 24 to 48 hours.',
      ticks: ['Free to join', 'No upfront fees', 'Document verified process'],
      icon: FileText,
      imgUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80'
    },
    {
      title: 'Get Verified and Approved',
      desc: 'Our admin team carefully reviews all your submitted documents. Once approved your profile goes live and customers across Western Province of Sri Lanka can find and book you.',
      icon: ShieldCheck,
      imgUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
    },
    {
      title: 'Receive Job Requests',
      desc: 'Get instant SMS and app notifications for new job requests matching your skill category and service area. Respond quickly. Urgent jobs have a countdown timer and go to the fastest responding worker.',
      icon: Smartphone,
      imgUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
    },
    {
      title: 'Accept and Go to the Customer',
      desc: 'Accept the booking through the app. The customer\'s full address is revealed only after you accept. Mark yourself as en route, the customer gets notified instantly. Arrive at the scheduled date and time.',
      icon: MapPin,
      imgUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&q=80'
    },
    {
      title: 'Complete the Job',
      desc: 'Do excellent work. For variable price jobs send a detailed quotation through the app after assessing the work, showing labour cost, materials and total. The customer approves before you begin. Mark the job as complete when done.',
      icon: Briefcase,
      imgUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80'
    },
    {
      title: 'Get Paid and Build Your Reputation',
      desc: 'Customer pays online or in cash. Your 10% platform commission is automatically tracked. Receive genuine reviews that build your reputation and bring more job requests. Grow your client base across Sri Lanka.',
      icon: CreditCard,
      imgUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80'
    }
  ];

  const faqs = [
    { q: "Is DoorStep completely free for customers?", a: "Yes, completely free. Customers never pay any fees or commission to DoorStep. You only pay the worker's agreed service charge ΓÇö nothing more and nothing less." },
    { q: "How are workers verified before joining?", a: "Every worker submits their National Identity Card (NIC) front and back, qualification certificates or training documents, a selfie holding their NIC, and bank account details. Our admin team reviews all documents carefully before approving any worker profile." },
    { q: "Can I pay the worker in cash?", a: "Yes, absolutely. You can pay the worker directly in cash after the job is completed. The worker then confirms cash receipt through the DoorStep app and the job is marked as fully settled in the system." },
    { q: "What if I am not satisfied with the completed work?", a: "Contact our support team immediately. We will help mediate and resolve any dispute between you and the worker fairly and quickly. Workers who receive consistent complaints are suspended from the platform." },
    { q: "How does the in-app chat work?", a: "Once a booking is confirmed both you and the worker can chat directly through the DoorStep app. Phone numbers are never shared ΓÇö all communication is secure inside the platform. Any attempt to share phone numbers is automatically detected and blocked." },
    { q: "How long does worker approval take?", a: "Our admin team typically reviews and approves worker applications within 24 to 48 hours on business days. Workers receive an SMS and email notification once their account is approved and their profile goes live." },
    { q: "What is the 10% commission and who pays it?", a: "Workers pay DoorStep 10% of each completed job amount as a platform commission. This is deducted from the worker's earnings only. Customers always pay the full agreed amount to the worker and DoorStep charges customers nothing extra at all." },
    { q: "Can I book the same worker again for future jobs?", a: "Yes. You can save your favourite workers to your profile and book them directly any time for future jobs. Your saved workers list is always accessible from your customer dashboard." },
    { q: "What if a worker cancels or does not show up?", a: "You will be notified immediately if a worker cancels. You can then search for another available worker or post a new job request. Workers who repeatedly cancel or fail to show up are penalised and suspended from the platform." },
    { q: "Is my home address shared with all workers?", a: "No. Your full home address is only revealed to a worker after they have officially accepted your booking request. Before acceptance only your district and city are visible to workers. Your privacy and safety are our top priority." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 1. Hero Banner - Clean Minimalist */}
      <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[96vh] bg-[#000000] overflow-hidden flex items-center pt-16 sm:pt-20 lg:pt-0 pb-8 lg:pb-0">
        
        {/* Decorative background glow & pattern */}
        
        

        {/* Image side (Mobile: top 42% height, Desktop: right 50% width) */}
        <div className="absolute top-0 right-0 w-full h-[50%] sm:h-[70%] md:h-[85%] lg:h-full overflow-hidden">
          <img 
            src="/how-it-works-hero-new.jpg" 
            alt="A smiling homeowner booking a DoorStep professional on her phone" 
            className="w-full h-full object-cover object-[center_center] lg:object-right opacity-0 animate-[fadeInImage_1.2s_ease-out_0.2s_forwards]"
            fetchPriority="high"
          />
          {/* Mobile bottom fade to black */}
          <div className="absolute inset-0 block md:hidden" style={{ background: "linear-gradient(180deg, transparent 70%, #000000 100%)" }}></div>
          {/* Desktop left fade to black */}
          <div className="absolute inset-0 hidden md:block pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 25%, rgba(0,0,0,0.3) 45%, transparent 65%)" }}></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 w-full flex flex-col items-start mt-24 sm:mt-32 lg:mt-0">
          <div className="max-w-[600px] w-full pt-4 lg:pt-24">
            


            <FadeIn delay={200}>
              {/* Headline */}
              <h1 className="text-[30px] sm:text-[44px] lg:text-[52px] xl:text-[72px] font-poppins font-extrabold text-white leading-[1.1] mb-3 lg:mb-6">
                How <span className="relative inline-block whitespace-nowrap">
                  <span className="text-[#FF7A00]">DoorStep Works</span>
                  
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={300}>
              {/* Subtitle */}
              <p className="font-inter text-[16px] sm:text-[18px] md:text-[22px] font-normal text-white/80 leading-[1.7] max-w-[540px]">
                Your journey to a perfectly maintained home is simple and transparent. Here is how we connect you with the best professionals in Sri Lanka.
              </p>
            </FadeIn>
            
          </div>
        </div>

        {/* Bottom edge gradient divider */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent opacity-80 z-20"></div>

        {/* CSS for animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeInImage {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}} />
      </section>

      {/* 2. Tab Selector - Pill Style */}
      <section id="steps-section" className="bg-white border-b border-[#E8E2DB] sticky top-0 md:top-[72px] z-40 shadow-[0_4px_12px_rgba(0,0,0,0.02)] pt-6 pb-4 scroll-mt-20">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8">
          <div className="flex justify-center">
            <div className="relative flex p-[6px] bg-[#FFF8F1] rounded-full border border-[#E8E2DB] shadow-[0_6px_20px_rgba(0,0,0,0.05)]" role="tablist">
              
              {/* Sliding Active Pill */}
              <div 
                className="absolute top-[6px] bottom-[6px] w-[160px] sm:w-[220px] rounded-full bg-[#FF7A00] shadow-[0_4px_12px_rgba(255,122,0,0.20)] transition-transform duration-200 ease-in-out"
                style={{ transform: activeTab === 'customer' ? 'translateX(0)' : 'translateX(100%)' }}
              ></div>

              <button 
                onClick={() => {
                  setActiveTab('customer');
                  setSearchParams({ tab: 'customer' }, { replace: true });
                }}
                role="tab"
                aria-selected={activeTab === 'customer'}
                className={`relative z-10 w-[160px] sm:w-[220px] py-3 flex flex-col items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] ${activeTab === 'customer' ? 'text-white' : 'text-[#000000] hover:bg-[#FFF1E3]'}`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <Home size={16} className={activeTab === 'customer' ? 'text-white' : 'text-[#6B6B6B]'} />
                  <span className="font-poppins font-semibold text-[13px] sm:text-[15px]">For Customers</span>
                </div>
                <span className={`text-[10px] sm:text-[12px] mt-0.5 ${activeTab === 'customer' ? 'text-white/85' : 'text-[#6B6B6B]'}`}>(Homeowners)</span>
              </button>

              <button 
                onClick={() => {
                  setActiveTab('worker');
                  setSearchParams({ tab: 'worker' }, { replace: true });
                }}
                role="tab"
                aria-selected={activeTab === 'worker'}
                className={`relative z-10 w-[160px] sm:w-[220px] py-3 flex flex-col items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] ${activeTab === 'worker' ? 'text-white' : 'text-[#000000] hover:bg-[#FFF1E3]'}`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <Wrench size={16} className={activeTab === 'worker' ? 'text-white' : 'text-[#6B6B6B]'} />
                  <span className="font-poppins font-semibold text-[13px] sm:text-[15px]">For Workers</span>
                </div>
                <span className={`text-[10px] sm:text-[12px] mt-0.5 ${activeTab === 'worker' ? 'text-white/85' : 'text-[#6B6B6B]'}`}>(Service Providers)</span>
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Steps Content Redesigned */}
      <div className="bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8 pt-16 pb-12 text-center relative">
          
          <div className="relative z-10">

            <FadeIn delay={100}>
              <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-poppins font-bold text-[#000000] mb-6 leading-tight">
                How {activeTab === 'customer' ? 'Customers' : 'Workers'} Use <span className="relative inline-block">
                  <span className="text-[#E85D00]">DoorStep</span>
                  
                </span>
              </h2>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="font-inter text-[17px] md:text-[18px] text-[#6B6B6B] max-w-[600px] mx-auto">
                {activeTab === 'customer' 
                  ? "From finding a professional to getting the job done — here is exactly how it works" 
                  : "From receiving job requests to getting paid — here is exactly how it works"}
              </p>
            </FadeIn>
          </div>
        </div>

        <div className="relative pb-8">
          

          {(activeTab === 'customer' ? customerSteps : workerSteps).map((step, idx) => {
            const isLeft = idx % 2 === 0;
            const StepIcon = step.icon;
            
            return (
              <div key={idx} className={`relative w-full ${idx % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#FFF8F1]'} py-14 lg:py-20 overflow-hidden`}>
                <FadeIn delay={100}>
                <div className="max-w-[1100px] mx-auto px-6 md:px-8 relative z-10">

                  <div className={`flex flex-col lg:flex-row items-center gap-8 md:p-12 lg:gap-[100px] xl:gap-[120px] ${!isLeft ? 'lg:flex-row-reverse' : ''}`}>
                    
                    {/* Text Content */}
                    <div className="flex-1 w-full relative">
                      
                      <div className="relative z-10 pt-4">
                        <div className="mb-8 inline-flex">
                          <div className="w-[56px] h-[56px] rounded-full bg-[#FF7A00] flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(255,122,0,0.20)]">
                            <span className="text-white/90 font-poppins font-bold text-[11px] tracking-[0.12em] uppercase leading-none mb-1">Step</span>
                            <span className="text-white font-poppins font-extrabold text-[24px] leading-none">{idx + 1}</span>
                          </div>
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
                      
                      <div className="relative bg-[#FFF8F1] rounded-[16px] overflow-hidden aspect-[4/3] shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#E8E2DB]">
                        <img 
                          src={step.imgUrl} 
                          alt={step.title} 
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        
                        
                        
                      </div>
                    </div>

                  </div>
                </div>
                </FadeIn>
              </div>
            );
          })}
        </div>
        
        {/* Closing Strip Redesigned */}
        <div className="py-12 lg:py-16 bg-white">
          <div className="max-w-[1100px] mx-auto px-6 md:px-8">
            <div className="relative bg-[#000000] rounded-[16px] py-10 px-6 lg:py-14 lg:px-12 text-center overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-white/10">
              
              {/* Background Decorations */}
              
              
              
              
              
              <div className="relative z-10 flex flex-col items-center">
                <FadeIn delay={100}>
                  <h3 className="text-[28px] md:text-[32px] lg:text-[40px] font-poppins font-bold text-white mb-4 leading-[1.2]" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                    {activeTab === 'customer' ? 'Ready to start?' : 'Ready to grow?'}
                  </h3>
                  <p className="font-inter text-[16px] lg:text-[17px] text-white/95 max-w-[520px] mx-auto mb-8" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.12)' }}>
                    {activeTab === 'customer' 
                      ? "It takes about 2 minutes to create your account and find your first professional."
                      : "It takes about 2 minutes to apply and start getting verified job requests."}
                  </p>
                </FadeIn>

                <FadeIn delay={200}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-6">
                    <Link to={activeTab === 'customer' ? "/register" : "/register"} className="w-full sm:w-auto group bg-[#FF7A00] hover:bg-[#E86100] active:bg-[#CC5200] text-white font-poppins font-semibold text-[16px] py-[16px] px-[32px] rounded-[12px] shadow-[0_4px_12px_rgba(255,122,0,0.20)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#FF7A00]">
                      {activeTab === 'customer' ? <UserPlus size={18} /> : <Briefcase size={18} />}
                      {activeTab === 'customer' ? "Create Free Account" : "Join as a Worker"}
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </FadeIn>

                <FadeIn delay={300}>
                  <div className="flex items-center justify-center gap-2 text-white/90 font-inter text-[14px]">
                    <Check size={16} className="text-white" />
                    {activeTab === 'customer' ? "Free to join. No credit card required." : "Free to join. No hidden fees."}
                  </div>
</FadeIn>

              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Still Have Questions Banner Redesigned */}
      <section className="pt-8 pb-16 lg:pt-8 lg:pb-24 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8">
          <div className="relative bg-[#FFF8F1] border border-[#E8E2DB] rounded-[16px] py-10 px-6 lg:py-14 lg:px-12 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            
            {/* Background Decorations */}
            
            
            

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:p-12 lg:gap-8 md:gap-8 md:p-16">
              
              {/* Text Column */}
              <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
                
                
                <FadeIn delay={100}>
                  <h2 className="text-[28px] md:text-[32px] lg:text-[40px] font-poppins font-bold text-[#000000] mb-4 leading-[1.2]">
                    Still Have <span className="text-[#E85D00]">Questions?</span>
                  </h2>
                  <p className="font-inter text-[16px] lg:text-[17px] text-[#3D3D3D] max-w-[500px] leading-[1.7] mt-6">
                    Our support team is here to help you<br />
                    <span className="text-black font-semibold">Monday to Saturday 8am to 6pm</span>
                  </p>
                  
                  
                </FadeIn>
              </div>

              {/* Buttons Column */}
              <div className="flex-shrink-0 w-full lg:w-[320px] flex flex-col gap-5">
                <FadeIn delay={200}>
                  <div className="w-full">
                    <a href="tel:+94112345678" className="w-full group bg-[#FF7A00] hover:bg-[#E86100] active:bg-[#CC5200] text-white font-poppins font-semibold text-[16px] py-[16px] px-[28px] rounded-[12px] shadow-[0_4px_12px_rgba(255,122,0,0.20)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F1] outline-none">
                      <PhoneCall size={20} />
                      Call Us: +94 11 234 5678
                    </a>
                    <div className="text-[13px] text-[#6B6B6B] font-inter text-center mt-2.5">
                      Speak to our team directly
                    </div>
                  </div>
                </FadeIn>
                
                <FadeIn delay={300}>
                  <div className="w-full">
                    <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="w-full group bg-[#000000] text-white font-poppins font-semibold text-[16px] py-[16px] px-[28px] rounded-[12px] shadow-[0_10px_28px_rgba(0,0,0,0.20)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.30)] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F1] outline-none">
                      <MessageSquare size={20} className="text-[#25D366]" />
                      WhatsApp Us
                    </a>
                    <div className="text-[13px] text-[#6B6B6B] font-inter text-center mt-2.5">
                      Usually replies within minutes
                    </div>
                  </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
