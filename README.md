# HotelPro - Luxury Hotel Management & Booking System

**HotelPro** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered for luxury hotel room discovery, reservation scheduling, simulated card payment authorization, and comprehensive administrative oversight.

---

## Key Features

### Customer Experience
- **Public Showcase & Hero Carousel:** High-impact visual carousel displaying hotel suites, oceanfront villas, and five-star amenities.
- **Date & Room Availability Search:** Real-time date range filtering (`Check-in` to `Check-out`) that calculates availability by cross-checking active bookings.
- **Category Filtering & Keyword Search:** Filter by Deluxe, Super Deluxe, Suite, Family Suite, or Standard.
- **Interactive Booking & Simulated Payment:** Dynamic calculation of stay duration and total cost, featuring a simulated card authorization modal for demonstration purposes.
- **My Reservations (`My Bookings`):** Customer dashboard tracking active and past bookings, with one-click reservation cancellation.

### Administrator Operations (`AdminHome`)
- **KPI Metrics Ribbon:** Live statistics tracking total reservations, active room count, total hotel revenue, and registered user accounts.
- **Tab-Based Interface (`MDBTabs`):**
  1. **All Bookings:** View and filter all system reservations with live status badges (`Confirmed` vs `Cancelled`) and administrative cancel privileges.
  2. **All Rooms:** Real-time inventory table showing room numbers, categories, nightly pricing, capacity, and active reservations.
  3. **Add Room:** Administrative form with room number, type, rent per night, capacity, detailed descriptions, and image management.
  4. **All Users:** Complete system user registry displaying User IDs, names, emails, phone numbers, roles, and join dates.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router Dom v6, Axios, Bootstrap 5, MDB React UI Kit, Material UI, React Toastify, FontAwesome |
| **Backend** | Node.js, Express.js, Mongoose, JWT (`jsonwebtoken`), bcryptjs, Multer, dotenv, CORS, Nodemailer |
| **Database** | MongoDB with zero-config in-memory fallback (`mongodb-memory-server`) |

---

## Database Schemas

- **User (`models/userModel.js`):**
  - `user_id`: Unique identifier (e.g., `USR_ADM001`)
  - `name`: Full name
  - `email`: Unique email address
  - `password`: Hashed with `bcryptjs`
  - `phone`: Contact phone number
  - `type`: Account role (`admin` or `customer`)

- **Room (`models/roomModel.js`):**
  - `room_id`: Unique room identifier (e.g., `RM_101`)
  - `roomNumber`: Room unit number
  - `description`: Room amenities and view details
  - `photos`: Array of image URLs
  - `type`: Category (`Deluxe`, `Super Deluxe`, `Suite`, `Family Suite`, `Standard`, `Executive`)
  - `rent`: Price per night ($)
  - `count`: Room inventory / capacity units
  - `currentBookings`: Array of `{ booking_id, fromdate, todate, user_id, status }`

- **Booking (`models/bookingModel.js`):**
  - `booking_id`: Unique booking code (e.g., `BK_970098`)
  - `room_id`: Room reference
  - `user_id`: Customer reference
  - `name`: Primary guest name
  - `fromdate`: Check-in date
  - `todate`: Check-out date
  - `totaldays`: Total nights
  - `totalAmount`: Total calculated cost ($)
  - `status`: Reservation status (`booked` or `cancelled`)

- **Payment Authorization (Demo Flow):**
  - The payment module is designed strictly as a portfolio simulation. It validates card structure for UI flow demonstration without processing or storing live financial credentials.

---

## Quick Start Guide

### 1. Backend Server (`server/`)
```bash
cd server
npm install
npm run dev
