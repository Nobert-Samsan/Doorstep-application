const crypto = require('crypto');

const generateReceiptNumber = () => {
  return 'RCPT-' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

module.exports = generateReceiptNumber;
