const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Always use port 465 (SSL) for Gmail on cloud hosts (Render/AWS/GCP block or throttle port 587)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'nobertsam1812@gmail.com',
      pass: 'jlkd omcb egvl ifed'
    },
    connectionTimeout: 10000
  });

  const senderEmail = 'nobertsam1812@gmail.com';
  const senderName = 'DoorStep';

  const message = {
    from: `"${senderName}" <${senderEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    ...(options.html && { html: options.html })
  };

  const info = await transporter.sendMail(message);
  console.log(`[EMAIL SENT] To: ${options.email} | ID: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
