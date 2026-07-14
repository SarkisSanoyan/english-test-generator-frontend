Sure. Here is the complete `README.md` file in clean Markdown format. You can copy-paste it directly into your repository.

````md
# English Test Generator Backend 🚀

Backend API for an English learning platform that generates vocabulary quizzes from user-provided text.

The application processes English text, extracts important vocabulary words, generates different types of questions, and stores quizzes for learning and practice.

Built with **Node.js, Express.js, TypeScript, MongoDB, Redis, and JWT Authentication**.

---

## ✨ Features

## 🔐 Authentication & Authorization

- User registration and login
- JWT authentication
- Access and refresh token system
- Refresh token rotation
- Secure HTTP-only cookies
- Password hashing with bcrypt
- Protected routes
- Authentication middleware

---

## 📚 Quiz Generation

Users can submit English text and automatically generate vocabulary quizzes.

Supported question types:

- Fill-in-the-blank questions
- Word definition matching
- English → Armenian translation questions

Generated quizzes contain:

- Extracted vocabulary words
- Questions
- Answer options
- Correct answers
- Word references
- Quiz metadata

---

## 🗂 Database Management

MongoDB is used as the primary database.

Main collections:

- Users
- Quizzes
- Questions
- Words
- Text submissions

Technologies:

- MongoDB Atlas
- Mongoose ODM
- TypeScript models

---

## ⚡ Redis Integration

Redis is used for performance optimization and security.

Implemented features:

- API rate limiting
- Data caching
- Request optimization

Technologies:

- Redis
- Upstash Redis
- ioredis

---

## 🛡 Security Features

The backend includes:

- Helmet security middleware
- CORS configuration
- Rate limiting
- JWT verification middleware
- Zod validation
- Secure cookies
- Centralized error handling
- Environment variable protection

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- MongoDB
- Mongoose

## Authentication

- JSON Web Token (JWT)
- bcrypt
- Cookies

## Validation

- Zod

## Cache & Performance

- Redis
- Upstash Redis
- ioredis

## Development Tools

- ESLint
- Prettier
- Nodemon

## Deployment

- Docker
- Railway
- GitHub Actions

---

# 📁 Project Structure

```
src
│
├── config
│   ├── database.ts
│   ├── redis.ts
│   └── env.ts
│
├── controllers
│   ├── auth.controller.ts
│   ├── quiz.controller.ts
│   └── word.controller.ts
│
├── middleware
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── rateLimiter.middleware.ts
│
├── models
│   ├── User.ts
│   ├── Quiz.ts
│   ├── Question.ts
│   └── Word.ts
│
├── routes
│   ├── auth.routes.ts
│   ├── quiz.routes.ts
│   └── word.routes.ts
│
├── services
│   ├── auth.service.ts
│   ├── quiz.service.ts
│   └── email.service.ts
│
├── utils
│
├── app.ts
└── server.ts
```

---

# 🚀 Installation

## 1. Clone the repository

```bash
git clone https://github.com/SarkisSanoyan/english-test-generator-backend.git

cd english-test-generator-backend
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_token_secret

JWT_REFRESH_SECRET=your_refresh_token_secret

REDIS_URL=your_redis_connection_url

CLIENT_URL=http://localhost:5173

EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_username
EMAIL_PASSWORD=your_email_password
```

---

## 4. Run Development Server

```bash
npm run dev
```

The server will start:

```
http://localhost:5000
```

---

# 📌 API Documentation

## Authentication Routes

### Register User

```
POST /api/v1/auth/register
```

Example request:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Login User

```
POST /api/v1/auth/login
```

---

### Logout User

```
POST /api/v1/auth/logout
```

---

# Quiz Routes

## Generate Quiz

```
POST /api/v1/quizzes/generate
```

Example request:

```json
{
  "text": "Artificial intelligence is transforming modern education."
}
```

Example response:

```json
{
  "quizId": "12345",
  "questions": [
    {
      "type": "translation",
      "word": "education",
      "options": [
        "կրթություն",
        "տեխնոլոգիա"
      ]
    }
  ]
}
```

---

## Get Quiz

```
GET /api/v1/quizzes/:id
```

---

# 🔄 Authentication Flow

```
User Login
     |
     |
Generate Access Token
     |
     |
Generate Refresh Token
     |
     |
Store Refresh Token Securely
     |
     |
Access Protected Routes
```

---

# ⚡ Application Architecture

```
                 Frontend
                    |
                    |
                    ↓
             Express API
                    |
        -----------------------
        |                     |
        ↓                     ↓
    MongoDB               Redis
     Atlas              Upstash
```


---

# 🌍 Deployment

Production environment:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Cache: Redis Cloud

Deployment architecture:

```
Vercel Frontend
        |
        |
        ↓
Render Backend
        |
 ----------------
 |              |
MongoDB       Redis
Atlas         Upstash
```

---

# 🧪 Future Improvements

Planned features:

- AI-powered question generation
- User learning progress tracking
- Vocabulary statistics
- Difficulty levels
- Email verification
- Password reset functionality
- Swagger API documentation
- Automated testing
- CI/CD improvements




