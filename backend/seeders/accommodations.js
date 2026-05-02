const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Accommodation = require('../models/Accommodation');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const accommodations = [
  {
    name: "Kani Tribal Eco-Stay",
    description: "Experience authentic tribal life in the Western Ghats. Sustainable living with traditional meals.",
    type: "homestay",
    location: {
      address: "Pechiparai Hills, Kanniyakumari",
      coordinates: [77.3, 8.4]
    },
    pricePerNight: 2500,
    images: ["https://images.unsplash.com/photo-1596178065887-1198b6148b2b"],
    amenities: ["Traditional Meals", "Forest Walk", "Organic Garden"],
    isTribalOwned: true,
    bestTimeToVisit: "October to March"
  },
  {
    name: "Vivekananda Luxury Resort",
    description: "Premium resort with a direct view of the Vivekananda Rock Memorial and Thiruvalluvar Statue.",
    type: "resort",
    location: {
      address: "Main Coast Road, Kanyakumari",
      coordinates: [77.55, 8.08]
    },
    pricePerNight: 8500,
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945"],
    amenities: ["Infinity Pool", "Spa", "Ocean View", "Gym"],
    isTribalOwned: false,
    bestTimeToVisit: "Year-Round"
  },
  {
    name: "Oceanic Breeze Villa",
    description: "A private villa perfect for families, located 2km from the main beach area.",
    type: "villa",
    location: {
      address: "East Coast Road, Kanyakumari",
      coordinates: [77.56, 8.09]
    },
    pricePerNight: 5500,
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227"],
    amenities: ["Private Kitchen", "Parking", "Garden"],
    isTribalOwned: false,
    bestTimeToVisit: "November to February"
  },
  // Adding more mock data to reach 20
  ...Array.from({ length: 17 }).map((_, i) => ({
    name: `Stay ${i + 4}: ${i % 3 === 0 ? 'Tribal' : 'Elite'} ${['Homestay', 'Hotel', 'Resort'][i % 3]}`,
    description: "A wonderful stay experience in the heart of Kanniyakumari with modern amenities.",
    type: ['homestay', 'hotel', 'resort', 'villa'][i % 4],
    location: {
      address: `Locality ${i + 4}, Kanyakumari`,
      coordinates: [77.5 + (i * 0.01), 8.1 + (i * 0.01)]
    },
    pricePerNight: 1500 + (i * 500),
    images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"],
    amenities: ["Wi-Fi", "AC", "Breakfast"],
    isTribalOwned: i % 3 === 0,
    bestTimeToVisit: "October to April"
  }))
];

const seedData = async () => {
  try {
    await Accommodation.deleteMany();
    await Accommodation.insertMany(accommodations);
    console.log('Data Imported Successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
