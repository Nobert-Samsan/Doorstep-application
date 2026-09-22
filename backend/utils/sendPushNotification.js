// Mocked Firebase Cloud Messaging (FCM)
const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  console.log(`[MOCK PUSH] Token: ${fcmToken} | Title: ${title} | Body: ${body}`);
  return true;
};

module.exports = sendPushNotification;
