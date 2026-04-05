# 💰 Finance Tracker (Personal Project)

![CI](https://github.com/gouravkhurana10/finance-tracker/actions/workflows/ci.yml/badge.svg)

A full-stack Personal Finance Tracker web application built with Java Spring Boot and React. Features JWT authentication, interactive dashboards with charts, transaction management, Docker containerization, and a comprehensive automated test suite.

🌐 **Live Demo:** [https://finance-tracker-project.up.railway.app](https://finance-tracker-project.up.railway.app)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Docker](#docker)
- [CI/CD Pipeline](#cicd-pipeline)

---

## Features

- **JWT Authentication** — Secure user registration and login with JSON Web Tokens
- **Transaction Management** — Create, read, update, and delete income and expense transactions
- **Interactive Dashboard** — Real-time balance, income, and expense summaries with Chart.js visualizations
- **Category Filtering** — Filter transactions by type (Income/Expense) and category
- **Responsive Design** — Mobile-friendly UI built with Bootstrap 5
- **Data Persistence** — MySQL database with Spring Data JPA and Hibernate
- **Containerized** — Fully Dockerized with Docker Compose for local development
- **Automated Testing** — 30 automated tests across Playwright E2E and Jest unit testing layers
- **CI/CD Pipeline** — GitHub Actions automatically runs all tests on every push

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Programming language |
| Spring Boot 3.x | Backend framework |
| Spring Security | Authentication & authorization |
| JWT (JSON Web Tokens) | Stateless authentication |
| Spring Data JPA | Database ORM |
| Hibernate | Object-relational mapping |
| MySQL 8.0 | Relational database |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| JavaScript (ES6+) | Programming language |
| Bootstrap 5 | Responsive styling |
| Chart.js | Data visualization |
| Axios | HTTP client |
| React Router DOM | Client-side routing |
| Vite | Build tool |

### Testing
| Technology | Purpose |
|---|---|
| Playwright | E2E browser testing |
| Jest/Vitest | React component unit testing |
<!-- | JUnit 5 | Java unit testing |
| Mockito | Java mocking framework | -->

### DevOps
| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| GitHub Actions | CI/CD pipeline |
| Railway | Cloud deployment |
| Nginx | Production web server |

---

## Architecture
```
┌─────────────────────────────────────────────────────┐
│                    Client Browser                   │
└─────────────────────┬───────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────────┐
│              React Frontend (Nginx)                 │
│         https://finance-tracker-project             │
│                  .up.railway.app                    │
└─────────────────────┬───────────────────────────────┘
                      │ REST API + JWT
┌─────────────────────▼───────────────────────────────┐
│           Spring Boot Backend (Java 17)             │
│       https://finance-tracker-production            │
│              -4fa1.up.railway.app                   │
└─────────────────────┬───────────────────────────────┘
                      │ JDBC
┌─────────────────────▼───────────────────────────────┐
│                MySQL Database                       │
│            Railway Managed MySQL 8.0                │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17
- Node.js 20+
- MySQL 8.0
- Maven
- Docker Desktop (optional)

### Running Locally

**1. Clone the repository:**
```bash
git clone https://github.com/gouravkhurana10/finance-tracker.git
cd finance-tracker
```

**2. Set up the database:**
```bash
mysql -u root -p
CREATE DATABASE finance_tracker;
```

**3. Start the backend:**
```bash
cd finance-tracker-backend
mvn spring-boot:run
```

**4. Start the frontend:**
```bash
cd finance-tracker-frontend
npm install
npm run dev
```

**5. Open your browser:**
```
http://localhost:5173
```

### Running with Docker
```bash
docker-compose up --build
```

Open `http://localhost` in your browser.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Transactions (Protected endpoints — requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Create a transaction |
| PUT | `/api/transactions/{id}` | Update a transaction |
| DELETE | `/api/transactions/{id}` | Delete a transaction |
| GET | `/api/transactions/dashboard` | Get dashboard summary |
| GET | `/api/transactions/type/{type}` | Filter by type |
| GET | `/api/transactions/category/{category}` | Filter by category |
| GET | `/api/transactions/date-range` | Filter by date range |

---

## Testing

This project includes **30 automated tests** across two testing layers:

### Frontend Unit Tests (Jest/Vitest) — 15 tests
```bash
cd finance-tracker-frontend
npm run test
```

| Test ID | Description | Technique |
|---|---|---|
| UT01-UT05 | Login component tests | Component testing |
| UT06-UT10 | Register component tests | Component testing |
| UT11-UT15 | AuthContext tests | State testing |

### E2E System Tests (Playwright) — 15 tests
```bash
cd finance-tracker-frontend
npx playwright test --ui
```

| Test ID | Description | Black-box Test Technique |
|---|---|---|
| EP01-EP06 | Authentication flows | Equivalence Partitioning |
| SW01-SW04 | Transaction workflows | State Transition Testing |
| BVA01 | Amount boundary validation | Boundary Value Analysis |
| FT01-FT03 | Filter functionality | Functional Testing |
| NAV01 | Navigation and logout | State Transition Testing |

---

## Docker

The application is fully containerized with three services:
```bash
# Start all services
docker-compose up --build

# Stop all services
docker-compose down

# Stop and wipe database
docker-compose down -v
```

| Service | Image | Port |
|---|---|---|
| Frontend | Custom Nginx + React | 80 |
| Backend | Custom Java 17 | 8080 |
| Database | MySQL 8.0 | 3307 |

---

## CI/CD Pipeline

GitHub Actions automatically runs on every push to `main`:
```
Push to GitHub
      ↓
Jest Unit Tests (15 tests)
      ↓ passes
Playwright E2E Tests (15 tests)
      ↓ passes
Green checkmark ✅
```

View the pipeline: [GitHub Actions](https://github.com/gouravkhurana10/finance-tracker/actions)

---

## Author

**Gourav Khurana**
- Portfolio: [gouravportfolio.com](https://gouravportfolio.com)
- GitHub: [@gouravkhurana10](https://github.com/gouravkhurana10)
- LinkedIn: [linkedin.com/in/gourav-khurana](https://linkedin.com/in/gourav-khurana)
