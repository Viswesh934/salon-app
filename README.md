

# Salon Booking System

Salon Booking System is a backend application designed to manage booking functionalities for a salon. It provides RESTful APIs for setting availability, listing available slots, scheduling bookings, and checking booked slots. Additionally, user authentication is implemented for secure access.

## Installation and Getting Started

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB installed and running locally or a MongoDB cluster link

### Getting Started

1. **Clone the repository**:

   \`\`\`bash
   git clone https://github.com/gyanavardhana/7webs.git
   \`\`\`

2. **Navigate to the cloned folder**:

   \`\`\`bash
   cd salon-app
   \`\`\`

3. **Install dependencies**:

   \`\`\`bash
   npm install
   \`\`\`

4. **Configure environment variables**:

   - Create a \`.env\` file in the root directory.
   - Define the following environment variables:
     \`\`\`plaintext
     MONGODB_URI=your-mongodb-uri
     PORT= your_preferred_port
     JWT_SECRET=some secret code
     \`\`\`

5. **Test the endpoints**:

   \`\`\`bash
   npm test
   \`\`\`

6. **Start the Server**:

   \`\`\`bash
   node app.js
   \`\`\`

   The server should now be running on [http://localhost:3000](http://localhost:3000).

## Authentication

User authentication is implemented using JWT (JSON Web Tokens). Endpoints for user registration, login, and logout are available.

- Register a new user: \`POST /api/users/register\`
- Login: \`POST /api/users/login\`
- Logout: \`POST /api/users/logout\`

## Salon Booking Availability APIs

### Set Availability

Allows the salon staff to set their availability for booking.

- **Set the availability of a day**: \`POST /api/availability\`
- **Request Body**: JSON object containing availability information
- **Response**: Success or error message

- **Get the availability of a date**: \`GET /api/available-slots/:date\`
- **Response**: Available slots for the specified date

## Salon Booking APIs

### Schedule Booking

Allows users to schedule a booking.

- **Schedule a Booking**: \`POST /api/bookings/\`
- **Request Body**: JSON object containing booking details
- **Response**: Success or error message

- **Get all Bookings**: \`GET /api/bookings/\`
- **Response**: List of all bookings

## Postman Collection

Each API, along with its usage documentation, request body, and response format, is available in this public Postman collection. You can use it to understand how to interact with the backend endpoints effectively.

[Postman Collection for the Salon Booking System APIs](https://elements.getpostman.com/redirect?entityId=28642644-f4c2027c-0022-42a4-a894-c7053ebd045f&entityType=collection)
EOF
