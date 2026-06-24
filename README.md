# TaskManager

A full-stack Task Manager application built with Node.js, Express.js, React (Vite), and Prisma ORM, following the MVC (Model-View-Controller) architecture. The application provides secure user authentication using JWT (JSON Web Tokens), and  input validation, task filtering, search functionality, and pagination for a smooth user experience.

# Features

 * User Registration and Login
 * JWT-based Authentication & Authorization
 * Create, Read, Update, and Delete (CRUD) Todo Tasks
 * Task Status Management (Pending / Completed)
 * Filter Tasks by:
       * All Tasks
       * Pending Tasks
       * Completed Tasks
 * Search Tasks by Title or Keyword
 * Pagination for Efficient Task Management
 * Protected Routes for Authenticated Users
 * Input Validation and Error Handling
 * Prisma ORM for Database Operations
 * MVC Architecture for Better Code Organization
 * RESTful API Design
 * Responsive React Frontend built with Vite used ant design
 * Secure Token Management

#Tech Stack

*** Backend ***
 Node.js
 Express.js
 Prisma ORM
 JWT Authentication
 Express Validator / Validation Middleware
 MVC Architecture
 
*** Frontend ***
 React.js
 Vite
 Axios
 React Router DOM
 Ant Design

# Project Structure

*Backend (MVC Pattern)*
backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── validations/
├── prisma/
├── dbConfig/
└── server.js

*Frontend*
frontend/
├── src/
│   ├── components/
│   ├── views/
│   ├── validations/
│   └── App.jsx
└── vite.config.js


*user registers or logs in *
<img width="1366" height="605" alt="Screenshot (1202)" src="https://github.com/user-attachments/assets/305f7455-5a2d-4df5-acb5-40dd51688f3a" />
<img width="1365" height="607" alt="Screenshot (1201)" src="https://github.com/user-attachments/assets/1befdd9c-6466-486c-85a8-f29c2f462b68" />

*users create tasks*
<img width="1365" height="594" alt="Screenshot (1197)" src="https://github.com/user-attachments/assets/69f03f0a-20eb-434e-aad1-722fab283c2a" />

*user views the tasks in table and card view*
<img width="1365" height="605" alt="Screenshot (1198)" src="https://github.com/user-attachments/assets/74b73aae-d1ce-43cc-a832-02a691f2dd89" />
<img width="1366" height="601" alt="Screenshot (1200)" src="https://github.com/user-attachments/assets/508ef63e-5a05-443b-94b5-85f42f3eb0f4" />








