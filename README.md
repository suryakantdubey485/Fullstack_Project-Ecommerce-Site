# Fullstack_Project-Ecommerce-Site (23BCS10129 & 23BCS10245)
# 🛒 Shophop — Modern E-Commerce Platform (MERN)

Shophop is a modern e‑commerce web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). All product prices are displayed in Indian Rupees (₹).

---

## Features

### User Features

* User signup and login system
* Browse products with search, categories, and sorting
* Product details page with image slider
* Shopping cart with localStorage persistence
* Checkout access only for logged-in users
* Address management (add, edit, delete multiple addresses)
* Checkout with saved or new addresses
* Order placement with confirmation
* User-specific order history
* Product reviews and ratings
* Recommended products section
* User profile page

### Admin Features

* Secure admin login
* Admin dashboard with statistics (products, orders, users, revenue)
* Add, edit, delete products
* Update order status

---

## Installation and Setup

### Requirements

* Node.js (v16 or higher)
* MongoDB (local installation or MongoDB Atlas)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (example values):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-ecommerce
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```
http://localhost:3000
```

---

## Design Overview

The project follows a clean, modern design focused on usability:

* Smooth animations and hover effects
* Gradient-based color theme
* Rounded cards and buttons
* Sticky navigation bar
* Fully responsive for all screen sizes
* Inter font family

---

## Default Credentials

**Admin**

* Username: `admin`
* Password: `admin123`

**User**

* No default user accounts. Users must register manually.

---

## Project Structure

```
mern-ecommerce/
├── backend/
│   ├── server.js
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── reviews.js
│   │   └── admin.js
│   └── data/
│       ├── products.json
│       ├── orders.json
│       └── admin.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── ProductDetails.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── OrderSuccess.jsx
    │   │   ├── OrderHistory.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Profile.jsx
    │   │   └── admin/
    │   ├── context/
    │   ├── App.jsx
    │   └── index.css
    └── vite.config.js
```

---

## API Endpoints

### Products

* `GET /api/products` – Fetch all products
* `GET /api/products/:id` – Fetch single product
* `POST /api/products` – Add new product (admin)
* `PUT /api/products/:id` – Update product (admin)
* `DELETE /api/products/:id` – Remove product (admin)

### Orders

* `GET /api/orders` – Fetch all orders
* `POST /api/orders` – Create a new order
* `PUT /api/orders/:id` – Update order status

### Reviews

* `GET /api/reviews/:id` – Get all reviews for a product
* `POST /api/reviews/:id` – Add a review

### Authentication

* `POST /api/auth/signup` – User registration
* `POST /api/auth/login` – User login
* `GET /api/auth/profile` – Get logged-in user details
* `POST /api/auth/address` – Add new address
* `PUT /api/auth/address/:id` – Update address
* `DELETE /api/auth/address/:id` – Delete address

### Admin

* `POST /api/admin/login` – Admin login

---

## Technologies Used

* **Frontend:** React 18, React Router, Vite, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Styling:** Custom CSS with gradients and transitions
* **Authentication:** JWT + bcrypt
* **Images:** Unsplash (CDN)

---

## Color Theme

* **Primary Gradient:** `#667eea → #764ba2`
* **Secondary Gradient:** `#f093fb → #f5576c`
* **Background:** `#f5f7fa → #c3cfe2`
* **Text Color:** `#1a202c`

---

## Additional Notes

* Cart data is saved in browser `localStorage`
* JWT token is stored in `localStorage` for authentication
* Products are seeded automatically from `products.json` during first run
* Order history is filtered per user
* Fully responsive frontend

---
