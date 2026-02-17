# 🛒 Adaptive E-Commerce Platform with AI Recommendations

An **intelligent, adaptive e-commerce platform** that dynamically personalizes user experience using **AI-driven recommendations**, **real-time inventory & pricing updates**, and **modern design patterns**.
This project is built as an academic + professional case study demonstrating **software architecture, design patterns, and full-stack engineering**.

-
## 📌 Project Overview

This platform adapts its behavior at runtime based on:

* User interactions
* Inventory changes
* Pricing fluctuations
* Recommendation strategy performance

It integrates **AI recommendation engines**, **real-time communication**, and **pattern-oriented architecture** to deliver a scalable and maintainable solution.

---

## 🎯 Key Features

* 🤖 **AI-Powered Product Recommendations**
* 🔁 **Real-Time Inventory & Price Updates**
* 🧩 **Dynamic Product Enhancements (Badges, Discounts, AI Descriptions)**
* 🔔 **Factory-Based Notification System**
* ⚡ **WebSocket & Socket.IO Live Updates**
* 🧠 **Runtime Strategy Switching using Reflection**
* 🐳 **Fully Dockerized (Frontend + Backend + Redis)**

---

## 🏗️ System Architecture

### Architectural Pattern

**LAYERS with REFLECTION**

```
Presentation Layer  →  Business Layer  →  Data Access Layer
                             ↑
                     Reflection Layer
```

### Layers Explained

| Layer            | Responsibility                          |
| ---------------- | --------------------------------------- |
| Presentation     | React UI, real-time updates             |
| Business Logic   | Order processing, recommendations       |
| Data Access      | JPA/Hibernate repositories              |
| Reflection Layer | Runtime adaptation & strategy switching |

---

## 🧩 Design Patterns Used

### 1️⃣ Strategy Pattern – AI Recommendations

Used for interchangeable recommendation algorithms.

**Implementations**

* `CollaborativeFiltering`
* `ContentBasedFiltering`

**Context**

* `RecommendationEngine`
* `RecommendationStrategy`

📌 Allows runtime switching of recommendation logic.

---

### 2️⃣ Observer Pattern – Inventory & Pricing

Used for real-time inventory and price updates.

**Components**

* `InventoryManager` (Subject)
* `PriceManager`, `InventoryManager` (Observers)

📌 When stock changes, prices and UI update automatically.

---

### 3️⃣ Decorator Pattern – Product Enhancements

Used to dynamically add features to products.

**Decorators**

* `DiscountBadgeDecorator`
* `LowStockBadgeDecorator`
* `AIGeneratedDescriptionDecorator`

📌 Enhances product views without modifying base classes.

---

### 4️⃣ Factory Method Pattern – Notifications

Used for flexible notification creation.

**Factories**

* `NotificationFactory`
* `InboxNotificationFactory`

📌 Enables easy extension of notification types.

---

## 🧠 Reflection Layer (Adaptive Behavior)

The **Reflection Layer** enables:

* Runtime strategy switching
* Dynamic observer attachment
* Self-monitoring behavior adaptation

**Key Class**

* `AdaptiveController`

---

## 🖥️ Frontend Design (React)

### UI Layout

```
┌─────────────────────────────────────┐
│ Header (Search, Cart, Profile)      │
├─────────────────────────────────────┤
│ Hero (Personalized Recommendations)│
├─────────────────────────────────────┤
│ Categories │ Product Grid (Live)    │
├─────────────────────────────────────┤
│ Product Details (Decorators)        │
└─────────────────────────────────────┘
```

### Frontend Highlights

* React Context API (Cart & User state)
* Real-time updates via Socket.IO
* Component-based, testable UI
* AI integration via service layer

---

## 🧪 Testing

### Backend Tests

* Decorator Tests
* Factory Tests
* Observer Tests
* Strategy Tests
* Service Layer Tests

### Frontend Tests

* Component tests (`ProductCard`)
* Context tests (`cartContext`)
* AI service tests

---

## 📂 Project Structure

```
sukaina-shoaib-adaptive-ecommerce-platform-ai/
│
├── backend/        # Spring Boot Application
├── frontend/       # React Application
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

## ⚙️ Technologies Used

### Backend

* Java 17
* Spring Boot
* Hibernate / JPA
* Redis
* WebSocket
* Maven

### Frontend

* React.js
* Context API
* Socket.IO Client
* Axios

### AI & Realtime

* TensorFlow.js
* Socket.IO
* Redis Pub/Sub

### DevOps

* Docker
* Docker Compose
* Nginx

---

## 🐳 Running the Project with Docker (Recommended)

### ✅ Prerequisites

* Docker
* Docker Compose

---

### ▶️ Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/sukaina-shoaib-adaptive-ecommerce-platform-ai.git
cd sukaina-shoaib-adaptive-ecommerce-platform-ai
```

---

### ▶️ Step 2: Build & Run Containers

```bash
docker-compose up --build
```

---

### ▶️ Step 3: Access the Application

| Service     | URL                                            |
| ----------- | ---------------------------------------------- |
| Frontend    | [http://localhost:3000](http://localhost:3000) |
| Backend API | [http://localhost:8080](http://localhost:8080) |
| WebSocket   | ws://localhost:8080                            |
| Redis       | localhost:6379                                 |

---

### ▶️ Stop Containers

```bash
docker-compose down
```

---

## 🧪 Running Without Docker (Optional)

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📬 API Testing

* Import `Adaptive_Ecommerce.postman_collection.json` into **Postman**
* Test user, product, order, and recommendation APIs

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👩‍💻 Author

**Sukaina Shoaib**
Software Engineering Student
Case Study – Software Design & Architecture

---

## ⭐ Final Notes

This project demonstrates:

* Professional-grade architecture
* Clean pattern implementation
* Full-stack integration
* Industry-aligned best practices

