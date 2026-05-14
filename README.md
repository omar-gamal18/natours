# 🌍 Natours API

A powerful and scalable backend application for managing tours, built with Node.js and modern web technologies. This project is part of a learning journey inspired by Jonas Schmedtmann's course, focusing on writing clean, maintainable, and production-ready code.

---

## 🚀 Features

* 🔐 Authentication & Authorization (JWT)
* 👥 User Roles (Admin, User, Guide, Lead Guide)
* 🗺️ Tours Management (CRUD operations)
* 📍 Geospatial Queries (find tours within distance)
* ⭐ Reviews & Ratings system
* 📊 Advanced Filtering, Sorting, Pagination
* ⚡ Performance optimization (Indexes, Aggregation)
* 🛡️ Security Best Practices (Helmet, Rate Limiting, Data Sanitization)

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT (Authentication)
* Postman (API Testing)

---

## 📁 Project Structure

```
natours/
│
├── controllers/
├── models/
├── routes/
├── utils/
├── dev-data/
├── public/
├── app.js
└── server.js
```

---

## ⚙️ Installation & Setup

1. Clone the repo:

```
git clone https://github.com/your-username/natours.git
cd natours
```

2. Install dependencies:

```
npm install
```

3. Create a config.env file and add:

```
PORT=3000
DATABASE=your_database_connection
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=90d
```

4. Run the server:

```
npm run dev
```

---

## 🔗 API Endpoints (Examples)

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| GET    | /api/v1/tours     | Get all tours   |
| GET    | /api/v1/tours/:id | Get single tour |
| POST   | /api/v1/tours     | Create new tour |
| PATCH  | /api/v1/tours/:id | Update tour     |
| DELETE | /api/v1/tours/:id | Delete tour     |

---

## 🌐 Geospatial Example

Find tours within 50km of a location:

```
/api/v1/tours/tours-within/50/center/30.0444,31.2357/unit/km
```

---

## 🧠 What I Learned

* Writing clean and scalable backend architecture
* Working with MongoDB advanced features
* Securing Node.js applications
* Handling errors properly with custom classes
* Structuring real-world RESTful APIs

---

## 📌 Future Improvements

* 🧾 Add payment integration
* 📱 Build frontend (React / Next.js)
* 📦 Dockerize the app
* ☁️ Deploy to cloud (AWS / Vercel)

---

## 🤝 Contributing

Feel free to fork this repo and submit pull requests!

---

## 📄 License

This project is for educational purposes only.

---

## 👨‍💻 Author

Developed by Omar Gamal 🚀
