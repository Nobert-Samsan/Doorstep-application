const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // If no real SMTP configured, use ethereal for testing
  let transporter;
  const isDummyHost = !process.env.SMTP_HOST || process.env.SMTP_HOST === 'your_smtp_host';

  if (!isDummyHost) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_EMAIL || process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS
      }
    });
  } else {
    // Generate test account automatically for real-time testing
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }

  const message = {
    from: `${process.env.FROM_NAME || 'DoorStep'} <${process.env.FROM_EMAIL || 'noreply@doorstep.lk'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  const info = await transporter.sendMail(message);
  
  if (isDummyHost) {
    console.log(`[REAL-TIME EMAIL] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    // Expose URL to the caller so we can pass it to frontend for easy testing if needed
    return { previewUrl: nodemailer.getTestMessageUrl(info) };
  }
  
  return true;
};

module.exports = sendEmail;
