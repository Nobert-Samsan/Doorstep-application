const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

if (!code.includes('Briefcase')) {
  code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { Briefcase, TrendingUp, Calendar, Banknote, DollarSign, Target, Heart, Eye, Handshake, $1 } from 'lucide-react';");
}

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log("Imports fixed");
