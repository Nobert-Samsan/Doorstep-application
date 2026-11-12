const https = require('https');

const sendEmail = async (options) => {
  return new Promise((resolve, reject) => {
    // Read from environment variable RESEND_API_KEY
    const apiKey = process.env.RESEND_API_KEY || (process.env.RESEND_KEY ? process.env.RESEND_KEY.trim() : '');
    
    if (!apiKey) {
      console.warn('[RESEND WARNING] No RESEND_API_KEY configured');
      return resolve({ fallback: true, error: 'No API key' });
    }

    const recipient = options.email;
    const fromAddress = 'DoorStep <onboarding@resend.dev>';

    const payload = JSON.stringify({
      from: fromAddress,
      to: recipient,
      subject: options.subject,
      html: options.html || `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
        <h2 style="color: #ea580c;">DoorStep Verification</h2>
        <p>${options.message.replace(/\n/g, '<br/>')}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <small style="color: #888;">If you didn't request this email, please ignore it.</small>
      </div>`
    });

    const req = https.request('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 8000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`[RESEND SUCCESS] Sent to ${recipient} | ID:`, parsed.id);
            resolve(parsed);
          } else {
            console.warn(`[RESEND API WARNING] Status ${res.statusCode}:`, parsed.message);
            // If Resend free sandbox rejects sending to unverified external address, copy to owner
            if (res.statusCode === 403 && recipient !== 'nobertsam1812@gmail.com') {
              sendToOwner(options, apiKey).then(resolve).catch(reject);
            } else {
              resolve({ fallback: true, error: parsed.message });
            }
          }
        } catch (e) {
          resolve({ fallback: true, raw: body });
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn('[RESEND TIMEOUT] Request timed out');
      resolve({ fallback: true, error: 'Timeout' });
    });

    req.on('error', (err) => {
      console.warn('[RESEND ERROR]:', err.message);
      resolve({ fallback: true, error: err.message });
    });

    req.write(payload);
    req.end();
  });
};

const sendToOwner = (options, apiKey) => {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      from: 'DoorStep <onboarding@resend.dev>',
      to: 'nobertsam1812@gmail.com',
      subject: `[For: ${options.email}] ${options.subject}`,
      html: `<p><strong>Intended for:</strong> ${options.email}</p><p>${options.message.replace(/\n/g, '<br/>')}</p>`
    });

    const req = https.request('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 5000
    }, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve({ sentToOwner: true }));
    });
    req.on('error', () => resolve({ sentToOwner: false }));
    req.write(payload);
    req.end();
  });
};

module.exports = sendEmail;
