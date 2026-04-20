# 🏥 Hospital Management System – Backend API

A **production-ready backend system** built using **Node.js, Express.js, and MongoDB** to manage hospital operations efficiently. This project demonstrates real-world backend architecture, authentication, and scalable API design.

---

## 📌 Project Overview

The **Hospital Management System Backend** provides secure RESTful APIs for managing:

* 👤 Patients
* 🩺 Doctors
* 🏥 Hospitals
* 📅 Appointments
* 🩸 Blood donation requests
* 🤖 AI-based symptom analysis

It handles **authentication, authorization, database management, and business logic** for a complete healthcare platform.

---

## 🚀 Tech Stack

### 🖥 Backend

* Node.js
* Express.js

### 🗄 Database

* MongoDB
* Mongoose

### 🔐 Security

* JWT Authentication
* bcrypt (Password Hashing)
* Protected Routes

### 🧰 Tools & Utilities

* Multer (File Uploads)
* CORS
* dotenv

---

## 📂 Project Structure

```
backend/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── utils/
│
├── server.js
└── .env
```

---

## ✨ Key Features

### 🔐 Authentication System

* Secure user registration & login
* JWT-based authentication
* Password encryption using bcrypt
* Role-based protected routes

---

### 👤 Patient Module

* Register & login
* Book appointments
* View appointment history
* Request blood donation

---

### 🩺 Doctor Module

* Doctor authentication
* View assigned appointments
* Update appointment status
* Manage availability

---

### 🛠 Admin Module

* Add hospitals & doctors
* Manage users
* Monitor blood donation activity

---

### 🩸 Blood Donation System

* Donate blood
* Request blood
* View available donors

---

### 🤖 AI Symptom Checker API

#### 📥 Request

```
POST /api/symptoms
```

```json
{
  "symptoms": ["fever", "cough"]
}
```

#### 📤 Response

```json
{
  "possibleDisease": "Flu",
  "suggestion": "Consult a doctor"
}
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/ashokkumar2005/hospital-management-system.git
```

### 2️⃣ Navigate to Backend

```
cd backend
```

### 3️⃣ Install Dependencies

```
npm install
```

### 4️⃣ Setup Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## ▶️ Run the Server

```
npm start
```

Server runs at:

```
http://localhost:5000
```

---

## 🔗 Sample API Endpoints

| Feature          | Endpoint           | Method |
| ---------------- | ------------------ | ------ |
| Register User    | /api/auth/register | POST   |
| Login User       | /api/auth/login    | POST   |
| Book Appointment | /api/appointments  | POST   |

---

## 🛡 Security Highlights

* JWT-based Authentication
* Password Hashing (bcrypt)
* Role-based Access Control
* Centralized Error Handling

---

## 🎯 Key Learnings

* Designing scalable backend architecture
* Implementing authentication & authorization
* Building RESTful APIs with Express
* Managing data using MongoDB & Mongoose
* Handling real-world healthcare workflows

---

## 🔮 Future Enhancements

* 🧠 Advanced AI disease prediction
* 🚑 Real-time ambulance tracking
* 📁 Electronic Health Records (EHR)
* 📩 Email & SMS notifications

---

## 👨‍💻 Author

**Ashokkumar T**
Aspiring MERN Full-Stack Developer

---

⭐ If you found this project useful, consider giving it a star on GitHub!
