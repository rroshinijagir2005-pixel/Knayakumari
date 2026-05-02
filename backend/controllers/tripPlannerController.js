const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const axios = require('axios');

// @desc    Generate AI Trip Itinerary
// @route   POST /api/trip-planner/generate
// @access  Public
exports.generateItinerary = asyncHandler(async (req, res, next) => {
  const { duration, budget, interests } = req.body;

  if (!duration || !budget) {
    return next(new ErrorResponse('Please provide duration and budget', 400));
  }

  // If OpenAI API key exists, use it. Otherwise use rule-based fallback.
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a local tourism expert for Kanniyakumari, India. Generate a detailed day-wise itinerary."
          },
          {
            role: "user",
            content: `Plan a ${duration} day trip with a ${budget} budget. Interests: ${interests || 'General sightseeing'}. Include local Kani tribal experiences.`
          }
        ]
      }, {
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
      });

      return res.status(200).json({
        success: true,
        data: response.data.choices[0].message.content
      });
    } catch (err) {
      console.error("AI Error:", err.message);
    }
  }

  // Fallback Rule-based system
  const fallbackItinerary = `
    Day 1: Arrival, Sunrise at Kanyakumari Beach, visit Vivekananda Rock Memorial.
    Day 2: Local sightseeing: Suchindram Temple, Padmanabhapuram Palace.
    Day 3: Tribal livelihood tour: Visit Kani settlement, local handicrafts.
    Budget estimate: ${budget} for ${duration} days is well within local standards.
  `;

  res.status(200).json({
    success: true,
    data: fallbackItinerary,
    isFallback: true
  });
});
