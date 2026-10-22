const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

// Ensure necessary icons and hooks are imported
if (!code.includes('ShieldCheck')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, ShieldCheck, Check } from 'lucide-react';");
}

// Inject FadeIn and CountUp hooks if missing
if (!code.includes('const useIntersectionObserver')) {
  const hooks = `
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

const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

  React.useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}{suffix}</span>;
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
        transition: \`opacity 0.6s ease-out \${delay}ms, transform 0.6s ease-out \${delay}ms\`
      }}
    >
      {children}
    </div>
  );
};
`;
  code = code.replace('const About = () => {', hooks + '\nconst About = () => {');
}

// Find Our Story Section bounds
const start = code.indexOf('{/* 2. Our Story - Split Personality Redesign */}');
const end = code.indexOf('{/* 3. Mission and Vision');

const newOurStory = `{/* 2. Our Story - Redesigned */}
      <section className="relative bg-[#FFF8F1] py-16 md:py-24 overflow-hidden">
        
        {/* Subtle radial glow & dotted pattern */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF7A00]/10 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-5 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-center">
            
            {/* Left Column - Text Side */}
            <div className="order-last lg:order-first lg:pr-8">
              
              <FadeIn delay={0}>
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 bg-[#FFF1E3] border border-[#FF7A00]/30 px-4 py-1.5 rounded-full mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#E86100]"></div>
                  <span className="text-[#E86100] text-[13px] font-semibold uppercase tracking-[0.12em]">OUR STORY</span>
                </div>

                {/* Headline */}
                <h2 className="text-[30px] md:text-[40px] lg:text-[48px] font-poppins font-bold text-[#000000] leading-[1.15] mb-8">
                  Connecting Sri Lanka, One <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">Home</span>
                    <svg className="absolute w-full h-[6px] lg:h-[8px] -bottom-1 lg:-bottom-2 left-0 text-[#FF7A00] opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </svg>
                  </span> at a Time
                </h2>
              </FadeIn>

              <FadeIn delay={100}>
                {/* Pull-quote */}
                <div className="relative bg-[#FFFFFF] rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.05)] p-5 md:p-6 mb-8 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]"></div>
                  <div className="absolute top-2 left-4 text-[60px] font-serif leading-none text-[#FF7A00] opacity-25 select-none">“</div>
                  <p className="relative z-10 text-[#000000] font-inter italic font-semibold text-[17px] md:text-[18px] leading-[1.6] pl-6 pt-2">
                    Finding a reliable, skilled and trustworthy home service worker in Sri Lanka has always been a challenge.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                {/* Paragraphs */}
                <div className="space-y-4 mb-8">
                  <p className="font-inter text-[16px] md:text-[17px] text-[#3D3D3D] leading-[1.75]">
                    DoorStep was built to change that. We are Sri Lanka's dedicated home services marketplace — a platform that connects homeowners and tenants across <span className="text-black font-semibold bg-gradient-to-t from-[#FF7A00]/18 to-[#FF7A00]/18 bg-[length:100%_40%] bg-bottom bg-no-repeat">Western Province</span> with <span className="text-black font-semibold">verified, background-checked skilled professionals</span> for every home service need.
                  </p>
                  <p className="font-inter text-[16px] md:text-[17px] text-[#3D3D3D] leading-[1.75]">
                    From plumbing and electrical work to English tutoring, home cleaning, painting and beyond — whether you need a plumber urgently, a painter for your living room or a tutor for your child, DoorStep brings <span className="text-black font-semibold">the right professional to your door</span>. Quickly, safely and transparently.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={300}>
                {/* Checklist */}
                <div className="border-t border-[#E8E2DB] pt-6 mb-10 space-y-[14px]">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-[24px] h-[24px] rounded-full bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center mt-1">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="font-inter text-[#3D3D3D] text-[16px] font-medium leading-relaxed"><span className="text-black font-semibold">Verified professionals</span> across Western Province</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-[24px] h-[24px] rounded-full bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center mt-1">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="font-inter text-[#3D3D3D] text-[16px] font-medium leading-relaxed"><span className="text-black font-semibold">Transparent pricing</span> — itemized quotes before work begins</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-[24px] h-[24px] rounded-full bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center mt-1">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="font-inter text-[#3D3D3D] text-[16px] font-medium leading-relaxed"><span className="text-black font-semibold">Secure in-app communication</span> — your number stays private</span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={400}>
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link to="/how-it-works" className="w-full sm:w-auto group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-bold py-[14px] px-[28px] rounded-[12px] shadow-[0_8px_24px_rgba(255,122,0,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(255,122,0,0.4)] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]">
                    Learn How It Works
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link to="/contact" className="text-[#000000] font-semibold text-[16px] underline hover:text-[#FF7A00] transition-colors decoration-2 underline-offset-4 focus-visible:outline-none">
                    Contact Us
                  </Link>
                </div>
              </FadeIn>
              
            </div>

            {/* Right Column - Image Side */}
            <div className="relative order-first lg:order-last mx-auto max-w-[500px] lg:max-w-none w-full">
              
              <FadeIn delay={200}>
                <div className="relative">
                  {/* Offset Frame */}
                  <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] opacity-20 translate-x-4 translate-y-4 -z-10"></div>
                  
                  {/* Image */}
                  <img src="/story-portrait.jpg" alt="A DoorStep professional at the front door of a Sri Lankan home" className="w-full aspect-[4/5] object-cover rounded-[28px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] relative z-0" />
                  
                  {/* Subtle warm overlay */}
                  <div className="absolute inset-0 rounded-[28px] bg-[#FF7A00]/5 pointer-events-none z-10"></div>
                  
                  {/* Top-left Floating Badge */}
                  <div className="absolute top-8 -left-4 lg:-left-12 bg-white rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.1)] px-4 py-2 flex items-center gap-2 animate-float z-20" style={{ animationDelay: '1s' }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2E9E5B]"></div>
                    <span className="text-[#000000] text-[13px] font-semibold">Trusted across Western Province</span>
                  </div>

                  {/* Bottom-right Stat Card */}
                  <div className="absolute -bottom-6 -right-6 lg:-right-8 bg-[#000000] rounded-[20px] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.3)] p-5 animate-float z-20 w-[180px]">
                    <div className="w-10 h-10 rounded-[10px] bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center mb-3">
                      <ShieldCheck size={22} className="text-white" />
                    </div>
                    <div className="font-poppins font-bold text-[36px] text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] leading-none mb-1">
                      <CountUp end={100} suffix="%" />
                    </div>
                    <div className="text-white/85 text-[14px] leading-snug">
                      Verified professionals
                    </div>
                  </div>
                </div>
              </FadeIn>
              
            </div>
            
          </div>
        </div>
      </section>

      `;

if (start !== -1 && end !== -1) {
  code = code.substring(0, start) + newOurStory + code.substring(end);
  fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
  console.log('Successfully redesigned Our Story section');
} else {
  console.log('Could not find start or end bounds for Our Story section');
}
