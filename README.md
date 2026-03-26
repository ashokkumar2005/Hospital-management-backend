# 🏥 Hospital Management System – Backend API

This is a **complete backend project** built using **Node.js, Express.js, and MongoDB** for managing hospital operations. The project includes authentication, appointment management, blood donation features, and an AI‑based symptom checker.

This project is part of my journey to becoming a **MERN Full‑Stack Developer** and focuses on real‑world backend development concepts.

---

## 📌 Project Overview

The **Hospital Management System Backend** provides secure REST APIs for managing:

* Patients
* Doctors
* Hospitals
* Appointments
* Blood donation requests
* AI symptom analysis

The backend handles authentication, database operations, and business logic for the full hospital platform.

---

## 🚀 Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Security

* JWT Authentication
* bcrypt (password hashing)
* Protected Routes

### Other Tools

* Multer (file upload)
* CORS
* dotenv

---

## 📂 Project Structure

```
backend/
│
├── controllers/
│   ├── authController.js
│   ├── appointmentController.js
│   ├── hospitalController.js
│   └── bloodController.js
│
├── models/
│   ├── User.js
│   ├── Doctor.js
│   ├── Patient.js
│   ├── Appointment.js
│   └── BloodRequest.js
│
├── routes/
│   ├── authRoutes.js
│   ├── appointmentRoutes.js
│   ├── hospitalRoutes.js
│   └── bloodRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
├── config/
│   └── db.js
│
├── utils/
│   └── aiSymptomChecker.js
│
├── server.js
└── .env
```

---

## ✨ Features

### 🔐 Authentication System

* User registration and login
* JWT‑based authentication
* Password hashing using bcrypt
* Protected API routes

---

### 👤 Patient Features

* Register patient account
* Login patient
* Book appointments
* View appointment history
* Request blood donation

---

### 🩺 Doctor Features

* Doctor login
* View assigned appointments
* Update appointment status
* Manage availability

---

### 🛠 Admin Features

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

Request body:

```json
{
  "symptoms": ["fever", "cough"]
}
```

Example response:

```json
{
  "possibleDisease": "Flu",
  "suggestion": "Consult a doctor"
}
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/your-username/hospital-management-system.git
```

### 2️⃣ Navigate to Backend Folder

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
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### ▶️ Run the Server

```
npm start
```

Server will run at:

```
http://localhost:5000
```

---

## 🔗 Example API Endpoints

### Register User

```
POST /api/auth/register
```

### Login User

```
POST /api/auth/login
```

### Book Appointment

```
POST /api/appointments
```

---

## 🛡 Security Features

* JWT Authentication
* Password Hashing (bcrypt)
* Protected Routes
* Global Error Handling Middleware

---

## 🎯 What I Learned from This Project

* How real backend systems are structured
* Authentication and authorization using JWT
* Working with MongoDB using Mongoose
* Creating scalable REST APIs
* Handling appointments and medical data logic
* Building real‑world backend projects

---

## 🔮 Future Improvements

* AI disease prediction model
* Real‑time ambulance tracking
* Electronic health records (EHR)
* Email/SMS notification system

---

## 👨‍💻 Author

**Ashokkumar T**
Aspiring MERN Full‑Stack Developer

---

If you like this project, give it a ⭐ on GitHub!
