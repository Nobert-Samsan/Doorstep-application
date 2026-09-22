// Mocked Twilio SMS
const sendSMS = async (to, message) => {
  console.log(`[MOCK SMS] To: ${to} | Message: ${message}`);
  return true;
};

module.exports = sendSMS;
