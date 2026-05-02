const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hotel = require('../models/Hotel');
const Place = require('../models/Place');
const User = require('../models/User');
const connectDB = require('../config/database');

// Load env vars
dotenv.config({ path: '../.env' });

// Connect to DB
connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await Hotel.deleteMany();
    await Place.deleteMany();
    await User.deleteMany();

    console.log('Existing data cleared...');

    // Seed mock User
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@kumarihorizon.com',
      password: 'password123',
      role: 'admin',
      phone: '9999999999'
    });

    console.log('Admin user created...');

    // Seed mock Places (minimal mock since actual data is in frontend)
    const places = [
      {
        name: 'Vivekananda Rock Memorial',
        description: 'A sacred monument standing on two rocks located off the mainland.',
        category: 'Religious',
        location: { address: 'Kanniyakumari Coast', coordinates: { lat: 8.078, lng: 77.555 } },
        rating: 4.8
      },
      {
        name: 'Thiruvalluvar Statue',
        description: 'A 133-feet tall stone sculpture of the Tamil poet and philosopher.',
        category: 'Historical',
        location: { address: 'Kanniyakumari Coast', coordinates: { lat: 8.077, lng: 77.555 } },
        rating: 4.7
      }
    ];

    await Place.create(places);
    console.log('Places seeded...');

    // Seed mock Hotels
    const hotels = [
      {
        name: 'Ocean Heritage Resort',
        description: 'Premium resort with stunning views of the confluence.',
        type: 'Resort',
        pricePerNight: 5000,
        address: { street: 'Beach Road', city: 'Kanniyakumari' },
        amenities: ['Pool', 'Spa', 'Free WiFi', 'Restaurant'],
        rating: 4.5,
        isTribalOwned: false
      },
      {
        name: 'Kani Forest Homestay',
        description: 'Authentic tribal homestay nestled in the western ghats.',
        type: 'Homestay',
        pricePerNight: 2000,
        address: { street: 'Pechiparai', city: 'Kanniyakumari' },
        amenities: ['Local Food', 'Trekking', 'Campfire'],
        rating: 4.9,
        isTribalOwned: true
      }
    ];

    await Hotel.create(hotels);
    console.log('Hotels seeded...');

    console.log('Data seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

seedData();
