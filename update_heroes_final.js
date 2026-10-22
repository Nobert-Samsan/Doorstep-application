const fs = require('fs');

const pages = [
  {
    file: 'About.jsx',
    title: 'About DoorStep',
    desc: "Sri Lanka's most trusted home services platform, connecting households with verified professionals.",
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1920&auto=format&fit=crop',
    breadcrumb: 'About Us'
  },
  {
    file: 'Contact.jsx',
    title: 'Contact Us',
    desc: "We're here to help. Get in touch with our support team for any questions or assistance.",
    img: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1920&auto=format&fit=crop',
    breadcrumb: 'Contact'
  },
  {
    file: 'HowItWorks.jsx',
    title: 'How DoorStep Works',
    desc: "Simple, safe and transparent — from search to job completion in just a few steps.",
    img: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=1920&auto=format&fit=crop',
    breadcrumb: 'How It Works'
  }
];

pages.forEach(p => {
  const path = `frontend-web/src/pages/public/${p.file}`;
  let code = fs.readFileSync(path, 'utf8');
  
  if (!code.includes('Link')) {
    code = code.replace("from 'react';", "from 'react';\nimport { Link } from 'react-router-dom';");
  }
  
  if (!code.includes('ChevronRight')) {
    if (code.match(/import\s+{([^}]*)}\s+from\s+['"]lucide-react['"]/)) {
      code = code.replace(/(import\s+{)([^}]*)(\}\s+from\s+['"]lucide-react['"])/, (match, p1, p2, p3) => {
        return p1 + p2 + (p2.trim() ? ', ' : '') + 'ChevronRight' + p3;
      });
    } else {
      code = code.replace("from 'react';", "from 'react';\nimport { ChevronRight } from 'lucide-react';");
    }
  }

  const newHero = `      {/* 1. Hero Banner */}
      <section className="relative min-h-[85vh] lg:min-h-[800px] flex items-center pt-32 pb-24 overflow-hidden">
        {/* Full Width Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="${p.img}" 
            alt="${p.title}" 
            className="w-full h-full object-cover transform scale-105"
          />
          {/* Dark Overlay for text legibility */}
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl text-left">
            <div className="flex items-center gap-2 text-amber-300 text-sm font-bold mb-8 uppercase tracking-widest">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={16} />
              <span>${p.breadcrumb}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
              ${p.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 font-medium max-w-2xl leading-relaxed drop-shadow-md">
              ${p.desc}
            </p>
          </div>
        </div>
      </section>`;

  const sectionStartMatch = code.match(/<section[^>]*?className="[^"]*(?:bg-primary|bg-gradient-to-r)[^"]*"[^>]*>/);
  if (sectionStartMatch) {
    const sectionStart = sectionStartMatch.index;
    const sectionEnd = code.indexOf('</section>', sectionStart) + '</section>'.length;
    code = code.substring(0, sectionStart) + newHero + code.substring(sectionEnd);
    fs.writeFileSync(path, code);
    console.log(`Updated ${p.file}`);
  }
});
