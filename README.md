# SkillMesh — AI-Assisted Peer Learning Network

> **MIT ACSC TYBCA Semester V Field Project**  
> *Production-Minded, Full-Stack Academic Web Application*

SkillMesh is an AI-assisted peer-to-peer learning network designed for college students. Students can teach competencies they know, request mentorship in target topics, discover compatible learning partners, schedule conflict-free learning sessions, collaborate on practical exercises, and build a verifiable portfolio of their learning achievements.

At its core, SkillMesh is powered by a **Directed Skill Prerequisite Graph** and a deterministic **Reciprocal Matching Engine**.

---

## 🌟 Key Features

1. **Deterministic Reciprocal Matching Engine:**
   - Detects direct mutual skill exchanges (Student A teaches Flutter to B, while Student B teaches SQL to A).
   - Identifies one-way mentor candidates.
   - Discovers multi-person exchange loops ($A \to B \to C \to A$) using bounded DFS cycle traversal.
   - Provides transparent weighted scoring (Skill 40%, Goal 20%, Availability 15%, Format 10%, Reciprocal 10%, Capacity 5%).
   - Generates stored data-derived structured explanations for every recommendation.

2. **Interactive Directed Skill Graph:**
   - Visual SVG-based prerequisite graph generated dynamically from database records.
   - Prevents cyclical prerequisite dependencies.
   - Detects missing prerequisite knowledge when learners set ambitious goals.

3. **Conflict-Free Session Scheduling:**
   - Validates time intervals to reject overlapping bookings for students.
   - Tracks outcomes, session notes, and practical deliverable URLs (e.g. GitHub repos).
   - Collects 1–5 star peer reviews with rubric criteria.

4. **Personalized Learning Workspace:**
   - Milestone progress roadmaps with interactive completion checklists.
   - Practice exercise generator with hints, rubrics, and revealable reference solutions.
   - Deterministic template fallback when external AI API keys are not configured.

5. **College Coordinator & Admin Dashboards:**
   - Aggregate skill demand vs teaching capacity analytics.
   - Insufficient support deficit detection (flagging skills where $\text{Learners} > \text{Mentors}$).
   - Privacy-safe aggregate exports (protecting individual student identities).
   - Role-based moderation and user account status controls.

---

## 🏗️ Technology Stack

- **Frontend:**
  - React 18, Vite, JavaScript (JSX), React Router v6
  - Plain CSS with design system variables (**Strictly No Tailwind CSS**)
  - Lucide React icons
  - Fetch API with HTTP-only cookies (`credentials: 'include'`)
  - Vitest + React Testing Library + jsdom
- **Backend:**
  - Node.js (ES modules), Express.js REST API
  - MongoDB & Mongoose ODM
  - Embedded `mongodb-memory-server` fallback for zero-setup local execution & MongoDB Atlas support
  - JWT authentication using secure, HTTP-only cookies
  - bcryptjs password hashing
  - Zod request parameter & body validation
  - Helmet security headers, CORS, and Express rate limiting
  - Vitest + Supertest integration testing

---

## 📋 Prerequisites

- **Node.js:** v18.0.0 or higher (Tested on Node v24)
- **npm:** v9.0.0 or higher
- *(Optional)* **Docker Compose** or a local/remote MongoDB instance (SkillMesh automatically initializes an embedded in-memory MongoDB instance if no external database is detected).

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies
Clone the repository and install all dependencies (workspace root, server, and client):

```bash
git clone <repo-url>
cd "d:/feild project"

# Install all monorepo packages
npm run install:all
```

*(Alternatively, install in subfolders individually)*:
```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 2. Environment Configuration
Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Default settings in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/skillmesh
JWT_SECRET=skillmesh-insecure-development-secret-key-32chars
JWT_EXPIRES_IN=7d
COOKIE_SECURE=false
CORS_ORIGIN=http://localhost:5173

# Optional AI Configuration (deterministic fallback used if empty)
AI_PROVIDER=fallback
AI_API_KEY=
AI_MODEL=
```

### 3. Seed Database with Realistic Demo Environment
Populate the database with the MIT ACSC curriculum taxonomy, prerequisite graph, demo students, active connections, and session history:

```bash
npm run seed
```

### 4. Run the Full-Stack Application
Start both the Express backend API and Vite client concurrently:

```bash
npm run dev
```

- **Client Application:** `http://localhost:5173`
- **Backend REST API:** `http://localhost:5000/api/v1`
- **Health Endpoint:** `http://localhost:5000/api/v1/health`

---

## 🧪 Testing & Validation

### Run Monorepo Test Suite
Runs all 25 automated unit and integration tests across backend and frontend:

```bash
npm run test
```

### Run Server Tests Individually
Tests authentication, Zod validation, role escalation defense, reciprocal matching, booking conflict rejection, and deterministic AI fallbacks:

```bash
npm run test:server
```

### Run Client Tests Individually
Tests React authentication views, 1-click evaluation shortcuts, match card rendering, and exchange proposal modals:

```bash
npm run test:client
```

---

## 🎬 Required End-to-End Demonstration Scenario

SkillMesh includes an automated end-to-end execution script verifying the complete 13-step scenario required for field project evaluation:

```bash
npm run demo
```

**Scenario Execution Steps:**
1. Student A registers and adds Flutter (teaching) & SQL (learning goal).
2. Student B registers and adds SQL (teaching) & Flutter (learning goal).
3. Both students set compatible Tuesday evening time slots.
4. Matching engine detects reciprocal compatibility (score: 97%).
5. Student A inspects recommendation and stored data-derived explanations.
6. Student A sends a reciprocal connection request.
7. Student B accepts the request; active learning connection is established.
8. They schedule a learning session.
9. System rejects an overlapping booking attempt with HTTP 409.
10. They complete the session and submit a 5-star review.
11. Student A records a practical deliverable URL.
12. Application updates verified progress metrics.
13. Faculty coordinator reviews completed session in college analytics.

---

## 🔑 Demo Credentials

| Role | Name | Email | Password | Academic Profile |
| :--- | :--- | :--- | :--- | :--- |
| **Student A** | Aarav Sharma | `aarav.sharma@mitacsc.ac.in` | `Student@123` | Teaches Flutter (Advanced), Learns SQL |
| **Student B** | Bhavya Patel | `bhavya.patel@mitacsc.ac.in` | `Student@123` | Teaches SQL (Advanced), Learns Flutter |
| **Student C** | Chirag Joshi | `chirag.joshi@mitacsc.ac.in` | `Student@123` | Teaches UI/UX Design, Learns Python |
| **Student D** | Divya Deshmukh | `divya.deshmukh@mitacsc.ac.in` | `Student@123` | Teaches Python, Learns React |
| **Student E** | Eshan Kulkarni | `eshan.kulkarni@mitacsc.ac.in` | `Student@123` | Teaches React, Learns UI/UX Design |
| **Coordinator** | Prof. Anjali Mehta | `coordinator@mitacsc.ac.in` | `Coordinator@123` | Faculty Project Coordinator |
| **Admin** | Administrator | `admin@mitacsc.ac.in` | `Admin@123` | System Administrator |

> **Tip:** The Login page includes **1-click quick-fill buttons** for instant evaluation of any demo account.

---

## 📦 Production Build & Deployment

### Build Client Bundle
Compiles clean HTML, CSS, and optimized JavaScript bundle into `client/dist`:

```bash
npm run build
```

### Run with Docker Compose
For environments with Docker:

```bash
docker-compose up -d
```
Starts MongoDB 7.0 on port `27017` with persistent volumes.

### MongoDB Atlas Configuration
In production, update `.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/skillmesh?retryWrites=true&w=majority
COOKIE_SECURE=true
NODE_ENV=production
```

---

## 🔒 Security & Privacy Implementation

- **HTTP-Only Cookies:** JWT tokens are stored in `skillmesh_token` cookies with `httpOnly: true`, preventing XSS token extraction.
- **Role Escalation Protection:** The registration endpoint hardcodes `role: 'student'`. Coordinator and Administrator roles can only be granted via protected administrative routes or secure seed scripts.
- **Privacy-Safe Analytics:** College analytics compute aggregate numbers across departments and skills; individual student contact details and private emails are excluded.
- **Input Validation & Sanitization:** All incoming requests are validated against strict Zod schemas.

---

## 📄 License & Attribution

Developed for **MIT ACSC TYBCA Semester V Field Project Evaluation**.
Designed with clean architecture and strict adherence to academic standards.
