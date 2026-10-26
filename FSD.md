# Functional Specification Document (FSD)
## Project: HotelPro — Luxury Hotel Management & Booking System

---

## 1. Document Control & Metadata

| Field | Detail |
|---|---|
| **Project Name** | HotelPro |
| **Document Version** | 1.0.0 |
| **System Architecture** | Decoupled Client-Server MERN Architecture |
| **Target Audience** | Technical Recruiters, Project Evaluators, Full-Stack Engineers |
| **Frontend Deployment** | Vercel (Edge CDN) — `https://hotel-pro-ten.vercel.app` |
| **Backend Deployment** | Render Web Service — `https://hotelpro-api.onrender.com` |
| **Database** | MongoDB Atlas (Cloud Tier M0) |

---

## 2. Executive Summary & Problem Statement

### 2.1 Problem Statement
Traditional hospitality reservations often struggle with disjointed customer interfaces, real-time inventory synchronization conflicts, and opaque administrative overhead. Additionally, enterprise hotel applications require strict access boundaries separating public browsing from administrative management.

### 2.2 Solution Overview
HotelPro delivers an end-to-end hotel discovery and reservation platform. The system bridges responsive client-side UI workflows with a secure RESTful API, enforcing role-based access control (RBAC), conflict-free reservation scheduling, dynamic stay calculations, and simulated payment fulfillment.

---

## 3. High-Level System Architecture

```text
+-------------------------------------------------------------+
|                     Client Tier (React + Vite)              |
|  - Landing Page / Hero Showcase                             |
|  - Date Range Filtering & Category Browsing                 |
|  - Interactive Booking Modal (Simulated Payment)            |
|  - Role-Protected Dashboards (Customer / Admin)             |
+------------------------------+------------------------------+
                               |
                        HTTPS (REST API)
                               |
+------------------------------v------------------------------+
|                     Server Tier (Node.js + Express)         |
|  - CORS & Security Middleware                               |
|  - JWT Authentication & RBAC Middleware (fetchUser)         |
|  - Resource Routers (/api/users, /rooms, /bookings, etc.)   |
|  - In-Memory Fallback & Auto-Seeding Engine                 |
+------------------------------+------------------------------+
                               |
                        Mongoose ODM (TLS)
                               |
+------------------------------v------------------------------+
|                     Data Tier (MongoDB Atlas)               |
|  - Users Collection (Credentials & Roles)                   |
|  - Rooms Collection (Pricing, Capacities, Current Bookings) |
|  - Bookings Collection (Active & Historical Records)        |
+-------------------------------------------------------------+
4. User Personas & Role-Based Access Control (RBAC)Persona / RolePermitted ActionsAccess ConstraintsPublic GuestBrowse room categories, view amenities, filter dates.Read-only. Cannot reserve without authentication.Registered CustomerBook rooms, input stay dates, process simulated payment, review/cancel own bookings.Restricted to self-owned booking records.AdministratorAccess system KPI dashboard, audit all system bookings, add inventory rooms, manage registered users.Enforced via JWT payload verification (type === 'admin').5. Functional Requirements & Feature Breakdown5.1 Authentication & Authorization ModuleRegistration (/api/users/register): Creates user records with salted passwords using bcryptjs (work factor 10).Authentication (/api/users/login): Validates credentials, issues signed JSON Web Tokens (JWT) with standard expiration.Client Session Management: Token persists in browser localStorage. Axios request interceptors automatically inject Authorization: Bearer <token> and auth-token: <token> headers into outbound requests.Route Guards:ProtectedRoute.jsx: Redirects unauthenticated sessions to /login.AdminRoute.jsx: Restricts administrative routes to users with type === 'admin'.5.2 Room Inventory & Discovery ModulePublic Room Showcase: Visual hero carousel displaying luxury rooms, pricing, categories, and amenities.Availability Search Algorithm: Users input fromdate (Check-in) and todate (Check-out). The system checks conflicting ranges against each room's active bookings.Taxonomy Filtering: Dynamic filtering across categories (Deluxe, Super Deluxe, Suite, Family Suite, Standard, Executive).5.3 Booking & Simulated Payment WorkflowRoom Selection: User selects an available room from the catalog.Date Validation: System verifies that selected dates do not overlap with existing confirmed reservations.Calculation Engine: Computes total nights (totaldays = todate - fromdate) and stay cost (totalAmount = totaldays * rent).Simulated Payment Gateway:Displays a structured card modal (Card Number, Expiry, CVV, Cardholder Name).Simulates authorization feedback.Compliance Guarantee: Strictly sandboxed portfolio demonstration. Does not charge, persist, or transmit live banking credentials.State Transition: Generates a unique tracking ID (BK_XXXXXX), pushes the reservation into the user's registry, and updates the room's currentBookings array.5.4 Administrative Dashboard (AdminHome)Real-Time KPI Ribbon: Computes live aggregates for total reservations, active rooms, gross revenue ($), and total user accounts.Inventory Control: Add new rooms with pricing, capacity, detailed descriptions, and image asset arrays.Reservation Oversight: Audit all bookings across the platform with privilege to cancel or reinstate bookings.User Registry: Complete directory of registered customers and administrators with timestamps and contact details.6. Entity Data Models (Database Schema Specifications)6.1 User Schema (models/userModel.js)AttributeTypeConstraintsDescriptionuser_idStringRequired, UniqueSystem ID (e.g., USR_ADM001)nameStringRequiredFull NameemailStringRequired, UniqueUser Login EmailpasswordStringRequiredBcrypt HashphoneStringOptionalContact Phone NumbertypeStringRequired, EnumRole: admin or customer6.2 Room Schema (models/roomModel.js)AttributeTypeConstraintsDescriptionroom_idStringRequired, UniqueSystem ID (e.g., RM_101)roomNumberStringRequiredPhysical Unit NumbertypeStringRequiredCategory classificationrentNumberRequiredPrice per night ($)countNumberDefault: 1Capacity / Unit CountdescriptionStringRequiredAmenities descriptionphotos[String]RequiredArray of image asset URLscurrentBookingsArrayDefault: []Nested booking status snapshots6.3 Booking Schema (models/bookingModel.js)AttributeTypeConstraintsDescriptionbooking_idStringRequired, UniquePublic tracking referenceroom_idStringRequiredTarget Room referenceuser_idStringRequiredBooking User referencenameStringRequiredGuest NamefromdateStringRequiredCheck-in DatetodateStringRequiredCheck-out DatetotaldaysNumberRequiredDuration of staytotalAmountNumberRequiredTotal calculated cost ($)statusStringDefault: 'booked'Status: booked or cancelled7. API Route DirectoryVerbPathAuth / RoleDescriptionGET/PublicServer healthcheck & API registryPOST/api/users/registerPublicRegister new customer accountPOST/api/users/loginPublicAuthenticate and obtain JWTGET/api/users/getallusersAdminRetrieve all registered usersGET/api/rooms/getallroomsPublicRetrieve entire room inventoryPOST/api/rooms/addroomAdminAdd new room to inventoryPOST/api/bookings/bookroomUserConfirm new room reservationPOST/api/bookings/cancelbookingUser / AdminCancel active bookingGET/api/bookings/getallbookingsAdminRetrieve master booking listPOST/api/bookings/getuserbookingsUserRetrieve self-owned bookings8. Non-Functional & Operational RequirementsSecurity: Passwords are one-way hashed with bcryptjs. Sensitive secrets (MONGODB_URI, JWT_SECRET) are strictly maintained within server environment boundaries and excluded from public version control.Resilience & Fallback: If cloud database connectivity is disrupted, the backend initializes an in-memory database instance (mongodb-memory-server) to ensure zero-crash portfolio evaluations.CORS Governance: Dynamic origin resolution allows authorized Vercel production domains and local development environments while restricting untrusted origins.Single Page Application (SPA) Routing: client/vercel.json rewrites all client-side navigation back to /index.html, eliminating 404 errors on browser page reloads.
