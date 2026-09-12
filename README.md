# Skill Exchange

Skill Exchange is a full-stack web application built around the idea of learning and teaching skills through a peer-to-peer exchange system.

The platform allows users to create a profile, add the skills they can teach, add the skills they want to learn, and find other users with matching skills.

Instead of paying directly for every learning session, the application uses a credit system. Users can use their credits to learn from others, while users who teach can receive credits for completed sessions.

The project is being developed using Java and Spring Boot for the backend, React for the frontend, and PostgreSQL for data storage.

## How it works

The basic idea behind the platform is:

```text
User
  ↓
Create Account
  ↓
Verify Email
  ↓
Login
  ↓
Create / Update Profile
  ↓
Add Teaching Skills
  ↓
Add Learning Skills
  ↓
Find Matching Users
  ↓
Send Exchange Request
  ↓
Request Accepted
  ↓
Exchange Created
  ↓
Teacher Schedules Session
  ↓
Learning Session
  ↓
Session Completion
  ↓
Credit Transfer
```

The actual learning session can be conducted using an external meeting platform such as Google Meet or Zoom. Skill Exchange stores the session information and meeting link but does not provide its own video calling system.

## Features

### Authentication

* User registration
* Email OTP verification
* Login
* JWT-based authentication
* Password reset
* Protected API endpoints
* Spring Security integration

### User and Skills

* User profile management
* Add skills that the user can teach
* Add skills that the user wants to learn
* View available skills
* Find users based on skill requirements

### Matching

The application compares the skills users want to learn with the skills other users can teach.

This helps users find potential learning partners instead of searching manually through the entire platform.

### Exchange Requests

Users can send requests to other users for a particular skill.

The receiver can:

* Accept the request
* Reject the request

When a request is accepted, it can be used to create an exchange between the two users.

### Exchange

An exchange connects the learner, teacher, and requested skill.

The exchange keeps track of the current state and the users involved in the learning process.

### Session Scheduling

The teacher can schedule a learning session for an exchange.

A scheduled session contains information such as:

* Date
* Start time
* End time
* Meeting platform
* Meeting link
* Optional notes

The application validates the session details before saving them.

### Credits

The platform uses credits for the exchange system.

The current rate is:

```text
1 hour = 5 credits
```

For example:

```text
30 minutes = 2.50 credits
1 hour     = 5 credits
2 hours    = 10 credits
```

The credit amount is stored using `BigDecimal` so fractional values can be handled accurately.

Credits are transferred as part of the session completion process rather than when the exchange request is first created.

## Technology Stack

### Backend

* Java
* Spring Boot
* Spring MVC
* Spring Data JPA
* JDBC
* REST APIs
* Spring Security
* JWT
* Maven

### Frontend

* React
* JavaScript
* Vite
* HTML
* CSS

### Database

* PostgreSQL

### Other Tools

* Git
* GitHub
* Docker
* Docker Compose
* Postman
* IntelliJ IDEA

## Project Structure

The repository contains two main applications: the Spring Boot backend and the React frontend.

```text
Skill-Exchange/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/
│   │               └── SkillExchange/
│   │                   ├── auth/
│   │                   ├── config/
│   │                   ├── credits/
│   │                   ├── dashboard/
│   │                   ├── exception/
│   │                   ├── exchange/
│   │                   ├── notification/
│   │                   ├── review/
│   │                   ├── security/
│   │                   ├── skill/
│   │                   └── user/
│   │
│   ├── src/test/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Backend Structure

The backend is divided into separate packages so that different parts of the application have their own responsibilities.

```text
com.SkillExchange
│
├── auth
├── config
├── credits
├── dashboard
├── exception
├── exchange
├── notification
├── review
├── security
├── skill
└── user
```

The `auth` package handles authentication-related operations.

The `security` package contains the Spring Security and JWT-related implementation.

The `skill` and `user` packages handle user and skill-related functionality.

The `exchange` package contains the main exchange flow, including requests, exchanges, and sessions.

The `credits` package is responsible for credit-related operations and transactions.

The `dashboard` package is used for dashboard-related functionality.

The `exception` package contains application-specific exception handling.

The `review` and `notification` packages are part of the planned expansion of the application and are not currently treated as completed features.

## Frontend Structure

The React application is organized into different areas:

```text
src/
│
├── api/
├── components/
├── context/
├── pages/
├── routes/
├── styles/
├── App.jsx
└── main.jsx
```

`api` contains frontend code used to communicate with the backend.

`components` contains reusable React components.

`context` contains application-level React context such as authentication state.

`pages` contains the main application pages.

`routes` contains frontend routing and protected route handling.

`styles` contains the application's CSS files.

## Authentication Flow

The application uses JWT-based authentication with Spring Security.

The general flow is:

```text
User Login
    ↓
Backend verifies credentials
    ↓
JWT token generated
    ↓
Token returned to frontend
    ↓
Frontend sends token with protected requests
    ↓
Spring Security validates token
    ↓
Request is allowed
```

This keeps authentication separate from the application's business logic.

## Database

PostgreSQL is used as the relational database for the application.

The database stores information related to users, skills, exchange requests, exchanges, sessions, and credits.

Spring Data JPA is used for object-relational mapping and repository operations.

## Running the Project

### Requirements

Before running the project locally, install:

* Java 25
* Maven
* Node.js
* npm
* PostgreSQL
* Git
* Docker (optional)

### Backend

Open a terminal in the backend directory:

```bash
cd backend
```

Run the Spring Boot application:

```bash
mvnw spring-boot:run
```

On Windows, the Maven wrapper can also be run with:

```bash
mvnw.cmd spring-boot:run
```

The database configuration should be set according to the local environment.

### Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available through the Vite development server.

## Docker

The project also contains Docker configuration for running the application using containers.

The repository includes:

```text
backend/Dockerfile
frontend/Dockerfile
docker-compose.yml
```

Docker Compose can be used to run the configured services together.

## Environment Configuration

The project uses environment-specific configuration for sensitive values.

Do not commit real credentials to GitHub.

Sensitive information such as:

```text
Database passwords
JWT secrets
Email passwords
API keys
```

should be kept outside the repository.

A local `.env` file can be used for development, while an example configuration can be provided separately for other developers.

## Current Status

The main development flow is currently focused on authentication, user skills, matching, exchange requests, exchanges, session scheduling, and the credit system.

Completed or actively implemented areas include:

* Authentication
* Email verification
* JWT security
* User profiles
* Teaching skills
* Learning skills
* Skill discovery
* User matching
* Exchange requests
* Request actions
* Exchange creation
* Session scheduling
* Credit functionality

Some features are still under development.

## Planned Features

The following features are planned for future development:

* Reviews and ratings
* Notifications
* More dashboard functionality
* Improved exchange history
* Additional validation
* More comprehensive testing
* Production deployment
* Performance improvements
* Additional administrative functionality

## Why I built this project

I wanted to build a project that covers more than basic CRUD operations.

While working on Skill Exchange, I am getting practical experience with authentication, JWT, Spring Security, REST APIs, relational database design, JPA, React, frontend-backend communication, transactions, Docker, and Git.

The project is also helping me understand how different modules of a real application connect with each other.

## Future Direction

The idea can be expanded into a larger platform where users can build profiles around their skills, find suitable learning partners, schedule sessions, and maintain a history of their exchanges.

As the application grows, areas such as notifications, reviews, administration, monitoring, scalability, and deployment can be added.

## Author

**Tirupathi Gagan**

B.Tech — Computer Science and Engineering (Data Science)

GitHub: `gagantirupathi`

LinkedIn: `gagan-tirupathi-4617a03a4`

---

This project is being developed as a full-stack learning and portfolio project using Java, Spring Boot, React, and PostgreSQL.
