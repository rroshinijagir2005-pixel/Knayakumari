// whatsappService.js
// This service acts as the integration point for Twilio or other WhatsApp Business APIs.
// For now, it logs the message to the console to simulate sending a WhatsApp message.

exports.sendWhatsAppConfirmation = async (bookingDetails) => {
  try {
    const { 
      bookingId, 
      guestName, 
      phone, 
      hotelName, 
      checkIn, 
      checkOut, 
      paymentStatus, 
      mapLink,
      hotelContact
    } = bookingDetails;

    const message = `
🌟 *Kumari Horizon Booking Confirmed!* 🌟

Hi ${guestName}, your stay at *${hotelName}* is confirmed.

📋 *Booking ID:* ${bookingId}
📅 *Dates:* ${checkIn} to ${checkOut}
💳 *Payment Status:* ${paymentStatus}

📍 *Map Link:* ${mapLink || 'Not available'}
📞 *Hotel Contact:* ${hotelContact || 'Not available'}

Need help? Reply to this message or contact support.
Safe travels to Kanniyakumari! 🌊
    `.trim();

    // In a production environment, you would use Twilio or a similar API here:
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: message,
    //   from: 'whatsapp:+14155238886',
    //   to: `whatsapp:${phone}`
    // });

    console.log(`\n==== MOCK WHATSAPP MESSAGE SENT TO ${phone} ====`);
    console.log(message);
    console.log(`====================================================\n`);

    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
};
