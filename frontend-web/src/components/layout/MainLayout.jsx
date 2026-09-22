import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';

const MainLayout = () => {
  const [lang, setLang] = useState('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Sticky Navbar */}
      <nav className="glass sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform">D</div>
                <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-900">DoorStep</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="font-medium text-gray-600 hover:text-primary transition-colors">About</Link>
              <Link to="/how-it-works" className="font-medium text-gray-600 hover:text-primary transition-colors">How It Works</Link>
              <Link to="/contact" className="font-medium text-gray-600 hover:text-primary transition-colors">Contact</Link>
              


              <div className="flex items-center space-x-4">
                <Link to="/login" className="font-semibold text-primary hover:text-amber-800 transition-colors">Login</Link>
                <Link to="/register" className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">Register</Link>
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

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-2 shadow-lg">
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">About</Link>
            <Link to="/how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">How It Works</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Contact</Link>
            <div className="border-t border-gray-100 my-2 pt-2">
              <Link to="/login" className="block px-3 py-2 text-center text-primary font-bold">Login</Link>
              <Link to="/register" className="block px-3 py-2 text-center bg-primary text-white font-bold rounded-lg mt-2">Register</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 border-t-[6px] border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">D</div>
                <span className="text-2xl font-bold tracking-tight text-white">DoorStep</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Connecting Sri Lankan homeowners with trusted, verified local professionals for all home service needs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white font-bold transition-colors">FB</a>
                <a href="#" className="text-gray-400 hover:text-white font-bold transition-colors">TW</a>
                <a href="#" className="text-gray-400 hover:text-white font-bold transition-colors">IG</a>
                <a href="#" className="text-gray-400 hover:text-white font-bold transition-colors">LI</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">For Customers</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/search" className="hover:text-primary transition-colors">Find a Worker</Link></li>
                <li><Link to="/categories" className="hover:text-primary transition-colors">Service Categories</Link></li>
                <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
                <li><Link to="/trust-safety" className="hover:text-primary transition-colors">Trust & Safety</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-white">For Workers</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/register/worker" className="hover:text-primary transition-colors">Join as a Pro</Link></li>
                <li><Link to="/worker-success" className="hover:text-primary transition-colors">Success Stories</Link></li>
                <li><Link to="/community" className="hover:text-primary transition-colors">Community Guidelines</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Support</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} DoorStep Sri Lanka. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with ❤️ in Sri Lanka</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
