const fs = require('fs');

// Fix Landing.jsx
let landing = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const landingHeroStart = landing.indexOf('<section className="relative');
const landingHeroEnd = landing.indexOf('</section>', landingHeroStart) + 10;

// Reconstruct 4:19 PM Hero for Landing
const landingHero = `<section className="relative min-h-[85vh] lg:min-h-[800px] flex items-center pt-32 pb-24 overflow-hidden">
        {/* Full Width Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=1920&auto=format&fit=crop" 
            alt="DoorStep Home Services" 
            className="w-full h-full object-cover transform scale-105"
          />
          {/* Dark Overlay for text legibility */}
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
            Every Service, <span className="text-primary">Right at Your DoorStep</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto font-medium drop-shadow-md">
            Connect with trusted, verified local skilled workers in Sri Lanka for all your home service needs. Book instantly, pay securely.
          </p>
          
          {/* Search Box - Glassmorphism style */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-3 border border-white/20">
            <div className="flex-1 flex items-center px-4 bg-white/80 rounded-2xl py-3 border border-transparent focus-within:border-primary transition-colors">
              <Search className="text-primary mr-3" size={24} />
              <input 
                type="text" 
                placeholder="What service do you need?" 
                className="w-full outline-none text-gray-900 bg-transparent text-lg placeholder-gray-500 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 bg-white/80 rounded-2xl py-3 border border-transparent focus-within:border-primary transition-colors">
              <MapPin className="text-primary mr-3" size={24} />
              <select 
                className="w-full outline-none text-gray-900 bg-transparent text-lg font-medium appearance-none cursor-pointer"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Select District</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kandy">Kandy</option>
              </select>
            </div>
            <button 
              onClick={handleSearch}
              className="bg-primary text-gray-900 px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all w-full md:w-auto text-lg flex items-center justify-center gap-2"
            >
              Search
            </button>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-gray-200">
            <span className="font-semibold text-white mt-1">Popular:</span>
            <span className="bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">AC Repair</span>
            <span className="bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">House Cleaning</span>
            <span className="bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">Wiring</span>
            <span className="bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">Leak Fix</span>
          </div>
        </div>
      </section>`;

if (landingHeroStart !== -1) {
  landing = landing.substring(0, landingHeroStart) + landingHero + landing.substring(landingHeroEnd);
  fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', landing);
}

// Fix HowItWorks.jsx
let how = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

const howHeroStart = how.indexOf('<section className="relative');
const howHeroEnd = how.indexOf('</section>', howHeroStart) + 10;

const howHero = `<section className="relative min-h-[85vh] lg:min-h-[800px] flex items-center pt-32 pb-24 overflow-hidden">
        {/* Full Width Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1920&auto=format&fit=crop" 
            alt="How DoorStep Works" 
            className="w-full h-full object-cover transform scale-105"
          />
          {/* Dark Overlay for text legibility */}
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
            How DoorStep Works
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto font-medium drop-shadow-md">
            Your journey to a perfectly maintained home is simple and transparent. Here is how we connect you with the best professionals in Sri Lanka.
          </p>
        </div>
      </section>`;

if (howHeroStart !== -1) {
  how = how.substring(0, howHeroStart) + howHero + how.substring(howHeroEnd);
  fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', how);
}

console.log("Restored 4:19 PM state for Landing and HowItWorks!");
