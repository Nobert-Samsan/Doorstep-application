import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';

const MainLayout = () => {
  const [lang, setLang] = useState('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Sticky Navbar */}
      <nav className="bg-white border-b border-[#E8E2DB] sticky top-0 z-50 relative transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <img src="/logo-new.png" alt="DoorStep Logo" className="h-16 md:h-20 w-auto object-contain" />
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="font-medium text-gray-600 hover:text-primary transition-colors">About</Link>
              <Link to="/how-it-works" className="font-medium text-gray-600 hover:text-primary transition-colors">How It Works</Link>
              <Link to="/contact" className="font-medium text-gray-600 hover:text-primary transition-colors">Contact</Link>
              


              <div className="flex items-center space-x-4">
                <Link to="/login" className="font-semibold text-primary hover:text-amber-800 transition-colors">Login</Link>
                <Link to="/register" className="bg-[#FF7A00] hover:bg-[#E86100] active:bg-[#CC5200] text-white px-6 py-2.5 rounded-full font-bold shadow-[0_4px_12px_rgba(255,122,0,0.20)] hover:-translate-y-0.5 transition-all duration-200">Register</Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 hover:text-primary">
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav â€” absolutely positioned so it overlays content without pushing hero down */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-2 shadow-lg z-50">
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">About</Link>
            <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">How It Works</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Contact</Link>
            <div className="border-t border-gray-100 my-2 pt-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-center text-primary font-bold">Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-center bg-primary text-white font-bold rounded-lg mt-2">Register</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

            {/* App Download Banner */}
      <div className="bg-amber-50 py-4 md:py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo-new-3.png" alt="DoorStep Logo" className="h-24 md:h-28 w-auto object-contain" />
            </Link>

            {/* App Store Buttons */}
            <div className="flex items-center gap-4">
              <a href="#" className="hover:opacity-80 transition-opacity" aria-label="Download on the App Store">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-12" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity" aria-label="Get it on Google Play">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-12" />
              </a>
            </div>
            
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 text-gray-900 pt-16 pb-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Connecting Sri Lankan homeowners with trusted, verified local professionals for all home service needs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-primary transition-colors" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary transition-colors" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900">Company</h3>
              <ul className="space-y-3 text-base text-gray-600">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900">Quick Links</h3>
              <ul className="space-y-3 text-base text-gray-600">
                <li><Link to="/register" className="hover:text-primary transition-colors">Join as a Customer</Link></li>
                <li><Link to="/register/worker" className="hover:text-primary transition-colors">Join as a Worker</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900">Support</h3>
              <ul className="space-y-3 text-base text-gray-600">
                <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-base text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} DoorStep Sri Lanka. All rights reserved.</p>
            
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
 
