# FINAL YEAR MAJOR PROJECT SYNOPSIS

**Project Title:** GiftKart: An Intelligent Multi-Vendor Gifting & E-Commerce Platform  
**Domain:** Full-Stack Web Technologies & Distributed Systems  
**Technology Stack:** MERN Stack (MongoDB, Express.js, React.js, Node.js), Tailwind CSS, REST APIs, JWT, bcrypt  
**Academic Year:** 2025 – 2026  
**Candidate Name:** Vikash Kumar  
**Degree / Branch:** B.Tech / B.E. / BCA / MCA (Computer Science & Engineering / Information Technology)  

---

## 1. ABSTRACT
**GiftKart** is a modern, production-style, multi-vendor e-commerce web application engineered to bridge the gap between conventional commodity online marketplaces and specialized occasion-driven gifting. While standard e-commerce giants prioritize volume and generic logistics, they overlook critical nuances of gifting: bespoke laser engraving, custom handwritten calligraphy cards, luxury packaging (velvet boxes, floral wraps, wooden crates), target delivery date alignment for milestones, and dedicated recipient-based discovery.

GiftKart resolves these challenges through a high-performance MERN (MongoDB, Express.js, React.js, Node.js) architecture. The system incorporates three synchronized portals: an interactive **Customer Storefront & Gifting Studio**, a dedicated **Multi-Vendor Seller Operations Hub** for merchant listing and warehouse dispatch, and an **Admin CMS** for fleet logistics, catalog curation, and delivery milestone orchestration. The platform features 100% Indian localization with standard Rupee (₹ INR) pricing, pincode SLA delivery estimation across Indian states, realistic simulated multi-channel payments (UPI QR, RuPay, Net Banking, COD), and printable GST-compliant tax invoices.

---

## 2. PROBLEM STATEMENT & MOTIVATION
Modern online consumers face notable limitations when attempting to purchase and deliver commemorative gifts on generic retail platforms:
1. **Absence of Occasion-Specific Filtering:** Existing marketplaces treat gifts as standard retail SKU items, forcing users to manually sift through hundreds of irrelevant product listings without intuitive filters for Birthdays, Anniversaries, Weddings, or Festivals.
2. **Missing Emotional Personalization:** Mainstream platforms fail to provide real-time interactive previews for custom laser engravings, uploaded photo plaques, or handwritten greeting notes prior to checkout.
3. **Disconnect Between Sellers and Gifting Logistics:** Merchants lack unified dispatch workflows that generate consolidated gift-fulfillment packing slips and synchronized carrier AWB tracking numbers for time-sensitive surprise deliveries.
4. **High Complexity & Third-Party Lock-In:** Many specialized boutique gifting platforms rely on expensive proprietary SaaS solutions, making them inaccessible for local artisans and Indian sellers seeking transparent marketplace onboarding.

---

## 3. PROJECT OBJECTIVES
The core technical and functional objectives of the GiftKart project are:
* **Architect a Scalable MERN Web Platform:** Develop a robust, decoupled 3-tier architecture with React.js frontend, Express/Node.js RESTful API backend, and MongoDB document persistence.
* **Design a Dedicated Gifting Studio:** Construct an exclusive `/gifts` hub featuring a 3-step Smart Gift Finder Wizard (Occasion → Recipient → Budget in ₹ INR) that delivers instantaneous client-side and server-side matching.
* **Implement Role-Based Access Control (RBAC):** Provide secure JWT-based authentication for three distinct user roles: Buyers, Verified Sellers, and Platform Administrators with protected API routes.
* **Empower Multi-Vendor Marketplace Operations:** Enable merchants to onboard via an Indian GSTIN-validated portal, manage product catalogs (selling prices, MRPs, specifications, stock levels), and print warehouse fulfillment packing slips.
* **Simulate Real-World Indian Logistics & Payments:** Deliver an Ekart/BlueDart/Delhivery tracking simulator with public AWB lookup (`/track`), postal pincode delivery estimation, dynamic UPI QR scan-to-pay, card authorization, and GST invoices.

---

## 4. COMPARATIVE ANALYSIS: EXISTING VS. PROPOSED SYSTEM

| Feature / Capability | Existing Generic Marketplaces | GiftKart Proposed Solution |
| :--- | :--- | :--- |
| **Gifting Focus** | Generic retail catalog; gifts mixed with general commodities. | Dedicated Gifting Studio (`/gifts`) exclusively for milestone celebrations. |
| **Occasion Discovery** | Manual keyword searches; no guided recommendation engine. | Interactive 3-Step Smart Finder (Birthday, Anniversary, Wedding, Festive). |
| **Gift Customization** | Very rare; requires contacting third-party sellers off-platform. | Integrated engraving text, photo upload preview, handwritten card notes. |
| **Packaging Selection** | Standard brown corrugated cardboard box. | Luxury Velvet Box, Floral Wrap & Wax Seal, Handcrafted Wooden Crate. |
| **Seller Dispatch** | Opaque enterprise portals with heavy licensing fees. | Streamlined Seller Hub with 1-click warehouse packing slips and AWB assignment. |
| **Currency & Logistics** | Fragmented currency switchers and third-party tracking links. | Standard Indian Rupee (₹ INR), Pincode checker, Ekart/BlueDart AWB milestones. |

---

## 5. SYSTEM ARCHITECTURE & TECHNOLOGY STACK

### 3-Tier Layered Architecture
1. **Presentation Layer (Frontend):** Developed with React.js 19, Tailwind CSS, and Vite. Implements single-page application (SPA) routing with React Router DOM, responsive grid structures, and interactive states.
2. **Business Logic Layer (Server):** Node.js and Express.js REST API providing secure routing, controller logic, input validation, and JWT token authorization.
3. **Data Persistence Layer (Database):** MongoDB document database with Mongoose ODM modeling users, products, orders, categories, and logistics carriers.

### Technology Justification Table
* **Frontend:** React.js, Tailwind CSS, Vite, Axios, Lucide React
* **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), bcrypt.js
* **Database:** MongoDB Community / Atlas, Mongoose ODM
* **Development Tools:** Visual Studio Code, Git, GitHub, Postman, ReportLab

---

## 6. CORE FUNCTIONAL MODULES

1. **User Identity & Role-Based Security:** Provides self-service registration and login. Supports role privileges (`customer`, `seller`, `admin`) using authorization middleware that checks JWT payload headers.
2. **Dedicated Gifting Studio & Smart Finder (`/gifts`):** An exclusive discovery engine featuring Birthday Specials, Anniversary Keepsakes, Wedding Gifts, and Diwali Hampers. Features a 3-step interactive wizard filtering by Occasion, Recipient, and Budget in ₹ INR.
3. **Multi-Vendor Seller Operations Hub (`/seller/*`):** Allows Indian sellers to register with a 15-character GSTIN, manage live catalog inventory, configure selling prices vs MRPs, track order dispatch queues, and print Flipkart-style warehouse packing slips.
4. **Customization & Luxury Packaging Engine:** Allows buyers to configure personalized laser engraving text, recipient names, photo plaque previews, handwritten greeting card notes, and gift wrapping options (Kraft box, Floral Wrap, Royal Velvet, Wooden Crate).
5. **Indian Logistics & Fast-Track AWB Tracking (`/track`):** Integrated 6-digit Indian PIN code delivery SLA estimator (Bangalore, Mumbai, Delhi, Chennai, Kolkata), live transit timeline simulator for Ekart Logistics, BlueDart, Delhivery, and DTDC.
6. **Multi-Channel Indian Payment Gateway:** Simulated multi-method checkout supporting instant UPI QR scan & pay (GPay, PhonePe, Paytm), RuPay/Visa cards with 3DS OTP verification, Indian Net Banking (SBI, HDFC, ICICI, Axis), and Cash on Delivery (COD).
7. **Admin CMS & Operations Portal (`/admin/*`):** Full management of system categories, catalog products, buyer orders, delivery fleet assignments, status transitions, and GST-compliant printable tax invoices.

---

## 7. DATABASE SCHEMA DESIGN

* **User Schema:** `name, email, passwordHash, role, sellerProfile: {storeName, gstin, phone, address}`
* **Product Schema:** `name, category, price, mrp, stock, images, occasion, recipient, isGift, isAssured, seller`
* **Order Schema:** `user, items[], customization: {engraving, giftBox, greetingCard}, totalAmount, payment, tracking`
* **Category Schema:** `name, slug, description, image, isActive`
* **Carrier Schema:** `name, code, trackingPrefix, estimatedDays`

---

## 8. HARDWARE & SOFTWARE REQUIREMENTS

### Minimum Software Requirements
* **Operating System:** Windows 10/11, Ubuntu 20.04+, macOS 12+ (64-bit)
* **Runtime Environment:** Node.js (v18.x or v20+ LTS) and npm (v9.x+)
* **Database Management System:** MongoDB Community Server (v6.0+) or MongoDB Atlas
* **Web Browser:** Modern HTML5 browser (Google Chrome, Microsoft Edge, Mozilla Firefox)

### Minimum Hardware Requirements
* **Processor:** Dual-Core 2.0 GHz CPU (Intel / AMD) minimum (Quad-Core i5 / Ryzen 5 recommended)
* **RAM:** 4 GB RAM minimum (8 GB – 16 GB recommended)
* **Storage:** 10 GB free hard disk space (SSD recommended)

---

## 9. TESTING & VALIDATION METHODOLOGY
* **Unit & Component Verification:** Frontend React modules and UI subcomponents were verified for clean rendering and zero compiler warnings using Vite production builds (`npm run build`, 1697 modules transformed with zero errors).
* **RESTful API Integration Testing:** Developed comprehensive automated integration test suites validating user registration, seller GSTIN onboarding, product creation, catalog retrieval, cart persistence, order creation in ₹ INR, and public AWB tracking lookups.
* **Security & RBAC Validation:** Enforced and tested JWT authentication filters preventing unauthorized access to protected seller dashboard routes and administrative endpoints. Password hashes were verified using 10 bcrypt salt rounds.
* **Data Integrity & Currency Validation:** Verified strict Indian Rupee (₹ INR) localization, mathematical accuracy of MRP strike-through percentage discounts, packaging cost additions, and GST tax invoice breakdowns.

---

## 10. FUTURE ENHANCEMENTS
* **Automated Milestone Reminders:** Recurring calendar notifications for user birthdays and anniversaries via web push notifications.
* **Augmented Reality (AR) Gift Preview:** In-browser WebXR preview allowing customers to project custom engraved items and bouquets on their physical table before placing orders.
* **Multi-Lingual Regional Support:** Expanding UI internationalization into Hindi, Tamil, Telugu, and Bengali to broaden accessibility across Tier-2 and Tier-3 Indian cities.

---

## 11. CONCLUSION
The **GiftKart** project successfully demonstrates the design and engineering of a full-stack, enterprise-grade e-commerce application tailored specifically to the multi-vendor Indian gifting ecosystem. By combining a dedicated celebration Gifting Studio, a Flipkart-style merchant operations portal, realistic simulated Indian logistics and payment workflows, and strict Rupee localization, GiftKart surpasses standard academic demonstration projects and serves as an industry-ready final year engineering capstone. All code is structured following modern modular patterns, documented, and published to the Git repository for evaluation.
