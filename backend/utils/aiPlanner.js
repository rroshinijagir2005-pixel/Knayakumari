const axios = require('axios');

const generatePlan = async ({ travelers, dates, budget, interests }) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey !== 'xxxx') {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "You are an expert travel guide for Kanniyakumari, India. Create a day-wise itinerary."
        }, {
          role: "user",
          content: `Plan a trip to Kanniyakumari for ${travelers} people from ${dates}. Budget: ${budget}. Interests: ${interests}. Include Kani tribal experiences.`
        }]
      }, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("AI Planner Error:", error.message);
      return getFallbackPlan(interests);
    }
  } else {
    return getFallbackPlan(interests);
  }
};

const getFallbackPlan = (interests) => {
  const plans = {
    culture: `
Day 1: Arrival & Spiritual Journey
- Visit Vivekananda Rock Memorial & Thiruvalluvar Statue.
- Evening at Kanyakumari Beach for Sunset.
- Dinner at a local seafood spot.

Day 2: Architecture & History
- Explore Padmanabhapuram Palace (Wooden masterpiece).
- Visit Suchindram Thanumalayan Temple.
- Afternoon trip to Mathur Hanging Bridge.

Day 3: Tribal Heritage
- Guided tour to a Kani Tribal Settlement.
- Visit the Tribal Herbal Garden.
- Shopping for local handicrafts.
    `,
    nature: `
Day 1: Coastal Explorations
- Sunrise at the beach.
- Visit Vattakottai Fort (Coastal fort).
- Evening at the sangam (Confluence of three seas).

Day 2: Inland Wonders
- Trip to Pechiparai Dam & Reservoir.
- Hike to Thiruparappu Waterfalls.
- Picnic near the Western Ghats foothills.

Day 3: Eco-Tourism
- Visit the Kani Eco-Stay area.
- Nature walk in the rubber plantations.
- Sunset at Muttam Beach.
    `
  };

  return plans[interests] || plans.culture;
};

module.exports = { generatePlan };
