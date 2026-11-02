const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;

  // Retrieve credentials, stripping accidental quotes or whitespace
  const rawUser = process.env.SMTP_EMAIL || process.env.SMTP_USER || '';
  const rawPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '';
  const rawHost = process.env.SMTP_HOST || '';

  const cleanUser = rawUser.replace(/["'\s]/g, '');
  const cleanPass = rawPass.replace(/["'\s]/g, '');
  const cleanHost = rawHost.replace(/["'\s]/g, '');

  // Detect if an app password was accidentally passed into SMTP_HOST
  const isPassInHost = cleanHost.length === 16 && !cleanHost.includes('.');

  const isRealGmail = cleanHost.includes('gmail') || cleanUser.includes('gmail.com') || isPassInHost;
  const isDummyHost = (!cleanHost && !cleanUser) || cleanHost === 'your_smtp_host';

  if (!isDummyHost) {
    if (isRealGmail) {
      // Use official Google direct service
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: cleanUser || 'nobertsam1812@gmail.com',
          pass: isPassInHost ? cleanHost : (cleanPass || cleanHost)
        }
      });
    } else {
      const port = parseInt(process.env.SMTP_PORT, 10) || 587;
      transporter = nodemailer.createTransport({
        host: cleanHost,
        port,
        secure: port === 465,
        auth: {
          user: cleanUser,
          pass: cleanPass
        }
      });
    }
  } else {
    // Generate test account automatically for real-time testing
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const senderEmail = process.env.FROM_EMAIL || cleanUser || 'nobertsam1812@gmail.com';
  const senderName = process.env.FROM_NAME || 'DoorStep';

  const message = {
    from: `"${senderName}" <${senderEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    ...(options.html && { html: options.html })
  };

  const info = await transporter.sendMail(message);

  if (isDummyHost) {
    console.log(`[REAL-TIME EMAIL] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return { previewUrl: nodemailer.getTestMessageUrl(info) };
  }

  return true;
};

module.exports = sendEmail;
