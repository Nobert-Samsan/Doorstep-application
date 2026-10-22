const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// 1. Inject faqs array and FAQItem component
if (!code.includes('const faqs =')) {
  const faqData = `
const faqs = [
  { q: "How do I book a professional?", a: "Simply search for the service you need, choose a verified professional, and select a time that works for you." },
  { q: "Are all professionals verified?", a: "Yes, every professional on DoorStep goes through a strict identity check and skill verification process." },
  { q: "How does pricing work?", a: "We offer transparent pricing. You'll see upfront costs for fixed-price jobs or negotiate directly via chat for custom quotes." },
  { q: "What if I'm not satisfied with the service?", a: "We guarantee satisfaction. If you face any issues, our 24/7 customer support team is here to resolve them." }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border-b border-gray-100 py-6 last:border-0">
      <button className="flex w-full items-center justify-between text-left focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-xl font-bold text-gray-900">{question}</h3>
        <span className={\`transform transition-transform duration-300 \${isOpen ? 'rotate-180' : ''}\`}>
          <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      <div className={\`mt-4 text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 \${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}\`}>
        {answer}
      </div>
    </div>
  );
};

const Landing = () => {`;
  code = code.replace('const Landing = () => {', faqData);
}

// 2. Inject state variables for Carousel
if (!code.includes('const heroImages =')) {
  const stateVars = `
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
  code = code.replace('const [stats, setStats] = useState({', stateVars + '\n  const [stats, setStats] = useState({');
}

// 3. Replace Hero Section
const heroStart = code.indexOf('{/* 1. Hero Section */}');
if (heroStart !== -1) {
  const heroEnd = code.indexOf('</section>', heroStart) + '</section>'.length;
  
  const newHero = `      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] lg:min-h-[800px] flex items-center pt-32 pb-24 overflow-hidden">
        {/* Full Width Background Image Carousel */}
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
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Every Service, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Right at Your DoorStep</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Connect with trusted, verified local skilled workers in Sri Lanka for all your home service needs. Book instantly, pay securely.
          </p>
        </div>
      </section>`;
      
  code = code.substring(0, heroStart) + newHero + code.substring(heroEnd);
}

// 4. Replace "5. Why DoorStep" with Image Cards
const whyChooseStart = code.indexOf('{/* 5. Why DoorStep */}');
if (whyChooseStart !== -1) {
  const whyChooseEnd = code.indexOf('</section>', whyChooseStart) + '</section>'.length;
  
  const newWhyChoose = `{/* 5. Why Choose DoorStep? */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-[40px] font-extrabold text-gray-900 mb-4 leading-tight">Why Choose DoorStep?</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">We are Sri Lanka's most trusted home services platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-56 w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Verified Professionals" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-6 w-14 h-14 rounded-2xl bg-white text-green-600 flex items-center justify-center shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300">
                  <Shield size={28} />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Professionals</h3>
                <p className="text-gray-600 leading-relaxed">Every worker undergoes strict identity checks, skill verification, and continuous quality monitoring.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-56 w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Instant Booking" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-6 w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300">
                  <Clock size={28} />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Booking</h3>
                <p className="text-gray-600 leading-relaxed">Book a service in seconds. Track your worker's arrival time and communicate securely via the app.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-56 w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Satisfaction Guaranteed" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-6 w-14 h-14 rounded-2xl bg-white text-orange-500 flex items-center justify-center shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300">
                  <Star size={28} />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Satisfaction Guaranteed</h3>
                <p className="text-gray-600 leading-relaxed">Pay securely online or in cash. We ensure 100% satisfaction with dedicated customer support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
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
      </section>
`;
  code = code.substring(0, whyChooseStart) + newWhyChoose + code.substring(whyChooseEnd);
}

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log("Applied missing user requests successfully!");
