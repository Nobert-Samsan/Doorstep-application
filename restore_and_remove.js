const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const cStart = code.indexOf("seEffect } from 'react';");
if (cStart !== -1) {
  // The original file is just 'import React, { useState, u' + the rest from seEffect
  let restored = 'import React, { useState, u' + code.substring(cStart);
  
  // Now remove the search box safely
  const searchStartStr = '{/* Search Box - Glassmorphism style */}';
  const searchStart = restored.indexOf(searchStartStr);
  
  // The end of the search box is the closing </button> and its wrapper divs.
  // Actually, we can just find </button> and then find the next </div>, </div>, </div>.
  // Since we know the exact HTML of the search box:
  const searchRegex = /\{\/\* Search Box - Glassmorphism style \*\/\}[\s\S]*?<\/button>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>/;
  
  // Let's check if regex works on restored
  const match = restored.match(searchRegex);
  if (match) {
    // We only want to remove the search box, NOT the closing divs of the Hero section!
    // Wait, the search box HTML is:
    /*
            {/* Search Box - Glassmorphism style * /}
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/20 flex flex-col md:flex-row gap-3 max-w-3xl">
              ...
              <button ...>Search</button>
            </div>
    */
    // There is ONLY ONE </div> to close the search box!
    const searchSafeRegex = /\{\/\* Search Box - Glassmorphism style \*\/\}[\s\S]*?<\/button>\n\s*<\/div>/;
    
    restored = restored.replace(searchSafeRegex, '');
    
    fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', restored);
    console.log("Restored and Search Box Removed!");
  } else {
    console.log("Could not find Search Box in restored code.");
  }
} else {
  console.log("Could not find seEffect.");
}
