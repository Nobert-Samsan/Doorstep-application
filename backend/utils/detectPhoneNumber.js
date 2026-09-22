const detectPhoneNumber = (text) => {
  if (!text) return false;
  // Regex pattern to detect Sri Lankan phone numbers and generic patterns
  const slPattern = /(\+94|0094|0)[0-9]{9}/g;
  const genericPattern = /\b\d{10,12}\b/g;
  
  return slPattern.test(text) || genericPattern.test(text);
};

module.exports = detectPhoneNumber;
