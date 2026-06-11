# 🏋️ FitFlow – AI Personal Fitness Coach

FitFlow is a full-stack AI-powered fitness platform that helps users achieve their health goals through personalized workout plans, diet recommendations, progress tracking, and an AI fitness assistant.

---

## 🚀 Features

### 🔐 Authentication & User Management

* User Signup & Login
* JWT Authentication
* Protected Routes
* User Profile Management

### 💪 AI Workout Planner

* Generate personalized workout plans using AI
* Plans based on:

  * Weight
  * Height
  * Age
  * Fitness Goal
  * Experience Level
* Save workout history

### 🥗 AI Diet Planner

* Generate personalized diet plans using AI
* Supports:

  * Vegetarian
  * Non-Vegetarian
  * Vegan Diets
* Budget-based meal recommendations
* Diet history tracking

### 🤖 AI Fitness Chat Assistant

* Interactive fitness chatbot
* Answers workout, diet, and fitness-related questions
* Powered by OpenRouter AI Models

### 📈 Progress Tracker

* Weight tracking
* Fitness score calculation
* Goal progress monitoring
* BMI insights
* Weight prediction analytics
* Achievement badges
* Progress visualization using Recharts

### 📚 History Management

* Workout Plan History
* Diet Plan History
* Easy access to previously generated plans

### 🎨 Modern UI

* Responsive design
* Animated page transitions
* Toast notifications
* Particle background effects
* Mobile-friendly interface

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Recharts
* Framer Motion
* React Hot Toast
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### AI Integration

* OpenRouter API
* Google Gemma Models

---

## 📂 Project Structure

```bash
FitFlow/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── routes/
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/fitflow.git
cd fitflow
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

OPENROUTER_API_KEY=your_openrouter_api_key
```

Run Backend

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend

npm install

npm install framer-motion react-hot-toast recharts axios
```

Run Frontend

```bash
npm run dev
```

---

## 🌐 Environment Variables

### Backend

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
OPENROUTER_API_KEY=
```

---

## 📸 Screenshots

Add screenshots here:

![Dashboard](./src/assets/dashboard1.png)
![Dashboard](./src/assets/dashboard2.png)

![Workout Plan](./src/assets/workoutplan.png)

![Diet Plan](./src/assets/dietplan.png)

![AI Chat](./src/assets/aichat.png)

![Progress Tracker](./src/assets/progresstracker1.png)
![Progress Tracker](./src/assets/progresstracker2.png)


---

## 🎯 Future Enhancements

* Exercise Library API Integration
* Progress Photo Uploads
* Fitness Challenges & Leaderboards
* Wearable Device Integration
* AI Meal Scanner
* Voice-based AI Fitness Coach
* Social Fitness Community

---

## 👩‍💻 Author

**Vanshika Zawar**

Aspiring Full Stack Developer | AI Enthusiast

GitHub: https://github.com/vanshikazawar27

LinkedIn: https://www.linkedin.com/in/vanshikazawar/
---

## ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.
