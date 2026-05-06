const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
// Create the model dynamically if it doesn't exist, or assume it exists
let Place;
try {
  Place = require('../models/Place');
} catch (e) {
  // Simple fallback schema if Place model isn't fully defined yet
  const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    category: String,
    rating: Number,
    reviews: Number,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number],
      address: String
    },
    images: [String],
    openingHours: String,
    ticketPrice: String,
    culturalImportance: String,
    bestTimeToVisit: String
  });
  Place = mongoose.model('Place', placeSchema);
}

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

const importRealPlaces = async () => {
  try {
    await connectDB();
    console.log('Clearing existing places...');
    await Place.deleteMany();

    const realPlaces = [
      {
        name: "Vivekananda Rock Memorial",
        lat: 8.0780,
        lon: 77.5552,
        category: "Religious",
        address: "Kanyakumari Coast, Tamil Nadu 629702",
        description: "A sacred monument built in honor of Swami Vivekananda, who is said to have attained enlightenment on the rock.",
        culturalImportance: "Symbol of spiritual enlightenment and national integration.",
        bestTimeToVisit: "Early morning for sunrise, or late afternoon.",
        images: ["https://images.unsplash.com/photo-1590050752117-238cb1231bd0?auto=format&fit=crop&q=80&w=800"]
      },
      {
        name: "Thiruvalluvar Statue",
        lat: 8.0778,
        lon: 77.5543,
        category: "Cultural",
        address: "Kanyakumari Coast, Tamil Nadu 629702",
        description: "A 133-feet tall stone sculpture of the Tamil poet and philosopher Valluvar.",
        culturalImportance: "Represents the 133 chapters of the Tirukkural.",
        bestTimeToVisit: "Sunrise to Sunset",
        images: ["https://images.unsplash.com/photo-1623910271034-316235ba92f6?auto=format&fit=crop&q=80&w=800"]
      },
      {
        name: "Kanyakumari Beach",
        lat: 8.0805,
        lon: 77.5510,
        category: "Beaches",
        address: "Beach Road, Kanyakumari",
        description: "The unique meeting point of the Indian Ocean, Arabian Sea, and Bay of Bengal.",
        culturalImportance: "A highly revered pilgrimage site where bathing is considered sacred.",
        bestTimeToVisit: "Sunrise, Sunset",
        images: ["https://images.unsplash.com/photo-1621255562725-349c81b6dc2c?auto=format&fit=crop&q=80&w=800"]
      },
      {
        name: "Bhagavathy Amman Temple",
        lat: 8.0818,
        lon: 77.5515,
        category: "Religious",
        address: "Temple Road, Kanyakumari 629702",
        description: "A 3000-year-old temple dedicated to Goddess Kanyakumari, overlooking the ocean.",
        culturalImportance: "One of the 51 Shakti Peethas.",
        bestTimeToVisit: "Morning or evening pooja times",
        images: ["https://images.unsplash.com/photo-1600080826978-75c17ab32924?auto=format&fit=crop&q=80&w=800"]
      },
      {
        name: "Vattakottai Fort",
        lat: 8.1250,
        lon: 77.5683,
        category: "Historical",
        address: "Vattakottai, Kanyakumari",
        description: "An 18th-century seaside circular fort built by the Venad kings, offering beautiful views of the sea and Western Ghats.",
        culturalImportance: "Historical coastal defense mechanism.",
        bestTimeToVisit: "Late afternoon for cool sea breeze.",
        images: ["https://images.unsplash.com/photo-1595844730298-b960af98fee8?auto=format&fit=crop&q=80&w=800"]
      },
      {
        name: "Sunset Point",
        lat: 8.0833,
        lon: 77.5350,
        category: "Nature",
        address: "Hidden Twin Beach Road, Kanyakumari",
        description: "The most famous and uncrowded spot to witness the spectacular sunset over the Arabian sea.",
        culturalImportance: "A popular photography and nature appreciation spot.",
        bestTimeToVisit: "5:30 PM - 6:30 PM",
        images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800"]
      }
    ];

    const placesToInsert = realPlaces.map(p => ({
      name: p.name,
      description: p.description,
      category: p.category,
      rating: (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1),
      numReviews: Math.floor(Math.random() * 5000) + 500,
      location: {
        address: p.address,
        coordinates: { lat: p.lat, lng: p.lon }
      },
      images: p.images,
      culturalImportance: p.culturalImportance,
      bestTimeToVisit: p.bestTimeToVisit
    }));

    await Place.insertMany(placesToInsert);
    console.log(`Successfully imported ${placesToInsert.length} real places into the database!`);
    
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importRealPlaces();
