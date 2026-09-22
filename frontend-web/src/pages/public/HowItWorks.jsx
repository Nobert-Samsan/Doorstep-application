import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, ChevronDown, MessageSquare, PhoneCall, Search, Star, CreditCard, ShieldCheck, MapPin, UserCheck, Briefcase, Info, Smartphone, FileText } from 'lucide-react';

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

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('customer');

  const customerSteps = [
    {
      title: 'Create Your Free Account',
      desc: 'Register in just 2 minutes using your phone number or email. Verify your identity with a 6 digit OTP sent to your phone. Your personal details are always kept private and never shared with workers.',
      ticks: ['Free registration', 'No credit card required', 'OTP phone verification'],
      icon: Smartphone,
      imgUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&q=80'
    },
    {
      title: 'Search Workers or Post a Job',
      desc: 'Browse verified workers by service category and your district. Filter by rating, experience and price. Or simply post your job request and let nearby workers apply to you — you choose who to hire.',
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
      desc: 'The worker reviews your request and accepts. You get an instant SMS and app notification confirming the booking. The worker arrives at your home at the agreed time. Chat with them securely through the app — your phone number is never shared.',
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
      desc: 'Pay online through the app or in cash directly to the worker — your choice. After payment, leave a star rating and written review to help other Sri Lankan families find great workers near them.',
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
      desc: 'Our admin team carefully reviews all your submitted documents. Once approved your profile goes live and customers across all 25 districts of Sri Lanka can find and book you.',
      icon: ShieldCheck,
      imgUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
    },
    {
      title: 'Receive Job Requests',
      desc: 'Get instant SMS and app notifications for new job requests matching your skill category and service area. Respond quickly — urgent jobs have a countdown timer and go to the fastest responding worker.',
      icon: Smartphone,
      imgUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
    },
    {
      title: 'Accept and Go to the Customer',
      desc: 'Accept the booking through the app. The customer\'s full address is revealed only after you accept. Mark yourself as en route — the customer gets notified instantly. Arrive at the scheduled date and time.',
      icon: MapPin,
      imgUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&q=80'
    },
    {
      title: 'Complete the Job',
      desc: 'Do excellent work. For variable price jobs send a detailed quotation through the app after assessing the work — showing labour cost, materials and total. The customer approves before you begin. Mark the job as complete when done.',
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
    { q: "Is DoorStep completely free for customers?", a: "Yes, completely free. Customers never pay any fees or commission to DoorStep. You only pay the worker's agreed service charge — nothing more and nothing less." },
    { q: "How are workers verified before joining?", a: "Every worker submits their National Identity Card (NIC) front and back, qualification certificates or training documents, a selfie holding their NIC, and bank account details. Our admin team reviews all documents carefully before approving any worker profile." },
    { q: "Can I pay the worker in cash?", a: "Yes, absolutely. You can pay the worker directly in cash after the job is completed. The worker then confirms cash receipt through the DoorStep app and the job is marked as fully settled in the system." },
    { q: "What if I am not satisfied with the completed work?", a: "Contact our support team immediately. We will help mediate and resolve any dispute between you and the worker fairly and quickly. Workers who receive consistent complaints are suspended from the platform." },
    { q: "How does the in-app chat work?", a: "Once a booking is confirmed both you and the worker can chat directly through the DoorStep app. Phone numbers are never shared — all communication is secure inside the platform. Any attempt to share phone numbers is automatically detected and blocked." },
    { q: "How long does worker approval take?", a: "Our admin team typically reviews and approves worker applications within 24 to 48 hours on business days. Workers receive an SMS and email notification once their account is approved and their profile goes live." },
    { q: "What is the 10% commission and who pays it?", a: "Workers pay DoorStep 10% of each completed job amount as a platform commission. This is deducted from the worker's earnings only. Customers always pay the full agreed amount to the worker and DoorStep charges customers nothing extra at all." },
    { q: "Can I book the same worker again for future jobs?", a: "Yes. You can save your favourite workers to your profile and book them directly any time for future jobs. Your saved workers list is always accessible from your customer dashboard." },
    { q: "What if a worker cancels or does not show up?", a: "You will be notified immediately if a worker cancels. You can then search for another available worker or post a new job request. Workers who repeatedly cancel or fail to show up are penalised and suspended from the platform." },
    { q: "Is my home address shared with all workers?", a: "No. Your full home address is only revealed to a worker after they have officially accepted your booking request. Before acceptance only your district and city are visible to workers. Your privacy and safety are our top priority." }
  ];

  const renderSteps = (steps) => (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 font-bold text-sm rounded-full mb-4 uppercase tracking-wider">
            Step by Step Guide
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {activeTab === 'customer' ? 'How Customers Use DoorStep' : 'How Workers Use DoorStep'}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            From finding a worker to getting the job done — here is exactly how it works
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            const StepIcon = step.icon;
            return (
              <div key={idx} className={`flex flex-col lg:flex-row items-center gap-12 ${!isLeft ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1 relative">
                  <div className="absolute -top-12 -left-6 text-9xl font-black text-amber-50 select-none z-0">
                    0{idx + 1}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">{step.desc}</p>
                    {step.ticks && (
                      <ul className="space-y-3">
                        {step.ticks.map((tick, i) => (
                          <li key={i} className="flex items-center text-gray-700 font-medium">
                            <CheckCircle2 size={20} className="text-green-500 mr-3" />
                            {tick}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex-1 w-full max-w-md mx-auto">
                  <div className="bg-amber-50 rounded-2xl border border-amber-100 shadow-lg h-80 relative overflow-hidden group">
                    <img 
                      src={step.imgUrl} 
                      alt={step.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 right-4 bg-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-primary z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <StepIcon size={24} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 1. Hero Banner */}
      <section className="relative bg-gradient-to-r from-amber-600 to-amber-500 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M45,-77.3C58.3,-68.8,69.1,-55.5,77.5,-40.7C85.9,-25.9,91.8,-9.6,90.4,6.2C89.1,21.9,80.4,37.1,70,50.7C59.5,64.2,47.3,76.1,32.3,81.4C17.2,86.8,-0.7,85.5,-16.8,80.2C-32.8,74.9,-47,65.6,-57.8,53.4C-68.6,41.2,-76,26.2,-79.6,10.2C-83.3,-5.7,-83.1,-22.6,-76.3,-36.8C-69.5,-51.1,-56,-62.7,-41.8,-70.9C-27.6,-79.1,-13.8,-83.9,1.4,-86.3C16.6,-88.7,31.7,-85.7,45,-77.3Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center text-amber-100 text-sm mb-8 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-white">How It Works</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            How DoorStep Works
          </h1>
          <p className="text-lg md:text-xl text-amber-100 max-w-2xl mx-auto">
            Simple, safe and transparent — from search to job completion in just a few steps
          </p>
        </div>
      </section>

      {/* 2. Tab Selector */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto flex justify-center">
          <button 
            onClick={() => setActiveTab('customer')}
            className={`w-[220px] py-4 text-[16px] font-semibold flex flex-col items-center justify-center transition-colors border-b-4 ${activeTab === 'customer' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <span>👤 For Customers</span>
            <span className="text-xs font-normal opacity-80">(Homeowners)</span>
          </button>
          <div className="w-px bg-gray-200 my-4"></div>
          <button 
            onClick={() => setActiveTab('worker')}
            className={`w-[220px] py-4 text-[16px] font-semibold flex flex-col items-center justify-center transition-colors border-b-4 ${activeTab === 'worker' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <span>🔧 For Workers</span>
            <span className="text-xs font-normal opacity-80">(Service Providers)</span>
          </button>
        </div>
      </section>

      {/* Steps Content */}
      {activeTab === 'customer' ? renderSteps(customerSteps) : renderSteps(workerSteps)}

      {/* Commission Policy (Only for Workers) */}
      {activeTab === 'worker' && (
        <section className="py-20 bg-amber-50">
          <div className="max-w-[780px] mx-auto px-4">
            <div className="bg-white rounded-xl border border-amber-300 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-primary"><Info size={28} /></div>
                <h3 className="text-2xl font-bold text-gray-900">Our Commission Policy — Transparent and Fair</h3>
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed">
                DoorStep earns by charging workers a small 10% commission on each completed job. Customers always pay only the worker's agreed price — DoorStep charges customers absolutely nothing extra ever.
              </p>
              
              <div className="rounded-lg overflow-hidden border border-gray-200 mb-6 text-sm md:text-base">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="p-3 font-semibold">Job Amount</th>
                      <th className="p-3 font-semibold">Commission 10%</th>
                      <th className="p-3 font-semibold">Worker Receives</th>
                      <th className="p-3 font-semibold">Customer Pays</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { job: 2000, comm: 200, recv: 1800, pay: 2000 },
                      { job: 5000, comm: 500, recv: 4500, pay: 5000 },
                      { job: 8000, comm: 800, recv: 7200, pay: 8000 },
                      { job: 12000, comm: 1200, recv: 10800, pay: 12000 },
                      { job: 20000, comm: 2000, recv: 18000, pay: 20000 }
                    ].map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                        <td className="p-3 border-b border-gray-100 text-gray-800">Rs. {row.job.toLocaleString()}</td>
                        <td className="p-3 border-b border-gray-100 text-red-500 font-medium">Rs. {row.comm.toLocaleString()}</td>
                        <td className="p-3 border-b border-gray-100 text-green-600 font-bold">Rs. {row.recv.toLocaleString()}</td>
                        <td className="p-3 border-b border-gray-100 text-gray-800 font-medium">Rs. {row.pay.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="space-y-2 text-sm font-medium">
                <p className="text-green-600 flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  Customers are never charged any commission or platform fee — zero extra charges
                </p>
                <p className="text-primary flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  Workers pay commission only after successfully completing a paid job — no upfront fees ever
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Accordion */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 font-bold text-sm rounded-full mb-4 uppercase tracking-wider">
              Got Questions?
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500">Everything you need to know about using DoorStep</p>
          </div>
          
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions Banner */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-lg text-amber-100 mb-10">
            Our support team is here to help you — Monday to Saturday 8am to 6pm
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="tel:+94112345678" className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 shadow-lg transition-all flex items-center justify-center gap-2">
              <PhoneCall size={20} /> Call Us: +94 11 234 5678
            </a>
            <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer" className="px-8 py-4 bg-gray-900 text-yellow-400 font-bold rounded-xl hover:bg-gray-800 shadow-lg transition-all flex items-center justify-center gap-2">
              <MessageSquare size={20} /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
