# 🎁 GiftNest — Thoughtful Gifting Store + Admin CMS

A production-style, full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) web application designed for curated, personalized, and occasion-based gifts. Features a customer storefront with end-to-end cart & checkout operations alongside a dedicated, role-protected Admin CMS portal.

---

## 🌟 Key Features

### 🛒 Customer Storefront
* **Dynamic Hero Carousel**: Responsive promotional banners with headlines, CTAs, and trust metrics managed from CMS.
* **Gift Categories**: Curated collections (Birthday, Anniversary, Wedding, Corporate, Festival, Personalised Gifts) with direct category filtering.
* **Featured Gifts**: Handcrafted gift highlights marked by admins in real time.
* **Occasions Section**: Interactive tabbed navigation across major celebrations (Birthday, Anniversary, Wedding, Festival, Corporate).
* **Search & Filter Catalog**:
  * Full-text search by title or description via backend REST API.
  * Filter by category and occasion.
  * Price sorting: *Price: Low to High*, *Price: High to Low*, *Newest Arrivals*.
  * Pagination with dynamic page buttons and item counts.
  * Graceful loading skeletons, empty states, and error handling.
* **Multi-Image Product Showcase**:
  * Active thumbnail gallery switcher.
  * Price, description, occasion, category tags.
  * Stock count tracker and "Out of Stock" state prevention.
  * Quantity selector bounded strictly by available inventory.
* **Persistent Shopping Cart**:
  * Cart state preserved in `localStorage` across page refreshes.
  * Quantity adjustments with inventory clamping.
  * Subtotal calculation and automatic Free Delivery qualification indicator (orders over $50).
* **Checkout & Direct Gifting Workflow**:
  * Recipient address collection (Name, Phone, Address, City, State, Pincode).
  * Handwritten personalized greeting note inscription.
  * Delivery date selection for scheduled milestone surprises.
  * Stock deduction upon order placement.
  * Interactive celebration confirmation page with reference Order ID.
* **Customer Profile & Order History**:
  * Real authentication (JWT + bcrypt).
  * Profile displays member name, email, join date, and total order count.
  * Order timeline tracker (*Pending → Confirmed → Packed → Shipped → Delivered*).
  * Strict customer privacy: users can only view their own orders and profile.

### 🛡️ Dedicated Admin CMS Portal
* **Role-Based Authorization (RBAC)**: Secure gatekeeper ensuring only accounts with `role: "admin"` can access `/admin/*` routes and administrative APIs.
* **Analytical Dashboard Overview**:
  * Metric summary cards: Total Products, Total Orders, Total Customers, Total Categories.
  * Real-time Low Stock alert table (products with stock ≤ 5).
  * Recent customer orders list with instant status badges.
* **Product Management**:
  * Full CRUD (Create, Read, Update, Delete with confirmation modal).
  * Multiple image URLs, occasion assignment, price, inventory count, and featured toggle.
* **Category Management**:
  * Create, edit, and delete gift categories with live product count badges.
* **Order Operations & Fulfillment**:
  * Status updater (*Pending, Confirmed, Packed, Shipped, Delivered, Cancelled*).
  * Detailed modal breakdown showing recipient address, contact phone, ordered items, and custom greeting card inscription.
  * Cancelling an order automatically restores inventory back to product stock.
* **Banners & Promotions CMS**:
  * Add, edit, delete, and toggle active status for homepage carousel slides.
* **Gallery CMS**:
  * Manage real gifting snapshots with image URL preview, caption, category tag, and public visibility toggle.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router v7, Tailwind CSS, Axios, Lucide Icons, Vite |
| **Backend** | Node.js, Express.js, RESTful APIs, Morgan HTTP logger |
| **Database** | MongoDB, Mongoose ODM |
| **Security** | JSON Web Tokens (JWT), bcryptjs password hashing, CORS, input sanitization |

---

## 🏗️ Architecture & Folder Structure

GiftNest uses a clean, modular architecture separating the client application from the backend API:

```
gifts/
├── client/                     # Frontend Single Page Application (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # AdminSidebar, AdminHeader, StatCard
│   │   │   ├── common/         # Navbar, Footer, Modal, Toast, Badge, Pagination, LoadingSkeleton
│   │   │   └── customer/       # HeroBanner, ProductCard, CategoryCard, OccasionSection, GallerySection
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # User session, JWT tokens, RBAC roles
│   │   │   └── CartContext.jsx # Shopping cart persistence & stock checks
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx  # Customer storefront layout
│   │   │   └── AdminLayout.jsx # Role-guarded Admin CMS layout
│   │   ├── pages/
│   │   │   ├── admin/          # Dashboard, Products, Categories, Orders, Banners, Gallery, Login
│   │   │   └── customer/       # Home, Shop, ProductDetails, Cart, Checkout, Success, Profile, Orders, Auth
│   │   ├── services/
│   │   │   └── api.js          # Configured Axios instance with Bearer interceptors
│   │   ├── utils/
│   │   │   └── formatters.js   # Currency, date, and badge styling utilities
│   │   ├── App.jsx             # Route definitions & guards
│   │   ├── index.css           # Tailwind configuration & typography
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend REST API Server (Node + Express)
│   ├── config/
│   │   └── db.js               # Mongoose MongoDB connection
│   ├── controllers/            # Business logic handlers
│   │   ├── authController.js
│   │   ├── bannerController.js
│   │   ├── categoryController.js
│   │   ├── galleryController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect & adminOnly middleware
│   │   └── errorMiddleware.js  # Centralized JSON error handler
│   ├── models/                 # Mongoose schemas
│   │   ├── Banner.js
│   │   ├── Category.js
│   │   ├── Gallery.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/                 # API endpoints
│   ├── seed.js                 # Realistic demo data populator
│   ├── server.js               # Express application entry point
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root developer scripts
└── README.md
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/giftnest
JWT_SECRET=giftnest_super_secret_jwt_key_2026_intermediate_internship
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_URL=/api
```

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** running locally on port `27017` or a MongoDB Atlas connection string.

### 2. Install Dependencies
Run in the respective directories:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Seed Database
Populate categories, curated gifts, banners, gallery items, and demo accounts:
```bash
cd server
npm run seed
```

### 4. Run the Application
Run the backend and frontend in separate terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm start
# Server listens on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# Frontend dev server starts at http://localhost:5173
```

---

## 🔐 Credentials for Local Testing

| Role | Email | Password | Portal Location |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@giftnest.com` | `Admin@12345` | `/admin/login` |
| **Customer** | `customer@giftnest.com` | `Customer@12345` | `/login` |

> [!TIP]
> Both the customer `/login` and admin `/admin/login` pages provide one-click **"Demo Quick Fill"** buttons for evaluator testing.

---

## 📡 REST API Reference

### Authentication
* `POST /api/auth/register` — Register a new customer
* `POST /api/auth/login` — Authenticate and return signed JWT token
* `GET /api/auth/me` *(Protected)* — Get current user's profile and order count

### Products
* `GET /api/products` — Retrieve products (supports `search`, `category`, `occasion`, `sort`, `page`, `limit`, `featured`)
* `GET /api/products/:id` — Retrieve single product details
* `POST /api/products` *(Admin)* — Create new product
* `PUT /api/products/:id` *(Admin)* — Update existing product
* `DELETE /api/products/:id` *(Admin)* — Remove product

### Categories
* `GET /api/categories` — List all categories with product counts
* `POST /api/categories` *(Admin)* — Create category
* `PUT /api/categories/:id` *(Admin)* — Update category
* `DELETE /api/categories/:id` *(Admin)* — Delete category

### Orders
* `POST /api/orders` *(Customer)* — Place new order and decrement inventory
* `GET /api/orders/my-orders` *(Customer)* — Retrieve authenticated user's order history
* `GET /api/orders/:id` *(Customer/Admin)* — Retrieve order details (guarded strictly by ownership)
* `GET /api/orders` *(Admin)* — List all customer orders
* `PATCH /api/orders/:id/status` *(Admin)* — Update order status (*Pending, Confirmed, Packed, Shipped, Delivered, Cancelled*)
* `GET /api/orders/dashboard/stats` *(Admin)* — Fetch summary KPIs and low stock alerts

### Banners & Gallery CMS
* `GET /api/banners` — Get active banners (`?all=true` for admin)
* `POST /api/banners` *(Admin)* — Create banner
* `PUT /api/banners/:id` *(Admin)* — Update banner / toggle status
* `DELETE /api/banners/:id` *(Admin)* — Delete banner
* `GET /api/gallery` — Get active gallery photos
* `POST /api/gallery` *(Admin)* — Add gallery photo
* `PATCH /api/gallery/:id/status` *(Admin)* — Toggle gallery visibility
* `DELETE /api/gallery/:id` *(Admin)* — Delete gallery photo

---

## 🧪 Verification & Automated Testing

Run the included end-to-end API test suite:
```bash
node test_api.js
```
The suite runs 16 automated checks validating:
- Database connectivity & health
- Public catalog listings & search
- Authentication & JWT issuance
- RBAC security checks (401/403 access control)
- Order placement, stock deduction, and status transitions
- Admin CRUD operations

---

## 🔮 Future Scope
- Integration with third-party courier APIs (FedEx / DHL tracking webhooks).
- PDF invoice generation for customers.
- Wishlist and gift registry sharing links.
