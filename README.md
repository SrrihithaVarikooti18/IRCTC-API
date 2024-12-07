Sure! Here's a **README** file with the correct format for your project, incorporating the necessary changes and providing all the required details:

---

# **IRCTC Railway Management System**

## **Problem Statement**

Hey there, Mr. X. You have been appointed to design a railway management system like IRCTC, where users can come on the platform and
check if there are any trains available between 2 stations.
The app will also display how many seats are available between any 2 stations and the user can book a seat if the availability > 0 after
logging in. Since this has to be real-time and multiple users can book seats simultaneously, your code must be optimized enough to handle
large traffic and should not fail while doing any bookings.
If more than 1 users simultaneously try to book seats, only either one of the users should be able to book. Handle such race conditions
while booking.
There is a Role Based Access provision and 2 types of users would exist :
1. Admin - can perform all operations like adding trains, updating total seats in a train, etc.
2. Login users - can check availability of trains, seat availability, book seats, get booking details, etc.

---

## **Features**

- User registration and login with **JWT authentication**
- Check available trains between source and destination
- Book seats with real-time availability updates and race condition handling
- Admin functionalities: add new trains, update seat availability, and manage trains
- Role-based access (admin/user)
- Error handling and input validation

---

## **Project Setup**

### **Prerequisites**

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or later)
- [MySQL](https://www.mysql.com/) (Database setup)
- [Postman](https://www.postman.com/) (for API testing)

### **Environment Variables**

Create a `.env` file in the root of your project with the following environment variables:

```bash
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=irctc_db
JWT_SECRET=your_jwt_secret
API_KEY=your_admin_api_key
```

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/SrrihithaVarikooti18/IRCTC-API.git
   cd IRCTC_API
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your MySQL database:
   - Create a MySQL database named `irctc`.
   - Run the SQL scripts in `database/schema.sql` to create necessary tables (`users`, `trains`, `bookings`).

**Example:**
```sql
CREATE DATABASE irctc;
USE irctc;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(50) NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    train_id INT,
    seats INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (train_id) REFERENCES trains(id)
);
```

### **Starting the Server**

Once the setup is complete, start the server using:

```bash
npm start
```

By default, the server will run on port `3000`. You can access the API at [http://localhost:3000](http://localhost:3000).

---

## **API Endpoints**

### **User Routes**

#### 1. **Register a New User**

- **HTTP Method**: `POST`
- **Endpoint**: `http://localhost:3000/user/register`
- **Request Body** (JSON):
  ```json
  {
      "name": "John Doe",
      "password": "password",
      "role": "user"
  }
  ```

- **Response** (Status: `201 Created`):
  ```json
  {
    "id": 6,
    "username": "John Doe",
    "password": "$2b$10$x./sNAT/1Ae7yOuz5.utmukc71ZkY/aWeDFPBRe50/zmV5TfyIl8a",
    "role": "user",
    "updatedAt": "2024-12-07T07:59:55.430Z",
    "createdAt": "2024-12-07T07:59:55.430Z"
}
  ```

#### 2. **Login**

- **HTTP Method**: `POST`
- **Endpoint**: `http://localhost:3000/user/login`
- **Request Body** (JSON):
  ```json
  {
      "email": "john@example.com",
      "password": "password"
  }
  ```

- **Response** (Status: `200 OK`):
  ```json
  {
      "token": "your_jwt_token_here"
  }
  ```

#### 3. **Check Train Availability**

- **HTTP Method**: `GET`
- **Endpoint**: `http://localhost:3000/user/availability?source=Hyderabad&destination=Bangalore`
- **Query Parameters**:
  - `source`: Source station (e.g., "Ranchi")
  - `destination`: Destination station (e.g., "Delhi")

- **Response**:
  ```json
  {
        "id": 1,
        "name": "Superfast Express",
        "source": "Hyderabad",
        "destination": "Bangalore",
        "totalSeats": 100,
        "availableSeats": 93,
        "createdAt": "2024-12-07T09:52:30.000Z",
        "updatedAt": "2024-12-07T07:50:36.000Z"
    }
  ```

#### 4. **Book Seats**

- **HTTP Method**: `POST`
- **Endpoint**: `http://localhost:3000/user/book`
- **Request Body** (JSON):
  ```json
  {
  "trainId": 1,
  "seatCount": 2
}

  ```

- **Response** (Status: `201 Created`):
  ```json
  {
    "id": 7,
    "userId": 5,
    "trainId": 1,
    "seatCount": 2,
    "updatedAt": "2024-12-07T08:03:31.555Z",
    "createdAt": "2024-12-07T08:03:31.555Z"
}
  ```

> **Note**: This request requires **JWT authentication**. Add the `Authorization` header: `Bearer <your_jwt_token>`.

#### 5. **Get Booking Details**

- **HTTP Method**: `GET`
- **Endpoint**: `http://localhost:3000/user/getAllbookings`
- **Response**:
  ```json
  [
      {
          "booking_id": 17,
          "number_of_seats": 50,
          "train_number": "123123",
          "source": "Ranchi",
          "destination": "Delhi"
      }
  ]
  ```

### **Admin Routes**

#### 1. **Add a New Train**

- **HTTP Method**: `POST`
- **Endpoint**: `http://localhost:3000/admin/addTrain`

- **Request Body** (JSON):
  ```json
  {
  "name": "Express 101",
  "source": "chennai",
  "destination": "Nellore",
  "totalSeats": 100
}

  ```

- **Response** (Status: `200 OK`):
  ```json
  {
    "id": 3,
    "name": "Express 101",
    "source": "chennai",
    "destination": "Nellore",
    "totalSeats": 100,
    "availableSeats": 100,
    "updatedAt": "2024-12-07T08:08:00.138Z",
    "createdAt": "2024-12-07T08:08:00.138Z"
}
  ```

- **Headers**: `x-api-key: <your_admin_api_key>` (API key provided in `.env` file)



## **Postman Testing**

You can test all the available APIs using Postman. Below is an example of how you can set up each request:

### **Test Example:**

1. **Register a User**: 
   - Use the `POST /user/register` endpoint to create a new user.
   
2. **Login**: 
   - Use the `POST /user/login` endpoint to generate a JWT token.
   - Save the token for use in **protected routes**.

3. **Book a Seat**:
   - Use the `POST /user/book` endpoint to book a seat by passing the `trainId` and `seatsToBook` in the body.

4. **Get Booking Details**:
   - Use the `GET /user/getAllbookings` endpoint to retrieve booking details.

---

## **Technologies Used**

- **Node.js**: Backend logic
- **Express.js**: Web framework for building the RESTful API
- **MySQL**: Database for storing train, user, and booking data
- **JWT**: For authentication and authorization
- **bcrypt**: For password hashing
- **dotenv**: For managing environment variables

---

