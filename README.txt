SalesAI CRM ✨
An Intelligent, Full-Stack CRM Platform for High-Performance Sales Teams
SalesAI CRM is a complete, full-stack Customer Relationship Management tool built with the MERN stack (MongoDB, Express, React, Node.js). It features an AI-powered dashboard that provides intelligent lead scoring and actionable insights, all wrapped in a secure, modern, and fully responsive user interface.

🚀 Live Demo & Screenshots
➡️ View Live Demo (Link to Deployed App)

(A GIF or screenshot of the main dashboard would be placed here)SalesAI CRM Dashboard

Core Features
🧠 AI-Powered Dashboard: At-a-glance view of key metrics, conversion trends, and a dynamic sales pipeline. The AI Insights panel provides proactive recommendations, identifies "hot" leads, and flags overdue tasks.

🎯 Intelligent Lead Management: Leads are automatically scored based on various data points. Users can filter, search, and view detailed lead information. The system surfaces top-priority leads to maximize sales efficiency.

🔐 Secure User Authentication: A complete, secure authentication system with user registration and login functionality using JSON Web Tokens (JWT) for protected API routes.

📊 Comprehensive Activity Tracking: Log and manage all sales activities, including calls, emails, and meetings, linked directly to specific leads.

🧩 Modern & Component-Based UI: Built with React and styled with Tailwind CSS. The UI is composed of reusable, atomic components from shadcn/ui, ensuring a consistent, clean, and maintainable codebase.

🛠 Technology Stack
Category	Technologies
Backend	Node.js, Express, MongoDB, Mongoose, JSON Web Tokens (JWT), bcryptjs
Frontend	React, React Router, Vite
Styling	Tailwind CSS, PostCSS, radix-ui
UI Library	shadcn/ui (A component library built for composition)
Icons	lucide-react
Charts	recharts
🏗️ Architectural Overview
This project is a robust, full-stack application featuring a decoupled frontend and backend, which is a modern standard for web architecture.

Backend Architecture (/crm-backend)
The backend is a powerful and secure RESTful API built with Node.js and Express.

API Framework: Express.js provides the foundation for routing, middleware, and request handling.
Database: MongoDB is used as the NoSQL database, with Mongoose for elegant object data modeling (ODM), schema validation, and business logic.
Authentication: Secure, token-based authentication is implemented using JSON Web Tokens (JWT). User passwords are never stored in plaintext; they are hashed using bcrypt.js before being saved to the database. An authMiddleware function protects all sensitive API routes.
Modular Routes: The API features a clean, modular route structure, separating concerns for auth, leads, activities, and ai functionalities.
Frontend Architecture (/src)
The frontend is a dynamic and responsive Single Page Application (SPA) built with React.

Component-Driven UI: The UI is broken down into small, reusable components.
/components/ui: Generic, presentational "building block" components (Button, Card, Input).
/components/*: "Smart" components that compose UI blocks and contain business logic for specific features (e.g., LeadCard, MetricCard).
Client-Side Routing: React Router handles all routing, providing seamless navigation without page reloads. A protected route structure ensures that only authenticated users can access the main application, redirecting others to the login page.
State Management: Component-level state is managed with React Hooks (useState, useEffect). For API interactions, data is fetched and managed within the relevant page or component.
📂 Project Structure
/
├── crm-backend/
│   ├── models/           # Mongoose schemas (User.js, Lead.js, Activity.js)
│   ├── routes/           # API routes (auth.js, leads.js, activities.js)
│   ├── middleware/       # Custom middleware (auth.js)
│   ├── server.js         # Express server entry point
│   └── package.json      # Backend dependencies
│
└── src/ (Frontend)
    ├── App.jsx           # Main application router and auth state
    ├── main.jsx          # Application entry point
    ├── components/
    │   ├── ui/           # Reusable, generic UI components (Button, Card)
    │   ├── auth/         # Login and Register form components
    │   ├── dashboard/    # Components for the Dashboard page
    │   └── ...
    ├── pages/            # Top-level page components
    │   ├── Dashboard.jsx
    │   └── Leads.jsx
    └── entities/           # API service layer
🚀 Getting Started
Follow these steps to get the full-stack application running locally.

Prerequisites
Node.js (v18 or later)
npm or yarn
MongoDB (either running locally or a connection URI from a service like MongoDB Atlas)
1. Backend Setup
# Navigate to the backend directory
cd crm-backend

# Install backend dependencies
npm install

# Create a .env file in the crm-backend folder and add your variables:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_super_secret_jwt_key
# PORT=5001

# Start the backend server
npm run dev
The backend will be running on http://localhost:5001.

2. Frontend Setup
# From the root directory, navigate to the frontend directory
# (If you are in crm-backend, first run: cd ..)

# Install frontend dependencies
npm install

# Run the frontend development server
npm run dev
The frontend will open automatically at http://localhost:3000 (or another specified port). You can now register a new user and log in.

