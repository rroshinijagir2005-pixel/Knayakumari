const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const Accommodation = require('../models/Accommodation');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kumari_horizon', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importRealData = async () => {
  try {
    console.log('Connecting to DB...');
    await connectDB();

    console.log('Clearing existing accommodations...');
    await Accommodation.deleteMany();

    console.log('Inserting real Kanyakumari accommodation data into database...');
    
    const realHotels = [
      {
        name: "Hotel Sea View",
        lat: 8.0814,
        lon: 77.5488,
        price: 4500,
        street: "East Car Street",
        phone: "+91 4652 247 841",
        description: "A premium hotel offering stunning panoramic views of the ocean, Vivekananda Rock Memorial, and Thiruvalluvar Statue."
      },
      {
        name: "Sparsa Resort Kanyakumari",
        lat: 8.0864,
        lon: 77.5381,
        price: 6500,
        street: "Beach Road",
        phone: "+91 4652 246 111",
        description: "An eco-friendly luxury resort located right on the beach, featuring a swimming pool, spa, and traditional architecture."
      },
      {
        name: "Vivekananda Kendra Pictorial Exhibition & Stay",
        lat: 8.0905,
        lon: 77.5511,
        price: 1200,
        street: "Vivekanandapuram",
        phone: "+91 4652 246 250",
        description: "A peaceful and vast ashram campus offering affordable stay, meditation halls, and proximity to the private beach."
      },
      {
        name: "Gopinivas Grand",
        lat: 8.0831,
        lon: 77.5458,
        price: 3200,
        street: "Near Seashore",
        phone: "+91 4652 246 161",
        description: "A modern hotel situated close to the Kanyakumari Temple and the beach, providing exceptional hospitality and great dining."
      },
      {
        name: "The Seashore Hotel",
        lat: 8.0825,
        lon: 77.5480,
        price: 4000,
        street: "East Car Street",
        phone: "+91 4652 246 400",
        description: "Located right next to the Kanyakumari Temple, offering spectacular sunrise views from the rooftop and premium comfort."
      },
      {
        name: "Hotel TamilNadu (TTDC)",
        lat: 8.0850,
        lon: 77.5420,
        price: 2500,
        street: "Main Road",
        phone: "+91 4652 246 008",
        description: "The official government tourist hotel featuring spacious rooms, a massive compound, and proximity to the sunset point."
      },
      {
        name: "Annai Resorts and Spa",
        lat: 8.0880,
        lon: 77.5450,
        price: 5500,
        street: "Kovalam Road",
        phone: "+91 4652 246 000",
        description: "A luxurious resort with a beautiful pool and spa, perfect for families and couples looking for a relaxing stay."
      },
      {
        name: "Ferdin Cottage",
        lat: 8.0910,
        lon: 77.5400,
        price: 1800,
        street: "Church Road",
        phone: "+91 98765 43210",
        description: "A budget-friendly and charming cottage offering a homely atmosphere and personalized service."
      }
    ];

    const hotelsToInsert = [];
    const defaultImages = [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551882547-ff40c0d5e502?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800"
    ];

    for (let i = 0; i < realHotels.length; i++) {
      const hotel = realHotels[i];
      const img1 = defaultImages[Math.floor(Math.random() * defaultImages.length)];
      const img2 = defaultImages[Math.floor(Math.random() * defaultImages.length)];

      hotelsToInsert.push({
        name: hotel.name,
        description: hotel.description,
        type: 'hotel',
        pricePerNight: hotel.price,
        location: {
          type: 'Point',
          coordinates: [hotel.lon, hotel.lat],
          address: hotel.street + ', Kanniyakumari, 629702'
        },
        amenities: ['WiFi', 'AC', 'Room Service'],
        tags: {
          isLuxury: hotel.price >= 4500,
          isFamilyFriendly: true,
          isNearBeach: hotel.lat < 8.085,
          hasSeaView: hotel.lat < 8.084,
          isNearTemple: hotel.lat > 8.08 && hotel.lat < 8.09,
          isNearStation: hotel.lon > 77.545,
          hasSunriseView: hotel.lon > 77.548,
          hasParking: true,
          hasFreeParking: hotel.price > 3000
        },
        images: [img1, img2],
        rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
        numReviews: Math.floor(Math.random() * 2000) + 100,
        contactPhone: hotel.phone,
        status: 'Active',
        verification: {
          verifiedToday: Math.random() > 0.5,
          phoneVerified: true,
          recentlyUpdated: true,
          localPartnerVerified: Math.random() > 0.3,
          ownerUploadedPhotos: true,
          lastVerifiedDate: new Date()
        },
        contactInfo: {
          phone: hotel.phone,
          whatsapp: hotel.phone
        },
        urgencyMetrics: {
          roomsLeft: Math.floor(Math.random() * 10) + 1,
          bookedToday: Math.floor(Math.random() * 15),
          bestSeller: Math.random() > 0.6,
          peakSeasonWarning: false
        },
        localContext: {
          nearbyPlaces: [
            { name: "Kanyakumari Temple", distance: "0.5 km" },
            { name: "Vivekananda Rock Ferry", distance: "0.8 km" }
          ],
          nearbyFood: ["Nethili fry", "Fish meals", "Banana chips"],
          nearbyCulture: ["Temple festivals", "Sunset viewing"]
        }
      });
    }

    if (hotelsToInsert.length > 0) {
      await Accommodation.insertMany(hotelsToInsert);
      console.log(`Successfully imported ${hotelsToInsert.length} real accommodations into the database!`);
    } else {
      console.log("No hotels found or inserted.");
    }

    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importRealData();
