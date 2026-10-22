const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

code = code.replace(/<\/div>\\n            <\/div>\\n          <\/div>\\n        <\/div>\\n      <\/div>\\n\\n      \{\/\* Commission Policy/, `</div>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Policy`);

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log('Fixed tags with real newlines');
