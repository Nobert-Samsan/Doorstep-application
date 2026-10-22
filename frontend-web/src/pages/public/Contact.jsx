import React from 'react';

const useIntersectionObserver = (ref, options) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsIntersecting(true);
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

import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, ChevronRight, PhoneCall, MessageSquare, Headset, MessageCircle } from 'lucide-react';

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero */}
            {/* 1. Hero Banner Redesigned */}
      <section className="relative flex flex-col lg:flex-row items-center lg:items-stretch bg-[#000000] min-h-[500px] md:min-h-[600px] lg:min-h-[96vh] pt-[60px] sm:pt-[80px] pb-6 lg:py-0 overflow-hidden">
        
        {/* Background Decorations */}
        
        

        {/* Desktop Image & Gradient */}
        <div className="hidden md:block absolute right-0 top-0 w-full md:w-[65%] lg:w-[58%] h-full z-0">
          <img 
            src="/contact-hero.jpg" 
            alt="A friendly DoorStep support team member wearing a headset" 
            className="w-full h-full object-cover object-[right_center]"
          />
          {/* Black shadow only to the half of the width of the hero image */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 25%, rgba(0,0,0,0.3) 45%, transparent 65%)' }}></div>
        </div>

        {/* Mobile Image & Gradient */}
        <div className="block md:hidden relative w-full h-[250px] sm:h-[400px] z-0 -mt-[60px] sm:-mt-[80px]">
          <img 
            src="/contact-hero.jpg" 
            alt="A friendly DoorStep support team member wearing a headset" 
            className="w-full h-full object-cover object-[right_center]"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, transparent 60%, #000000 100%)' }}></div>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 relative z-10 flex flex-col justify-center mt-[-20px] lg:mt-0">
          <div className="max-w-[600px] text-left">


            
            <FadeIn delay={200}>
              <h1 className="text-[38px] md:text-[52px] lg:text-[64px] font-poppins font-bold text-white mb-2 lg:mb-6 leading-[1.1]">
                Contact <span className="text-[#FF7A00]">
                  Us
                  
                </span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={300}>
              <p className="font-inter text-[18px] lg:text-[20px] text-white/80 max-w-[520px] leading-[1.6] mb-4 lg:mb-10">
                We're here to help. Get in touch with our support team for any questions or assistance.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Bottom Edge Gradient Line */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent opacity-60 z-30"></div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:p-8 md:p-12">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in touch</h2>
              <p className="text-gray-600 mb-8">
                Whether you have a question about booking a worker, pricing, or anything else, our team is ready to answer all your questions.
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FFF1E3] text-[#E85D00] rounded-[16px] flex items-center justify-center flex-shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Phone</h4>
                <p className="text-gray-600">+94 11 234 5678</p>
                <p className="text-sm text-gray-500">Mon-Sat 8am to 6pm</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FFF1E3] text-[#E85D00] rounded-[16px] flex items-center justify-center flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Email</h4>
                <p className="text-gray-600">hello@doorstep.lk</p>
                <p className="text-gray-600">support@doorstep.lk</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FFF1E3] text-[#E85D00] rounded-[16px] flex items-center justify-center flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Office</h4>
                <p className="text-gray-600">123 Galle Road</p>
                <p className="text-gray-600">Colombo 03, Sri Lanka</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#E8E2DB]">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Saman" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Kumara" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="saman@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="4" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
