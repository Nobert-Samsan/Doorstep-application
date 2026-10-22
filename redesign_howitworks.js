const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

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
  code = code.replace('const HowItWorks = () => {', hooks + '\nconst HowItWorks = () => {');
}

// Add ArrowDown if missing
if (!code.includes('ArrowDown')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, ArrowDown, ArrowRight } from 'lucide-react';");
}

const start = code.lastIndexOf('{/* 1. Hero Banner */}');
const end = code.indexOf('{/* 2. Tab Selector */}', start);

if (start !== -1 && end !== -1) {
  const newHero = `{/* 1. Hero Banner - Redesigned */}
      <section className="relative min-h-[580px] lg:min-h-[60vh] bg-[#000000] overflow-hidden flex items-center pt-20 lg:pt-0 pb-16 lg:pb-0">
        
        {/* Decorative background glow & pattern */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#FF7A00]/15 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/4"></div>
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

        {/* Image side (Mobile: top 42% height, Desktop: right 58% width) */}
        <div className="absolute top-0 right-0 w-full h-[42%] lg:h-full lg:w-[58%] overflow-hidden">
          <img 
            src="/how-it-works-hero-new.jpg" 
            alt="A smiling homeowner booking a DoorStep professional on her phone" 
            className="w-full h-full object-cover object-[center_center] lg:object-[right_center] scale-105 animate-[zoomOut_1.2s_ease-out_forwards]"
          />
          {/* Mobile bottom fade to black */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black block lg:hidden"></div>
          {/* Desktop left fade to black */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/78 to-black/10 hidden lg:block" style={{ background: 'linear-gradient(90deg, #000000 0%, #000000 36%, rgba(0,0,0,0.78) 52%, rgba(0,0,0,0.1) 100%)' }}></div>
          
          {/* Desktop Floating Card */}
          <div className="hidden lg:flex absolute bottom-12 left-[10%] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-[16px] animate-float z-20 items-center gap-4 w-[280px]">
            <div className="w-10 h-10 rounded-full bg-[#2E9E5B] flex flex-shrink-0 items-center justify-center">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-[15px] leading-tight">Booking confirmed</div>
              <div className="text-white/80 text-[13px] leading-tight mt-0.5">Your professional is on the way</div>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10 w-full flex flex-col items-start mt-[40%] lg:mt-0">
          <div className="max-w-[600px] w-full pt-8 lg:pt-24">
            
            <FadeIn delay={0}>
              {/* Breadcrumb */}
              <div className="text-[14px] text-white/60 mb-6 font-medium">
                <Link to="/" className="hover:text-[#FF7A00] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] rounded">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-white">How It Works</span>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 px-4 py-1.5 rounded-full mb-6">
                <div className="w-2 h-2 rounded-full bg-[#FF7A00]"></div>
                <span className="text-white text-[13px] font-semibold uppercase tracking-[0.12em]">SIMPLE AND TRANSPARENT</span>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              {/* Headline */}
              <h1 className="text-[38px] lg:text-[52px] xl:text-[64px] font-poppins font-bold text-white leading-[1.1] mb-6">
                How <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">DoorStep Works</span>
                  <div className="absolute -bottom-1 left-0 w-full h-[6px] lg:h-[8px] rounded-full bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]"></div>
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={300}>
              {/* Subtitle */}
              <p className="font-inter text-[18px] md:text-[20px] text-white/80 leading-[1.7] max-w-[540px] mb-10">
                Your journey to a perfectly maintained home is simple and transparent. Here is how we connect you with the best professionals in Sri Lanka.
              </p>
            </FadeIn>

            <FadeIn delay={400}>
              {/* Step Preview Row */}
              <div className="relative mb-12">
                {/* Dashed line Desktop */}
                <div className="hidden sm:block absolute top-[22px] left-[22px] right-[22px] h-0 border-t border-dashed border-[#FF7A00]/50 -z-10 animate-[drawWidth_1s_ease-out_forwards]"></div>
                {/* Dashed line Mobile */}
                <div className="block sm:hidden absolute top-[22px] left-[22px] bottom-[22px] w-0 border-l border-dashed border-[#FF7A00]/50 -z-10 animate-[drawHeight_1s_ease-out_forwards]"></div>
                
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 justify-between max-w-[540px]">
                  
                  <button onClick={() => {document.getElementById('steps-section')?.scrollIntoView({behavior:'smooth'})}} className="flex sm:flex-col items-center gap-4 sm:gap-3 group focus-visible:outline-none">
                    <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_4px_12px_rgba(255,122,0,0.3)] group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-[16px]">1</span>
                    </div>
                    <span className="text-white font-semibold text-[14px] group-hover:text-[#FF7A00] transition-colors whitespace-nowrap">Choose a Service</span>
                  </button>

                  <button onClick={() => {document.getElementById('steps-section')?.scrollIntoView({behavior:'smooth'})}} className="flex sm:flex-col items-center gap-4 sm:gap-3 group focus-visible:outline-none">
                    <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_4px_12px_rgba(255,122,0,0.3)] group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-[16px]">2</span>
                    </div>
                    <span className="text-white font-semibold text-[14px] group-hover:text-[#FF7A00] transition-colors whitespace-nowrap">Book Instantly</span>
                  </button>

                  <button onClick={() => {document.getElementById('steps-section')?.scrollIntoView({behavior:'smooth'})}} className="flex sm:flex-col items-center gap-4 sm:gap-3 group focus-visible:outline-none">
                    <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_4px_12px_rgba(255,122,0,0.3)] group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-[16px]">3</span>
                    </div>
                    <span className="text-white font-semibold text-[14px] group-hover:text-[#FF7A00] transition-colors whitespace-nowrap">Get It Done</span>
                  </button>

                </div>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-4">
                <Link to="/search" className="w-full sm:w-auto group bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] text-white font-bold py-[14px] px-[28px] rounded-[12px] shadow-[0_8px_24px_rgba(255,122,0,0.35)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(255,122,0,0.45)] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]">
                  Book a Service
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <button onClick={() => {document.getElementById('steps-section')?.scrollIntoView({behavior:'smooth'})}} className="flex items-center gap-2 text-white font-medium text-[16px] underline hover:text-[#FF7A00] transition-colors decoration-2 underline-offset-4 focus-visible:outline-none sm:mt-3">
                  See the steps below <ArrowDown size={16} className="animate-bounce" />
                </button>
              </div>
            </FadeIn>
            
          </div>
        </div>

        {/* Bottom edge gradient divider */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent opacity-80 z-20"></div>

        {/* CSS for animations */}
        <style dangerouslySetInnerHTML={{__html: \`
          @keyframes zoomOut {
            from { transform: scale(1.06); }
            to { transform: scale(1); }
          }
          @keyframes drawWidth {
            from { width: 0; }
            to { width: auto; }
          }
          @keyframes drawHeight {
            from { height: 0; }
            to { height: auto; }
          }
        \`}} />
      </section>

      {/* Adding an ID to the next section for smooth scrolling */}
      <div id="steps-section"></div>

      `;

  code = code.substring(0, start) + newHero + code.substring(end);
  fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
  console.log('Successfully redesigned HowItWorks hero');
} else {
  console.log('Could not find HowItWorks hero bounds');
}
