# Kumari Horizon: Verified Tourism Portal for Kanniyakumari

Kumari Horizon is a professional, production-ready full-stack web application designed as the verified tourism hub for Kanniyakumari, India. It focuses on local tribal livelihood support, tourist safety, and high-quality travel experiences.

## 🚀 Features
- **Verified Accommodations**: Integrated booking for luxury resorts and local tribal homestays.
- **AI-Powered Trip Planner**: Personalized itineraries based on budget and interests.
- **Real-time Emergency SOS**: One-click alert system with location tracking and admin notification.
- **Smart Chatbot**: Context-aware assistance for tourists.
- **Razorpay Integration**: Professional payment gateway for secure transactions.
- **PWA Ready**: Installable on mobile devices with offline capabilities.
- **Admin Dashboard**: Comprehensive monitoring for bookings and emergency alerts.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Context API.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io.
- **Security**: JWT (Access + Refresh Tokens), Helmet, Rate Limiting, XSS protection.
- **APIs**: OpenAI (GPT-4), Google Maps, Razorpay, OpenWeatherMap.

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.template .env # Update with your API keys
npm run seed # Import sample properties
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Environment Variables
Refer to `backend/.env.template` for the required keys. You will need:
- `MONGODB_URI`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `OPENAI_API_KEY`
- `GOOGLE_MAPS_API_KEY`

## 📄 Documentation
- [API Documentation](./API_DOCS.md)
- [Deployment Guide](./DEPLOYMENT.md)
