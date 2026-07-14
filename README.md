# 🧠 English Test Generator - Frontend

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Latest-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss)

A modern AI-powered English learning application that automatically generates personalized quizzes from any English text.

Users can paste an article, paragraph, or learning material, and the application analyzes the text and creates interactive exercises including vocabulary questions, translations, and definitions.

---

## 🚀 Live Demo

Frontend:

🔗 https://english-test-generator-frontend.vercel.app

Backend API:

🔗 https://english-test-generator-backend.onrender.com

---

# 📌 About The Project

English Test Generator is a full-stack educational platform designed to help users improve English vocabulary and comprehension.

The application transforms any English text into a personalized learning experience by extracting important words and generating different types of questions.

The goal of the project is to make English learning more interactive, efficient, and personalized.

---

# ✨ Features

## 📚 Text-Based Quiz Generation

- Paste any English text
- Automatically analyze the content
- Extract important vocabulary
- Generate quizzes based on the text

---

## 📝 Multiple Question Types

The application supports different learning exercises:

### Fill In The Blank

Example:

> I usually drink ___ in the morning.

Answer:

> coffee

---

### Translation Questions

Example:

Translate:

> "beautiful"

Answer:

> "գեղեցիկ"

---

### Definition Matching

Example:

Word:

> "Adventure"

Definition:

> An exciting experience or journey

---

## 🎯 Interactive Quiz Experience

Features:

- Step-by-step questions
- Answer selection
- Progress tracking
- Score calculation
- Final results page

---

## 🌍 Armenian Translation Support

The application includes English-to-Armenian translation functionality to help Armenian speakers learn vocabulary faster.

---

## 🔐 User Features

- User authentication
- Personalized quizzes
- Saved quiz history
- Protected routes

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | UI library |
| TypeScript | Type safety |
| Vite | Development environment |
| Tailwind CSS | Styling |
| Global state management |
| React Router | Navigation |
| Axios | API communication |
| React Hooks | Component logic |

---

## Backend

Backend repository:

```
Express.js
Node.js
MongoDB
Mongoose
Redis
JWT Authentication
```

---

# 📂 Project Structure

```
english-test-generator-frontend
│
├── public
│ └── Static public assets
│
├── src
│
│ ├── api
│ │ ├── auth.api.ts
│ │ ├── quiz.api.ts
│ │ ├── results.api.ts
│ │ └── users.api.ts
│ │
│ ├── assets
│ │ └── Brain.png
│ │
│ ├── components
│ │ │
│ │ ├── shared
│ │ │ ├── Footer.module.css
│ │ │ ├── Footer.tsx
│ │ │ ├── MainNavigation.module.css
│ │ │ └── MainNavigation.tsx
│ │ │
│ │ ├── AdminLayout.tsx
│ │ ├── AdminRoute.tsx
│ │ ├── Layout.tsx
│ │ └── QuestionCard.tsx
│ │
│ ├── config
│ │ └── api.config.ts
│ │
│ ├── hooks
│ │ ├── useAuth.ts
│ │ ├── useQuizContext.ts
│ │ ├── useTheme.ts
│ │ └── useTimer.ts
│ │
│ ├── pages
│ │ │
│ │ ├── admin
│ │ │ └── Admin pages
│ │ │
│ │ ├── AboutPage.module.css
│ │ ├── AboutPage.tsx
│ │ ├── ForgotPasswordPage.tsx
│ │ ├── HomePage.module.css
│ │ ├── HomePage.tsx
│ │ ├── LoginPage.module.css
│ │ ├── LoginPage.tsx
│ │ ├── QuizPage.tsx
│ │ ├── RegisterPage.tsx
│ │ ├── ResetPasswordPage.tsx
│ │ └── ResultsPage.tsx
│ │
│ ├── store
│ │ ├── AuthContext.tsx
│ │ ├── QuizContext.tsx
│ │ └── ThemeContext.tsx
│ │
│ ├── types
│ │ └── TypeScript interfaces and types
│ │
│ ├── App.tsx
│ ├── index.css
│ └── main.tsx
│
├── dist
│ └── Production build files
│
├── node_modules
│
├── .gitignore
│
├── eslint.config.js
│
├── index.html
│
├── package.json
│
├── package-lock.json
│
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
│
├── vite.config.ts
│
└── vercel.json
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/SarkisSanoyan/english-test-generator-frontend.git
```

Navigate into the project:

```bash
cd english-test-generator-frontend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start Development Server

```bash
npm run dev
```

Application will run on:

```
http://localhost:5173
```

---

# 📜 Available Scripts

## Development

```bash
npm run dev
```

Runs development server.

---

## Production Build

```bash
npm run build
```

Creates optimized production build.

---

## Preview Build

```bash
npm run preview
```

Preview production build locally.

---

# 🔄 Application Flow

```
User enters English text
          |
          ↓
Frontend sends request to API
          |
          ↓
Backend analyzes text
          |
          ↓
Words and questions generated
          |
          ↓
Quiz displayed to user
          |
          ↓
User completes quiz
          |
          ↓
Results displayed
```

---

# 🎨 UI Features

- Responsive design
- Mobile-friendly layout
- Modern educational interface
- Interactive quiz cards
- Clean user experience

---

# 🚀 Deployment

The frontend is deployed using:

## Vercel

Deployment process:

1. Connect GitHub repository
2. Select Vite framework
3. Add environment variables
4. Deploy

Every push to the main branch automatically triggers a new deployment.

---

# 🔮 Future Improvements

Possible future features:

- AI-generated explanations
- Speaking practice
- Audio pronunciation
- Vocabulary flashcards
- User learning statistics
- Difficulty levels
- Daily challenges
- Social learning features

---

# 🧪 Testing

Testing is planned for future versions.

Possible technologies:

- Vitest
- React Testing Library
- Cypress

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.
