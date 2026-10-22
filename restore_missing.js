const fs = require('fs');

// 1. READ HOWITWORKS.JSX to get FAQItem and faqs
let howCode = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

const faqItemRegex = /const FAQItem = \(\{ question, answer \}\) => \{[\s\S]*?return \([\s\S]*?<\/div>\n    <\/div>\n  \);\n\};/;
const faqItemMatch = howCode.match(faqItemRegex);
const faqItemCode = faqItemMatch ? faqItemMatch[0] : '';

const faqsRegex = /const faqs = \[[\s\S]*?\];/;
const faqsMatch = howCode.match(faqsRegex);
const faqsCode = faqsMatch ? faqsMatch[0] : '';

// Delete FAQ section from HowItWorks
const howFaqSectionRegex = /\{\/\* 3\. FAQ Section \*\/\}[\s\S]*?<\/section>/;
howCode = howCode.replace(howFaqSectionRegex, '');
fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', howCode);


// 2. UPDATE LANDING.JSX
let landingCode = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// Inject FAQItem right before const Landing = () => {
if (!landingCode.includes('const FAQItem =')) {
  landingCode = landingCode.replace('const Landing = () => {', faqItemCode + '\n\nconst Landing = () => {');
}

// Inject faqs array right after const Landing = () => {
if (!landingCode.includes('const faqs = [')) {
  landingCode = landingCode.replace('const Landing = () => {', 'const Landing = () => {\n  ' + faqsCode);
}

// Replace "Why Choose DoorStep?"
const oldWhyChooseRegex = /\{\/\* 2\. Why Choose DoorStep \*\/\}[\s\S]*?<\/section>/;
const newWhyChoose = `{/* 2. Why Choose DoorStep */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[40px] font-extrabold text-gray-900 mb-4 leading-tight">Why Choose DoorStep?</h2>
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
                <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Secure Payments" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-6 w-14 h-14 rounded-2xl bg-white text-primary flex items-center justify-center shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300">
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
      </section>`;

if (landingCode.match(oldWhyChooseRegex)) {
  landingCode = landingCode.replace(oldWhyChooseRegex, newWhyChoose);
}

// Inject FAQ section at the end (before last </div>)
const faqSection = `

      {/* 6. FAQ Section */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[40px] font-extrabold text-gray-900 mb-4 leading-tight">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-base">Everything you need to know about using DoorStep</p>
          </div>
          
          <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            {faqs && faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>
`;

if (!landingCode.includes('Frequently Asked Questions')) {
  landingCode = landingCode.replace(/    <\/div>\n  \);\n\};\n\nexport default Landing;/, faqSection + '    </div>\n  );\n};\n\nexport default Landing;');
}

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', landingCode);
console.log("Restored Missing Sections!");
