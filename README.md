# 💳 miniBank Application

A full-stack mini banking system built with:

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Real-Time**: Socket.IO for live trade feed
- **Rate Limiting**: Sliding-window middleware (100 req/min per user)
- **Dockerized**: Backend and frontend using Docker Compose

---

## 🚀 Features

- JWT-based authentication (register & login)
- Wallet dashboard with balance and transaction logs
- Idempotent fund transfer with transaction safety
- Real-time trade feed using MongoDB change streams and WebSocket
- Rate limiter to prevent abuse (HTTP 429 on abuse)

---

## 📁 Folder Structure

```
.
├── miniBank-backend # Express backend
│ ├── server.js
│ └── ...other backend files
├── miniBank-frontend # React frontend
│ ├── package.json
│ └── ...other frontend files
├── docker-compose.yml
└── README.md
```

---

## 🧪 Prerequisites

- [Node.js v22.14.0+](https://nodejs.org/)
- [Docker & Docker Compose](https://docs.docker.com/compose/)
- [MongoDB v5.0.0](https://www.mongodb.com/docs/manual/)
- [ReactJS v19.1.0](https://react.dev/learn/)

---

## ⚙️ Environment Setup

### Create `.env` files:

#### `miniBank-backend/.env`

```env
PORT=5000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://localhost:27017/minibank
```

## 🐳 Run with Docker

- Step 1: Build and Start - `docker-compose up --build`
- Step 2: Access Application
  - Frontend: http://localhost:3000
  - Backend: http://localhost:5000

MongoDB: Containerized DB at mongo:27017

## 🐙 Docker File Structure

### `docker-compose.yml`

```yml
version: '3.8'

services:
  backend:
    build: ./miniBank-backend
    container_name: minibank-backend
    ports:
      - '5000:5000'
    environment:
      - MONGO_URI= your_mongo_url
      - JWT_SECRET= your_secret
    volumes:
      - ./miniBank-backend:/app
    restart: always

  frontend:
    build: ./miniBank-frontend
    container_name: minibank-frontend
    ports:
      - '3000:80'
    depends_on:
      - backend
    restart: always
```

## miniBank-backend/Dockerfile

```Docker
FROM node:22.14.0

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
```

## miniBank-frontend/Dockerfile

```Docker
FROM node:22.14.0

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

## 📬 API Endpoints

```api
Auth
POST /api/auth/register – User registration

POST /api/auth/login – User login

Wallet
GET /api/wallet – Get user wallet balance

Transaction
POST /api/transfer – Transfer funds (idempotent)

GET /api/transactions – Get last 50 transactions

Trade Feed (WebSocket)
Connect to: VITE_API_SOCKET_BASE_URL

event: tradeBatch – Receive real-time trades
```

## 🛡️ Rate Limiting

```text
Limit: 100 requests/minute per user

Middleware: Sliding window algorithm

Storage: MongoDB TTL index on timestamps

Response on exceed:

HTTP 429 Too Many Requests

Header: Retry-After: <seconds>
```

## 👨‍💻 Development Mode (without Docker)

#### `Backend`

```
cd miniBank-backend
npm install
npm run dev
```

#### `Frontend`

```
cd miniBank-frontend
npm install
npm run dev
```

## 🧼 Common Docker Commands

`Rebuild and start fresh`

```
docker-compose down -v
docker-compose up --build
```

## 📦 Build Frontend Only

```
cd miniBank-frontend
npm run build
```

## 🧹 Troubleshooting

- If MongoDB doesn't connect, check port 27017
- If rate limit blocks unexpectedly, clear DB or wait 60s
- Socket not connecting? Confirm VITE_API_SOCKET_BASE_URL
- **If you're using MongoDB in local then must use Replica Set**
