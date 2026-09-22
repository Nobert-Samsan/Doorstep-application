const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/shared/Settings.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace string literal '/customer/...' with template literal \`/\${user?.role || 'customer'}/...\`
content = content.replace(/'\/customer\/notification-preferences'/g, '`/${user?.role || \'customer\'}/notification-preferences`');
content = content.replace(/'\/customer\/profile\/photo'/g, '`/${user?.role || \'customer\'}/profile/photo`');
content = content.replace(/'\/customer\/profile'/g, '`/${user?.role || \'customer\'}/profile`');
content = content.replace(/'\/customer\/profile\/request-email-change'/g, '`/${user?.role || \'customer\'}/profile/request-email-change`');

fs.writeFileSync(filePath, content);
console.log('Settings.jsx endpoints updated to be role-dynamic!');
