Sure! Here's a **README** file with the correct format for your project, incorporating the necessary changes and providing all the required details:

---

# **IRCTC Railway Management System**

## **Problem Statement**

Welcome to the IRCTC Railway Management System! The system allows users to check available trains between two stations, see how many seats are available, and book a seat if available. The system uses real-time data to handle multiple users, ensuring that race conditions are handled efficiently during seat booking.

This system has two main roles: **Admin** and **User**. Admins can manage train data, while users can register, log in, check availability, and book seats.

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
   git clone https://github.com/ujjawalkumar131/IRCTC_API_WorkIndia.git
   cd IRCTC_API_WorkIndia
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your MySQL database:
   - Create a MySQL database named `irctc_db`.
   - Run the SQL scripts in `database/schema.sql` to create necessary tables (`users`, `trains`, `bookings`).

**Example:**
```sql
CREATE DATABASE irctc_db;
USE irctc_db;

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
      "email": "john@example.com",
      "password": "password"
  }
  ```

- **Response** (Status: `201 Created`):
  ```json
  {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-12-07T12:34:56.789Z",
      "updatedAt": "2024-12-07T12:34:56.789Z"
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
- **Endpoint**: `http://localhost:3000/user/availability?source=Ranchi&destination=Delhi`
- **Query Parameters**:
  - `source`: Source station (e.g., "Ranchi")
  - `destination`: Destination station (e.g., "Delhi")

- **Response**:
  ```json
  {
      "available": true,
      "availableTrainCount": 1,
      "trains": [
          {
              "trainNumber": "123123",
              "availableSeats": 600
          }
      ]
  }
  ```

#### 4. **Book Seats**

- **HTTP Method**: `POST`
- **Endpoint**: `http://localhost:3000/user/book`
- **Request Body** (JSON):
  ```json
  {
      "trainId": 1,
      "seatsToBook": 2
  }
  ```

- **Response** (Status: `201 Created`):
  ```json
  {
      "message": "Seats booked successfully"
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
      "trainNumber": "172622",
      "source": "Ranchi",
      "destination": "Delhi",
      "totalSeats": 600,
      "availableSeats": 600
  }
  ```

- **Response** (Status: `200 OK`):
  ```json
  {
      "message": "Train added successfully"
  }
  ```

- **Headers**: `x-api-key: <your_admin_api_key>` (API key provided in `.env` file)

#### 2. **Update Seat Availability**

- **HTTP Method**: `PUT`
- **Endpoint**: `http://localhost:3000/admin/update-seats/:trainId`
- **Request Body** (JSON):
  ```json
  {
      "totalSeats": 200,
      "availableSeats": 150
  }
  ```

- **Response** (Status: `200 OK`):
  ```json
  {
      "message": "Seats updated successfully"
  }
  ```

- **Headers**: `x-api-key: <your_admin_api_key>` (API key provided in `.env` file)

---

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

## **Future Enhancements**

- **Frontend Interface**: Create a frontend using **React** or **Angular** for a complete UI.
- **Seat Selection**: Implement seat selection functionality during booking.
- **Email Notifications**: Send booking confirmations via email.
- **Payment Gateway Integration**: Integrate a payment system for booking confirmations.

---

## **Contributing**

Feel free to fork the repository and make contributions through pull requests. Any enhancements, bug fixes, or suggestions are welcome!

---

Let me know if you need any changes or further modifications!