const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// 1. CAROUSEL & HERO HEIGHT
const stateCode = `
  const heroImages = [
    '/hero-1.jpg',
    '/hero-2.jpg',
    '/hero-3.jpg'
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
`;
if (!code.includes('heroImages =')) {
  code = code.replace('const Landing = () => {', 'const Landing = () => {\n' + stateCode);
}

const heroStart = code.indexOf('<section className="relative min-h-[650px] flex items-center pt-24 pb-20 overflow-hidden m-4 md:m-6 rounded-3xl shadow-2xl">');
if (heroStart !== -1) {
  const heroEnd = code.indexOf('</section>', heroStart) + 10;
  
  let heroBlock = code.substring(heroStart, heroEnd);
  heroBlock = heroBlock.replace('<section className="relative min-h-[650px] flex items-center pt-24 pb-20 overflow-hidden m-4 md:m-6 rounded-3xl shadow-2xl">', '<section className="relative min-h-[85vh] lg:min-h-[800px] flex items-center pt-32 pb-24 overflow-hidden">');
  
  const bgImageRegex = /\{\/\* Full Width Background Image \*\/\}[\s\S]*?<div className="absolute inset-0 bg-gradient-to-t from-gray-900\/80 via-gray-900\/30 to-transparent"><\/div>\n\s*<\/div>/;
  
  const carouselBlock = `{/* Full Width Background Image Carousel */}
        <div className="absolute inset-0 z-0 bg-gray-900">
          {heroImages.map((img, idx) => (
            <div 
              key={idx} 
              className={\`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out \${idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}\`}
            >
              <img 
                src={img} 
                alt="DoorStep Home Services" 
                className="w-full h-full object-cover transform scale-105"
              />
            </div>
          ))}
          {/* Dark Overlay for text legibility */}
          <div className="absolute inset-0 bg-gray-900/60 mix-blend-multiply z-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent z-20"></div>
        </div>`;
        
  heroBlock = heroBlock.replace(bgImageRegex, carouselBlock);
  
  // Remove search box inside hero
  const searchRegex = /\{\/\* Search Box - Glassmorphism style \*\/\}[\s\S]*?<\/button>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>/;
  heroBlock = heroBlock.replace(searchRegex, '');
  
  code = code.substring(0, heroStart) + heroBlock + code.substring(heroEnd);
}

// 3. Remove "How DoorStep Works"
const howItWorksRegex = /\{\/\* 3\. How It Works \*\/\}[\s\S]*?<section className="py-24 bg-gray-50">[\s\S]*?How DoorStep Works[\s\S]*?<\/section>/;
code = code.replace(howItWorksRegex, '');

// 4. Remove "Explore Categories"
const exploreRegex = /\{\/\* 4\. Service Categories \*\/\}[\s\S]*?<\/section>/;
code = code.replace(exploreRegex, '');

// 5. Remove "Top Rated Professionals"
const professionalsRegex = /\{\/\* 5\. Featured Workers \*\/\}[\s\S]*?<\/section>/;
code = code.replace(professionalsRegex, '');

// 6. Upgrade "Why Choose DoorStep"
code = code.replace('<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose DoorStep?</h2>', '<h2 className="text-[40px] font-extrabold text-gray-900 mb-4 leading-tight">Why Choose DoorStep?</h2>');

// 7. Upgrade FAQ Section
const oldFaq = /\{\/\* 6\. FAQ Section \*\/\}[\s\S]*?<section className="py-24 bg-white">[\s\S]*?<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">[\s\S]*?<div className="text-center mb-16">[\s\S]*?<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions<\/h2>[\s\S]*?<p className="text-gray-600 max-w-2xl mx-auto">Everything you need to know about using DoorStep<\/p>[\s\S]*?<\/div>[\s\S]*?<div className="max-w-3xl mx-auto space-y-4">[\s\S]*?\{faqs\.map\(\(faq, idx\) => \([\s\S]*?<FAQItem key=\{idx\} question=\{faq\.q\} answer=\{faq\.a\} \/>[\s\S]*?\)\)\}[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/section>/;

const newFaq = `{/* 6. FAQ Section */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[40px] font-extrabold text-gray-900 mb-4 leading-tight">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-base">Everything you need to know about using DoorStep</p>
          </div>
          
          <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>`;

if (code.match(oldFaq)) {
  code = code.replace(oldFaq, newFaq);
}

// 8. Inject Benefits Section after Hero
const benefitsSection = `
      {/* PickMe Style Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Block 1: Customer */}
          <div className="bg-[#F8F9FA] rounded-[3rem] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 w-full relative group">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop" alt="Customer Benefits" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-[36px] lg:text-[44px] font-extrabold text-gray-900 leading-[1.2] mb-8 tracking-tight">
                Satisfy Every Home Need With Our Exceptional Services
              </h2>
              <div className="space-y-6 text-[17px] text-gray-500 leading-relaxed">
                <p>DoorStep is the leading home service solution in Sri Lanka that is seamlessly integrated into the busy lifestyle of everyday people.</p>
                <p>We provide the ultimate convenience of instant doorstep service and enable our customers to explore over thousands of verified professionals ranging from plumbers, electricians, AC technicians, and much more in order to select the perfect match for your specific requirements.</p>
              </div>
            </div>
          </div>

          {/* Block 2: Worker */}
          <div className="bg-[#F8F9FA] rounded-[3rem] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 w-full relative group">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop" alt="Worker Benefits" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </div>
            <div className="flex-1 w-full text-center lg:text-left">
              <h2 className="text-[36px] lg:text-[44px] font-extrabold text-gray-900 leading-[1.2] mb-6 tracking-tight">
                Got A Skill?<br />Grow With Us.
              </h2>
              <p className="text-[19px] font-bold text-gray-900 mb-6">We're hungry for the BEST! A world of customers now within your reach!</p>
              <p className="text-[17px] text-gray-500 leading-relaxed mb-10">DoorStep is a one app solution to the customers' household mobility needs. So why not join us as a Service Professional and grow your business with us?</p>
              <Link to="/join-worker" className="inline-flex items-center gap-3 bg-[#FFC107] hover:bg-[#FFB300] text-gray-900 font-bold py-4 px-10 rounded-full transition-all shadow-md">
                Partner With Us <ArrowRight size={20} />
              </Link>
            </div>
          </div>

        </div>
      </section>\n`;

const targetHeroStart = code.indexOf('<section className="relative min-h-[85vh]');
if (targetHeroStart !== -1) {
  const heroEndIdx = code.indexOf('</section>', targetHeroStart) + 10;
  code = code.substring(0, heroEndIdx) + '\n' + benefitsSection + code.substring(heroEndIdx);
} else {
  console.log("Could not find new hero to inject benefits");
}

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log("Restored all the awesome features successfully!");
