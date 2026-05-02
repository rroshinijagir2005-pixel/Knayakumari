const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const axios = require('axios');

// @desc    Process chatbot message
// @route   POST /api/chatbot
// @access  Public
exports.processChat = asyncHandler(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new ErrorResponse('Please provide a message', 400));
  }

  // AI Logic for Chatbot
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are 'Kumari Assistant', a helpful guide for tourists in Kanniyakumari. You help with bookings, local info, and emergency contacts. Be polite and helpful."
          },
          {
            role: "user",
            content: message
          }
        ]
      }, {
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
      });

      return res.status(200).json({
        success: true,
        response: response.data.choices[0].message.content
      });
    } catch (err) {
      console.error("Chatbot AI Error:", err.message);
    }
  }

  // Simple rule-based responses if no API key
  let reply = "I'm sorry, I'm having trouble connecting to my brain. For help, you can use the SOS button or contact our help desk.";
  
  if (message.toLowerCase().includes('hotel') || message.toLowerCase().includes('stay')) {
    reply = "You can find verified stays in our 'Stay' section. We feature luxury resorts and local tribal homestays.";
  } else if (message.toLowerCase().includes('emergency') || message.toLowerCase().includes('police')) {
    reply = "If you are in danger, please use the red SOS button on your screen. Local authorities will be notified with your location.";
  }

  res.status(200).json({
    success: true,
    response: reply,
    isFallback: true
  });
});
