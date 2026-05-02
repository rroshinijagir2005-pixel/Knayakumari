# Kumari Horizon API Documentation

Base URL: `http://localhost:5000/api`

## 🔑 Authentication

### Register User
`POST /auth/register`
- Body: `name, email, password, phone`
- Response: `success, token, refreshToken, user`

### Login User
`POST /auth/login`
- Body: `email, password`
- Response: `success, token, refreshToken, user`

### Get My Profile
`GET /auth/me`
- Headers: `Authorization: Bearer <token>`

---

## 🏝 Accommodations

### Get All Properties
`GET /accommodations`
- Query Params: `search, tribalOnly, type, maxPrice[lte]`

### Get Property Detail
`GET /accommodations/:id`

---

## 📅 Bookings & Payments

### Create Booking & Razorpay Order
`POST /bookings`
- Headers: `Authorization: Bearer <token>`
- Body: `accommodationId, checkIn, checkOut, guests`

### Verify Payment
`POST /payment/verify`
- Headers: `Authorization: Bearer <token>`
- Body: `razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId`

---

## 🚨 Emergency

### Trigger SOS
`POST /emergency/sos`
- Headers: `Authorization: Bearer <token>`
- Body: `location: { lat, lng }`

---

## 🤖 Smart Features

### AI Trip Planner
`POST /trip-planner/generate`
- Body: `duration, budget, interests`

### Smart Chatbot
`POST /chatbot`
- Body: `message`
