## 📂 **README.md**


# Subscription Tracker API

A RESTful API for managing and tracking subscriptions, built with **Node.js** and **Express.js**.  
This API allows users to create, update, delete, and view subscriptions along with upcoming renewals and user-specific tracking.

---

## 🚀 Features
- User authentication and authorization (JWT-based)
- Create, read, update, and delete subscriptions
- View subscriptions by user
- Cancel subscriptions
- Upcoming renewal tracking
- Input validation with middleware
- Swagger API documentation

---

## 📁 Folder Structure

- controllers/
- routes/
- middlewares/
- models/
- config/
- app.js
- swagger.yaml


---

## ⚙️ Installation


git clone https://github.com/RaY8118/Subscription-Tracker.git  
cd subscription-tracker-api  
npm install


---

## 🧩 Environment Variables

Create a `.env` file with:


PORT=5500  
DB_URI=your_mongo_uri  
JWT_SECRET=your_jwt_secret  
JWT_EXPIRES_IN="1d"  
NODE_ENV="development"


---

## ▶️ Running the Server


npm run dev


---

## 📚 API Documentation

Swagger docs available at:  

http://localhost:5500/docs


---

## 📬 Postman Collection

You can import the Postman collection from this repo to test endpoints easily.

---

## ✅ Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- Swagger for API docs

---


## 📜 License
This project is open-source and available under the MIT License.


---

