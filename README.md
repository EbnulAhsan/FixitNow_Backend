# FixItNow Backend API

FixItNow is a production-ready, role-based home service marketplace backend built with Node.js, Express, TypeScript, PostgreSQL, Prisma, JWT, Zod, and Stripe. The platform connects Customers with Technicians while providing Administrators with secure tools for managing users, categories, bookings, and payments.

The project includes complete REST API documentation, server-side validation, structured JSON error handling, role-based authorization, real Stripe Payment Intent processing, signed Stripe webhook verification, deployment on Render, and a PostgreSQL production database.

---

## Live Links and Submission Information

- **Backend Repository:** https://github.com/EbnulAhsan/FixItNow_Backend
- **Live API:** https://fixitnow-backend-rkod.onrender.com
- **Health Check:** https://fixitnow-backend-rkod.onrender.com/
- **Postman Collection:** [`postman/FixItNow.postman_collection.json`](./postman/FixItNow.postman_collection.json)
- **Demo Video:** `ADD_DEMO_VIDEO_LINK_HERE`

> The Render free instance may take a short time to wake up after inactivity.

---

## Admin Credentials

Use the following demo credentials to test Admin-protected endpoints:

```text
Email: admin@fixitnow.com
Password: Admin1721
```

> These credentials are provided only for assignment evaluation. Do not reuse this password for personal accounts.

---

## Project Overview

FixItNow provides a complete backend workflow for a home service marketplace. Customers can discover services, create bookings, pay through Stripe, track payments, and submit reviews. Technicians can maintain professional profiles, publish services, manage their assigned bookings, and update booking statuses. Administrators can manage users, categories, bookings, and payments through protected endpoints.

### Supported Roles

- `CUSTOMER`
- `TECHNICIAN`
- `ADMIN`

---

## Mandatory Assignment Requirements

- [x] Postman collection covering all API endpoints
- [x] Consistent structured JSON error responses
- [x] At least 20 meaningful backend commits
- [x] Server-side validation on protected and public endpoints
- [x] Working Admin email and password
- [x] Real Stripe payment integration
- [x] Signed Stripe webhook verification
- [x] Payment status tracking
- [x] Customer, Technician, and Admin roles
- [x] Role-based authorization
- [x] Live API deployment on Render
- [x] Production PostgreSQL database
- [x] Production Stripe webhook endpoint
- [ ] Demo video link

---

## Core Features

### Authentication and Authorization

- Customer and Technician registration
- Customer, Technician, and Admin login
- JWT access and refresh token configuration
- Retrieve the currently authenticated user
- Role-based route protection
- Database checks for blocked or soft-deleted users
- Prevention of blocked-user login
- Rejection of old tokens belonging to blocked or deleted users
- Generic invalid-credential responses
- Password hashing with bcrypt

### Technician Profile

- Create or update a Technician profile using a single upsert endpoint
- Add a professional biography
- Add up to 20 unique skills
- Add years of experience
- Configure an hourly service rate
- Technician-only authorization

### Category Management

- Admin-only category creation
- Retrieve all categories publicly
- Admin-only category update
- Admin-only category deletion
- Duplicate category prevention
- Safe deletion protection when services are associated with a category
- UUID and request-body validation

### Service Management

- Technician-only service creation
- Retrieve all services
- Retrieve a single service
- Search services by keyword
- Filter services by category
- Filter services by minimum and maximum price
- Technician-only service update and deletion
- Service ownership verification
- Customer role restriction
- Non-owner Technician restriction

### Booking Management

- Customer booking creation
- Customer booking history
- Technician booking history
- Retrieve a single booking
- Technician-controlled booking status updates
- Customer-controlled booking cancellation
- Booking ownership and role validation
- Controlled booking status transitions

Supported booking statuses:

```text
REQUESTED
ACCEPTED
DECLINED
PAID
IN_PROGRESS
COMPLETED
CANCELLED
```

### Stripe Payment Integration

FixItNow uses Stripe Test Mode for real payment processing. No Cash on Delivery, Pay Later, or simulated payment workflow is used.

The payment workflow is:

1. A Customer creates a booking.
2. The assigned Technician accepts the booking.
3. The Customer creates a Stripe Payment Intent.
4. Stripe processes the test payment.
5. Stripe sends a signed webhook event to the production API.
6. The backend verifies the Stripe signature.
7. The Payment status becomes `COMPLETED`.
8. The related Booking status becomes `PAID`.
9. The Customer can view the completed payment in payment history.
10. The Admin can view and filter all payment records.

Implemented payment features:

- Stripe Payment Intent creation
- Stripe transaction ID tracking
- Payment status tracking
- Signed webhook verification
- Successful payment processing
- Failed payment processing
- Idempotent webhook handling
- Safe acknowledgement of unknown Stripe test events
- Customer payment history
- Admin payment listing
- Payment filtering by status and provider
- Pagination for Admin payment results

### Review Management

- Customer review submission
- Reviews allowed only for completed bookings
- One review per eligible booking
- Retrieve Technician reviews publicly
- Average Technician rating
- Total Technician review count
- Customer-owned review update
- Customer-owned review deletion
- Rating validation from 1 to 5

### Admin Management

- Retrieve all users
- Search users
- Filter users by role
- Filter users by blocked status
- Filter users by deleted status
- Block active users
- Unblock blocked users
- Soft delete users
- Retrieve all bookings
- Search and filter bookings
- Retrieve all payments
- Filter payments by status and provider
- Paginated Admin responses

---

## Technology Stack

### Backend

- Node.js
- Express.js 5
- TypeScript

### Database

- PostgreSQL
- Prisma ORM
- Render PostgreSQL

### Authentication and Security

- JSON Web Token
- bcrypt password hashing
- Role-based authorization middleware
- Database-level account status checks

### Validation and Error Handling

- Zod
- Request body validation
- Route parameter validation
- Query parameter validation
- Structured JSON errors
- JSON `404 Not Found` handler

### Payment and Deployment

- Stripe Payment Intents
- Stripe signed webhooks
- Stripe CLI for local testing
- Render Web Service
- Render PostgreSQL
- Postman

---

## Live API Base URL

```text
https://fixitnow-backend-rkod.onrender.com
```

All API endpoints use the `/api` prefix.

Example:

```text
https://fixitnow-backend-rkod.onrender.com/api/services
```

### Health Check

```http
GET /
```

Expected response:

```text
FixItNow Server Running
```

---

## API Documentation

A complete Postman collection covering the API endpoints is included in this repository:

```text
postman/FixItNow.postman_collection.json
```

### Import the Postman Collection

1. Clone or download this repository.
2. Open Postman.
3. Click **Import**.
4. Select `postman/FixItNow.postman_collection.json`.
5. Open the imported `fixitNow` collection.
6. Set the collection variable `baseUrl` to:

```text
https://fixitnow-backend-rkod.onrender.com
```

7. Register or log in with the appropriate role.
8. Copy the returned access token.
9. Use the token as a Bearer Token for protected requests.

The collection contains requests for:

- Authentication
- Technician Profile
- Categories
- Services
- Bookings
- Payments
- Reviews
- Admin operations
- Successful response examples
- Validation errors
- Authorization and ownership restrictions

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Technician Profile

```http
PUT /api/technician/profile
```

### Categories

```http
POST   /api/categories
GET    /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

### Services

```http
GET    /api/services
POST   /api/services
GET    /api/services/:id
PATCH  /api/services/:id
DELETE /api/services/:id
```

Example filters:

```text
GET /api/services?searchTerm=plumbing
GET /api/services?categoryId=YOUR_CATEGORY_ID
GET /api/services?minPrice=500&maxPrice=2000
```

### Bookings

```http
POST  /api/bookings
GET   /api/bookings/my-bookings
GET   /api/bookings/technician-bookings
PATCH /api/bookings/:id/status
PATCH /api/bookings/:id/cancel
GET   /api/bookings/:id
```

### Payments

```http
POST /api/payments/create-payment-intent
GET  /api/payments/my-payments
POST /api/payments/webhook
```

### Reviews

```http
POST   /api/reviews
GET    /api/reviews/technician/:technicianId
PATCH  /api/reviews/:id
DELETE /api/reviews/:id
```

### Admin

```http
GET   /api/admin/users
PATCH /api/admin/users/:id/block
PATCH /api/admin/users/:id/unblock
PATCH /api/admin/users/:id/soft-delete
GET   /api/admin/bookings
GET   /api/admin/payments
```

Example Admin queries:

```text
GET /api/admin/users?role=CUSTOMER
GET /api/admin/users?isBlocked=true
GET /api/admin/users?isDeleted=false
GET /api/admin/users?searchTerm=customer
GET /api/admin/bookings?status=COMPLETED&page=1&limit=10
GET /api/admin/payments?status=COMPLETED&provider=STRIPE&page=1&limit=10
```

---

## API Response Format

### Successful Response

```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": {}
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Resources retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "data": []
}
```

### Application Error

```json
{
  "success": false,
  "message": "Resource could not be processed",
  "errorDetails": {
    "statusCode": 400
  }
}
```

### Validation Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errorDetails": [
    {
      "path": "body.email",
      "message": "Invalid email address"
    }
  ]
}
```

### Unknown Route

```json
{
  "success": false,
  "message": "API endpoint not found",
  "errorDetails": {
    "statusCode": 404
  }
}
```

---

## HTTP Status Codes

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

---

## Local Installation

### Prerequisites

Install the following tools:

- Node.js
- npm
- PostgreSQL
- Git
- Postman
- Stripe CLI, for local webhook testing

### Clone the Repository

```bash
git clone https://github.com/EbnulAhsan/FixItNow_Backend.git
cd FixItNow_Backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="YOUR_POSTGRESQL_DATABASE_URL"

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET="YOUR_SECURE_ACCESS_SECRET"
JWT_ACCESS_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="YOUR_SECURE_REFRESH_SECRET"
JWT_REFRESH_EXPIRES_IN="30d"

STRIPE_SECRET_KEY="YOUR_STRIPE_TEST_SECRET_KEY"
STRIPE_WEBHOOK_SECRET="YOUR_STRIPE_WEBHOOK_SIGNING_SECRET"
```

Never commit `.env`, database credentials, JWT secrets, Stripe secret keys, webhook secrets, access tokens, or Payment Intent client secrets.

---

## Database Setup

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Development Migrations

```bash
npx prisma migrate dev
```

### Run Production Migrations

```bash
npx prisma migrate deploy
```

### Open Prisma Studio

```bash
npx prisma studio
```

---

## Run the Project

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Production Start

```bash
npm start
```

The local server runs at:

```text
http://localhost:5000
```

---

## Stripe Webhook Testing

### Local Testing with Stripe CLI

Log in to Stripe CLI:

```bash
stripe login
```

Forward signed events to the local backend:

```bash
stripe listen --events "payment_intent.succeeded,payment_intent.payment_failed" --forward-to "http://localhost:5000/api/payments/webhook"
```

Use the temporary Stripe CLI signing secret as the local `STRIPE_WEBHOOK_SECRET`, then restart the backend.

Confirm a test Payment Intent:

```bash
stripe payment_intents confirm YOUR_PAYMENT_INTENT_ID --payment-method pm_card_visa --return-url "http://localhost:5000/payment/success"
```

Expected successful webhook result:

```text
payment_intent.succeeded
200 POST /api/payments/webhook
```

After successful processing:

```text
Payment status: COMPLETED
Booking status: PAID
```

### Production Webhook

The Stripe sandbox destination is configured to use:

```text
https://fixitnow-backend-rkod.onrender.com/api/payments/webhook
```

Subscribed events:

```text
payment_intent.succeeded
payment_intent.payment_failed
```

The production webhook has been tested successfully with a signed Stripe event and returned `200 OK`.

---

## Render Deployment Configuration

### Region

```text
Singapore (Southeast Asia)
```

### Build Command

```bash
npm install --include=dev && npx prisma generate && npm run build
```

### Start Command

```bash
npx prisma migrate deploy && npm start
```

### Required Environment Variables

```text
NODE_ENV
DATABASE_URL
BCRYPT_SALT_ROUNDS
JWT_ACCESS_SECRET
JWT_ACCESS_EXPIRES_IN
JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRES_IN
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

Render provides the `PORT` environment variable automatically, and the application falls back to port `5000` during local development.

---

## Role Permissions

### Customer

- Register and log in
- Retrieve own profile
- Browse services
- Create bookings
- View own bookings
- Cancel eligible bookings
- Create Stripe Payment Intents
- View payment history
- Submit reviews for completed bookings
- Update and delete owned reviews

### Technician

- Register and log in
- Retrieve own profile
- Create or update Technician profile
- Create services
- Update and delete owned services
- View assigned bookings
- Accept or decline requested bookings
- Start paid bookings
- Complete eligible bookings

### Admin

- Log in with the provided Admin credentials
- Retrieve all users
- Search and filter users
- Block users
- Unblock users
- Soft delete users
- Manage categories
- Retrieve all bookings
- Search and filter bookings
- Retrieve all payments
- Filter payments by status and provider

---

## Security Measures

- JWT authentication
- bcrypt password hashing
- Role-based route authorization
- Server-side Zod validation
- UUID route parameter validation
- Query string validation
- Strict request-body validation
- Blocked-user login prevention
- Deleted-user access prevention
- Old-token invalidation through database checks
- Service ownership verification
- Booking ownership verification
- Review ownership verification
- Stripe webhook signature verification
- Safe webhook acknowledgement for unknown Stripe test events
- Structured JSON error responses
- Structured JSON `404 Not Found` responses
- Secrets excluded from source control and exported Postman files

---

## Validation Coverage

The backend validates:

- Registration data
- Login credentials
- Email formatting
- Password strength
- User roles
- Technician skills
- Technician experience
- Technician hourly rates
- Category bodies and UUIDs
- Service titles, descriptions, prices, and filters
- Booking dates and status transitions
- Payment booking IDs
- Review ratings and comments
- Search parameters
- Filter parameters
- Pagination values
- Admin query parameters

---

## Commit History

The repository contains at least 20 meaningful backend commits with descriptive messages.

Examples:

```text
feat: add technician profile management
feat: implement booking workflow
feat: integrate Stripe payment intents and webhooks
fix: return consistent HTTP status and structured 404 errors
fix: strengthen admin and service input validation
fix: safely acknowledge webhooks for unknown payments
docs: add complete Postman API collection
```

---

## Demo Video

A 3 to 5 minute API walkthrough video will be available here:

```text
ADD_DEMO_VIDEO_LINK_HERE
```

Recommended video coverage:

1. Project overview and architecture
2. Customer registration and login
3. Technician registration and login
4. Admin login
5. Technician profile management
6. Category and Service CRUD
7. Customer booking creation
8. Technician booking status update
9. Stripe Payment Intent creation
10. Signed Stripe webhook processing
11. Payment status `COMPLETED`
12. Booking status `PAID`
13. Review workflow
14. Admin User, Booking, and Payment Management
15. Validation and authorization errors
16. One technical challenge and its solution

---

## Final Submission Summary

```text
Backend Repo     : https://github.com/EbnulAhsan/FixItNow_Backend
Live API         : https://fixitnow-backend-rkod.onrender.com
API Docs         : postman/FixItNow.postman_collection.json
Demo Video       : ADD_DEMO_VIDEO_LINK_HERE
Admin Email      : admin@fixitnow.com
Admin Password   : Admin1721
```

---

## Author

**MD. EBNUL AHSAN**

Backend Project for Assignment 4.

---

## License

This project was created for educational and assignment purposes.
