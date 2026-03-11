# Hospital Management System – Backend

## 📌 Project Overview

The **Hospital Management System Backend** is built using **Node.js, Express.js, and MongoDB**.

It provides REST APIs for managing:

* Patients
* Doctors
* Hospitals
* Appointments
* Blood donation requests
* AI symptom analysis

The backend handles authentication, database operations, and business logic for the hospital management platform.

---

## 🚀 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt for password hashing
* Multer (file upload)
* CORS
* dotenv

---

## 📂 Folder Structure

```
backend/
 ├── controllers/
 │     ├── authController.js
 │     ├── appointmentController.js
 │     ├── hospitalController.js
 │     └── bloodController.js
 │
 ├── models/
 │     ├── User.js
 │     ├── Doctor.js
 │     ├── Patient.js
 │     ├── Appointment.js
 │     └── BloodRequest.js
 │
 ├── routes/
 │     ├── authRoutes.js
 │     ├── appointmentRoutes.js
 │     ├── hospitalRoutes.js
 │     └── bloodRoutes.js
 │
 ├── middleware/
 │     ├── authMiddleware.js
 │     └── errorMiddleware.js
 │
 ├── config/
 │     └── db.js
 │
 ├── utils/
 │     └── aiSymptomChecker.js
 │
 ├── server.js
 └── .env
```

---

## ✨ Features

### 🔐 Authentication

* JWT-based authentication
* Password hashing using bcrypt
* Secure login and registration

---

### 👤 Patient APIs

* Register patient
* Login patient
* Book appointment
* View appointments
* Blood request

---

### 🩺 Doctor APIs

* Doctor login
* View assigned appointments
* Update appointment status
* Manage availability

---

### 🛠 Admin APIs

* Add hospitals
* Add doctors
* Manage users
* Monitor blood donation records

---

### 🩸 Blood Donation System

Patients can:

* Donate blood
* Request blood
* View available donors

---

### 🤖 AI Symptom Checker API

Example request:

```
POST /api/symptoms
```

Request Body:

```json
{
  "symptoms": ["fever", "cough"]
}
```

Response:

```json
{
  "possibleDisease": "Flu",
  "suggestion": "Consult a doctor"
}
```

---

## 🔧 Installation

### 1️⃣ Clone the Repository

```
git clone https://github.com/yourusername/hospital-management-system.git
```

### 2️⃣ Navigate to Backend

```
cd backend
```

### 3️⃣ Install Dependencies

```
npm install
```

### 4️⃣ Create `.env` File

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

### 5️⃣ Start Server

```
npm start
```

Server runs at:

```
http://localhost:5000
```

---

## 🔗 Example API

### Register User

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

### Book Appointment

```
POST /api/appointments
```

---

## 🛡 Security

* JWT Authentication
* Password Hashing
* Protected Routes
* Global Error Handling

---

## 🔮 Future Improvements

* AI disease prediction model
* Real-time ambulance tracking
* Electronic health records
* Notification system

---

## 👨‍💻 Author

Ashok Sam

MERN Stack Developer
